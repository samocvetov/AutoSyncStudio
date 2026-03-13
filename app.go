package main

import (
	"bufio"
	"bytes"
	"context"
	_ "embed"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed ffmpeg.exe
var ffmpegBinary []byte

type App struct {
	ctx        context.Context
	processCtx context.Context
	cancelFn   context.CancelFunc
	ffmpegPath string
}

func NewApp() *App { return &App{} }

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.processCtx, a.cancelFn = context.WithCancel(ctx)
	a.ffmpegPath = filepath.Join(os.TempDir(), "autosync_ffmpeg.exe")
	os.WriteFile(a.ffmpegPath, ffmpegBinary, 0755)
}

func (a *App) shutdown(ctx context.Context) {
	exec.Command("taskkill", "/F", "/IM", "autosync_ffmpeg.exe", "/T").Run()
	if a.ffmpegPath != "" { os.Remove(a.ffmpegPath) }
}

func (a *App) CancelProcess() {
	if a.cancelFn != nil { a.cancelFn() }
	exec.Command("taskkill", "/F", "/IM", "autosync_ffmpeg.exe", "/T").Run()
}

type AssemblyUploadRes struct { UploadURL string `json:"upload_url"` }
type AssemblyTranscriptRes struct { ID string `json:"id"` }

// ДОБАВЛЕНО ПОЛЕ TEXT ДЛЯ РАСШИФРОВКИ
type AssemblyUtterance struct {
	Speaker string `json:"speaker"`
	Start   int    `json:"start"`
	End     int    `json:"end"`
	Text    string `json:"text"`
}

type AssemblyPollRes struct {
	Status     string              `json:"status"`
	Error      string              `json:"error"`
	Utterances []AssemblyUtterance `json:"utterances"`
}

type Chunk struct { Cam int; StartA float64; EndA float64 }

func (a *App) getVideoDuration(filePath string) float64 {
	cmd := exec.CommandContext(a.processCtx, a.ffmpegPath, "-i", filePath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	cmd.Run()
	timeRe := regexp.MustCompile(`Duration:\s+(\d{2}):(\d{2}):([\d\.]+)`)
	matches := timeRe.FindStringSubmatch(stderr.String())
	if len(matches) == 4 {
		h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
		return h*3600.0 + m*60.0 + s
	}
	return 0.1
}

func (a *App) getEnvelope(filePath string) ([]float64, error) {
	cmd := exec.CommandContext(a.processCtx, a.ffmpegPath, "-v", "error", "-i", filePath, "-vn", "-sn", "-dn", "-ac", "1", "-ar", "8000", "-f", "s16le", "pipe:1")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	var out bytes.Buffer
	cmd.Stdout = &out
	if err := cmd.Run(); err != nil { return nil, err }
	audioData := out.Bytes()
	chunkSize := 80
	numSamples := len(audioData) / 2
	envelope := make([]float64, 0, numSamples/chunkSize+1)
	var sum float64
	var count int
	for i := 0; i < len(audioData)-1; i += 2 {
		sample := int16(binary.LittleEndian.Uint16(audioData[i : i+2]))
		sum += math.Abs(float64(sample))
		count++
		if count == chunkSize {
			envelope = append(envelope, sum/float64(chunkSize))
			sum = 0
			count = 0
		}
	}
	var totalSum float64
	for _, val := range envelope { totalSum += val }
	mean := totalSum / float64(len(envelope))
	for i := range envelope { envelope[i] -= mean }
	return envelope, nil
}

func findDelay(envA, envV []float64) float64 {
	if len(envA) == 0 || len(envV) == 0 { return 0 }
	step := 10
	lenA_low := len(envA) / step
	envA_low := make([]float64, lenA_low)
	for i := 0; i < lenA_low; i++ {
		sum := 0.0
		for j := 0; j < step; j++ { sum += envA[i*step+j] }
		envA_low[i] = sum / float64(step)
	}
	lenV_low := len(envV) / step
	envV_low := make([]float64, lenV_low)
	for i := 0; i < lenV_low; i++ {
		sum := 0.0
		for j := 0; j < step; j++ { sum += envV[i*step+j] }
		envV_low[i] = sum / float64(step)
	}

	maxCorrLow := -1e10
	bestDelayLow := 0
	startK_low := -(lenV_low - 1)
	endK_low := lenA_low - 1
	for k := startK_low; k <= endK_low; k++ {
		startI := 0
		if k > 0 { startI = k }
		endI := lenA_low
		if lenV_low+k < lenA_low { endI = lenV_low + k }
		var sum float64
		for i := startI; i < endI; i++ { sum += envA_low[i] * envV_low[i-k] }
		if sum > maxCorrLow { maxCorrLow = sum; bestDelayLow = k }
	}

	approxDelay := bestDelayLow * step
	window := 200
	maxCorr := -1e10
	bestDelay := approxDelay
	startK := approxDelay - window
	if startK < -(len(envV)-1) { startK = -(len(envV)-1) }
	endK := approxDelay + window
	if endK > len(envA)-1 { endK = len(envA)-1 }

	for k := startK; k <= endK; k++ {
		startI := 0
		if k > 0 { startI = k }
		endI := len(envA)
		if len(envV)+k < len(envA) { endI = len(envV) + k }
		var sum float64
		for i := startI; i < endI; i++ { sum += envA[i] * envV[i-k] }
		if sum > maxCorr { maxCorr = sum; bestDelay = k }
	}
	return float64(bestDelay) / 100.0
}

func (a *App) SelectVideo() string { s, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{Title: "Выберите видео"}); return s }
func (a *App) SelectAudio() string { s, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{Title: "Выберите аудио"}); return s }
func (a *App) SelectDirectory() string { s, _ := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{Title: "Выберите папку для сохранения"}); return s }

// 1. ВКЛАДКА: СИНХРОНИЗАЦИЯ (ИИ + Расшифровка + Склейка)
func (a *App) RunSync(videoPath, audioPath, v2Path, v3Path string, apiKey string, mainCam int, outDir string) string {
	a.processCtx, a.cancelFn = context.WithCancel(a.ctx)
	defer a.cancelFn()

	t0 := time.Now()
	sendProgress := func(p int, m string) { runtime.EventsEmit(a.ctx, "sync_progress", map[string]interface{}{"percent": p, "message": m}) }
	
	os.MkdirAll(outDir, 0755)

	sendProgress(5, "Анализ файлов...")
	v1Env, err := a.getEnvelope(videoPath)
	if err != nil { return "❌ Ошибка или отмена процесса" }
	aEnv, err := a.getEnvelope(audioPath)
	if err != nil { return "❌ Ошибка или отмена процесса" }
	masterDur := float64(len(aEnv)) / 100.0

	var cloudUtterances []AssemblyUtterance
	
	if v2Path != "" || v3Path != "" {
		sendProgress(10, "Подготовка WAV для ИИ...")
		tempWav := filepath.Join(os.TempDir(), "ai_master.wav")
		exec.CommandContext(a.processCtx, a.ffmpegPath, "-y", "-i", audioPath, "-vn", "-ar", "16000", "-ac", "1", tempWav).Run()
		if a.processCtx.Err() != nil { return "❌ Процесс отменен!" }
		
		sendProgress(20, "Загрузка в AssemblyAI...")
		fData, _ := os.ReadFile(tempWav)
		req, _ := http.NewRequestWithContext(a.processCtx, "POST", "https://api.assemblyai.com/v2/upload", bytes.NewReader(fData))
		req.Header.Set("Authorization", apiKey)
		resp, err := (&http.Client{}).Do(req)
		if err != nil { return "❌ Отменено или ошибка сети" }
		
		var upRes AssemblyUploadRes
		json.NewDecoder(resp.Body).Decode(&upRes)

		sendProgress(35, "ИИ анализирует речь...")
		reqBody := fmt.Sprintf(`{"audio_url":"%s","speaker_labels":true,"language_code":"ru","speech_models":["universal-2"]}`, upRes.UploadURL)
		req2, _ := http.NewRequestWithContext(a.processCtx, "POST", "https://api.assemblyai.com/v2/transcript", strings.NewReader(reqBody))
		req2.Header.Set("Authorization", apiKey)
		req2.Header.Set("Content-Type", "application/json")
		resp2, _ := (&http.Client{}).Do(req2)
		var trRes AssemblyTranscriptRes
		json.NewDecoder(resp2.Body).Decode(&trRes)

		waitSec := 0
		for {
			select {
			case <-a.processCtx.Done(): return "❌ Процесс отменен пользователем!"
			case <-time.After(3 * time.Second):
			}
			waitSec += 3
			sendProgress(35, fmt.Sprintf("ИИ анализирует спикеров... (прошло %d сек)", waitSec))
			r, _ := http.NewRequestWithContext(a.processCtx, "GET", "https://api.assemblyai.com/v2/transcript/"+trRes.ID, nil)
			r.Header.Set("Authorization", apiKey)
			re, err := (&http.Client{}).Do(r)
			if err != nil { continue }
			var pollRes AssemblyPollRes
			json.NewDecoder(re.Body).Decode(&pollRes)
			re.Body.Close()
			
			if pollRes.Status == "completed" { 
				cloudUtterances = pollRes.Utterances
				
				// ФОРМИРУЕМ И СОХРАНЯЕМ ТЕКСТОВЫЙ ФАЙЛ С ДИАЛОГАМИ
				sendProgress(50, "Сохранение расшифровки диалогов...")
				var txtBuilder strings.Builder
				txtBuilder.WriteString("Расшифровка диалогов (AutoSync)\n====================================\n\n")
				for _, u := range cloudUtterances {
					sec := u.Start / 1000
					m := sec / 60
					s := sec % 60
					txtBuilder.WriteString(fmt.Sprintf("[%02d:%02d] Спикер %s: %s\n", m, s, u.Speaker, u.Text))
				}
				txtPath := filepath.Join(outDir, fmt.Sprintf("DIALOGUES_%s.txt", time.Now().Format("15-04-05")))
				os.WriteFile(txtPath, []byte(txtBuilder.String()), 0644)
				
				break 
			}
			if pollRes.Status == "error" { return "❌ Сбой ИИ: " + pollRes.Error }
		}
	}

	sendProgress(60, "Синхронизация потоков...")
	var v2Env, v3Env []float64
	var delay2, delay3 float64
	
	if v2Path != "" {
		v2Env, err = a.getEnvelope(v2Path)
		if err != nil { return "❌ Процесс отменен!" }
		delay2 = findDelay(aEnv, v2Env)
	}
	if v3Path != "" {
		v3Env, err = a.getEnvelope(v3Path)
		if err != nil { return "❌ Процесс отменен!" }
		delay3 = findDelay(aEnv, v3Env)
	}

	delay1 := findDelay(aEnv, v1Env)

	masterStart := delay1
	if v2Path != "" && delay2 < masterStart { masterStart = delay2 }
	if v3Path != "" && delay3 < masterStart { masterStart = delay3 }
	if masterStart < 0 { masterStart = 0 }

	spMap := make(map[string]int)
	next := 1
	for _, u := range cloudUtterances {
		if _, ok := spMap[u.Speaker]; !ok { spMap[u.Speaker] = next; next++; if next > 2 { next = 2 } }
	}

	type interval struct { s, e float64; cam int }
	var mainIntervals, guestIntervals []interval
	for _, u := range cloudUtterances {
		s, e := float64(u.Start)/1000.0, float64(u.End)/1000.0
		if spMap[u.Speaker] == mainCam {
			mainIntervals = append(mainIntervals, interval{s - 0.2, e + 1.5, mainCam})
		} else {
			guestIntervals = append(guestIntervals, interval{s - 0.4, e + 0.1, spMap[u.Speaker]})
		}
	}

	merge := func(arr []interval, gap float64) []interval {
		if len(arr) == 0 { return nil }
		sort.Slice(arr, func(i, j int) bool { return arr[i].s < arr[j].s })
		res := []interval{arr[0]}
		for i := 1; i < len(arr); i++ {
			l := &res[len(res)-1]
			if arr[i].s <= l.e+gap { if arr[i].e > l.e { l.e = arr[i].e } } else { res = append(res, arr[i]) }
		}
		return res
	}
	mainIntervals = merge(mainIntervals, 1.0)
	guestIntervals = merge(guestIntervals, 0.3)

	var evs []float64
	for _, v := range mainIntervals { evs = append(evs, v.s, v.e) }
	for _, v := range guestIntervals { evs = append(evs, v.s, v.e) }
	evs = append(evs, masterStart, masterDur)
	if delay1 > masterStart { evs = append(evs, delay1) }
	if v2Path != "" && delay2 > masterStart { evs = append(evs, delay2) }
	if v3Path != "" && delay3 > masterStart { evs = append(evs, delay3) }
	sort.Float64s(evs)

	var finalCuts []Chunk
	for i := 0; i < len(evs)-1; i++ {
		t1, t2 := evs[i], evs[i+1]
		if t1 < masterStart { t1 = masterStart }
		if t2 > masterDur { t2 = masterDur } 
		if t1 >= t2 { continue } 
		
		mid := (t1 + t2) / 2.0
		mainAct, guestAct := false, false
		for _, v := range mainIntervals { if mid >= v.s && mid <= v.e { mainAct = true; break } }
		for _, v := range guestIntervals { if mid >= v.s && mid <= v.e { guestAct = true; break } }

		canUse1 := mid >= delay1
		canUse2 := v2Path != "" && mid >= delay2
		canUse3 := v3Path != "" && mid >= delay3

		cam := 1
		
		if v2Path == "" {
			cam = 1
		} else {
			if mainAct && guestAct && canUse3 {
				cam = 3
			} else if mainCam == 1 {
				if mainAct && canUse1 { cam = 1 } else if guestAct && canUse2 { cam = 2 } else if canUse1 { cam = 1 } else if canUse2 { cam = 2 }
			} else {
				if mainAct && canUse2 { cam = 2 } else if guestAct && canUse1 { cam = 1 } else if canUse2 { cam = 2 } else if canUse1 { cam = 1 }
			}
		}

		if len(finalCuts) > 0 && finalCuts[len(finalCuts)-1].Cam == cam {
			finalCuts[len(finalCuts)-1].EndA = t2
		} else {
			if t2-t1 < 0.2 && len(finalCuts) > 0 {
				finalCuts[len(finalCuts)-1].EndA = t2
			} else {
				finalCuts = append(finalCuts, Chunk{cam, t1, t2})
			}
		}
	}

	sendProgress(75, "Подготовка списка файлов для склейки...")
	var sb strings.Builder
	for _, c := range finalCuts {
		d, p := delay1, videoPath
		if c.Cam == 2 { d, p = delay2, v2Path }
		if c.Cam == 3 { d, p = delay3, v3Path }
		inP, outP := c.StartA-d, c.EndA-d
		if inP < 0 { inP = 0 }
		sb.WriteString(fmt.Sprintf("file '%s'\ninpoint %.3f\noutpoint %.3f\n", strings.ReplaceAll(p, "\\", "/"), inP, outP))
	}
	lst := filepath.Join(os.TempDir(), "lst.txt")
	os.WriteFile(lst, []byte(sb.String()), 0644)

	outPath := filepath.Join(outDir, fmt.Sprintf("RESULT_%s.mp4", time.Now().Format("15-04-05")))
	
	cmdF := []string{"-y", "-f", "concat", "-safe", "0", "-i", lst, "-ss", fmt.Sprintf("%.3f", masterStart), "-i", audioPath, "-map", "0:v:0", "-map", "1:a:0", "-shortest", "-c:v", "copy", "-c:a", "aac", outPath}
	
	renderCmd := exec.CommandContext(a.processCtx, a.ffmpegPath, cmdF...)
	renderCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	stderrPipe, _ := renderCmd.StderrPipe()
	renderCmd.Start()

	scanner := bufio.NewScanner(stderrPipe)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 { return 0, nil, nil }
		if i := bytes.IndexAny(data, "\r\n"); i >= 0 { return i + 1, data[0:i], nil }
		if atEOF { return len(data), data, nil }
		return 0, nil, nil
	})

	timeRe := regexp.MustCompile(`time=(\d{2}):(\d{2}):([\d\.]+)`)
	for scanner.Scan() {
		if a.processCtx.Err() != nil { return "❌ Процесс отменен пользователем!" }
		line := scanner.Text()
		matches := timeRe.FindStringSubmatch(line)
		if len(matches) == 4 {
			h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
			progress := (h*3600.0 + m*60.0 + s) / (masterDur - masterStart)
			if progress > 1.0 { progress = 1.0 } else if progress < 0.0 { progress = 0.0 }
			sendProgress(80+int(progress*20), fmt.Sprintf("Рендер финала: %d%%", int(progress*100)))
		}
	}
	renderCmd.Wait()
	
	if a.processCtx.Err() != nil { return "❌ Процесс отменен!" }
	sendProgress(100, "Успешно завершено!")
	
	resultMsg := fmt.Sprintf("✅ Готово!\n✂️ Склеек: %d\n📁 Сохранено в: %s\n⏱ Заняло: %.1f сек", len(finalCuts), outDir, time.Since(t0).Seconds())
	if v2Path != "" { resultMsg += "\n📝 Транскрипт сохранен в txt файл." }
	return resultMsg
}

// 2. ВКЛАДКА: ПРОСТАЯ СКЛЕЙКА (До 3 видео)
func (a *App) MergeVideos(v1 string, v2 string, v3 string, outDir string) string {
	a.processCtx, a.cancelFn = context.WithCancel(a.ctx)
	defer a.cancelFn()

	t0 := time.Now()
	sendProgress := func(p int, m string) { runtime.EventsEmit(a.ctx, "merge_progress", map[string]interface{}{"percent": p, "message": m}) }

	os.MkdirAll(outDir, 0755)

	sendProgress(5, "Чтение длительности видео...")
	dur1 := a.getVideoDuration(v1)
	dur2 := a.getVideoDuration(v2)
	dur3 := 0.0
	if v3 != "" { dur3 = a.getVideoDuration(v3) }
	totalDur := dur1 + dur2 + dur3

	sendProgress(10, "Подготовка к склейке...")
	lst := filepath.Join(os.TempDir(), "merge_list.txt")
	
	sb := fmt.Sprintf("file '%s'\nfile '%s'\n", strings.ReplaceAll(v1, "\\", "/"), strings.ReplaceAll(v2, "\\", "/"))
	if v3 != "" { sb += fmt.Sprintf("file '%s'\n", strings.ReplaceAll(v3, "\\", "/")) }
	os.WriteFile(lst, []byte(sb), 0644)

	outPath := filepath.Join(outDir, fmt.Sprintf("MERGED_%s.mp4", time.Now().Format("15-04-05")))

	cmdF := []string{"-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", outPath}

	sendProgress(20, "Запуск процесса объединения...")
	renderCmd := exec.CommandContext(a.processCtx, a.ffmpegPath, cmdF...)
	renderCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	stderrPipe, _ := renderCmd.StderrPipe()
	renderCmd.Start()

	scanner := bufio.NewScanner(stderrPipe)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 { return 0, nil, nil }
		if i := bytes.IndexAny(data, "\r\n"); i >= 0 { return i + 1, data[0:i], nil }
		if atEOF { return len(data), data, nil }
		return 0, nil, nil
	})

	timeRe := regexp.MustCompile(`time=(\d{2}):(\d{2}):([\d\.]+)`)
	for scanner.Scan() {
		if a.processCtx.Err() != nil { return "❌ Процесс отменен пользователем!" }
		line := scanner.Text()
		matches := timeRe.FindStringSubmatch(line)
		if len(matches) == 4 {
			h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
			progress := (h*3600.0 + m*60.0 + s) / totalDur
			if progress > 1.0 { progress = 1.0 } else if progress < 0.0 { progress = 0.0 }
			sendProgress(20+int(progress*80), fmt.Sprintf("Склейка финала: %d%%", int(progress*100)))
		}
	}
	renderCmd.Wait()
	
	if a.processCtx.Err() != nil { return "❌ Процесс отменен!" }
	sendProgress(100, "Видео успешно склеены!")
	return fmt.Sprintf("✅ Готово!\n📁 Сохранено в: %s\n⏱ Заняло: %.1f сек", outDir, time.Since(t0).Seconds())
}

// 3. ВКЛАДКА: СЖАТИЕ ВИДЕО
func (a *App) CompressVideo(videoPath string, crf int, outDir string) string {
	a.processCtx, a.cancelFn = context.WithCancel(a.ctx)
	defer a.cancelFn()

	t0 := time.Now()
	sendProgress := func(p int, m string) { runtime.EventsEmit(a.ctx, "compress_progress", map[string]interface{}{"percent": p, "message": m}) }

	os.MkdirAll(outDir, 0755)

	sendProgress(5, "Анализ видео...")
	totalDur := a.getVideoDuration(videoPath)

	outPath := filepath.Join(outDir, fmt.Sprintf("COMPRESSED_%s.mp4", time.Now().Format("15-04-05")))

	cmdF := []string{"-y", "-i", videoPath, "-c:v", "libx264", "-crf", strconv.Itoa(crf), "-preset", "fast", "-c:a", "aac", "-b:a", "192k", outPath}

	sendProgress(10, fmt.Sprintf("Запуск сжатия (CRF %d)...", crf))
	renderCmd := exec.CommandContext(a.processCtx, a.ffmpegPath, cmdF...)
	renderCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	stderrPipe, _ := renderCmd.StderrPipe()
	renderCmd.Start()

	scanner := bufio.NewScanner(stderrPipe)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 { return 0, nil, nil }
		if i := bytes.IndexAny(data, "\r\n"); i >= 0 { return i + 1, data[0:i], nil }
		if atEOF { return len(data), data, nil }
		return 0, nil, nil
	})

	timeRe := regexp.MustCompile(`time=(\d{2}):(\d{2}):([\d\.]+)`)
	for scanner.Scan() {
		if a.processCtx.Err() != nil { return "❌ Процесс отменен пользователем!" }
		line := scanner.Text()
		matches := timeRe.FindStringSubmatch(line)
		if len(matches) == 4 {
			h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
			progress := (h*3600.0 + m*60.0 + s) / totalDur
			if progress > 1.0 { progress = 1.0 } else if progress < 0.0 { progress = 0.0 }
			sendProgress(10+int(progress*90), fmt.Sprintf("Сжатие: %d%%", int(progress*100)))
		}
	}
	renderCmd.Wait()
	
	if a.processCtx.Err() != nil { return "❌ Процесс отменен!" }
	sendProgress(100, "Сжатие завершено!")
	return fmt.Sprintf("✅ Готово!\n📁 Сохранено в: %s\n⏱ Заняло: %.1f сек", outDir, time.Since(t0).Seconds())
}
