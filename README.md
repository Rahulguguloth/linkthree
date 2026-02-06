# LinkGuard AI - URL Security Analyzer

LinkGuard AI is a sophisticated web tool that analyzes URLs for security risks using a combination of advanced heuristics and global reputation APIs like Google Safe Browsing and VirusTotal.

## Features
- **Real-time Heuristic Analysis**: Checks for suspicious keywords, URL length, homograph attacks, and more.
- **Global API Integration**: Leverages Google Safe Browsing and VirusTotal for comprehensive threat detection.
- **Risk Assessment**: Returns a clear percentage score and detailed risk categorization.
- **Scan History**: Keeps track of recently analyzed URLs with a persistent database.
- **Premium UI**: Modern, glassmorphism-based design with smooth animations.

## Tech Stack
- **Frontend**: React (Vite), Framer Motion, Lucide React
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)
- API Keys:
  - [Google Safe Browsing API Key](https://developers.google.com/safe-browsing/v4/get-started)
  - [VirusTotal API Key](https://www.virustotal.com/gui/join-us)

## Setup Instructions

### 1. Unified Installation
From the root directory, run:
```bash
npm run install-all
```
This will install dependencies for the root, server, and client.

### 2. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-analyzer
GOOGLE_SAFE_BROWSING_API_KEY=YOUR_KEY_HERE
VIRUSTOTAL_API_KEY=YOUR_KEY_HERE
```

### 3. Run the Project
From the root directory, you can now start both the frontend and backend with a single command:
```bash
npm start
```
This uses `concurrently` to run the analysis server and the React dev environment side by side.

The application will be available at `http://localhost:5173`.

## How it Works
1. **Heuristics**: The server immediately checks the URL string for common phishing patterns (IP addresses, specific keywords, unusual TLDs).
2. **APIs**: Parallel requests are sent to Google and VirusTotal to check against known malicious databases.
3. **Scoring**: A weighted algorithm combines all findings into a final risk percentage.
4. **Summary**: An AI-like summary provides a human-readable explanation of why the URL was categorized as Safe, Suspicious, or Unsafe.
