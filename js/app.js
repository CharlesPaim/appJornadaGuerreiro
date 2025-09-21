document.addEventListener('DOMContentLoaded', async () => {
    const screens = {
        setup: document.getElementById('setup-screen'),
        workout: document.getElementById('workout-screen'),
        finished: document.getElementById('finished-screen'),
    };
    const ui = {
        totalTimeDisplay: document.getElementById('totalTime'),
        startBtn: document.getElementById('start-btn'),
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
        restartBtn: document.getElementById('restart-btn'),
        workoutScreen: document.getElementById('workout-screen'),
        exerciseSelectionContainer: document.getElementById('exercise-selection-container'),
        monthlyGoalsContainer: document.getElementById('monthly-goals-container'),
        monthlyProgressContainer: document.getElementById('monthly-progress-container'),
        monthlyOverviewDays: document.getElementById('monthly-overview-days'),
        monthlyOverviewCompleted: document.getElementById('monthly-overview-completed'),
        monthlyOverviewRemaining: document.getElementById('monthly-overview-remaining'),
        validationError: document.getElementById('validation-error'),
        finishedTitle: document.getElementById('finished-title'),
        finishedSubtitle: document.getElementById('finished-subtitle'),
        summaryList: document.getElementById('summary-list'),
        helpBtn: document.getElementById('help-btn'),
        helpModal: document.getElementById('help-modal'),
        closeHelpBtn: document.getElementById('close-help-btn'),
        mainWorkoutDisplay: document.getElementById('main-workout-display'),
        seriesRestDisplay: document.getElementById('series-rest-display'),
        seriesRestTimer: document.getElementById('series-rest-timer'),
        seriesRestProgressBar: document.getElementById('series-rest-progress-bar'),
        partialSummaryContainer: document.getElementById('partial-summary-container'),
        partialSummaryList: document.getElementById('partial-summary-list'),
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
        orderBtn: document.getElementById('order-btn'),
        saveOrderBtn: document.getElementById('save-order-btn'),
        historyMonthSelect: document.getElementById('history-month-select'),
        advancedOptionsToggle: document.getElementById('advanced-options-toggle'),
        advancedOptionsContent: document.getElementById('advanced-options-content'),
        advancedOptionsArrow: document.getElementById('advanced-options-arrow'),
        confirmModal: document.getElementById('confirm-modal'),
        confirmTitle: document.getElementById('confirm-title'),
        confirmMessage: document.getElementById('confirm-message'),
        confirmConfirmBtn: document.getElementById('confirm-confirm-btn'),
        confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
        addExerciseBtn: document.getElementById('add-exercise-btn'),
        exerciseModal: document.getElementById('exercise-modal'),
        exerciseModalTitle: document.getElementById('exercise-modal-title'),
        exerciseForm: document.getElementById('exercise-form'),
        exerciseNameInput: document.getElementById('exercise-name'),
        exerciseTypeSelect: document.getElementById('exercise-type'),
        exerciseMonthlyGoalInput: document.getElementById('exercise-monthly-goal'),
        cancelExerciseBtn: document.getElementById('cancel-exercise-btn'),
        exerciseModalError: document.getElementById('exercise-modal-error'),
    };

    const showConfirmation = ({
        title = 'Confirmação',
        message = '',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        variant = 'primary'
    } = {}) => {
        return new Promise((resolve) => {
            const modal = ui.confirmModal;
            const confirmBtn = ui.confirmConfirmBtn;
            const cancelBtn = ui.confirmCancelBtn;

            if (!modal || !confirmBtn || !cancelBtn) {
                resolve(window.confirm(message || title));
                return;
            }

            if (ui.confirmTitle) ui.confirmTitle.textContent = title;
            if (ui.confirmMessage) ui.confirmMessage.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            confirmBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-500', 'bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
            if (variant === 'danger') {
                confirmBtn.classList.add('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
            } else {
                confirmBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-500');
            }

            const cleanup = () => {
                modal.classList.add('hidden');
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                modal.removeEventListener('click', handleOverlayClick);
                document.removeEventListener('keydown', handleKeyDown);
            };

            const handleConfirm = () => {
                cleanup();
                resolve(true);
            };

            const handleCancel = () => {
                cleanup();
                resolve(false);
            };

            const handleOverlayClick = (event) => {
                if (event.target === modal) {
                    handleCancel();
                }
            };

            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    handleCancel();
                }
            };

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            modal.addEventListener('click', handleOverlayClick);
            document.addEventListener('keydown', handleKeyDown);

            modal.classList.remove('hidden');
            setTimeout(() => confirmBtn.focus(), 0);
        });
    };

    const baseExercises = [
        { id: 'abdominais', name: 'Abdominais', t: 'reps', monthlyGoal: 6000 },
        { id: 'agachamentos', name: 'Agachamentos', t: 'reps', monthlyGoal: 3000 },
        { id: 'flexoes', name: 'Flexões', t: 'reps', monthlyGoal: 3000 },
        { id: 'isometria', name: 'Cavalo', t: 'time', monthlyGoal: 5580 },
        { id: 'prancha', name: 'Prancha', t: 'time', monthlyGoal: 3720 }
    ];

    const PREP_TIME = 10;
    const CIRCLE_LENGTH = 722;

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
        timerDetails: { timeLeft: 0, totalDuration: 0 }
    };

    let editingExerciseId = null;

    const isBaseExercise = (id) => baseExercises.some(ex => ex.id === id);
    const getCustomExercises = () => Array.isArray(appData.customExercises) ? appData.customExercises : [];
    const getAllExercises = () => [...baseExercises, ...getCustomExercises()];
    const getExerciseById = (id) => getAllExercises().find(ex => ex.id === id);
    const getOrderedExercises = () => {
        const exercisesMap = new Map();
        getAllExercises().forEach(ex => exercisesMap.set(ex.id, ex));
        const ordered = [];
        const order = Array.isArray(appData.exerciseOrder) ? [...appData.exerciseOrder] : [];

        order.forEach(id => {
            if (exercisesMap.has(id)) {
                ordered.push(exercisesMap.get(id));
                exercisesMap.delete(id);
            }
        });

        exercisesMap.forEach(ex => ordered.push(ex));
        return ordered;
    };

    const generateExerciseId = (name) => {
        const normalized = (name || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const slug = normalized || 'exercicio';
        const existingIds = new Set(getAllExercises().map(ex => ex.id));
        let candidate = `custom-${slug}-${Date.now()}`;
        while (existingIds.has(candidate)) {
            candidate = `custom-${slug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        return candidate;
    };

    let synth, speech;
    const setupAudio = async () => {
        if (synth) return;
        await Tone.start();
        synth = new Tone.Synth().toDestination();
        speech = window.speechSynthesis;
    };

    const playSound = (note, duration = '8n') => {
        if (synth) synth.triggerAttackRelease(note, duration);
    };

    const speak = (text) => {
        if (!speech) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1;
        speech.cancel();
        speech.speak(utterance);
    };

    const saveData = () => {
        localStorage.setItem('jornadaGuerreiroData', JSON.stringify(appData));
    };

    const loadData = async () => {
        const savedData = localStorage.getItem('jornadaGuerreiroData');
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        let dataChanged = false;

        if (savedData) {
            appData = JSON.parse(savedData);

            if (
                !appData.currentChallenge ||
                appData.currentChallenge.year !== currentYear ||
                appData.currentChallenge.month !== currentMonth
            ) {
                const hasOldHistory = appData.history && Object.keys(appData.history).length > 0;
                const hasValidChallenge = appData.currentChallenge && appData.currentChallenge.year && appData.currentChallenge.month;

                if (hasOldHistory && hasValidChallenge) {
                    const shouldArchive = await showConfirmation({
                        title: 'Novo mês detectado',
                        message: 'Deseja arquivar o desafio anterior e iniciar um novo?',
                        confirmText: 'Arquivar e iniciar',
                        cancelText: 'Manter desafio atual'
                    });
                    if (shouldArchive) {
                        if (!appData.archive) appData.archive = {};
                        const archiveKey = `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;
                        appData.archive[archiveKey] = {
                            monthlyGoals: appData.monthlyGoals,
                            history: appData.history
                        };
                        appData.history = {};
                        dataChanged = true;
                    }
                }

                appData.currentChallenge = { year: currentYear, month: currentMonth };
                dataChanged = true;
            }
        } else {
            appData = {
                currentChallenge: { year: currentYear, month: currentMonth },
                monthlyGoals: {},
                history: {},
                archive: {},
                customExercises: [],
                exerciseOrder: baseExercises.map(ex => ex.id),
                dailySettings: {
                    cycles: 3,
                    restTime: 15,
                    seriesRestTime: 30,
                    enabledExercises: { abdominais: true, agachamentos: true, flexoes: true, isometria: false, prancha: false }
                }
            };
            baseExercises.forEach(ex => {
                appData.monthlyGoals[ex.id] = ex.monthlyGoal;
            });
            dataChanged = true;
        }

        if (!Array.isArray(appData.customExercises)) {
            appData.customExercises = [];
            dataChanged = true;
        }

        if (!appData.monthlyGoals || typeof appData.monthlyGoals !== 'object') {
            appData.monthlyGoals = {};
            dataChanged = true;
        }

        if (!Array.isArray(appData.exerciseOrder)) {
            appData.exerciseOrder = [];
            dataChanged = true;
        }

        const allExercises = getAllExercises();
        const allIds = allExercises.map(ex => ex.id);
        const validIds = new Set(allIds);

        const originalOrderLength = appData.exerciseOrder.length;
        appData.exerciseOrder = appData.exerciseOrder.filter(id => validIds.has(id));
        if (appData.exerciseOrder.length !== originalOrderLength) {
            dataChanged = true;
        }
        allIds.forEach(id => {
            if (!appData.exerciseOrder.includes(id)) {
                appData.exerciseOrder.push(id);
                dataChanged = true;
            }
        });

        Object.keys(appData.monthlyGoals).forEach(id => {
            if (!validIds.has(id)) {
                delete appData.monthlyGoals[id];
                dataChanged = true;
            }
        });
        allExercises.forEach(ex => {
            if (typeof appData.monthlyGoals[ex.id] !== 'number') {
                appData.monthlyGoals[ex.id] = ex.monthlyGoal || 0;
                dataChanged = true;
            }
        });

        if (!appData.dailySettings || typeof appData.dailySettings !== 'object') {
            appData.dailySettings = {};
            dataChanged = true;
        }
        if (typeof appData.dailySettings.cycles !== 'number') {
            appData.dailySettings.cycles = 3;
            dataChanged = true;
        }
        if (typeof appData.dailySettings.restTime !== 'number') {
            appData.dailySettings.restTime = 15;
            dataChanged = true;
        }
        if (typeof appData.dailySettings.seriesRestTime !== 'number') {
            appData.dailySettings.seriesRestTime = 30;
            dataChanged = true;
        }
        if (!appData.dailySettings.enabledExercises || typeof appData.dailySettings.enabledExercises !== 'object') {
            appData.dailySettings.enabledExercises = {};
            dataChanged = true;
        }

        const enabledExercises = appData.dailySettings.enabledExercises;
        Object.keys(enabledExercises).forEach(id => {
            if (!validIds.has(id)) {
                delete enabledExercises[id];
                dataChanged = true;
            }
        });
        allExercises.forEach(ex => {
            if (typeof enabledExercises[ex.id] === 'undefined') {
                enabledExercises[ex.id] = isBaseExercise(ex.id)
                    ? ['abdominais', 'agachamentos', 'flexoes'].includes(ex.id)
                    : true;
                dataChanged = true;
            }
        });

        if (dataChanged) {
            saveData();
        }
    };

    const switchScreen = (screenName) => {
        Object.values(screens).forEach(s => s.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    };

    const updateTimerDisplay = (value, unit = 'segundos', totalDuration) => {
        if (unit === 'reps') {
            ui.timerValue.classList.add('hidden');
            ui.repsContainer.classList.remove('hidden');
            ui.repsContainer.classList.add('flex');
            ui.repsValue.textContent = value;
        } else {
            ui.timerValue.classList.remove('hidden');
            ui.repsContainer.classList.add('hidden');
            ui.repsContainer.classList.remove('flex');
            ui.timerValue.textContent = value;
        }

        ui.timerUnit.textContent = unit;

        if (totalDuration && value > 0) {
            const progress = (totalDuration - value) / totalDuration;
            ui.progressCircle.style.strokeDashoffset = CIRCLE_LENGTH * (1 - progress);
        } else {
            ui.progressCircle.style.strokeDashoffset = CIRCLE_LENGTH;
        }
    };

    const updateWorkoutDisplay = () => {
        const { currentSeries, currentExerciseIndex, totalSeries, currentWorkout } = workoutState;
        if (currentExerciseIndex < 0) {
            ui.seriesDisplay.textContent = `Série ${currentSeries + 1} / ${totalSeries}`;
            const nextExerciseName = currentWorkout[0] ? currentWorkout[0][0].name : 'Fim';
            ui.nextExerciseDisplay.textContent = nextExerciseName;
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
    };

    const getDailyWorkout = () => {
        const selected = [];
        const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked').value, 10) || 1;
        getOrderedExercises().forEach(ex => {
            const checkbox = document.getElementById(`check-daily-${ex.id}`);
            if (checkbox && checkbox.checked) {
                const input = document.getElementById(`input-daily-${ex.id}`);
                selected.push({
                    ...ex,
                    v: Math.ceil((parseInt(input.value, 10) || 0) / seriesCount)
                });
            }
        });
        return selected;
    };

    const calculateTotalTime = () => {
        const dailyWorkout = getDailyWorkout();
        const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked').value, 10);
        const rest = parseInt(document.querySelector('input[name="restTime"]:checked').value, 10);
        const seriesRest = parseInt(document.querySelector('input[name="seriesRestTime"]:checked').value, 10);

        if (dailyWorkout.length === 0) {
            ui.totalTimeDisplay.textContent = '0m 00s';
            return;
        }

        let totalSeconds = PREP_TIME;

        for (let i = 0; i < seriesCount; i++) {
            dailyWorkout.forEach(ex => {
                totalSeconds += (ex.t === 'time' ? ex.v : ex.v * 2);
            });
            if (dailyWorkout.length > 1) {
                totalSeconds += rest * (dailyWorkout.length - 1);
            }
        }

        if (seriesCount > 1) {
            totalSeconds += seriesRest * (seriesCount - 1);
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        ui.totalTimeDisplay.textContent = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    };

    const calculateDailyGoals = () => {
        const selectedRadio = document.querySelector('input[name="days-in-month"]:checked');
        const days = selectedRadio ? parseInt(selectedRadio.value, 10) : 31;

        getOrderedExercises().forEach(ex => {
            const monthlyInput = document.getElementById(`input-monthly-${ex.id}`);
            const dailyInput = document.getElementById(`input-daily-${ex.id}`);
            const perSeriesSpan = document.getElementById(`per-series-${ex.id}`);

            if (monthlyInput && dailyInput && perSeriesSpan) {
                const monthlyGoal = parseInt(monthlyInput.value, 10) || 0;
                const dailyGoal = Math.ceil(monthlyGoal / days);
                dailyInput.value = dailyGoal;

                const seriesCount = parseInt(document.querySelector('input[name="cycles"]:checked').value, 10) || 1;
                perSeriesSpan.textContent = `(${Math.ceil(dailyGoal / seriesCount)} por série)`;
            }
        });
        calculateTotalTime();
    };

    const updateProgressDisplay = () => {
        ui.monthlyProgressContainer.innerHTML = '';
        const exercises = getOrderedExercises();
        const monthlyTotals = {};
        exercises.forEach(ex => monthlyTotals[ex.id] = 0);

        const trainingDays = Object.keys(appData.history).length;
        const selectedDaysRadio = document.querySelector('input[name="days-in-month"]:checked');
        const totalDaysInMonth = selectedDaysRadio ? parseInt(selectedDaysRadio.value, 10) : 31;

        for (const date in appData.history) {
            if (Array.isArray(appData.history[date])) {
                appData.history[date].forEach(session => {
                    for (const exId in session.log) {
                        if (monthlyTotals.hasOwnProperty(exId)) {
                            monthlyTotals[exId] += session.log[exId];
                        }
                    }
                });
            }
        }

        let completedExercises = 0;
        exercises.forEach(ex => {
            const goal = appData.monthlyGoals[ex.id] || ex.monthlyGoal || 0;
            const done = monthlyTotals[ex.id] || 0;
            const remaining = goal - done;
            const average = trainingDays > 0 ? Math.ceil(done / trainingDays) : 0;
            if (goal > 0 && done >= goal) {
                completedExercises++;
            }
            const progressEl = document.createElement('div');
            progressEl.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between sm:items-center text-gray-300">
                    <span class="font-bold sm:w-1/3">${ex.name}</span>
                    <div class="flex flex-wrap w-full sm:w-2/3 justify-between mt-1 sm:mt-0 text-xs sm:text-sm">
                        <span class="w-1/2 sm:w-auto text-left sm:text-right mb-1 sm:mb-0">Média/Dia: <strong class="text-white">${average}</strong></span>
                        <span class="w-1/2 sm:w-auto text-right sm:text-right mb-1 sm:mb-0">Feito: <strong class="text-white">${done}</strong></span>
                        <span class="w-full sm:w-auto text-left sm:text-right">Falta: <strong class="text-white">${remaining > 0 ? remaining : 0}</strong></span>
                    </div>
                </div>
            `;
            ui.monthlyProgressContainer.appendChild(progressEl);
        });

        if (ui.monthlyOverviewDays) {
            ui.monthlyOverviewDays.textContent = trainingDays;
        }

        if (ui.monthlyOverviewCompleted) {
            ui.monthlyOverviewCompleted.textContent = `${completedExercises}/${exercises.length}`;
        }

        if (ui.monthlyOverviewRemaining) {
            let daysRemaining = totalDaysInMonth;
            const challenge = appData.currentChallenge || {};
            const today = new Date();
            if (
                typeof challenge.year === 'number' &&
                typeof challenge.month === 'number' &&
                today.getFullYear() === challenge.year &&
                today.getMonth() + 1 === challenge.month
            ) {
                const currentDay = Math.min(today.getDate(), totalDaysInMonth);
                daysRemaining = Math.max(totalDaysInMonth - currentDay, 0);
            } else {
                daysRemaining = Math.max(totalDaysInMonth - trainingDays, 0);
            }
            ui.monthlyOverviewRemaining.textContent = daysRemaining;
        }
    };

    const renderSetupScreen = () => {
        ui.monthlyGoalsContainer.innerHTML = '';
        ui.exerciseSelectionContainer.innerHTML = '';

        getOrderedExercises().forEach(ex => {
            const unit = ex.t === 'reps' ? 'reps' : 's';
            const isCustom = !isBaseExercise(ex.id);
            const monthlyGoalValue = typeof appData.monthlyGoals[ex.id] === 'number'
                ? appData.monthlyGoals[ex.id]
                : (ex.monthlyGoal || 0);

            const monthlyEl = document.createElement('div');
            monthlyEl.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2';
            monthlyEl.dataset.id = ex.id;
            monthlyEl.innerHTML = `
                <div class="flex items-center">
                    <label for="input-monthly-${ex.id}" class="text-white">${ex.name}</label>
                    ${isCustom ? `
                        <div class="flex items-center ml-3 space-x-2">
                            <button type="button" data-exercise-action="edit" data-id="${ex.id}" class="exercise-action text-xs text-indigo-400 hover:text-indigo-200">Editar</button>
                            <button type="button" data-exercise-action="remove" data-id="${ex.id}" class="exercise-action text-xs text-red-400 hover:text-red-200">Remover</button>
                        </div>
                    ` : ''}
                </div>
                <div class="flex items-center">
                    <input type="number" id="input-monthly-${ex.id}" value="${monthlyGoalValue}" class="w-24 bg-gray-900 border border-gray-600 rounded-md p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <span class="ml-2 text-gray-400 w-8">${unit}</span>
                </div>
            `;
            ui.monthlyGoalsContainer.appendChild(monthlyEl);

            const isChecked = appData.dailySettings.enabledExercises[ex.id] ? 'checked' : '';
            const dailyEl = document.createElement('div');
            dailyEl.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900/50 p-3 rounded-md exercise-item';
            dailyEl.dataset.id = ex.id;
            dailyEl.innerHTML = `
                <div class="flex items-center w-full sm:w-auto flex-wrap">
                    <span class="drag-handle hidden cursor-move mr-3">☰</span>
                    <input id="check-daily-${ex.id}" type="checkbox" class="custom-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" ${isChecked}>
                    <label for="check-daily-${ex.id}" class="ml-3 text-white">${ex.name}</label>
                    ${isCustom ? `
                        <div class="flex items-center ml-3 space-x-2">
                            <button type="button" data-exercise-action="edit" data-id="${ex.id}" class="exercise-action text-xs text-indigo-400 hover:text-indigo-200">Editar</button>
                            <button type="button" data-exercise-action="remove" data-id="${ex.id}" class="exercise-action text-xs text-red-400 hover:text-red-200">Remover</button>
                        </div>
                    ` : ''}
                </div>
                <div class="flex items-center w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                    <input type="number" id="input-daily-${ex.id}" value="0" class="w-20 bg-gray-700 border border-gray-600 rounded-md p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <div class="flex flex-col items-start ml-2 w-24">
                        <span class="text-gray-400 text-sm">${unit}/dia</span>
                        <span id="per-series-${ex.id}" class="text-xs text-gray-500">(0 por série)</span>
                    </div>
                </div>
            `;
            ui.exerciseSelectionContainer.appendChild(dailyEl);
        });
    };

    const closeExerciseModal = () => {
        if (ui.exerciseModal) {
            ui.exerciseModal.classList.add('hidden');
        }
        if (ui.exerciseForm) {
            ui.exerciseForm.reset();
        }
        if (ui.exerciseModalError) {
            ui.exerciseModalError.textContent = '';
        }
        editingExerciseId = null;
    };

    const openExerciseModal = (exercise = null) => {
        if (!ui.exerciseModal) return;

        editingExerciseId = exercise ? exercise.id : null;
        if (ui.exerciseModalTitle) {
            ui.exerciseModalTitle.textContent = exercise ? 'Editar Exercício' : 'Novo Exercício';
        }
        if (ui.exerciseNameInput) {
            ui.exerciseNameInput.value = exercise ? exercise.name : '';
        }
        if (ui.exerciseTypeSelect) {
            ui.exerciseTypeSelect.value = exercise ? (exercise.t === 'time' ? 'time' : 'reps') : 'reps';
        }
        if (ui.exerciseMonthlyGoalInput) {
            const goalValue = exercise ? (appData.monthlyGoals[exercise.id] ?? exercise.monthlyGoal ?? 0) : '';
            ui.exerciseMonthlyGoalInput.value = goalValue !== '' ? goalValue : '';
        }
        if (ui.exerciseModalError) {
            ui.exerciseModalError.textContent = '';
        }

        ui.exerciseModal.classList.remove('hidden');
        setTimeout(() => {
            if (ui.exerciseNameInput) ui.exerciseNameInput.focus();
        }, 0);
    };

    const removeCustomExercise = async (exerciseId) => {
        if (!exerciseId || isBaseExercise(exerciseId)) return;
        const customExercise = getCustomExercises().find(ex => ex.id === exerciseId);
        if (!customExercise) return;

        const confirmed = await showConfirmation({
            title: 'Remover exercício',
            message: `Deseja remover "${customExercise.name}" e seus ajustes personalizados?`,
            confirmText: 'Remover',
            cancelText: 'Cancelar',
            variant: 'danger'
        });

        if (!confirmed) return;

        appData.customExercises = getCustomExercises().filter(ex => ex.id !== exerciseId);
        if (appData.monthlyGoals && appData.monthlyGoals.hasOwnProperty(exerciseId)) {
            delete appData.monthlyGoals[exerciseId];
        }
        if (appData.dailySettings && appData.dailySettings.enabledExercises) {
            delete appData.dailySettings.enabledExercises[exerciseId];
        }
        if (Array.isArray(appData.exerciseOrder)) {
            appData.exerciseOrder = appData.exerciseOrder.filter(id => id !== exerciseId);
        }
        if (editingExerciseId === exerciseId) {
            editingExerciseId = null;
        }

        saveData();
        renderSetupScreen();
        calculateDailyGoals();
        updateProgressDisplay();
    };

    const handleExerciseFormSubmit = (event) => {
        event.preventDefault();
        if (!ui.exerciseNameInput || !ui.exerciseTypeSelect || !ui.exerciseMonthlyGoalInput) return;

        const name = ui.exerciseNameInput.value.trim();
        const type = ui.exerciseTypeSelect.value === 'time' ? 'time' : 'reps';
        const monthlyGoalValue = parseInt(ui.exerciseMonthlyGoalInput.value, 10);

        if (!name) {
            if (ui.exerciseModalError) ui.exerciseModalError.textContent = 'Informe um nome para o exercício.';
            return;
        }
        if (!Number.isFinite(monthlyGoalValue) || monthlyGoalValue <= 0) {
            if (ui.exerciseModalError) ui.exerciseModalError.textContent = 'Defina uma meta mensal válida.';
            return;
        }

        if (!Array.isArray(appData.customExercises)) {
            appData.customExercises = [];
        }
        if (!appData.dailySettings || typeof appData.dailySettings !== 'object') {
            appData.dailySettings = {};
        }
        if (!appData.dailySettings.enabledExercises || typeof appData.dailySettings.enabledExercises !== 'object') {
            appData.dailySettings.enabledExercises = {};
        }
        if (!Array.isArray(appData.exerciseOrder)) {
            appData.exerciseOrder = [];
        }

        if (editingExerciseId) {
            const exercise = appData.customExercises.find(ex => ex.id === editingExerciseId);
            if (exercise) {
                exercise.name = name;
                exercise.t = type;
                exercise.monthlyGoal = monthlyGoalValue;
                appData.monthlyGoals[editingExerciseId] = monthlyGoalValue;
            }
        } else {
            const id = generateExerciseId(name);
            const newExercise = { id, name, t: type, monthlyGoal: monthlyGoalValue };
            appData.customExercises.push(newExercise);
            appData.monthlyGoals[id] = monthlyGoalValue;
            appData.dailySettings.enabledExercises[id] = true;
            if (!appData.exerciseOrder.includes(id)) {
                appData.exerciseOrder.push(id);
            }
        }

        saveData();
        renderSetupScreen();
        calculateDailyGoals();
        updateProgressDisplay();
        closeExerciseModal();
    };

    const logExercise = (exercise, completedValue) => {
        if (!workoutState.sessionLog[exercise.id]) {
            workoutState.sessionLog[exercise.id] = { name: exercise.name, t: exercise.t, completed: 0 };
        }
        workoutState.sessionLog[exercise.id].completed += completedValue;
    };

    const startTimer = (duration, onComplete, onTick) => {
        clearInterval(workoutState.timerInterval);
        workoutState.timerDetails = { timeLeft: duration, totalDuration: duration };

        workoutState.timerInterval = setInterval(() => {
            if (workoutState.isPaused) return;

            workoutState.timerDetails.timeLeft--;
            if (onTick) onTick(workoutState.timerDetails.timeLeft, duration);
            if (workoutState.timerDetails.timeLeft <= 3 && workoutState.timerDetails.timeLeft > 0) playSound('C5', '16n');
            if (workoutState.timerDetails.timeLeft <= 0) {
                clearInterval(workoutState.timerInterval);
                playSound('G5', '4n');
                if (onComplete) onComplete();
            }
        }, 1000);
    };

    const runNextStep = () => {
        ui.mainWorkoutDisplay.classList.remove('hidden');
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
                if (timeLeft <= 3) {
                    ui.progressCircle.classList.add('timer-circle-alert');
                } else {
                    ui.progressCircle.classList.remove('timer-circle-alert');
                }
            });
        } else {
            clearInterval(workoutState.timerInterval);
            ui.pauseResumeBtn.style.display = 'none';
            ui.skipBtn.textContent = 'Pronto';
            updateTimerDisplay(exercise.v, 'reps');
        }
    };

    const startExerciseRest = () => {
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
            if (timeLeft <= 3) {
                ui.progressCircle.classList.add('timer-circle-alert');
            } else {
                ui.progressCircle.classList.remove('timer-circle-alert');
            }
        });
    };

    const startSeriesRest = () => {
        ui.mainWorkoutDisplay.classList.add('hidden');
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
                ui.seriesRestProgressBar.classList.remove('bg-indigo-600');
                ui.seriesRestProgressBar.classList.add('bg-red-600');
            }
        };

        ui.seriesRestProgressBar.classList.remove('bg-red-600');
        ui.seriesRestProgressBar.classList.add('bg-indigo-600');
        startTimer(workoutState.seriesRestTime, runNextStep, onTick);
        onTick(workoutState.seriesRestTime, workoutState.seriesRestTime);
    };

    const startWorkout = async () => {
        ui.validationError.textContent = '';
        const dailyWorkout = getDailyWorkout();

        if (dailyWorkout.length === 0) {
            ui.validationError.textContent = 'Selecione pelo menos um exercício.';
            return;
        }

        await setupAudio();
        workoutState.totalSeries = parseInt(document.querySelector('input[name="cycles"]:checked').value, 10);
        workoutState.restTime = parseInt(document.querySelector('input[name="restTime"]:checked').value, 10);
        workoutState.seriesRestTime = parseInt(document.querySelector('input[name="seriesRestTime"]:checked').value, 10);

        workoutState.currentWorkout = [];
        for (let i = 0; i < workoutState.totalSeries; i++) {
            workoutState.currentWorkout.push(dailyWorkout);
        }

        workoutState.sessionLog = {};

        switchScreen('workout');
        ui.exerciseDisplay.textContent = 'Prepare-se!';
        updateWorkoutDisplay();
        speak(`Prepare-se. O treino vai começar.`);
        updateTimerDisplay(PREP_TIME, 'segundos', PREP_TIME);
        startTimer(PREP_TIME, runNextStep, (timeLeft, total) => {
            updateTimerDisplay(timeLeft, 'segundos', total);
            if (timeLeft <= 3) {
                ui.progressCircle.classList.add('timer-circle-alert');
            } else {
                ui.progressCircle.classList.remove('timer-circle-alert');
            }
        });
    };

    const renderSummary = (isPartial = false) => {
        const listElement = isPartial ? ui.partialSummaryList : ui.summaryList;
        listElement.innerHTML = '';
        if (Object.keys(workoutState.sessionLog).length === 0) {
            listElement.innerHTML = '<p class="text-gray-400 text-center">Nenhum exercício foi completado.</p>';
            return;
        }

        for (const key in workoutState.sessionLog) {
            const log = workoutState.sessionLog[key];
            const unit = log.t === 'reps' ? 'reps' : 's';
            const summaryEl = document.createElement('div');
            summaryEl.className = 'flex justify-between items-center bg-gray-800/70 p-2 rounded';
            summaryEl.innerHTML = `
                <span class="text-gray-300">${log.name}</span>
                <span class="font-bold text-indigo-300">${log.completed} ${unit}</span>
            `;
            listElement.appendChild(summaryEl);
        }
    };

    const endWorkout = (completed = false) => {
        clearInterval(workoutState.timerInterval);

        const today = new Date();
        const dateKey = today.toISOString().slice(0, 10);
        const session = {
            timestamp: today.toISOString(),
            log: {}
        };

        for (const key in workoutState.sessionLog) {
            session.log[key] = workoutState.sessionLog[key].completed;
        }

        if (Object.keys(session.log).length > 0) {
            if (!appData.history[dateKey]) {
                appData.history[dateKey] = [];
            }
            appData.history[dateKey].push(session);
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
    };

    const resetWorkout = () => {
        clearInterval(workoutState.timerInterval);
        workoutState.isPaused = false;
        workoutState.currentSeries = 0;
        workoutState.currentExerciseIndex = -1;
        workoutState.sessionLog = {};
        ui.pauseResumeBtn.textContent = 'Pausar';
        ui.pauseResumeBtn.style.display = 'inline-block';
        ui.skipBtn.textContent = 'Pular';
        ui.pauseOverlay.classList.remove('visible');
        ui.mainWorkoutDisplay.classList.remove('hidden');
        ui.seriesRestDisplay.classList.add('hidden');
        updateProgressDisplay();
        switchScreen('setup');
    };

    const togglePause = () => {
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
    };

    const handleSkipOrDone = () => {
        ui.workoutScreen.classList.add('flash-animation');
        setTimeout(() => ui.workoutScreen.classList.remove('flash-animation'), 500);

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

            if (isResting) {
                runNextStep();
            } else {
                startExerciseRest();
            }
        }
    };

    const renderHistory = (archiveKey = null) => {
        ui.historyList.innerHTML = '';

        let dataSet;
        let isArchived = false;
        const exerciseMap = new Map();
        getAllExercises().forEach(ex => exerciseMap.set(ex.id, ex));
        const exerciseOrder = Array.isArray(appData.exerciseOrder) ? appData.exerciseOrder : [];
        if (archiveKey) {
            const { year, month } = appData.currentChallenge;
            const currentKey = `${year}-${String(month).padStart(2, '0')}`;
            if (archiveKey !== currentKey) {
                isArchived = true;
                dataSet = (appData.archive && appData.archive[archiveKey]) ? appData.archive[archiveKey].history : {};
            } else {
                dataSet = appData.history || {};
            }
        } else {
            dataSet = appData.history || {};
        }

        const sortedDates = Object.keys(dataSet)
            .filter(date => {
                const sessions = dataSet[date];
                return Array.isArray(sessions) && sessions.length > 0;
            })
            .sort()
            .reverse();

        if (sortedDates.length === 0) {
            ui.historyList.innerHTML = '<p class="text-gray-400 text-center">Nenhum treino registrado para este mês.</p>';
            return;
        }

        sortedDates.forEach(date => {
            const sessions = dataSet[date];
            if (!Array.isArray(sessions) || sessions.length === 0) return;

            const dateObj = new Date(date + 'T00:00:00');
            if (isNaN(dateObj.getTime())) return;

            const dateStr = dateObj.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const dateSection = document.createElement('div');
            dateSection.innerHTML = `<div class="font-bold text-indigo-300 my-2">${dateStr}</div>`;
            ui.historyList.appendChild(dateSection);

            sessions.forEach((session, index) => {
                if (!session || !session.log) return;

                let timeStr = 'Horário não disponível';
                if (session.timestamp) {
                    const timestampDate = new Date(session.timestamp);
                    if (!isNaN(timestampDate.getTime())) {
                        timeStr = timestampDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    }
                }

                const sessionDiv = document.createElement('div');
                sessionDiv.className = 'bg-gray-900/50 p-3 rounded-md mb-2';

                let sessionContent = `
                    <div class="flex justify-between items-center">
                        <p class="font-bold text-white">Treino às ${timeStr}</p>
                        <button data-date="${date}" data-index="${index}" class="delete-history-entry text-gray-400 hover:text-red-500" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <ul class="list-disc list-inside text-gray-300">`;
                const sortedEntries = Object.entries(session.log)
                    .filter(([, value]) => value > 0)
                    .sort((a, b) => {
                        const indexA = exerciseOrder.indexOf(a[0]);
                        const indexB = exerciseOrder.indexOf(b[0]);
                        if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    });

                sortedEntries.forEach(([exId, value]) => {
                    const exercise = exerciseMap.get(exId);
                    const label = exercise ? exercise.name : exId;
                    const unit = exercise ? (exercise.t === 'reps' ? 'reps' : 's') : '';
                    const displayUnit = unit ? ` ${unit}` : '';
                    sessionContent += `<li>${label}: ${value}${displayUnit}</li>`;
                });

                sessionContent += '</ul>';
                sessionDiv.innerHTML = sessionContent;
                ui.historyList.appendChild(sessionDiv);
            });
        });
    };

    function populateHistoryMonthSelect() {
        ui.historyMonthSelect.innerHTML = '';
        const { year, month } = appData.currentChallenge;
        const currentKey = `${year}-${String(month).padStart(2, '0')}`;
        const currentOption = document.createElement('option');
        currentOption.value = currentKey;
        currentOption.textContent = `${month}/${year} (atual)`;
        ui.historyMonthSelect.appendChild(currentOption);
        if (appData.archive) {
            Object.keys(appData.archive).sort().reverse().forEach(key => {
                const [aYear, aMonth] = key.split('-');
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${aMonth}/${aYear}`;
                ui.historyMonthSelect.appendChild(option);
            });
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.exercise-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const addEventListeners = () => {
        ui.startBtn.addEventListener('click', startWorkout);
        ui.restartBtn.addEventListener('click', resetWorkout);
        ui.pauseResumeBtn.addEventListener('click', togglePause);
        ui.skipBtn.addEventListener('click', handleSkipOrDone);
        ui.endBtn.addEventListener('click', async () => {
            const shouldEnd = await showConfirmation({
                title: 'Encerrar treino?',
                message: 'Tem certeza que deseja encerrar o treino? Seu progresso até aqui será salvo.',
                confirmText: 'Encerrar treino',
                cancelText: 'Continuar',
                variant: 'danger'
            });
            if (shouldEnd) {
                endWorkout(false);
            }
        });

        document.querySelectorAll('input[name="days-in-month"]').forEach(radio => {
            radio.addEventListener('change', () => {
                calculateDailyGoals();
                updateProgressDisplay();
            });
        });
        document.querySelectorAll('input[name="cycles"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                updateDailySettings('cycles', parseInt(e.target.value, 10));
                calculateDailyGoals();
            });
        });
        document.querySelectorAll('input[name="restTime"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                updateDailySettings('restTime', parseInt(e.target.value, 10));
                calculateTotalTime();
            });
        });
        document.querySelectorAll('input[name="seriesRestTime"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                updateDailySettings('seriesRestTime', parseInt(e.target.value, 10));
                calculateTotalTime();
            });
        });

        if (ui.addExerciseBtn) {
            ui.addExerciseBtn.addEventListener('click', () => openExerciseModal());
        }
        if (ui.cancelExerciseBtn) {
            ui.cancelExerciseBtn.addEventListener('click', (event) => {
                event.preventDefault();
                closeExerciseModal();
            });
        }
        if (ui.exerciseForm) {
            ui.exerciseForm.addEventListener('submit', handleExerciseFormSubmit);
        }
        if (ui.exerciseModal) {
            ui.exerciseModal.addEventListener('click', (event) => {
                if (event.target === ui.exerciseModal) {
                    closeExerciseModal();
                }
            });
        }

        const handleExerciseActionClick = async (event) => {
            const actionBtn = event.target.closest('[data-exercise-action]');
            if (!actionBtn) return;

            const action = actionBtn.dataset.exerciseAction;
            const exerciseId = actionBtn.dataset.id;
            if (!action || !exerciseId || isBaseExercise(exerciseId)) return;

            event.preventDefault();
            event.stopPropagation();

            if (action === 'edit') {
                const exercise = getCustomExercises().find(ex => ex.id === exerciseId);
                if (exercise) openExerciseModal(exercise);
            } else if (action === 'remove') {
                await removeCustomExercise(exerciseId);
            }
        };

        if (ui.monthlyGoalsContainer) {
            ui.monthlyGoalsContainer.addEventListener('click', handleExerciseActionClick);
        }
        if (ui.exerciseSelectionContainer) {
            ui.exerciseSelectionContainer.addEventListener('click', handleExerciseActionClick);
        }

        ui.monthlyGoalsContainer.addEventListener('input', e => {
            if (e.target.id && e.target.id.startsWith('input-monthly-')) {
                const exerciseId = e.target.id.replace('input-monthly-', '');
                if (getExerciseById(exerciseId)) {
                    appData.monthlyGoals[exerciseId] = parseInt(e.target.value, 10) || 0;
                    saveData();
                    calculateDailyGoals();
                    updateProgressDisplay();
                }
            }
        });

        ui.exerciseSelectionContainer.addEventListener('change', e => {
            if (e.target.id && e.target.id.startsWith('check-daily-')) {
                const exerciseId = e.target.id.replace('check-daily-', '');
                if (getExerciseById(exerciseId)) {
                    appData.dailySettings.enabledExercises[exerciseId] = e.target.checked;
                    saveData();
                    calculateTotalTime();
                }
            }
        });

        ui.exerciseSelectionContainer.addEventListener('input', e => {
            if (e.target.id && e.target.id.startsWith('input-daily-')) {
                calculateDailyGoals();
            }
        });

        ui.helpBtn.addEventListener('click', () => ui.helpModal.classList.remove('hidden'));
        ui.closeHelpBtn.addEventListener('click', () => ui.helpModal.classList.add('hidden'));
        ui.helpModal.addEventListener('click', (e) => {
            if (e.target === ui.helpModal) {
                ui.helpModal.classList.add('hidden');
            }
        });

        ui.historyBtn.addEventListener('click', () => {
            populateHistoryMonthSelect();
            const { year, month } = appData.currentChallenge;
            ui.historyMonthSelect.value = `${year}-${String(month).padStart(2, '0')}`;
            renderHistory();
            ui.historyModal.classList.remove('hidden');
        });
        ui.closeHistoryBtn.addEventListener('click', () => {
            ui.historyModal.classList.add('hidden');
            updateProgressDisplay();
        });
        ui.historyModal.addEventListener('click', (e) => {
            if (e.target === ui.historyModal) {
                ui.historyModal.classList.add('hidden');
                updateProgressDisplay();
            }
        });
        ui.clearHistoryBtn.addEventListener('click', async () => {
            const archiveKey = ui.historyMonthSelect.value;
            const [selectedYear, selectedMonth] = archiveKey.split('-');
            const formattedKey = (selectedMonth && selectedYear) ? `${selectedMonth}/${selectedYear}` : archiveKey;
            const shouldClear = await showConfirmation({
                title: 'Limpar histórico',
                message: `Todo o histórico de ${formattedKey} será excluído. Deseja continuar?`,
                confirmText: 'Limpar histórico',
                cancelText: 'Cancelar',
                variant: 'danger'
            });
            if (shouldClear) {
                if (archiveKey === `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`) {
                    appData.history = {};
                } else if (appData.archive && appData.archive[archiveKey]) {
                    delete appData.archive[archiveKey];
                }
                saveData();
                populateHistoryMonthSelect();
                renderHistory(archiveKey);
                updateProgressDisplay();
            }
        });

        ui.historyMonthSelect.addEventListener('change', (e) => {
            renderHistory(e.target.value);
        });

        ui.historyList.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-history-entry');
            if (!deleteBtn) return;

            const { date, index } = deleteBtn.dataset;
            if (!date || !index) return;

            const shouldDelete = await showConfirmation({
                title: 'Excluir treino',
                message: 'Este treino será excluído, tem certeza?',
                confirmText: 'Excluir',
                cancelText: 'Cancelar',
                variant: 'danger'
            });
            if (shouldDelete) {
                const archiveKey = ui.historyMonthSelect.value;
                const isCurrentMonth = archiveKey === `${appData.currentChallenge.year}-${String(appData.currentChallenge.month).padStart(2, '0')}`;

                try {
                    const historySource = isCurrentMonth ? appData.history :
                        ((appData.archive[archiveKey] && appData.archive[archiveKey].history) || {});

                    if (!historySource[date] || !Array.isArray(historySource[date])) return;

                    historySource[date].splice(index, 1);

                    if (historySource[date].length === 0) {
                        delete historySource[date];
                    }

                    saveData();
                    populateHistoryMonthSelect();

                    renderHistory(archiveKey);

                    updateProgressDisplay();
                } catch (error) {
                    console.error('Erro ao excluir treino:', error);
                    alert('Ocorreu um erro ao excluir o treino. Por favor, tente novamente.');
                }
            }
        });

        ui.minusRepBtn.addEventListener('click', () => {
            let currentValue = parseInt(ui.repsValue.textContent, 10);
            if (currentValue > 0) ui.repsValue.textContent = currentValue - 1;
        });
        ui.plusRepBtn.addEventListener('click', () => {
            let currentValue = parseInt(ui.repsValue.textContent, 10);
            ui.repsValue.textContent = currentValue + 1;
        });

        ui.addRetroBtn.addEventListener('click', () => {
            ui.retroExerciseInputs.innerHTML = '';
            const today = new Date().toISOString().split('T')[0];
            ui.retroDateInput.value = today;
            ui.retroDateInput.max = today;

            getOrderedExercises().forEach(ex => {
                const div = document.createElement('div');
                div.className = 'mb-4';
                div.innerHTML = `
                    <label for="retro-${ex.id}" class="block text-sm font-bold text-gray-300 mb-2">${ex.name} (${ex.t === 'reps' ? 'repetições' : 'segundos'})</label>
                    <input type="number" id="retro-${ex.id}" class="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" min="0">
                `;
                ui.retroExerciseInputs.appendChild(div);
            });

            ui.retroModal.classList.remove('hidden');
        });

        ui.cancelRetroBtn.addEventListener('click', () => ui.retroModal.classList.add('hidden'));

        ui.saveRetroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const date = ui.retroDateInput.value;
            if (!date) {
                alert('Por favor, selecione uma data.');
                return;
            }
            const retroLog = {};
            let hasData = false;
            getOrderedExercises().forEach(ex => {
                const input = document.getElementById(`retro-${ex.id}`);
                const value = parseInt(input?.value, 10) || 0;
                if (value > 0) {
                    retroLog[ex.id] = value;
                    hasData = true;
                }
            });
            if (!hasData) {
                alert('Adicione pelo menos um exercício.');
                return;
            }
            const session = {
                timestamp: new Date(date).toISOString(),
                log: retroLog
            };
            if (!appData.history[date]) {
                appData.history[date] = [];
            }
            appData.history[date].push(session);
            saveData();
            updateProgressDisplay();
            ui.retroModal.classList.add('hidden');
        });

        ui.orderBtn.addEventListener('click', () => {
            document.querySelectorAll('.drag-handle').forEach(handle => handle.classList.remove('hidden'));
            document.querySelectorAll('.exercise-item').forEach(item => item.setAttribute('draggable', true));
            ui.orderBtn.classList.add('hidden');
            ui.saveOrderBtn.classList.remove('hidden');
        });

        ui.saveOrderBtn.addEventListener('click', () => {
            const newOrder = [...document.querySelectorAll('.exercise-item')].map(item => item.dataset.id);
            appData.exerciseOrder = newOrder;
            saveData();

            document.querySelectorAll('.drag-handle').forEach(handle => handle.classList.add('hidden'));
            document.querySelectorAll('.exercise-item').forEach(item => item.removeAttribute('draggable'));
            ui.orderBtn.classList.remove('hidden');
            ui.saveOrderBtn.classList.add('hidden');

            renderSetupScreen();
            calculateDailyGoals();
            updateProgressDisplay();
        });

        let draggingElement = null;

        ui.exerciseSelectionContainer.addEventListener('dragstart', e => {
            if (e.target.classList.contains('exercise-item')) {
                draggingElement = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        ui.exerciseSelectionContainer.addEventListener('dragend', e => {
            if (draggingElement) {
                draggingElement.classList.remove('dragging');
            }
            draggingElement = null;
        });

        ui.exerciseSelectionContainer.addEventListener('dragover', e => {
            e.preventDefault();
            if (!draggingElement) return;

            const afterElement = getDragAfterElement(ui.exerciseSelectionContainer, e.clientY);
            const container = ui.exerciseSelectionContainer;

            if (afterElement == null) {
                container.appendChild(draggingElement);
            } else {
                container.insertBefore(draggingElement, afterElement);
            }
        });

        ui.advancedOptionsToggle.addEventListener('click', () => {
            ui.advancedOptionsContent.classList.toggle('expanded');
            ui.advancedOptionsArrow.classList.toggle('rotate-180');
        });
    };

    function updateDailySettings(key, value) {
        if (!appData.dailySettings) appData.dailySettings = {};
        appData.dailySettings[key] = value;
        saveData();
    }

    function applySavedDailySettings() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        const daysRadio = document.querySelector(`input[name="days-in-month"][value="${daysInMonth}"]`);
        if (daysRadio) {
            daysRadio.checked = true;
        } else {
            const fallbackRadio = document.querySelector(`input[name="days-in-month"][value="31"]`);
            if (fallbackRadio) fallbackRadio.checked = true;
        }

        if (!appData.dailySettings) return;
        if (typeof appData.dailySettings.cycles === 'number') {
            const cyclesRadio = document.querySelector(`input[name="cycles"][value="${appData.dailySettings.cycles}"]`);
            if (cyclesRadio) cyclesRadio.checked = true;
        }
        if (typeof appData.dailySettings.restTime === 'number') {
            const restRadio = document.querySelector(`input[name="restTime"][value="${appData.dailySettings.restTime}"]`);
            if (restRadio) restRadio.checked = true;
        }
        if (typeof appData.dailySettings.seriesRestTime === 'number') {
            const seriesRestRadio = document.querySelector(`input[name="seriesRestTime"][value="${appData.dailySettings.seriesRestTime}"]`);
            if (seriesRestRadio) seriesRestRadio.checked = true;
        }
    }

    await loadData();
    renderSetupScreen();
    addEventListeners();
    applySavedDailySettings();
    calculateDailyGoals();
    updateProgressDisplay();
});
