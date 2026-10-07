// Keep JS tiny (no build tools needed)
(function () {
  // Hero parallax
  const heroImg = document.getElementById("heroImg");
  if (heroImg) {
    // モバイル（pointerがcoarse＝タッチ端末）では無効化してパフォーマンスを確保
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!prefersReducedMotion && !isTouch) {
      const speed = 0.25;
      window.addEventListener("scroll", () => {
        heroImg.style.transform = `translateY(${window.scrollY * speed * -1}px) scale(1.12)`;
      }, { passive: true });
    }
  }

  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const setMenu = (open) => {
    menu?.classList.toggle("hidden", !open);
    document.body.classList.toggle("menu-open", open);
    if (!btn) return;
    btn.textContent = open ? "閉じる" : "メニュー";
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    btn.setAttribute("aria-expanded", String(open));
  };
  btn?.addEventListener("click", () => {
    setMenu(menu?.classList.contains("hidden") ?? false);
  });
  // 背面（暗くなった部分）をタップ、またはEscキーで閉じる
  document.addEventListener("click", (e) => {
    if (menu && !menu.classList.contains("hidden") && !e.target.closest("header")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && !menu.classList.contains("hidden")) setMenu(false);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ページ内リンク（#id）：ふわっとスクロール（動きを減らす設定のときは通常の移動）
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const id = decodeURIComponent(a.getAttribute("href").slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); // 固定ヘッダー分は html の scroll-padding-top が効く
    history.pushState(null, "", "#" + id);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

  // アコーディオン（details）：ふわっと開閉（動きを減らす設定のときは通常の開閉）
  document.querySelectorAll("details").forEach((d) => {
    const summary = d.querySelector(":scope > summary");
    if (!summary) return;
    let anim = null;
    let opening = d.open;
    summary.addEventListener("click", (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      const border = d.offsetHeight - d.clientHeight; // 上下の枠線ぶん
      const closedH = summary.offsetHeight + border;
      const from = d.offsetHeight;
      opening = anim ? !opening : !d.open; // アニメーション中の再クリックは逆方向へ
      if (anim) { anim.onfinish = null; anim.cancel(); }
      d.style.overflow = "hidden";
      if (opening) d.open = true;
      const to = opening ? d.scrollHeight + border : closedH;
      anim = d.animate({ height: [from + "px", to + "px"] }, { duration: 260, easing: "ease" });
      anim.onfinish = () => {
        if (!opening) d.open = false;
        d.style.overflow = "";
        anim = null;
      };
    });
  });

})();

