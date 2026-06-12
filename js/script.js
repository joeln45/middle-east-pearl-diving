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

  // ---- Colour theme toggle -----------------------------------------------
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const root = document.documentElement;
    const syncThemeToggle = () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    };
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage may be unavailable (private mode) — ignore */
      }
      syncThemeToggle();
    });
    syncThemeToggle();
  }

  // ---- Contact form: client-side validation + Formspree submit -----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    // Disable native validation only now that JS is running, so no-JS visitors
    // still get the browser's checks while we control the messages here.
    contactForm.setAttribute("novalidate", "");

    const responseMessage = document.getElementById("responseMessage");
    const submitButton = contactForm.querySelector("button[type='submit']");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = [
      {
        input: contactForm.elements["name"],
        errorId: "name-error",
        validate: (value) => (value.trim() ? "" : "Please enter your name."),
      },
      {
        input: contactForm.elements["email"],
        errorId: "email-error",
        validate: (value) => {
          if (!value.trim()) return "Please enter your email address.";
          return emailPattern.test(value.trim()) ? "" : "Please enter a valid email address.";
        },
      },
      {
        input: contactForm.elements["message"],
        errorId: "message-error",
        validate: (value) => (value.trim() ? "" : "Please enter a message."),
      },
    ];

    function showFieldError(field, message) {
      document.getElementById(field.errorId).textContent = message;
      field.input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateField(field) {
      const message = field.validate(field.input.value);
      showFieldError(field, message);
      return message === "";
    }

    // Instant feedback: check on blur, then clear the error as the user fixes
    // it — but don't show an error before they've had a go at the field.
    fields.forEach((field) => {
      field.input.addEventListener("blur", () => validateField(field));
      field.input.addEventListener("input", () => {
        if (field.input.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    function setResponse(message, isError) {
      responseMessage.textContent = message;
      responseMessage.classList.toggle("is-error", isError);
      responseMessage.style.display = "block";
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        if (!validateField(field) && !firstInvalid) firstInvalid = field.input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      submitButton.disabled = true;
      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          contactForm.reset();
          fields.forEach((field) => showFieldError(field, ""));
          setResponse("Thank you! Your message has been sent.", false);
        } else {
          const data = await response.json().catch(() => null);
          const detail =
            data && data.errors
              ? data.errors.map((err) => err.message).join(" ")
              : "Sorry, something went wrong. Please try again later.";
          setResponse(detail, true);
        }
      } catch {
        setResponse("Network error — please check your connection and try again.", true);
      } finally {
        submitButton.disabled = false;
      }
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
