document.addEventListener('DOMContentLoaded', () => {
  const registerPWA = () => {
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      const manifest = {
        name: 'Jornada do Guerreiro',
        short_name: 'Jornada',
        start_url: './',
        display: 'standalone',
        background_color: '#0b1220',
        theme_color: '#4f46e5',
        icons: [
          { src: 'https://placehold.co/192x192/4f46e5/ffffff?text=JG', sizes: '192x192', type: 'image/png' },
          { src: 'https://placehold.co/512x512/4f46e5/ffffff?text=JG', sizes: '512x512', type: 'image/png' }
        ]
      };
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestURL;
      document.head.appendChild(link);

      if ('serviceWorker' in navigator) {
        const swScript = `
          const CACHE_NAME = 'jornada-cache-v2';
          const urlsToCache = [
            './',
            'https://cdn.tailwindcss.com',
            'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
          ];

          self.addEventListener('install', event => {
            self.skipWaiting();
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then(cache => cache.addAll(urlsToCache))
            );
          });

          self.addEventListener('activate', event => {
            event.waitUntil(clients.claim());
          });

          self.addEventListener('fetch', event => {
            event.respondWith(
              caches.match(event.request)
                .then(response => {
                  if (response) {
                    return response;
                  }
                  return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, responseToCache);
                    });
                    return response;
                  });
                })
            );
          });
        `;
        const swBlob = new Blob([swScript], { type: 'application/javascript' });
        const swURL = URL.createObjectURL(swBlob);

        navigator.serviceWorker.register(swURL).catch(e => {
          console.error('Falha ao registrar o Service Worker: ', e);
        });
      }
    }
  };

  registerPWA();

  const screens = {
    setup: document.getElementById('setup-screen'),
    workout: document.getElementById('workout-screen'),
    finished: document.getElementById('finished-screen'),
  };
  const ui = {
    mainHeader: document.getElementById('main-header'),
    togglesSection: document.getElementById('toggles-section'),
    quickStart: document.getElementById('quick-start'),
    helpBtn: document.getElementById('help-btn'),
    helpModal: document.getElementById('help-modal'),
    closeHelpBtn: document.getElementById('close-help-btn'),
    backupBtn: document.getElementById('backup-btn'),
    restoreBtn: document.getElementById('restore-btn'),
    toggleVoice: document.getElementById('toggle-voice'),
    toggleBeep: document.getElementById('toggle-beep'),
    toggleVibrate: document.getElementById('toggle-vibrate'),
    toggle3sec: document.getElementById('toggle-3sec'),
    streakChip: document.getElementById('streak-chip'),
    toast: document.getElementById('toast'),
    advancedOptionsToggle: document.getElementById('advanced-options-toggle'),
    advancedOptionsContent: document.getElementById('advanced-options-content'),
    advancedOptionsArrow: document.getElementById('advanced-options-arrow'),
    monthlyProgressContainer: document.getElementById('monthly-progress-container'),
    monthlyGoalsContainer: document.getElementById('monthly-goals-container'),
    daysRadios: () => document.querySelectorAll('input[name="days-in-month"]'),
    addCustomExBtn: document.getElementById('add-custom-ex-btn'),
    resetGoalsBtn: document.getElementById('reset-goals-btn'),
    cyclesRadios: () => document.querySelectorAll('input[name="cycles"]'),
    restTimeRadios: () => document.querySelectorAll('input[name="restTime"]'),
    seriesRestTimeRadios: () => document.querySelectorAll('input[name="seriesRestTime"]'),
    exerciseSelectionContainer: document.getElementById('exercise-selection-container'),
    totalTimeDisplay: document.getElementById('totalTime'),
    orderBtn: document.getElementById('order-btn'),
    saveOrderBtn: document.getElementById('save-order-btn'),
    startBtn: document.getElementById('start-btn'),
    validationError: document.getElementById('validation-error'),
    viewGoalPlan: document.getElementById('view-goal-plan'),
    seriesDisplay: document.getElementById('series-display'),
    exerciseDisplay: document.getElementById('exercise-display'),
    timerValue: document.getElementById('timer-value'),
    repsContainer: document.getElementById('reps-container'),
    repsValue: document.getElementById('reps-value'),
    minusRepBtn: document.getElementById('minus-rep-btn'),
    plusRepBtn: document.getElementById('plus-rep-btn'),
    timerUnit: document.getElementById('timer-unit'),
    progressCircle: document.getElementById('timer-progress-circle'),
    pauseOverlay: document.getElementById('pause-overlay'),
    nextExerciseDisplay: document.getElementById('next-exercise-display'),
    pauseResumeBtn: document.getElementById('pause-resume-btn'),
    skipBtn: document.getElementById('skip-btn'),
    endBtn: document.getElementById('end-btn'),
    seriesRestDisplay: document.getElementById('series-rest-display'),
    seriesRestTimer: document.getElementById('series-rest-timer'),
    seriesRestProgressBar: document.getElementById('series-rest-progress-bar'),
    partialSummaryContainer: document.getElementById('partial-summary-container'),
    partialSummaryList: document.getElementById('partial-summary-list'),
    finishedTitle: document.getElementById('finished-title'),
    finishedSubtitle: document.getElementById('finished-subtitle'),
    summaryList: document.getElementById('summary-list'),
    copySummaryBtn: document.getElementById('copy-summary-btn'),
    restartBtn: document.getElementById('restart-btn'),
    addRetroBtn: document.getElementById('add-retro-btn'),
    retroModal: document.getElementById('retro-modal'),
    retroDateInput: document.getElementById('retro-date'),
    retroExerciseInputs: document.getElementById('retro-exercise-inputs'),
    cancelRetroBtn: document.getElementById('cancel-retro-btn'),
    saveRetroBtn: document.getElementById('save-retro-btn'),
    historyBtn: document.getElementById('history-btn'),
    historyModal: document.getElementById('history-modal'),
    historyList: document.getElementById('history-list'),
    closeHistoryBtn: document.getElementById('close-history-btn'),
    clearHistoryBtn: document.getElementById('clear-history-btn'),
    undoDeleteBtn: document.getElementById('undo-delete-btn'),
    historyMonthSelect: document.getElementById('history-month-select'),
    confirmModal: document.getElementById('confirm-modal'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    confirmCancel: document.getElementById('confirm-cancel'),
    confirmOk: document.getElementById('confirm-ok'),
    goalPlanModal: document.getElementById('goal-plan-modal'),
    goalPlanList: document.getElementById('goal-plan-list'),
    closeGoalPlanBtn: document.getElementById('close-goal-plan-btn'),
    applyPlanBtn: document.getElementById('apply-plan-btn'),
    addCustomExModal: document.getElementById('add-custom-ex-modal'),
    customExNameInput: document.getElementById('custom-ex-name'),
    customExTypeReps: document.querySelector('input[name="custom-ex-type"][value="reps"]'),
    customExTypeTime: document.querySelector('input[name="custom-ex-type"][value="time"]'),
    customExGoalInput: document.getElementById('custom-ex-goal'),
    cancelAddCustomBtn: document.getElementById('cancel-add-custom-btn'),
    saveCustomExBtn: document.getElementById('save-custom-ex-btn'),
  };

  const PREP_TIME = 10;
  const CIRCLE_LENGTH = 741;

  let wakeLock = null;

  let baseExercises = [
    { id: 'abdominais', name: 'Abdominais', t: 'reps', monthlyGoal: 6000, builtin: true },
    { id: 'agachamentos', name: 'Agachamentos', t: 'reps', monthlyGoal: 3000, builtin: true },
    { id: 'flexoes', name: 'Flexões', t: 'reps', monthlyGoal: 3000, builtin: true },
    { id: 'isometria', name: 'Cavalo', t: 'time', monthlyGoal: 5580, builtin: true },
    { id: 'prancha', name: 'Prancha', t: 'time', monthlyGoal: 3720, builtin: true },
  ];

  let appData = {};
  let workoutState = {
    timerInterval: null,
    isPaused: false,
    currentSeries: 0,
    currentExerciseIndex: -1,
    totalSeries: 1,
    restTime: 15,
    seriesRestTime: 30,
    currentWorkout: [],
    sessionLog: {},
    timerDetails: { timeLeft: 0, totalDuration: 0, startTime: 0 },
  };

  let lastDeleted = null;
  let confirmAction = null;

  let synth, speech;
  const setupAudio = async () => {
    if (synth) return;
    try {
      await Tone.start();
      synth = new Tone.Synth().toDestination();
    } catch (e) {
      console.warn('Não foi possível iniciar o áudio automaticamente.', e);
    }
    speech = window.speechSynthesis;
  };

  const playBeep = (note = 'G5', duration = '8n') => {
    if (!ui.toggleBeep.checked) return;
    if (synth) synth.triggerAttackRelease(note, duration);
  };

  const speak = (text) => {
    if (!ui.toggleVoice.checked) return;
    if (!speech) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = 1.05;
    speech.cancel();
    speech.speak(u);
  };

  const vib = (pattern = 50) => {
    if (!ui.toggleVibrate.checked) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const showToast = (message, duration = 3000) => {
    if (!ui.toast) return;
    ui.toast.textContent = message;
    ui.toast.classList.add('show');
    setTimeout(() => {
      ui.toast.classList.remove('show');
    }, duration);
  };

  const saveData = () => localStorage.setItem('jornadaGuerreiroData', JSON.stringify(appData));

  const loadData = () => {
    const saved = localStorage.getItem('jornadaGuerreiroData');
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (saved) {
      appData = JSON.parse(saved);
      appData.archive ??= {};
      appData.exerciseOrder ??= baseExercises.map(ex => ex.id);
      appData.dailySettings ??= {
        cycles: 3,
        restTime: 15,
        seriesRestTime: 30,
        daysInMonth: 31,
        enabledExercises: { abdominais: true, agachamentos: true, flexoes: true, isometria: false, prancha: false }
      };
      appData.customExercises ??= [];
      appData.flags ??= { voice: false, beep: true, vibrate: true, countdown: true };
      appData.streak ??= { lastDay: null, count: 0 };
    } else {
      appData = {
        currentChallenge: { year: currentYear, month: currentMonth },
        monthlyGoals: {},
        history: {},
        archive: {},
        exerciseOrder: baseExercises.map(ex => ex.id),
        dailySettings: {
          cycles: 3,
          restTime: 15,
          seriesRestTime: 30,
          daysInMonth: 31,
          enabledExercises: { abdominais: true, agachamentos: true, flexoes: true, isometria: false, prancha: false }
        },
        customExercises: [],
        flags: { voice: false, beep: true, vibrate: true, countdown: true },
        streak: { lastDay: null, count: 0 },
      };
      baseExercises.forEach(ex => appData.monthlyGoals[ex.id] = ex.monthlyGoal);
    }

    if (!appData.currentChallenge || appData.currentChallenge.year !== currentYear || appData.currentChallenge.month !== currentMonth) {
      const hasOldHistory = appData.history && Object.keys(appData.history).length > 0;
      const hasValidChallenge = appData.currentChallenge && appData.currentChallenge.year && appData.currentChallenge.month;
      if (hasOldHistory && hasValidChallenge) {
        showConfirmModal('Novo mês detectado!', 'Deseja arquivar o desafio anterior e iniciar um novo?', () => {
          if (!appData.archive) appData.archive = {};
          const archiveKey = `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;
          appData.archive[archiveKey] = { monthlyGoals: appData.monthlyGoals, history: appData.history };
          appData.history = {};
          appData.currentChallenge = { year: currentYear, month: currentMonth };
          saveData();
          location.reload();
        });
      } else {
        appData.currentChallenge = { year: currentYear, month: currentMonth };
        saveData();
      }
    }

    rebuildExercisesFromData();
    applySavedDailySettings();

    if (ui.toggleVoice) ui.toggleVoice.checked = !!appData.flags.voice;
    if (ui.toggleBeep) ui.toggleBeep.checked = !!appData.flags.beep;
    if (ui.toggleVibrate) ui.toggleVibrate.checked = !!appData.flags.vibrate;
    if (ui.toggle3sec) ui.toggle3sec.checked = !!appData.flags.countdown;

    saveData();
  };

  function rebuildExercisesFromData() {
    const customs = Array.isArray(appData.customExercises) ? appData.customExercises : [];
    const mapAll = [...baseExercises.filter(ex => ex.builtin), ...customs];
    mapAll.sort((a, b) => {
      const A = appData.exerciseOrder.indexOf(a.id);
      const B = appData.exerciseOrder.indexOf(b.id);
      return (A === -1 ? 9999 : A) - (B === -1 ? 9999 : B);
    });
    baseExercises = mapAll;
    baseExercises.forEach(ex => {
      if (typeof appData.monthlyGoals[ex.id] === 'undefined') {
        appData.monthlyGoals[ex.id] = ex.monthlyGoal || (ex.t === 'reps' ? 1000 : 1800);
      }
    });
    saveData();
  }

  const switchScreen = name => {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[name].classList.remove('hidden');

    if (name === 'workout') {
      ui.mainHeader?.classList.add('hidden');
      ui.togglesSection?.classList.add('hidden');
    } else {
      ui.mainHeader?.classList.remove('hidden');
      ui.togglesSection?.classList.remove('hidden');
    }
  };

  const fmtTime = (sec) => `${Math.floor(sec / 60)}m ${String(sec % 60).padStart(2, '0')}s`;

  function updateProgressDisplay() {
    ui.monthlyProgressContainer.innerHTML = '';
    const monthlyTotals = {};
    baseExercises.forEach(ex => monthlyTotals[ex.id] = 0);

    const trainingDays = Object.keys(appData.history || {}).length;

    for (const date in appData.history) {
      const sessions = appData.history[date];
      if (Array.isArray(sessions)) {
        sessions.forEach(session => {
          for (const exId in session.log) {
            if (monthlyTotals[exId] != null) monthlyTotals[exId] += session.log[exId];
          }
        });
      }
    }

    baseExercises.forEach(ex => {
      const goal = appData.monthlyGoals[ex.id] || 0;
      const done = monthlyTotals[ex.id] || 0;
      const remaining = Math.max(goal - done, 0);
      const average = trainingDays > 0 ? Math.ceil(done / trainingDays) : 0;
      const pct = goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : 0;

      const row = document.createElement('div');
      row.className = 'bg-gray-800/60 rounded-md p-3';
      row.innerHTML = `
        <div class="flex items-center justify-between gap-3 text-sm">
          <div class="font-bold">${ex.name}</div>
          <div class="text-right text-gray-300 flex flex-col sm:flex-row sm:items-center gap-2">
            <span>Média/Dia: <b class="text-white">${average}</b></span>
            <span>Feito: <b class="text-white">${done}</b></span>
            <span>Falta: <b class="text-white">${remaining}</b></span>
          </div>
        </div>
        <div class="progress-bar mt-2" aria-label="Progresso ${ex.name}">
          <div style="width:${pct}%"></div>
        </div>`;
      ui.monthlyProgressContainer.appendChild(row);
    });

    renderStreak();
  }

  function renderStreak() {
    const todayKey = new Date().toISOString().slice(0, 10);
    const trainedToday = !!(appData.history && appData.history[todayKey] && appData.history[todayKey].length);
    const count = appData.streak?.count || 0;
    if (!ui.streakChip) return;
    ui.streakChip.textContent = `🔥 Streak: ${count} dia${count === 1 ? '' : 's'}${trainedToday ? ' (hoje ✅)' : ''}`;
    ui.streakChip.classList.remove('hidden');
  }

  function renderSetupScreen() {
    ui.monthlyGoalsContainer.innerHTML = '';
    ui.exerciseSelectionContainer.innerHTML = '';

    baseExercises.forEach(ex => {
      const unit = ex.t === 'reps' ? 'reps' : 's';
      const monthlyEl = document.createElement('div');
      monthlyEl.className = 'flex items-center justify-between';
      monthlyEl.innerHTML = `
        <label for="input-monthly-${ex.id}" class="text-white">${ex.name}</label>
        <div class="flex items-center">
          <input type="number" id="input-monthly-${ex.id}" value="${appData.monthlyGoals[ex.id] ?? ex.monthlyGoal ?? 0}" class="w-24 bg-gray-900 border border-gray-600 rounded-md p-1 text-center focus:ring-2 focus:ring-indigo-500" inputmode="numeric" pattern="[0-9]*">
          <span class="ml-2 text-gray-400 w-8">${unit}</span>
        </div>`;
      ui.monthlyGoalsContainer.appendChild(monthlyEl);

      const isChecked = appData.dailySettings.enabledExercises?.[ex.id] ? 'checked' : '';
      const dailyEl = document.createElement('div');
      dailyEl.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900/40 p-3 rounded-md exercise-item';
      dailyEl.dataset.id = ex.id;

      const dailyUnit = ex.t === 'reps' ? 'reps' : 's';

      const perSeriesValue = Math.ceil((appData.monthlyGoals[ex.id] || 0) / (appData.dailySettings?.daysInMonth || 31) / (appData.dailySettings?.cycles || 3));
      const badgeContent = perSeriesValue > 0 ? `<span class="ml-2 px-2 py-1 text-xs font-semibold text-indigo-300 bg-indigo-900/50 rounded-full">≈ ${perSeriesValue} por série</span>` : '';

      dailyEl.innerHTML = `
        <div class="flex items-center w-full sm:w-auto">
          <span class="drag-handle hidden cursor-move mr-3">☰</span>
          <input id="check-daily-${ex.id}" type="checkbox" class="h-5 w-5 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" ${isChecked}>
          <label for="check-daily-${ex.id}" class="ml-3 text-white">${ex.name}${badgeContent}</label>
        </div>
        <div class="flex items-center w-full sm:w-auto mt-2 sm:mt-0 justify-end gap-2">
          <input type="number" id="input-daily-${ex.id}" value="0" class="w-24 bg-gray-700 border border-gray-600 rounded-md p-1 text-center focus:ring-2 focus:ring-indigo-500" inputmode="numeric" pattern="[0-9]*">
          <div class="unit-text w-28">
            <span class="text-gray-400 text-sm">${dailyUnit}/dia</span>
          </div>
          ${ex.builtin ? '<div class="w-6 h-6"></div>' : `<button data-del="${ex.id}" class="btn text-red-400 p-1 rounded-full hover:bg-gray-700" title="Remover"><i class="fas fa-trash-alt"></i></button>`}
        </div>`;
      ui.exerciseSelectionContainer.appendChild(dailyEl);
    });
  }

  function getDailyWorkout() {
    const selected = [];
    const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 1, 10);
    baseExercises.forEach(ex => {
      const checkbox = document.getElementById(`check-daily-${ex.id}`);
      if (checkbox && checkbox.checked) {
        const input = document.getElementById(`input-daily-${ex.id}`);
        selected.push({ ...ex, v: Math.ceil((parseInt(input.value, 10) || 0) / seriesCount) });
      }
    });
    return selected;
  }

  function calculateDailyGoals() {
    const selectedRadio = document.querySelector('input[name="days-in-month"]:checked');
    const days = selectedRadio ? parseInt(selectedRadio.value, 10) : 31;
    const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 1, 10);

    baseExercises.forEach(ex => {
      const monthlyInput = document.getElementById(`input-monthly-${ex.id}`);
      const dailyInput = document.getElementById(`input-daily-${ex.id}`);

      if (monthlyInput && dailyInput) {
        const monthlyGoal = parseInt(monthlyInput.value, 10) || 0;
        const dailyGoal = Math.ceil(monthlyGoal / days);
        dailyInput.value = dailyGoal;

        const perSeriesValue = Math.ceil(dailyGoal / seriesCount);

        const label = dailyInput.closest('.exercise-item')?.querySelector('label');
        if (label) {
          let badge = label.querySelector('.bg-indigo-900/50');
          if (perSeriesValue > 0) {
            if (!badge) {
              badge = document.createElement('span');
              badge.className = 'ml-2 px-2 py-1 text-xs font-semibold text-indigo-300 bg-indigo-900/50 rounded-full';
              label.appendChild(badge);
            }
            badge.textContent = `≈ ${perSeriesValue} por série`;
          } else if (badge) {
            badge.remove();
          }
        }
      }
    });
    calculateTotalTime();
  }

  function calculateTotalTime() {
    const dailyWorkout = getDailyWorkout();
    const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 1, 10);
    const rest = parseInt(document.querySelector('input[name="restTime"]:checked')?.value || appData.dailySettings?.restTime || 15, 10);
    const seriesRest = parseInt(document.querySelector('input[name="seriesRestTime"]:checked')?.value || appData.dailySettings?.seriesRestTime || 30, 10);

    if (dailyWorkout.length === 0) {
      ui.totalTimeDisplay.textContent = '0m 00s';
      return;
    }

    let totalSeconds = PREP_TIME;
    for (let i = 0; i < seriesCount; i++) {
      dailyWorkout.forEach(ex => totalSeconds += (ex.t === 'time' ? ex.v : ex.v * 2));
      if (dailyWorkout.length > 1) totalSeconds += rest * (dailyWorkout.length - 1);
    }
    if (seriesCount > 1) totalSeconds += seriesRest * (seriesCount - 1);

    ui.totalTimeDisplay.textContent = fmtTime(totalSeconds);
  }

  function updateRepsHighlight() {
    if (!ui.repsContainer) return;
    const target = parseInt(ui.repsContainer.dataset.target ?? '', 10);
    const current = parseInt(ui.repsValue.textContent ?? '0', 10) || 0;

    if (!target) {
      ui.repsValue.classList.remove('text-green-400');
      ui.repsContainer.dataset.targetReached = 'false';
      return;
    }

    if (current >= target) {
      if (ui.repsContainer.dataset.targetReached !== 'true') {
        ui.repsContainer.dataset.targetReached = 'true';
        playBeep('A5', '8n');
        vib([20, 30, 20]);
      }
      ui.repsValue.classList.add('text-green-400');
    } else {
      ui.repsContainer.dataset.targetReached = 'false';
      ui.repsValue.classList.remove('text-green-400');
    }
  }

  function updateTimerDisplay(value, unit = 'segundos', totalDuration, options = {}) {
    if (unit === 'reps') {
      ui.timerValue.classList.add('hidden');
      ui.repsContainer.classList.remove('hidden');
      ui.repsContainer.classList.add('flex');
      ui.repsValue.textContent = value;

      if (typeof options.target === 'number' && options.target > 0) {
        ui.repsContainer.dataset.target = options.target;
        ui.repsContainer.dataset.targetReached = 'false';
      } else {
        delete ui.repsContainer.dataset.target;
        delete ui.repsContainer.dataset.targetReached;
      }

      const label = options.unitLabel || 'repetições';
      ui.timerUnit.textContent = options.target ? `${label} (meta: ${options.target})` : label;
      updateRepsHighlight();
    } else {
      ui.timerValue.classList.remove('hidden');
      ui.repsContainer.classList.add('hidden');
      ui.repsContainer.classList.remove('flex');
      ui.timerValue.textContent = value;
      ui.timerUnit.textContent = options.unitLabel || unit;
      delete ui.repsContainer.dataset.target;
      delete ui.repsContainer.dataset.targetReached;
      ui.repsValue.classList.remove('text-green-400');
    }

    if (totalDuration && value >= 0) {
      const progress = (totalDuration - value) / totalDuration;
      ui.progressCircle.style.strokeDashoffset = CIRCLE_LENGTH * (1 - progress);
    } else {
      ui.progressCircle.style.strokeDashoffset = CIRCLE_LENGTH;
    }
  }
  function updateWorkoutDisplay() {
    const { currentSeries, currentExerciseIndex, totalSeries, currentWorkout } = workoutState;
    if (currentExerciseIndex < 0) {
      ui.seriesDisplay.textContent = `Série ${currentSeries + 1} / ${totalSeries}`;
      const nextName = currentWorkout[0] ? currentWorkout[0][0].name : 'Fim';
      ui.nextExerciseDisplay.textContent = nextName;
      return;
    }
    const exercise = currentWorkout[currentSeries][currentExerciseIndex];
    ui.seriesDisplay.textContent = `Série ${currentSeries + 1} / ${totalSeries}`;
    ui.exerciseDisplay.textContent = exercise.name;

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < currentWorkout[currentSeries].length) {
      ui.nextExerciseDisplay.textContent = currentWorkout[currentSeries][nextIndex].name;
    } else if (currentSeries + 1 < totalSeries) {
      ui.nextExerciseDisplay.textContent = 'Descanso da Série';
    } else {
      ui.nextExerciseDisplay.textContent = 'Último exercício!';
    }
  }

  function logExercise(exercise, completedValue) {
    if (!workoutState.sessionLog[exercise.id]) {
      workoutState.sessionLog[exercise.id] = { name: exercise.name, t: exercise.t, completed: 0 };
    }
    workoutState.sessionLog[exercise.id].completed += completedValue;
  }

  function startTimer(duration, onComplete, onTick) {
    clearInterval(workoutState.timerInterval);
    workoutState.timerDetails = { timeLeft: duration, totalDuration: duration, startTime: performance.now() };

    workoutState.timerInterval = setInterval(() => {
      if (workoutState.isPaused) return;

      const elapsedTime = performance.now() - workoutState.timerDetails.startTime;
      const newTimeLeft = Math.max(0, duration - Math.floor(elapsedTime / 1000));

      if (onTick && newTimeLeft !== workoutState.timerDetails.timeLeft) {
        onTick(newTimeLeft, duration);
      }
      workoutState.timerDetails.timeLeft = newTimeLeft;

      if (ui.toggle3sec.checked && workoutState.timerDetails.timeLeft <= 3 && workoutState.timerDetails.timeLeft > 0) {
        playBeep('C5', '16n');
        vib(30);
      }

      if (workoutState.timerDetails.timeLeft <= 0) {
        clearInterval(workoutState.timerInterval);
        playBeep('G5', '4n');
        vib([30, 40, 30]);
        onComplete?.();
      }
    }, 100);
  }

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator && ui.toggleVibrate.checked) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.log('Wake Lock falhou:', err.name, err.message);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release().then(() => {
        wakeLock = null;
      });
    }
  };

  function startExerciseRest() {
    const { currentExerciseIndex, currentWorkout, restTime, currentSeries } = workoutState;
    if (currentExerciseIndex >= currentWorkout[currentSeries].length - 1) {
      runNextStep();
      return;
    }
    ui.exerciseDisplay.textContent = 'Descanso';
    ui.pauseResumeBtn.style.display = 'inline-block';
    ui.skipBtn.textContent = 'Pular';
    speak('Descanse');
    updateTimerDisplay(restTime, 'segundos', restTime);
    startTimer(restTime, runNextStep, (timeLeft, total) => {
      updateTimerDisplay(timeLeft, 'segundos', total);
      if (timeLeft <= 3) ui.progressCircle.classList.add('timer-circle-alert'); else ui.progressCircle.classList.remove('timer-circle-alert');
    });
  }

  function startSeriesRest() {
    document.getElementById('main-workout-display').classList.add('hidden');
    ui.seriesRestDisplay.classList.remove('hidden');
    renderSummary(true);

    ui.exerciseDisplay.textContent = 'Descanso da Série';
    ui.pauseResumeBtn.style.display = 'inline-block';
    ui.skipBtn.textContent = 'Pular';
    speak('Bom trabalho. Descanse um pouco.');

    const onTick = (timeLeft, total) => {
      ui.seriesRestTimer.textContent = timeLeft;
      ui.seriesRestProgressBar.style.width = `${(timeLeft / total) * 100}%`;
      if (timeLeft <= 3) {
        ui.seriesRestProgressBar.style.backgroundColor = 'var(--danger)';
      } else {
        ui.seriesRestProgressBar.style.backgroundColor = 'var(--indigo)';
      }
    };

    startTimer(workoutState.seriesRestTime, () => {
      document.getElementById('main-workout-display').classList.remove('hidden');
      ui.seriesRestDisplay.classList.add('hidden');
      runNextStep();
    }, onTick);
    onTick(workoutState.seriesRestTime, workoutState.seriesRestTime);
  }

  async function startWorkout(fromQuick = false) {
    ui.validationError.textContent = '';
    const dailyWorkout = getDailyWorkout();
    if (dailyWorkout.length === 0) {
      ui.validationError.textContent = 'Selecione pelo menos um exercício.';
      return;
    }

    await setupAudio();
    workoutState.totalSeries = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 1, 10);
    workoutState.restTime = parseInt(document.querySelector('input[name="restTime"]:checked')?.value || appData.dailySettings?.restTime || 15, 10);
    workoutState.seriesRestTime = parseInt(document.querySelector('input[name="seriesRestTime"]:checked')?.value || appData.dailySettings?.seriesRestTime || 30, 10);

    workoutState.currentWorkout = Array.from({ length: workoutState.totalSeries }, () => dailyWorkout);
    workoutState.sessionLog = {};
    workoutState.currentSeries = 0;
    workoutState.currentExerciseIndex = -1;
    workoutState.isPaused = false;

    await requestWakeLock();

    switchScreen('workout');
    ui.exerciseDisplay.textContent = 'Prepare-se!';
    updateWorkoutDisplay();
    speak('Prepare-se. O treino vai começar.');
    updateTimerDisplay(PREP_TIME, 'segundos', PREP_TIME);
    startTimer(PREP_TIME, runNextStep, (timeLeft, total) => {
      updateTimerDisplay(timeLeft, 'segundos', total);
      if (timeLeft <= 3) ui.progressCircle.classList.add('timer-circle-alert'); else ui.progressCircle.classList.remove('timer-circle-alert');
    });
  }

  function runNextStep() {
    document.getElementById('main-workout-display').classList.remove('hidden');
    ui.seriesRestDisplay.classList.add('hidden');

    workoutState.currentExerciseIndex++;
    const { currentExerciseIndex, currentWorkout, currentSeries, totalSeries } = workoutState;

    if (currentExerciseIndex >= currentWorkout[currentSeries].length) {
      if (currentSeries + 1 >= totalSeries) {
        endWorkout(true);
        return;
      }
      workoutState.currentSeries++;
      workoutState.currentExerciseIndex = -1;
      startSeriesRest();
      return;
    }

    const exercise = currentWorkout[currentSeries][currentExerciseIndex];
    updateWorkoutDisplay();
    speak(exercise.name);

    if (exercise.t === 'time') {
      ui.pauseResumeBtn.style.display = 'inline-block';
      ui.skipBtn.textContent = 'Pular';
      updateTimerDisplay(exercise.v, 'segundos', exercise.v);
      startTimer(exercise.v, () => {
        logExercise(exercise, exercise.v);
        startExerciseRest();
      }, (timeLeft, total) => {
        updateTimerDisplay(timeLeft, 'segundos', total);
        if (timeLeft <= 3) ui.progressCircle.classList.add('timer-circle-alert'); else ui.progressCircle.classList.remove('timer-circle-alert');
      });
    } else {
      clearInterval(workoutState.timerInterval);
      ui.pauseResumeBtn.style.display = 'none';
      ui.skipBtn.textContent = 'Pronto';
      updateTimerDisplay(0, 'reps', null, { target: exercise.v });
      ui.timerValue.onclick = null;
      ui.repsContainer.onclick = (e) => {
        if (e.target.id === 'minus-rep-btn' || e.target.id === 'plus-rep-btn') return;
        let v = parseInt(ui.repsValue.textContent, 10) || 0;
        ui.repsValue.textContent = v + 1;
        updateRepsHighlight();
      };
    }
  }

  function renderSummary(isPartial = false) {
    const list = isPartial ? ui.partialSummaryList : ui.summaryList;
    list.innerHTML = '';
    const keys = Object.keys(workoutState.sessionLog);
    if (!keys.length) {
      list.innerHTML = '<p class="text-gray-400 text-center">Nenhum exercício completado ainda.</p>';
      return;
    }

    keys.forEach(k => {
      const log = workoutState.sessionLog[k];
      const unit = log.t === 'reps' ? 'reps' : 's';
      const el = document.createElement('div');

      if (isPartial) {
        const dailyGoalInput = document.getElementById(`input-daily-${k}`);
        const dailyGoal = dailyGoalInput ? parseInt(dailyGoalInput.value, 10) : 0;
        const percentage = dailyGoal > 0 ? Math.min(100, (log.completed / dailyGoal) * 100) : 0;

        el.className = 'bg-gray-800/70 p-2 rounded';
        el.innerHTML = `
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-300">${log.name}</span>
            <span class="font-bold text-indigo-300">${log.completed} / ${dailyGoal} ${unit}</span>
          </div>
          <div class="progress-bar mt-2">
            <div style="width:${percentage}%"></div>
          </div>
        `;
      } else {
        el.className = 'flex justify-between items-center bg-gray-800/70 p-2 rounded';
        el.innerHTML = `<span class="text-gray-300">${log.name}</span><span class="font-bold text-indigo-300">${log.completed} ${unit}</span>`;
      }
      list.appendChild(el);
    });
  }

  function endWorkout(completed = false) {
    clearInterval(workoutState.timerInterval);
    releaseWakeLock();
    const today = new Date();
    const dateKey = today.toISOString().slice(0, 10);
    const session = { timestamp: today.toISOString(), log: {} };

    for (const k in workoutState.sessionLog) session.log[k] = workoutState.sessionLog[k].completed;

    if (Object.keys(session.log).length > 0) {
      appData.history[dateKey] ??= [];
      appData.history[dateKey].push(session);
      updateStreakOnSave(dateKey);
      saveData();
    }

    if (completed) {
      ui.finishedTitle.textContent = 'Treino Concluído!';
      ui.finishedSubtitle.textContent = 'Você mandou bem! Continue com o ótimo trabalho.';
      speak('Treino concluído. Parabéns!');
    } else {
      ui.finishedTitle.textContent = 'Treino Encerrado';
      ui.finishedSubtitle.textContent = 'Seu progresso de hoje foi salvo.';
      speak('Treino encerrado.');
    }
    renderSummary(false);
    switchScreen('finished');
  }

  function updateStreakOnSave(dateKey) {
    const last = appData.streak?.lastDay;
    const prev = last ? new Date(last) : null;
    const cur = new Date(dateKey);
    let count = appData.streak?.count || 0;

    if (!prev) {
      count = 1;
    } else {
      const diff = Math.round((cur - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) count += 1;
      else if (diff === 0) {
      } else count = 1;
    }
    appData.streak = { lastDay: dateKey, count };
  }

  function resetWorkout() {
    clearInterval(workoutState.timerInterval);
    releaseWakeLock();
    workoutState = { ...workoutState, isPaused: false, currentSeries: 0, currentExerciseIndex: -1, sessionLog: {} };
    ui.pauseResumeBtn.textContent = 'Pausar';
    ui.pauseResumeBtn.style.display = 'inline-block';
    ui.skipBtn.textContent = 'Pular';
    ui.pauseOverlay.classList.remove('visible');
    document.getElementById('main-workout-display').classList.remove('hidden');
    ui.seriesRestDisplay.classList.add('hidden');
    updateProgressDisplay();
    switchScreen('setup');
  }

  function togglePause() {
    workoutState.isPaused = !workoutState.isPaused;
    if (workoutState.isPaused) {
      ui.pauseResumeBtn.textContent = 'Retomar';
      ui.pauseOverlay.classList.add('visible');
      speak('Treino pausado.');
    } else {
      ui.pauseResumeBtn.textContent = 'Pausar';
      ui.pauseOverlay.classList.remove('visible');
      speak('Retomando.');
    }
  }

  function handleSkipOrDone() {
    const workoutScreen = document.getElementById('workout-screen');
    workoutScreen.classList.add('ring', 'ring-indigo-600');
    setTimeout(() => workoutScreen.classList.remove('ring', 'ring-indigo-600'), 150);

    if (workoutState.currentExerciseIndex < 0) {
      clearInterval(workoutState.timerInterval);
      runNextStep();
      return;
    }
    const exercise = workoutState.currentWorkout[workoutState.currentSeries][workoutState.currentExerciseIndex];
    if (!exercise) return;

    if (ui.skipBtn.textContent === 'Pronto') {
      const repsDone = parseInt(ui.repsValue.textContent, 10) || 0;
      logExercise(exercise, repsDone);
      startExerciseRest();
    } else {
      clearInterval(workoutState.timerInterval);
      const isResting = ui.exerciseDisplay.textContent.toLowerCase().includes('descanso');

      if (!isResting && exercise.t === 'time') {
        const { timeLeft, totalDuration } = workoutState.timerDetails;
        const timeDone = totalDuration - timeLeft;
        if (timeDone > 0) logExercise(exercise, timeDone);
      }
      if (isResting) runNextStep(); else startExerciseRest();
    }
  }

  function showConfirmModal(title, message, onConfirm, okText = 'Confirmar', okColor = 'bg-red-600 hover:bg-red-700') {
    ui.confirmTitle.textContent = title;
    ui.confirmMessage.textContent = message;
    ui.confirmOk.textContent = okText;
    ui.confirmOk.className = `w-1/2 text-white font-bold py-2 px-4 rounded-lg ${okColor}`;
    confirmAction = onConfirm;
    ui.confirmModal.classList.remove('hidden');
  }

  function closeConfirmModal() {
    ui.confirmModal.classList.add('hidden');
    confirmAction = null;
  }

  function renderHistory(archiveKey = null) {
    ui.historyList.innerHTML = '';
    let dataSet;
    let isArchived = false;

    if (archiveKey) {
      const { year, month } = appData.currentChallenge;
      const currentKey = `${year}-${String(month).padStart(2, '0')}`;
      if (archiveKey !== currentKey) {
        isArchived = true;
        dataSet = (appData.archive?.[archiveKey]?.history) || {};
      } else {
        dataSet = appData.history || {};
      }
    } else {
      dataSet = appData.history || {};
    }

    const sortedDates = Object.keys(dataSet).filter(d => Array.isArray(dataSet[d]) && dataSet[d].length > 0).sort().reverse();
    if (!sortedDates.length) {
      ui.historyList.innerHTML = '<p class="text-gray-400 text-center">Nenhum treino registrado para este mês.</p>';
      return;
    }

    sortedDates.forEach(date => {
      const sessions = dataSet[date];
      if (!Array.isArray(sessions) || !sessions.length) return;

      const dateObj = new Date(date + 'T00:00:00');
      if (isNaN(dateObj.getTime())) return;
      const dateStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const dateSection = document.createElement('div');
      dateSection.innerHTML = `<div class="font-bold text-indigo-300 my-2">${dateStr}</div>`;
      ui.historyList.appendChild(dateSection);

      sessions.forEach((session, index) => {
        if (!session || !session.log) return;
        let timeStr = 'Horário não disponível';
        if (session.timestamp) {
          const t = new Date(session.timestamp);
          if (!isNaN(t.getTime())) timeStr = t.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        const card = document.createElement('div');
        card.className = 'bg-gray-900/50 p-3 rounded-md mb-2';
        let content = `
          <div class="flex justify-between items-center">
            <p class="font-bold text-white">Treino às ${timeStr}</p>
            <div class="flex gap-2">
              <button data-clone="${date}|${index}" class="text-gray-300 hover:text-indigo-400 text-sm" title="Duplicar treino para hoje"><i class="fas fa-copy"></i></button>
              <button data-del-entry="${date}|${index}" class="text-gray-400 hover:text-red-500" title="Excluir">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <ul class="list-disc list-inside text-gray-300 mt-1">`;

        baseExercises.forEach(ex => {
          if (session.log.hasOwnProperty(ex.id) && session.log[ex.id] > 0) {
            const value = session.log[ex.id];
            const unit = ex.t === 'reps' ? 'reps' : 's';
            content += `<li>${ex.name}: ${value} ${unit}</li>`;
          }
        });
        content += '</ul>';
        card.innerHTML = content;
        ui.historyList.appendChild(card);
      });
    });
  }

  function populateHistoryMonthSelect() {
    ui.historyMonthSelect.innerHTML = '';
    const { year, month } = appData.currentChallenge;
    const currentKey = `${year}-${String(month).padStart(2, '0')}`;
    const optCurrent = document.createElement('option');
    optCurrent.value = currentKey;
    optCurrent.textContent = `${String(month).padStart(2, '0')}/${year} (atual)`;
    ui.historyMonthSelect.appendChild(optCurrent);

    Object.keys(appData.archive || {}).sort().reverse().forEach(key => {
      const [aYear, aMonth] = key.split('-');
      const o = document.createElement('option');
      o.value = key;
      o.textContent = `${aMonth}/${aYear}`;
      ui.historyMonthSelect.appendChild(o);
    });
  }

  function showGoalPlan() {
    ui.goalPlanList.innerHTML = '';
    const selectedRadio = document.querySelector('input[name="days-in-month"]:checked');
    const days = selectedRadio ? parseInt(selectedRadio.value, 10) : 31;
    const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 1, 10);

    const monthlyTotals = {};
    baseExercises.forEach(ex => monthlyTotals[ex.id] = 0);
    for (const date in appData.history) {
      const sessions = appData.history[date];
      if (Array.isArray(sessions)) {
        sessions.forEach(session => {
          for (const exId in session.log) {
            if (monthlyTotals[exId] != null) monthlyTotals[exId] += session.log[exId];
          }
        });
      }
    }

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate() + 1;

    baseExercises.forEach(ex => {
      const totalGoal = appData.monthlyGoals[ex.id] || 0;
      const done = monthlyTotals[ex.id] || 0;
      const remainingGoal = Math.max(0, totalGoal - done);
      const idealPerDay = Math.ceil(remainingGoal / Math.max(1, daysLeft));
      const idealPerSeries = Math.ceil(idealPerDay / seriesCount);
      const unit = ex.t === 'reps' ? 'reps' : 's';

      const li = document.createElement('li');
      li.className = 'mb-2 text-gray-300 p-2 bg-gray-900/50 rounded-md';
      li.dataset.id = ex.id;
      li.dataset.idealPerDay = idealPerDay;
      li.innerHTML = `
        <div class="font-bold text-indigo-300">${ex.name}</div>
        <div class="mt-1 text-sm">
          Meta Total: <b>${totalGoal}</b> ${unit}<br>
          Já Feito: <b>${done}</b> ${unit}<br>
          Falta: <b>${remainingGoal}</b> ${unit}<br>
          <hr class="my-2 border-gray-700">
          Ideal a partir de hoje: <b>${idealPerDay}</b> ${unit}/dia (≈ <b>${idealPerSeries}</b> por série)
        </div>
      `;
      ui.goalPlanList.appendChild(li);
    });
    ui.goalPlanModal.classList.remove('hidden');
  }

  function doBackup() {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jornada_guerreiro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function doRestore() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json';
    inp.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data !== 'object' || !data.monthlyGoals) throw new Error('Arquivo de backup inválido ou incompatível.');
          appData = { ...appData, ...data };
          saveData();
          rebuildExercisesFromData();
          renderSetupScreen();
          addDynamicListeners();
          applySavedDailySettings();
          calculateDailyGoals();
          updateProgressDisplay();
          showToast('Dados restaurados com sucesso!');
        } catch (err) {
          showToast('Falha ao restaurar: ' + err.message, 4000);
        }
      };
      reader.readAsText(file);
    };
    inp.click();
  }

  function addCoreListeners() {
    [ui.toggleVoice, ui.toggleBeep, ui.toggleVibrate, ui.toggle3sec].forEach(el => {
      el?.addEventListener('change', () => {
        appData.flags = {
          voice: ui.toggleVoice.checked,
          beep: ui.toggleBeep.checked,
          vibrate: ui.toggleVibrate.checked,
          countdown: ui.toggle3sec.checked,
        };
        saveData();
      });
    });

    ui.helpBtn.addEventListener('click', () => ui.helpModal.classList.remove('hidden'));
    ui.closeHelpBtn.addEventListener('click', () => ui.helpModal.classList.add('hidden'));
    ui.helpModal.addEventListener('click', (e) => { if (e.target === ui.helpModal) ui.helpModal.classList.add('hidden'); });

    ui.viewGoalPlan.addEventListener('click', showGoalPlan);
    ui.closeGoalPlanBtn.addEventListener('click', () => ui.goalPlanModal.classList.add('hidden'));
    ui.goalPlanModal.addEventListener('click', (e) => { if (e.target === ui.goalPlanModal) ui.goalPlanModal.classList.add('hidden'); });

    ui.applyPlanBtn?.addEventListener('click', () => {
      const cycles = parseInt(document.querySelector('input[name="cycles"]:checked')?.value || appData.dailySettings?.cycles || 3, 10);
      const planItems = ui.goalPlanList.querySelectorAll('li[data-id]');
      planItems.forEach(item => {
        const id = item.dataset.id;
        if (!id) return;
        const daily = parseInt(item.dataset.idealPerDay, 10);
        const perSeries = Math.ceil(daily / cycles);
        const chk = document.getElementById(`check-daily-${id}`);
        const inp = document.getElementById(`input-daily-${id}`);
        if (chk) chk.checked = daily > 0;
        if (inp) inp.value = daily;
        const label = inp?.closest('.exercise-item')?.querySelector('label');
        if (label) {
          let badge = label.querySelector('.bg-indigo-900/50');
          if (!badge && perSeries > 0) {
            badge = document.createElement('span');
            badge.className = 'ml-2 px-2 py-1 text-xs font-semibold text-indigo-300 bg-indigo-900/50 rounded-full';
            label.appendChild(badge);
          }
          if (badge) {
            if (perSeries > 0) {
              badge.textContent = `≈ ${perSeries} por série`;
            } else {
              badge.remove();
            }
          }
        }
        if (appData.dailySettings.enabledExercises) {
          appData.dailySettings.enabledExercises[id] = daily > 0;
        }
      });
      calculateTotalTime();
      saveData();
      ui.goalPlanModal.classList.add('hidden');
      showToast('Plano aplicado ao treino de hoje!');
    });

    ui.backupBtn.addEventListener('click', doBackup);
    ui.restoreBtn.addEventListener('click', doRestore);

    ui.advancedOptionsToggle.addEventListener('click', () => {
      const opened = ui.advancedOptionsContent.classList.toggle('hidden');
      ui.advancedOptionsArrow.classList.toggle('rotate-180');
    });

    ui.daysRadios().forEach(r => r.addEventListener('change', e => {
      updateDailySettings('daysInMonth', parseInt(e.target.value, 10));
      calculateDailyGoals();
    }));
    ui.cyclesRadios().forEach(r => r.addEventListener('change', e => {
      updateDailySettings('cycles', parseInt(e.target.value, 10));
      calculateDailyGoals();
    }));
    ui.restTimeRadios().forEach(r => r.addEventListener('change', e => {
      updateDailySettings('restTime', parseInt(e.target.value, 10));
      calculateTotalTime();
    }));
    ui.seriesRestTimeRadios().forEach(r => r.addEventListener('change', e => {
      updateDailySettings('seriesRestTime', parseInt(e.target.value, 10));
      calculateTotalTime();
    }));

    ui.startBtn.addEventListener('click', () => startWorkout(false));
    ui.quickStart.addEventListener('click', () => startWorkout(true));

    ui.pauseResumeBtn.addEventListener('click', togglePause);
    ui.skipBtn.addEventListener('click', handleSkipOrDone);
    ui.endBtn.addEventListener('click', () => {
      showConfirmModal('Encerrar treino?', 'Seu progresso até aqui será salvo.', () => endWorkout(false), 'Encerrar', 'bg-yellow-600 hover:bg-yellow-700');
    });
    ui.restartBtn.addEventListener('click', resetWorkout);

    document.addEventListener('keydown', (e) => {
      if (!screens.workout.classList.contains('hidden')) {
        if (e.key === ' ') { e.preventDefault(); togglePause(); }
        if (ui.repsContainer && !ui.repsContainer.classList.contains('hidden')) {
          if (e.key === '+') { e.preventDefault(); ui.plusRepBtn.click(); }
          if (e.key === '-' || e.key === '_') { e.preventDefault(); ui.minusRepBtn.click(); }
          if (e.key === 'Enter') { e.preventDefault(); handleSkipOrDone(); }
        }
      }
    });

    const setupRepButtonListeners = (button, action) => {
      let interval;
      let timeout;

      const startAction = () => {
        action();
        timeout = setTimeout(() => {
          interval = setInterval(action, 100);
        }, 500);
      };

      const stopAction = () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };

      button.addEventListener('mousedown', startAction);
      button.addEventListener('mouseup', stopAction);
      button.addEventListener('mouseleave', stopAction);
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startAction();
      });
      button.addEventListener('touchend', stopAction);
      button.addEventListener('click', (event) => {
        if (event.detail !== 0) return;
        event.preventDefault();
        action();
      });
    };

    setupRepButtonListeners(ui.minusRepBtn, () => {
      let v = parseInt(ui.repsValue.textContent, 10);
      if (v > 0) {
        ui.repsValue.textContent = v - 1;
        updateRepsHighlight();
      }
    });

    setupRepButtonListeners(ui.plusRepBtn, () => {
      let v = parseInt(ui.repsValue.textContent, 10);
      ui.repsValue.textContent = v + 1;
      updateRepsHighlight();
    });

    ui.addRetroBtn.addEventListener('click', () => {
      ui.retroExerciseInputs.innerHTML = '';
      const today = new Date().toISOString().split('T')[0];
      ui.retroDateInput.value = today;
      ui.retroDateInput.max = today;

      baseExercises.forEach(ex => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        div.innerHTML = `
          <label for="retro-${ex.id}" class="block text-sm font-bold text-gray-300 mb-1">${ex.name} (${ex.t === 'reps' ? 'repetições' : 'segundos'})</label>
          <input type="number" id="retro-${ex.id}" class="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500" min="0" inputmode="numeric" pattern="[0-9]*">
        `;
        ui.retroExerciseInputs.appendChild(div);
      });
      ui.retroModal.classList.remove('hidden');
    });
    ui.cancelRetroBtn.addEventListener('click', () => ui.retroModal.classList.add('hidden'));
    ui.saveRetroBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const date = ui.retroDateInput.value;
      if (!date) { showToast('Selecione uma data.'); return; }
      const retroLog = {};
      let hasData = false;
      baseExercises.forEach(ex => {
        const input = document.getElementById(`retro-${ex.id}`);
        const value = parseInt(input.value, 10) || 0;
        if (value > 0) { retroLog[ex.id] = value; hasData = true; }
      });
      if (!hasData) { showToast('Adicione pelo menos um exercício.'); return; }
      const session = { timestamp: new Date(date).toISOString(), log: retroLog };
      appData.history[date] ??= [];
      appData.history[date].push(session);

      updateStreakOnSave(date);
      saveData();
      updateProgressDisplay();
      ui.retroModal.classList.add('hidden');
    });

    ui.historyBtn.addEventListener('click', () => {
      populateHistoryMonthSelect();
      const { year, month } = appData.currentChallenge;
      ui.historyMonthSelect.value = `${year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;
      renderHistory();
      ui.historyModal.classList.remove('hidden');
    });
    ui.closeHistoryBtn.addEventListener('click', () => { ui.historyModal.classList.add('hidden'); updateProgressDisplay(); });
    ui.historyModal.addEventListener('click', (e) => { if (e.target === ui.historyModal) { ui.historyModal.classList.add('hidden'); updateProgressDisplay(); } });
    ui.clearHistoryBtn.addEventListener('click', () => {
      const archiveKey = ui.historyMonthSelect.value;
      showConfirmModal('Limpar histórico?', `Todo o histórico de ${archiveKey} será excluído. Tem certeza?`, () => {
        if (archiveKey === `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`) {
          appData.history = {};
        } else if (appData.archive?.[archiveKey]) {
          delete appData.archive[archiveKey];
        }
        saveData();
        populateHistoryMonthSelect();
        renderHistory(archiveKey);
        updateProgressDisplay();
        closeConfirmModal();
      }, 'Limpar', 'bg-red-600 hover:bg-red-700');
    });
    ui.historyMonthSelect.addEventListener('change', (e) => renderHistory(e.target.value));

    ui.historyList.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-del-entry]');
      const cloneBtn = e.target.closest('[data-clone]');
      if (delBtn) {
        const [date, idxStr] = delBtn.dataset.delEntry.split('|');
        const idx = parseInt(idxStr, 10);
        const isCurrentMonth = ui.historyMonthSelect.value === `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;
        const src = isCurrentMonth ? appData.history : (appData.archive?.[ui.historyMonthSelect.value]?.history || {});
        if (!src?.[date] || !Array.isArray(src[date])) return;

        showConfirmModal('Excluir item?', 'Tem certeza que deseja excluir este item do histórico?', () => {
          lastDeleted = { date, entry: { ...src[date][idx] }, isArchived: !isCurrentMonth, archiveKey: ui.historyMonthSelect.value };
          src[date].splice(idx, 1);
          if (!src[date].length) delete src[date];
          saveData();
          ui.undoDeleteBtn.disabled = false;
          renderHistory(ui.historyMonthSelect.value);
          updateProgressDisplay();
          closeConfirmModal();
        });
      }

      if (cloneBtn) {
        const [date, idxStr] = cloneBtn.dataset.clone.split('|');
        const idx = parseInt(idxStr, 10);
        const selectedMonthKey = ui.historyMonthSelect.value;
        const isCurrentMonth = selectedMonthKey === `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;
        const sourceHistory = isCurrentMonth ? appData.history : (appData.archive?.[selectedMonthKey]?.history || {});
        const sessionToClone = sourceHistory?.[date]?.[idx];

        if (!sessionToClone) {
          showToast('Erro: Treino a ser duplicado não encontrado.');
          return;
        }

        const todayKey = new Date().toISOString().slice(0, 10);
        appData.history[todayKey] ??= [];
        appData.history[todayKey].push({ timestamp: new Date().toISOString(), log: { ...sessionToClone.log } });

        updateStreakOnSave(todayKey);
        saveData();
        showToast('Treino duplicado para hoje!');

        renderHistory(selectedMonthKey);
      }
    });
    ui.undoDeleteBtn.addEventListener('click', () => {
      if (!lastDeleted) return;
      const { date, entry, isArchived, archiveKey } = lastDeleted;

      let targetHistory;
      if (isArchived) {
        appData.archive[archiveKey] ??= {};
        appData.archive[archiveKey].history ??= {};
        targetHistory = appData.archive[archiveKey].history;
      } else {
        targetHistory = appData.history;
      }
      targetHistory[date] ??= [];
      targetHistory[date].push(entry);

      lastDeleted = null;
      ui.undoDeleteBtn.disabled = true;
      saveData();
      renderHistory(ui.historyMonthSelect.value);
      updateProgressDisplay();
    });

    ui.copySummaryBtn.addEventListener('click', () => {
      const lines = [];
      for (const k in workoutState.sessionLog) {
        const log = workoutState.sessionLog[k];
        const unit = log.t === 'reps' ? 'reps' : 's';
        lines.push(`${log.name}: ${log.completed} ${unit}`);
      }
      const text = `Resumo do treino (${new Date().toLocaleString('pt-BR')}):\n` + lines.join('\n');
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Resumo copiado!');
    });

    ui.orderBtn.addEventListener('click', () => {
      document.querySelectorAll('.drag-handle').forEach(h => h.classList.remove('hidden'));
      document.querySelectorAll('.exercise-item').forEach(item => {
        item.setAttribute('draggable', true);
        item.style.userSelect = 'none';
      });
      ui.orderBtn.classList.add('hidden');
      ui.saveOrderBtn.classList.remove('hidden');
    });
    ui.saveOrderBtn.addEventListener('click', () => {
      const newOrder = [...document.querySelectorAll('.exercise-item')].map(i => i.dataset.id);
      appData.exerciseOrder = newOrder;
      saveData();
      rebuildExercisesFromData();
      renderSetupScreen();
      addDynamicListeners();
      calculateDailyGoals();
      updateProgressDisplay();

      document.querySelectorAll('.drag-handle').forEach(h => h.classList.add('hidden'));
      document.querySelectorAll('.exercise-item').forEach(item => {
        item.removeAttribute('draggable');
        item.style.userSelect = '';
      });
      ui.orderBtn.classList.remove('hidden');
      ui.saveOrderBtn.classList.add('hidden');
      showToast('Ordem salva!');
    });

    let draggingElement = null;
    let initialScrollTop = 0;
    ui.exerciseSelectionContainer.addEventListener('dragstart', e => {
      if (e.target.classList.contains('exercise-item')) {
        draggingElement = e.target;
        initialScrollTop = ui.exerciseSelectionContainer.scrollTop;
        setTimeout(() => e.target.classList.add('dragging'), 0);
      }
    });
    ui.exerciseSelectionContainer.addEventListener('dragend', e => {
      if (draggingElement) draggingElement.classList.remove('dragging');
      draggingElement = null;
      ui.exerciseSelectionContainer.scrollTop = initialScrollTop;
    });
    ui.exerciseSelectionContainer.addEventListener('dragover', e => {
      e.preventDefault(); if (!draggingElement) return;
      const after = getDragAfterElement(ui.exerciseSelectionContainer, e.clientY);
      const container = ui.exerciseSelectionContainer;
      if (!after) container.appendChild(draggingElement); else container.insertBefore(draggingElement, after);
    });

    ui.monthlyGoalsContainer.addEventListener('input', e => {
      if (e.target.id?.startsWith('input-monthly-')) {
        const id = e.target.id.replace('input-monthly-', '');
        if (baseExercises.some(ex => ex.id === id)) {
          appData.monthlyGoals[id] = parseInt(e.target.value, 10) || 0;
          saveData(); calculateDailyGoals(); updateProgressDisplay();
        }
      }
    });
    ui.exerciseSelectionContainer.addEventListener('change', e => {
      if (e.target.id?.startsWith('check-daily-')) {
        const id = e.target.id.replace('check-daily-', '');
        appData.dailySettings.enabledExercises ??= {};
        appData.dailySettings.enabledExercises[id] = e.target.checked;
        saveData(); calculateTotalTime();
      }
    });
    ui.exerciseSelectionContainer.addEventListener('input', e => {
      if (e.target.id?.startsWith('input-daily-')) calculateTotalTime();
    });
    ui.exerciseSelectionContainer.addEventListener('click', e => {
      const btn = e.target.closest('[data-del]');
      if (!btn) return;
      const id = btn.dataset.del;
      const idx = (appData.customExercises || []).findIndex(c => c.id === id);
      if (idx >= 0) {
        showConfirmModal('Remover exercício?', 'Tem certeza que deseja remover este exercício personalizado?', () => {
          appData.customExercises.splice(idx, 1);
          delete appData.monthlyGoals[id];
          if (appData.dailySettings?.enabledExercises) delete appData.dailySettings.enabledExercises[id];
          appData.exerciseOrder = (appData.exerciseOrder || []).filter(x => x !== id);
          saveData();
          rebuildExercisesFromData();
          renderSetupScreen();
          addDynamicListeners();
          calculateDailyGoals();
          updateProgressDisplay();
          closeConfirmModal();
        }, 'Remover', 'bg-red-600 hover:bg-red-700');
      }
    });

    ui.addCustomExBtn.addEventListener('click', () => {
      ui.customExNameInput.value = '';
      ui.customExTypeReps.checked = true;
      ui.customExGoalInput.value = '1000';
      ui.addCustomExModal.classList.remove('hidden');
    });

    ui.cancelAddCustomBtn.addEventListener('click', () => {
      ui.addCustomExModal.classList.add('hidden');
    });

    ui.saveCustomExBtn.addEventListener('click', () => {
      const name = ui.customExNameInput.value.trim();
      const type = document.querySelector('input[name="custom-ex-type"]:checked').value;
      const monthlyGoal = parseInt(ui.customExGoalInput.value, 10);

      if (!name) { showToast('O nome do exercício não pode ser vazio.'); return; }
      if (isNaN(monthlyGoal) || monthlyGoal <= 0) { showToast('A meta mensal deve ser um número positivo.'); return; }

      const id = 'custom_' + name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      if (baseExercises.some(c => c.id === id)) { showToast('Já existe um exercício com esse nome.'); return; }

      appData.customExercises.push({ id, name, t: type, monthlyGoal, builtin: false });
      appData.monthlyGoals[id] = monthlyGoal;
      appData.exerciseOrder.push(id);
      appData.dailySettings.enabledExercises ??= {};
      appData.dailySettings.enabledExercises[id] = true;
      saveData();

      rebuildExercisesFromData();
      renderSetupScreen();
      addDynamicListeners();
      calculateDailyGoals();
      updateProgressDisplay();
      ui.addCustomExModal.classList.add('hidden');
      showToast('Exercício adicionado!');
    });

    ui.resetGoalsBtn.addEventListener('click', () => {
      showConfirmModal('Restaurar metas?', 'Restaurar metas padrão dos exercícios nativos? (Customizados serão mantidos)', () => {
        baseExercises.forEach(ex => {
          if (ex.builtin) appData.monthlyGoals[ex.id] = ex.monthlyGoal || (ex.t === 'reps' ? 1000 : 1800);
        });
        saveData();
        renderSetupScreen();
        addDynamicListeners();
        calculateDailyGoals();
        updateProgressDisplay();
        closeConfirmModal();
      }, 'Restaurar', 'bg-red-600 hover:bg-red-700');
    });

    ui.confirmCancel.addEventListener('click', closeConfirmModal);
    ui.confirmOk.addEventListener('click', () => {
      if (confirmAction) confirmAction();
      closeConfirmModal();
    });
    ui.confirmModal.addEventListener('click', e => {
      if (e.target === ui.confirmModal) closeConfirmModal();
    });

    document.addEventListener('visibilitychange', () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    });
  }

  function addDynamicListeners() {
    // handled via delegated listeners
  }

  function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll('.exercise-item:not(.dragging)')];
    return els.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function updateDailySettings(key, value) {
    appData.dailySettings ??= {};
    appData.dailySettings[key] = value;
    saveData();
  }

  function applySavedDailySettings() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRadio = document.querySelector(`input[name="days-in-month"][value="${daysInMonth}"]`) || document.querySelector('input[name="days-in-month"][value="31"]');
    if (daysRadio) daysRadio.checked = true;

    if (!appData.dailySettings) return;
    if (typeof appData.dailySettings.daysInMonth === 'number') {
      const savedDaysRadio = document.querySelector(`input[name="days-in-month"][value="${appData.dailySettings.daysInMonth}"]`);
      if (savedDaysRadio) savedDaysRadio.checked = true;
    }
    if (typeof appData.dailySettings.cycles === 'number') {
      const r = document.querySelector(`input[name="cycles"][value="${appData.dailySettings.cycles}"]`); if (r) r.checked = true;
    }
    if (typeof appData.dailySettings.restTime === 'number') {
      const r = document.querySelector(`input[name="restTime"][value="${appData.dailySettings.restTime}"]`); if (r) r.checked = true;
    }
    if (typeof appData.dailySettings.seriesRestTime === 'number') {
      const r = document.querySelector(`input[name="seriesRestTime"][value="${appData.dailySettings.seriesRestTime}"]`); if (r) r.checked = true;
    }
  }

  loadData();
  renderSetupScreen();
  addCoreListeners();
  addDynamicListeners();
  calculateDailyGoals();
  updateProgressDisplay();
});
