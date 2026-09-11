document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const topbar = document.querySelector(".topbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const toast = document.getElementById("toast");
  const copyEmail = document.getElementById("copyEmail");
  const scrollProgressBar = document.getElementById("scrollProgress");

  // Page Load & Preloader sequence
  function finishLoading() {
    if (!preloader.classList.contains("hide")) {
      preloader.classList.add("hide");
      document.body.classList.add("page-loaded");
    }
  }

  if (document.readyState === "complete") {
    setTimeout(finishLoading, 200);
  } else {
    window.addEventListener("load", () => {
      setTimeout(finishLoading, 300);
    });
    // Fallback in case load event takes too long
    setTimeout(finishLoading, 1500);
  }

  // Scroll Progress Bar & Topbar background
  let isScrolling = false;
  function updateScrollEffects() {
    const scrollY = window.scrollY;
    topbar.classList.toggle("scrolled", scrollY > 30);

    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    }
    isScrolling = false;
  }

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(updateScrollEffects);
      isScrolling = true;
    }
  }, { passive: true });

  updateScrollEffects();

  // Scroll Reveal with IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  // Mobile Menu Toggle
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Active section indicator in navigation
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  if ("IntersectionObserver" in window) {
    const activeSectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => activeSectionObserver.observe(section));
  }

  // Copy Email to clipboard with toast notification
  if (copyEmail) {
    copyEmail.addEventListener("click", async () => {
      const email = copyEmail.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email berhasil disalin! 🌿");
      } catch {
        showToast("Email: " + email);
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  // Current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
