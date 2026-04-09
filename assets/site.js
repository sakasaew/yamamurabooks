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

  // Contact form: open mail client with prefilled content.
  const contactForm = document.getElementById("contactMailForm");
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = "info@yamamurabook.shop";

      const name = document.getElementById("contactName")?.value?.trim?.() ?? "";
      const email = document.getElementById("contactEmail")?.value?.trim?.() ?? "";
      const subjectRaw = document.getElementById("contactSubject")?.value?.trim?.() ?? "";
      const bodyRaw = document.getElementById("contactBody")?.value?.trim?.() ?? "";

      const subject = subjectRaw ? `山村書店 お問い合わせ: ${subjectRaw}` : "山村書店 お問い合わせ";
      const body = [
        "山村書店 御中",
        "",
        `氏名: ${name || "（未入力）"}`,
        `メールアドレス: ${email || "（未入力）"}`,
        "",
        "内容:",
        bodyRaw || "（未入力）",
        "",
      ].join("\n");

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }
})();

