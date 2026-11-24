/* ============================================================
   PORTOFOLIO — interaksi ringan tanpa dependensi
   (reveal on scroll, nav adaptif, tab progres, jam WIB)
   ============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- reveal on scroll ---------- */

  const revealEls = document.querySelectorAll("[data-reveal]");

  // delay bertingkat via data-delay → CSS custom property --d
  document.querySelectorAll("[data-delay]").forEach((el) => {
    el.style.setProperty("--d", `${el.dataset.delay}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- nav adaptif + tab progres + progress bar ---------- */

  const navSections = document.querySelectorAll("[data-navtext]");
  const tabLinks = Array.from(document.querySelectorAll(".tabs a"));
  const bar = document.querySelector(".progress__bar");

  function updateOnScroll() {
    const mid = window.innerHeight * 0.5;

    // section terakhir yang sudah melewati garis tengah viewport
    let current = navSections[0];
    for (const s of navSections) {
      if (s.getBoundingClientRect().top <= mid) current = s;
    }

    if (current) {
      document.body.dataset.navtext = current.dataset.navtext;
      const id = `#${current.id}`;
      tabLinks.forEach((a) =>
        a.classList.toggle("is-active", a.hash === id)
      );
    }

    if (bar) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    }
  }

  document.addEventListener("scroll", updateOnScroll, { passive: true });
  window.addEventListener("resize", updateOnScroll);
  updateOnScroll();

  /* ---------- jam WIB (Asia/Jakarta) ---------- */

  const timeEls = document.querySelectorAll("[data-time]");

  if (timeEls.length) {
    const fmt = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });

    const tick = () => {
      // locale id-ID sudah menyertakan "WIB" — jangan ditambah dua kali
      const label = fmt.format(new Date());
      const t = label.includes("WIB") ? label : `${label} WIB`;
      timeEls.forEach((el) => (el.textContent = t));
    };

    tick();
    setInterval(tick, 15000);
  }

  /* ---------- tahun berjalan ---------- */

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
