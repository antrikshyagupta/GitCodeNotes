# GitCodeNotes 

GitCodeNotes is a powerful, cross-browser extension designed for competitive programmers and software engineers. It allows you to seamlessly track, organize, and save your coding problems and solutions directly to a GitHub repository as beautifully formatted Markdown files. 

No more scattered local files or lost solutions—keep a clean, centralized, and version-controlled record of your entire problem-solving journey!

##  Download & Install

### Option 1: Install from Source (Preferred)
If you are cloning or downloading this repository directly from the source code, please note that the root directory contains two manifest files: `manifest-chromium.json` and `manifest-firefox.json`.

Before loading the extension into your browser, you must rename the correct manifest for your browser:
1. Clone or download this repository.
2. **For Chrome/Edge/Brave**: Rename `manifest-chromium.json` to `manifest.json`.
3. **For Firefox**: Rename `manifest-firefox.json` to `manifest.json`.
4. Load the unpacked extension into your browser:
   - **Chromium Browsers**: Go to `chrome://extensions`, turn on **Developer mode**, and click **Load unpacked**. Select the folder.
   - **Firefox**: Go to `about:debugging`, click **This Firefox**, click **Load Temporary Add-on**, and select the `manifest.json` file.

### Option 2: Pre-packaged Releases
Alternatively, you can download the pre-packaged zip files from the Releases page. These packages already have the manifest renamed and configured for your specific browser.

[![Download for Chromium](https://img.shields.io/badge/Download_for-Chromium_(Chrome,_Edge,_Brave)-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/antrikshyagupta/GitCodeNotes/releases/download/v1.0.0/GitCodeNotes-Chromium.zip) <!-- Add your GitHub release link here -->
[![Download for Firefox](https://img.shields.io/badge/Download_for-Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://github.com/antrikshyagupta/GitCodeNotes/releases/download/v1.0.0/GitCodeNotes-Firefox.zip) <!-- Add your GitHub release link here -->

**How to Install:**
1. Click the download button above for your browser and unzip the folder.
2. Load the unpacked extension into your browser:
   - **Chromium Browsers**: Go to `chrome://extensions`, turn on **Developer mode**, and click **Load unpacked**. Select the folder.
   - **Firefox**: Go to `about:debugging`, click **This Firefox**, click **Load Temporary Add-on**, and select the `manifest.json` file.

> [!TIP]
> **Pin for Quick Access 📌**
> After installing, don't forget to click the puzzle piece icon (🧩) in your browser toolbar and "Pin" (📌) GitCodeNotes so you can open the sidebar instantly while coding!

---

## Setup and Working Guide

<p align="center">
  <a href="https://www.youtube.com/watch?v=pu5EVyXxQco" target="_blank" rel="noopener noreferrer">
    <img src="https://img.youtube.com/vi/pu5EVyXxQco/maxresdefault.jpg" alt="GitCodeNotes setup and working guide" width="900" />
  </a>
</p>

Click the thumbnail to watch the setup walkthrough and see how the extension works in practice.

---

##  Features

- **Multi-Platform Support**: Automatically scrapes problem titles, URLs, and complex problem statements (converting MathJax/KaTeX to clean GitHub Markdown) from:
  - LeetCode
  - Codeforces
  - GeeksforGeeks
  - AtCoder
  - CodeChef
  - InterviewBit
  - HackerRank
- **Seamless UI**: Injects a beautiful, non-intrusive sliding sidebar directly into the problem page. (If opened on a restricted tab, gracefully falls back to a full-page view).
- **Rich Tracking**: Save your solution code, personal notes, custom tags, and difficulty level (Easy, Medium, Hard).
- **Edit & Delete**: Easily manage your past submissions directly from the extension UI.
- **Auto-Syncing**: Saves everything directly to your personal GitHub repository via the GitHub API.

---

##  Configuration

Before you can start saving problems, you need to connect the extension to your GitHub account.

1. **Create a GitHub Repository**: Create a new, empty repository on GitHub where you want your notes to be saved (e.g., `cp-tracker`).
2. **Generate a Personal Access Token**:
   - Go to your GitHub Settings -> Developer settings -> Personal access tokens -> **Fine-grained tokens**.
   - Click **Generate new token**.
   - Select your target repository and ensure you grant exactly Read and Write access to the "**Contents"** permission scope.
   - Generate the token and copy it.
3. **Configure the Extension**:
   - Click the GitCodeNotes extension icon in your browser.
   - Click **Go to Settings**.
   - Paste your GitHub Username, your Repository Name, and your Personal Access Token.
   - Click Save!

---

##  Usage

1. Navigate to any coding problem on a supported platform (e.g., a LeetCode problem).
2. Click the **GitCodeNotes** icon in your browser toolbar.
3. The sidebar will slide open. The extension will automatically fetch the problem title.
4. Select the difficulty, add your custom tags, paste your solution code, and write any personal notes.
5. Click **Save to GitHub**.
6. That's it! Your solution, along with the full problem statement, will immediately be committed as a Markdown file in your repository. 

*If you click the extension on an unsupported page (like the Google homepage), it will show a clean fallback page listing all supported platforms.*

---

## ⭐️ Show your support

If you find GitCodeNotes helpful, please consider giving it a star on GitHub! It helps others discover the project and keeps the maintainer motivated.
