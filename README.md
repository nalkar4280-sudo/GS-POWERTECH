# GS Powertech - Solar Solutions Platform ☀️

Welcome to the **GS Powertech** platform! This is a complete, responsive modern web application and companion mobile app designed for a leading solar energy provider in Jalgaon.

## 🚀 Features

### 1. The Website
A beautifully crafted frontend experience designed to convert leads and provide information:
- **Responsive Layout**: Adapts perfectly across Desktop, Tablet, and Mobile.
- **Glassmorphism UI**: Uses modern translucent styling for a premium aesthetic.
- **Dynamic Filtering**: Easy tracking of Solar Product Packages (Residential, Commercial, Industrial).
- **Direct Mail Integration**: The "Book Free Consultation" form automatically sends native emails using FormSubmit via AJAX, with zero backend emailing setup required.
- **WhatsApp Direct Connect**: Visitors can click to instantly message via WhatsApp.

### 2. The Mobile Scanner App (`gs-power-app`)
A React Native (Expo) companion mobile application designed to scan solar equipment hardware:
- **Barcode/QR Scanner**: Uses the device camera to natively scan equipment IDs rapidly.
- **Backend Logging**: Intercepts scan data and logs it dynamically to the live server.
- **Direct WhatsApp Chat**: Built-in chat links for quick customer service on-the-go.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (GSAP & Lenis for buttery smooth animations)
- **Backend Server**: Node.js, Express.js
- **Mobile Application**: React Native, Expo
- **Form Handling**: FormSubmit (Serverless Emailing)

---

## ⚙️ How to Run

### 1. Running the Website Locally
Execute the automated batch file from your system to host the website and start the logging server at `http://localhost:5000`:
```bash
run_website.bat
```

### 2. Running the Mobile App
Navigate into the `gs-power-app` folder and start the Expo bundler using the Windows-optimized command:
```bash
cd gs-power-app
start_app.bat
```
Then use the Expo Go app on your phone to scan the generated QR code and test the mobile application!

---
*Developed securely and rapidly.*
