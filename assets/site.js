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
  btn?.addEventListener("click", () => {
    menu?.classList.toggle("hidden");
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

})();

