const validator = require('validator');

/**
 * Custom heuristics for URL analysis
 */
const analyzeHeuristics = (url) => {
    const findings = [];
    let score = 0;

    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const path = urlObj.pathname;

        // 1. URL Length (Common in phishing)
        if (url.length > 75) {
            findings.push({ category: 'Suspicious URL', detail: 'URL is unusually long, common in phishing attempts.' });
            score += 15;
        }

        // 2. Suspicious Keywords
        const suspiciousKeywords = ['login', 'verify', 'update', 'account', 'secure', 'banking', 'wp-admin', 'signin', 'ebayisapi', 'paypal'];
        const matchedKeywords = suspiciousKeywords.filter(keyword => url.toLowerCase().includes(keyword));
        if (matchedKeywords.length > 0) {
            findings.push({ category: 'Suspicious Keywords', detail: `URL contains suspicious keywords: ${matchedKeywords.join(', ')}` });
            score += 20 * matchedKeywords.length;
        }

        // 3. IP Address instead of Domain
        if (validator.isIP(domain)) {
            findings.push({ category: 'DANGER', detail: 'URL uses an IP address instead of a domain name, a high indicator of malicious activity.' });
            score += 40;
        }

        // 4. Suspicious TLDs
        const suspiciousTLDs = ['.xyz', '.top', '.rest', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.uno'];
        if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
            findings.push({ category: 'Suspicious TLD', detail: `The domain uses a low-reputation TLD (${domain.split('.').pop()}).` });
            score += 10;
        }

        // 5. Homograph Attack (Subdomain looks like common domain)
        const commonDomains = ['google', 'facebook', 'microsoft', 'apple', 'amazon', 'paypal', 'netflix'];
        commonDomains.forEach(common => {
            if (domain.includes(common) && !domain.endsWith(`${common}.com`) && !domain.endsWith(`${common}.net`)) {
                findings.push({ category: 'Potential Impersonation', detail: `Domain contains '${common}', but doesn't seem to be the official site.` });
                score += 30;
            }
        });

        // 6. Excessive Subdomains
        const subdomains = domain.split('.');
        if (subdomains.length > 3) {
            findings.push({ category: 'Subdomain Spam', detail: 'URL has too many subdomains, which is often used to hide the actual domain.' });
            score += 15;
        }

    } catch (error) {
        findings.push({ category: 'Invalid URL', detail: 'The provided URL is not well-formed.' });
        score = 100;
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return { score, findings };
};

module.exports = { analyzeHeuristics };
