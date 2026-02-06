const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeHeuristics } = require('./heuristics');
const { checkGoogleSafeBrowsing, checkVirusTotal } = require('./apiIntegrations');
const Scan = require('./models/Scan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/analyze', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // 1. Run Heuristics
        const heuristicResult = analyzeHeuristics(url);
        let totalScore = heuristicResult.score;
        let findings = [...heuristicResult.findings];

        // 2. Run API Integration Checks (Parallel)
        const [gsbResult, vtResult] = await Promise.all([
            checkGoogleSafeBrowsing(url),
            checkVirusTotal(url)
        ]);

        if (gsbResult && !gsbResult.isSafe) {
            findings.push({ category: 'Google Safe Browsing', detail: gsbResult.reason });
            totalScore = Math.max(totalScore, 90); // Hard floor for GSB hits
        }

        if (vtResult && !vtResult.isSafe) {
            findings.push({ category: 'VirusTotal', detail: vtResult.reason });
            totalScore = Math.max(totalScore, 85); // Hard floor for VT hits
        }

        // Final score capping and status determination
        totalScore = Math.min(totalScore, 100);
        let status = 'Safe';
        if (totalScore >= 70) status = 'Unsafe';
        else if (totalScore >= 30) status = 'Suspicious';

        // Summary generation
        let summary = `This URL is categorized as ${status}. `;
        if (status === 'Safe') {
            summary += 'Our analysis found no significant indicators of phishing or malware.';
        } else {
            summary += `We found ${findings.length} potential risk factors, including ${findings[0].category.toLowerCase()}.`;
        }

        // 3. Save to History (Optional - Don't fail if DB is down)
        let savedScan = {
            url,
            riskScore: totalScore,
            status,
            findings,
            summary,
            createdAt: new Date()
        };

        try {
            const newScan = new Scan(savedScan);
            const doc = await newScan.save();
            savedScan = doc; // Use Mongoose doc if saved successfully
        } catch (dbError) {
            console.error('Database Save Error:', dbError.message);
            // We still have savedScan object to return to the user
        }

        res.json(savedScan);
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            suggestion: 'Ensure your back-end dependencies are installed and MongoDB is running (optional).'
        });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]); // Return empty if DB not connected
        }
        const history = await Scan.find().sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        console.error('Fetch History Error:', error.message);
        res.json([]); // Return empty array on error for smoother UI
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
