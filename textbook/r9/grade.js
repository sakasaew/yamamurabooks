/* 学年別ページの共通の表示コード。
   金額・品目は /textbook/r9/data/prices.json から読み込む（JSON を差し替えるだけで金額が変わる）。
   各ページの .js が window.TEXTBOOK_PAGE（学校・学年・お支払い開始日・文言）を先に定義する。 */
(function () {
  "use strict";
  const PAGE = window.TEXTBOOK_PAGE;
  const DATA_URL = "/textbook/r9/data/prices.json";
  const yen = n => Number(n).toLocaleString("ja-JP") + "円";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const sel = document.getElementById("course"), out = document.getElementById("result");
  const H2 = "mt-10 text-2xl font-bold tracking-tight text-slate-900";
  const LINK = '<a class="text-brand underline underline-offset-4 hover:opacity-80" href="/contact.html">';
  const EMPTY = '<p class="mt-6 text-base text-slate-500" id="empty">学科・選択内容を選ぶと、教科書・副教材と金額が表示されます。</p>';
  const ERROR = '<p class="mt-6 text-base text-slate-700" id="empty">金額データを読み込めませんでした。時間をおいて再度お試しいただくか、お問い合わせください。</p>';

  const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
  function ymd(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    return { y, mo, d, w: WEEK[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()] };
  }
  // 例：2027年3月12日（金）〜3月22日（月）
  function period(startStr, dueStr) {
    const a = ymd(startStr), b = ymd(dueStr);
    if (!a || !b) return "";
    return a.y + "年" + a.mo + "月" + a.d + "日（" + a.w + "）〜" + (b.y !== a.y ? b.y + "年" : "") + b.mo + "月" + b.d + "日（" + b.w + "）";
  }
  function deadlineHtml(s) {
    const parts = String(s).split("〜");
    const y = (parts[0].match(/^\d{4}年/) || [""])[0];
    if (parts.length !== 2 || !y) return esc(s);
    return '<span class="tb-dr"><i>' + esc(y) + '</i><i class="tb-dd">' + esc(parts[0].slice(y.length)) + '〜</i><i class="tb-dd">' + esc(parts[1]) + '</i></span>';
  }
  function list(items) {
    return '<ul class="tb-list">' + items.map(it =>
      '<li><div class="tb-title">' + (it.laterDelivery ? '<span class="tb-star" aria-label="後日配布">※</span>' : "") + esc(it.title) +
      '<span class="tb-meta">' + esc([it.pub, it.num].filter(Boolean).join("　")) + '</span></div>' +
      '<div class="tb-price">' + yen(it.price) + "</div></li>").join("") + "</ul>";
  }

  function init(json) {
    const itemById = new Map(json.items.map(i => [i.id, i]));
    const linked = new Map();
    for (const r of json.pattern_items) {
      if (!linked.has(r.pattern_id)) linked.set(r.pattern_id, []);
      linked.get(r.pattern_id).push(r.item_id);
    }
    const patterns = json.patterns.filter(p => p.school === PAGE.school && p.grade === PAGE.grade);
    if (!patterns.length) throw new Error("no patterns");

    function itemsOf(p) {
      return (linked.get(p.pattern_id) || []).map(id => itemById.get(id)).filter(Boolean)
        .map(i => ({ kubun: i.kubun, title: i.title, pub: i.publisher, num: i.code, price: i.price, laterDelivery: !!i.later }));
    }
    // 後日販売（学校で4月に販売する芸術の教科書。合計金額には含まれない）
    const laterSales = (json.later_sales || []).filter(i => i.school === PAGE.school && i.grade === PAGE.grade)
      .map(i => ({ title: i.title, pub: i.publisher, num: i.code, price: i.price }));

    function render(id) {
      const p = patterns.find(x => x.pattern_id === id);
      if (!p) { out.innerHTML = EMPTY; sel.value = ""; return; }
      sel.value = p.pattern_id;
      const its = itemsOf(p);
      const tb = its.filter(i => i.kubun === "教科書"), sb = its.filter(i => i.kubun === "副教材");
      let main = "", aside = "", later = "";
      main += '<h2 class="' + H2 + '">教科書（' + tb.length + '冊）</h2>' + list(tb);
      main += '<h2 class="' + H2 + '">副教材（' + sb.length + '点）</h2>' + list(sb);
      main += '<p class="mt-4 text-sm text-slate-500">' + esc(PAGE.starNote) + "</p>";
      aside += '<div class="tb-sum"><dl>' +
           "<dt>教科書 小計</dt><dd id='sub-tb'>" + yen(p.textbook) + "</dd>" +
           "<dt>副教材 小計</dt><dd id='sub-sb'>" + yen(p.material) + "</dd>" +
           (p.fee ? "<dt>販売手数料・送料</dt><dd id='sub-ship'>" + yen(p.fee) + "</dd>" : "") + "</dl>" +
           '<div class="tb-total"><span class="font-bold">合計金額</span><b id="total" data-total="' + p.total + '">' + yen(p.total) + "</b></div>" +
           '<div class="tb-deadline"><span>お支払い期間（払込票）</span><b>' + deadlineHtml(period(PAGE.start, p.due)) + '</b></div>' +
           '<p class="mt-3 text-sm text-slate-500">合計金額は払込票の金額と同じです。金額はすべて税込です（教科書は非課税）。</p>' +
           '<p class="mt-2 text-sm text-slate-500">見本の金額は、令和9年度の予定価などによる概算です。</p></div>';
      if (laterSales.length) {
        later = '<div class="tb-later"><h2 class="text-xl font-bold tracking-tight text-slate-900">後日販売（合計金額には含まれません）</h2>' + list(laterSales) + "</div>";
      }
      out.innerHTML = '<div class="tb-grid"><div class="tb-main">' + main + '</div><aside class="tb-aside" aria-label="合計金額">' + aside + '</aside>' + later + '</div>';
    }

    // お支払い・お届けについて（{period} は、お支払い開始日＋JSON の due から作る）
    const per = period(PAGE.start, patterns[0].due);
    document.getElementById("pay").innerHTML = PAGE.payLines.map(t =>
      "<li>" + esc(t).replace("{period}", per).replace(/お問い合わせ(ページ)?/, m => LINK + m + "</a>") + "</li>").join("");

    if (patterns.length === 1) {
      document.getElementById("selbox").hidden = true;
      render(patterns[0].pattern_id);
      return;
    }
    document.getElementById("sel-label").textContent = PAGE.select.label;
    document.getElementById("sel-hint").textContent = PAGE.select.hint;
    for (const p of patterns) {
      const o = document.createElement("option");
      o.value = p.pattern_id; o.textContent = p.label;
      sel.appendChild(o);
    }
    const fromHash = () => render(decodeURIComponent(location.hash.replace(/^#/, "")));
    sel.addEventListener("change", () => {
      if (sel.value) history.replaceState(null, "", "#" + sel.value); else history.replaceState(null, "", location.pathname);
      render(sel.value);
    });
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  fetch(DATA_URL).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(init)
    .catch(() => { out.innerHTML = ERROR; });
})();
