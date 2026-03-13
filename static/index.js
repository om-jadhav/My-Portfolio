
document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // HERO FADE ANIMATION
    // ============================
    const heroContent = document.querySelector(".hero__content");

    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add("show");
        }, 200);
    }

    // ============================
    // SUMMARY TYPING EFFECT
    // ============================
    const summaryText = "Computer Engineering student focused on Backend Development and Cybersecurity. Experienced in building secure web applications and developing security-focused tools using Node.js, MongoDB, and Python. Passionate about Cybersecurity, vulnerability assessment, and continuous learning.";

    const typedText = document.getElementById("typed-text");

    if (typedText) {
        let index = 0;

        function typeSummary() {
            if (index < summaryText.length) {
                typedText.textContent += summaryText.charAt(index);
                index++;
                setTimeout(typeSummary, 40);
            }
        }

        typeSummary();
    }

    // ============================
    // ROTATING NAME EFFECT
    // ============================
    const words = [
        "Om Jadhav",
        "Web Developer",
        "Cybersecurity Enthusiast"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const textEl = document.getElementById("rotating-text");

    if (textEl) {

        function typeRotate() {
            const currentWord = words[wordIndex];

            if (!isDeleting) {
                textEl.textContent = currentWord.substring(0, charIndex++);
                if (charIndex === currentWord.length + 1) {
                    setTimeout(() => isDeleting = true, 1200);
                }
            } else {
                textEl.textContent = currentWord.substring(0, charIndex--);
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }

            setTimeout(typeRotate, isDeleting ? 60 : 100);
        }

        typeRotate();
    }
    //============================
    // NAVBAR SCROLL EFFECT
    // ============================

    const nav = document.querySelector(".nav");

    window.addEventListener("scroll", () => {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        }
    });

    // ============================
    // ACTIVE LINK HIGHLIGHT
    // ============================

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav__list a");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // ============================
    // MOBILE TOGGLE
    // ============================

    const toggle = document.querySelector(".nav__toggle");
    const menu = document.querySelector(".nav__list");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }


});
