document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // HERO FADE ANIMATION
    // ============================
    const heroContent = document.querySelector(".hero__content");
    if (heroContent) {
        setTimeout(() => heroContent.classList.add("show"), 200);
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
    const words = ["Om Jadhav", "Web Developer", "Cybersecurity Enthusiast"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
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

    // ============================
    // NAVBAR SCROLL EFFECT
    // ============================
    const nav = document.querySelector(".nav");
    window.addEventListener("scroll", () => {
        if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
    });

    // ============================
    // ACTIVE LINK HIGHLIGHT
    // ============================
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav__list a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
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
    // MOBILE NAV TOGGLE
    // ============================
    const toggle = document.querySelector(".nav__toggle");
    const menu   = document.querySelector(".nav__list");
    if (toggle && menu) {
        toggle.addEventListener("click", () => menu.classList.toggle("active"));
    }

    // ============================
    // CONTACT FORM SUBMISSION
    // ============================
    const form  = document.getElementById("contactForm");
    const popup = document.getElementById("successPopup");
    const btn   = document.getElementById("sendBtn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            btn.innerText = "Sending...";
            btn.disabled  = true;

            try {
                const response = await fetch("/submit_form", {
                    method: "POST",
                    body: new FormData(form)
                });

                if (response.ok) {
                    form.reset();
                    requestAnimationFrame(() => popup.classList.add("active"));
                    btn.classList.add("success");
                    btn.innerText = "Sent ✓";
                    setTimeout(() => {
                        popup.classList.add("closing");
                        setTimeout(() => popup.classList.remove("active", "closing"), 400);
                    }, 3200);
                } else {
                    alert("Failed to send message");
                }
            } catch (error) {
                console.error("Server error:", error);
            }

            setTimeout(() => {
                btn.classList.remove("success");
                btn.innerText = "Send Message";
                btn.disabled  = false;
            }, 2000);
        });
    }

    if (popup) {
        popup.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.classList.add("closing");
                setTimeout(() => popup.classList.remove("active", "closing"), 400);
            }
        });
    }

    // ============================
    // SCROLL REVEAL
    // ============================
    // Elements to reveal — each can have a custom delay via data-delay attribute
    const revealElements = document.querySelectorAll(
        ".service-card, .section__title, .tech-category, .tech-slider, .projects, .contact-form, .contact img, .footer"
    );

    // Set initial hidden state
    revealElements.forEach((el, i) => {
        el.style.opacity    = "0";
        el.style.transform  = "translateY(30px)";
        el.style.transition = `opacity 0.6s ease ${el.dataset.delay || "0s"}, transform 0.6s ease ${el.dataset.delay || "0s"}`;
    });

    // Stagger service cards individually
    document.querySelectorAll(".service-card").forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target); // only animate once
            }
        });
    }, {
        threshold: 0.12  // trigger when 12% of element is visible
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================
    // PROJECT CAROUSEL
    // ============================
    const wrapper = document.querySelector(".projects");
    const track   = document.querySelector(".projects__track");

    if (wrapper && track) {

        const GAP         = 30;
        const DURATION    = 35;
        const TOTAL_CARDS = 3;

        let cardWidth   = 0;
        let mobileIndex = 0;
        let mobileMode  = false;

        function setCardWidths() {
            mobileMode = window.innerWidth <= 768;
            cardWidth  = mobileMode
                ? wrapper.offsetWidth - 40
                : Math.floor((wrapper.offsetWidth - GAP * 2) / 3);

            track.querySelectorAll(".project-card").forEach(card => {
                card.style.width = cardWidth + "px";
            });

            if (mobileMode) {
                stopAutoScroll();
                goToCard(mobileIndex, false);
            } else {
                startAutoScroll();
            }
        }

        function getTranslateX() {
            return new DOMMatrix(window.getComputedStyle(track).transform).m41;
        }

        function startAutoScroll() {
            track.style.transition   = "";
            track.style.transform    = "";
            track.style.animation    = "none";
            void track.offsetWidth;
            track.style.animation    = `infiniteScroll ${DURATION}s linear infinite`;
        }

        function stopAutoScroll() {
            track.style.animation = "none";
            track.style.transform = "translateX(0px)";
        }

        function resumeFromPosition() {
            const totalW   = track.scrollWidth / 2;
            let   norm     = getTranslateX() % totalW;
            if (norm > 0)  norm -= totalW;
            const progress = Math.abs(norm) / totalW;

            track.style.transform      = "";
            track.style.animation      = "none";
            void track.offsetWidth;
            track.style.animation      = "";
            track.style.animationDelay = `-${(progress * DURATION).toFixed(2)}s`;
        }

        function goToCard(index, animate = true) {
            mobileIndex = ((index % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;
            const offset = -(mobileIndex * (cardWidth + GAP));
            track.style.transition = animate ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "";
            track.style.transform  = `translateX(${offset}px)`;
        }

        let dotsContainer = document.querySelector(".projects-dots");
        if (!dotsContainer) {
            dotsContainer = document.createElement("div");
            dotsContainer.className = "projects-dots";
            wrapper.after(dotsContainer);
        }

        function buildDots() {
            dotsContainer.innerHTML = "";
            for (let i = 0; i < TOTAL_CARDS; i++) {
                const dot = document.createElement("span");
                dot.className = "projects-dot" + (i === mobileIndex ? " active" : "");
                dot.addEventListener("click", () => { goToCard(i); updateDots(); });
                dotsContainer.appendChild(dot);
            }
            dotsContainer.style.display = mobileMode ? "flex" : "none";
        }

        function updateDots() {
            dotsContainer.querySelectorAll(".projects-dot")
                .forEach((d, i) => d.classList.toggle("active", i === mobileIndex));
        }

        // Touch drag (mobile snap)
        let touchStartX = 0, touchDX = 0, isTouchDragging = false;

        track.addEventListener("touchstart", e => {
            if (!mobileMode) return;
            touchStartX     = e.touches[0].clientX;
            touchDX         = 0;
            isTouchDragging = true;
            track.style.transition = "none";
        }, { passive: true });

        track.addEventListener("touchmove", e => {
            if (!mobileMode || !isTouchDragging) return;
            touchDX = e.touches[0].clientX - touchStartX;
            const baseOffset = -(mobileIndex * (cardWidth + GAP));
            track.style.transform = `translateX(${baseOffset + touchDX}px)`;
        }, { passive: true });

        track.addEventListener("touchend", () => {
            if (!mobileMode || !isTouchDragging) return;
            isTouchDragging = false;
            const threshold = cardWidth * 0.25;
            if      (touchDX < -threshold) goToCard(mobileIndex + 1);
            else if (touchDX >  threshold) goToCard(mobileIndex - 1);
            else                           goToCard(mobileIndex);
            updateDots();
        });

        // Mouse drag (desktop)
        let isDragging = false, startX = 0, originOffset = 0;

        track.addEventListener("mouseenter", () => {
            if (!isDragging && !mobileMode) track.classList.add("is-paused");
        });
        track.addEventListener("mouseleave", () => {
            if (!isDragging && !mobileMode) track.classList.remove("is-paused");
        });

        track.addEventListener("mousedown", e => {
            if (mobileMode) return;
            isDragging   = true;
            startX       = e.clientX;
            originOffset = getTranslateX();
            track.classList.add("is-dragging");
            e.preventDefault();
        });

        document.addEventListener("mousemove", e => {
            if (!isDragging || mobileMode) return;
            track.style.transform = `translateX(${originOffset + (e.clientX - startX)}px)`;
        });

        document.addEventListener("mouseup", () => {
            if (!isDragging || mobileMode) return;
            isDragging = false;
            track.classList.remove("is-dragging", "is-paused");
            resumeFromPosition();
        });

        // Mobile tap-to-expand overlay
        let tapStartX = 0, tapStartY = 0, tapStartTime = 0;

        track.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("touchstart", e => {
                tapStartX    = e.touches[0].clientX;
                tapStartY    = e.touches[0].clientY;
                tapStartTime = Date.now();
            }, { passive: true });

            card.addEventListener("touchend", e => {
                if (!mobileMode) return;
                const dx      = Math.abs(e.changedTouches[0].clientX - tapStartX);
                const dy      = Math.abs(e.changedTouches[0].clientY - tapStartY);
                const elapsed = Date.now() - tapStartTime;
                if (elapsed < 200 && dx < 10 && dy < 10) {
                    track.querySelectorAll(".project-card.tapped").forEach(c => {
                        if (c !== card) c.classList.remove("tapped");
                    });
                    card.classList.toggle("tapped");
                }
            });
        });

        document.addEventListener("touchend", e => {
            if (!e.target.closest(".project-card")) {
                track.querySelectorAll(".project-card.tapped")
                     .forEach(c => c.classList.remove("tapped"));
            }
        });

        // Init
        setCardWidths();
        buildDots();
        window.addEventListener("resize", () => {
            setCardWidths();
            buildDots();
        });
    }

});