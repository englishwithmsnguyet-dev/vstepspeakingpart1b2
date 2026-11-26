#!/usr/bin/env node
/**
 * Kiểm duyệt tự động từ vựng C1/C2 học thuật, lỗi lặp từ & cú pháp cho script.js
 * Chạy: node check_vocab.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const scriptPath = path.join(__dirname, "script.js");
if (!fs.existsSync(scriptPath)) {
  console.error("Không tìm thấy script.js tại:", scriptPath);
  process.exit(1);
}

const code = fs.readFileSync(scriptPath, "utf8");

// 1. Kiểm tra cú pháp JS
try {
  new vm.Script(code, { filename: "script.js" });
} catch (err) {
  console.error("❌ LỖI CÚ PHÁP trong script.js:", err.message);
  process.exit(1);
}

// 2. Nạp practiceTopicsData trong sandbox ảo
const startTag = "const practiceTopicsData = [";
const endTag = "window.practiceTopicsData = practiceTopicsData;";
const startIdx = code.indexOf(startTag);
const endIdx = code.indexOf(endTag);
if (startIdx === -1 || endIdx === -1) {
  console.error("❌ Không tìm thấy mảng practiceTopicsData trong script.js");
  process.exit(1);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code.substring(startIdx, endIdx) + "\nthis.topics = practiceTopicsData;", sandbox);
const topics = sandbox.topics;

// 3. Danh sách đen từ C1/C2/học thuật/văn viết không phù hợp văn nói Speaking Part 1
const BANNED_C1_WORDS = [
  "alleviate", "mitigate", "exacerbate", "ameliorate", "inculcate", "facilitate", "utilize", "utilizing",
  "commence", "endeavor", "perpetuate", "rejuvenate", "rejuvenated", "revitalize", "revitalizing",
  "augment", "diminish", "curb", "curbing", "eradicate", "bolster", "harness", "transcend", "undermine",
  "jeopardize", "impede", "advocate", "advocates", "contend", "epitomize", "underscore", "elicit", "evoke",
  "instill", "impart", "procure", "scrutinize", "contemplate", "contemplative", "contemplating", "delve",
  "savor", "savoring", "relinquish", "refrain", "abstain", "proliferate", "dwindle", "deteriorate",
  "deplete", "squander", "economize", "disseminate", "articulate", "discern", "envision", "traverse",
  "circumvent", "surmount", "succumb", "withstand", "persevere", "gravitate", "hone", "honing", "attain",
  "foster", "cultivate", "nurture", "slash", "accommodating", "predominantly", "overwhelmingly",
  "substantially", "remarkably", "exceptionally", "exceptional", "extraordinarily", "tremendously",
  "profoundly", "utterly", "wholly", "invariably", "undeniably", "indisputably", "unquestionably",
  "unequivocally", "wholeheartedly", "inherently", "intrinsically", "seamlessly", "effortlessly",
  "meticulously", "diligently", "conscientiously", "proactively", "swiftly", "drastically", "eloquently",
  "adeptly", "seldom", "paramount", "pivotal", "indispensable", "imperative", "detrimental", "deleterious",
  "adverse", "formidable", "arduous", "grueling", "strenuous", "monotonous", "mundane", "negligible",
  "immense", "colossal", "monumental", "profound", "intricate", "sophisticated", "sophistication",
  "nuanced", "multifaceted", "exhaustive", "rigorous", "rigorously", "stringent", "meticulous", "tenacious",
  "resilient", "adept", "proficient", "astute", "visionary", "groundbreaking", "transformative",
  "unprecedented", "ubiquitous", "pervasive", "prevalent", "rampant", "innate", "inherent", "intrinsic",
  "tangible", "intangible", "lucrative", "viable", "feasible", "pragmatic", "conducive", "advantageous",
  "wholesome", "scrumptious", "delectable", "exquisite", "impeccable", "pristine", "serene", "tranquil",
  "idyllic", "boisterous", "turbulent", "volatile", "sporadic", "perpetual", "incessant", "relentless",
  "unwavering", "steadfast", "ardent", "fervent", "avid", "poignant", "melancholic", "apprehensive",
  "skeptical", "ambivalent", "complacent", "oblivious", "susceptible", "ergonomic", "state-of-the-art",
  "affluent", "exorbitant", "prohibitive", "extravagant", "lavish", "frugal", "cognitive", "neurological",
  "neuroplasticity", "physiological", "metabolic", "cardiovascular", "hypertension", "sedentary",
  "holistic", "cross-disciplinary", "subsidized", "metropolitan", "potent", "laden", "excessive sodium",
  "saturated fats", "nutrient-rich", "optimal", "unmatched", "delightfully", "character-building",
  "non-negotiable", "myriad", "plethora", "multitude", "dearth", "repercussion", "ramification", "catalyst",
  "impetus", "deterrent", "impediment", "predicament", "paradigm", "trajectory", "realm", "cornerstone",
  "bedrock", "hallmark", "testament", "epitome", "pinnacle", "acumen", "prowess", "ingenuity", "fortitude",
  "grit", "perseverance", "tenacity", "resilience", "demeanor", "disposition", "propensity", "proclivity",
  "penchant", "camaraderie", "solidarity", "cohesion", "altruism", "prestige", "stigma", "ethos", "solitude",
  "alienation", "monotony", "drudgery", "lethargy", "gratification", "fulfillment", "serenity", "tranquility",
  "longevity", "vitality", "gridlock", "merchandise", "expenditure", "pedagogy", "eloquence", "craftsmanship",
  "artistry", "aesthetic", "gastronomy", "gastronomic", "standpoint", "counterpart", "aficionado",
  "connoisseur", "confidant", "kinship", "remembrance", "recollection", "sentiments", "keepsakes",
  "alleyways", "output", "embarked", "quietude", "engrossed", "philanthropic", "plummeting", "inadvertently",
  "relish", "abreast", "indigenous", "invigorated", "invigorating", "multidimensional", "claustrophobic",
  "meteorological", "non-compliance", "sensationalized", "commemorative", "socio-economic", "peer-reviewed",
  "interpersonal", "boundless", "establishments", "non-intrusive", "accountability", "eco-consciousness",
  "non-biodegradable", "tedious", "commendable", "palate", "vistas", "glitches", "panoramic", "superficial",
  "deafening", "stifling", "yearn", "sanctuary", "enacted", "exert", "wither", "daunting", "hampers",
  "stems from", "empirical", "caliber", "regrettably", "pampered", "poised", "vividly", "bask", "expedition",
  "fleeting", "indelible", "flourish", "plagiarism", "portrays", "empathize"
];

const bannedRe = new RegExp(
  "\\b(" + BANNED_C1_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "gi"
);
const dupRe = /\b(very|really|super|great|the|to|and|of|in|for|with|is|are|easily|greatly)\s+\1\b/gi;
const badGrammarRe = /\b(helps people clear my mind|save time really\.|save money really\.|an (really|very|big|huge|great|peaceful|calm|stylish|comfortable|healthy|delicious|good))\b/gi;

const errors = [];

for (const t of topics) {
  for (const q of (t.questions || [])) {
    const fields = [
      { label: "formula", val: (q.formula || "").replace(/<[^>]+>/g, " ") },
      ...(q.vocabGroups || []).flatMap(vg =>
        (vg.items || []).map(it => ({ label: "vocab", val: it.en || "" }))
      ),
      ...(q.samples || []).flatMap((s, i) => [
        { label: `sample${i + 1}.text`, val: s.text || "" },
        { label: `sample${i + 1}.formatted`, val: (s.formatted || "").replace(/<[^>]+>/g, " ") }
      ])
    ];

    for (const f of fields) {
      const m = f.val.match(bannedRe);
      if (m) {
        errors.push(`Chủ đề ${t.id} (${t.title}) | Q${q.qNum} [${f.label}]: chứa từ C1/học thuật -> ${[...new Set(m.map(x => x.toLowerCase()))].join(", ")}`);
      }
      const d = f.val.match(dupRe);
      if (d) {
        errors.push(`Chủ đề ${t.id} (${t.title}) | Q${q.qNum} [${f.label}]: lặp từ -> ${d.join(", ")}`);
      }
      const g = f.val.match(badGrammarRe);
      if (g) {
        errors.push(`Chủ đề ${t.id} (${t.title}) | Q${q.qNum} [${f.label}]: lỗi diễn đạt/ngữ pháp -> ${g.join(", ")}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ PHÁT HIỆN ${errors.length} LỖI TỪ VỰNG C1 / DIỄN ĐẠT TRONG ${path.basename(__dirname)}/script.js:\n`);
  errors.forEach(e => console.error("  - " + e));
  console.error("\n👉 Vui lòng thay bằng từ vựng văn nói tự nhiên (B1/B2) rồi chạy lại: node check_vocab.js\n");
  process.exit(1);
}

console.log(`✅ PASS! Đã kiểm duyệt ${topics.length} chủ đề trong ${path.basename(__dirname)}/script.js — 0 từ C1/học thuật, cú pháp JS chuẩn.`);
process.exit(0);
