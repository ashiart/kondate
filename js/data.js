// =====================================================
// 献立メーカー：初期料理データ（100件）
// =====================================================
//
// ■ このファイルの役割
//   初期料理データを定義します。料理を増やすときは、
//   既存の1行をコピーして書き換えるだけでOKです（1行＝1料理）。
//
// ■ 料理ID運用ルール（重要・絶対に守る）
//   ・IDは「d + 3桁の連番」で付ける（d001, d002, ...）
//   ・一度使ったIDは永久不変。あとから変更しない
//   ・料理を削除しても、そのIDは欠番にして再利用しない
//     例）d003 を削除した場合でも、次に追加する料理は d101
//   ・お気に入り・非表示・履歴はIDを頼りに料理を探すため、
//     IDを変更・再利用すると利用者の設定が壊れます
//
//   ★次に使うID： d101
//
// ■ 項目の説明
//   id         : 必須。上記ルールで採番
//   name       : 必須。料理名
//   category   : 必須。「主菜」「副菜」「汁物」のいずれか
//   ingredient : 任意。「鶏肉」「豚肉」「牛肉」「魚」「豆腐」「卵」「野菜」「その他」
//   cookTime   : 任意。「15分以内」「30分以内」「30分超」
//   taste      : 任意。「塩」「醤油」「味噌」「カレー」「トマト」「バター」
//                「マヨネーズ」「甘辛」「辛味」「その他」
//   genre      : 任意。「和」「洋」「中」「その他」
//   tags       : 任意。自由なタグの配列。例：「節約」「子ども向け」「辛い」「作り置き」
//   recipeUrl  : 任意。レシピ記事のURL（将来用。今は "" のままでOK）
//
//   ※任意項目が分からないときは "" または [] のままで構いません
// =====================================================

const DISHES = [
  // ---------- 主菜（40件） ----------
  { id: "d001", name: "鶏の照り焼き", category: "主菜", ingredient: "鶏肉", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d002", name: "豚の生姜焼き", category: "主菜", ingredient: "豚肉", cookTime: "15分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d003", name: "鮭のムニエル", category: "主菜", ingredient: "魚", cookTime: "15分以内", taste: "バター", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d004", name: "麻婆豆腐", category: "主菜", ingredient: "豆腐", cookTime: "30分以内", taste: "辛味", genre: "中", tags: ["辛い"], recipeUrl: "" },
  { id: "d005", name: "煮込みハンバーグ", category: "主菜", ingredient: "牛肉", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d011", name: "鶏の唐揚げ", category: "主菜", ingredient: "鶏肉", cookTime: "30分以内", taste: "醤油", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d012", name: "チキン南蛮", category: "主菜", ingredient: "鶏肉", cookTime: "30分以内", taste: "マヨネーズ", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d013", name: "親子丼", category: "主菜", ingredient: "鶏肉", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["子ども向け", "節約"], recipeUrl: "" },
  { id: "d014", name: "鶏のねぎ塩焼き", category: "主菜", ingredient: "鶏肉", cookTime: "15分以内", taste: "塩", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d015", name: "タンドリーチキン", category: "主菜", ingredient: "鶏肉", cookTime: "30分以内", taste: "カレー", genre: "その他", tags: ["作り置き"], recipeUrl: "" },
  { id: "d016", name: "クリームシチュー", category: "主菜", ingredient: "鶏肉", cookTime: "30分超", taste: "バター", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d017", name: "油淋鶏", category: "主菜", ingredient: "鶏肉", cookTime: "30分以内", taste: "醤油", genre: "中", tags: [], recipeUrl: "" },
  { id: "d018", name: "筑前煮", category: "主菜", ingredient: "鶏肉", cookTime: "30分超", taste: "醤油", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d019", name: "とんかつ", category: "主菜", ingredient: "豚肉", cookTime: "30分以内", taste: "その他", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d020", name: "回鍋肉", category: "主菜", ingredient: "豚肉", cookTime: "15分以内", taste: "味噌", genre: "中", tags: [], recipeUrl: "" },
  { id: "d021", name: "豚キムチ炒め", category: "主菜", ingredient: "豚肉", cookTime: "15分以内", taste: "辛味", genre: "その他", tags: ["辛い", "節約"], recipeUrl: "" },
  { id: "d022", name: "肉野菜炒め", category: "主菜", ingredient: "豚肉", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["節約"], recipeUrl: "" },
  { id: "d023", name: "豚の角煮", category: "主菜", ingredient: "豚肉", cookTime: "30分超", taste: "甘辛", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d024", name: "ポークカレー", category: "主菜", ingredient: "豚肉", cookTime: "30分超", taste: "カレー", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d025", name: "冷しゃぶサラダ", category: "主菜", ingredient: "豚肉", cookTime: "15分以内", taste: "その他", genre: "和", tags: [], recipeUrl: "" },
  { id: "d026", name: "餃子", category: "主菜", ingredient: "豚肉", cookTime: "30分以内", taste: "醤油", genre: "中", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d027", name: "肉じゃが", category: "主菜", ingredient: "牛肉", cookTime: "30分以内", taste: "甘辛", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d028", name: "牛丼", category: "主菜", ingredient: "牛肉", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d029", name: "青椒肉絲", category: "主菜", ingredient: "牛肉", cookTime: "15分以内", taste: "醤油", genre: "中", tags: [], recipeUrl: "" },
  { id: "d030", name: "ビーフシチュー", category: "主菜", ingredient: "牛肉", cookTime: "30分超", taste: "その他", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d031", name: "鯖の味噌煮", category: "主菜", ingredient: "魚", cookTime: "30分以内", taste: "味噌", genre: "和", tags: [], recipeUrl: "" },
  { id: "d032", name: "ぶりの照り焼き", category: "主菜", ingredient: "魚", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: [], recipeUrl: "" },
  { id: "d033", name: "鮭の塩焼き", category: "主菜", ingredient: "魚", cookTime: "15分以内", taste: "塩", genre: "和", tags: [], recipeUrl: "" },
  { id: "d034", name: "アクアパッツァ", category: "主菜", ingredient: "魚", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d035", name: "白身魚のフライ", category: "主菜", ingredient: "魚", cookTime: "30分以内", taste: "その他", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d036", name: "エビチリ", category: "主菜", ingredient: "魚", cookTime: "30分以内", taste: "辛味", genre: "中", tags: ["辛い"], recipeUrl: "" },
  { id: "d037", name: "かれいの煮付け", category: "主菜", ingredient: "魚", cookTime: "30分以内", taste: "甘辛", genre: "和", tags: [], recipeUrl: "" },
  { id: "d038", name: "いわしの蒲焼き", category: "主菜", ingredient: "魚", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d039", name: "豆腐ハンバーグ", category: "主菜", ingredient: "豆腐", cookTime: "30分以内", taste: "醤油", genre: "和", tags: ["子ども向け", "節約"], recipeUrl: "" },
  { id: "d040", name: "豆腐ステーキ", category: "主菜", ingredient: "豆腐", cookTime: "15分以内", taste: "バター", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d041", name: "オムライス", category: "主菜", ingredient: "卵", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d042", name: "天津飯", category: "主菜", ingredient: "卵", cookTime: "15分以内", taste: "その他", genre: "中", tags: ["節約"], recipeUrl: "" },
  { id: "d043", name: "ニラ玉炒め", category: "主菜", ingredient: "卵", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["節約"], recipeUrl: "" },
  { id: "d044", name: "麻婆なす", category: "主菜", ingredient: "野菜", cookTime: "30分以内", taste: "辛味", genre: "中", tags: ["辛い"], recipeUrl: "" },
  { id: "d045", name: "ミートソーススパゲッティ", category: "主菜", ingredient: "その他", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },

  // ---------- 副菜（35件） ----------
  { id: "d006", name: "ほうれん草のおひたし", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d007", name: "ポテトサラダ", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "マヨネーズ", genre: "洋", tags: ["子ども向け", "作り置き"], recipeUrl: "" },
  { id: "d008", name: "きんぴらごぼう", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["節約", "作り置き"], recipeUrl: "" },
  { id: "d046", name: "かぼちゃの煮物", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "甘辛", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d047", name: "ひじきの煮物", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "醤油", genre: "和", tags: ["作り置き", "節約"], recipeUrl: "" },
  { id: "d048", name: "切り干し大根の煮物", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "醤油", genre: "和", tags: ["作り置き", "節約"], recipeUrl: "" },
  { id: "d049", name: "コールスロー", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "マヨネーズ", genre: "洋", tags: ["作り置き"], recipeUrl: "" },
  { id: "d050", name: "やみつき塩キャベツ", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["節約"], recipeUrl: "" },
  { id: "d051", name: "なすの煮びたし", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d052", name: "トマトのマリネ", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "その他", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d053", name: "ブロッコリーのごま和え", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d054", name: "ほうれん草のバターソテー", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "バター", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d055", name: "無限ピーマン", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["節約", "作り置き"], recipeUrl: "" },
  { id: "d056", name: "にんじんしりしり", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "その他", tags: ["節約", "作り置き"], recipeUrl: "" },
  { id: "d057", name: "大根サラダ", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d058", name: "きゅうりの浅漬け", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "和", tags: ["節約", "作り置き"], recipeUrl: "" },
  { id: "d059", name: "もやしのナムル", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "その他", tags: ["節約"], recipeUrl: "" },
  { id: "d060", name: "春雨サラダ", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "醤油", genre: "中", tags: ["作り置き"], recipeUrl: "" },
  { id: "d061", name: "じゃがいものバター醤油炒め", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "バター", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d062", name: "ラタトゥイユ", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: ["作り置き"], recipeUrl: "" },
  { id: "d063", name: "白菜のクリーム煮", category: "副菜", ingredient: "野菜", cookTime: "30分以内", taste: "バター", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d064", name: "ごぼうサラダ", category: "副菜", ingredient: "野菜", cookTime: "15分以内", taste: "マヨネーズ", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d065", name: "冷奴", category: "副菜", ingredient: "豆腐", cookTime: "15分以内", taste: "醤油", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d066", name: "揚げ出し豆腐", category: "副菜", ingredient: "豆腐", cookTime: "30分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d067", name: "厚揚げの照り焼き", category: "副菜", ingredient: "豆腐", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d068", name: "白和え", category: "副菜", ingredient: "豆腐", cookTime: "30分以内", taste: "その他", genre: "和", tags: [], recipeUrl: "" },
  { id: "d069", name: "だし巻き卵", category: "副菜", ingredient: "卵", cookTime: "15分以内", taste: "その他", genre: "和", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d070", name: "味玉", category: "副菜", ingredient: "卵", cookTime: "30分以内", taste: "醤油", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d071", name: "卵とブロッコリーのサラダ", category: "副菜", ingredient: "卵", cookTime: "15分以内", taste: "マヨネーズ", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d072", name: "茶碗蒸し", category: "副菜", ingredient: "卵", cookTime: "30分以内", taste: "その他", genre: "和", tags: [], recipeUrl: "" },
  { id: "d073", name: "マカロニサラダ", category: "副菜", ingredient: "その他", cookTime: "15分以内", taste: "マヨネーズ", genre: "洋", tags: ["子ども向け", "作り置き"], recipeUrl: "" },
  { id: "d074", name: "こんにゃくのピリ辛炒め", category: "副菜", ingredient: "その他", cookTime: "15分以内", taste: "甘辛", genre: "和", tags: ["節約", "辛い"], recipeUrl: "" },
  { id: "d075", name: "ちくわの磯辺揚げ", category: "副菜", ingredient: "魚", cookTime: "15分以内", taste: "塩", genre: "和", tags: ["節約", "子ども向け"], recipeUrl: "" },
  { id: "d076", name: "バンバンジー", category: "副菜", ingredient: "鶏肉", cookTime: "15分以内", taste: "その他", genre: "中", tags: [], recipeUrl: "" },
  { id: "d077", name: "アスパラのベーコン巻き", category: "副菜", ingredient: "豚肉", cookTime: "15分以内", taste: "塩", genre: "洋", tags: [], recipeUrl: "" },

  // ---------- 汁物（25件） ----------
  { id: "d009", name: "豆腐とわかめの味噌汁", category: "汁物", ingredient: "豆腐", cookTime: "15分以内", taste: "味噌", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d010", name: "卵とコーンの中華スープ", category: "汁物", ingredient: "卵", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d078", name: "豚汁", category: "汁物", ingredient: "豚肉", cookTime: "30分以内", taste: "味噌", genre: "和", tags: ["作り置き"], recipeUrl: "" },
  { id: "d079", name: "けんちん汁", category: "汁物", ingredient: "豆腐", cookTime: "30分以内", taste: "醤油", genre: "和", tags: [], recipeUrl: "" },
  { id: "d080", name: "スンドゥブ風スープ", category: "汁物", ingredient: "豆腐", cookTime: "15分以内", taste: "辛味", genre: "その他", tags: ["辛い"], recipeUrl: "" },
  { id: "d081", name: "豆腐となめこの味噌汁", category: "汁物", ingredient: "豆腐", cookTime: "15分以内", taste: "味噌", genre: "和", tags: [], recipeUrl: "" },
  { id: "d082", name: "かきたま汁", category: "汁物", ingredient: "卵", cookTime: "15分以内", taste: "醤油", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d083", name: "卵とトマトの中華スープ", category: "汁物", ingredient: "卵", cookTime: "15分以内", taste: "塩", genre: "中", tags: [], recipeUrl: "" },
  { id: "d084", name: "大根と油揚げの味噌汁", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "味噌", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d085", name: "玉ねぎとじゃがいもの味噌汁", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "味噌", genre: "和", tags: ["節約"], recipeUrl: "" },
  { id: "d086", name: "きのこの味噌汁", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "味噌", genre: "和", tags: [], recipeUrl: "" },
  { id: "d087", name: "野菜のカレースープ", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "カレー", genre: "洋", tags: ["節約"], recipeUrl: "" },
  { id: "d088", name: "ミネストローネ", category: "汁物", ingredient: "野菜", cookTime: "30分以内", taste: "トマト", genre: "洋", tags: ["作り置き"], recipeUrl: "" },
  { id: "d089", name: "かぼちゃのポタージュ", category: "汁物", ingredient: "野菜", cookTime: "30分以内", taste: "バター", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d090", name: "コーンポタージュ", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "その他", genre: "洋", tags: ["子ども向け"], recipeUrl: "" },
  { id: "d091", name: "オニオンスープ", category: "汁物", ingredient: "野菜", cookTime: "30分以内", taste: "塩", genre: "洋", tags: [], recipeUrl: "" },
  { id: "d092", name: "もやしの中華スープ", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "中", tags: ["節約"], recipeUrl: "" },
  { id: "d093", name: "白菜と春雨のスープ", category: "汁物", ingredient: "野菜", cookTime: "15分以内", taste: "塩", genre: "中", tags: [], recipeUrl: "" },
  { id: "d094", name: "あさりの味噌汁", category: "汁物", ingredient: "魚", cookTime: "15分以内", taste: "味噌", genre: "和", tags: [], recipeUrl: "" },
  { id: "d095", name: "つみれ汁", category: "汁物", ingredient: "魚", cookTime: "30分以内", taste: "味噌", genre: "和", tags: [], recipeUrl: "" },
  { id: "d096", name: "鶏団子と白菜のスープ", category: "汁物", ingredient: "鶏肉", cookTime: "30分以内", taste: "塩", genre: "和", tags: [], recipeUrl: "" },
  { id: "d097", name: "サムゲタン風スープ", category: "汁物", ingredient: "鶏肉", cookTime: "30分超", taste: "塩", genre: "その他", tags: [], recipeUrl: "" },
  { id: "d098", name: "豚バラと白菜のスープ", category: "汁物", ingredient: "豚肉", cookTime: "30分以内", taste: "塩", genre: "中", tags: [], recipeUrl: "" },
  { id: "d099", name: "わかめスープ", category: "汁物", ingredient: "その他", cookTime: "15分以内", taste: "塩", genre: "その他", tags: ["節約"], recipeUrl: "" },
  { id: "d100", name: "担々風春雨スープ", category: "汁物", ingredient: "その他", cookTime: "15分以内", taste: "辛味", genre: "中", tags: ["辛い"], recipeUrl: "" },
];
