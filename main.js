// GS Powertech - Premium Interactivity & Animations
// Author: Antigravity AI

document.addEventListener('DOMContentLoaded', () => {

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
    // heroTl.from(".hero-content > *", {
    //     y: 40,
    //     opacity: 0,
    //     duration: 0.8,
    //     stagger: 0.2,
    //     ease: "power3.out"
    // })
    // .from(".hero-img", {
    //     scale: 1.1,
    //     opacity: 0,
    //     duration: 1.5,
    //     ease: "power2.out"
    // }, "-=1");

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
        el.style.opacity = "1";
        el.style.transform = "none";
    });

    // Navbar Glass Effect on Scroll
    const nav = document.querySelector('nav');
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.direction === 1) { // Scrolling down
                gsap.to(nav, { y: -100, opacity: 0, duration: 0.3 });
            } else { // Scrolling up
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
            // Update active state
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

    // 6. Form Submission (Connected to Backend)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.innerText;

            // Get form data (Capitalized keys for clean email reading)
            const formData = {
                Name: form.querySelector('input[placeholder="Your Name"]').value,
                Phone: form.querySelector('input[placeholder="+91 00000 00000"]').value,
                Location: form.querySelector('input[placeholder="Area in Jalgaon"]').value,
                MonthlyBill: "₹ " + form.querySelector('input[placeholder="₹ 1500"]').value,
                InterestedProduct: productField ? productField.value : 'General Inquiry',
                _subject: "New Solar Consultation Enquiry!"
            };

            // Animation for submission
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            try {
                // Use FormSubmit to securely send form data to Gmail without needing a backend server
                const response = await fetch('https://formsubmit.co/ajax/gspowertechsolaragency@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("Success! Your consultation request has been emailed to GS Powertech.");
                    form.reset();
                    if (productField) productField.value = "General Inquiry"; // Reset hidden field
                } else {
                    alert("Error submitting the form. Please make sure to activate the email via FormSubmit if this is the first submission!");
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Sorry, there was a connection error. Please try again later or call us directly.");
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
            
            // Send scan data to backend
            fetch('http://localhost:5000/api/scan', {
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

    // 8. Product Card Hover Interactions (GSAP refinement)
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
});
