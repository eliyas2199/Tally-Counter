document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const countDisplay = document.getElementById('count-display');
    const countButton = document.getElementById('count-button');
    const resetButton = document.getElementById('reset-button');
    const appContainer = document.querySelector('.app-container');
    const displayArea = document.querySelector('.display-area');

    const counterPage = document.getElementById('counter-page');
    const historyPage = document.getElementById('history-page');
    const pages = [counterPage, historyPage].filter(Boolean); // Filter out null if any element is missing

    const settingsPanel = document.getElementById('settings-panel');
    const applySettingsButton = document.getElementById('apply-settings-button');
    const countButtonColorInput = document.getElementById('count-button-color');
    const resetButtonColorInput = document.getElementById('reset-button-color');
    const numberColorInput = document.getElementById('number-color');
    const languageSelect = document.getElementById('language-select');
    const appContainerColorInput = document.getElementById('app-container-color');
    const neonEffectToggleSelect = document.getElementById('neon-effect-toggle');
    const neonColorInput = document.getElementById('neon-color');
    const backgroundThemeSelect = document.getElementById('background-theme-select');
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');

    const navHomeButton = document.getElementById('nav-home');
    const navSettingsButton = document.getElementById('nav-settings');
    const navSavedButton = document.getElementById('nav-saved');
    const navButtons = [navHomeButton, navSettingsButton, navSavedButton].filter(Boolean);

    const savedCountsList = document.getElementById('saved-counts-list');

    // Custom Modal Elements
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInputField = document.getElementById('modal-input-field');
    const modalConfirmButton = document.getElementById('modal-confirm-button');
    const modalCancelButton = document.getElementById('modal-cancel-button');

    // Audio Element
    const clickSound = document.getElementById('click-sound');

    // --- New DOM Elements for Drawer and Features (Added from previous step) ---
    const drawerMenuIcon = document.getElementById('drawer-menu-icon');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');

    const drawerStatsChartItem = document.getElementById('drawer-stats-chart');
    const drawerGoalTrackingItem = document.getElementById('drawer-goal-tracking');
    const gestureSupportToggle = document.getElementById('gesture-support-toggle');
    const drawerCloudBackupItem = document.getElementById('drawer-cloud-backup');

    // Stats Modal
    const statsModal = document.getElementById('stats-modal');
    const usageChartCanvas = document.getElementById('usage-chart');
    let usageChartInstance = null;

    // Goal Tracking Elements
    const goalProgressContainer = document.getElementById('goal-progress-container');
    const goalValueDisplay = document.getElementById('goal-value-display');
    const goalProgressBar = document.getElementById('goal-progress-bar');
    const goalPercentageDisplay = document.getElementById('goal-percentage-display');
    const goalModal = document.getElementById('goal-modal');
    const goalInput = document.getElementById('goal-input');
    const enableGoalToggle = document.getElementById('enable-goal-toggle');
    const setGoalButton = document.getElementById('set-goal-button');


    // --- State Variables ---
    let count = 0;
    let currentSettings = {
        countButtonColor: '#009688',
        resetButtonColor: '#FFEB3B',
        numberColor: '#ADD8E6',
        language: 'en',
        appContainerColor: '#121212',
        neonEffectEnabled: 'off',
        neonColor: '#00FFFF',
        backgroundTheme: 'default',
        soundEnabled: false,
        vibrationEnabled: false
    };
    let savedCounts = []; // For single counter history
    let savedCountIdCounter = 0;

    // New State Variables
    let currentGoal = {
        value: 0,
        enabled: false,
        reachedNotified: false
    };
    let gestureSupportEnabled = false;
    let countLog = []; // For stats: [{ timestamp: Date.now(), value: currentCountValue }]


    const banglaNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const languageStrings = { // Define your language strings here
        en: {
            drawerTitle: "App Features", drawerStats: "Daily/Weekly Stats", drawerGoal: "Goal Tracking", drawerGesture: "Gesture Support", drawerCloudBackup: "Cloud Backup (Google)",
            appTitle: "TALLY COUNTER", countBtnLabel: "COUNT", resetBtnLabel: "RESET", historyTitle: "Saved Counts",
            settingsPanelTitle: "Settings", settingCountBtnColor: "Count Button Color:", settingResetBtnColor: "Reset Button Color:", settingNumberColor: "Number Display Color:",
            settingAppContainerColor: "App Container Color:", settingNeonEffect: "Display Neon Effect:", optionOff: "Off", optionOn: "On",
            settingNeonColor: "Display Neon Color:", settingLanguage: "UI & Number Language:", settingBgTheme: "Main Background Theme:",
            themeDefault: "Default", themeDark: "Dark", themeWhite: "White", settingCountSound: "Count Sound:", settingCountVibration: "Count Vibration (Mobile):",
            applySettingsBtn: "Apply & Close", navHome: "Home", navSettings: "Settings", navSaved: "Saved",
            modalDefaultTitle: "Notification", modalConfirm: "Confirm", modalCancel: "Cancel",
            goalReachedTitle: "Goal Reached!", goalReachedMsg: "Congratulations! You've reached your goal of {goalValue}.",
            goalUpdatedTitle: "Goal Updated", goalUpdatedMsgEnabled: "Goal tracking is now enabled with target {goalValue}.",
            goalUpdatedMsgDisabled: "Goal tracking is now disabled.",
            invalidGoalTitle: "Invalid Goal", invalidGoalMsg: "Please enter a valid non-negative number for the goal.",
            gestureSupportTitle: "Gesture Support", gestureSupportMsgEnabled: "Gestures are now enabled.", gestureSupportMsgDisabled: "Gestures are now disabled.",
            cloudBackupTitle: "Cloud Backup", cloudBackupMsg: "Google Drive Sync feature is coming soon!",
            confirmResetTitle: "Reset Count", confirmResetMsg: "Are you sure you want to reset the current count? This will not save it.",
            confirmSaveTitle: "Save Count?", confirmSaveMsgSingleCounter: "Save current count of {countValue} to history and reset counter?",
            noSavedCounts: "No counts saved yet.", valueLabelShort: "Value:", onDateLabelShort: "on", editAction: "Edit", deleteAction: "Delete",
            countSessionLabel: "Count", errorTitle: "Error", invalidValueError: "Invalid value. Please enter a non-negative number.",
            editSavedNameTitle: "Edit Name", editSavedNameMsg: "Enter new name for \"{itemName}\":",
            editSavedValueTitle: "Edit Value", editSavedValueMsg: "Enter new value for \"{itemName}\" (current: {itemValue}):",
            deleteSavedConfirmTitle: "Delete Saved Count", deleteSavedConfirmMsg: "Are you sure you want to delete this saved count?",
            statsModalTitle: "Counter Statistics", statsChartLabel: "Daily Usage (Events)", statsInfo: "Basic daily usage based on count events.",
            goalModalTitle: "Set Counting Goal", goalInputLabel: "Enter your goal (e.g., 100):", enableGoalLabel: "Enable Goal Tracking:", setGoalBtn: "Set Goal",
            goalLabel: "Goal:",
            modalOkButton: "OK", modalInputPlaceholder: "Enter value"
        },
        bn: {
            drawerTitle: "অ্যাপ বৈশিষ্ট্য", drawerStats: "দৈনিক/সাপ্তাহিক পরিসংখ্যান", drawerGoal: "লক্ষ্য ট্র্যাকিং", drawerGesture: "অঙ্গভঙ্গি সমর্থন", drawerCloudBackup: "ক্লাউড ব্যাকআপ (গুগল)",
            appTitle: "ট্যালি কাউন্টার", countBtnLabel: "গণনা", resetBtnLabel: "রিসেট", historyTitle: "সংরক্ষিত গণনা",
            settingsPanelTitle: "সেটিংস", settingCountBtnColor: "কাউন্ট বাটন রঙ:", settingResetBtnColor: "রিসেট বাটন রঙ:", settingNumberColor: "সংখ্যা প্রদর্শন রঙ:",
            settingAppContainerColor: "অ্যাপ কন্টেইনার রঙ:", settingNeonEffect: "ডিসপ্লে নিয়ন ইফেক্ট:", optionOff: "বন্ধ", optionOn: "সক্রিয়",
            settingNeonColor: "ডিসপ্লে নিয়ন রঙ:", settingLanguage: "সংখ্যার ভাষা:", settingBgTheme: "মূল ব্যাকগ্রাউন্ড থিম:",
            themeDefault: "ডিফল্ট", themeDark: "ডার্ক", themeWhite: "হোয়াইট", settingCountSound: "কাউন্ট সাউন্ড:", settingCountVibration: "কাউন্ট ভাইব্রেশন (মোবাইল):",
            applySettingsBtn: "প্রয়োগ ও বন্ধ করুন", navHome: "হোম", navSettings: "সেটিংস", navSaved: "সংরক্ষিত",
            modalDefaultTitle: "বিজ্ঞপ্তি", modalConfirm: "নিশ্চিত করুন", modalCancel: "বাতিল করুন",
            goalReachedTitle: "লক্ষ্য অর্জিত!", goalReachedMsg: "অভিনন্দন! আপনি আপনার {goalValue} লক্ষ্য অর্জন করেছেন।",
            goalUpdatedTitle: "লক্ষ্য আপডেট করা হয়েছে", goalUpdatedMsgEnabled: "লক্ষ্য ট্র্যাকিং এখন {goalValue} লক্ষ্যের সাথে সক্রিয় করা হয়েছে।",
            goalUpdatedMsgDisabled: "লক্ষ্য ট্র্যাকিং এখন নিষ্ক্রিয় করা হয়েছে।",
            invalidGoalTitle: "অবৈধ লক্ষ্য", invalidGoalMsg: "অনুগ্রহ করে লক্ষ্যের জন্য একটি বৈধ অ-ঋণাত্মক সংখ্যা লিখুন।",
            gestureSupportTitle: "অঙ্গভঙ্গি সমর্থন", gestureSupportMsgEnabled: "অঙ্গভঙ্গি এখন সক্রিয়।", gestureSupportMsgDisabled: "অঙ্গভঙ্গি এখন নিষ্ক্রিয়।",
            cloudBackupTitle: "ক্লাউড ব্যাকআপ", cloudBackupMsg: "গুগল ড্রাইভ সিঙ্ক বৈশিষ্ট্য শীঘ্রই আসছে!",
            confirmResetTitle: "গণনা রিসেট", confirmResetMsg: "আপনি কি বর্তমান গণনা রিসেট করতে নিশ্চিত? এটি সংরক্ষণ করা হবে না।",
            confirmSaveTitle: "গণনা সংরক্ষণ করবেন?", confirmSaveMsgSingleCounter: "বর্তমান গণনা {countValue} ইতিহাসে সংরক্ষণ করে কাউন্টার রিসেট করবেন?",
            noSavedCounts: "এখনও কোনও গণনা সংরক্ষিত হয়নি।", valueLabelShort: "মান:", onDateLabelShort: "তারিখ", editAction: "সম্পাদনা", deleteAction: "মুছে ফেলুন",
            countSessionLabel: "গণনা", errorTitle: "ত্রুটি", invalidValueError: "অবৈধ মান। অনুগ্রহ করে একটি অ-ঋণাত্মক সংখ্যা লিখুন।",
            editSavedNameTitle: "নাম সম্পাদনা করুন", editSavedNameMsg: "\"{itemName}\" এর জন্য নতুন নাম লিখুন:",
            editSavedValueTitle: "মান সম্পাদনা করুন", editSavedValueMsg: "\"{itemName}\" এর জন্য নতুন মান লিখুন (বর্তমান: {itemValue}):",
            deleteSavedConfirmTitle: "সংরক্ষিত গণনা মুছুন", deleteSavedConfirmMsg: "আপনি কি এই সংরক্ষিত গণনাটি মুছতে চান?",
            statsModalTitle: "কাউন্টার পরিসংখ্যান", statsChartLabel: "দৈনিক ব্যবহার (ইভেন্ট)", statsInfo: "গণনা ইভেন্টের উপর ভিত্তি করে প্রাথমিক দৈনিক ব্যবহার।",
            goalModalTitle: "গণনার লক্ষ্য নির্ধারণ করুন", goalInputLabel: "আপনার লক্ষ্য লিখুন (যেমন, ১০০):", enableGoalLabel: "লক্ষ্য ট্র্যাকিং সক্রিয় করুন:", setGoalBtn: "লক্ষ্য নির্ধারণ করুন",
            goalLabel: "লক্ষ্য:",
            modalOkButton: "ঠিক আছে", modalInputPlaceholder: "মান লিখুন"
        }
    };

    function getLangString(key, params = {}) {
        const lang = currentSettings.language || 'en';
        const defaultParams = params.defaultValue ? { defaultValue: params.defaultValue } : {}; // Ensure defaultValue is not lost
        let str = (languageStrings[lang] && languageStrings[lang][key]) || 
                  (languageStrings['en'] && languageStrings['en'][key]) || 
                  params.defaultValue || // Use defaultValue from params if key not found
                  key; // Fallback to key itself
        for (const paramKey in params) {
            if (paramKey !== 'defaultValue') { // Don't replace the defaultValue placeholder itself
                str = str.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
            }
        }
        return str;
    }
    
    function updateUIText() {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            const text = getLangString(key); // getLangString now handles fallbacks better
            if (element.tagName === 'TITLE') {
                 document.title = text;
            } else if (element.placeholder) {
                 element.placeholder = text;
            } else if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                 element.value = text;
            } else if (element.tagName === 'BUTTON' || element.classList.contains('nav-label') || element.tagName === 'LABEL' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'SPAN') {
                element.textContent = text; // More robust for various text elements
            }
        });
        // Ensure modal titles and buttons are also updated if they are visible and have keys
        if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
            if (modalTitle && modalTitle.hasAttribute('data-lang-key-specific')) {
                 modalTitle.textContent = getLangString(modalTitle.getAttribute('data-lang-key-specific'));
            } else if (modalTitle) {
                modalTitle.textContent = getLangString('modalDefaultTitle');
            }
            if (modalConfirmButton) modalConfirmButton.textContent = getLangString(modalConfirmButton.classList.contains('action-button') ? 'modalConfirm' : 'modalOkButton');
            if (modalCancelButton && !modalCancelButton.classList.contains('hidden')) modalCancelButton.textContent = getLangString('modalCancel');
        }
    }

    // --- Custom Modal Logic ---
    let modalConfirmCallback = null;
    let modalCancelCallback = null;
    function showModal(title, message, type = 'alert', inputValue = '', inputPlaceholder = '') {
        if (!modalOverlay || !modalTitle || !modalMessage || !modalInputField || !modalConfirmButton || !modalCancelButton) return; // Safety check
        modalTitle.textContent = title; // Title is passed directly, not via key for this function
        modalMessage.innerHTML = message; // Message is passed directly
        modalInputField.classList.add('hidden');
        modalCancelButton.classList.add('hidden');
        modalConfirmButton.textContent = getLangString('modalOkButton');

        if (type === 'confirm' || type === 'prompt') {
            modalCancelButton.classList.remove('hidden');
            modalConfirmButton.textContent = getLangString('modalConfirm');
            modalCancelButton.textContent = getLangString('modalCancel');
        }
        if (type === 'prompt') {
            modalInputField.classList.remove('hidden');
            modalInputField.value = inputValue;
            modalInputField.placeholder = inputPlaceholder;
        }
        modalOverlay.classList.remove('hidden');
        if (type === 'prompt') modalInputField.focus();
        else modalConfirmButton.focus();
    }
    if(modalConfirmButton) modalConfirmButton.addEventListener('click', () => {
        if (modalConfirmCallback) {
            const inputValue = modalInputField.classList.contains('hidden') ? true : modalInputField.value;
            modalConfirmCallback(inputValue);
        }
        closeModal();
    });
    if(modalCancelButton) modalCancelButton.addEventListener('click', () => {
        if (modalCancelCallback) modalCancelCallback();
        closeModal();
    });
    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.add('hidden');
        modalConfirmCallback = null;
        modalCancelCallback = null;
        if (modalInputField) modalInputField.value = '';
    }
    function customAlert(titleKey, messageKey, messageParams = {}) { // Now uses keys
        return new Promise((resolve) => {
            modalConfirmCallback = resolve;
            const title = getLangString(titleKey);
            const message = getLangString(messageKey, messageParams);
            showModal(title, message, 'alert');
            if(modalTitle) modalTitle.setAttribute('data-lang-key-specific', titleKey);
        });
    }
    function customConfirm(titleKey, messageKey, messageParams = {}) { // Now uses keys
        return new Promise((resolve) => {
            modalConfirmCallback = () => resolve(true);
            modalCancelCallback = () => resolve(false);
            const title = getLangString(titleKey);
            const message = getLangString(messageKey, messageParams);
            showModal(title, message, 'confirm');
            if(modalTitle) modalTitle.setAttribute('data-lang-key-specific', titleKey);
        });
    }
    function customPrompt(titleKey, messageKey, messageParams = {}, defaultValue = '', placeholderKey = 'modalInputPlaceholder') { // Now uses keys
        return new Promise((resolve) => {
            modalConfirmCallback = (value) => resolve(value);
            modalCancelCallback = () => resolve(null);
            const title = getLangString(titleKey);
            const message = getLangString(messageKey, messageParams);
            const placeholder = getLangString(placeholderKey);
            showModal(title, message, 'prompt', defaultValue, placeholder);
            if(modalTitle) modalTitle.setAttribute('data-lang-key-specific', titleKey);
        });
    }
   if(modalOverlay) modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            if (modalCancelButton && (modalCancelButton.classList.contains('hidden') || (!modalCancelButton.classList.contains('hidden') && modalCancelCallback))) {
                if (modalCancelCallback) modalCancelCallback();
                closeModal();
            }
        }
    });

    // --- Drawer Logic ---
    function openDrawer() { if (sideDrawer && drawerOverlay) { sideDrawer.classList.add('open'); drawerOverlay.classList.remove('hidden'); } }
    function closeDrawer() { if (sideDrawer && drawerOverlay) { sideDrawer.classList.remove('open'); drawerOverlay.classList.add('hidden'); } }
    if (drawerMenuIcon) drawerMenuIcon.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // --- Custom Page Modals (Stats, Goal) Logic ---
    function showCustomPageModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.classList.remove('hidden'); closeDrawer(); }
    function hideCustomPageModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.classList.add('hidden'); }
    document.querySelectorAll('.close-custom-page-modal-btn').forEach(btn => { btn.addEventListener('click', () => { hideCustomPageModal(btn.dataset.target); }); });

    // --- Utility Functions ---
    function convertToBangla(number) { return String(number).split('').map(digit => banglaNumerals[digit] || digit).join(''); }
    function updateDisplay() {
        if (!countDisplay) return;
        countDisplay.textContent = currentSettings.language === 'bn' ? convertToBangla(count) : count;
    }
    function showPage(pageId) {
        pages.forEach(page => { if (page) page.classList.toggle('active-page', page.id === pageId); });
        if (settingsPanel && pageId !== settingsPanel.id) settingsPanel.classList.add('hidden');
    }
    function updateActiveNavButton(activeButton) {
        navButtons.forEach(button => { if (button) button.classList.remove('active-nav'); });
        if (activeButton) activeButton.classList.add('active-nav');
    }

    // --- Sound and Vibration ---
    function playClickSound() { if (currentSettings.soundEnabled && clickSound) { clickSound.currentTime = 0; clickSound.play().catch(e => console.warn("Sound fail:", e)); } }
    function vibrateDevice() { if (currentSettings.vibrationEnabled && navigator.vibrate) navigator.vibrate(50); }

    // --- Stats Chart Logic ---
    function logCountEvent() { countLog.push({ timestamp: Date.now(), value: count }); localStorage.setItem('tallyCountLog', JSON.stringify(countLog)); }
    function loadCountLog() { const storedLog = localStorage.getItem('tallyCountLog'); if (storedLog) countLog = JSON.parse(storedLog); }
    function prepareChartData() {
        const dailyUsage = {};
        countLog.forEach(logEntry => {
            const date = new Date(logEntry.timestamp).toLocaleDateString(currentSettings.language === 'bn' ? 'bn-BD' : 'en-CA');
            dailyUsage[date] = (dailyUsage[date] || 0) + 1;
        });
        const labels = Object.keys(dailyUsage).sort((a,b) => new Date(a) - new Date(b)); // Sort dates chronologically
        const data = labels.map(label => dailyUsage[label]);
        return { labels, data };
    }
    function renderStatsChart() {
        if (!usageChartCanvas) return;
        const chartData = prepareChartData(); const ctx = usageChartCanvas.getContext('2d');
        if (usageChartInstance) usageChartInstance.destroy();
        usageChartInstance = new Chart(ctx, {
            type: 'bar',
            data: { labels: chartData.labels, datasets: [{ label: getLangString('statsChartLabel'), data: chartData.data, backgroundColor: 'rgba(0, 174, 239, 0.6)', borderColor: 'rgba(0, 174, 239, 1)', borderWidth: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }
    if (drawerStatsChartItem) drawerStatsChartItem.addEventListener('click', () => { renderStatsChart(); showCustomPageModal('stats-modal'); });

    // --- Goal Tracking Logic ---
    function updateGoalProgress() {
        if (!currentGoal.enabled || !goalProgressContainer || !goalValueDisplay || !goalProgressBar || !goalPercentageDisplay) return;
        goalProgressContainer.classList.remove('hidden');
        goalValueDisplay.textContent = currentSettings.language === 'bn' ? convertToBangla(currentGoal.value) : currentGoal.value;
        let progressPercent = currentGoal.value > 0 ? Math.min((count / currentGoal.value) * 100, 100) : 0;
        goalProgressBar.style.width = `${progressPercent}%`;
        goalPercentageDisplay.textContent = `${Math.floor(progressPercent)}%`;
        if (count >= currentGoal.value && currentGoal.value > 0 && !currentGoal.reachedNotified) {
            customAlert('goalReachedTitle', 'goalReachedMsg', { goalValue: currentGoal.value });
            currentGoal.reachedNotified = true; saveGoalSettings();
        }
    }
    function saveGoalSettings() { localStorage.setItem('tallyGoalSettings', JSON.stringify(currentGoal)); }
    function loadGoalSettings() {
        const storedGoal = localStorage.getItem('tallyGoalSettings'); if (storedGoal) currentGoal = JSON.parse(storedGoal);
        if(goalInput) goalInput.value = currentGoal.value > 0 ? currentGoal.value : '';
        if(enableGoalToggle) enableGoalToggle.checked = currentGoal.enabled;
        if(!currentGoal.enabled && goalProgressContainer) goalProgressContainer.classList.add('hidden'); // Hide if not enabled
        else updateGoalProgress();
    }
    if (drawerGoalTrackingItem) drawerGoalTrackingItem.addEventListener('click', () => {
        if(goalInput) goalInput.value = currentGoal.value > 0 ? currentGoal.value : '';
        if(enableGoalToggle) enableGoalToggle.checked = currentGoal.enabled;
        showCustomPageModal('goal-modal');
    });
    if (setGoalButton) setGoalButton.addEventListener('click', () => {
        const newGoalValue = goalInput ? parseInt(goalInput.value) : 0;
        if (!isNaN(newGoalValue) && newGoalValue >= 0) {
            currentGoal.value = newGoalValue; currentGoal.enabled = enableGoalToggle ? enableGoalToggle.checked : false;
            currentGoal.reachedNotified = false; saveGoalSettings(); updateGoalProgress(); hideCustomPageModal('goal-modal');
            customAlert('goalUpdatedTitle', currentGoal.enabled ? 'goalUpdatedMsgEnabled' : 'goalUpdatedMsgDisabled', { goalValue: currentGoal.value });
        } else { customAlert('invalidGoalTitle', 'invalidGoalMsg'); }
    });
    if (enableGoalToggle) enableGoalToggle.addEventListener('change', () => {
        currentGoal.enabled = enableGoalToggle.checked;
        if (!currentGoal.enabled && goalProgressContainer) goalProgressContainer.classList.add('hidden');
        else if (currentGoal.enabled && currentGoal.value <= 0) showCustomPageModal('goal-modal'); // Prompt to set goal if enabling with no goal
        currentGoal.reachedNotified = false; saveGoalSettings(); updateGoalProgress();
    });

    // --- Gesture Support Logic ---
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
    function handleGesture() {
        if (!gestureSupportEnabled) return;
        const dY = touchEndY - touchStartY; const absDY = Math.abs(dY);
        const dX = touchEndX - touchStartX; const absDX = Math.abs(dX);
        if (absDY > absDX && absDY > 30) { // Increased swipe sensitivity
            if (dY < 0) { if (countButton) countButton.click(); }
            // else { console.log("Swipe Down (no action defined)"); }
        }
    }
    function saveGestureSettings() { localStorage.setItem('tallyGestureEnabled', gestureSupportEnabled.toString()); }
    function loadGestureSettings() {
        const storedGesture = localStorage.getItem('tallyGestureEnabled'); gestureSupportEnabled = storedGesture === 'true';
        if (gestureSupportToggle) gestureSupportToggle.checked = gestureSupportEnabled;
    }
    if (gestureSupportToggle) gestureSupportToggle.addEventListener('change', (e) => {
        gestureSupportEnabled = e.target.checked; saveGestureSettings();
        customAlert('gestureSupportTitle', gestureSupportEnabled ? 'gestureSupportMsgEnabled' : 'gestureSupportMsgDisabled');
    });
    const gestureZone = document.getElementById('app-container'); // More specific zone: app-container
    if (gestureZone) {
        gestureZone.addEventListener('touchstart', (e) => {
            if (!gestureSupportEnabled || e.target.closest('button, input, select')) return; // Ignore on interactive elements within app-container
            touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        gestureZone.addEventListener('touchend', (e) => {
            if (!gestureSupportEnabled || touchStartX === 0 || e.target.closest('button, input, select')) { touchStartX = 0; touchStartY = 0; return; }
            touchEndX = e.changedTouches[0].screenX; touchEndY = e.changedTouches[0].screenY;
            handleGesture(); touchStartX = 0; touchStartY = 0;
        }, { passive: true });
    }

    // --- Cloud Backup Logic (Placeholder) ---
    if (drawerCloudBackupItem) drawerCloudBackupItem.addEventListener('click', () => { closeDrawer(); customAlert('cloudBackupTitle', 'cloudBackupMsg'); });

    // --- Settings Logic (Core) ---
    function applyCurrentSettingsToUI() {
        document.documentElement.lang = currentSettings.language;
        if(countButton && currentSettings.countButtonColor) countButton.style.background = currentSettings.countButtonColor.startsWith('#') ? currentSettings.countButtonColor : `linear-gradient(145deg, ${currentSettings.countButtonColor}, ${shadeColor(currentSettings.countButtonColor, -10)})`;
        if(resetButton && currentSettings.resetButtonColor) resetButton.style.background = currentSettings.resetButtonColor.startsWith('#') ? currentSettings.resetButtonColor : `linear-gradient(145deg, ${currentSettings.resetButtonColor}, ${shadeColor(currentSettings.resetButtonColor, -10)})`;
        if(countDisplay && currentSettings.numberColor) countDisplay.style.color = currentSettings.numberColor;
        if(appContainer && currentSettings.appContainerColor) appContainer.style.backgroundColor = currentSettings.appContainerColor;
        if (displayArea) {
            displayArea.style.boxShadow = currentSettings.neonEffectEnabled === 'on' ? `0 0 5px ${currentSettings.neonColor}, 0 0 10px ${currentSettings.neonColor}, 0 0 15px ${currentSettings.neonColor}, 0 0 20px ${currentSettings.neonColor}` : '0 2px 5px rgba(0,0,0,0.2) inset';
        }
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-white');
        let bodyBg = '', bodyColor = '', historyColor = '';
        switch (currentSettings.backgroundTheme) {
            case 'dark': bodyBg = '#1a1a1a'; bodyColor = 'white'; historyColor = 'white'; document.body.classList.add('theme-dark'); break;
            case 'white': bodyBg = '#f0f0f0'; bodyColor = '#333333'; historyColor = '#333333'; document.body.classList.add('theme-white'); break;
            default: bodyBg = 'linear-gradient(135deg, #4A00E0, #8E2DE2, #FF0080)'; bodyColor = 'white'; historyColor = '#e0e0e0'; document.body.classList.add('theme-default'); break;
        }
        document.body.style.background = bodyBg; document.body.style.color = bodyColor; if(historyPage) historyPage.style.color = historyColor;
        updateDisplay(); updateGoalProgress(); updateUIText();
    }
    function shadeColor(color, percent) { /* ... existing shadeColor logic, unchanged ... */
        if (!color || !color.startsWith('#') || color.length !== 7) return color; // Basic validation
        let R = parseInt(color.substring(1,3),16); let G = parseInt(color.substring(3,5),16); let B = parseInt(color.substring(5,7),16);
        R = parseInt(R * (100 + percent) / 100); G = parseInt(G * (100 + percent) / 100); B = parseInt(B * (100 + percent) / 100);
        R = Math.max(0, Math.min(255, R)); G = Math.max(0, Math.min(255, G)); B = Math.max(0, Math.min(255, B));
        const RR = R.toString(16).padStart(2, '0'); const GG = G.toString(16).padStart(2, '0'); const BB = B.toString(16).padStart(2, '0');
        return "#"+RR+GG+BB;
    }
    function saveAppSettings() { localStorage.setItem('tallyCounterSettings', JSON.stringify(currentSettings)); }
    function loadAppSettings() {
        const saved = localStorage.getItem('tallyCounterSettings'); if (saved) currentSettings = { ...currentSettings, ...JSON.parse(saved) };
        // Ensure all keys have defaults after loading
        const defaults = { countButtonColor: '#009688', resetButtonColor: '#FFEB3B', numberColor: '#ADD8E6', language: 'en', appContainerColor: '#121212', neonEffectEnabled: 'off', neonColor: '#00FFFF', backgroundTheme: 'default', soundEnabled: false, vibrationEnabled: false };
        for (const key in defaults) { if (currentSettings[key] === undefined) currentSettings[key] = defaults[key];}

        if(countButtonColorInput) countButtonColorInput.value = currentSettings.countButtonColor;
        if(resetButtonColorInput) resetButtonColorInput.value = currentSettings.resetButtonColor;
        if(numberColorInput) numberColorInput.value = currentSettings.numberColor;
        if(languageSelect) languageSelect.value = currentSettings.language;
        if(appContainerColorInput) appContainerColorInput.value = currentSettings.appContainerColor;
        if(neonEffectToggleSelect) neonEffectToggleSelect.value = currentSettings.neonEffectEnabled;
        if(neonColorInput) neonColorInput.value = currentSettings.neonColor;
        if(backgroundThemeSelect) backgroundThemeSelect.value = currentSettings.backgroundTheme;
        if(soundToggle) soundToggle.checked = currentSettings.soundEnabled;
        if(vibrationToggle) vibrationToggle.checked = currentSettings.vibrationEnabled;
        applyCurrentSettingsToUI();
    }

    // --- Original History Logic ---
    function renderHistoryList() { /* ... existing, ensure uses getLangString for labels ... */
        if (!savedCountsList) return; savedCountsList.innerHTML = '';
        if (savedCounts.length === 0) { savedCountsList.innerHTML = `<p style="text-align:center; color: #888;">${getLangString('noSavedCounts')}</p>`; return; }
        savedCounts.sort((a, b) => (b.savedTimestamp || 0) - (a.savedTimestamp || 0) );
        savedCounts.forEach(item => {
            const listItem = document.createElement('div'); listItem.classList.add('history-item'); listItem.dataset.id = item.id;
            const detailsDiv = document.createElement('div'); detailsDiv.classList.add('history-item-details');
            const nameSpan = document.createElement('span'); nameSpan.classList.add('history-item-name'); nameSpan.textContent = item.name;
            const valueDateSpan = document.createElement('span'); valueDateSpan.classList.add('history-item-value-date');
            const displayValue = currentSettings.language === 'bn' ? convertToBangla(item.value) : item.value;
            valueDateSpan.textContent = `${getLangString('valueLabelShort')} ${displayValue} (${getLangString('onDateLabelShort')} ${item.date})`;
            detailsDiv.appendChild(nameSpan); detailsDiv.appendChild(valueDateSpan);
            const actionsDiv = document.createElement('div'); actionsDiv.classList.add('history-item-actions');
            const editButton = document.createElement('button'); editButton.classList.add('edit-btn'); editButton.innerHTML = '✏️'; editButton.title = getLangString('editAction');
            editButton.addEventListener('click', () => editSavedCount(item.id));
            const deleteButton = document.createElement('button'); deleteButton.classList.add('delete-btn'); deleteButton.innerHTML = '🗑️'; deleteButton.title = getLangString('deleteAction');
            deleteButton.addEventListener('click', () => deleteSavedCount(item.id));
            actionsDiv.appendChild(editButton); actionsDiv.appendChild(deleteButton);
            listItem.appendChild(detailsDiv); listItem.appendChild(actionsDiv);
            savedCountsList.appendChild(listItem);
        });
    }
    function saveCountsToStorage() { /* ... existing ... */ localStorage.setItem('tallySavedCounts', JSON.stringify(savedCounts)); localStorage.setItem('tallySavedCountIdCounter', savedCountIdCounter.toString());}
    function loadCountsFromStorage() { /* ... existing ... */
        const storedCounts = localStorage.getItem('tallySavedCounts'); if (storedCounts) { savedCounts = JSON.parse(storedCounts); savedCounts.forEach(item => { if (!item.savedTimestamp) item.savedTimestamp = item.id; });}
        const storedCounter = localStorage.getItem('tallySavedCountIdCounter'); if (storedCounter) savedCountIdCounter = parseInt(storedCounter, 10);
        renderHistoryList();
    }
    async function addSavedCount(valueToSave) { /* ... existing, ensure uses getLangString for modal ... */
        if (valueToSave <= 0 && valueToSave !==0) return; // Allow saving 0
        savedCountIdCounter++; const today = new Date(); const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const newCountItem = { id: Date.now(), savedTimestamp: Date.now(), name: `${getLangString('countSessionLabel')} ${savedCountIdCounter}`, value: valueToSave, date: dateString };
        savedCounts.push(newCountItem); saveCountsToStorage(); renderHistoryList();
        // Do not reset main count here, as 'navSavedButton' handles it.
        await customAlert('alertSavedSuccess', 'alertSavedSuccessMsgSingle', {value: valueToSave}); // New lang key
    }
    async function editSavedCount(id) { /* ... existing, ensure uses getLangString for modal ... */
        const item = savedCounts.find(s => s.id === id); if (!item) return;
        const newName = await customPrompt('editSavedNameTitle', 'editSavedNameMsg', {itemName: item.name}, item.name); if (newName === null) return;
        const newValueStr = await customPrompt('editSavedValueTitle', 'editSavedValueMsg', {itemName: newName || item.name, itemValue: item.value}, item.value.toString()); if (newValueStr === null) return;
        const newValue = parseInt(newValueStr, 10);
        if (newName.trim() !== "") item.name = newName.trim();
        if (!isNaN(newValue) && newValue >= 0) item.value = newValue; else if (newValueStr.trim() !== "") { await customAlert('errorTitle', 'invalidValueError'); return; }
        saveCountsToStorage(); renderHistoryList();
    }
    async function deleteSavedCount(id) { /* ... existing, ensure uses getLangString for modal ... */
        const confirmed = await customConfirm('deleteSavedConfirmTitle', 'deleteSavedConfirmMsg');
        if (confirmed) { savedCounts = savedCounts.filter(s => s.id !== id); saveCountsToStorage(); renderHistoryList(); }
    }

    // --- Event Listeners (Core, Settings, Nav) ---
    if (countButton) countButton.addEventListener('click', () => { count++; updateDisplay(); playClickSound(); vibrateDevice(); logCountEvent(); updateGoalProgress(); });
    if (resetButton) resetButton.addEventListener('click', async () => {
        const confirmed = await customConfirm('confirmResetTitle', 'confirmResetMsg');
        if (confirmed) { count = 0; updateDisplay(); logCountEvent(); updateGoalProgress(); }
    });
    if (applySettingsButton) applySettingsButton.addEventListener('click', () => {
        if(countButtonColorInput) currentSettings.countButtonColor = countButtonColorInput.value;
        if(resetButtonColorInput) currentSettings.resetButtonColor = resetButtonColorInput.value;
        if(numberColorInput) currentSettings.numberColor = numberColorInput.value;
        if(languageSelect) currentSettings.language = languageSelect.value;
        if(appContainerColorInput) currentSettings.appContainerColor = appContainerColorInput.value;
        if(neonEffectToggleSelect) currentSettings.neonEffectEnabled = neonEffectToggleSelect.value;
        if(neonColorInput) currentSettings.neonColor = neonColorInput.value;
        if(backgroundThemeSelect) currentSettings.backgroundTheme = backgroundThemeSelect.value;
        if(soundToggle) currentSettings.soundEnabled = soundToggle.checked;
        if(vibrationToggle) currentSettings.vibrationEnabled = vibrationToggle.checked;
        applyCurrentSettingsToUI(); saveAppSettings(); if(settingsPanel) settingsPanel.classList.add('hidden');
    });
    if (navHomeButton) navHomeButton.addEventListener('click', () => { if (counterPage) showPage(counterPage.id); updateActiveNavButton(navHomeButton); });
    if (navSettingsButton) navSettingsButton.addEventListener('click', () => { if(settingsPanel) settingsPanel.classList.toggle('hidden'); });
    if (navSavedButton) navSavedButton.addEventListener('click', async () => {
        if (counterPage && counterPage.classList.contains('active-page')) { // Only prompt to save if on counter page
            const currentCountForSave = count; // Capture current count before potential reset
            if (currentCountForSave > 0 || currentCountForSave === 0) { // Allow saving 0
                 const confirmed = await customConfirm('confirmSaveTitle', 'confirmSaveMsgSingleCounter', { countValue: currentCountForSave });
                 if (confirmed) {
                     await addSavedCount(currentCountForSave); // Save the captured count
                     count = 0; // Reset the main counter
                     updateDisplay();
                     updateGoalProgress(); // Update goal as main count is reset
                     logCountEvent(); // Log this reset action
                 }
            }
        }
        if (historyPage) showPage(historyPage.id); // Show history page regardless of save action
        updateActiveNavButton(navSavedButton);
        renderHistoryList();
    });

    // --- Initialization ---
    loadAppSettings(); loadCountsFromStorage(); loadCountLog(); loadGoalSettings(); loadGestureSettings();
    if (counterPage) showPage(counterPage.id);
    updateActiveNavButton(navHomeButton);
    // updateUIText(); // Called by applyCurrentSettingsToUI -> loadAppSettings
    updateGoalProgress(); // Initial call
});