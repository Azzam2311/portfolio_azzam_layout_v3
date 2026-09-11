document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const topbar = document.querySelector(".topbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const toast = document.getElementById("toast");
  const copyEmail = document.getElementById("copyEmail");

  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hide"), 350);
  });

  function updateTopbar() {
    topbar.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", updateTopbar);
  updateTopbar();

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

  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll(".reveal").forEach(item => reveal.observe(item));

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  const activeSection = new IntersectionObserver(entries => {
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

  sections.forEach(section => activeSection.observe(section));

  copyEmail.addEventListener("click", async () => {
    const email = copyEmail.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email berhasil disalin!");
    } catch {
      showToast("Email: " + email);
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});
