// GS Powertech - Premium Interactivity & Animations
// Author: Antigravity AI

document.addEventListener('DOMContentLoaded', () => {

    // 0. Premium Logo Intro Animation
    const loaderTl = gsap.timeline();
    
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';

    // Cinematic Entrance with Circular Motion
    loaderTl.fromTo("#intro-main-logo", 
        { opacity: 0, scale: 0.5, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.5)" }
    )
    .fromTo("#loading-ring", 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.8"
    )
    .fromTo(["#intro-subtext", "#loading-text"],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        "-=0.6"
    );

    // Continuous Circular Motion for Loading Ring
    gsap.to("#loading-ring", {
        rotation: 360,
        duration: 1.5,
        repeat: -1,
        ease: "linear"
    });

    // Loading Text Pulse Effect
    gsap.to("#loading-text", {
        opacity: 0.4,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Professional Exit
    loaderTl.to(".intro-logo-container", {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power3.in",
        delay: 1.5 // Keep it on screen for 1.5 seconds after entrance
    })
    // Fade out the black background completely
    .to("#page-loader", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            document.body.style.overflow = ''; // Unlock scroll
            document.getElementById('page-loader').style.display = 'none';
        }
    });
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Smooth Scrolling (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // 3. GSAP Animations & ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Entrance
    const heroTl = gsap.timeline({ delay: 4.5 }); // Wait for cinematic logo intro
    heroTl.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    })
    .from(".hero-img", {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1");

    // Parallax effect on Hero Image
    gsap.to(".hero-img", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Reveal animations for all sections
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Stagger animation for Stats Cards
    gsap.from(".stat-card", {
        scrollTrigger: {
            trigger: ".stats-container",
            start: "top 85%"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)"
    });

    // Timeline Animation
    gsap.from(".timeline-item", {
        scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%"
        },
        x: -50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Navbar Glass Effect on Scroll
    const nav = document.querySelector('nav');
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.direction === 1) {
                gsap.to(nav, { y: -100, opacity: 0, duration: 0.3 });
            } else {
                gsap.to(nav, { y: 0, opacity: 1, duration: 0.3 });
            }
        }
    });

    // Floating Button subtle pulse
    gsap.to(".whatsapp-float", {
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut"
    });

    // 4. Product Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const isVisible = filterValue === 'all' || card.getAttribute('data-category') === filterValue;

                if (isVisible) {
                    card.style.display = 'block';
                    gsap.fromTo(card,
                        { opacity: 0, scale: 0.9 },
                        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                    );
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // 5. Product Interest Tracking
    const enquireBtns = document.querySelectorAll('.enquire-btn');
    const productField = document.getElementById('interestedProduct');

    enquireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.getAttribute('data-product');
            if (productField) {
                productField.value = product;
            }
        });
    });

    // 6. Form Submission
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            const formData = {
                Name: document.getElementById('contactName').value,
                Phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                Location: document.getElementById('contactLocation').value,
                MonthlyBill: "₹ " + document.getElementById('contactBill').value,
                InterestedProduct: productField ? productField.value : 'General Inquiry',
                _subject: "New Solar Consultation Enquiry!",
                _template: "table",
                _autoresponse: "Dear Valued Customer,\n\nThank you for contacting GS Powertech.\n\nWe have successfully received your request for a free solar consultation. One of our energy specialists will review your details and reach out to you shortly.\n\nBest regards,\nTeam GS Powertech\nPhone: 9527173271\nEmail: gspowertechsolaragency@gmail.com"
            };

            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            try {
                // 1. Save to database first
                try {
                    const dbResponse = await fetch('/api/enquiry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: formData.Name,
                            phone: formData.Phone,
                            email: formData.email,
                            location: formData.Location,
                            monthlyBill: formData.MonthlyBill,
                            interestedProduct: formData.InterestedProduct
                        })
                    });
                    if (!dbResponse.ok) console.error("Failed to save to database");
                } catch (dbErr) {
                    console.error("Error communicating with database API:", dbErr);
                }

                // 2. Send Email via FormSubmit (async background fallback)
                try {
                    fetch('https://formsubmit.co/ajax/gspowertechsolaragency@gmail.com', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(formData)
                    }).catch(err => console.error("FormSubmit background error:", err));
                } catch (emailErr) {
                    console.error("Email submission failed:", emailErr);
                }

                const showSuccessUI = () => {
                    const formEl = document.getElementById('consultationForm');
                    const successEl = document.getElementById('successMessage');
                    if (formEl && successEl) {
                        formEl.style.display = 'none';
                        successEl.style.display = 'flex';
                        gsap.fromTo(successEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" });
                    }
                };

                showSuccessUI();
                form.reset();
                if (productField) productField.value = "General Inquiry";

            } catch (error) {
                console.error("Submission error:", error);
                const formEl = document.getElementById('consultationForm');
                const successEl = document.getElementById('successMessage');
                if (formEl && successEl) {
                    formEl.style.display = 'none';
                    successEl.style.display = 'flex';
                }
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }

    // 7. QR Scanner Logic
    let html5QrcodeScanner;
    const scannerModal = document.getElementById('scanner-modal');
    const openScannerBtn = document.getElementById('open-scanner');
    const closeScannerBtn = document.getElementById('close-scanner');
    const scanResultEl = document.getElementById('scan-result');

    const startScanner = () => {
        scannerModal.style.display = 'flex';
        scanResultEl.innerText = "Initializing Camera...";

        html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        html5QrcodeScanner.render((decodedText) => {
            scanResultEl.innerText = `Scanned: ${decodedText}`;

            fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber: decodedText, timestamp: new Date().toISOString() })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Scan logged:", data);
                alert(`Device ${decodedText} scanned and logged successfully!`);
                stopScanner();
            })
            .catch(err => console.error("Scan logging error:", err));

        }, (error) => {
            // Silence noise
        });
    };

    const stopScanner = () => {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().then(() => {
                scannerModal.style.display = 'none';
            }).catch(err => {
                console.error("Scanner clear error", err);
                scannerModal.style.display = 'none';
            });
        } else {
            scannerModal.style.display = 'none';
        }
    };

    if (openScannerBtn) openScannerBtn.addEventListener('click', startScanner);
    if (closeScannerBtn) closeScannerBtn.addEventListener('click', stopScanner);

    // 8. Product Card Hover Interactions
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('.card-img');
            if (img) gsap.to(img, { scale: 1.05, duration: 0.5 });
        });
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.card-img');
            if (img) gsap.to(img, { scale: 1, duration: 0.5 });
        });
    });

    // 9. Customer Feedback Logic
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingInput = document.getElementById('feedbackRating');
    const ratingError = document.getElementById('ratingError');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const value = index + 1;
            if (ratingInput) ratingInput.value = value;
            if (ratingError) ratingError.style.display = 'none';

            // Update stars appearance
            stars.forEach((s, i) => {
                if (i < value) {
                    s.style.fill = 'currentColor';
                } else {
                    s.style.fill = 'none';
                }
            });
        });
    });

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (ratingInput.value === '0') {
                ratingError.style.display = 'block';
                return;
            }

            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            const formData = {
                name: document.getElementById('feedbackName').value,
                rating: ratingInput.value,
                opinion: document.getElementById('feedbackOpinion').value,
                timestamp: new Date().toISOString()
            };

            const mailData = {
                Name: formData.name,
                Rating: formData.rating + " out of 5 Stars",
                Feedback: formData.opinion,
                _subject: "⭐ New Customer Feedback - GS Powertech",
                _template: "box",
                _autoresponse: "Dear Customer,\n\nThank you for sharing your valuable feedback with us!\n\nBest regards,\nTeam GS Powertech"
            };

            submitBtn.innerText = "Submitting...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            try {
                // 1. Save to local database first
                let dbSuccess = false;
                try {
                    const response = await fetch('/api/feedback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    if (response.ok) {
                        dbSuccess = true;
                    }
                } catch (dbErr) {
                    console.error("Database feedback save failed:", dbErr);
                }

                // 2. Send Email via FormSubmit (async background fallback)
                try {
                    fetch('https://formsubmit.co/ajax/gspowertechsolaragency@gmail.com', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(mailData)
                    }).catch(err => console.error("Feedback FormSubmit background error:", err));
                } catch (emailErr) {
                    console.error("Feedback email submission failed:", emailErr);
                }

                // Show success UI if database write succeeded or email fetch proceeded
                const formEl = document.getElementById('feedbackForm');
                const successEl = document.getElementById('feedbackSuccessMessage');
                if (formEl && successEl) {
                    formEl.style.display = 'none';
                    successEl.style.display = 'flex';
                    gsap.fromTo(successEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" });
                }
                feedbackForm.reset();
                ratingInput.value = '0';
                stars.forEach(s => {
                    s.style.fill = 'none';
                });
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to submit feedback. Check connection.");
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }

    // 10. AI Chatbot Logic (Smart Rule-Based)
    const chatToggleBtn = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const chatBody = document.getElementById('ai-chat-body');

    if (chatToggleBtn && chatWindow) {
        // Toggle Chat
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
            if (chatWindow.style.display === 'flex') {
                chatWindow.classList.remove('hidden');
                chatInput.focus();
            } else {
                chatWindow.classList.add('hidden');
            }
        });

        // Close Chat
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => {
                chatWindow.style.display = 'none';
                chatWindow.classList.add('hidden');
            });
        }

        // Add Message to UI
        const appendMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
            msgDiv.innerHTML = `<p style="margin:0;">${text}</p>`;
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        // Smart Response Logic
        const getBotResponse = (input) => {
            const lowerInput = input.toLowerCase();
            
            if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('much')) {
                return "Our 3kW residential systems start around ₹1,50,000 before subsidies. However, with the PM Surya Yojana, you can get up to ₹78,000 back! Would you like a precise quote?";
            } else if (lowerInput.includes('work') || lowerInput.includes('how')) {
                return "Solar panels convert sunlight into DC electricity. An inverter then changes it to AC for your home. Excess power goes to the grid, earning you credits via Net Metering!";
            } else if (lowerInput.includes('subsidy') || lowerInput.includes('yojana') || lowerInput.includes('government')) {
                return "The PM Surya Ghar Muft Bijli Yojana offers up to ₹78,000 direct bank transfer (DBT) subsidy for residential systems up to 3kW. We handle all the paperwork for you!";
            } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('call')) {
                return "You can reach us directly at +91 9527173271 or fill out the consultation form on this page.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                return "Hello there! I'm Surya. How can I brighten your day with solar energy information?";
            } else {
                return "That's a great question! For detailed technical answers or a custom quote, please call our expert at +91 9527173271 or use the 'Get Quote' button above.";
            }
        };

        // Handle Form Submission
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userText = chatInput.value.trim();
                if (!userText) return;

                // Add user message
                appendMessage(userText, 'user');
                chatInput.value = '';

                // Simulate "thinking" delay
                setTimeout(() => {
                    const botResponse = getBotResponse(userText);
                    appendMessage(botResponse, 'bot');
                }, 600);
            });
        }
    }
});
