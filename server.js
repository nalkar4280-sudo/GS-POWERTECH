const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Auto-copy images for animation
const fs = require('fs');
const path = require('path');
try {
    const srcDir = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\d88a6404-8bf5-4054-aa36-cd2e2263c80f';
    const destDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
    if (fs.existsSync(path.join(srcDir, 'media__1777305638185.jpg'))) {
        fs.copyFileSync(path.join(srcDir, 'media__1777305638185.jpg'), path.join(destDir, 'anim1.jpg'));
        fs.copyFileSync(path.join(srcDir, 'media__1777305714668.jpg'), path.join(destDir, 'anim2.jpg'));
        fs.copyFileSync(path.join(srcDir, 'media__1777305714734.jpg'), path.join(destDir, 'anim3.jpg'));
    }
    if (fs.existsSync(path.join(srcDir, 'media__1777307861396.jpg'))) {
        fs.copyFileSync(path.join(srcDir, 'media__1777307861396.jpg'), path.join(destDir, 'intro_logo_white.jpg'));
        fs.copyFileSync(path.join(srcDir, 'media__1777307861436.jpg'), path.join(destDir, 'intro_logo_black.jpg'));
    }
} catch(e) {}

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
if (!process.env.VERCEL) {
    app.use(express.static('./')); // Serve static files from the root directory
}
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey) 
    : null;

if (supabase) {
    console.log('Connected to Supabase successfully.');
    try { fs.writeFileSync(path.join(__dirname, 'supabase_error.txt'), 'Supabase connected! Waiting for forms...'); } catch(e){}
} else {
    console.warn('WARNING: Supabase credentials not found in .env!');
}

// Persistent Consultations Fallback
const consultationsFile = path.join(__dirname, 'consultations.json');
let localConsultations = [];
try {
    if (fs.existsSync(consultationsFile)) {
        localConsultations = JSON.parse(fs.readFileSync(consultationsFile, 'utf8'));
    }
} catch (e) {
    console.error("Could not load consultations.json", e);
}

// Persistent Feedbacks
const feedbacksFile = path.join(__dirname, 'feedbacks.json');
let feedbacks = [];
try {
    if (fs.existsSync(feedbacksFile)) {
        feedbacks = JSON.parse(fs.readFileSync(feedbacksFile, 'utf8'));
    }
} catch (e) {
    console.error("Could not load feedbacks.json", e);
}

// OTP In-memory Store
const otpStore = new Map();

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit phone number is required.' });
    }

    const otp = generateOTP();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Valid for 5 mins

    const apiKey = process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== 'your_fast2sms_api_key_here'
        ? process.env.FAST2SMS_API_KEY : null;
    if (!apiKey) {
        console.warn(`[MOCK FAST2SMS] Simulated OTP for ${phone}: ${otp}`);
        return res.status(200).json({ success: true, mock: true, mockOtp: otp, message: 'OTP simulated (no API key set).' });
    }

    try {
        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${phone}`, {
            method: 'GET'
        });
        const data = await response.json();
        
        if (data.return) {
            return res.status(200).json({ success: true, message: 'OTP sent successfully!' });
        } else {
            console.error('Fast2SMS Error Response:', data);
            return res.status(500).json({ success: false, message: data.message || 'Failed to send OTP.' });
        }
    } catch (err) {
        console.error('Fast2SMS Fetch Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error while sending SMS.' });
    }
});

app.post('/api/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
    }

    const record = otpStore.get(phone);
    if (!record) {
        return res.status(400).json({ success: false, message: 'Please request an OTP first.' });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(phone);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (record.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Success
    otpStore.delete(phone);
    res.status(200).json({ success: true, message: 'Phone verified successfully.' });
});

// API Endpoint to handle contact form submissions
app.post('/api/enquiry', async (req, res) => {
    const { name, phone, email, location, monthlyBill, interestedProduct } = req.body;

    // Basic validation
    if (!name || !phone || !location || !monthlyBill) {
        return res.status(400).json({
            success: false,
            message: 'Name, phone, location, and monthly bill are required.'
        });
    }

    const payload = {
        name,
        phone,
        email: email || '',
        location,
        monthly_bill: monthlyBill,
        interested_product: interestedProduct || 'General Inquiry',
        timestamp: new Date().toISOString()
    };

    let savedToSupabase = false;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('consultations')
                .insert([{
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    location: payload.location,
                    monthly_bill: payload.monthly_bill,
                    interested_product: payload.interested_product
                }]);
            if (error) {
                console.error('Error inserting into Supabase:', error.message);
                try {
                    fs.writeFileSync(path.join(__dirname, 'supabase_error.txt'), JSON.stringify(error, null, 2));
                } catch (e) {}
            } else {
                savedToSupabase = true;
                console.log('Saved to Supabase successfully.');
            }
        } catch (err) {
            console.error('Supabase exception during insert:', err);
        }
    }

    // Always fallback/save to local consultations file
    const localPayload = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        ...payload
    };
    localConsultations.push(localPayload);
    try {
        fs.writeFileSync(consultationsFile, JSON.stringify(localConsultations, null, 2));
    } catch (e) {
        console.error("Could not save to consultations.json", e);
    }

    console.log('\n--- New Solar Enquiry Received ---');
    console.log(`Name: ${payload.name}, Phone: ${payload.phone}`);
    console.log(`Saved to local consultations.json${savedToSupabase ? ' & Supabase' : ' (Supabase insert failed/skipped)'}`);
    console.log('------------------------------------\n');

    res.status(200).json({
        success: true,
        message: `Thank you, ${payload.name}! Your enquiry for ${payload.interested_product} has been received.`
    });
});

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('\n--- Admin Login Attempt ---');
    console.log('Incoming Username:', JSON.stringify(username));
    console.log('Expected Username:', JSON.stringify(process.env.ADMIN_USERNAME));
    console.log('Incoming Password:', JSON.stringify(password));
    console.log('Expected Password:', JSON.stringify(process.env.ADMIN_PASSWORD));
    console.log('Match Username:', username === process.env.ADMIN_USERNAME);
    console.log('Match Password:', password === process.env.ADMIN_PASSWORD);
    console.log('---------------------------\n');

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        res.status(200).json({ success: true, token: process.env.ADMIN_SECRET });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// API Endpoint to get all consultations for Admin
app.get('/api/admin/consultations', async (req, res) => {
    // Basic Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    let supabaseData = [];
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('consultations')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) {
                console.error('Error fetching from Supabase:', error.message);
            } else if (data) {
                supabaseData = data;
            }
        } catch (err) {
            console.error('Supabase exception during fetch:', err);
        }
    }

    // Merge Supabase and local data
    const merged = [...localConsultations];
    supabaseData.forEach(subRecord => {
        const alreadyExists = merged.some(locRecord => 
            locRecord.phone === subRecord.phone && locRecord.name === subRecord.name
        );
        if (!alreadyExists) {
            merged.push({
                ...subRecord,
                monthly_bill: subRecord.monthly_bill || '0'
            });
        }
    });

    // Sort descending by timestamp
    merged.sort((a, b) => {
        const dateA = new Date(a.timestamp || a.created_at || 0);
        const dateB = new Date(b.timestamp || b.created_at || 0);
        return dateB - dateA;
    });

    res.status(200).json({ success: true, data: merged });
});

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Endpoint to send automated email to customer
app.post('/api/admin/send-email', async (req, res) => {
    // Basic Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    const { email, name, productText } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Customer email is required.' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ success: false, message: 'Email credentials not configured on the server.' });
    }

    const mailOptions = {
        from: `"GS Powertech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for your inquiry - GS Powertech',
        text: `Hello ${name || ''},\n\nWe have received your inquiry regarding ${productText || 'General Inquiry'}.\n\nThank you for visiting GS Powertech!\n\nBest Regards,\nGS Powertech Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

// API Endpoint to log equipment scans
app.post('/api/scan', (req, res) => {
    const { serialNumber, timestamp } = req.body;
    
    console.log('\n--- New Equipment Scan Received ---');
    console.log(`Device ID/Serial: ${serialNumber}`);
    console.log(`Time: ${timestamp}`);
    console.log('-------------------------------------\n');

    res.status(200).json({
        success: true,
        message: 'Scan logged successfully'
    });
});

// API Endpoint to handle customer feedback
app.post('/api/feedback', async (req, res) => {
    const { name, rating, opinion, timestamp } = req.body;

    if (!name || rating === undefined || !opinion) {
        return res.status(400).json({
            success: false,
            message: 'Name, rating, and opinion are required.'
        });
    }

    const payload = {
        name,
        rating: parseInt(rating),
        opinion,
        timestamp: timestamp || new Date().toISOString()
    };

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .insert([payload]);
            if (error) {
                console.error('Error inserting feedback into Supabase:', error.message);
            } else {
                console.log('Feedback saved to Supabase.');
            }
        } catch (err) {
            console.error('Supabase feedback insert exception:', err);
        }
    }

    const newFeedback = {
        id: feedbacks.length + 1,
        ...payload
    };

    feedbacks.push(newFeedback);
    try {
        fs.writeFileSync(feedbacksFile, JSON.stringify(feedbacks, null, 2));
    } catch (e) {
        console.error("Could not save to feedbacks.json", e);
    }

    console.log('\n--- New Customer Feedback Received ---');
    console.log(`Name: ${name}`);
    console.log(`Rating: ${rating} / 5 Stars`);
    console.log(`Opinion: ${opinion}`);
    console.log(`Time: ${newFeedback.timestamp}`);
    console.log('----------------------------------------\n');

    res.status(200).json({
        success: true,
        message: 'Feedback received successfully'
    });
});

// API Endpoint to get all feedbacks
app.get('/api/feedbacks', async (req, res) => {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .select('*')
                .order('timestamp', { ascending: false });
            if (!error && data) {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            }
            console.error('Error fetching feedbacks from Supabase:', error?.message);
        } catch (err) {
            console.error('Supabase feedback fetch exception:', err);
        }
    }

    res.status(200).json({
        success: true,
        data: feedbacks
    });
});

// Start the server — auto-finds a free port if the default is busy
if (require.main === module) {
    const startServer = (port) => {
        const server = app.listen(port, () => {
            console.log(`
🚀 GS Powertech Backend is running!
-----------------------------------
📡 Open in browser: http://localhost:${port}
-----------------------------------
Ready to receive enquiries.
            `);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.warn(`⚠️  Port ${port} is busy. Trying port ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
            }
        });
    };

    startServer(PORT);
}

module.exports = app;
