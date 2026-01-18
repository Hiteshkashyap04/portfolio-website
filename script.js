document.addEventListener("DOMContentLoaded", () => {
    // --- VARIABLES ---
    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".navbar ul li a");
    const typing = document.getElementById("typing");
    const heroInner = document.getElementById("heroInner");
    
    // Modal Elements
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalContent = document.getElementById("modalContent");
    const closeBtn = document.getElementById("closeBtn");
    
    // Project Cards
    const quizCard = document.getElementById("project-quiz");
    const plantCard = document.getElementById("project-plant");
  
    // --- MENU TOGGLE ---
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  
    // Close menu when a link is clicked (Mobile UX)
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        if (navLinks.classList.contains("show")) {
          navLinks.classList.remove("show");
        }
      });
    });
  
    // --- TYPING EFFECT ---
    const texts = [
      "Computer Science Student",
      "Java Developer",
      "AI & ML Enthusiast",
      "Problem Solver"
    ];
  
    let i = 0, j = 0;
    let isDeleting = false;
  
    function typeEffect() {
      const currentText = texts[i];
      
      if (isDeleting) {
        typing.textContent = currentText.substring(0, j--);
      } else {
        typing.textContent = currentText.substring(0, j++);
      }
  
      let speed = isDeleting ? 60 : 100;
  
      if (!isDeleting && j === currentText.length) {
        isDeleting = true;
        speed = 2000; // Pause at end of word
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % texts.length;
        speed = 500; // Pause before new word
      }
  
      setTimeout(typeEffect, speed);
    }
    
    // Start typing
    typeEffect();
  
    // --- SCROLL REVEAL ---
    function checkScroll() {
      const sections = document.querySelectorAll("section");
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.85) {
          sec.classList.add("show");
        }
      });
    }
    
    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Check on load
  
    // --- PARALLAX EFFECT (Desktop Only) ---
    window.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return;
  
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;
  
      heroInner.style.transform = `translate(${x}px, ${y}px)`;
    });
  
    // --- MODAL LOGIC ---
    function openModal(title, desc) {
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.style.display = "flex";
      document.body.classList.add("modal-open");
    }
  
    function closeModal() {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  
    // Event Listeners for Projects
    if(quizCard) {
        quizCard.addEventListener("click", () => {
            openModal("AI Quiz Builder", "AI-powered quiz generation platform using Python and frontend integration.");
        });
    }
  
    if(plantCard) {
        plantCard.addEventListener("click", () => {
            openModal("Plant Disease Detection", "Machine learning model that detects plant diseases from leaf images.");
        });
    }
  
    // Close Modal Events
    closeBtn.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });

    // --- COPY EMAIL FUNCTIONALITY ---
  const copyBtn = document.getElementById("copyBtn");
  const emailText = document.getElementById("emailText");

  if (copyBtn && emailText) {
    copyBtn.addEventListener("click", () => {
      const email = emailText.textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(email).then(() => {
        
        // Visual Feedback (Change icon to Checkmark)
        const icon = copyBtn.querySelector("i");
        icon.classList.remove("fa-copy");
        icon.classList.add("fa-check");
        copyBtn.classList.add("copied");

        // Revert back after 2 seconds
        setTimeout(() => {
          icon.classList.remove("fa-check");
          icon.classList.add("fa-copy");
          copyBtn.classList.remove("copied");
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }
  });