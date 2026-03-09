import { RunSync, SelectVideo, SelectAudio } from '../wailsjs/go/main/App';

document.getElementById('btnVideo').addEventListener('click', () => {
    SelectVideo().then(path => {
        if (path) { document.getElementById('vPath').value = path; document.getElementById('logBox').innerText = "Видео загружено."; }
    });
});

document.getElementById('btnAudio').addEventListener('click', () => {
    SelectAudio().then(path => {
        if (path) { document.getElementById('aPath').value = path; document.getElementById('logBox').innerText = "Аудио загружено. Готов к синхронизации."; }
    });
});

if (window.runtime) {
    window.runtime.EventsOn("sync_progress", (data) => {
        let fill = document.getElementById('progressFill');
        document.getElementById('progressText').innerText = data.message;
        document.getElementById('progressPercent').innerText = data.percent + "%";
        fill.style.width = data.percent + "%";

        if (data.isRendering) fill.classList.add("striped");
        else fill.classList.remove("striped");
    });
}

document.getElementById('startBtn').addEventListener('click', () => {
    let vPath = document.getElementById('vPath').value;
    let aPath = document.getElementById('aPath').value;
    let compress = document.getElementById('compressToggle').checked;
    
    let startBtn = document.getElementById('startBtn');
    let logBox = document.getElementById('logBox');
    let progressWrapper = document.getElementById('progressWrapper');
    let progressFill = document.getElementById('progressFill');

    if (!vPath) {
        logBox.innerText = "⚠️ Ошибка: Выберите видеофайл!";
        return;
    }

    if (!aPath && !compress) {
        logBox.innerText = "⚠️ Ошибка: Выберите аудиофайл для синхронизации, ИЛИ включите галочку 'Сжатие', чтобы просто сжать видео.";
        return;
    }

    startBtn.disabled = true;
    startBtn.innerText = "⏳ ОБРАБОТКА...";
    progressWrapper.style.display = "flex"; 
    progressFill.style.width = "0%";
    progressFill.classList.remove("striped");
    document.getElementById('progressPercent').innerText = "0%";
    
    if (!aPath) logBox.innerText = "Активирован режим простого сжатия (CompressO)...";
    else logBox.innerText = "Инициализация движка синхронизации...";

    RunSync(vPath, aPath, compress).then((result) => {
        logBox.innerText = result;
        startBtn.disabled = false;
        startBtn.innerText = "🚀 ЗАПУСТИТЬ";
        document.getElementById('progressText').innerText = "Готово!";
    }).catch((err) => {
        logBox.innerText = "❌ Критическая ошибка: " + err;
        startBtn.disabled = false;
        startBtn.innerText = "🚀 ЗАПУСТИТЬ";
        progressFill.style.width = "0%";
    });
});
