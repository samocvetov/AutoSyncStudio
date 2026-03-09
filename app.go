package main

import (
	"bufio"
	"bytes"
	"context"
	_ "embed"
	"encoding/binary"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
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
	ffmpegPath string
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	tempDir := os.TempDir()
	a.ffmpegPath = filepath.Join(tempDir, "autosync_ffmpeg.exe")
	os.WriteFile(a.ffmpegPath, ffmpegBinary, 0755)
}

func (a *App) shutdown(ctx context.Context) {
	exec.Command("taskkill", "/F", "/IM", "autosync_ffmpeg.exe", "/T").Run()
	if a.ffmpegPath != "" { os.Remove(a.ffmpegPath) }
}

func (a *App) getVideoDuration(filePath string) float64 {
	cmd := exec.CommandContext(a.ctx, a.ffmpegPath, "-i", filePath)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	cmd.Run()

	timeRe := regexp.MustCompile(`Duration:\s+(\d{2}):(\d{2}):([\d\.]+)`)
	matches := timeRe.FindStringSubmatch(stderr.String())
	if len(matches) == 4 {
		h, _ := strconv.ParseFloat(matches[1], 64)
		m, _ := strconv.ParseFloat(matches[2], 64)
		s, _ := strconv.ParseFloat(matches[3], 64)
		return h*3600.0 + m*60.0 + s
	}
	return 0.1 
}

func (a *App) getEnvelope(filePath string) ([]float64, error) {
	cmd := exec.CommandContext(a.ctx, a.ffmpegPath, "-v", "error", "-i", filePath,
		"-vn", "-sn", "-dn", "-ac", "1", "-ar", "8000",
		"-f", "s16le", "pipe:1")

	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}

	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		if a.ctx.Err() != nil { return nil, fmt.Errorf("процесс прерван") }
		return nil, fmt.Errorf("не удалось прочитать файл.\nПричина: %s\n(%v)", stderr.String(), err)
	}

	audioData := out.Bytes()
	if len(audioData) == 0 { return nil, fmt.Errorf("вернулся 0 байт") }

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

	if len(envelope) == 0 { return nil, fmt.Errorf("аудиодорожка слишком короткая") }

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

func (a *App) SelectVideo() string {
	selection, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Выберите видео", Filters: []runtime.FileFilter{{DisplayName: "Видео", Pattern: "*.mp4;*.mov;*.mkv;*.avi"}},
	})
	return selection
}

func (a *App) SelectAudio() string {
	selection, _ := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Выберите мастер-аудио", Filters: []runtime.FileFilter{{DisplayName: "Аудио", Pattern: "*.wav;*.mp3;*.m4a"}},
	})
	return selection
}

func (a *App) RunSync(videoPath string, audioPath string, compress bool) string {
	t0 := time.Now()

	sendProgress := func(percent int, msg string, isRendering bool) {
		runtime.EventsEmit(a.ctx, "sync_progress", map[string]interface{}{
			"percent": percent, "message": msg, "isRendering": isRendering,
		})
	}

	// РЕЖИМ 1: ПРОСТО СЖАТИЕ
	if audioPath == "" {
		if !compress { return "❌ Выберите аудиофайл для синхронизации ИЛИ включите галочку 'Сжатие'." }
		
		sendProgress(5, "Определение параметров видео...", false)
		totalDurationSec := a.getVideoDuration(videoPath)
		
		outDir := filepath.Join(filepath.Dir(videoPath), "OUT")
		os.MkdirAll(outDir, os.ModePerm)
		outName := fmt.Sprintf("COMPRESS_%s_%s.mp4", filepath.Base(videoPath[:len(videoPath)-len(filepath.Ext(videoPath))]), time.Now().Format("15-04-05"))
		outPath := filepath.Join(outDir, outName)

		ffmpegCmd := []string{"-y", "-i", videoPath, "-c:v", "libx264", "-crf", "24", "-c:a", "aac", outPath}
		sendProgress(10, "Запуск рендера...", true)

		renderCmd := exec.CommandContext(a.ctx, a.ffmpegPath, ffmpegCmd...)
		renderCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
		
		stderrPipe, err := renderCmd.StderrPipe()
		if err != nil { return fmt.Sprintf("❌ Ошибка пайпа: %v", err) }
		if err := renderCmd.Start(); err != nil { return fmt.Sprintf("❌ Ошибка старта: %v", err) }

		timeRe := regexp.MustCompile(`time=(\d{2}):(\d{2}):([\d\.]+)`)
		scanner := bufio.NewScanner(stderrPipe)
		scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
			if atEOF && len(data) == 0 { return 0, nil, nil }
			if i := bytes.IndexAny(data, "\r\n"); i >= 0 { return i + 1, data[0:i], nil }
			if atEOF { return len(data), data, nil }
			return 0, nil, nil
		})

		var lastErr string
		for scanner.Scan() {
			line := scanner.Text()
			if strings.TrimSpace(line) != "" { lastErr = line }
			matches := timeRe.FindStringSubmatch(line)
			if len(matches) == 4 {
				h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
				currentSec := h*3600.0 + m*60.0 + s
				progress := currentSec / totalDurationSec
				if progress > 1.0 { progress = 1.0 } else if progress < 0.0 { progress = 0.0 }
				sendProgress(10 + int(progress*90), fmt.Sprintf("Сжатие: %d%%", int(progress*100)), true)
			}
		}

		if err := renderCmd.Wait(); err != nil {
			if a.ctx.Err() != nil { return "ОТМЕНА: Процесс прерван" }
			return fmt.Sprintf("❌ Ошибка сжатия:\n%s\n(%v)", lastErr, err)
		}

		sendProgress(100, "Сжатие завершено!", false)
		return fmt.Sprintf("✅ Успешно сжато!\nФайл: OUT/%s\nЗаняло: %.1f сек", outName, time.Since(t0).Seconds())
	}

	// РЕЖИМ 2: СИНХРОНИЗАЦИЯ
	sendProgress(5, "Чтение файлов...", false)
	type result struct { env []float64; err error }
	vChan := make(chan result); aChan := make(chan result)

	go func() { env, err := a.getEnvelope(videoPath); vChan <- result{env, err} }()
	go func() { env, err := a.getEnvelope(audioPath); aChan <- result{env, err} }()

	sendProgress(15, "Анализ звуковых волн...", false)

	vRes := <-vChan
	if vRes.err != nil { return fmt.Sprintf("❌ Ошибка ВИДЕО:\n%v", vRes.err) }
	totalDurationSec := float64(len(vRes.env)) / 100.0 
	
	sendProgress(35, "Ожидание аудиопотока...", false)
	aRes := <-aChan
	if aRes.err != nil { return fmt.Sprintf("❌ Ошибка АУДИО:\n%v", aRes.err) }
	
	sendProgress(50, "Поиск сдвига (математическое сравнение)...", false)
	delaySec := findDelay(aRes.env, vRes.env)

	outDir := filepath.Join(filepath.Dir(videoPath), "OUT")
	os.MkdirAll(outDir, os.ModePerm)
	outName := fmt.Sprintf("OUT_%s_%s.mp4", filepath.Base(videoPath[:len(videoPath)-len(filepath.Ext(videoPath))]), time.Now().Format("2006-01-02_15-04-05"))
	outPath := filepath.Join(outDir, outName)

	ffmpegCmd := []string{"-y"}
	if delaySec > 0 { ffmpegCmd = append(ffmpegCmd, "-i", videoPath, "-ss", fmt.Sprintf("%.3f", delaySec), "-i", audioPath)
	} else { ffmpegCmd = append(ffmpegCmd, "-itsoffset", fmt.Sprintf("%.3f", math.Abs(delaySec)), "-i", videoPath, "-i", audioPath) }

	ffmpegCmd = append(ffmpegCmd, "-map", "0:v:0", "-map", "1:a:0")
	if compress { ffmpegCmd = append(ffmpegCmd, "-c:v", "libx264", "-crf", "24")
	} else { ffmpegCmd = append(ffmpegCmd, "-c:v", "copy") }
	ffmpegCmd = append(ffmpegCmd, "-c:a", "aac", "-shortest", outPath)

	sendProgress(60, "Запуск рендера...", true)

	renderCmd := exec.CommandContext(a.ctx, a.ffmpegPath, ffmpegCmd...)
	renderCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	
	stderrPipe, err := renderCmd.StderrPipe()
	if err != nil { return fmt.Sprintf("❌ Ошибка пайпа: %v", err) }
	if err := renderCmd.Start(); err != nil { return fmt.Sprintf("❌ Ошибка старта рендера: %v", err) }

	timeRe := regexp.MustCompile(`time=(\d{2}):(\d{2}):([\d\.]+)`)
	scanner := bufio.NewScanner(stderrPipe)
	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 { return 0, nil, nil }
		if i := bytes.IndexAny(data, "\r\n"); i >= 0 { return i + 1, data[0:i], nil }
		if atEOF { return len(data), data, nil }
		return 0, nil, nil
	})

	var lastErrLog string
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) != "" { lastErrLog = line }
		matches := timeRe.FindStringSubmatch(line)
		if len(matches) == 4 {
			h, _ := strconv.ParseFloat(matches[1], 64); m, _ := strconv.ParseFloat(matches[2], 64); s, _ := strconv.ParseFloat(matches[3], 64)
			currentSec := h*3600.0 + m*60.0 + s
			progress := currentSec / totalDurationSec
			if progress > 1.0 { progress = 1.0 } else if progress < 0.0 { progress = 0.0 }
			sendProgress(60 + int(progress*40), fmt.Sprintf("Рендер финала: %d%%", int(progress*100)), true)
		}
	}

	if err := renderCmd.Wait(); err != nil {
		if a.ctx.Err() != nil { return "ОТМЕНА: Процесс прерван при закрытии" }
		return fmt.Sprintf("❌ Ошибка сборки видео:\n%s\n(%v)", lastErrLog, err)
	}

	sendProgress(100, "Синхронизация успешно завершена!", false)
	return fmt.Sprintf("✅ Успешно!\nФайл: OUT/%s\nСдвиг: %.3f сек\nЗаняло: %.1f сек", outName, delaySec, time.Since(t0).Seconds())
}
