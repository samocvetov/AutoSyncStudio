import streamlit as st
import os
import subprocess
import numpy as np
import re
import time
from scipy.signal import correlate
from scipy.io import wavfile
from datetime import datetime

st.set_page_config(page_title="AutoSync Pro v9.6", layout="wide")
st.title("⚡ AutoSync v9.6: Максимальная стабильность")

# --- Вспомогательные функции ---
def get_duration(path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return float(res.stdout.strip())
    except:
        return 0

def get_files(path, extensions):
    file_list = []
    if os.path.exists(path):
        for root, dirs, files in os.walk(path):
            for f in files:
                if f.lower().endswith(extensions):
                    file_list.append(os.path.relpath(os.path.join(root, f), path))
    return sorted(file_list)

# Единый, самый стабильный и быстрый метод извлечения (через временный файл)
def get_envelope(path):
    tmp = path + ".tmp.wav"
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", path, 
           "-vn", "-sn", "-dn", "-ac", "1", "-ar", "8000", tmp]
    subprocess.run(cmd, capture_output=True)
    
    if not os.path.exists(tmp): return None
    fs, data = wavfile.read(tmp)
    os.remove(tmp)
    
    data = np.abs(data.astype(np.float32))
    chunk = 80 
    envelope = np.mean(data[:len(data)//chunk*chunk].reshape(-1, chunk), axis=1)
    return envelope - np.mean(envelope)

# --- Интерфейс ---
st.sidebar.header("⚙️ Настройки вывода")
enable_compress = st.sidebar.toggle("Сжатие (CompressO)", value=False)
quality = st.sidebar.slider("Качество (CRF):", 18, 30, 24)

st.subheader("📁 Выбор файлов")
col_v, col_a = st.columns(2)
with col_v:
    v_dir = st.text_input("Папка с видео:", value="/mnt/c/users/sysop/Downloads/2026-03")
    v_files = get_files(v_dir, ('.mp4', '.mov', '.mkv'))
    v_sel = st.selectbox(f"Видео ({len(v_files)}):", [""] + v_files)
with col_a:
    a_dir = st.text_input("Папка со звуком:", value="/mnt/c/users/sysop/Downloads/2026-03")
    a_files = get_files(a_dir, ('.wav', '.mp3', '.m4a'))
    a_sel = st.selectbox(f"Аудио ({len(a_files)}):", [""] + a_files)

if v_sel and a_sel:
    if st.button("🚀 ЗАПУСТИТЬ", use_container_width=True):
        v_p, a_p = os.path.join(v_dir, v_sel), os.path.join(a_dir, a_sel)
        
        log_container = st.container(border=True)
        
        with st.status("📊 Выполнение процессов...", expanded=True) as status:
            t0 = time.time()
            log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] СТАРТ: Чтение аудио из видео...")
            env_v = get_envelope(v_p)
            log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] КОНЕЦ: Видео прочитано (заняло {time.time()-t0:.2f} сек)")
            
            t1 = time.time()
            log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] СТАРТ: Чтение звуковой дорожки...")
            env_a = get_envelope(a_p)
            log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] КОНЕЦ: Звук прочитан (заняло {time.time()-t1:.2f} сек)")
            
            if env_v is not None and env_a is not None:
                t2 = time.time()
                log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] СТАРТ: Поиск совпадения по всей длине (FFT)...")
                corr = correlate(env_a, env_v, method='fft')
                delay_sec = (np.argmax(corr) - (len(env_v) - 1)) / 100.0
                log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] КОНЕЦ: Смещение {delay_sec:.3f}с найдено (заняло {time.time()-t2:.4f} сек)")
                
                t3 = time.time()
                log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] СТАРТ: Рендер финального файла...")
                
                out_dir = os.path.join(v_dir, "OUT")
                if not os.path.exists(out_dir): os.makedirs(out_dir)
                out_name = f"OUT_{os.path.splitext(os.path.basename(v_p))[0]}_{datetime.now().strftime('%H-%M-%S')}.mp4"
                out_p = os.path.join(out_dir, out_name)
                
                progress_bar = st.progress(0)
                st_text = st.empty()
                v_dur = get_duration(v_p)
                v_codec = ["-c:v", "libx264", "-crf", str(quality)] if enable_compress else ["-c:v", "copy"]
                
                if delay_sec > 0:
                    cmd = ["ffmpeg", "-y", "-i", v_p, "-ss", str(abs(round(delay_sec, 3))), "-i", a_p]
                else:
                    cmd = ["ffmpeg", "-y", "-itsoffset", str(abs(round(delay_sec, 3))), "-i", v_p, "-i", a_p]
                
                cmd += ["-map", "0:v:0", "-map", "1:a:0"] + v_codec + ["-c:a", "aac", "-shortest", "-progress", "pipe:1", out_p]
                
                process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
                for line in process.stdout:
                    if "out_time=" in line:
                        time_match = re.search(r"out_time=(\d{2}):(\d{2}):(\d{2})", line)
                        if time_match and v_dur > 0:
                            h, m, s = map(int, time_match.groups())
                            cur = h * 3600 + m * 60 + s
                            p = min(cur / v_dur, 1.0)
                            progress_bar.progress(p)
                            st_text.text(f"Рендер: {p*100:.1f}% ({h:02}:{m:02}:{s:02})")
                
                process.wait()
                if process.returncode == 0:
                    log_container.text(f"[{datetime.now().strftime('%H:%M:%S')}] КОНЕЦ: Рендер завершен (заняло {time.time()-t3:.2f} сек)")
                    log_container.success(f"Общее время работы: {time.time()-t0:.2f} сек")
                    status.update(label="✅ Готово!", state="complete")
                    st.success(f"Файл сохранен: OUT/{out_name}")
                else:
                    st.error("Ошибка при сборке видео.")
            else:
                st.error("Не удалось прочитать аудио для анализа.")
