// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

const state = {
    // Feature toggles
    characterSanitizerEnabled: true,
    autoPhrasesEnabled: true,
    statsVisible: true,
    detectionEnabled: true,
    emojiRemoverEnabled: false,

    // Settings modes
    wordCountMode: 'strict',           // 'strict' or 'mild'
    detectionSensitivity: 'strict',
    activeSettingsTab: 'characters',   // Current tab in settings
    theme: 'dark',

    // AI format state
    aiFormatDetected: false,
    aiFormatAcked: false,

    // Data maps
    phraseMap: {
        'utilize': { replacement: 'use', enabled: true },
        'leverage': { replacement: 'use', enabled: true },
        'delve into': { replacement: 'explore', enabled: true },
        'due to the fact that': { replacement: 'because', enabled: true },
        'it is important to note that': { replacement: '', enabled: true }
    },

    charMap: {
        '—': { replacement: '-', enabled: true },
        '–': { replacement: '-', enabled: true },
        '…': { replacement: '...', enabled: true },
        '“': { replacement: '"', enabled: true },
        '”': { replacement: '"', enabled: true },
        '‘': { replacement: '\'', enabled: true },
        '’': { replacement: '\'', enabled: true },
        '\u00A0': { replacement: ' ', enabled: true }
    },

    detectionPatterns: [
        { id: 'certainly', type: 'regex', source: '^Certainly[,!]?', enabled: true, sensitivity: 'strict', position: 'start' },
        { id: 'tight-plan', type: 'regex', source: "^Here(?:’s|'s) a tight \\d+-task plan\\b", enabled: true, sensitivity: 'mild', position: 'start' },
        { id: 'in-conclusion', type: 'regex', source: 'In conclusion[:,]?.*$', enabled: true, sensitivity: 'mild', position: 'end' },
        { id: 'hope-helps', type: 'regex', source: 'I hope this helps[.!]?$', enabled: true, sensitivity: 'strict', position: 'end' }
    ],

    mildIgnoreWords: ['a', 'an', 'the', 'of', 'in', 'on', 'at', 'if', 'as', 'to', 'and', 'or'],

    currentText: ''
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM = {
    root: document.getElementById('app-root'),
    header: document.querySelector('.header'),
    inputEl: document.getElementById('input-text'),
    outputEl: document.getElementById('output-text'),
    inputStats: document.getElementById('input-stats'),
    outputStats: document.getElementById('output-stats'),
    settingsBtn: document.getElementById('settings-btn'),
    keyboardGuideBtn: document.getElementById('keyboard-guide-btn'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    emojiToggleBtn: document.getElementById('emoji-toggle-btn'),
    copyOutputBtn: document.getElementById('copy-output-btn'),
    settingsOverlay: document.getElementById('settings-overlay'),
    settingsModal: document.querySelector('.settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings'),
    keyboardDialog: document.getElementById('keyboard-dialog'),
    closeKeyboardBtn: document.getElementById('close-keyboard'),
    shortcutsTbody: document.getElementById('shortcuts-tbody'),
    phraseDialog: document.getElementById('phrase-dialog'),
    closePhraseDialogBtn: document.getElementById('close-phrase-dialog'),
    cancelPhraseDialogBtn: document.getElementById('cancel-phrase-dialog'),
    savePhraseDialogBtn: document.getElementById('save-phrase-dialog'),
    phraseInput: document.getElementById('phrase-input'),
    phraseReplacementInput: document.getElementById('phrase-replacement-input'),
    ruleDialog: document.getElementById('rule-dialog'),
    closeRuleDialogBtn: document.getElementById('close-rule-dialog'),
    cancelRuleDialogBtn: document.getElementById('cancel-rule-dialog'),
    saveRuleDialogBtn: document.getElementById('save-rule-dialog'),
    rulePatternInput: document.getElementById('rule-pattern-input'),
    rulePositionInput: document.getElementById('rule-position-input'),
    addPhraseBtn: document.getElementById('add-phrase-btn'),
    addRuleBtn: document.getElementById('add-rule-btn'),
    toolbar: document.querySelector('.toolbar'),
    charFixerToggle: document.getElementById('char-fixer-toggle'),
    detectionToggle: document.getElementById('detection-toggle'),
    emojiRemoverToggle: document.getElementById('emoji-remover-toggle'),
    charMappingsContainer: document.getElementById('char-mappings'),
    phraseMappingsContainer: document.getElementById('phrase-mappings'),
    detectionPatternsContainer: document.getElementById('detection-patterns'),
    mildTags: document.getElementById('mild-tags'),
    tagList: document.querySelector('#mild-tags .tag-list'),
    tagInput: document.getElementById('tag-input')
};

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const STORAGE_KEY = 'fuckEmDashPrefs';
let saveTimer = null;

function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 200);
}

function saveState() {
    const payload = {
        characterSanitizerEnabled: state.characterSanitizerEnabled,
        autoPhrasesEnabled: state.autoPhrasesEnabled,
        statsVisible: state.statsVisible,
        detectionEnabled: state.detectionEnabled,
        emojiRemoverEnabled: state.emojiRemoverEnabled,
        wordCountMode: state.wordCountMode,
        phraseMap: state.phraseMap,
        charMap: state.charMap,
        detectionPatterns: state.detectionPatterns,
        mildIgnoreWords: state.mildIgnoreWords,
        theme: state.theme
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // Ignore storage failures
    }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        state.characterSanitizerEnabled = parsed.characterSanitizerEnabled ?? state.characterSanitizerEnabled;
        state.autoPhrasesEnabled = parsed.autoPhrasesEnabled ?? state.autoPhrasesEnabled;
        state.statsVisible = parsed.statsVisible ?? state.statsVisible;
        state.detectionEnabled = parsed.detectionEnabled ?? state.detectionEnabled;
        state.emojiRemoverEnabled = parsed.emojiRemoverEnabled ?? state.emojiRemoverEnabled;
        state.wordCountMode = parsed.wordCountMode || state.wordCountMode;
        state.phraseMap = parsed.phraseMap || state.phraseMap;
        state.charMap = parsed.charMap || state.charMap;
        state.detectionPatterns = (parsed.detectionPatterns || state.detectionPatterns).map((pattern, index) => ({
            id: pattern.id || `rule-${Date.now()}-${index}`,
            type: pattern.type || 'regex',
            source: pattern.source,
            enabled: pattern.enabled !== false,
            position: pattern.position || 'any'
        }));
        state.mildIgnoreWords = parsed.mildIgnoreWords || state.mildIgnoreWords;
        state.theme = parsed.theme || state.theme;
    } catch {
        // Ignore corrupted storage
    }
}

// ============================================================================
// WORD COUNT UTILITIES
// ============================================================================

function computeWordCount(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;

    const tokens = trimmed.split(/\s+/);

    if (state.wordCountMode === 'strict') {
        return tokens.length;
    }

    // Mild mode: ignore small function words
    const ignoreSet = new Set(state.mildIgnoreWords.map(word => word.toLowerCase()));
    return tokens.filter(tok => !ignoreSet.has(tok.toLowerCase())).length;
}

function computeStats(text) {
    const chars = text.length;
    const lines = text ? text.split('\n').length : 0;
    const words = computeWordCount(text);
    return { words, lines, chars };
}

function renderStats(container, stats) {
    if (!state.statsVisible) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    const wordEl = container.querySelector('.stat:nth-child(1) .stat-value');
    const lineEl = container.querySelector('.stat:nth-child(2) .stat-value');
    const charEl = container.querySelector('.stat:nth-child(3) .stat-value');

    if (wordEl) wordEl.textContent = stats.words;
    if (lineEl) lineEl.textContent = stats.lines;
    if (charEl) charEl.textContent = stats.chars;
}

// ============================================================================
// CHARACTER SANITIZER
// ============================================================================

let charPattern = null;

function buildCharPattern() {
    const keys = Object.keys(state.charMap)
        .filter(k => state.charMap[k].enabled);

    if (!keys.length) {
        charPattern = null;
        return;
    }

    const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    charPattern = new RegExp('[' + escaped.join('') + ']', 'g');
}

function sanitizeCharacters(text) {
    if (!state.characterSanitizerEnabled || !charPattern) return text;

    return text.replace(charPattern, ch => {
        const cfg = state.charMap[ch];
        return cfg && cfg.enabled ? cfg.replacement : ch;
    });
}

function parseCharInput(value) {
    const trimmed = value.trim();
    if (trimmed.startsWith('\\u') && trimmed.length === 6) {
        const code = parseInt(trimmed.slice(2), 16);
        if (!Number.isNaN(code)) {
            return String.fromCharCode(code);
        }
    }
    return trimmed;
}
// ============================================================================
// EMOJI REMOVER
// ============================================================================

function removeEmojis(text) {
    if (!state.emojiRemoverEnabled) return text;

    // Unicode ranges for emojis
    const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{2B55}]|[\u{200D}]|[\u{FE0F}]/gu;
    
    return text.replace(emojiPattern, '').replace(/\s+/g, ' ').trim();
}


function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================================================
// PHRASE REPLACER
// ============================================================================

let phraseRegex = null;

function buildPhraseRegex() {
    const keys = Object.keys(state.phraseMap)
        .filter(k => state.phraseMap[k].enabled && k.trim().length);

    if (!keys.length) {
        phraseRegex = null;
        return;
    }

    const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = '\\b(' + escaped.join('|') + ')\\b';
    phraseRegex = new RegExp(pattern, 'gi');
}

function applyPhraseReplacements(text) {
    if (!phraseRegex) return text;

    return text.replace(phraseRegex, match => {
        const key = match.toLowerCase();
        const cfg = state.phraseMap[key];
        return cfg && cfg.enabled ? cfg.replacement : match;
    });
}

// ============================================================================
// AI DETECTION
// ============================================================================

let compiledDetectionPatterns = [];

function buildDetectionPatterns() {
    compiledDetectionPatterns = [];
    state.detectionPatterns
        .filter(p => p.enabled)
        .forEach(p => {
            try {
                compiledDetectionPatterns.push({
                    id: p.id,
                    sensitivity: p.sensitivity,
                    position: p.position || 'any',
                    re: new RegExp(p.source, 'im')
                });
            } catch {
                // Skip invalid regex patterns
            }
        });
}

function detectAIFormat(text) {
    if (!state.detectionEnabled) return false;
    const startText = text.trimStart();
    const endText = text.trimEnd();

    return compiledDetectionPatterns.some(p => {
        if (p.position === 'start') {
            const match = startText.match(p.re);
            return !!match && match.index === 0;
        }
        if (p.position === 'end') {
            const match = endText.match(p.re);
            return !!match && match.index + match[0].length === endText.length;
        }
        return p.re.test(text);
    });
}

function runDetection(text) {
    const aiFormat = detectAIFormat(text);
    state.aiFormatDetected = aiFormat;

    if (aiFormat && !state.aiFormatAcked) {
        DOM.root.setAttribute('data-ai-format', 'true');
    } else if (!aiFormat || state.aiFormatAcked) {
        DOM.root.removeAttribute('data-ai-format');
    }
}

// ============================================================================
// PROCESSING PIPELINE
// ============================================================================

function processPipeline(raw) {
    let text = raw;

    // Step 0: Emoji Remover
    text = removeEmojis(text);

    // Step 1: Character Fixer
    text = sanitizeCharacters(text);

    // Step 2: Word Fixer (if auto mode)
    if (state.autoPhrasesEnabled) {
        text = applyPhraseReplacements(text);
    }

    state.currentText = text;
    return text;
}

function renderOutputAndStats() {
    const processed = processPipeline(DOM.inputEl.value);
    DOM.outputEl.value = processed;

    // Compute and render stats
    const inputStats = computeStats(DOM.inputEl.value);
    const outputStats = computeStats(processed);

    renderStats(DOM.inputStats, inputStats);
    renderStats(DOM.outputStats, outputStats);

    // Run AI detection
    runDetection(processed);
}

// ============================================================================
// INPUT HANDLER
// ============================================================================

function onInputChange() {
    renderOutputAndStats();
}

DOM.inputEl.addEventListener('input', onInputChange);

// ============================================================================
// TOOLBAR INTERACTIONS
// ============================================================================

function updateToolbarPills() {
    const pills = DOM.toolbar.querySelectorAll('.toolbar-pill');

    pills.forEach(pill => {
        const feature = pill.dataset.feature;
        const statusEl = pill.querySelector('.pill-status');

        switch (feature) {
            case 'characters':
                pill.classList.toggle('active', state.characterSanitizerEnabled);
                statusEl.textContent = state.characterSanitizerEnabled ? 'ON' : 'OFF';
                break;
            case 'phrases':
                pill.classList.toggle('active', state.autoPhrasesEnabled);
                statusEl.textContent = state.autoPhrasesEnabled ? 'Auto' : 'Manual';
                break;
            case 'stats':
                pill.classList.toggle('active', state.statsVisible);
                statusEl.textContent = state.statsVisible ? 'ON' : 'OFF';
                break;
            case 'detection':
                pill.classList.toggle('active', state.detectionEnabled);
                statusEl.textContent = state.detectionEnabled ? 'ON' : 'OFF';
                break;
            case 'emoji':
                pill.classList.toggle('active', state.emojiRemoverEnabled);
                statusEl.textContent = state.emojiRemoverEnabled ? 'ON' : 'OFF';
                break;
        }
    });
}

DOM.toolbar.addEventListener('click', e => {
    const pill = e.target.closest('.toolbar-pill');
    if (!pill) return;

    const feature = pill.dataset.feature;

    switch (feature) {
        case 'characters':
            state.characterSanitizerEnabled = !state.characterSanitizerEnabled;
            buildCharPattern();
            break;
        case 'phrases':
            state.autoPhrasesEnabled = !state.autoPhrasesEnabled;
            break;
        case 'stats':
            state.statsVisible = !state.statsVisible;
            break;
        case 'detection':
            state.detectionEnabled = !state.detectionEnabled;
            break;
    }

    updateToolbarPills();
    renderOutputAndStats();
    scheduleSave();
});

// ============================================================================
// SETTINGS MODAL
// ============================================================================

let lastFocusedElement = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled'));
}

function openSettings() {
    lastFocusedElement = document.activeElement;
    DOM.settingsOverlay.classList.add('open');
    DOM.settingsOverlay.setAttribute('aria-hidden', 'false');
    const firstInput = DOM.settingsModal.querySelector('input, button');
    if (firstInput) firstInput.focus();
    // Set tab if needed
    setActiveTab(state.activeSettingsTab);
}

function closeSettings() {
    DOM.settingsOverlay.classList.remove('open');
    DOM.settingsOverlay.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    } else {
        DOM.inputEl.focus();
    }
}

DOM.settingsBtn.addEventListener('click', openSettings);
DOM.closeSettingsBtn.addEventListener('click', closeSettings);

// Close on overlay click (not modal click)
DOM.settingsOverlay.addEventListener('click', e => {
    if (e.target === DOM.settingsOverlay) {
        closeSettings();
    }
});

// ============================================================================
// THEME TOGGLE
// ============================================================================

function applyTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    if (DOM.themeToggleBtn) {
        DOM.themeToggleBtn.classList.toggle('active', theme === 'light');
    }
    scheduleSave();
}

function toggleTheme() {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
}

if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);
}

// Emoji Remover Button in Header
if (DOM.emojiToggleBtn) {
    DOM.emojiToggleBtn.addEventListener('click', () => {
        state.emojiRemoverEnabled = !state.emojiRemoverEnabled;
        updateToolbarPills();
        updateEmojiToggleButton();
        renderOutputAndStats();
        scheduleSave();
    });
}

function updateEmojiToggleButton() {
    if (!DOM.emojiToggleBtn) return;
    DOM.emojiToggleBtn.classList.toggle('active', state.emojiRemoverEnabled);
}

// ============================================================================
// COPY OUTPUT FUNCTIONALITY
// ============================================================================

function copyOutputToClipboard() {
    const outputText = DOM.outputEl.value;
    if (!outputText) {
        console.log('Output is empty');
        return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
        // Visual feedback
        const btn = DOM.copyOutputBtn;
        const originalTitle = btn.title;
        btn.classList.add('copied');
        btn.title = 'Copied!';

        setTimeout(() => {
            btn.classList.remove('copied');
            btn.title = originalTitle;
        }, 1500);
    }).catch(err => console.error('Failed to copy:', err));
}

if (DOM.copyOutputBtn) {
    DOM.copyOutputBtn.addEventListener('click', copyOutputToClipboard);
    // Keyboard shortcut: Ctrl+Shift+C
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            copyOutputToClipboard();
        }
    });
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================

function setActiveTab(tabId) {
    state.activeSettingsTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.rail-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

document.querySelectorAll('.rail-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        setActiveTab(btn.dataset.tab);
    });
});

// ============================================================================
// SETTINGS TAB: CHARACTER FIXER
// ============================================================================

DOM.charFixerToggle.addEventListener('change', e => {
    state.characterSanitizerEnabled = e.target.checked;
    buildCharPattern();
    renderOutputAndStats();
    scheduleSave();
});

function renderCharacterMappings() {
    DOM.charMappingsContainer.innerHTML = '';

    Object.entries(state.charMap).forEach(([char, config]) => {
        const row = document.createElement('tr');
        const displayValue = char === '\u00A0' ? '\\u00A0' : char;

        row.innerHTML = `
            <td><input type="text" class="table-input char-detect" value="${escapeHtml(displayValue)}" placeholder="Character"></td>
            <td><input type="text" class="table-input char-replacement" value="${escapeHtml(config.replacement)}" placeholder="Replacement"></td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="char-enabled" ${config.enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="icon-button delete-button" data-char="${char}" aria-label="Delete mapping" title="Delete">
                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                        <path d="M3 6h18M8 6V4h8v2M9 6v14m6-14v14M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;

        DOM.charMappingsContainer.appendChild(row);

        const detectInput = row.querySelector('.char-detect');
        const replacementInput = row.querySelector('.char-replacement');
        const enabledCheckbox = row.querySelector('.char-enabled');
        const deleteBtn = row.querySelector('.delete-button');

        detectInput.addEventListener('change', () => {
            const newChar = parseCharInput(detectInput.value);
            if (!newChar || newChar === char) return;
            state.charMap[newChar] = state.charMap[char];
            delete state.charMap[char];
            buildCharPattern();
            renderCharacterMappings();
            renderOutputAndStats();
            scheduleSave();
        });

        replacementInput.addEventListener('change', () => {
            state.charMap[char].replacement = replacementInput.value;
            buildCharPattern();
            renderOutputAndStats();
            scheduleSave();
        });

        enabledCheckbox.addEventListener('change', () => {
            state.charMap[char].enabled = enabledCheckbox.checked;
            buildCharPattern();
            renderOutputAndStats();
            scheduleSave();
        });

        deleteBtn.addEventListener('click', () => {
            delete state.charMap[char];
            buildCharPattern();
            renderCharacterMappings();
            renderOutputAndStats();
            scheduleSave();
        });
    });
}

const charAddBtn = document.querySelector('#tab-characters .add-button');
charAddBtn.addEventListener('click', () => {
    const char = prompt('Enter character or escape sequence (e.g., —, …, \\u00A0):');
    if (!char) return;

    const finalChar = parseCharInput(char);
    if (!finalChar) return;

    state.charMap[finalChar] = { replacement: '', enabled: true };
    buildCharPattern();
    renderCharacterMappings();
    scheduleSave();
});

// ============================================================================
// SETTINGS TAB: WORD FIXER
// ============================================================================

const phraseModeInputs = document.querySelectorAll('input[name="phrase-mode"]');
phraseModeInputs.forEach(input => {
    input.addEventListener('change', e => {
        if (!e.target.checked) return;
        state.autoPhrasesEnabled = e.target.value === 'auto';
        buildPhraseRegex();
        renderOutputAndStats();
        updateToolbarPills();
        scheduleSave();
    });
});

// Set initial value
document.querySelector(`input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? 'auto' : 'manual'}"]`).checked = true;

function renderPhraseMappings() {
    DOM.phraseMappingsContainer.innerHTML = '';

    Object.entries(state.phraseMap).forEach(([phrase, config]) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" class="table-input phrase-detect" value="${escapeHtml(phrase)}" placeholder="Phrase"></td>
            <td><input type="text" class="table-input phrase-replacement" value="${escapeHtml(config.replacement)}" placeholder="Replacement"></td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="phrase-enabled" ${config.enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="icon-button delete-button" aria-label="Delete phrase" title="Delete">
                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                        <path d="M3 6h18M8 6V4h8v2M9 6v14m6-14v14M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;

        DOM.phraseMappingsContainer.appendChild(row);

        const detectInput = row.querySelector('.phrase-detect');
        const replacementInput = row.querySelector('.phrase-replacement');
        const enabledCheckbox = row.querySelector('.phrase-enabled');
        const deleteBtn = row.querySelector('.delete-button');

        detectInput.addEventListener('change', () => {
            const newPhrase = detectInput.value.toLowerCase();
            if (newPhrase !== phrase && newPhrase.trim()) {
                state.phraseMap[newPhrase] = state.phraseMap[phrase];
                delete state.phraseMap[phrase];
                buildPhraseRegex();
                renderPhraseMappings();
                renderOutputAndStats();
                scheduleSave();
            }
        });

        replacementInput.addEventListener('change', () => {
            state.phraseMap[phrase].replacement = replacementInput.value;
            buildPhraseRegex();
            renderOutputAndStats();
            scheduleSave();
        });

        enabledCheckbox.addEventListener('change', () => {
            state.phraseMap[phrase].enabled = enabledCheckbox.checked;
            buildPhraseRegex();
            renderOutputAndStats();
            scheduleSave();
        });

        deleteBtn.addEventListener('click', () => {
            delete state.phraseMap[phrase];
            buildPhraseRegex();
            renderPhraseMappings();
            renderOutputAndStats();
            scheduleSave();
        });
    });
}

if (DOM.addPhraseBtn) {
    DOM.addPhraseBtn.addEventListener('click', () => {
        openPhraseDialog();
    });
}

// ============================================================================
// SETTINGS TAB: AI DETECTION
// ============================================================================

DOM.detectionToggle.addEventListener('change', e => {
    state.detectionEnabled = e.target.checked;
    renderOutputAndStats();
    updateToolbarPills();
    scheduleSave();
});

// Set initial detection toggle
DOM.detectionToggle.checked = state.detectionEnabled;

// Emoji Remover Toggle
if (DOM.emojiRemoverToggle) {
    DOM.emojiRemoverToggle.addEventListener('change', e => {
        state.emojiRemoverEnabled = e.target.checked;
        renderOutputAndStats();
        updateToolbarPills();
        scheduleSave();
    });

    // Set initial emoji toggle
    DOM.emojiRemoverToggle.checked = state.emojiRemoverEnabled;
}

function renderDetectionPatterns() {
    DOM.detectionPatternsContainer.innerHTML = '';

    state.detectionPatterns.forEach(pattern => {
        const row = document.createElement('tr');
        if (!pattern.position) {
            pattern.position = 'any';
        }
        const position = pattern.position;

        row.innerHTML = `
            <td><input type="text" class="table-input pattern-input" value="${escapeHtml(pattern.source || '')}" placeholder="Regex pattern"></td>
            <td>
                <select class="table-input pattern-position">
                    <option value="start" ${position === 'start' ? 'selected' : ''}>Start</option>
                    <option value="end" ${position === 'end' ? 'selected' : ''}>End</option>
                    <option value="any" ${position === 'any' ? 'selected' : ''}>Any</option>
                </select>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="pattern-enabled" ${pattern.enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="icon-button delete-button" aria-label="Delete pattern" title="Delete">
                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                        <path d="M3 6h18M8 6V4h8v2M9 6v14m6-14v14M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;

        DOM.detectionPatternsContainer.appendChild(row);

        const inputEl = row.querySelector('.pattern-input');
        const positionEl = row.querySelector('.pattern-position');
        const enabledEl = row.querySelector('.pattern-enabled');
        const deleteBtn = row.querySelector('.delete-button');

        inputEl.addEventListener('change', () => {
            pattern.source = inputEl.value.trim();
            buildDetectionPatterns();
            renderOutputAndStats();
            scheduleSave();
        });

        positionEl.addEventListener('change', () => {
            pattern.position = positionEl.value;
            buildDetectionPatterns();
            renderOutputAndStats();
            scheduleSave();
        });

        enabledEl.addEventListener('change', () => {
            pattern.enabled = enabledEl.checked;
            buildDetectionPatterns();
            renderOutputAndStats();
            scheduleSave();
        });

        deleteBtn.addEventListener('click', () => {
            state.detectionPatterns = state.detectionPatterns.filter(p => p.id !== pattern.id);
            buildDetectionPatterns();
            renderDetectionPatterns();
            renderOutputAndStats();
            scheduleSave();
        });
    });
}

// ============================================================================
// SETTINGS TAB: WORD COUNT
// ============================================================================

const wordCountMode = document.querySelectorAll('input[name="wordcount-mode"]');
wordCountMode.forEach(input => {
    input.addEventListener('change', e => {
        if (e.target.checked) {
            state.wordCountMode = e.target.value;
            updateMildTagsVisibility();
            renderOutputAndStats();
            scheduleSave();
        }
    });
});

// Set initial value
document.querySelector(`input[name="wordcount-mode"][value="${state.wordCountMode}"]`).checked = true;

function updateMildTagsVisibility() {
    if (!DOM.mildTags) return;
    DOM.mildTags.style.display = state.wordCountMode === 'mild' ? 'flex' : 'none';
}

function renderMildTags() {
    if (!DOM.tagList) return;
    DOM.tagList.innerHTML = '';
    state.mildIgnoreWords.forEach(word => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${word}</span>
            <button type="button" aria-label="Remove ${word}">×</button>
        `;
        const removeBtn = tag.querySelector('button');
        removeBtn.addEventListener('click', () => {
            state.mildIgnoreWords = state.mildIgnoreWords.filter(item => item !== word);
            renderMildTags();
            renderOutputAndStats();
            scheduleSave();
        });
        DOM.tagList.appendChild(tag);
    });
}

if (DOM.tagInput) {
    DOM.tagInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = DOM.tagInput.value.trim().replace(/,$/, '');
            if (!value) return;
            if (!state.mildIgnoreWords.includes(value)) {
                state.mildIgnoreWords.push(value);
                renderMildTags();
                renderOutputAndStats();
                scheduleSave();
            }
            DOM.tagInput.value = '';
        }
    });
}

// ============================================================================
// KEYBOARD SHORTCUTS DATA & DIALOG
// ============================================================================

const KEYBOARD_SHORTCUTS = [
    { action: 'Toggle Character Fixer', shortcut: 'Alt + 1' },
    { action: 'Apply/Toggle Phrases', shortcut: 'Alt + 2' },
    { action: 'Toggle Stats Visibility', shortcut: 'Alt + 3' },
    { action: 'Acknowledge Missed Copy', shortcut: 'Alt + 4' },
    { action: 'Toggle Emoji Remover', shortcut: 'Q' },
    { action: 'Open/Close Settings', shortcut: 'Alt + S / Ctrl + Shift + S' },
    { action: 'Show Keyboard Shortcuts', shortcut: '⌘K / Ctrl + K' },
    { action: 'Copy Output', shortcut: 'Ctrl + Shift + C' },
    { action: 'Clear Input', shortcut: 'Ctrl + Shift + X' },
    { action: 'Close Dialogs', shortcut: 'Esc' }
];

function renderKeyboardShortcuts() {
    DOM.shortcutsTbody.innerHTML = '';
    KEYBOARD_SHORTCUTS.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.action}</td>
            <td>${item.shortcut}</td>
        `;
        DOM.shortcutsTbody.appendChild(row);
    });
}

function openKeyboardGuide() {
    DOM.keyboardDialog.classList.add('open');
    renderKeyboardShortcuts();
}

function closeKeyboardGuide() {
    DOM.keyboardDialog.classList.remove('open');
    DOM.inputEl.focus();
}

DOM.keyboardGuideBtn.addEventListener('click', openKeyboardGuide);
DOM.closeKeyboardBtn.addEventListener('click', closeKeyboardGuide);

// Close on overlay click (not modal click)
DOM.keyboardDialog.addEventListener('click', e => {
    if (e.target === DOM.keyboardDialog) {
        closeKeyboardGuide();
    }
});

// ============================================================================
// ADD PHRASE DIALOG
// ============================================================================

function openPhraseDialog() {
    if (!DOM.phraseDialog) return;
    DOM.phraseDialog.classList.add('open');
    DOM.phraseDialog.setAttribute('aria-hidden', 'false');
    DOM.phraseInput.value = '';
    DOM.phraseReplacementInput.value = '';
    DOM.phraseInput.focus();
}

function closePhraseDialog() {
    if (!DOM.phraseDialog) return;
    DOM.phraseDialog.classList.remove('open');
    DOM.phraseDialog.setAttribute('aria-hidden', 'true');
}

if (DOM.closePhraseDialogBtn) {
    DOM.closePhraseDialogBtn.addEventListener('click', closePhraseDialog);
}

if (DOM.cancelPhraseDialogBtn) {
    DOM.cancelPhraseDialogBtn.addEventListener('click', closePhraseDialog);
}

if (DOM.savePhraseDialogBtn) {
    DOM.savePhraseDialogBtn.addEventListener('click', () => {
        const phrase = DOM.phraseInput.value.trim();
        const replacement = DOM.phraseReplacementInput.value.trim();
        if (!phrase) return;
        const lower = phrase.toLowerCase();
        state.phraseMap[lower] = { replacement, enabled: true };
        buildPhraseRegex();
        renderPhraseMappings();
        renderOutputAndStats();
        scheduleSave();
        closePhraseDialog();
    });
}

if (DOM.phraseDialog) {
    DOM.phraseDialog.addEventListener('click', e => {
        if (e.target === DOM.phraseDialog) closePhraseDialog();
    });
    DOM.phraseDialog.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closePhraseDialog();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            DOM.savePhraseDialogBtn.click();
        }
    });
}

// ============================================================================
// ADD RULE DIALOG
// ============================================================================

function openRuleDialog() {
    if (!DOM.ruleDialog) return;
    DOM.ruleDialog.classList.add('open');
    DOM.ruleDialog.setAttribute('aria-hidden', 'false');
    DOM.rulePatternInput.value = '';
    DOM.rulePositionInput.value = 'start';
    DOM.rulePatternInput.focus();
}

function closeRuleDialog() {
    if (!DOM.ruleDialog) return;
    DOM.ruleDialog.classList.remove('open');
    DOM.ruleDialog.setAttribute('aria-hidden', 'true');
}

if (DOM.closeRuleDialogBtn) {
    DOM.closeRuleDialogBtn.addEventListener('click', closeRuleDialog);
}

if (DOM.cancelRuleDialogBtn) {
    DOM.cancelRuleDialogBtn.addEventListener('click', closeRuleDialog);
}

if (DOM.saveRuleDialogBtn) {
    DOM.saveRuleDialogBtn.addEventListener('click', () => {
        const pattern = DOM.rulePatternInput.value.trim();
        const position = DOM.rulePositionInput.value;
        if (!pattern) return;
        const id = `rule-${Date.now()}`;
        state.detectionPatterns.push({
            id,
            type: 'regex',
            source: pattern,
            enabled: true,
            position
        });
        buildDetectionPatterns();
        renderDetectionPatterns();
        renderOutputAndStats();
        scheduleSave();
        closeRuleDialog();
    });
}

if (DOM.ruleDialog) {
    DOM.ruleDialog.addEventListener('click', e => {
        if (e.target === DOM.ruleDialog) closeRuleDialog();
    });
    DOM.ruleDialog.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeRuleDialog();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            DOM.saveRuleDialogBtn.click();
        }
    });
}

if (DOM.addRuleBtn) {
    DOM.addRuleBtn.addEventListener('click', openRuleDialog);
}

// ============================================================================
// KEYBOARD SHORTCUTS HANDLER
// ============================================================================

function handleKeyboardShortcuts(e) {
    if (DOM.settingsOverlay.classList.contains('open') && e.key === 'Tab') {
        const focusable = getFocusableElements(DOM.settingsModal);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    // Ctrl+Shift+C - Copy output
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (DOM.outputEl.value) {
            navigator.clipboard.writeText(DOM.outputEl.value).then(() => {
                // Optional: add visual feedback later
            }).catch(err => console.error('Failed to copy:', err));
        }
        return;
    }

    // Ctrl+Shift+X - Clear input
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();

        DOM.inputEl.value = '';
        renderOutputAndStats();
        return;
    }

    // Ctrl+Shift+S - Open settings
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (DOM.settingsOverlay.classList.contains('open')) {
            closeSettings();
        } else {
            openSettings();
        }
        return;
    }

    // Cmd+K or Ctrl+K - Show keyboard shortcuts
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openKeyboardGuide();
        return;
    }

    // Alt + number keys
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                state.characterSanitizerEnabled = !state.characterSanitizerEnabled;
                DOM.charFixerToggle.checked = state.characterSanitizerEnabled;
                buildCharPattern();
                renderOutputAndStats();
                updateToolbarPills();
                scheduleSave();
                break;

            case '2':
                e.preventDefault();
                if (e.shiftKey) {
                    // Toggle auto mode
                    state.autoPhrasesEnabled = !state.autoPhrasesEnabled;
                    document.querySelector(`input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? 'auto' : 'manual'}"]`).checked = true;
                    buildPhraseRegex();
                    renderOutputAndStats();
                    updateToolbarPills();
                    scheduleSave();
                } else {
                    // Apply phrases once (manual)
                    if (!state.autoPhrasesEnabled) {
                        state.currentText = applyPhraseReplacements(state.currentText);
                        DOM.outputEl.value = state.currentText;
                        renderOutputAndStats();
                    }
                }
                break;

            case '3':
                e.preventDefault();
                state.statsVisible = !state.statsVisible;
                renderOutputAndStats();
                updateToolbarPills();
                scheduleSave();
                break;

            case '4':
                e.preventDefault();
                state.aiFormatAcked = !state.aiFormatAcked;
                renderOutputAndStats();
                scheduleSave();
                break;

            case 's':
            case 'S':
                e.preventDefault();
                if (DOM.settingsOverlay.classList.contains('open')) {
                    closeSettings();
                } else {
                    openSettings();
                }
                break;
        }
    }

    // Q - Toggle emoji remover (only when not typing in input)
    if ((e.key === 'q' || e.key === 'Q') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement !== DOM.inputEl && activeElement !== DOM.outputEl) {
            e.preventDefault();
            DOM.emojiToggleBtn.click();
        }
    }

    // Escape - Close dialogs
    if (e.key === 'Escape') {
        if (DOM.settingsOverlay.classList.contains('open')) {
            closeSettings();
        } else if (DOM.keyboardDialog.classList.contains('open')) {
            closeKeyboardGuide();
        }
    }
}

window.addEventListener('keydown', handleKeyboardShortcuts);

// ============================================================================
// INITIALIZATION
// ============================================================================

function initialize() {
    loadState();
    applyTheme(state.theme || 'dark');

    buildCharPattern();
    buildPhraseRegex();
    buildDetectionPatterns();

    renderCharacterMappings();
    renderPhraseMappings();
    renderDetectionPatterns();
    renderMildTags();
    updateMildTagsVisibility();

    if (DOM.charFixerToggle) {
        DOM.charFixerToggle.checked = state.characterSanitizerEnabled;
    }
    if (DOM.detectionToggle) {
        DOM.detectionToggle.checked = state.detectionEnabled;
    }
    const phraseMode = document.querySelector(`input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? 'auto' : 'manual'}"]`);
    if (phraseMode) phraseMode.checked = true;
    const wordMode = document.querySelector(`input[name="wordcount-mode"][value="${state.wordCountMode}"]`);
    if (wordMode) wordMode.checked = true;

    updateToolbarPills();

    // Trigger initial render
    renderOutputAndStats();
}

// Call initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
