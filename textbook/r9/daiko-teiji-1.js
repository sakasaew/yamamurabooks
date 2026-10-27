      const DATA = {
 "select": {
  "single": false,
  "label": "",
  "hint": ""
 },
 "items": {},
 "patterns": [],
 "starNote": "",
 "laterSale": [],
 "payLines": [
  "定時制の教科書・副教材は、これまでどおり学校で販売します。お支払いは現金です。",
  "販売の日時は、学校からのご案内をご確認ください。",
  "払込票によるお支払い・ご自宅への発送の対象ではありません。送料はかかりません。",
  "入荷が遅れた教科書・副教材は、入荷しだい学校へまとめてお届けし、学校からお渡しします。"
 ]
};
const yen = n => n.toLocaleString("ja-JP") + "円";
      const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
      const sel = document.getElementById("course"), out = document.getElementById("result"), desc = document.getElementById("desc");
      const H2 = "mt-10 text-2xl font-bold tracking-tight text-slate-900";
      const NODATA = '<p class="mt-6 text-base text-slate-700" id="empty">教科書・副教材の内容は、準備ができしだい掲載します。</p>';
      const EMPTY = DATA.patterns.length ? '<p class="mt-6 text-base text-slate-500" id="empty">コースを選ぶと、教科書・副教材と金額が表示されます。</p>' : NODATA;
      for (const p of DATA.patterns) {
        const o = document.createElement("option");
        o.value = p.code; o.textContent = p.slip;
        sel.appendChild(o);
      }
      if (DATA.select.single || !DATA.patterns.length) { document.getElementById("selbox").hidden = true; }
      else { document.getElementById("sel-label").textContent = DATA.select.label; document.getElementById("sel-hint").textContent = DATA.select.hint; }
      document.getElementById("pay").innerHTML = DATA.payLines.map(t => "<li>" + esc(t) + "</li>").join("");

      function list(items) {
        return '<ul class="tb-list">' + items.map(it =>
          '<li><div class="tb-title">' + (it.laterDelivery ? '<span class="tb-star" aria-label="後日配布">※</span>' : "") + esc(it.title) +
          '<span class="tb-meta">' + esc([it.pub, it.num].filter(Boolean).join("　")) + '</span></div>' +
          '<div class="tb-price">' + yen(it.price) + "</div></li>").join("") + "</ul>";
      }
      function sum(items) { return items.reduce((a, it) => a + it.price, 0); }

      function render(code) {
        const p = DATA.patterns.find(x => x.code === code);
        if (!p) { out.innerHTML = EMPTY; desc.hidden = true; sel.value = ""; return; }
        sel.value = p.code;
        if (p.desc) { desc.hidden = false; desc.innerHTML = '<b>' + esc(p.slip) + '</b>　' + esc(p.desc); } else { desc.hidden = true; }
        const its = p.items.map(id => DATA.items[id]);
        const tb = its.filter(i => i.kubun === "教科書"), sb = its.filter(i => i.kubun === "副教材");
        const total = sum(tb) + sum(sb);
        let main = "", aside = "", later = "";
        main += '<h2 class="' + H2 + '">教科書（' + tb.length + '冊）</h2>' + list(tb);
        main += '<h2 class="' + H2 + '">副教材（' + sb.length + '点）</h2>' + list(sb);
        main += '<p class="mt-4 text-sm text-slate-500">' + esc(DATA.starNote) + "</p>";
        aside += '<div class="tb-sum"><dl>' +
             "<dt>教科書 小計</dt><dd id='sub-tb'>" + yen(sum(tb)) + "</dd>" +
             "<dt>副教材 小計</dt><dd id='sub-sb'>" + yen(sum(sb)) + "</dd>" +
             "</dl>" +
             '<div class="tb-total"><span class="font-bold">合計金額</span><b id="total" data-total="' + total + '">' + yen(total) + "</b></div>" +
             '<div class="tb-pay"><span>お支払い</span><b>学校での販売（現金）</b></div>' +
             '<p class="mt-3 text-sm text-slate-500">合計金額は、学校で配られるご案内の金額と同じです。金額はすべて税込です（教科書は非課税）。</p></div>';
        if (DATA.laterSale.length) {
          later = '<div class="tb-later"><h2 class="text-xl font-bold tracking-tight text-slate-900">後日販売（合計金額には含まれません）</h2>' + list(DATA.laterSale) + "</div>";
        }
        const h = '<div class="tb-grid"><div class="tb-main">' + main + '</div><aside class="tb-aside" aria-label="合計金額">' + aside + '</aside>' + later + '</div>';
        out.innerHTML = h;
      }
      function fromHash() {
        const c = decodeURIComponent(location.hash.replace(/^#/, "")).toUpperCase().replace(/^[A-Z]{2}[0-9]-/, "");
        render(c);
      }
      sel.addEventListener("change", () => {
        if (sel.value) history.replaceState(null, "", "#" + sel.value); else history.replaceState(null, "", location.pathname);
        render(sel.value);
      });
      window.addEventListener("hashchange", fromHash);
      if (DATA.select.single && DATA.patterns.length) render(DATA.patterns[0].code); else fromHash();
