const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Check Google Safe Browsing API
 */
const checkGoogleSafeBrowsing = async (url) => {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY') return null;

    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
        client: { clientId: "url-analyzer", clientVersion: "1.0.0" },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
        }
    };

    try {
        const response = await axios.post(endpoint, payload);
        if (response.data && response.data.matches) {
            return {
                isSafe: false,
                reason: 'Google Safe Browsing flagged this URL as malicious.',
                details: response.data.matches
            };
        }
        return { isSafe: true };
    } catch (error) {
        console.error('Google Safe Browsing API Error:', error.message);
        return null; // Fail gracefully
    }
};

/**
 * Check VirusTotal API
 */
const checkVirusTotal = async (url) => {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey || apiKey === 'YOUR_VIRUSTOTAL_API_KEY') return null;

    // First, we need to base64 encode the URL for VT API v3
    // But VT actually prefers common string if it's already in their system
    // For simplicity, we'll try to get report for the URL (requires it to be analyzed before)
    // Or we could submit it. Let's try the URL ID approach.
    const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');

    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: { 'x-apikey': apiKey }
        });

        const stats = response.data.data.attributes.last_analysis_stats;
        const totalMalicious = stats.malicious + stats.suspicious;

        if (totalMalicious > 0) {
            return {
                isSafe: false,
                reason: `VirusTotal: ${totalMalicious} security vendors flagged this URL as malicious or suspicious.`,
                maliciousCount: totalMalicious
            };
        }
        return { isSafe: true };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // URL not found in VT database, we should submit it but for real-time we might skip
            return { isSafe: true, status: 'Not yet analyzed by VirusTotal' };
        }
        console.error('VirusTotal API Error:', error.message);
        return null;
    }
};

module.exports = { checkGoogleSafeBrowsing, checkVirusTotal };
