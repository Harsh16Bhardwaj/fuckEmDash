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
  wordCountMode: "strict", // 'strict' or 'mild'
  detectionSensitivity: "strict",
  activeSettingsTab: "characters", // Current tab in settings
  theme: "dark",

  // AI format state
  aiFormatDetected: false,
  aiFormatAcked: false,

  // Data maps
  phraseMap: {
    // Overused formal verbs
    utilize: { replacement: "use", enabled: true },
    utilise: { replacement: "use", enabled: true },
    leverage: { replacement: "use", enabled: true },
    commence: { replacement: "start", enabled: true },
    initiate: { replacement: "start", enabled: true },
    terminate: { replacement: "end", enabled: true },
    facilitate: { replacement: "help", enabled: true },
    endeavor: { replacement: "try", enabled: true },
    endeavour: { replacement: "try", enabled: true },
    ascertain: { replacement: "find out", enabled: true },
    ameliorate: { replacement: "improve", enabled: true },
    obtain: { replacement: "get", enabled: true },
    acquire: { replacement: "get", enabled: true },
    comprehend: { replacement: "understand", enabled: true },
    demonstrate: { replacement: "show", enabled: true },
    indicate: { replacement: "show", enabled: true },
    necessitate: { replacement: "require", enabled: true },
    prioritize: { replacement: "focus on", enabled: true },
    implement: { replacement: "use", enabled: true },
    optimize: { replacement: "improve", enabled: true },
    mitigate: { replacement: "reduce", enabled: true },

    // Buzzword verbs
    "delve into": { replacement: "explore", enabled: true },
    "dive into": { replacement: "explore", enabled: true },
    unpack: { replacement: "look at", enabled: true },
    navigate: { replacement: "handle", enabled: true },
    harness: { replacement: "use", enabled: true },
    pivot: { replacement: "shift", enabled: true },
    streamline: { replacement: "simplify", enabled: true },
    foster: { replacement: "build", enabled: true },
    cultivate: { replacement: "develop", enabled: true },
    underscore: { replacement: "highlight", enabled: true },
    bolster: { replacement: "strengthen", enabled: true },
    empower: { replacement: "help", enabled: true },
    "bridge the gap": { replacement: "close the gap", enabled: true },

    // Filler clauses (replace with nothing or simpler)
    "it is worth noting that": { replacement: "", enabled: true },
    "it is important to note that": { replacement: "", enabled: true },
    "it should be noted that": { replacement: "", enabled: true },
    "it is interesting to note that": { replacement: "", enabled: true },
    "it goes without saying": { replacement: "", enabled: true },
    "needless to say": { replacement: "", enabled: true },
    "as previously mentioned": { replacement: "", enabled: true },
    "as mentioned earlier": { replacement: "", enabled: true },
    "as stated above": { replacement: "", enabled: true },
    "in today's world": { replacement: "", enabled: true },
    "in today's fast-paced world": { replacement: "", enabled: true },
    "in this day and age": { replacement: "", enabled: true },
    "the fact of the matter is": { replacement: "", enabled: true },
    "at the end of the day": { replacement: "", enabled: true },
    "when all is said and done": { replacement: "", enabled: true },
    "it is what it is": { replacement: "", enabled: true },
    "needless to say": { replacement: "", enabled: true },

    // Verbose phrase contractions
    "in order to": { replacement: "to", enabled: true },
    "in order for": { replacement: "for", enabled: true },
    "due to the fact that": { replacement: "because", enabled: true },
    "owing to the fact that": { replacement: "because", enabled: true },
    "for the purpose of": { replacement: "to", enabled: true },
    "with the intention of": { replacement: "to", enabled: true },
    "at this point in time": { replacement: "now", enabled: true },
    "at this juncture": { replacement: "now", enabled: true },
    "in the event that": { replacement: "if", enabled: true },
    "in the near future": { replacement: "soon", enabled: true },
    "on a daily basis": { replacement: "daily", enabled: true },
    "on a regular basis": { replacement: "regularly", enabled: true },
    "in the majority of cases": { replacement: "mostly", enabled: true },
    "with regard to": { replacement: "about", enabled: true },
    "with respect to": { replacement: "about", enabled: true },
    "in relation to": { replacement: "about", enabled: true },
    "in terms of": { replacement: "for", enabled: true },
    "a number of": { replacement: "several", enabled: true },
    "a wide range of": { replacement: "many", enabled: true },
    "a variety of": { replacement: "various", enabled: true },
    "a plethora of": { replacement: "many", enabled: true },
    "a myriad of": { replacement: "many", enabled: true },
    "make use of": { replacement: "use", enabled: true },

    // Corporate-speak adjectives
    robust: { replacement: "strong", enabled: true },
    comprehensive: { replacement: "complete", enabled: true },
    crucial: { replacement: "important", enabled: true },
    paramount: { replacement: "very important", enabled: true },
    imperative: { replacement: "necessary", enabled: true },
    significant: { replacement: "notable", enabled: true },
    substantial: { replacement: "large", enabled: true },
    innovative: { replacement: "new", enabled: true },
    "cutting-edge": { replacement: "modern", enabled: true },
    "state-of-the-art": { replacement: "modern", enabled: true },
    scalable: { replacement: "flexible", enabled: true },
    granular: { replacement: "detailed", enabled: true },
    holistic: { replacement: "complete", enabled: true },
    seamless: { replacement: "smooth", enabled: true },
    actionable: { replacement: "practical", enabled: true },
    impactful: { replacement: "effective", enabled: true },

    // Hedging language
    "it seems": { replacement: "", enabled: false }, // disabled by default, user chooses
    "it appears": { replacement: "", enabled: false },
    arguably: { replacement: "", enabled: false },
    "to some extent": { replacement: "partly", enabled: true },
    "in a sense": { replacement: "", enabled: true },
    "one might argue": { replacement: "", enabled: false },
    "it could be argued": { replacement: "", enabled: false },
    "it could be said": { replacement: "", enabled: false },

    // AI-specific verbose transitions
    furthermore: { replacement: "also", enabled: true },
    moreover: { replacement: "also", enabled: true },
    additionally: { replacement: "also", enabled: true },
    consequently: { replacement: "so", enabled: true },
    subsequently: { replacement: "then", enabled: true },
    nevertheless: { replacement: "still", enabled: true },
    nonetheless: { replacement: "still", enabled: true },
    "in conclusion": { replacement: "finally", enabled: true },
    "to summarize": { replacement: "in short", enabled: true },
    "to sum up": { replacement: "in short", enabled: true },
    "in summary": { replacement: "in short", enabled: true },
    "in essence": { replacement: "basically", enabled: true },
    "at its core": { replacement: "basically", enabled: true },
    fundamentally: { replacement: "basically", enabled: true },

    // AI-ish noun/concept words
    synergy: { replacement: "cooperation", enabled: true },
    ecosystem: { replacement: "system", enabled: true },
    landscape: { replacement: "field", enabled: true },
    framework: { replacement: "system", enabled: false }, // context-dependent, off by default
    paradigm: { replacement: "model", enabled: true },
    "paradigm shift": { replacement: "big change", enabled: true },
  },

  charMap: {
    // Dashes (highest priority — convert first)
    "—": { replacement: "-", enabled: true }, // em dash
    "–": { replacement: "-", enabled: true }, // en dash
    "‒": { replacement: "-", enabled: true }, // figure dash
    "―": { replacement: "-", enabled: true }, // horizontal bar
    "−": { replacement: "-", enabled: true }, // minus sign (U+2212)
    "‐": { replacement: "-", enabled: true }, // hyphen (U+2010)
    "‑": { replacement: "-", enabled: true }, // non-breaking hyphen

    // Ellipsis
    "…": { replacement: "...", enabled: true }, // single ellipsis char

    // Quotes — smart/curly to straight
    "\u201C": { replacement: '"', enabled: true }, // left double "
    "\u201D": { replacement: '"', enabled: true }, // right double "
    "\u201E": { replacement: '"', enabled: true }, // double low-9 quote „
    "\u2018": { replacement: "'", enabled: true }, // left single '
    "\u2019": { replacement: "'", enabled: true }, // right single '
    "\u201A": { replacement: "'", enabled: true }, // single low-9 quote ‚
    "\u2039": { replacement: "'", enabled: true }, // single left angle «
    "\u203A": { replacement: "'", enabled: true }, // single right angle »
    "\u00AB": { replacement: '"', enabled: true }, // left double angle «
    "\u00BB": { replacement: '"', enabled: true }, // right double angle »

    // Bullet-style characters
    "•": { replacement: "-", enabled: true }, // bullet point
    "·": { replacement: "-", enabled: true }, // middle dot
    "‣": { replacement: "-", enabled: true }, // triangular bullet
    "⁃": { replacement: "-", enabled: true }, // hyphen bullet
    "◦": { replacement: "-", enabled: true }, // white bullet
    "▪": { replacement: "-", enabled: true }, // small black square
    "▸": { replacement: "-", enabled: true }, // right-pointing arrow bullet

    // Spaces — non-standard whitespace to plain space
    "\u00A0": { replacement: " ", enabled: true }, // non-breaking space
    "\u202F": { replacement: " ", enabled: true }, // narrow non-breaking space
    "\u2009": { replacement: " ", enabled: true }, // thin space
    "\u2008": { replacement: " ", enabled: true }, // punctuation space
    "\u2007": { replacement: " ", enabled: true }, // figure space
    "\u2006": { replacement: " ", enabled: true }, // six-per-em space
    "\u2005": { replacement: " ", enabled: true }, // four-per-em space
    "\u2004": { replacement: " ", enabled: true }, // three-per-em space
    "\u2003": { replacement: " ", enabled: true }, // em space
    "\u2002": { replacement: " ", enabled: true }, // en space

    // Invisible / zero-width characters (remove)
    "\u200B": { replacement: "", enabled: true }, // zero-width space
    "\u200C": { replacement: "", enabled: true }, // zero-width non-joiner
    "\u200D": { replacement: "", enabled: true }, // zero-width joiner
    "\uFEFF": { replacement: "", enabled: true }, // BOM / zero-width no-break space
    "\u2060": { replacement: "", enabled: true }, // word joiner
    "\u00AD": { replacement: "", enabled: true }, // soft hyphen

    // Math/typography symbols commonly pasted from AI
    "\u00D7": { replacement: "x", enabled: false }, // multiplication sign × (off by default; context-specific)
    "\u00F7": { replacement: "/", enabled: false }, // division sign ÷
    "\u2212": { replacement: "-", enabled: true }, // minus sign
    "\u2014": { replacement: "-", enabled: true }, // em dash again (explicit Unicode)
    "\u2013": { replacement: "-", enabled: true }, // en dash again

    // Misc typography
    "\u2026": { replacement: "...", enabled: true }, // ellipsis (Unicode)
    "\u2025": { replacement: "..", enabled: true }, // two dot leader
    "\u2024": { replacement: ".", enabled: true }, // one dot leader
    "\u2022": { replacement: "-", enabled: true }, // bullet (Unicode)
    "\u00B7": { replacement: "-", enabled: true }, // middle dot
    "\u2032": { replacement: "'", enabled: true }, // prime ′ (used as apostrophe)
    "\u2033": { replacement: '"', enabled: true }, // double prime ″

    // Semicolons (optional, user decides)
    ";": { replacement: ",", enabled: false }, // off by default — too aggressive
  },

  detectionPatterns: [
    // ─── AI OPENERS (position: 'start') ───────────────────────────────────────

    {
      id: "certainly",
      type: "regex",
      source: "^Certainly[,!]?\\s",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "of-course",
      type: "regex",
      source: "^Of course[,!]?\\s",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "absolutely",
      type: "regex",
      source: "^Absolutely[,!]?\\s",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "sure-here",
      type: "regex",
      source: "^Sure[,!]?\\s+(?:here(?:'s| is)|this (?:is|are))",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "great-question",
      type: "regex",
      source: "^Great question[,!]?",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "good-question",
      type: "regex",
      source:
        "^(?:That's a )?(?:great|good|excellent|interesting|wonderful) question[,!]?",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "happy-to-help-opener",
      type: "regex",
      source: "^(?:I'd be )?(?:happy|glad|pleased) to help[,!]?",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "here-is-overview",
      type: "regex",
      source:
        "^Here(?:'s| is) (?:a |an |the )?(?:overview|summary|breakdown|guide|explanation|step-by-step|detailed|comprehensive|quick)",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "here-are-some",
      type: "regex",
      source: "^Here are (?:a few|some|several|the|\\d+)",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "here-is-your",
      type: "regex",
      source: "^Here(?:'s| is) your",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "here-is-implementation",
      type: "regex",
      source:
        "^Here(?:'s| is) (?:the |your |a )?(?:implementation|code|solution|answer|result|output)",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "here-is-tight-plan",
      type: "regex",
      source: "^Here(?:'s| is) a tight \\d+-(?:task|step|part|point) plan",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "lets-dive-in",
      type: "regex",
      source: "^Let(?:'s| us) (?:dive|jump|get) (?:in|into|started)",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "lets-break-down",
      type: "regex",
      source: "^Let(?:'s| us) break (?:this|it|things) down",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "lets-explore",
      type: "regex",
      source: "^Let(?:'s| us) (?:explore|look at|examine|walk through)",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "in-this-guide",
      type: "regex",
      source:
        "^In this (?:guide|article|post|tutorial|section|response|answer)",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "to-get-started",
      type: "regex",
      source: "^To get started[,:]?",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "as-an-ai",
      type: "regex",
      source: "^As an AI(?: language model)?[,]?",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "thank-you-question",
      type: "regex",
      source: "^Thank you for (?:your question|asking|reaching out)",
      enabled: true,
      sensitivity: "mild",
      position: "start",
    },

    {
      id: "i-understand",
      type: "regex",
      source:
        "^I(?:'ll| will) (?:help you|walk you through|guide you|explain|show you)",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "below-you-will",
      type: "regex",
      source: "^Below[, ](?:you(?:'ll| will) find|is|are)",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    {
      id: "got-it",
      type: "regex",
      source: "^Got it[,!]?",
      enabled: true,
      sensitivity: "strict",
      position: "start",
    },

    // ─── AI CLOSERS (position: 'end') ─────────────────────────────────────────

    {
      id: "hope-this-helps",
      type: "regex",
      source:
        "I hope this (?:helps|clarifies|answers your question|is helpful)[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "hope-helps-short",
      type: "regex",
      source: "Hope this helps[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "let-me-know",
      type: "regex",
      source:
        "Let me know if (?:you have|there are) any (?:questions|concerns|issues|doubts)[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "feel-free-ask",
      type: "regex",
      source:
        "Feel free to (?:ask|reach out)(?: if you need anything(?:else)?)?[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "happy-to-help-closer",
      type: "regex",
      source: "(?:I(?:'m| am) )?[Hh]appy to help[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "there-you-go",
      type: "regex",
      source: "[Tt]here you go[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "here-you-go",
      type: "regex",
      source: "[Hh]ere you go[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "in-conclusion",
      type: "regex",
      source: "\\bIn conclusion[,:]",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "to-summarize",
      type: "regex",
      source: "\\b[Tt]o summarize[,:]",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "to-sum-up",
      type: "regex",
      source: "\\b[Tt]o sum up[,:]",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "in-summary",
      type: "regex",
      source: "\\b[Ii]n summary[,:]",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "overall",
      type: "regex",
      source: "^[Oo]verall[,:]",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "ultimately",
      type: "regex",
      source: "^[Uu]ltimately[,:]",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "hope-valuable",
      type: "regex",
      source:
        "I hope (?:this|you find) (?:was|is) (?:helpful|useful|valuable|informative)[.!]?$",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "dont-hesitate",
      type: "regex",
      source: "[Dd]on't hesitate to (?:ask|reach out|contact)[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "further-questions",
      type: "regex",
      source: "If you have (?:any )?further questions[.!]?$",
      enabled: true,
      sensitivity: "mild",
      position: "end",
    },

    {
      id: "suggestions-next",
      type: "regex",
      source: "(?:Suggestions? for (?:next|further) (?:steps?|tasks?))",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    {
      id: "next-steps",
      type: "regex",
      source: "^(?:Next steps?|Recommended next steps?)[:\\s]",
      enabled: true,
      sensitivity: "strict",
      position: "end",
    },

    // ─── AI STRUCTURE (position: 'anywhere') ──────────────────────────────────

    {
      id: "markdown-heading",
      type: "regex",
      source: "^#{1,3}\\s.+$",
      enabled: true,
      sensitivity: "strict",
      position: "anywhere",
    },

    {
      id: "numbered-list",
      type: "regex",
      source: "^\\d+\\.\\s.+$",
      enabled: true,
      sensitivity: "strict",
      position: "anywhere",
    },

    {
      id: "underscores-importance",
      type: "regex",
      source: "underscores? the importance of",
      enabled: true,
      sensitivity: "strict",
      position: "anywhere",
    },

    {
      id: "this-highlights",
      type: "regex",
      source: "this highlights (?:the|how|why)",
      enabled: true,
      sensitivity: "strict",
      position: "anywhere",
    },
  ],

  mildIgnoreWords: [
    // Articles
    "a",
    "an",
    "the",

    // Short prepositions
    "of",
    "in",
    "on",
    "at",
    "to",
    "by",
    "up",
    "as",
    "for",
    "off",
    "out",
    "via",
    "per",

    // Conjunctions
    "and",
    "or",
    "but",
    "nor",
    "yet",
    "so",
    "if",
    "as",
    "than",

    // Short pronouns (optional — disable if you want to keep these)
    "i",
    "it",
    "he",
    "she",
    "we",
    "me",
    "us",
    "my",
    "its",

    // Short auxiliary verbs
    "is",
    "am",
    "are",
    "be",
    "do",

    // Very short adverbs
    "not",
    "no",
    "up",
    "too",
  ],

  currentText: "",

  // Diff mode
  diffModeEnabled: false,
  diffChanges: [],
  diffOriginalInput: "",
  diffChangeQueue: [], // Queue of pending changes
  diffProcessedChanges: {}, // Track which changes were accepted/rejected
  diffDecisionMemory: {}, // Persist decisions across re-opens (keyed by change signature)
};

// ============================================================================
// UNDO/REDO SYSTEM
// ============================================================================

let inputHistory = [];
let historyIndex = -1;
let historyTimer = null;

function pushToHistory(text) {
  // Remove any redo history when new change is made
  if (historyIndex < inputHistory.length - 1) {
    inputHistory = inputHistory.slice(0, historyIndex + 1);
  }

  // Add new state
  inputHistory.push(text);
  historyIndex++;

  // Limit history to 50 states to prevent memory issues
  if (inputHistory.length > 50) {
    inputHistory.shift();
    historyIndex--;
  }
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  const previousText = inputHistory[historyIndex];
  DOM.inputEl.value = previousText;
  renderOutputAndStats();
}

function redo() {
  if (historyIndex >= inputHistory.length - 1) return;
  historyIndex++;
  const nextText = inputHistory[historyIndex];
  DOM.inputEl.value = nextText;
  renderOutputAndStats();
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM = {
  root: document.getElementById("app-root"),
  header: document.querySelector(".header"),
  inputEl: document.getElementById("input-text"),
  outputEl: document.getElementById("output-text"),
  inputStats: document.getElementById("input-stats"),
  outputStats: document.getElementById("output-stats"),
  settingsBtn: document.getElementById("settings-btn"),
  keyboardGuideBtn: document.getElementById("keyboard-guide-btn"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  emojiToggleBtn: document.getElementById("emoji-toggle-btn"),
  copyOutputBtn: document.getElementById("copy-output-btn"),
  settingsOverlay: document.getElementById("settings-overlay"),
  settingsModal: document.querySelector(".settings-modal"),
  closeSettingsBtn: document.getElementById("close-settings"),
  keyboardDialog: document.getElementById("keyboard-dialog"),
  closeKeyboardBtn: document.getElementById("close-keyboard"),
  shortcutsTbody: document.getElementById("shortcuts-tbody"),
  phraseDialog: document.getElementById("phrase-dialog"),
  closePhraseDialogBtn: document.getElementById("close-phrase-dialog"),
  cancelPhraseDialogBtn: document.getElementById("cancel-phrase-dialog"),
  savePhraseDialogBtn: document.getElementById("save-phrase-dialog"),
  phraseInput: document.getElementById("phrase-input"),
  phraseReplacementInput: document.getElementById("phrase-replacement-input"),
  ruleDialog: document.getElementById("rule-dialog"),
  closeRuleDialogBtn: document.getElementById("close-rule-dialog"),
  cancelRuleDialogBtn: document.getElementById("cancel-rule-dialog"),
  saveRuleDialogBtn: document.getElementById("save-rule-dialog"),
  rulePatternInput: document.getElementById("rule-pattern-input"),
  rulePositionInput: document.getElementById("rule-position-input"),
  addPhraseBtn: document.getElementById("add-phrase-btn"),
  addRuleBtn: document.getElementById("add-rule-btn"),
  toolbar: document.querySelector(".toolbar"),
  charFixerToggle: document.getElementById("char-fixer-toggle"),
  detectionToggle: document.getElementById("detection-toggle"),
  emojiRemoverToggle: document.getElementById("emoji-remover-toggle"),
  charMappingsContainer: document.getElementById("char-mappings"),
  phraseMappingsContainer: document.getElementById("phrase-mappings"),
  detectionPatternsContainer: document.getElementById("detection-patterns"),
  mildTags: document.getElementById("mild-tags"),
  tagList: document.querySelector("#mild-tags .tag-list"),
  tagInput: document.getElementById("tag-input"),

  // Diff mode
  diffToggleBtn: document.getElementById("diff-toggle-btn"),
  diffOverlay: document.getElementById("diff-overlay"),
  diffContent: document.getElementById("diff-content"),
  closeDiffBtn: document.getElementById("close-diff"),
  diffRejectAllBtn: document.getElementById("diff-reject-all"),
  diffAcceptAllBtn: document.getElementById("diff-accept-all"),
  diffApplyBtn: document.getElementById("diff-apply"),
};

// ============================================================================
// TOAST / SNACKBAR
// ============================================================================

let toastTimer = null;

function showToast(message, durationMs = 2400) {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = String(message || "");
  el.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, durationMs);
}

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const STORAGE_KEY = "fuckEmDashPrefs";
const DEFAULTS_VERSION = 1;
let saveTimer = null;

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 200);
}

function saveState() {
  const payload = {
    defaultsVersion: DEFAULTS_VERSION,
    characterSanitizerEnabled: state.characterSanitizerEnabled,
    autoPhrasesEnabled: state.autoPhrasesEnabled,
    statsVisible: state.statsVisible,
    detectionEnabled: state.detectionEnabled,
    detectionSensitivity: state.detectionSensitivity,
    emojiRemoverEnabled: state.emojiRemoverEnabled,
    wordCountMode: state.wordCountMode,
    phraseMap: state.phraseMap,
    charMap: state.charMap,
    detectionPatterns: state.detectionPatterns,
    mildIgnoreWords: state.mildIgnoreWords,
    theme: state.theme,
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

    const storedDefaultsVersion = Number(parsed.defaultsVersion || 0);
    state.characterSanitizerEnabled =
      parsed.characterSanitizerEnabled ?? state.characterSanitizerEnabled;
    state.autoPhrasesEnabled =
      parsed.autoPhrasesEnabled ?? state.autoPhrasesEnabled;
    state.statsVisible = parsed.statsVisible ?? state.statsVisible;
    state.detectionEnabled = parsed.detectionEnabled ?? state.detectionEnabled;
    state.detectionSensitivity =
      parsed.detectionSensitivity ?? state.detectionSensitivity;
    state.emojiRemoverEnabled =
      parsed.emojiRemoverEnabled ?? state.emojiRemoverEnabled;
    state.wordCountMode = parsed.wordCountMode || state.wordCountMode;

    // If the stored prefs are from an older defaults set, merge saved rules into
    // the newer built-ins once so new validations appear in Settings.
    if (storedDefaultsVersion < DEFAULTS_VERSION) {
      if (parsed.phraseMap && typeof parsed.phraseMap === "object") {
        const merged = { ...state.phraseMap };
        for (const [k, v] of Object.entries(parsed.phraseMap)) {
          if (!k || !v || typeof v !== "object") continue;
          const key = String(k).toLowerCase();
          merged[key] = {
            replacement: String(
              v.replacement ?? merged[key]?.replacement ?? "",
            ),
            enabled: v.enabled !== false,
          };
        }
        state.phraseMap = merged;
      }

      if (parsed.charMap && typeof parsed.charMap === "object") {
        const merged = { ...state.charMap };
        for (const [k, v] of Object.entries(parsed.charMap)) {
          if (!k || !v || typeof v !== "object") continue;
          const key = String(k);
          merged[key] = {
            replacement: String(
              v.replacement ?? merged[key]?.replacement ?? "",
            ),
            enabled: v.enabled !== false,
          };
        }
        state.charMap = merged;
      }

      const defaultRules = Array.isArray(state.detectionPatterns)
        ? state.detectionPatterns
        : [];
      const storedRules = Array.isArray(parsed.detectionPatterns)
        ? parsed.detectionPatterns
        : [];

      const defaultIds = new Set(defaultRules.map((p) => p.id));

      const mergedRules = defaultRules.map((defRule, index) => {
        const stored = storedRules.find((p) => p && p.id === defRule.id);
        return {
          id: defRule.id || stored?.id || `rule-${Date.now()}-${index}`,
          type: stored?.type || defRule.type || "regex",
          source: stored?.source ?? defRule.source,
          enabled: stored ? stored.enabled !== false : defRule.enabled !== false,
          position:
            (stored?.position || defRule.position || "any") === "anywhere"
              ? "any"
              : stored?.position || defRule.position || "any",
          sensitivity: stored?.sensitivity || defRule.sensitivity || "mild",
        };
      });

      // Append any user-created rules not present in defaults.
      for (const stored of storedRules) {
        if (!stored || defaultIds.has(stored.id)) continue;
        mergedRules.push({
          id: stored.id || `rule-${Date.now()}`,
          type: stored.type || "regex",
          source: stored.source,
          enabled: stored.enabled !== false,
          position:
            (stored.position || "any") === "anywhere"
              ? "any"
              : stored.position || "any",
          sensitivity: stored.sensitivity || "mild",
        });
      }

      state.detectionPatterns = mergedRules;
    } else {
      // Newer prefs: treat stored rule lists/maps as authoritative.
      if (parsed.phraseMap && typeof parsed.phraseMap === "object") {
        const normalized = {};
        for (const [k, v] of Object.entries(parsed.phraseMap)) {
          if (!k || !v || typeof v !== "object") continue;
          const key = String(k).toLowerCase();
          normalized[key] = {
            replacement: String(v.replacement ?? ""),
            enabled: v.enabled !== false,
          };
        }
        state.phraseMap = normalized;
      }

      if (parsed.charMap && typeof parsed.charMap === "object") {
        const normalized = {};
        for (const [k, v] of Object.entries(parsed.charMap)) {
          if (!k || !v || typeof v !== "object") continue;
          const key = String(k);
          normalized[key] = {
            replacement: String(v.replacement ?? ""),
            enabled: v.enabled !== false,
          };
        }
        state.charMap = normalized;
      }

      if (Array.isArray(parsed.detectionPatterns)) {
        state.detectionPatterns = parsed.detectionPatterns
          .filter(Boolean)
          .map((pattern, index) => ({
            id: pattern.id || `rule-${Date.now()}-${index}`,
            type: pattern.type || "regex",
            source: pattern.source,
            enabled: pattern.enabled !== false,
            position:
              (pattern.position || "any") === "anywhere"
                ? "any"
                : pattern.position || "any",
            sensitivity: pattern.sensitivity || "mild",
          }));
      }
    }
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

  if (state.wordCountMode === "strict") {
    return tokens.length;
  }

  // Mild mode: ignore small function words
  const ignoreSet = new Set(
    state.mildIgnoreWords.map((word) => word.toLowerCase()),
  );
  return tokens.filter((tok) => !ignoreSet.has(tok.toLowerCase())).length;
}

function computeStats(text) {
  const chars = text.length;
  const lines = text ? text.split("\n").length : 0;
  const words = computeWordCount(text);
  return { words, lines, chars };
}

function renderStats(container, stats) {
  if (!state.statsVisible) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";
  const wordEl = container.querySelector(".stat:nth-child(1) .stat-value");
  const lineEl = container.querySelector(".stat:nth-child(2) .stat-value");
  const charEl = container.querySelector(".stat:nth-child(3) .stat-value");

  if (wordEl) wordEl.textContent = stats.words;
  if (lineEl) lineEl.textContent = stats.lines;
  if (charEl) charEl.textContent = stats.chars;
}

// ============================================================================
// CHARACTER SANITIZER
// ============================================================================

let charPattern = null;

function buildCharPattern() {
  const keys = Object.keys(state.charMap).filter(
    (k) => state.charMap[k].enabled,
  );

  if (!keys.length) {
    charPattern = null;
    return;
  }

  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  charPattern = new RegExp("[" + escaped.join("") + "]", "g");
}

function sanitizeCharacters(text) {
  if (!state.characterSanitizerEnabled || !charPattern) return text;

  return text.replace(charPattern, (ch) => {
    const cfg = state.charMap[ch];
    return cfg && cfg.enabled ? cfg.replacement : ch;
  });
}

function parseCharInput(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("\\u") && trimmed.length === 6) {
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
  const emojiPattern =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{2B55}]|[\u{200D}]|[\u{FE0F}]/gu;

  // Only remove emoji characters; do NOT collapse whitespace/newlines.
  return text.replace(emojiPattern, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// PHRASE REPLACER
// ============================================================================

let phraseRegex = null;

function buildPhraseRegex() {
  const keys = Object.keys(state.phraseMap).filter(
    (k) => state.phraseMap[k].enabled && k.trim().length,
  );

  if (!keys.length) {
    phraseRegex = null;
    return;
  }

  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = "\\b(" + escaped.join("|") + ")\\b";
  phraseRegex = new RegExp(pattern, "gi");
}

function applyPhraseReplacements(text) {
  if (!phraseRegex) return text;

  return text.replace(phraseRegex, (match) => {
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

  // Sensitivity behavior:
  // - strict: include both strict + mild patterns (more aggressive)
  // - mild: include only strict patterns (higher-confidence)
  const allowedSensitivities =
    state.detectionSensitivity === "mild"
      ? new Set(["strict"])
      : new Set(["strict", "mild"]);

  state.detectionPatterns
    .filter((p) => p && p.enabled)
    .filter((p) => (p.source || "").trim().length > 0)
    .filter((p) => allowedSensitivities.has(p.sensitivity || "mild"))
    .forEach((p) => {
      try {
        const positionRaw = p.position || "any";
        const position = positionRaw === "anywhere" ? "any" : positionRaw;
        compiledDetectionPatterns.push({
          id: p.id,
          sensitivity: p.sensitivity || "mild",
          position,
          re: new RegExp(p.source, "im"),
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

  return compiledDetectionPatterns.some((p) => {
    if (p.position === "start") {
      const match = startText.match(p.re);
      return !!match && match.index === 0;
    }
    if (p.position === "end") {
      const match = endText.match(p.re);
      return !!match && match.index + match[0].length === endText.length;
    }
    return p.re.test(text);
  });
}

function runDetection(text) {
  const aiFormat = detectAIFormat(text);
  state.aiFormatDetected = aiFormat;

  // Drive UI state from a single, consistent attribute.
  // Styles are keyed off body[data-ai-format="true"].
  if (aiFormat) {
    document.body.setAttribute("data-ai-detected", "true");
    DOM.root.setAttribute("data-ai-detected", "true");
  } else {
    document.body.removeAttribute("data-ai-detected");
    DOM.root.removeAttribute("data-ai-detected");
  }

  if (aiFormat && !state.aiFormatAcked) {
    document.body.setAttribute("data-ai-format", "true");
    DOM.root.setAttribute("data-ai-format", "true");
  } else {
    document.body.removeAttribute("data-ai-format");
    DOM.root.removeAttribute("data-ai-format");
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
  // Clear diff queue if input becomes empty
  if (!DOM.inputEl.value.trim()) {
    state.diffChangeQueue = [];
    state.diffProcessedChanges = {};
    state.diffDecisionMemory = {};
    if (state.diffModeEnabled) {
      closeDiffMode();
    }
  }

  // Clear existing timer
  clearTimeout(historyTimer);

  // Debounce history saving - only save after user stops typing for 500ms
  historyTimer = setTimeout(() => {
    const currentText = DOM.inputEl.value;

    // Only add to history if different from last history state
    if (historyIndex === -1 || inputHistory[historyIndex] !== currentText) {
      pushToHistory(currentText);
    }
  }, 500);

  renderOutputAndStats();
}

DOM.inputEl.addEventListener("input", onInputChange);

// ============================================================================
// TOOLBAR INTERACTIONS
// ============================================================================

function updateToolbarPills() {
  const pills = DOM.toolbar.querySelectorAll(".toolbar-pill");

  pills.forEach((pill) => {
    const feature = pill.dataset.feature;
    const statusEl = pill.querySelector(".pill-status");

    switch (feature) {
      case "characters":
        pill.classList.toggle("active", state.characterSanitizerEnabled);
        statusEl.textContent = state.characterSanitizerEnabled ? "ON" : "OFF";
        break;
      case "phrases":
        pill.classList.toggle("active", state.autoPhrasesEnabled);
        statusEl.textContent = state.autoPhrasesEnabled ? "Auto" : "Manual";
        break;
      case "stats":
        pill.classList.toggle("active", state.statsVisible);
        statusEl.textContent = state.statsVisible ? "ON" : "OFF";
        break;
      case "detection":
        pill.classList.toggle("active", state.detectionEnabled);
        statusEl.textContent = state.detectionEnabled ? "ON" : "OFF";
        break;
      case "emoji":
        pill.classList.toggle("active", state.emojiRemoverEnabled);
        statusEl.textContent = state.emojiRemoverEnabled ? "ON" : "OFF";
        break;
    }
  });
}

DOM.toolbar.addEventListener("click", (e) => {
  const pill = e.target.closest(".toolbar-pill");
  if (!pill) return;

  const feature = pill.dataset.feature;

  switch (feature) {
    case "characters":
      state.characterSanitizerEnabled = !state.characterSanitizerEnabled;
      buildCharPattern();
      break;
    case "phrases":
      state.autoPhrasesEnabled = !state.autoPhrasesEnabled;
      break;
    case "stats":
      state.statsVisible = !state.statsVisible;
      break;
    case "detection":
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
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled"));
}

function openSettings() {
  lastFocusedElement = document.activeElement;
  DOM.settingsOverlay.classList.add("open");
  DOM.settingsOverlay.setAttribute("aria-hidden", "false");
  const firstInput = DOM.settingsModal.querySelector("input, button");
  if (firstInput) firstInput.focus();
  // Set tab if needed
  setActiveTab(state.activeSettingsTab);
}

function closeSettings() {
  DOM.settingsOverlay.classList.remove("open");
  DOM.settingsOverlay.setAttribute("aria-hidden", "true");
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  } else {
    DOM.inputEl.focus();
  }
}

DOM.settingsBtn.addEventListener("click", openSettings);
DOM.closeSettingsBtn.addEventListener("click", closeSettings);

// Close on overlay click (not modal click)
DOM.settingsOverlay.addEventListener("click", (e) => {
  if (e.target === DOM.settingsOverlay) {
    closeSettings();
  }
});

// ============================================================================
// THEME TOGGLE
// ============================================================================

function applyTheme(theme) {
  state.theme = theme;
  document.body.setAttribute("data-theme", theme);
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.classList.toggle("active", theme === "light");
  }
  scheduleSave();
}

function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
}

if (DOM.themeToggleBtn) {
  DOM.themeToggleBtn.addEventListener("click", toggleTheme);
}

// Emoji Remover Button in Header
if (DOM.emojiToggleBtn) {
  DOM.emojiToggleBtn.addEventListener("click", () => {
    state.emojiRemoverEnabled = !state.emojiRemoverEnabled;
    updateToolbarPills();
    updateEmojiToggleButton();
    renderOutputAndStats();
    scheduleSave();
  });
}

// Diff Mode Button in Header
if (DOM.diffToggleBtn) {
  DOM.diffToggleBtn.addEventListener("click", () => {
    openDiffMode();
  });
}

if (DOM.closeDiffBtn) {
  DOM.closeDiffBtn.addEventListener("click", closeDiffMode);
}

if (DOM.diffApplyBtn) {
  DOM.diffApplyBtn.addEventListener("click", applyDiffChanges);
}

if (DOM.diffAcceptAllBtn) {
  DOM.diffAcceptAllBtn.addEventListener("click", () => {
    // Accept all remaining (pending) changes
    state.diffChangeQueue.forEach((changeId) =>
      setDecision(changeId, "accepted"),
    );
    state.diffChangeQueue = [];
    closeDiffMode();
    showToast("Accepted remaining changes");
  });
}

if (DOM.diffRejectAllBtn) {
  DOM.diffRejectAllBtn.addEventListener("click", () => {
    // Reject all remaining (pending) changes
    state.diffChangeQueue.forEach((changeId) =>
      setDecision(changeId, "rejected"),
    );
    state.diffChangeQueue = [];
    closeDiffMode();
    showToast("Rejected remaining changes");
  });
}

function updateDiffToggleButton() {
  if (!DOM.diffToggleBtn) return;
  DOM.diffToggleBtn.classList.toggle("active", state.diffModeEnabled);
}

function updateEmojiToggleButton() {
  if (!DOM.emojiToggleBtn) return;
  DOM.emojiToggleBtn.classList.toggle("active", state.emojiRemoverEnabled);
}

// ============================================================================
// COPY OUTPUT FUNCTIONALITY
// ============================================================================

function copyOutputToClipboard() {
  const outputText = DOM.outputEl.value;
  if (!outputText) {
    console.log("Output is empty");
    return;
  }

  navigator.clipboard
    .writeText(outputText)
    .then(() => {
      // Visual feedback
      const btn = DOM.copyOutputBtn;
      const originalTitle = btn.title;
      btn.classList.add("copied");
      btn.title = "Copied!";

      setTimeout(() => {
        btn.classList.remove("copied");
        btn.title = originalTitle;
      }, 1500);
    })
    .catch((err) => console.error("Failed to copy:", err));
}

if (DOM.copyOutputBtn) {
  DOM.copyOutputBtn.addEventListener("click", copyOutputToClipboard);
  // Keyboard shortcut: Ctrl+Shift+C
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyC") {
      e.preventDefault();
      copyOutputToClipboard();
    }
  });
}

// ============================================================================
// DIFF MODE FUNCTIONALITY
// ============================================================================

function openDiffMode() {
  // Check if input is empty
  if (!DOM.inputEl.value.trim()) {
    showToast("Input is empty — add text to review");
    return;
  }

  // Store original input for diff calculation
  state.diffOriginalInput = DOM.inputEl.value;

  // Diff review compares current input vs current output.
  const currentOutput = DOM.outputEl.value;
  state.diffChanges = calculateDiffHunks(
    state.diffOriginalInput,
    currentOutput,
  );

  // Queue holds only pending items. Default behavior is ACCEPTED unless explicitly rejected.
  state.diffProcessedChanges = {};
  for (const hunk of state.diffChanges) {
    const remembered = hunk.signatureKey
      ? state.diffDecisionMemory[hunk.signatureKey]
      : undefined;
    if (remembered === "accepted" || remembered === "rejected") {
      state.diffProcessedChanges[hunk.id] = { decision: remembered };
    }
  }

  state.diffChangeQueue = state.diffChanges
    .filter((h) => getDecision(h.id) === "pending")
    .map((h) => h.id);

  renderDiffView();

  // Show overlay
  state.diffModeEnabled = true;
  updateDiffToggleButton();
  DOM.diffOverlay.classList.add("open");
  DOM.diffOverlay.setAttribute("aria-hidden", "false");
}

function closeDiffMode() {
  state.diffModeEnabled = false;
  updateDiffToggleButton();
  DOM.diffOverlay.classList.remove("open");
  DOM.diffOverlay.setAttribute("aria-hidden", "true");
  if (DOM.diffContent) DOM.diffContent.innerHTML = "";
  state.diffChanges = [];
  state.diffChangeQueue = [];
  state.diffProcessedChanges = {};
}

// Close diff when clicking on overlay (outside modal)
if (DOM.diffOverlay) {
  DOM.diffOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.diffOverlay) {
      closeDiffMode();
    }
  });
}

function normalizeNewlines(text) {
  return String(text).replace(/\r\n/g, "\n");
}

function diffLinesLcs(aLines, bLines) {
  const N = aLines.length;
  const M = bLines.length;

  // LCS DP table: dp[i][j] = LCS length of aLines[i:] and bLines[j:]
  const dp = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(0));

  for (let i = N - 1; i >= 0; i--) {
    for (let j = M - 1; j >= 0; j--) {
      if (aLines[i] === bLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;

  while (i < N && j < M) {
    if (aLines[i] === bLines[j]) {
      ops.push({ type: "equal", line: aLines[i] });
      i++;
      j++;
      continue;
    }

    // Prefer deletes on ties to keep hunks stable.
    if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "delete", line: aLines[i] });
      i++;
    } else {
      ops.push({ type: "insert", line: bLines[j] });
      j++;
    }
  }

  while (i < N) {
    ops.push({ type: "delete", line: aLines[i] });
    i++;
  }

  while (j < M) {
    ops.push({ type: "insert", line: bLines[j] });
    j++;
  }

  const grouped = [];
  for (const op of ops) {
    const last = grouped[grouped.length - 1];
    if (last && last.type === op.type) {
      last.lines.push(op.line);
    } else {
      grouped.push({ type: op.type, lines: [op.line] });
    }
  }

  return grouped;
}

function calculateDiffHunks(originalText, processedText) {
  const originalNorm = normalizeNewlines(originalText);
  const processedNorm = normalizeNewlines(processedText);

  const aLines = originalNorm.split("\n");
  const bLines = processedNorm.split("\n");

  const ops = diffLinesLcs(aLines, bLines);

  const hunks = [];
  let ai = 0;
  let bi = 0;
  let current = null;

  const finalize = () => {
    if (!current) return;
    current.origEnd = ai;
    current.procEnd = bi;
    current.beforeLines = aLines.slice(current.origStart, current.origEnd);
    current.afterLines = bLines.slice(current.procStart, current.procEnd);
    current.beforeText = current.beforeLines.join("\n");
    current.afterText = current.afterLines.join("\n");

    current.origStartLine = current.origStart + 1;
    current.origEndLine = Math.max(current.origStart + 1, current.origEnd);

    if (current.beforeLines.length === 0 && current.afterLines.length > 0) {
      current.kind = "Insert";
    } else if (
      current.beforeLines.length > 0 &&
      current.afterLines.length === 0
    ) {
      current.kind = "Delete";
    } else {
      current.kind = "Modify";
    }

    current.signatureKey = makeDiffSignatureKey(current);

    hunks.push(current);
    current = null;
  };

  for (const op of ops) {
    if (op.type === "equal") {
      finalize();
      ai += op.lines.length;
      bi += op.lines.length;
      continue;
    }

    if (!current) {
      current = {
        id: `hunk-${hunks.length + 1}`,
        origStart: ai,
        procStart: bi,
        origEnd: ai,
        procEnd: bi,
        beforeLines: [],
        afterLines: [],
        beforeText: "",
        afterText: "",
        kind: "Modify",
        origStartLine: ai + 1,
        origEndLine: ai + 1,
      };
    }

    if (op.type === "delete") {
      ai += op.lines.length;
    } else if (op.type === "insert") {
      bi += op.lines.length;
    }
  }

  finalize();

  // Filter out empty hunks (shouldn't happen, but keep safe)
  return hunks.filter((h) => h.beforeText !== h.afterText);
}

function hashStringFNV1a(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

function makeDiffSignatureKey(hunk) {
  const kind = hunk.kind || "Modify";
  const before = normalizeNewlines(hunk.beforeText || "");
  const after = normalizeNewlines(hunk.afterText || "");
  return `${kind}:${hashStringFNV1a(kind + "\u0000" + before + "\u0000" + after)}`;
}

function getDecision(changeId) {
  const entry = state.diffProcessedChanges[changeId];
  return entry?.decision || "pending";
}

function setDecision(changeId, decision) {
  state.diffProcessedChanges[changeId] = { decision };

  const hunk = state.diffChanges.find((h) => h.id === changeId);
  if (hunk && hunk.signatureKey) {
    state.diffDecisionMemory[hunk.signatureKey] = decision;
  }

  // Remove from pending queue if present
  if (state.diffChangeQueue.includes(changeId)) {
    state.diffChangeQueue = state.diffChangeQueue.filter(
      (id) => id !== changeId,
    );
  }
}

function renderDiffView() {
  if (!DOM.diffContent) return;

  const pendingHunks = state.diffChanges.filter(
    (h) => getDecision(h.id) === "pending",
  );

  if (pendingHunks.length === 0) {
    if (state.diffChanges.length === 0) {
      DOM.diffContent.innerHTML =
        '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No changes detected.</p>';
    } else {
      DOM.diffContent.innerHTML =
        '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No pending changes — new changes will appear here when you edit the input.</p>';
    }
    return;
  }

  const total = state.diffChanges.length;
  const pending = state.diffChangeQueue.length;

  let rejected = 0;
  let acceptedExplicit = 0;
  for (const v of Object.values(state.diffProcessedChanges)) {
    if (v.decision === "rejected") rejected++;
    if (v.decision === "accepted") acceptedExplicit++;
  }

  const effectiveAccepted = total - rejected;

  let html = `
        <div id="diff-progress" style="padding: 1rem; background: var(--bg-surface-3); border-bottom: 1px solid var(--border-soft); font-size: 0.85rem; color: var(--text-muted);">
            <strong>Queue:</strong> ${pending} pending · ${total} total &nbsp;·&nbsp; <strong>Rejected:</strong> ${rejected} &nbsp;·&nbsp; <strong>Effective accepted:</strong> ${effectiveAccepted}/${total}
            <div style="margin-top: 0.35rem; font-size: 0.8rem;">
                Pending items are <strong>accepted by default</strong> unless you reject them.
            </div>
        </div>
    `;

  for (const change of pendingHunks) {
    const decision = getDecision(change.id);
    const isRejected = decision === "rejected";
    const isProcessed = decision !== "pending";

    const range =
      change.origEnd - change.origStart <= 1
        ? `L${change.origStartLine}`
        : `L${change.origStartLine}-${change.origEndLine}`;

    const statusLabel =
      decision === "pending"
        ? "• Pending (default accepted)"
        : decision === "rejected"
          ? "⊘ Rejected"
          : "✓ Accepted";

    const beforeBlock = change.beforeText.length
      ? escapeHtml(change.beforeText)
      : "(no lines)";
    const afterBlock = change.afterText.length
      ? escapeHtml(change.afterText)
      : "(no lines)";

    html += `
            <div class="diff-item ${isRejected ? "rejected" : ""} ${isProcessed ? "processed" : ""}" data-change-id="${change.id}">
                <div class="diff-item-header">
                    <span class="diff-item-source">${change.kind} · ${range}</span>
                    <div class="diff-item-actions">
                        <button class="diff-btn-accept" data-action="accept" data-change-id="${change.id}" title="Accept (keeps pipeline output)">✓ Accept</button>
                        <button class="diff-btn-reject" data-action="reject" data-change-id="${change.id}" title="Reject (keeps original input for this hunk)">✕ Reject</button>
                    </div>
                </div>
                <div class="diff-change">
                    <div class="diff-before">${beforeBlock}</div>
                    <div style="text-align: center; padding: 0.5rem; color: var(--text-muted);">→</div>
                    <div class="diff-after">${afterBlock}</div>
                </div>
                <div style="padding-top: 0.5rem; font-size: 0.75rem; text-align: right; color: var(--text-muted);">
                    ${statusLabel}
                </div>
            </div>
        `;
  }

  const prevScrollTop = DOM.diffContent.scrollTop;
  DOM.diffContent.innerHTML = html;
  DOM.diffContent.scrollTop = prevScrollTop;

  DOM.diffContent.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const changeId = btn.dataset.changeId;
      const action = btn.dataset.action;

      if (action === "reject") {
        setDecision(changeId, "rejected");
      } else {
        setDecision(changeId, "accepted");
      }

      renderDiffView();
    });
  });
}

function renderOutputFromText(outputText) {
  DOM.outputEl.value = outputText;
  state.currentText = outputText;

  const inputStats = computeStats(DOM.inputEl.value);
  const outputStats = computeStats(outputText);

  renderStats(DOM.inputStats, inputStats);
  renderStats(DOM.outputStats, outputStats);

  runDetection(outputText);
}

function applyDiffChanges() {
  if (!state.diffChanges.length) {
    closeDiffMode();
    return;
  }

  const originalNorm = normalizeNewlines(state.diffOriginalInput);
  let resultLines = originalNorm.split("\n");

  // Apply accepted hunks from the end so original indices remain valid.
  const hunksSorted = state.diffChanges
    .slice()
    .sort((a, b) => b.origStart - a.origStart || b.origEnd - a.origEnd);

  for (const hunk of hunksSorted) {
    const decision = getDecision(hunk.id);
    if (decision === "rejected") continue; // keep original for this hunk

    const deleteCount = hunk.origEnd - hunk.origStart;
    resultLines.splice(hunk.origStart, deleteCount, ...hunk.afterLines);
  }

  const resultText = resultLines.join("\n");
  renderOutputFromText(resultText);

  const rejectedCount = Object.values(state.diffProcessedChanges).filter(
    (v) => v.decision === "rejected",
  ).length;
  const effectiveAcceptedCount = state.diffChanges.length - rejectedCount;

  closeDiffMode();
  showToast(
    `Applied ${effectiveAcceptedCount} changes · Rejected ${rejectedCount} changes`,
  );
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================

function setActiveTab(tabId) {
  state.activeSettingsTab = tabId;

  // Update tab buttons
  document.querySelectorAll(".rail-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  // Update tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === `tab-${tabId}`);
  });
}

document.querySelectorAll(".rail-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveTab(btn.dataset.tab);
  });
});

// ============================================================================
// SETTINGS TAB: CHARACTER FIXER
// ============================================================================

DOM.charFixerToggle.addEventListener("change", (e) => {
  state.characterSanitizerEnabled = e.target.checked;
  buildCharPattern();
  renderOutputAndStats();
  scheduleSave();
});

function renderCharacterMappings() {
  DOM.charMappingsContainer.innerHTML = "";

  Object.entries(state.charMap).forEach(([char, config]) => {
    const row = document.createElement("tr");
    const displayValue = char === "\u00A0" ? "\\u00A0" : char;

    row.innerHTML = `
            <td><input type="text" class="table-input char-detect" value="${escapeHtml(displayValue)}" placeholder="Character"></td>
            <td><input type="text" class="table-input char-replacement" value="${escapeHtml(config.replacement)}" placeholder="Replacement"></td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="char-enabled" ${config.enabled ? "checked" : ""}>
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

    const detectInput = row.querySelector(".char-detect");
    const replacementInput = row.querySelector(".char-replacement");
    const enabledCheckbox = row.querySelector(".char-enabled");
    const deleteBtn = row.querySelector(".delete-button");

    detectInput.addEventListener("change", () => {
      const newChar = parseCharInput(detectInput.value);
      if (!newChar || newChar === char) return;
      state.charMap[newChar] = state.charMap[char];
      delete state.charMap[char];
      buildCharPattern();
      renderCharacterMappings();
      renderOutputAndStats();
      scheduleSave();
    });

    replacementInput.addEventListener("change", () => {
      state.charMap[char].replacement = replacementInput.value;
      buildCharPattern();
      renderOutputAndStats();
      scheduleSave();
    });

    enabledCheckbox.addEventListener("change", () => {
      state.charMap[char].enabled = enabledCheckbox.checked;
      buildCharPattern();
      renderOutputAndStats();
      scheduleSave();
    });

    deleteBtn.addEventListener("click", () => {
      delete state.charMap[char];
      buildCharPattern();
      renderCharacterMappings();
      renderOutputAndStats();
      scheduleSave();
    });
  });
}

const charAddBtn = document.querySelector("#tab-characters .add-button");
charAddBtn.addEventListener("click", () => {
  const char = prompt(
    "Enter character or escape sequence (e.g., —, …, \\u00A0):",
  );
  if (!char) return;

  const finalChar = parseCharInput(char);
  if (!finalChar) return;

  state.charMap[finalChar] = { replacement: "", enabled: true };
  buildCharPattern();
  renderCharacterMappings();
  scheduleSave();
});

// ============================================================================
// SETTINGS TAB: WORD FIXER
// ============================================================================

const phraseModeInputs = document.querySelectorAll('input[name="phrase-mode"]');
phraseModeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (!e.target.checked) return;
    state.autoPhrasesEnabled = e.target.value === "auto";
    buildPhraseRegex();
    renderOutputAndStats();
    updateToolbarPills();
    scheduleSave();
  });
});

// Set initial value
document.querySelector(
  `input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? "auto" : "manual"}"]`,
).checked = true;

function renderPhraseMappings() {
  DOM.phraseMappingsContainer.innerHTML = "";

  Object.entries(state.phraseMap).forEach(([phrase, config]) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td><input type="text" class="table-input phrase-detect" value="${escapeHtml(phrase)}" placeholder="Phrase"></td>
            <td><input type="text" class="table-input phrase-replacement" value="${escapeHtml(config.replacement)}" placeholder="Replacement"></td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="phrase-enabled" ${config.enabled ? "checked" : ""}>
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

    const detectInput = row.querySelector(".phrase-detect");
    const replacementInput = row.querySelector(".phrase-replacement");
    const enabledCheckbox = row.querySelector(".phrase-enabled");
    const deleteBtn = row.querySelector(".delete-button");

    detectInput.addEventListener("change", () => {
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

    replacementInput.addEventListener("change", () => {
      state.phraseMap[phrase].replacement = replacementInput.value;
      buildPhraseRegex();
      renderOutputAndStats();
      scheduleSave();
    });

    enabledCheckbox.addEventListener("change", () => {
      state.phraseMap[phrase].enabled = enabledCheckbox.checked;
      buildPhraseRegex();
      renderOutputAndStats();
      scheduleSave();
    });

    deleteBtn.addEventListener("click", () => {
      delete state.phraseMap[phrase];
      buildPhraseRegex();
      renderPhraseMappings();
      renderOutputAndStats();
      scheduleSave();
    });
  });
}

if (DOM.addPhraseBtn) {
  DOM.addPhraseBtn.addEventListener("click", () => {
    openPhraseDialog();
  });
}

// ============================================================================
// SETTINGS TAB: AI DETECTION
// ============================================================================

DOM.detectionToggle.addEventListener("change", (e) => {
  state.detectionEnabled = e.target.checked;
  renderOutputAndStats();
  updateToolbarPills();
  scheduleSave();
});

// Set initial detection toggle
DOM.detectionToggle.checked = state.detectionEnabled;

// Emoji Remover Toggle
if (DOM.emojiRemoverToggle) {
  DOM.emojiRemoverToggle.addEventListener("change", (e) => {
    state.emojiRemoverEnabled = e.target.checked;
    renderOutputAndStats();
    updateToolbarPills();
    scheduleSave();
  });

  // Set initial emoji toggle
  DOM.emojiRemoverToggle.checked = state.emojiRemoverEnabled;
}

function renderDetectionPatterns() {
  DOM.detectionPatternsContainer.innerHTML = "";

  state.detectionPatterns.forEach((pattern) => {
    const row = document.createElement("tr");
    if (!pattern.position) {
      pattern.position = "any";
    }
    if (pattern.position === "anywhere") {
      pattern.position = "any";
    }
    if (!pattern.sensitivity) {
      pattern.sensitivity = "mild";
    }
    const position = pattern.position;
    const sensitivity = pattern.sensitivity;

    row.innerHTML = `
            <td><input type="text" class="table-input pattern-input" value="${escapeHtml(pattern.source || "")}" placeholder="Regex pattern"></td>
            <td>
                <select class="table-input pattern-position">
                    <option value="start" ${position === "start" ? "selected" : ""}>Start</option>
                    <option value="end" ${position === "end" ? "selected" : ""}>End</option>
                    <option value="any" ${position === "any" ? "selected" : ""}>Any</option>
                </select>
            </td>
        <td>
          <select class="table-input pattern-sensitivity">
            <option value="strict" ${sensitivity === "strict" ? "selected" : ""}>Strict</option>
            <option value="mild" ${sensitivity === "mild" ? "selected" : ""}>Mild</option>
          </select>
        </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="pattern-enabled" ${pattern.enabled ? "checked" : ""}>
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

    const inputEl = row.querySelector(".pattern-input");
    const positionEl = row.querySelector(".pattern-position");
    const sensitivityEl = row.querySelector(".pattern-sensitivity");
    const enabledEl = row.querySelector(".pattern-enabled");
    const deleteBtn = row.querySelector(".delete-button");

    inputEl.addEventListener("change", () => {
      pattern.source = inputEl.value.trim();
      buildDetectionPatterns();
      renderOutputAndStats();
      scheduleSave();
    });

    positionEl.addEventListener("change", () => {
      pattern.position = positionEl.value;
      buildDetectionPatterns();
      renderOutputAndStats();
      scheduleSave();
    });

    sensitivityEl.addEventListener("change", () => {
      pattern.sensitivity = sensitivityEl.value;
      buildDetectionPatterns();
      renderOutputAndStats();
      scheduleSave();
    });

    enabledEl.addEventListener("change", () => {
      pattern.enabled = enabledEl.checked;
      buildDetectionPatterns();
      renderOutputAndStats();
      scheduleSave();
    });

    deleteBtn.addEventListener("click", () => {
      state.detectionPatterns = state.detectionPatterns.filter(
        (p) => p.id !== pattern.id,
      );
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
wordCountMode.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (e.target.checked) {
      state.wordCountMode = e.target.value;
      updateMildTagsVisibility();
      renderOutputAndStats();
      scheduleSave();
    }
  });
});

// Set initial value
document.querySelector(
  `input[name="wordcount-mode"][value="${state.wordCountMode}"]`,
).checked = true;

function updateMildTagsVisibility() {
  if (!DOM.mildTags) return;
  DOM.mildTags.style.display = state.wordCountMode === "mild" ? "flex" : "none";
}

function renderMildTags() {
  if (!DOM.tagList) return;
  DOM.tagList.innerHTML = "";
  state.mildIgnoreWords.forEach((word) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.innerHTML = `
            <span>${word}</span>
            <button type="button" aria-label="Remove ${word}">×</button>
        `;
    const removeBtn = tag.querySelector("button");
    removeBtn.addEventListener("click", () => {
      state.mildIgnoreWords = state.mildIgnoreWords.filter(
        (item) => item !== word,
      );
      renderMildTags();
      renderOutputAndStats();
      scheduleSave();
    });
    DOM.tagList.appendChild(tag);
  });
}

if (DOM.tagInput) {
  DOM.tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = DOM.tagInput.value.trim().replace(/,$/, "");
      if (!value) return;
      if (!state.mildIgnoreWords.includes(value)) {
        state.mildIgnoreWords.push(value);
        renderMildTags();
        renderOutputAndStats();
        scheduleSave();
      }
      DOM.tagInput.value = "";
    }
  });
}

// ============================================================================
// KEYBOARD SHORTCUTS DATA & DIALOG
// ============================================================================

const KEYBOARD_SHORTCUTS = [
  { action: "Undo", shortcut: "Ctrl + Z" },
  { action: "Redo", shortcut: "Ctrl + Y / Ctrl + Shift + Z" },
  { action: "Toggle Character Fixer", shortcut: "Alt + 1" },
  { action: "Apply/Toggle Phrases", shortcut: "Alt + 2" },
  { action: "Toggle Stats Visibility", shortcut: "Alt + 3" },
  { action: "Acknowledge Missed Copy", shortcut: "Alt + 4" },
  { action: "Toggle Emoji Remover", shortcut: "Q" },
  { action: "Open Diff Review", shortcut: "Ctrl + ↑" },
  { action: "Open/Close Settings", shortcut: "Alt + S / Ctrl + Shift + S" },
  { action: "Show Keyboard Shortcuts", shortcut: "⌘K / Ctrl + K" },
  { action: "Copy Output", shortcut: "Ctrl + Shift + C" },
  { action: "Clear Input", shortcut: "Ctrl + Shift + X" },
  { action: "Close Dialogs", shortcut: "Esc" },
];

function renderKeyboardShortcuts() {
  DOM.shortcutsTbody.innerHTML = "";
  KEYBOARD_SHORTCUTS.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.action}</td>
            <td>${item.shortcut}</td>
        `;
    DOM.shortcutsTbody.appendChild(row);
  });
}

function openKeyboardGuide() {
  DOM.keyboardDialog.classList.add("open");
  renderKeyboardShortcuts();
}

function closeKeyboardGuide() {
  DOM.keyboardDialog.classList.remove("open");
  DOM.inputEl.focus();
}

DOM.keyboardGuideBtn.addEventListener("click", openKeyboardGuide);
DOM.closeKeyboardBtn.addEventListener("click", closeKeyboardGuide);

// Close on overlay click (not modal click)
DOM.keyboardDialog.addEventListener("click", (e) => {
  if (e.target === DOM.keyboardDialog) {
    closeKeyboardGuide();
  }
});

// ============================================================================
// ADD PHRASE DIALOG
// ============================================================================

function openPhraseDialog() {
  if (!DOM.phraseDialog) return;
  DOM.phraseDialog.classList.add("open");
  DOM.phraseDialog.setAttribute("aria-hidden", "false");
  DOM.phraseInput.value = "";
  DOM.phraseReplacementInput.value = "";
  DOM.phraseInput.focus();
}

function closePhraseDialog() {
  if (!DOM.phraseDialog) return;
  DOM.phraseDialog.classList.remove("open");
  DOM.phraseDialog.setAttribute("aria-hidden", "true");
}

if (DOM.closePhraseDialogBtn) {
  DOM.closePhraseDialogBtn.addEventListener("click", closePhraseDialog);
}

if (DOM.cancelPhraseDialogBtn) {
  DOM.cancelPhraseDialogBtn.addEventListener("click", closePhraseDialog);
}

if (DOM.savePhraseDialogBtn) {
  DOM.savePhraseDialogBtn.addEventListener("click", () => {
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
  DOM.phraseDialog.addEventListener("click", (e) => {
    if (e.target === DOM.phraseDialog) closePhraseDialog();
  });
  DOM.phraseDialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePhraseDialog();
    }
    if (e.key === "Enter") {
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
  DOM.ruleDialog.classList.add("open");
  DOM.ruleDialog.setAttribute("aria-hidden", "false");
  DOM.rulePatternInput.value = "";
  DOM.rulePositionInput.value = "start";
  DOM.rulePatternInput.focus();
}

function closeRuleDialog() {
  if (!DOM.ruleDialog) return;
  DOM.ruleDialog.classList.remove("open");
  DOM.ruleDialog.setAttribute("aria-hidden", "true");
}

if (DOM.closeRuleDialogBtn) {
  DOM.closeRuleDialogBtn.addEventListener("click", closeRuleDialog);
}

if (DOM.cancelRuleDialogBtn) {
  DOM.cancelRuleDialogBtn.addEventListener("click", closeRuleDialog);
}

if (DOM.saveRuleDialogBtn) {
  DOM.saveRuleDialogBtn.addEventListener("click", () => {
    const pattern = DOM.rulePatternInput.value.trim();
    const position = DOM.rulePositionInput.value;
    if (!pattern) return;
    const id = `rule-${Date.now()}`;
    state.detectionPatterns.push({
      id,
      type: "regex",
      source: pattern,
      enabled: true,
      position,
      sensitivity: "strict",
    });
    buildDetectionPatterns();
    renderDetectionPatterns();
    renderOutputAndStats();
    scheduleSave();
    closeRuleDialog();
  });
}

if (DOM.ruleDialog) {
  DOM.ruleDialog.addEventListener("click", (e) => {
    if (e.target === DOM.ruleDialog) closeRuleDialog();
  });
  DOM.ruleDialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeRuleDialog();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      DOM.saveRuleDialogBtn.click();
    }
  });
}

if (DOM.addRuleBtn) {
  DOM.addRuleBtn.addEventListener("click", openRuleDialog);
}

// ============================================================================
// KEYBOARD SHORTCUTS HANDLER
// ============================================================================

function handleKeyboardShortcuts(e) {
  // Ctrl+Z - Undo
  if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }

  // Ctrl+Y or Ctrl+Shift+Z - Redo
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "y" || (e.key === "z" && e.shiftKey))
  ) {
    e.preventDefault();
    redo();
    return;
  }

  if (DOM.settingsOverlay.classList.contains("open") && e.key === "Tab") {
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
  if (e.ctrlKey && e.shiftKey && e.key === "C") {
    e.preventDefault();
    if (DOM.outputEl.value) {
      navigator.clipboard
        .writeText(DOM.outputEl.value)
        .then(() => {
          // Optional: add visual feedback later
        })
        .catch((err) => console.error("Failed to copy:", err));
    }
    return;
  }

  // Ctrl+Shift+X - Clear input
  if (e.ctrlKey && e.shiftKey && e.key === "X") {
    e.preventDefault();

    DOM.inputEl.value = "";
    renderOutputAndStats();
    return;
  }

  // Ctrl+Shift+S - Open settings
  if (e.ctrlKey && e.shiftKey && e.key === "S") {
    e.preventDefault();
    if (DOM.settingsOverlay.classList.contains("open")) {
      closeSettings();
    } else {
      openSettings();
    }
    return;
  }

  // Ctrl+UpArrow - Open diff mode
  if (e.ctrlKey && e.key === "ArrowUp") {
    e.preventDefault();
    openDiffMode();
    return;
  }

  // Cmd+K or Ctrl+K - Show keyboard shortcuts
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openKeyboardGuide();
    return;
  }

  // Alt + number keys
  if (e.altKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        state.characterSanitizerEnabled = !state.characterSanitizerEnabled;
        DOM.charFixerToggle.checked = state.characterSanitizerEnabled;
        buildCharPattern();
        renderOutputAndStats();
        updateToolbarPills();
        scheduleSave();
        break;

      case "2":
        e.preventDefault();
        if (e.shiftKey) {
          // Toggle auto mode
          state.autoPhrasesEnabled = !state.autoPhrasesEnabled;
          document.querySelector(
            `input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? "auto" : "manual"}"]`,
          ).checked = true;
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

      case "3":
        e.preventDefault();
        state.statsVisible = !state.statsVisible;
        renderOutputAndStats();
        updateToolbarPills();
        scheduleSave();
        break;

      case "4":
        e.preventDefault();
        state.aiFormatAcked = !state.aiFormatAcked;
        renderOutputAndStats();
        scheduleSave();
        break;

      case "s":
      case "S":
        e.preventDefault();
        if (DOM.settingsOverlay.classList.contains("open")) {
          closeSettings();
        } else {
          openSettings();
        }
        break;
    }
  }

  // Q - Toggle emoji remover (only when not typing in input)
  if (
    (e.key === "q" || e.key === "Q") &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey
  ) {
    const activeElement = document.activeElement;
    if (activeElement !== DOM.inputEl && activeElement !== DOM.outputEl) {
      e.preventDefault();
      DOM.emojiToggleBtn.click();
    }
  }

  // Escape - Close dialogs
  if (e.key === "Escape") {
    if (DOM.diffOverlay && DOM.diffOverlay.classList.contains("open")) {
      closeDiffMode();
    } else if (DOM.settingsOverlay.classList.contains("open")) {
      closeSettings();
    } else if (DOM.keyboardDialog.classList.contains("open")) {
      closeKeyboardGuide();
    }
  }
}

window.addEventListener("keydown", handleKeyboardShortcuts);

// ============================================================================
// INITIALIZATION
// ============================================================================

function initialize() {
  loadState();
  applyTheme(state.theme || "dark");

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
  const phraseMode = document.querySelector(
    `input[name="phrase-mode"][value="${state.autoPhrasesEnabled ? "auto" : "manual"}"]`,
  );
  if (phraseMode) phraseMode.checked = true;
  const wordMode = document.querySelector(
    `input[name="wordcount-mode"][value="${state.wordCountMode}"]`,
  );
  if (wordMode) wordMode.checked = true;

  updateToolbarPills();

  // Initialize undo history with empty state
  pushToHistory(DOM.inputEl.value);

  // Trigger initial render
  renderOutputAndStats();
}

// Call initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initialize);
