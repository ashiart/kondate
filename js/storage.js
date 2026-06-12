/* =====================================================
   献立メーカー：LocalStorage読み書き
   保存・読み込みは必ずこのファイルの関数を経由する
   ===================================================== */

// 保存に使うキーの一覧（kondate_ プレフィックスで統一）
const STORAGE_KEYS = {
  version: "kondate_version",
  exclude: "kondate_exclude", // 除外設定 { ingredients: [], tags: [] }
  favorites: "kondate_favorites", // お気に入りの料理ID [ "d001", ... ]
  hidden: "kondate_hidden", // 非表示 [ { id, until } ] until=null はずっと
  customDishes: "kondate_customDishes", // オリジナル料理の配列
  history: "kondate_history", // 採用履歴 [ { date, dishes: [...] } ]
};

// データ形式のバージョン（将来、形式を変えるときの移行判定に使う）
const DATA_VERSION = 1;

// 履歴の保存上限（古いものから自動削除）
const HISTORY_LIMIT = 100;

/* ---------- 日付ユーティリティ ---------- */

// 今日の日付を "YYYY-MM-DD" 形式で返す（端末のローカル日付）
function todayStr() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

// 今日から days 日後の日付を "YYYY-MM-DD" 形式で返す
function dateStrAfterDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

/* ---------- 基本の読み書き ---------- */

// 読み込み。データが無い・壊れている・使えない場合は fallback を返す
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// 保存。プライベートブラウズ等で保存できない場合も画面を止めない
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // 保存できない環境では「その場では使えるが記憶されない」動作になる
  }
}

/* ---------- 除外設定 ---------- */

function loadExclude() {
  const saved = loadFromStorage(STORAGE_KEYS.exclude, null);
  // 項目が欠けていても必ず両方の配列が揃った形で返す
  return {
    ingredients: (saved && saved.ingredients) || [],
    tags: (saved && saved.tags) || [],
  };
}

function saveExclude(exclude) {
  saveToStorage(STORAGE_KEYS.exclude, exclude);
}

/* ---------- お気に入り ---------- */

function loadFavorites() {
  return loadFromStorage(STORAGE_KEYS.favorites, []);
}

function saveFavorites(favorites) {
  saveToStorage(STORAGE_KEYS.favorites, favorites);
}

/* ---------- 非表示 ---------- */

// 期限切れ（7日経過）のものは読み込み時に取り除く＝自動復帰
function loadHidden() {
  const saved = loadFromStorage(STORAGE_KEYS.hidden, []);
  const today = todayStr();
  const valid = saved.filter(
    (h) => h && h.id && (h.until === null || h.until > today)
  );
  if (valid.length !== saved.length) {
    saveToStorage(STORAGE_KEYS.hidden, valid);
  }
  return valid;
}

function saveHidden(hidden) {
  saveToStorage(STORAGE_KEYS.hidden, hidden);
}

/* ---------- オリジナル料理 ---------- */

function loadCustomDishes() {
  return loadFromStorage(STORAGE_KEYS.customDishes, []);
}

function saveCustomDishes(customDishes) {
  saveToStorage(STORAGE_KEYS.customDishes, customDishes);
}

/* ---------- 採用履歴 ---------- */

function loadHistory() {
  return loadFromStorage(STORAGE_KEYS.history, []);
}

// 1日1献立として記録する（同じ日に決め直したら上書き）
function addHistoryEntry(entry) {
  let history = loadHistory().filter((h) => h.date !== entry.date);
  history.push(entry);
  if (history.length > HISTORY_LIMIT) {
    history = history.slice(-HISTORY_LIMIT);
  }
  saveToStorage(STORAGE_KEYS.history, history);
}

/* ---------- 初期化 ---------- */

// バージョン記録（初回アクセス時に書き込む）
function initStorage() {
  if (loadFromStorage(STORAGE_KEYS.version, null) === null) {
    saveToStorage(STORAGE_KEYS.version, DATA_VERSION);
  }
}
