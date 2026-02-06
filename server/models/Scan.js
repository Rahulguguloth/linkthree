const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    riskScore: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Safe', 'Suspicious', 'Unsafe'],
        required: true
    },
    findings: [
        {
            category: String,
            detail: String
        }
    ],
    summary: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Scan', ScanSchema);
