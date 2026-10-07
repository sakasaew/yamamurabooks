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

})();

