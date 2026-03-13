import { RunSync, MergeVideos, CompressVideo, SelectVideo, SelectAudio, SelectDirectory, CancelProcess } from '../wailsjs/go/main/App';

function switchTab(activeBtn, activeView) {
    ['tabSyncBtn', 'tabMergeBtn', 'tabCompressBtn'].forEach(id => document.getElementById(id).classList.remove('active'));
    ['viewSync', 'viewMerge', 'viewCompress'].forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(activeBtn).classList.add('active');
    document.getElementById(activeView).classList.add('active');
}
document.getElementById('tabSyncBtn').addEventListener('click', () => switchTab('tabSyncBtn', 'viewSync'));
document.getElementById('tabMergeBtn').addEventListener('click', () => switchTab('tabMergeBtn', 'viewMerge'));
document.getElementById('tabCompressBtn').addEventListener('click', () => switchTab('tabCompressBtn', 'viewCompress'));

document.addEventListener("DOMContentLoaded", () => {
    let savedKey = localStorage.getItem("assembly_api_key");
    if (savedKey) document.getElementById('apiKey').value = savedKey;
});

// Функция автозаполнения папки сохранения
function autoSetOutDir(filePath, outInputId) {
    let outInput = document.getElementById(outInputId);
    if (!outInput.value && filePath) {
        let dir = filePath.substring(0, Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/")));
        outInput.value = dir;
    }
}

// Кнопки Обзор файлов
document.getElementById('btnV1').addEventListener('click', () => { SelectVideo().then(p => { if (p) { document.getElementById('vPath').value = p; autoSetOutDir(p, 'outSync'); } }); });
document.getElementById('btnV2').addEventListener('click', () => { SelectVideo().then(p => { if (p) document.getElementById('vPath2').value = p; }); });
document.getElementById('btnV3').addEventListener('click', () => { SelectVideo().then(p => { if (p) document.getElementById('vPath3').value = p; }); });
document.getElementById('btnA').addEventListener('click', () => { SelectAudio().then(p => { if (p) document.getElementById('aPath').value = p; }); });

document.getElementById('btnM1').addEventListener('click', () => { SelectVideo().then(p => { if (p) { document.getElementById('mPath1').value = p; autoSetOutDir(p, 'outMerge'); } }); });
document.getElementById('btnM2').addEventListener('click', () => { SelectVideo().then(p => { if (p) document.getElementById('mPath2').value = p; }); });
document.getElementById('btnM3').addEventListener('click', () => { SelectVideo().then(p => { if (p) document.getElementById('mPath3').value = p; }); });

document.getElementById('btnC').addEventListener('click', () => { SelectVideo().then(p => { if (p) { document.getElementById('cPath').value = p; autoSetOutDir(p, 'outCompress'); } }); });

// Кнопки Обзор папок
document.getElementById('btnOutSync').addEventListener('click', () => { SelectDirectory().then(p => { if (p) document.getElementById('outSync').value = p; }); });
document.getElementById('btnOutMerge').addEventListener('click', () => { SelectDirectory().then(p => { if (p) document.getElementById('outMerge').value = p; }); });
document.getElementById('btnOutCompress').addEventListener('click', () => { SelectDirectory().then(p => { if (p) document.getElementById('outCompress').value = p; }); });

let crfSlider = document.getElementById('crfSlider');
let crfLabel = document.getElementById('crfLabel');
crfSlider.addEventListener('input', () => {
    let val = parseInt(crfSlider.value);
    let text = `${val}`;
    if (val <= 20) text += " (Качество YouTube)";
    else if (val <= 26) text += " (Баланс Instagram)";
    else text += " (Сжатие Telegram)";
    crfLabel.innerText = text;
});

if (window.runtime) {
    window.runtime.EventsOn("sync_progress", data => { document.getElementById('logBoxSync').innerText = `[${data.percent}%] ${data.message}`; });
    window.runtime.EventsOn("merge_progress", data => { document.getElementById('logBoxMerge').innerText = `[${data.percent}%] ${data.message}`; });
    window.runtime.EventsOn("compress_progress", data => { document.getElementById('logBoxCompress').innerText = `[${data.percent}%] ${data.message}`; });
}

['cancelSyncBtn', 'cancelMergeBtn', 'cancelCompressBtn'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => { CancelProcess(); });
});

function toggleButtons(isProcessing, startBtnId, cancelBtnId) {
    document.getElementById(startBtnId).disabled = isProcessing;
    document.getElementById(cancelBtnId).disabled = !isProcessing;
}

// 1. Запуск Синхронизации
document.getElementById('startBtn').addEventListener('click', () => {
    let vPath = document.getElementById('vPath').value;
    let vPath2 = document.getElementById('vPath2').value;
    let vPath3 = document.getElementById('vPath3').value;
    let aPath = document.getElementById('aPath').value;
    let apiKey = document.getElementById('apiKey').value.trim();
    let mainCam = parseInt(document.querySelector('input[name="mainCam"]:checked').value);
    let outDir = document.getElementById('outSync').value;
    let logBox = document.getElementById('logBoxSync');

    if (!vPath || !aPath) { logBox.innerText = "⚠️ Ошибка: Выберите Камеру 1 и Мастер-аудио!"; return; }
    if (!outDir) { logBox.innerText = "⚠️ Ошибка: Укажите папку для сохранения!"; return; }
    if ((vPath2 || vPath3) && !apiKey) { logBox.innerText = "⚠️ Ошибка: Для многокамерного монтажа нужен ключ AssemblyAI!"; return; }
    
    if (apiKey) localStorage.setItem("assembly_api_key", apiKey);
    toggleButtons(true, 'startBtn', 'cancelSyncBtn');
    logBox.innerText = "🚀 Запуск...";
    
    RunSync(vPath, aPath, vPath2, vPath3, apiKey, mainCam, outDir).then(res => { 
        logBox.innerText = res; toggleButtons(false, 'startBtn', 'cancelSyncBtn'); 
    }).catch(err => { 
        logBox.innerText = "❌ Ошибка: " + err; toggleButtons(false, 'startBtn', 'cancelSyncBtn'); 
    });
});

// 2. Запуск Склейки
document.getElementById('startMergeBtn').addEventListener('click', () => {
    let v1 = document.getElementById('mPath1').value;
    let v2 = document.getElementById('mPath2').value;
    let v3 = document.getElementById('mPath3').value;
    let outDir = document.getElementById('outMerge').value;
    let logBox = document.getElementById('logBoxMerge');

    if (!v1 || !v2) { logBox.innerText = "⚠️ Ошибка: Выберите минимум Видео 1 и Видео 2!"; return; }
    if (!outDir) { logBox.innerText = "⚠️ Ошибка: Укажите папку для сохранения!"; return; }

    toggleButtons(true, 'startMergeBtn', 'cancelMergeBtn');
    logBox.innerText = "🚀 Объединяем...";
    
    MergeVideos(v1, v2, v3, outDir).then(res => { 
        logBox.innerText = res; toggleButtons(false, 'startMergeBtn', 'cancelMergeBtn'); 
    }).catch(err => { 
        logBox.innerText = "❌ Ошибка: " + err; toggleButtons(false, 'startMergeBtn', 'cancelMergeBtn'); 
    });
});

// 3. Запуск Сжатия
document.getElementById('startCompressBtn').addEventListener('click', () => {
    let cPath = document.getElementById('cPath').value;
    let crf = parseInt(document.getElementById('crfSlider').value);
    let outDir = document.getElementById('outCompress').value;
    let logBox = document.getElementById('logBoxCompress');

    if (!cPath) { logBox.innerText = "⚠️ Ошибка: Выберите видео для сжатия!"; return; }
    if (!outDir) { logBox.innerText = "⚠️ Ошибка: Укажите папку для сохранения!"; return; }

    toggleButtons(true, 'startCompressBtn', 'cancelCompressBtn');
    logBox.innerText = "🚀 Начинаем сжатие...";
    
    CompressVideo(cPath, crf, outDir).then(res => { 
        logBox.innerText = res; toggleButtons(false, 'startCompressBtn', 'cancelCompressBtn'); 
    }).catch(err => { 
        logBox.innerText = "❌ Ошибка: " + err; toggleButtons(false, 'startCompressBtn', 'cancelCompressBtn'); 
    });
});
