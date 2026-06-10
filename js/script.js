// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle"); // Menu toggle button
  const nav = document.querySelector(".nav"); // Nav menu
  const body = document.body; // Body element for the toggling feature

  if (menuToggle && nav) {
    // Open/close the mobile nav and keep the button's ARIA state in sync so
    // screen readers announce whether the menu is expanded or collapsed.
    const setNavOpen = (open) => {
      nav.classList.toggle("nav-open", open);
      menuToggle.classList.toggle("nav-open", open);
      body.classList.toggle("nav-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    };

    menuToggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("nav-open"));
    });

    // Close the nav when clicking outside it, or when a nav link is chosen.
    document.addEventListener("click", (event) => {
      const clickedInside = nav.contains(event.target) || menuToggle.contains(event.target);
      const clickedLink = event.target.classList.contains("nav__link");
      if (!clickedInside || clickedLink) {
        setNavOpen(false);
      }
    });

    // Escape closes the nav and returns focus to the toggle (keyboard users).
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("nav-open")) {
        setNavOpen(false);
        menuToggle.focus();
      }
    });
  }

  // Handle contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent any default submission
      document.getElementById("responseMessage").style.display = "block"; // Shows the response message
    });
  }

  // ---- Gallery carousel ---------------------------------------------------
  const carousel = document.querySelector(".carousel-slide");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  const dotsContainer = document.querySelector(".carousel-dots");
  const carouselRegion = document.querySelector(".carousel-container");

  if (carousel && prevButton && nextButton && dotsContainer && carouselRegion) {
    const totalSlides = carousel.children.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let counter = 0;
    let autoTimer = null;
    let userPaused = reduceMotion; // honour reduced-motion: start paused
    let hoverPaused = false;

    // Read the slide width live so the carousel stays aligned after a resize
    // (the original cached it once at load, which broke on window resize).
    const slideWidth = () => carousel.clientWidth;

    // Build one real <button> per slide so the dots are keyboard-operable.
    const dots = [];
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to image ${i + 1} of ${totalSlides}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        const isActive = index === counter;
        dot.classList.toggle("active", isActive);
        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function render(animate = true) {
      carousel.style.transition = animate && !reduceMotion ? "transform 0.4s ease-in-out" : "none";
      carousel.style.transform = `translateX(${-slideWidth() * counter}px)`;
      updateDots();
    }

    function goToSlide(index) {
      counter = (index + totalSlides) % totalSlides; // wrap around either end
      render();
    }
    const nextSlide = () => goToSlide(counter + 1);
    const prevSlide = () => goToSlide(counter - 1);

    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    // Arrow keys move the carousel while any of its controls have focus.
    carouselRegion.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      }
    });

    window.addEventListener("resize", () => render(false));

    // ---- Auto-advance + pause/play (WCAG 2.2.2: moving content is pausable) --
    const playToggle = document.createElement("button");
    playToggle.type = "button";
    playToggle.className = "carousel-play-toggle";

    function applyAuto() {
      const shouldRun = !userPaused && !hoverPaused;
      if (shouldRun && !autoTimer) {
        autoTimer = setInterval(nextSlide, 4000);
      } else if (!shouldRun && autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      // Stay silent while slides auto-advance; announce once it's paused.
      carousel.setAttribute("aria-live", autoTimer ? "off" : "polite");
    }

    function syncToggle() {
      playToggle.textContent = userPaused ? "▶" : "❚❚"; // play / pause
      playToggle.setAttribute("aria-pressed", String(userPaused));
      playToggle.setAttribute(
        "aria-label",
        userPaused ? "Play automatic slideshow" : "Pause automatic slideshow"
      );
    }

    playToggle.addEventListener("click", () => {
      userPaused = !userPaused;
      applyAuto();
      syncToggle();
    });
    carouselRegion.appendChild(playToggle);

    // Pause while the user hovers or keyboard-focuses anywhere in the carousel.
    carouselRegion.addEventListener("mouseenter", () => {
      hoverPaused = true;
      applyAuto();
    });
    carouselRegion.addEventListener("mouseleave", () => {
      hoverPaused = false;
      applyAuto();
    });
    carouselRegion.addEventListener("focusin", () => {
      hoverPaused = true;
      applyAuto();
    });
    carouselRegion.addEventListener("focusout", (event) => {
      if (!carouselRegion.contains(event.relatedTarget)) {
        hoverPaused = false;
        applyAuto();
      }
    });

    render(false);
    syncToggle();
    applyAuto();
  }
});
