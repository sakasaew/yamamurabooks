// Keep JS tiny (no build tools needed)
(function () {
  // Hero parallax
  const heroImg = document.getElementById("heroImg");
  if (heroImg) {
    // モバイル（pointerがcoarse＝タッチ端末）では無効化してパフォーマンスを確保
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!prefersReducedMotion && !isTouch) {
      const speed = 0.3;
      const scale = 1.3;
      const frame = heroImg.parentElement;
      let ticking = false;
      const update = () => {
        ticking = false;
        // scale拡大による余白の範囲内にずらし量を制限（はみ出して黒背景が見えるのを防ぐ）
        const maxShift = (heroImg.offsetHeight * (scale - 1)) / 2;
        const shift = Math.max(-maxShift, Math.min(maxShift, -frame.getBoundingClientRect().top * speed));
        heroImg.style.transform = `translateY(${shift}px) scale(${scale})`;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
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

})();

