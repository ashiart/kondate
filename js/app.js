/* =====================================================
   献立メーカー：画面切替・抽選・お気に入り・非表示・
   オリジナル料理・採用履歴
   ===================================================== */

// カテゴリの定義（表示順もこの順）
const CATEGORIES = ["主菜", "副菜", "汁物"];

// カテゴリごとのバッジ色クラス
const CATEGORY_CLASS = {
  主菜: "main",
  副菜: "side",
  汁物: "soup",
};

// 各項目の選択肢（フォームと除外設定で使う）
const INGREDIENT_OPTIONS = [
  "鶏肉",
  "豚肉",
  "牛肉",
  "魚",
  "豆腐",
  "卵",
  "野菜",
  "その他",
];
const COOKTIME_OPTIONS = ["15分以内", "30分以内", "30分超"];
const TASTE_OPTIONS = [
  "塩",
  "醤油",
  "味噌",
  "カレー",
  "トマト",
  "バター",
  "マヨネーズ",
  "甘辛",
  "辛味",
  "その他",
];
const GENRE_OPTIONS = ["和", "洋", "中", "その他"];

// ジャンルの表示名（「中風」と表示されないようにする）
const GENRE_LABEL = {
  和: "和風",
  洋: "洋風",
  中: "中華",
  その他: "その他",
};

// 各調理時間フィルタで許可する調理時間
const TIME_ALLOW = {
  "15分以内": ["15分以内"],
  "30分以内": ["15分以内", "30分以内"],
};

/* ---------- 状態 ---------- */

// 現在表示中の献立（カテゴリ名 → 料理オブジェクト or null）
// null は「候補が1件もなかった」ことを表す
const currentMenu = {};

// このセッション（ページを開いてから）で表示済みの料理ID。
// 候補が一巡するまで同じ料理を出さないために使う
const shownIds = {};
CATEGORIES.forEach((c) => {
  shownIds[c] = new Set();
});

// 一度でも「献立を提案する」を押したか
let hasSuggested = false;

// 調理時間フィルタ（"" = 指定なし。今日の気分で選ぶものなので保存しない）
let timeFilter = "";

// LocalStorageから復元する設定・データ（変更のたびに保存する）
let exclude = loadExclude();
let favorites = loadFavorites();
let hidden = loadHidden();
let customDishes = loadCustomDishes();

// 料理リストで表示中のカテゴリ（"すべて" or カテゴリ名）
let listCategory = "すべて";

// 料理リストでお気に入りだけを表示中か
let listFavoritesOnly = false;

// フォームで編集中の料理ID（null = 新規追加）
let editingDishId = null;

/* ---------- 料理データの参照 ---------- */

// 初期データ＋オリジナル料理の全料理
function allDishes() {
  return DISHES.concat(customDishes);
}

function findDish(id) {
  return allDishes().find((d) => d.id === id);
}

// オリジナル料理かどうか（IDの先頭で見分ける）
function isCustom(id) {
  return id.startsWith("u");
}

function isFavorite(id) {
  return favorites.includes(id);
}

// 非表示中ならその設定（{id, until}）を返す
function hiddenEntry(id) {
  return hidden.find((h) => h.id === id);
}

/* ---------- 抽選ロジック ---------- */

// 料理が現在の条件（調理時間・除外設定・非表示）を満たすか
function matchesConditions(dish) {
  // 非表示中の料理は出さない
  if (hiddenEntry(dish.id)) return false;
  // 調理時間：フィルタ指定中は、時間が分からない料理も出さない
  // （「15分以内」と言われて時間不明の料理が出ると信頼できないため）
  if (timeFilter && !TIME_ALLOW[timeFilter].includes(dish.cookTime)) {
    return false;
  }
  // 主材料の除外
  if (dish.ingredient && exclude.ingredients.includes(dish.ingredient)) {
    return false;
  }
  // タグの除外（1つでも該当したら出さない）
  if ((dish.tags || []).some((t) => exclude.tags.includes(t))) {
    return false;
  }
  return true;
}

// 指定カテゴリの候補一覧を返す
function candidatesOf(category) {
  return allDishes().filter(
    (d) => d.category === category && matchesConditions(d)
  );
}

// 指定カテゴリから1品選ぶ。候補ゼロなら null
function pickDish(category) {
  const candidates = candidatesOf(category);
  if (candidates.length === 0) return null;

  // まだ表示していない料理を優先。一巡したらリセットして全候補に戻す
  let pool = candidates.filter((d) => !shownIds[category].has(d.id));
  if (pool.length === 0) {
    shownIds[category].clear();
    pool = candidates;
  }

  // いま表示中の料理は避ける（ほかに選択肢がある場合のみ）
  const current = currentMenu[category];
  if (current && pool.length > 1) {
    pool = pool.filter((d) => d.id !== current.id);
  }

  const dish = pool[Math.floor(Math.random() * pool.length)];
  shownIds[category].add(dish.id);
  return dish;
}

// 献立ぜんぶを提案（初回提案・全体再抽選）
function suggestAll() {
  hasSuggested = true;
  CATEGORIES.forEach((c) => {
    currentMenu[c] = pickDish(c);
  });
  renderCards();
}

// 1品だけ再抽選
function rerollOne(category) {
  currentMenu[category] = pickDish(category);
  renderCards();
}

/* ---------- お気に入り ---------- */

function toggleFavorite(id) {
  const i = favorites.indexOf(id);
  if (i >= 0) {
    favorites.splice(i, 1);
  } else {
    favorites.push(id);
  }
  saveFavorites(favorites);
}

/* ---------- 非表示 ---------- */

// days を指定すると期限つき（7日間など）、null なら「ずっと」
function hideDish(id, days) {
  hidden = hidden.filter((h) => h.id !== id);
  hidden.push({ id: id, until: days ? dateStrAfterDays(days) : null });
  saveHidden(hidden);
}

function unhideDish(id) {
  hidden = hidden.filter((h) => h.id !== id);
  saveHidden(hidden);
}

/* ---------- 採用履歴 ---------- */

// 「この献立にする」：表示中の献立をスナップショットで記録する。
// 料理があとで編集・削除されても履歴が壊れないように複製して保存する
function adoptMenu() {
  const dishes = CATEGORIES.map((c) => currentMenu[c])
    .filter(Boolean)
    .map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      taste: d.taste || "",
      genre: d.genre || "",
    }));
  if (dishes.length === 0) return;
  addHistoryEntry({ date: todayStr(), dishes: dishes });
  showToast("今日の献立に決めました！");
}

/* ---------- オリジナル料理の追加・編集・削除 ---------- */

function deleteCustomDish(id) {
  customDishes = customDishes.filter((d) => d.id !== id);
  saveCustomDishes(customDishes);
  // この料理を指しているお気に入り・非表示も掃除する
  favorites = favorites.filter((f) => f !== id);
  saveFavorites(favorites);
  hidden = hidden.filter((h) => h.id !== id);
  saveHidden(hidden);
  // 提案画面に表示中なら別の料理に置き換える
  CATEGORIES.forEach((c) => {
    if (currentMenu[c] && currentMenu[c].id === id) {
      currentMenu[c] = pickDish(c);
    }
  });
}

/* ---------- 描画ユーティリティ ---------- */

// HTMLに埋め込む文字列を無害化する（オリジナル料理名なども安全に表示）
function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 料理の補足情報（主材料・調理時間・味付け・ジャンル）を1行にまとめる
function metaLine(dish) {
  const parts = [];
  if (dish.ingredient) parts.push(dish.ingredient);
  if (dish.cookTime) parts.push(dish.cookTime);
  // 味付けには「味」を付けて表示する（「辛味」のように既に付いていればそのまま）
  if (dish.taste) {
    parts.push(dish.taste.endsWith("味") ? dish.taste : dish.taste + "味");
  }
  if (dish.genre) parts.push(GENRE_LABEL[dish.genre] || dish.genre);
  return parts.join("・");
}

// 一言メッセージを画面下部に表示
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2000);
}

/* ---------- 描画：提案画面 ---------- */

function cardHtml(category) {
  const dish = currentMenu[category];
  const badge = `<span class="category-badge ${CATEGORY_CLASS[category]}">${category}</span>`;

  let favBtn = "";
  let body = "";

  if (!hasSuggested) {
    body = `<p class="dish-name is-empty">下のボタンを押すと提案します</p>`;
  } else if (dish === null || dish === undefined) {
    body = `<p class="dish-name is-empty">条件に合う${category}がありません。料理を追加するか、条件を変えてください。</p>`;
  } else {
    const fav = isFavorite(dish.id);
    favBtn = `<button class="btn-fav ${fav ? "is-on" : ""}"
      data-fav="${dish.id}" type="button">${fav ? "★" : "☆"}</button>`;
    const meta = metaLine(dish);
    const tags = (dish.tags || [])
      .map((t) => `<span class="tag-chip">${esc(t)}</span>`)
      .join("");
    body = `
      <p class="dish-name">${esc(dish.name)}</p>
      ${meta ? `<p class="dish-meta">${esc(meta)}</p>` : ""}
      ${tags ? `<div class="dish-tags">${tags}</div>` : ""}
      <div class="card-actions">
        <button class="btn-reroll" type="button" data-reroll="${category}">
          🔄 この1品だけ変える
        </button>
        <button class="btn-hide7" type="button"
          data-hide7="${dish.id}" data-cat="${category}">
          7日間出さない
        </button>
      </div>
    `;
  }

  return `
    <div class="menu-card">
      <div class="card-header">${badge}${favBtn}</div>
      ${body}
    </div>
  `;
}

function renderCards() {
  const container = document.getElementById("menu-cards");
  container.innerHTML = CATEGORIES.map((c) => cardHtml(c)).join("");

  // 提案後はボタンの文言を変え、「この献立にする」を出す
  document.getElementById("btn-suggest").textContent = hasSuggested
    ? "🔄 ぜんぶ変える"
    : "献立を提案する";
  document
    .getElementById("btn-adopt")
    .classList.toggle("is-hidden", !hasSuggested);
}

/* ---------- 描画：料理リスト ---------- */

function renderListCategoryFilter() {
  const options = ["すべて"].concat(CATEGORIES);
  const chips = options.map(
    (c) => `<button class="chip ${listCategory === c ? "is-active" : ""}"
      data-list-category="${c}" type="button">${c}</button>`
  );
  // お気に入りだけ表示の切り替えチップ（カテゴリと組み合わせ可）
  chips.push(
    `<button class="chip chip-fav ${listFavoritesOnly ? "is-active" : ""}"
      data-list-fav type="button">★ お気に入り</button>`
  );
  document.getElementById("list-category-filter").innerHTML = chips.join("");
}

function renderDishList() {
  renderListCategoryFilter();

  const dishes = allDishes().filter(
    (d) =>
      (listCategory === "すべて" || d.category === listCategory) &&
      (!listFavoritesOnly || isFavorite(d.id))
  );

  if (dishes.length === 0) {
    document.getElementById("dish-list").innerHTML = listFavoritesOnly
      ? `<p class="section-note">お気に入りはまだありません。</p>`
      : `<p class="section-note">料理がありません。</p>`;
    return;
  }

  document.getElementById("dish-list").innerHTML = dishes
    .map((d) => {
      const states = [];
      if (isFavorite(d.id)) states.push(`<span class="row-star">★</span>`);
      if (hiddenEntry(d.id))
        states.push(`<span class="state-chip">非表示中</span>`);
      if (isCustom(d.id))
        states.push(`<span class="state-chip custom">オリジナル</span>`);
      const meta = metaLine(d);
      return `
        <button class="dish-row" data-dish="${d.id}" type="button">
          <span class="dish-row-main">
            <span class="dish-row-name">${esc(d.name)}</span>
            ${meta ? `<span class="dish-row-meta">${esc(meta)}</span>` : ""}
          </span>
          <span class="dish-row-state">${states.join("")}</span>
        </button>
      `;
    })
    .join("");
}

/* ---------- 描画：料理の詳細モーダル ---------- */

function openDishModal(id) {
  const dish = findDish(id);
  if (!dish) return;

  const meta = metaLine(dish);
  const tags = (dish.tags || [])
    .map((t) => `<span class="tag-chip">${esc(t)}</span>`)
    .join("");
  const fav = isFavorite(id);
  const hiddenNow = hiddenEntry(id);

  const actions = [];
  actions.push(
    `<button class="modal-action" data-act="fav" type="button">
       ${fav ? "★ お気に入りを解除" : "☆ お気に入りに追加"}</button>`
  );
  if (hiddenNow) {
    actions.push(
      `<button class="modal-action" data-act="unhide" type="button">
         提案に出すようにもどす</button>`
    );
  } else {
    actions.push(
      `<button class="modal-action" data-act="hide7" type="button">
         7日間出さない</button>`,
      `<button class="modal-action" data-act="hide-forever" type="button">
         ずっと出さない</button>`
    );
  }
  if (isCustom(id)) {
    actions.push(
      `<button class="modal-action" data-act="edit" type="button">
         ✏️ 編集する</button>`
    );
  }
  actions.push(
    `<button class="modal-action close" data-act="close" type="button">
       閉じる</button>`
  );

  document.getElementById("modal-dish-body").innerHTML = `
    <h2 class="modal-dish-name" data-dish-id="${id}">${esc(dish.name)}</h2>
    ${meta ? `<p class="dish-meta">${esc(meta)}</p>` : ""}
    ${tags ? `<div class="dish-tags">${tags}</div>` : ""}
    ${
      hiddenNow
        ? `<p class="section-note">いまは提案に出ない設定です（${
            hiddenNow.until ? "7日間" : "ずっと"
          }）。</p>`
        : ""
    }
    <div class="modal-actions">${actions.join("")}</div>
  `;
  document.getElementById("modal-dish").classList.add("is-open");
}

function closeDishModal() {
  document.getElementById("modal-dish").classList.remove("is-open");
}

/* ---------- 描画：追加・編集フォーム ---------- */

function fillSelect(selectId, options) {
  document.getElementById(selectId).innerHTML =
    `<option value="">未設定</option>` +
    options.map((o) => `<option value="${o}">${o}</option>`).join("");
}

// 全料理からタグを集めて重複を除く（オリジナル料理のタグも自動で並ぶ）
function collectTags() {
  const tags = new Set();
  allDishes().forEach((d) => (d.tags || []).forEach((t) => tags.add(t)));
  return [...tags].sort();
}

function openDishForm(id) {
  editingDishId = id;
  const dish = id ? findDish(id) : null;

  document.getElementById("form-title").textContent = dish
    ? "料理を編集"
    : "料理を追加";
  document.getElementById("form-name").value = dish ? dish.name : "";

  // カテゴリチップ（1つだけ選択）
  const selectedCategory = dish ? dish.category : "";
  document.getElementById("form-category").innerHTML = CATEGORIES.map(
    (c) => `<button class="chip ${c === selectedCategory ? "is-active" : ""}"
      data-form-category="${c}" type="button">${c}</button>`
  ).join("");

  // 詳細項目
  fillSelect("form-ingredient", INGREDIENT_OPTIONS);
  fillSelect("form-cooktime", COOKTIME_OPTIONS);
  fillSelect("form-taste", TASTE_OPTIONS);
  fillSelect("form-genre", GENRE_OPTIONS);
  document.getElementById("form-ingredient").value = dish
    ? dish.ingredient || ""
    : "";
  document.getElementById("form-cooktime").value = dish
    ? dish.cookTime || ""
    : "";
  document.getElementById("form-taste").value = dish ? dish.taste || "" : "";
  document.getElementById("form-genre").value = dish ? dish.genre || "" : "";

  // タグチップ（複数選択可）＋新規タグ入力
  const dishTags = dish ? dish.tags || [] : [];
  document.getElementById("form-tags").innerHTML = collectTags()
    .map(
      (t) => `<button class="chip ${dishTags.includes(t) ? "is-active" : ""}"
        data-form-tag="${esc(t)}" type="button">${esc(t)}</button>`
    )
    .join("");
  document.getElementById("form-newtags").value = "";

  // 詳細が入っている料理を編集するときは折りたたみを開いておく
  document.getElementById("form-details").open = Boolean(
    dish &&
      (dish.ingredient || dish.cookTime || dish.taste || dish.genre ||
        dishTags.length > 0)
  );

  // 削除ボタンは編集時のみ
  document
    .getElementById("btn-form-delete")
    .classList.toggle("is-hidden", !dish);

  document.getElementById("modal-form").classList.add("is-open");
}

function closeDishForm() {
  document.getElementById("modal-form").classList.remove("is-open");
  editingDishId = null;
}

function saveDishForm() {
  const name = document.getElementById("form-name").value.trim();
  if (!name) {
    showToast("料理名を入れてください");
    return;
  }
  const categoryChip = document.querySelector(
    "#form-category .chip.is-active"
  );
  if (!categoryChip) {
    showToast("カテゴリを選んでください");
    return;
  }

  // タグ：選択中のチップ＋新規入力（カンマ・読点区切り）をまとめる
  const tags = [
    ...document.querySelectorAll("#form-tags .chip.is-active"),
  ].map((c) => c.dataset.formTag);
  document
    .getElementById("form-newtags")
    .value.split(/[,、\s]+/)
    .map((t) => t.trim())
    .filter((t) => t && !tags.includes(t))
    .forEach((t) => tags.push(t));

  const data = {
    name: name,
    category: categoryChip.dataset.formCategory,
    ingredient: document.getElementById("form-ingredient").value,
    cookTime: document.getElementById("form-cooktime").value,
    taste: document.getElementById("form-taste").value,
    genre: document.getElementById("form-genre").value,
    tags: tags,
    recipeUrl: "",
  };

  if (editingDishId) {
    const dish = customDishes.find((d) => d.id === editingDishId);
    Object.assign(dish, data);
  } else {
    // オリジナル料理のIDは「u＋登録時刻」。初期データのIDとは衝突しない
    customDishes.push(Object.assign({ id: "u" + Date.now() }, data));
  }
  saveCustomDishes(customDishes);
  closeDishForm();
  renderAll();
  showToast("保存しました");
}

/* ---------- 描画：設定画面 ---------- */

// 除外設定のチップを描画
function renderExcludeSettings() {
  const chipHtml = (value, excludedList) =>
    `<button class="chip ${excludedList.includes(value) ? "is-excluded" : ""}"
       data-exclude-value="${esc(value)}" type="button">${esc(value)}</button>`;

  document.getElementById("exclude-ingredients").innerHTML =
    INGREDIENT_OPTIONS.map((v) => chipHtml(v, exclude.ingredients)).join("");
  document.getElementById("exclude-tags").innerHTML = collectTags()
    .map((v) => chipHtml(v, exclude.tags))
    .join("");
}

// 除外のオン・オフを切り替えて保存
function toggleExclude(kind, value) {
  const list = exclude[kind];
  const i = list.indexOf(value);
  if (i >= 0) {
    list.splice(i, 1);
  } else {
    list.push(value);
  }
  saveExclude(exclude);
  renderExcludeSettings();
}

// 非表示中の料理リストを描画
function renderHiddenList() {
  const container = document.getElementById("hidden-list");
  if (hidden.length === 0) {
    container.innerHTML =
      `<p class="section-note">非表示中の料理はありません。</p>`;
    return;
  }
  container.innerHTML = hidden
    .map((h) => {
      const dish = findDish(h.id);
      if (!dish) return "";
      return `
        <div class="hidden-row">
          <span class="hidden-row-name">${esc(dish.name)}
            <span class="state-chip">${h.until ? "7日間" : "ずっと"}</span>
          </span>
          <button class="btn-unhide" data-unhide="${h.id}" type="button">
            もどす
          </button>
        </div>
      `;
    })
    .join("");
}

// 全画面まとめて描画し直す
function renderAll() {
  renderCards();
  renderDishList();
  renderExcludeSettings();
  renderHiddenList();
}

/* ---------- タブ切替 ---------- */

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("is-active", v.id === "view-" + viewName);
  });
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("is-active", t.dataset.view === viewName);
  });
}

/* ---------- イベント登録・初期化 ---------- */

function init() {
  initStorage();

  // 献立を提案する／ぜんぶ変える
  document.getElementById("btn-suggest").addEventListener("click", suggestAll);

  // この献立にする
  document.getElementById("btn-adopt").addEventListener("click", adoptMenu);

  // 提案カード内の操作（描画し直すため、親要素でクリックを受ける）
  document.getElementById("menu-cards").addEventListener("click", (e) => {
    const reroll = e.target.closest("[data-reroll]");
    if (reroll) {
      rerollOne(reroll.dataset.reroll);
      return;
    }
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      toggleFavorite(fav.dataset.fav);
      renderAll();
      return;
    }
    const hide7 = e.target.closest("[data-hide7]");
    if (hide7) {
      hideDish(hide7.dataset.hide7, 7);
      rerollOne(hide7.dataset.cat); // 代わりの1品を出す
      renderAll();
      showToast("7日間出さないようにしました");
    }
  });

  // 調理時間フィルタ（次の抽選から効く。表示中の献立はそのまま）
  document.getElementById("time-filter").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-time]");
    if (!chip) return;
    timeFilter = chip.dataset.time;
    document.querySelectorAll("#time-filter .chip").forEach((c) => {
      c.classList.toggle("is-active", c.dataset.time === timeFilter);
    });
  });

  // 料理リスト：カテゴリ切替・行タップ・追加ボタン
  document.getElementById("btn-add-dish").addEventListener("click", () => {
    openDishForm(null);
  });
  document.getElementById("view-list").addEventListener("click", (e) => {
    const favChip = e.target.closest("[data-list-fav]");
    if (favChip) {
      listFavoritesOnly = !listFavoritesOnly;
      renderDishList();
      return;
    }
    const catChip = e.target.closest("[data-list-category]");
    if (catChip) {
      listCategory = catChip.dataset.listCategory;
      renderDishList();
      return;
    }
    const row = e.target.closest("[data-dish]");
    if (row) openDishModal(row.dataset.dish);
  });

  // 料理の詳細モーダルの操作
  document.getElementById("modal-dish").addEventListener("click", (e) => {
    // 背景タップで閉じる
    if (e.target.id === "modal-dish") {
      closeDishModal();
      return;
    }
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = document.querySelector(".modal-dish-name").dataset.dishId;
    const act = btn.dataset.act;
    if (act === "close") {
      closeDishModal();
    } else if (act === "fav") {
      toggleFavorite(id);
      renderAll();
      openDishModal(id); // ボタンの文言を更新するため描画し直す
    } else if (act === "hide7") {
      hideDish(id, 7);
      renderAll();
      closeDishModal();
      showToast("7日間出さないようにしました");
    } else if (act === "hide-forever") {
      hideDish(id, null);
      renderAll();
      closeDishModal();
      showToast("提案に出さないようにしました");
    } else if (act === "unhide") {
      unhideDish(id);
      renderAll();
      closeDishModal();
      showToast("提案に出るようになりました");
    } else if (act === "edit") {
      closeDishModal();
      openDishForm(id);
    }
  });

  // 追加・編集フォームの操作
  document.getElementById("modal-form").addEventListener("click", (e) => {
    if (e.target.id === "modal-form") closeDishForm(); // 背景タップで閉じる
    const catChip = e.target.closest("[data-form-category]");
    if (catChip) {
      // カテゴリは1つだけ選択
      document.querySelectorAll("#form-category .chip").forEach((c) => {
        c.classList.toggle("is-active", c === catChip);
      });
    }
    const tagChip = e.target.closest("[data-form-tag]");
    if (tagChip) tagChip.classList.toggle("is-active");
  });
  document
    .getElementById("btn-form-cancel")
    .addEventListener("click", closeDishForm);
  document
    .getElementById("btn-form-save")
    .addEventListener("click", saveDishForm);
  document.getElementById("btn-form-delete").addEventListener("click", () => {
    const dish = findDish(editingDishId);
    if (!dish) return;
    if (confirm(`「${dish.name}」を削除しますか？`)) {
      deleteCustomDish(dish.id);
      closeDishForm();
      renderAll();
      showToast("削除しました");
    }
  });

  // 設定：除外チップ・非表示の「もどす」
  document.getElementById("view-settings").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-exclude-value]");
    if (chip) {
      const kind =
        chip.parentElement.id === "exclude-ingredients"
          ? "ingredients"
          : "tags";
      toggleExclude(kind, chip.dataset.excludeValue);
      return;
    }
    const unhideBtn = e.target.closest("[data-unhide]");
    if (unhideBtn) {
      unhideDish(unhideBtn.dataset.unhide);
      renderAll();
      showToast("提案に出るようになりました");
    }
  });

  // タブ切替
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  renderAll();
}

init();
