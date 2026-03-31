const STORAGE_LANGUAGE_KEY = "autosyncstudio.language";
const DEFAULT_LANGUAGE = "ru";

const I18N = {
  ru: {
    document_title: "AutoSync Studio 1.0.34",
    app_title: "AutoSync Studio 1.0.34",
    hero_subtitle: "Новая версия проекта с фокусом на точный sync, а не на хрупкую магию.",
    tab_sync: "Single-Cam Sync",
    tab_multicam: "Multicam",
    tab_backend: "Render Backend",
    studio_single_subtitle: "Для сценария, где есть видеозапись с камеры и отдельный мастер-аудиофайл.",
    multicam_subtitle: "Сначала надежно измеряем смещения всех камер относительно мастер-аудио, а уже потом строим точный рендер без скрытой магии.",
    backend_panel_subtitle: "Единый backend исполнения для single-cam и multicam: локальный CPU, локальный GPU или удаленный ffmpeg-over-ip.",
    label_video_path: "Путь к видео",
    label_video_path_short: "Видео",
    label_audio_path: "Путь к мастер-аудио",
    label_audio_path_short: "Аудио",
    label_analyze_seconds: "Сколько секунд анализировать",
    label_analyze_short: "Сек. анализа",
    label_max_lag: "Максимальное окно поиска смещения",
    label_max_lag_short: "Макс. сдвиг",
    label_output_path: "Куда сохранить рендер",
    label_output_short: "Сохранить",
    label_crf: "CRF",
    label_crf_short: "Качество",
    label_preset: "Пресет кодирования",
    label_preset_short: "Скорость",
    backend_title: "Исполнитель рендера",
    label_execution_mode: "Где выполнять рендер",
    label_execution_short: "Mode",
    label_remote_client_path: "Путь к клиенту ffmpeg-over-ip",
    label_client_short: "Client",
    label_remote_address: "Адрес сервера",
    label_remote_address_short: "Address",
    label_remote_secret: "Общий секрет",
    label_remote_secret_short: "Secret",
    btn_analyze_sync: "Анализ",
    btn_render_sync: "Рендер",
    btn_cancel: "Отмена",
    sync_output_idle: "Здесь появятся результаты анализа смещения и точного рендера.",
    sync_note: "Если смещение положительное, раньше стартует мастер-аудио. Если отрицательное, раньше стартует видеозапись камеры.",
    sync_terms_note: "`Сек. анализа` — сколько первых секунд сравнивать. `Макс. сдвиг` — предел поиска рассинхрона. `Качество (CRF)` — баланс веса и качества: меньше число, выше качество. `Скорость` — насколько быстро кодировать видео.",
    label_master_audio: "Путь к мастер-аудио",
    label_master_audio_short: "Мастер",
    label_camera_paths: "Камеры, по одной на строку",
    label_camera_paths_short: "Камеры",
    label_aligned_dir: "Куда сохранить aligned-клипы",
    label_aligned_dir_short: "Сохранить",
    label_aligned_crf: "CRF для выровненных клипов",
    label_aligned_crf_short: "CRF",
    label_multicam_render_output: "Куда сохранить финальный multicam-рендер",
    label_final_short: "Сохранить",
    label_primary_camera: "Основная камера",
    label_primary_short: "Главная камера",
    label_shot_window: "Окно анализа плана, сек",
    label_shot_window_short: "Window",
    label_min_shot: "Минимальная длина плана, сек",
    label_min_shot_short: "Min Shot",
    multicam_backend_note: "Экспорт и финальный multicam-рендер используют тот же backend, что и single-cam режим.",
    btn_analyze_multicam: "Анализ",
    btn_export_commands: "Экспорт команд",
    btn_render_final: "Рендер",
    status_render_cancelled: "Рендер остановлен пользователем.",
    status_progress: "Прогресс",
    multicam_output_idle: "Здесь появятся результаты измерения смещений, экспортные команды и предпросмотр плана склеек.",
    multicam_note: "Это новая архитектура проекта: сначала надежная диагностика, затем точный рендер. Автомонтаж наращивается уже поверх корректной временной модели.",
    backend_output_idle: "Здесь отображаются статус встроенных компонентов и выбранная конфигурация backend.",
    browse_btn: "Обзор",
    placeholder_video_path: "C:\\Video\\camera.mp4",
    placeholder_audio_path: "C:\\Audio\\master.wav",
    placeholder_output_path: "C:\\Video\\out или C:\\Video\\result.mp4",
    placeholder_remote_client_path: "ffmpeg-over-ip-client",
    placeholder_remote_address: "127.0.0.1:5050",
    placeholder_remote_secret: "shared-secret",
    placeholder_camera_paths: "/path/to/cam1.mp4\n/path/to/cam2.mp4\n/path/to/cam3.mp4",
    placeholder_aligned_dir: "C:\\Video\\aligned или оставить пустым",
    placeholder_multicam_render_output: "C:\\Video\\out или C:\\Video\\master_multicam.mp4",
    system_http: "HTTP",
    system_ffmpeg_missing: "не найден",
    system_ffprobe_missing: "не найден",
    system_unavailable: "Системная информация недоступна",
    unit_seconds_short: "сек",
    unit_milliseconds_short: "мс",
    status_sync_analyzing: "Анализирую смещение...",
    status_sync_rendering: "Запускаю точный рендер...",
    status_multicam_analyzing: "Считаю смещения по камерам...",
    status_multicam_exporting: "Готовлю ffmpeg-команды по камерам...",
    status_multicam_rendering: "Запускаю точный multicam-рендер...",
    label_delay: "Смещение",
    label_confidence: "Уверенность",
    label_video_duration: "Длительность видео",
    label_audio_duration: "Длительность аудио",
    label_render_complete: "Рендер завершен.",
    label_offset_used: "Использованное смещение",
    label_saved_to: "Сохранено в",
    label_elapsed: "Время выполнения",
    label_command: "Команда",
    label_camera: "Камера",
    label_duration: "Длительность",
    label_note: "Примечание",
    label_output: "Выходной файл",
    label_strategy: "Стратегия",
    label_multicam_render_complete: "Multicam-рендер завершен.",
    label_timeline_duration: "Длительность таймлайна",
    label_shots: "Количество планов",
    label_shot_plan_preview: "Предпросмотр плана склеек",
    label_more_segments: "... и еще {count} сегментов",
    label_system_manifest: "Встроенные компоненты",
    label_unknown_request_error: "Неизвестная ошибка запроса",
    mode_cpu: "Локальный CPU",
    mode_gpu: "Локальный GPU",
    mode_remote: "Удаленный ffmpeg-over-ip",
  },
  en: {
    document_title: "AutoSync Studio 1.0.21",
    app_title: "AutoSync Studio 1.0.21",
    hero_subtitle: "A rebuilt version focused on exact sync instead of fragile automation.",
    tab_sync: "Single-Cam Sync",
    tab_multicam: "Multicam",
    tab_backend: "Render Backend",
    studio_single_subtitle: "For the case where you have a camera video and a separate master audio file.",
    multicam_subtitle: "First we measure every camera offset against the master audio honestly, and only then build an exact render without hidden magic.",
    backend_panel_subtitle: "A single execution backend for both single-cam and multicam: local CPU, local GPU, or remote ffmpeg-over-ip.",
    label_video_path: "Video path",
    label_video_path_short: "Video",
    label_audio_path: "Master audio path",
    label_audio_path_short: "Audio",
    label_analyze_seconds: "Analysis length in seconds",
    label_analyze_short: "Analysis sec",
    label_max_lag: "Maximum offset search window",
    label_max_lag_short: "Max offset",
    label_output_path: "Output render path",
    label_output_short: "Save",
    label_crf: "CRF",
    label_crf_short: "Quality",
    label_preset: "Encoding preset",
    label_preset_short: "Speed",
    backend_title: "Execution backend",
    label_execution_mode: "Where to render",
    label_execution_short: "Mode",
    label_remote_client_path: "ffmpeg-over-ip client path",
    label_client_short: "Client",
    label_remote_address: "Server address",
    label_remote_address_short: "Address",
    label_remote_secret: "Shared secret",
    label_remote_secret_short: "Secret",
    btn_analyze_sync: "Analyze",
    btn_render_sync: "Render",
    btn_cancel: "Cancel",
    sync_output_idle: "Offset analysis and exact render results will appear here.",
    sync_note: "If the offset is positive, the master audio starts earlier. If it is negative, the camera video starts earlier.",
    sync_terms_note: "`Analysis sec` is how many initial seconds to compare. `Max offset` is the widest desync search window. `Quality (CRF)` controls quality versus file size: lower means better quality. `Speed` controls how fast encoding runs.",
    label_master_audio: "Master audio path",
    label_master_audio_short: "Master",
    label_camera_paths: "Camera files, one per line",
    label_camera_paths_short: "Cameras",
    label_aligned_dir: "Where to save aligned clips",
    label_aligned_dir_short: "Save",
    label_aligned_crf: "CRF for aligned clips",
    label_aligned_crf_short: "CRF",
    label_multicam_render_output: "Where to save the final multicam render",
    label_final_short: "Save",
    label_primary_camera: "Главная камера",
    label_primary_short: "Главная камера",
    label_shot_window: "Shot analysis window, sec",
    label_shot_window_short: "Window",
    label_min_shot: "Minimum shot length, sec",
    label_min_shot_short: "Min Shot",
    multicam_backend_note: "Export and final multicam rendering use the same backend as the single-cam mode.",
    btn_analyze_multicam: "Analyze",
    btn_export_commands: "Export commands",
    btn_render_final: "Render",
    status_render_cancelled: "Render cancelled by user.",
    status_progress: "Progress",
    multicam_output_idle: "Measured offsets, export commands, and shot plan preview will appear here.",
    multicam_note: "This is the new project architecture: reliable diagnosis first, exact rendering second. Auto-editing is layered on top of a correct time model.",
    backend_output_idle: "Bundled component status and the active backend configuration are shown here.",
    browse_btn: "Browse",
    placeholder_video_path: "C:\\Video\\camera.mp4",
    placeholder_audio_path: "C:\\Audio\\master.wav",
    placeholder_output_path: "C:\\Video\\out or C:\\Video\\result.mp4",
    placeholder_remote_client_path: "ffmpeg-over-ip-client",
    placeholder_remote_address: "127.0.0.1:5050",
    placeholder_remote_secret: "shared-secret",
    placeholder_camera_paths: "/path/to/cam1.mp4\n/path/to/cam2.mp4\n/path/to/cam3.mp4",
    placeholder_aligned_dir: "C:\\Video\\aligned or leave empty",
    placeholder_multicam_render_output: "C:\\Video\\out or C:\\Video\\master_multicam.mp4",
    system_http: "HTTP",
    system_ffmpeg_missing: "not found",
    system_ffprobe_missing: "not found",
    system_unavailable: "System info unavailable",
    unit_seconds_short: "sec",
    unit_milliseconds_short: "ms",
    status_sync_analyzing: "Analyzing offset...",
    status_sync_rendering: "Starting exact render...",
    status_multicam_analyzing: "Measuring camera offsets...",
    status_multicam_exporting: "Preparing ffmpeg camera commands...",
    status_multicam_rendering: "Starting exact multicam render...",
    label_delay: "Delay",
    label_confidence: "Confidence",
    label_video_duration: "Video duration",
    label_audio_duration: "Audio duration",
    label_render_complete: "Render complete.",
    label_offset_used: "Offset used",
    label_saved_to: "Saved to",
    label_elapsed: "Elapsed",
    label_command: "Command",
    label_camera: "Camera",
    label_duration: "Duration",
    label_note: "Note",
    label_output: "Output",
    label_strategy: "Strategy",
    label_multicam_render_complete: "Multicam render complete.",
    label_timeline_duration: "Timeline duration",
    label_shots: "Shots",
    label_shot_plan_preview: "Shot plan preview",
    label_more_segments: "... and {count} more segments",
    label_system_manifest: "Bundled components",
    label_unknown_request_error: "Unknown request error",
    mode_cpu: "Local CPU",
    mode_gpu: "Local GPU",
    mode_remote: "Remote ffmpeg-over-ip",
  },
};

Object.assign(I18N.ru, {
  document_title: "AutoSync Studio",
  app_title: "AutoSync Studio",
  label_primary_camera: "Основная камера",
  label_primary_short: "Основная камера",
  label_preview_short: "Превью",
  preview_full: "Весь файл",
  preview_2min: "2 минуты",
  preview_5min: "5 минут",
  label_edit_mode_short: "Режим",
  edit_mode_classic: "Классический",
  edit_mode_ai: "Smart AI",
  label_analysis_settings: "Параметры анализа",
  label_ai_settings: "AI настройки",
  toggle_show: "Показать",
  toggle_hide: "Скрыть",
  label_assembly_ai_short: "AssemblyAI",
  label_ai_provider_short: "AI",
  ai_provider_off: "Выключено",
  ai_provider_gemini: "Gemini",
  ai_provider_openai: "OpenAI",
  label_ai_key_short: "AI Key",
  label_shorts_short: "Shorts",
  label_ai_prompt_short: "AI Prompt",
  label_shorts_plan_short: "Shorts Plan",
  btn_plan_shorts: "Построить",
  placeholder_assembly_ai_key: "AssemblyAI API key",
  placeholder_ai_key: "Gemini / OpenAI API key",
  placeholder_ai_prompt: "Найди эмоционально сильные хайлайты и полезные шортсы",
  status_plan_shorts: "Собираю shorts plan...",
});

Object.assign(I18N.en, {
  document_title: "AutoSync Studio",
  app_title: "AutoSync Studio",
  label_primary_camera: "Primary camera",
  label_primary_short: "Primary camera",
  label_preview_short: "Preview",
  preview_full: "Whole file",
  preview_2min: "2 minutes",
  preview_5min: "5 minutes",
  label_edit_mode_short: "Mode",
  edit_mode_classic: "Classic",
  edit_mode_ai: "Smart AI",
  label_analysis_settings: "Analysis settings",
  label_ai_settings: "AI settings",
  toggle_show: "Show",
  toggle_hide: "Hide",
  label_assembly_ai_short: "AssemblyAI",
  label_ai_provider_short: "AI",
  ai_provider_off: "Off",
  ai_provider_gemini: "Gemini",
  ai_provider_openai: "OpenAI",
  label_ai_key_short: "AI Key",
  label_shorts_short: "Shorts",
  label_ai_prompt_short: "AI Prompt",
  label_shorts_plan_short: "Shorts Plan",
  btn_plan_shorts: "Build",
  placeholder_assembly_ai_key: "AssemblyAI API key",
  placeholder_ai_key: "Gemini / OpenAI API key",
  placeholder_ai_prompt: "Find emotionally strong highlights and useful short clips",
  status_plan_shorts: "Building shorts plan...",
});

const syncOutput = document.getElementById("syncOutput");
const multicamOutput = document.getElementById("multicamOutput");
const backendOutput = document.getElementById("backendOutput");
const langRuBtn = document.getElementById("langRuBtn");
const langEnBtn = document.getElementById("langEnBtn");
const tabs = ["Sync", "Multicam", "Backend"];

let currentLanguage = loadLanguage();
let lastDelaySeconds = null;
let lastMulticamResult = null;
let currentTab = "Sync";
let activeRenderOutput = null;
let currentSystemDisplayName = "";

Object.assign(I18N.ru, {
  confirm_sync_preview_render: "Budet sdelan tolko preview-render single-cam na {seconds}. Prodolzhit?",
  confirm_multicam_preview_render: "Budet sdelan tolko preview-render multicam na {seconds}. Prodolzhit?",
  label_preview_render: "Preview render",
  label_offsets_source_cached: "Offsets reused from the last Analyze",
  label_offsets_source_fresh: "Offsets recalculated during Render",
});

Object.assign(I18N.en, {
  confirm_sync_preview_render: "This will render only a single-cam preview for {seconds}. Continue?",
  confirm_multicam_preview_render: "This will render only a multicam preview for {seconds}. Continue?",
  label_preview_render: "Preview render",
  label_offsets_source_cached: "Offsets reused from the last Analyze",
  label_offsets_source_fresh: "Offsets recalculated during Render",
});

function normalizeComparablePath(value) {
  return String(value || "").trim().replace(/\//g, "\\").toLowerCase();
}

function previewLabel(seconds) {
  if (seconds === 120) {
    return t("preview_2min");
  }
  if (seconds === 300) {
    return t("preview_5min");
  }
  return `${seconds} ${t("unit_seconds_short")}`;
}

function confirmPreviewRender(seconds, mode) {
  if (!(seconds > 0)) {
    return true;
  }
  const key = mode === "multicam" ? "confirm_multicam_preview_render" : "confirm_sync_preview_render";
  return window.confirm(t(key, { seconds: previewLabel(seconds) }));
}

function loadLanguage() {
  const saved = localStorage.getItem(STORAGE_LANGUAGE_KEY);
  return saved && I18N[saved] ? saved : DEFAULT_LANGUAGE;
}

async function loadStoredSecrets() {
  const assemblyAiKeyNode = document.getElementById("assemblyAiKey");
  const aiKeyNode = document.getElementById("aiKey");
  try {
    const settings = await request("/api/settings");
    if (assemblyAiKeyNode) {
      assemblyAiKeyNode.value = settings.assemblyAiKey || "";
    }
    if (aiKeyNode) {
      aiKeyNode.value = settings.aiKey || "";
    }
  } catch (_) {
  }
  const persist = async () => {
    try {
      await request("/api/settings", {
        assemblyAiKey: assemblyAiKeyNode ? assemblyAiKeyNode.value : "",
        aiKey: aiKeyNode ? aiKeyNode.value : "",
      });
    } catch (_) {
    }
  };
  if (assemblyAiKeyNode) {
    assemblyAiKeyNode.addEventListener("change", persist);
    assemblyAiKeyNode.addEventListener("blur", persist);
  }
  if (aiKeyNode) {
    aiKeyNode.addEventListener("change", persist);
    aiKeyNode.addEventListener("blur", persist);
  }
}

function t(key, replacements = {}) {
  const dict = I18N[currentLanguage] || I18N[DEFAULT_LANGUAGE];
  let template = dict[key] ?? I18N[DEFAULT_LANGUAGE][key] ?? key;
  Object.entries(replacements).forEach(([name, value]) => {
    template = template.replaceAll(`{${name}}`, String(value));
  });
  return template;
}

function setNodeText(selector, text) {
  const node = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (node) {
    node.textContent = text;
  }
}

function updateTitleFromState() {
  const displayName = currentSystemDisplayName || t("app_title");
  document.title = displayName;
  setNodeText("#appTitle", displayName);
}

function setSelectOptionText(selectId, labelsByValue) {
  const select = document.getElementById(selectId);
  if (!select) {
    return;
  }
  Array.from(select.options).forEach((option) => {
    if (Object.prototype.hasOwnProperty.call(labelsByValue, option.value)) {
      option.textContent = labelsByValue[option.value];
    }
  });
}

function configureDetailsSummary(details, labelText) {
  if (!details) {
    return;
  }
  const summary = details.querySelector("summary");
  if (!summary) {
    return;
  }

  let labelNode = summary.querySelector(".advanced-toggle-label");
  if (!labelNode) {
    labelNode = Array.from(summary.children).find((node) => (
      node.tagName === "SPAN" && !node.classList.contains("advanced-toggle-state")
    ));
    if (labelNode) {
      labelNode.classList.add("advanced-toggle-label");
    } else {
      const existingText = summary.textContent.trim();
      summary.textContent = "";
      labelNode = document.createElement("span");
      labelNode.className = "advanced-toggle-label";
      labelNode.textContent = existingText;
      summary.appendChild(labelNode);
    }
  }
  labelNode.textContent = labelText;

  let stateNode = summary.querySelector(".advanced-toggle-state");
  if (!stateNode) {
    stateNode = document.createElement("span");
    stateNode.className = "advanced-toggle-state";
    summary.appendChild(stateNode);
  }
  stateNode.textContent = details.open ? t("toggle_hide") : t("toggle_show");

  if (!details.dataset.toggleBound) {
    details.addEventListener("toggle", () => {
      stateNode.textContent = details.open ? t("toggle_hide") : t("toggle_show");
    });
    details.dataset.toggleBound = "true";
  }
}

function normalizeSyncLayout() {
  const qualityGroup = document.querySelector("#crf")?.closest(".input-group");
  const speedGroup = document.querySelector("#preset")?.closest(".input-group");
  const previewGroup = document.querySelector("#previewMode")?.closest(".input-group");
  const optionsGrid = qualityGroup?.parentElement;

  if (
    !qualityGroup ||
    !speedGroup ||
    !previewGroup ||
    !optionsGrid ||
    !optionsGrid.classList.contains("options-grid")
  ) {
    return;
  }

  if (!optionsGrid.dataset.normalized) {
    optionsGrid.replaceWith(qualityGroup, speedGroup, previewGroup);
    optionsGrid.dataset.normalized = "true";
  }
}

function applyStaticLabels() {
  setNodeText("#analysisSettingsLabel", t("label_analysis_settings"));
  setNodeText("#analyzeSecondsLabel", t("label_analyze_short"));
  setNodeText("#maxLagSecondsLabel", t("label_max_lag_short"));

  setNodeText(document.querySelector("#previewMode")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_preview_short"));
  setNodeText(document.querySelector("#multicamPreviewMode")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_preview_short"));
  setNodeText(document.querySelector("#editMode")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_edit_mode_short"));
  setNodeText(document.querySelector("#assemblyAiKey")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_assembly_ai_short"));
  setNodeText(document.querySelector("#aiProvider")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_ai_provider_short"));
  setNodeText(document.querySelector("#aiKey")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_ai_key_short"));
  setNodeText(document.querySelector("#shortsCount")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_shorts_short"));
  setNodeText(document.querySelector("#aiPrompt")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_ai_prompt_short"));
  setNodeText(document.querySelector("#planShortsBtn")?.closest(".input-group")?.querySelector(".input-prefix"), t("label_shorts_plan_short"));

  const assemblyAiKeyNode = document.getElementById("assemblyAiKey");
  if (assemblyAiKeyNode) {
    assemblyAiKeyNode.setAttribute("placeholder", t("placeholder_assembly_ai_key"));
  }
  const aiKeyNode = document.getElementById("aiKey");
  if (aiKeyNode) {
    aiKeyNode.setAttribute("placeholder", t("placeholder_ai_key"));
  }
  const aiPromptNode = document.getElementById("aiPrompt");
  if (aiPromptNode) {
    aiPromptNode.setAttribute("placeholder", t("placeholder_ai_prompt"));
  }

  setNodeText("#planShortsBtn", t("btn_plan_shorts"));

  configureDetailsSummary(document.querySelector("#viewSync .advanced-toggle"), t("label_analysis_settings"));
  configureDetailsSummary(document.querySelector("#viewBackend .advanced-toggle"), t("label_ai_settings"));

  setSelectOptionText("previewMode", {
    0: t("preview_full"),
    120: t("preview_2min"),
    300: t("preview_5min"),
  });
  setSelectOptionText("multicamPreviewMode", {
    0: t("preview_full"),
    120: t("preview_2min"),
    300: t("preview_5min"),
  });
  setSelectOptionText("editMode", {
    classic: t("edit_mode_classic"),
    ai: t("edit_mode_ai"),
  });
  setSelectOptionText("aiProvider", {
    "": t("ai_provider_off"),
    gemini: t("ai_provider_gemini"),
    openai: t("ai_provider_openai"),
  });
}

function setLanguage(language) {
  if (!I18N[language]) {
    return;
  }
  currentLanguage = language;
  localStorage.setItem(STORAGE_LANGUAGE_KEY, language);
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-option]").forEach((node) => {
    node.textContent = t(node.dataset.i18nOption);
  });

  applyStaticLabels();
  updateTitleFromState();
  langRuBtn.classList.toggle("active", language === "ru");
  langEnBtn.classList.toggle("active", language === "en");
}

function switchTab(tabName) {
  currentTab = tabName;
  tabs.forEach((tab) => {
    document.getElementById(`tab${tab}Btn`).classList.toggle("active", tab === tabName);
    document.getElementById(`view${tab}`).classList.toggle("active", tab === tabName);
  });
  syncOutput.classList.toggle("active", tabName === "Sync");
  multicamOutput.classList.toggle("active", tabName === "Multicam");
  backendOutput.classList.toggle("active", tabName === "Backend");
}

async function request(url, payload) {
  const response = await fetch(url, {
    method: payload ? "POST" : "GET",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || t("label_unknown_request_error"));
  }
  return data;
}

async function streamRequest(url, payload, onEvent) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || t("label_unknown_request_error"));
  }
  if (!response.body) {
    throw new Error("Streaming is unavailable in this runtime.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      const event = JSON.parse(trimmed);
      if (event.error) {
        throw new Error(event.error);
      }
      onEvent(event);
    }
  }

  if (buffer.trim()) {
    const event = JSON.parse(buffer.trim());
    if (event.error) {
      throw new Error(event.error);
    }
    onEvent(event);
  }
}

function buildProgressText(baseMessage, event, fallbackDoneText) {
  const lines = [baseMessage];
  if (typeof event.percent === "number" && Number.isFinite(event.percent)) {
    lines.push(`${t("status_progress")}: ${event.percent.toFixed(1)}%`);
  }
  if (event.message) {
    lines.push(event.message);
  }
  if (event.done) {
    lines.push(fallbackDoneText);
  }
  if (event.outputPath) {
    lines.push(`${t("label_saved_to")}: ${event.outputPath}`);
  }
  if (event.duration) {
    lines.push(`${t("label_elapsed")}: ${event.duration}`);
  }
  if (event.command) {
    lines.push("");
    lines.push(`${t("label_command")}:`);
    lines.push(event.command);
  }
  return lines.join("\n");
}

async function runStreamedRender(url, payload, outputNode, baseMessage, fallbackDoneText, onDone) {
  activeRenderOutput = outputNode;
  setOutput(outputNode, baseMessage, false);
  let lastEvent = null;
  try {
    await streamRequest(url, payload, (event) => {
      lastEvent = event;
      setOutput(outputNode, buildProgressText(baseMessage, event, fallbackDoneText), false);
    });
    if (!lastEvent || !lastEvent.done) {
      throw new Error("Render stream finished unexpectedly.");
    }
    if (onDone) {
      onDone(lastEvent);
    }
  } catch (error) {
    if (lastEvent && lastEvent.done) {
      if (onDone) {
        onDone(lastEvent);
      }
      return;
    }
    throw error;
  } finally {
    activeRenderOutput = null;
  }
}

async function pickFile(kind) {
  const result = await request("/api/pick-file", { kind });
  return (result.path || "").trim();
}

async function pickDirectory() {
  const result = await request("/api/pick-directory", {});
  return (result.path || "").trim();
}

async function pickSavePath(kind, path) {
  const result = await request("/api/pick-save", { kind, path });
  return (result.path || "").trim();
}

async function pathExists(path) {
  const result = await request("/api/path-exists", { path });
  return !!result.exists;
}

function setOutput(node, text, isError = false) {
  node.textContent = text;
  node.classList.toggle("error", isError);
}

function fmtSeconds(seconds) {
  const ms = Math.round(seconds * 1000);
  return `${seconds.toFixed(3)} ${t("unit_seconds_short")} (${ms} ${t("unit_milliseconds_short")})`;
}

function currentSyncPayload() {
  return {
    videoPath: document.getElementById("videoPath").value.trim(),
    audioPath: document.getElementById("audioPath").value.trim(),
    analyzeSeconds: Number(document.getElementById("analyzeSeconds").value || 180),
    maxLagSeconds: Number(document.getElementById("maxLagSeconds").value || 12),
  };
}

function currentBackendPayload() {
  return {
    executionMode: document.getElementById("executionMode").value,
    remoteAddress: document.getElementById("remoteAddress").value.trim(),
    remoteSecret: document.getElementById("remoteSecret").value.trim(),
    remoteClientPath: document.getElementById("remoteClientPath").value.trim(),
  };
}

function currentPreviewSeconds() {
  return Number(document.getElementById("previewMode").value || 0);
}

function resolveSyncRenderOutputPath() {
  const rawOutput = document.getElementById("outputPath").value.trim();
  const videoPath = document.getElementById("videoPath").value.trim().replace(/\//g, "\\");
  const videoBase = videoPath
    ? videoPath.replace(/.*\\/, "").replace(/\.[^.]+$/, "")
    : "camera";
  const defaultName = `${videoBase}_sync.mp4`;

  if (!rawOutput) {
    if (videoPath.includes("\\")) {
      return `${videoPath.replace(/\\[^\\]+$/, "")}\\${defaultName}`;
    }
    return defaultName;
  }

  const normalized = rawOutput.replace(/\//g, "\\");
  const looksLikeFile = /\.[^\\/.]+$/.test(normalized);
  if (looksLikeFile) {
    return normalized;
  }
  return `${normalized.replace(/\\+$/, "")}\\${defaultName}`;
}

function currentMulticamPreviewSeconds() {
  return Number(document.getElementById("multicamPreviewMode").value || 0);
}

function deriveMulticamAlignedDir() {
  const renderOutput = document.getElementById("multicamRenderOutput").value.trim();
  if (renderOutput) {
    const normalized = renderOutput.replace(/\//g, "\\");
    const looksLikeFile = /\.[^\\/.]+$/.test(normalized);
    const baseDir = looksLikeFile
      ? normalized.replace(/\\[^\\]+$/, "")
      : normalized.replace(/\\+$/, "");
    if (baseDir) {
      return `${baseDir}\\aligned`;
    }
  }
  const masterAudioPath = document.getElementById("masterAudioPath").value.trim().replace(/\//g, "\\");
  if (masterAudioPath.includes("\\")) {
    return masterAudioPath.replace(/\\[^\\]+$/, "\\aligned");
  }
  return "";
}

function resolveMulticamRenderOutputPath() {
  const rawOutput = document.getElementById("multicamRenderOutput").value.trim();
  const masterAudioPath = document.getElementById("masterAudioPath").value.trim().replace(/\//g, "\\");
  const masterBase = masterAudioPath
    ? masterAudioPath.replace(/.*\\/, "").replace(/\.[^.]+$/, "")
    : "master";
  const defaultName = `${masterBase}_multicam.mp4`;

  if (!rawOutput) {
    if (masterAudioPath.includes("\\")) {
      return `${masterAudioPath.replace(/\\[^\\]+$/, "")}\\${defaultName}`;
    }
    return defaultName;
  }

  const normalized = rawOutput.replace(/\//g, "\\");
  const looksLikeFile = /\.[^\\/.]+$/.test(normalized);
  if (looksLikeFile) {
    return normalized;
  }
  return `${normalized.replace(/\\+$/, "")}\\${defaultName}`;
}

function currentMulticamPayload() {
  return {
    masterAudioPath: document.getElementById("masterAudioPath").value.trim(),
    cameraPaths: [
      document.getElementById("camera1Path").value.trim(),
      document.getElementById("camera2Path").value.trim(),
      document.getElementById("camera3Path").value.trim(),
      document.getElementById("camera4Path").value.trim(),
    ].filter(Boolean),
    analyzeSeconds: Number(document.getElementById("analyzeSeconds").value || 180),
    maxLagSeconds: Number(document.getElementById("maxLagSeconds").value || 12),
  };
}

function multicamAnalysisSignature(payload) {
  return JSON.stringify({
    masterAudioPath: normalizeComparablePath(payload.masterAudioPath),
    cameraPaths: payload.cameraPaths.map((item) => normalizeComparablePath(item)),
    analyzeSeconds: Number(payload.analyzeSeconds || 0),
    maxLagSeconds: Number(payload.maxLagSeconds || 0),
  });
}

function reusableMulticamMeasuredCameras(payload) {
  if (!lastMulticamResult || !Array.isArray(lastMulticamResult.cameras)) {
    return [];
  }
  if (lastMulticamResult.analysisSignature !== multicamAnalysisSignature(payload)) {
    return [];
  }
  return lastMulticamResult.cameras;
}

function currentAISettings() {
  return {
    editMode: document.getElementById("editMode").value,
    assemblyAiKey: document.getElementById("assemblyAiKey").value.trim(),
    aiProvider: document.getElementById("aiProvider").value,
    aiKey: document.getElementById("aiKey").value.trim(),
    aiPrompt: document.getElementById("aiPrompt").value.trim(),
  };
}

function decodeDroppedURI(value) {
  if (!value) {
    return "";
  }
  if (value.startsWith("file://")) {
    try {
      return decodeURIComponent(new URL(value).pathname);
    } catch (_) {
      return value;
    }
  }
  return value;
}

function collectDroppedPaths(event) {
  const files = Array.from(event.dataTransfer?.files || []);
  const filePaths = files
    .map((file) => file.path || file.name || "")
    .filter(Boolean);
  if (filePaths.length > 0) {
    return filePaths;
  }

  const uriList = (event.dataTransfer?.getData("text/uri-list") || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(decodeDroppedURI);
  if (uriList.length > 0) {
    return uriList;
  }

  const plainText = event.dataTransfer?.getData("text/plain") || "";
  return plainText
    .split("\n")
    .map((item) => decodeDroppedURI(item.trim()))
    .filter(Boolean);
}

function wireDropTarget(element, { multiple = false } = {}) {
  const targetField = element.matches("input, textarea, select")
    ? element
    : element.querySelector("input, textarea, select");
  if (!targetField) {
    return;
  }
  const enter = (event) => {
    event.preventDefault();
    element.classList.add("drop-active");
  };
  const leave = (event) => {
    event.preventDefault();
    element.classList.remove("drop-active");
  };
  const over = (event) => {
    event.preventDefault();
  };
  const drop = (event) => {
    event.preventDefault();
    element.classList.remove("drop-active");
    const paths = collectDroppedPaths(event);
    if (paths.length === 0) {
      return;
    }
    targetField.value = multiple ? paths.join("\n") : paths[0];
  };

  element.addEventListener("dragenter", enter);
  element.addEventListener("dragleave", leave);
  element.addEventListener("dragover", over);
  element.addEventListener("drop", drop);
}

async function loadSystem() {
  try {
    const info = await request("/api/system");
    const displayName = `${info.name} ${info.version}`;
    currentSystemDisplayName = displayName;
    updateTitleFromState();
    const chips = [
      displayName,
      `${t("system_http")}: ${info.address}`,
      `ffmpeg: ${info.ffmpegPath || t("system_ffmpeg_missing")}`,
      `ffprobe: ${info.ffprobePath || t("system_ffprobe_missing")}`,
    ];
    if (Array.isArray(info.bundledComponents) && info.bundledComponents.length > 0) {
      chips.push(...info.bundledComponents.map((item) => `${item.name}: ${item.version}`));
    }
    const systemInfoNode = document.getElementById("systemInfo");
    if (systemInfoNode) {
      systemInfoNode.replaceChildren(...chips.map((item) => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = item;
        return chip;
      }));
    }
    setOutput(
      backendOutput,
      [
        displayName,
        `${t("system_http")}: ${info.address}`,
        `ffmpeg: ${info.ffmpegPath || t("system_ffmpeg_missing")}`,
        `ffprobe: ${info.ffprobePath || t("system_ffprobe_missing")}`,
        "",
        ...((info.bundledComponents || []).map((item) => `${item.name}: ${item.version}`)),
      ].join("\n"),
      false,
    );
  } catch (error) {
    currentSystemDisplayName = "";
    updateTitleFromState();
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `${t("system_unavailable")}: ${error.message}`;
    document.getElementById("systemInfo").replaceChildren(chip);
    setOutput(backendOutput, `${t("system_unavailable")}: ${error.message}`, true);
  }
}

document.getElementById("analyzeSyncBtn").addEventListener("click", async () => {
  setOutput(syncOutput, t("status_sync_analyzing"), false);
  try {
    const result = await request("/api/analyze-sync", currentSyncPayload());
    lastDelaySeconds = result.delaySeconds;
    setOutput(
      syncOutput,
      [
        `${t("label_delay")}: ${fmtSeconds(result.delaySeconds)}`,
        `${t("label_confidence")}: ${result.confidence}`,
        `${t("label_video_duration")}: ${result.videoDuration} ${t("unit_seconds_short")}`,
        `${t("label_audio_duration")}: ${result.audioDuration} ${t("unit_seconds_short")}`,
        "",
        result.recommendation,
        result.renderSummary,
      ].join("\n"),
      false,
    );
  } catch (error) {
    setOutput(syncOutput, error.message, true);
  }
});

document.getElementById("renderSyncBtn").addEventListener("click", async () => {
  try {
    const payload = currentSyncPayload();
    const result = await request("/api/analyze-sync", payload);
    lastDelaySeconds = result.delaySeconds;
    const previewSeconds = currentPreviewSeconds();
    if (!confirmPreviewRender(previewSeconds, "sync")) {
      return;
    }

    await runStreamedRender("/api/render-sync-stream", {
      videoPath: payload.videoPath,
      audioPath: payload.audioPath,
      outputPath: document.getElementById("outputPath").value.trim(),
      previewSeconds,
      delaySeconds: lastDelaySeconds,
      crf: Number(document.getElementById("crf").value || 18),
      preset: document.getElementById("preset").value,
      ...currentBackendPayload(),
    }, syncOutput, t("status_sync_rendering"), t("label_render_complete"), (renderResult) => {
      setOutput(
        syncOutput,
        [
          t("label_render_complete"),
          `${t("label_offset_used")}: ${fmtSeconds(lastDelaySeconds)}`,
          previewSeconds > 0 ? `${t("label_preview_render")}: ${previewLabel(previewSeconds)}` : "",
          `${t("label_saved_to")}: ${renderResult.outputPath}`,
          `${t("label_elapsed")}: ${renderResult.duration}`,
          "",
          `${t("label_command")}:`,
          renderResult.command,
        ].join("\n"),
        false,
      );
    });
  } catch (error) {
    setOutput(syncOutput, error.message, true);
  }
});

document.getElementById("analyzeMulticamBtn").addEventListener("click", async () => {
  setOutput(multicamOutput, t("status_multicam_analyzing"), false);
  try {
    const payload = currentMulticamPayload();
    const result = await request("/api/analyze-multicam", payload);
    const exportResult = await request("/api/export-multicam-plan", {
      ...payload,
      measuredCameras: result.cameras,
      outputDir: deriveMulticamAlignedDir(),
      crf: Number(document.getElementById("multicamCrf").value || 18),
      preset: document.getElementById("multicamPreset").value,
      ...currentBackendPayload(),
    });
    lastMulticamResult = {
      ...result,
      exportPlan: exportResult,
      analysisSignature: multicamAnalysisSignature(payload),
    };

    const analysisLines = result.cameras.map((camera, index) => {
      return [
        `${t("label_camera")} ${index + 1}: ${camera.path}`,
        `  ${t("label_delay")}: ${fmtSeconds(camera.delaySeconds)}`,
        `  ${t("label_confidence")}: ${camera.confidence}`,
        `  ${t("label_duration")}: ${camera.duration} ${t("unit_seconds_short")}`,
        `  ${t("label_note")}: ${camera.recommendation}`,
      ].join("\n");
    });

    const exportLines = exportResult.plans.map((plan, index) => {
      return [
        `${t("label_camera")} ${index + 1}: ${plan.path}`,
        `${t("label_delay")}: ${fmtSeconds(plan.delaySeconds)}`,
        `${t("label_confidence")}: ${plan.confidence}`,
        `${t("label_output")}: ${plan.outputPath}`,
        `${t("label_strategy")}: ${plan.strategy}`,
        `${t("label_command")}:`,
        plan.command,
      ].join("\n");
    });

    setOutput(multicamOutput, [...analysisLines, exportResult.note, "", ...exportLines].join("\n\n"), false);
  } catch (error) {
    setOutput(multicamOutput, error.message, true);
  }
});

document.getElementById("renderMulticamBtn").addEventListener("click", async () => {
  const requestedOutputPath = document.getElementById("multicamRenderOutput").value.trim();
  const resolvedOutputPath = resolveMulticamRenderOutputPath();
  const previewSeconds = currentMulticamPreviewSeconds();
  try {
    const payload = currentMulticamPayload();
    if (!confirmPreviewRender(previewSeconds, "multicam")) {
      return;
    }
    const measuredCameras = reusableMulticamMeasuredCameras(payload);
    await runStreamedRender("/api/render-multicam-stream", {
      ...payload,
      measuredCameras,
      outputPath: requestedOutputPath,
      previewSeconds,
      crf: Number(document.getElementById("multicamCrf").value || 18),
      preset: document.getElementById("multicamPreset").value,
      shotWindowSeconds: 1,
      minShotSeconds: 2.5,
      primaryCamera: Number(document.getElementById("primaryCamera").value || 1),
      ...currentAISettings(),
      ...currentBackendPayload(),
    }, multicamOutput, t("status_multicam_rendering"), t("label_multicam_render_complete"), (result) => {
      lastMulticamResult = { ...(lastMulticamResult || {}), ...result };
      const totalTimelineSeconds = typeof result.totalSeconds === "number"
        ? result.totalSeconds
        : result.totalTime;

      const shotLines = result.shots.slice(0, 12).map((shot) => {
        return `${t("label_camera")} ${shot.cameraIndex}: ${fmtSeconds(shot.start)} -> ${fmtSeconds(shot.end)}`;
      });
      const moreShots = result.shots.length > 12
        ? [t("label_more_segments", { count: result.shots.length - 12 })]
        : [];

      setOutput(
        multicamOutput,
        [
          t("label_multicam_render_complete"),
          `${measuredCameras.length > 0 ? t("label_offsets_source_cached") : t("label_offsets_source_fresh")}`,
          previewSeconds > 0 ? `${t("label_preview_render")}: ${previewLabel(previewSeconds)}` : "",
          `${t("label_saved_to")}: ${result.outputPath}`,
          `${t("label_elapsed")}: ${result.duration}`,
          `${t("label_timeline_duration")}: ${totalTimelineSeconds} ${t("unit_seconds_short")}`,
          `${t("label_shots")}: ${result.shots.length}`,
          "",
          `${t("label_command")}:`,
          result.command,
          "",
          `${t("label_shot_plan_preview")}:`,
          ...shotLines,
          ...moreShots,
        ].join("\n"),
        false,
      );
    });
  } catch (error) {
    if (/network error/i.test(String(error.message || "")) && resolvedOutputPath) {
      try {
        if (await pathExists(resolvedOutputPath)) {
          setOutput(
            multicamOutput,
            [
              t("label_multicam_render_complete"),
              `${measuredCameras.length > 0 ? t("label_offsets_source_cached") : t("label_offsets_source_fresh")}`,
              previewSeconds > 0 ? `${t("label_preview_render")}: ${previewLabel(previewSeconds)}` : "",
              `${t("label_saved_to")}: ${resolvedOutputPath}`,
              previewSeconds > 0 ? `${t("label_timeline_duration")}: ${previewLabel(previewSeconds)}` : "",
            ].filter(Boolean).join("\n"),
            false,
          );
          return;
        }
      } catch (_) {
      }
    }
    setOutput(multicamOutput, error.message, true);
  }
});

async function cancelCurrentRender() {
  if (!activeRenderOutput) {
    return;
  }
  try {
    await request("/api/cancel", {});
    setOutput(activeRenderOutput, t("status_render_cancelled"), false);
  } catch (error) {
    setOutput(activeRenderOutput, error.message, true);
  }
}

document.getElementById("cancelSyncBtn").addEventListener("click", cancelCurrentRender);
document.getElementById("cancelMulticamBtn").addEventListener("click", cancelCurrentRender);

document.getElementById("pickVideoBtn").addEventListener("click", async () => {
  try {
    const path = await pickFile("video");
    if (path) {
      document.getElementById("videoPath").value = path;
    }
  } catch (error) {
    setOutput(syncOutput, error.message, true);
  }
});

document.getElementById("pickAudioBtn").addEventListener("click", async () => {
  try {
    const path = await pickFile("audio");
    if (path) {
      document.getElementById("audioPath").value = path;
      lastDelaySeconds = null;
    }
  } catch (error) {
    setOutput(syncOutput, error.message, true);
  }
});

document.getElementById("pickOutputDirBtn").addEventListener("click", async () => {
  try {
    const path = await pickSavePath("sync-output", resolveSyncRenderOutputPath());
    if (path) {
      document.getElementById("outputPath").value = path;
    }
  } catch (error) {
    setOutput(syncOutput, error.message, true);
  }
});

["videoPath", "audioPath", "analyzeSeconds", "maxLagSeconds"].forEach((id) => {
  const node = document.getElementById(id);
  if (!node) {
    return;
  }
  node.addEventListener("input", () => {
    lastDelaySeconds = null;
  });
  node.addEventListener("change", () => {
    lastDelaySeconds = null;
  });
});

document.getElementById("pickMasterAudioBtn").addEventListener("click", async () => {
  try {
    const path = await pickFile("master-audio");
    if (path) {
      document.getElementById("masterAudioPath").value = path;
    }
  } catch (error) {
    setOutput(multicamOutput, error.message, true);
  }
});

[
  ["pickCamera1Btn", "camera1Path"],
  ["pickCamera2Btn", "camera2Path"],
  ["pickCamera3Btn", "camera3Path"],
  ["pickCamera4Btn", "camera4Path"],
].forEach(([buttonId, inputId]) => {
  document.getElementById(buttonId).addEventListener("click", async () => {
    try {
      const path = await pickFile("video");
      if (path) {
        document.getElementById(inputId).value = path;
      }
    } catch (error) {
      setOutput(multicamOutput, error.message, true);
    }
  });
});

document.getElementById("planShortsBtn").addEventListener("click", async () => {
  setOutput(backendOutput, t("status_plan_shorts"), false);
  try {
    const result = await request("/api/plan-shorts", {
      ...currentMulticamPayload(),
      primaryCamera: Number(document.getElementById("primaryCamera").value || 1),
      shortsCount: Number(document.getElementById("shortsCount").value || 3),
      ...currentAISettings(),
    });
    const lines = result.segments.map((segment, index) => {
      return [
        `Short ${index + 1}: ${segment.title}`,
        `  Start: ${fmtSeconds(segment.start)}`,
        `  End: ${fmtSeconds(segment.end)}`,
        `  Camera: ${segment.cameraHint || 1}`,
        `  Why: ${segment.reason}`,
        `  Command: ${segment.command}`,
      ].join("\n");
    });
    setOutput(backendOutput, [result.note, "", ...lines].join("\n\n"), false);
  } catch (error) {
    setOutput(backendOutput, error.message, true);
  }
});

document.getElementById("pickMulticamOutputDirBtn").addEventListener("click", async () => {
  try {
    const path = await pickSavePath("multicam-output", resolveMulticamRenderOutputPath());
    if (path) {
      document.getElementById("multicamRenderOutput").value = path;
    }
  } catch (error) {
    setOutput(multicamOutput, error.message, true);
  }
});

document.getElementById("pickRemoteClientBtn").addEventListener("click", async () => {
  try {
    const path = await pickFile("client");
    if (path) {
      document.getElementById("remoteClientPath").value = path;
    }
  } catch (error) {
    setOutput(backendOutput, error.message, true);
  }
});

langRuBtn.addEventListener("click", () => setLanguage("ru"));
langEnBtn.addEventListener("click", () => setLanguage("en"));
tabs.forEach((tab) => {
  document.getElementById(`tab${tab}Btn`).addEventListener("click", () => switchTab(tab));
});

wireDropTarget(document.getElementById("videoPathGroup"));
wireDropTarget(document.getElementById("audioPathGroup"));
wireDropTarget(document.getElementById("masterAudioPathGroup"));
wireDropTarget(document.getElementById("multicamRenderOutputGroup"));
wireDropTarget(document.getElementById("camera1Group"));
wireDropTarget(document.getElementById("camera2Group"));
wireDropTarget(document.getElementById("camera3Group"));
wireDropTarget(document.getElementById("camera4Group"));
wireDropTarget(document.getElementById("remoteClientPathGroup"));

normalizeSyncLayout();
setLanguage(currentLanguage);
switchTab(currentTab);
loadStoredSecrets();
loadSystem();

