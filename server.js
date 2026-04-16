const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve static files from the root directory

// In-memory "database" for demonstration (can be replaced with MongoDB/MySQL)
const enquiries = [];

// API Endpoint to handle contact form submissions
app.post('/api/enquiry', (req, res) => {
    const { name, phone, location, monthlyBill, interestedProduct } = req.body;

    // Basic validation
    if (!name || !phone || !location || !monthlyBill) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    const newEnquiry = {
        id: enquiries.length + 1,
        name,
        phone,
        location,
        monthlyBill,
        interestedProduct: interestedProduct || 'General Inquiry',
        timestamp: new Date().toISOString()
    };

    enquiries.push(newEnquiry);

    // For now, we log the enquiry to the console
    console.log('\n--- New Solar Enquiry Received ---');
    console.table(newEnquiry);
    console.log('----------------------------------\n');

    // Respond to the client
    res.status(200).json({
        success: true,
        message: `Thank you, ${name}! Your enquiry for ${newEnquiry.interestedProduct} has been received.`,
        enquiryId: newEnquiry.id
    });
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

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
🚀 GS Powertech Backend is running!
-----------------------------------
📡 Server: http://localhost:${PORT}
📁 Static Files: Serving from current directory
-----------------------------------
Ready to receive enquiries.
        `);
    });
}

module.exports = app;
