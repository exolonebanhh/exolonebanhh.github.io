/* ============================================================
   EFFECTS — interaksi khas situs agency
   (smooth scroll Lenis, custom cursor, parallax, tombol magnetik)
   Semua opsional & ber-pengawal: halusinasi nol kalau CDN gagal,
   touch device, atau user memakai prefers-reduced-motion.
   ============================================================ */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. smooth scroll (Lenis) ---------- */

  let lenis = null;

  if (!reduced && finePointer && typeof window.Lenis === "function") {
    try {
      lenis = new Lenis({ lerp: 0.09 });
      document.documentElement.style.scrollBehavior = "auto";

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // anchor internal → animasi halus via Lenis
      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const target = document.querySelector(a.hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -56, duration: 1.2 });
      });
    } catch (err) {
      lenis = null;
    }
  }

  /* ---------- 2. custom cursor (dot + ring, blend difference) ---------- */

  if (!reduced && finePointer) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    const body = document.body;

    if (dot && ring) {
      let mx = -100, my = -100;      // posisi mouse asli
      let rx = -100, ry = -100;      // posisi ring (di-lerp)
      let started = false;

      document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!started) {
          started = true;
          rx = mx; ry = my;
          body.classList.add("cursor-ready");
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
      });

      // ring membesar saat di atas elemen interaktif
      const hoverSelector = "a, button, .work, .skill, .btn";
      document.addEventListener("mouseover", (e) => {
        body.classList.toggle("cursor-hover", !!e.target.closest(hoverSelector));
      });

      (function loopCursor() {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
        ring.style.transform = `translate3d(${rx - 19}px, ${ry - 19}px, 0)`;
        requestAnimationFrame(loopCursor);
      })();
    }
  }

  /* ---------- 3. parallax orb mengikuti mouse ---------- */

  if (!reduced && finePointer) {
    const hero = document.querySelector(".hero");
    const orbWrap = document.querySelector(".orb-wrap");

    if (hero && orbWrap) {
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        orbWrap.style.transform = `translate3d(${x * 46}px, ${y * 30}px, 0)`;
      });
      hero.addEventListener("mouseleave", () => {
        orbWrap.style.transform = "translate3d(0, 0, 0)";
      });
    }
  }

  /* ---------- 4. tombol magnetik ---------- */

  if (!reduced && finePointer) {
    document.querySelectorAll(".btn, .nav__pill").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- 5. parallax angka raksasa (.num) saat scroll ---------- */

  if (!reduced) {
    const nums = Array.from(document.querySelectorAll(".num"));
    if (nums.length) {
      let ticking = false;
      const updateNums = () => {
        ticking = false;
        const mid = window.innerHeight / 2;
        for (const n of nums) {
          const rect = n.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
          const offset = (rect.top + rect.height / 2 - mid) * -0.14;
          n.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      };
      document.addEventListener("scroll", () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateNums);
        }
      }, { passive: true });
      updateNums();
    }
  }
})();
