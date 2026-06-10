// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle"); // Menu toggle button
  const nav = document.querySelector(".nav"); // Nav menu
  const body = document.body; // Body element for the toggling feature

  // Event listener for the menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      // Toggle classes for opeening and closing the nav bar
      nav.classList.toggle("nav-open");
      menuToggle.classList.toggle("nav-open");
      body.classList.toggle("nav-open");
    });
  }

  // Closes the nav bar when a link is clicked
  document.addEventListener("click", (event) => {
    // Check if the click is outside the nav and menuToggle or on a nav link
    if (
      (!nav.contains(event.target) && !menuToggle.contains(event.target)) ||
      event.target.classList.contains("nav__link")
    ) {
      nav.classList.remove("nav-open"); // Close nav
      menuToggle.classList.remove("nav-open"); // Updates the menu toggle button
      body.classList.remove("nav-open"); // Updates the body class
    }
  });

  // Handle contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent any default submission
      document.getElementById("responseMessage").style.display = "block"; // Shows the response message
    });
  }

  // Carousel
  const carousel = document.querySelector(".carousel-slide"); // Carousel container
  const prevButton = document.querySelector(".carousel-button.prev"); // Previous button
  const nextButton = document.querySelector(".carousel-button.next"); // Next button
  const dotsContainer = document.querySelector(".carousel-dots"); // Dots for carousel indicators

  if (carousel && prevButton && nextButton) {
    let counter = 0; // Current slide index is set to 0
    const size = carousel.clientWidth;
    const totalSlides = carousel.children.length;

    // Create dots for each slide
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dotsContainer.appendChild(dot); // Appends dot to the dots container
    }

    const dots = document.querySelectorAll(".dot"); // Gets all the dots
    updateDots();

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === counter);
      });
    }

    // Function to move the slide
    function moveSlide() {
      carousel.style.transition = "transform 0.4s ease-in-out"; // Set transition for smooth movement
      carousel.style.transform = `translateX(${-size * counter}px)`; // Moves the carousel
      updateDots();
    }

    // Function to loop the slide when reaching the end
    function loopSlide() {
      if (counter >= totalSlides) {
        counter = 0; // Reset to the first slide
      } else if (counter < 0) {
        counter = totalSlides - 1; // Goes to the last slide
      }
      carousel.style.transition = "none"; //
      carousel.style.transform = `translateX(${-size * counter}px)`;
      setTimeout(() => {
        carousel.style.transition = "transform 0.4s ease-in-out";
      }, 10);
    }

    // Event listener for next button
    nextButton.addEventListener("click", () => {
      counter++; // Increments the counter
      moveSlide(); // Moves to the next slide
      if (counter >= totalSlides) {
        setTimeout(loopSlide, 400); // Loops back after a delay
      }
    });

    // Event listener for the previous button
    prevButton.addEventListener("click", () => {
      counter--; // Decrements the counter
      moveSlide(); // Move to the previous slide
      if (counter < 0) {
        setTimeout(loopSlide, 400); // Loops back again after a delay
      }
    });

    // Automatically changes slide after every 4 seconds
    setInterval(() => {
      counter++; // Increments the counter
      if (counter >= totalSlides) {
        counter = 0; // Resets to the first slide
      }
      moveSlide(); // Move to the next slide
    }, 4000);
  }
});
