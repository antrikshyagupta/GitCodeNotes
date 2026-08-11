# GitCodeNotes 

GitCodeNotes is a powerful, cross-browser extension designed for competitive programmers and software engineers. It allows you to seamlessly track, organize, and save your coding problems and solutions directly to a GitHub repository as beautifully formatted Markdown files. 

No more scattered local files or lost solutions—keep a clean, centralized, and version-controlled record of your entire problem-solving journey!

[Setup/Working Video](#video) • [Installation](#install) • [Features](#features) • [Configuration](#configuration) • [Usage](#usage) • [Hello :)](#support)

<a id="video"></a>
## Setup/Working Video

<p align="center">
  <a href="https://www.youtube.com/watch?v=pu5EVyXxQco" target="_blank" rel="noopener noreferrer" style="display: inline-block; position: relative; width: 760px; max-width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px rgba(0,0,0,0.18); text-decoration: none;">
    <img src="https://img.youtube.com/vi/pu5EVyXxQco/maxresdefault.jpg" alt="GitCodeNotes setup and working guide" width="760" style="display: block; width: 100%; height: auto; border-radius: 12px;" />
    <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.18);">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 76px; height: 76px; border-radius: 50%; background: rgba(255,255,255,0.9); box-shadow: 0 8px 18px rgba(0,0,0,0.2);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Play video">
          <path d="M8 5.5V18.5L18 12L8 5.5Z" fill="#111827"/>
        </svg>
      </span>
    </span>
  </a>
</p>

Click the thumbnail to watch the setup walkthrough and see how the extension works in practice.

---

<a id="install"></a>
##  Installation

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

<a id="features"></a>
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

<a id="configuration"></a>
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

<a id="usage"></a>
##  Usage

1. Navigate to any coding problem on a supported platform (e.g., a LeetCode problem).
2. Click the **GitCodeNotes** icon in your browser toolbar.
3. The sidebar will slide open. The extension will automatically fetch the problem title.
4. Select the difficulty, add your custom tags, paste your solution code, and write any personal notes.
5. Click **Save to GitHub**.
6. That's it! Your solution, along with the full problem statement, will immediately be committed as a Markdown file in your repository. 

*If you click the extension on an unsupported page (like the Google homepage), it will show a clean fallback page listing all supported platforms.*

---

<a id="support"></a>
## ⭐️ Star this repo

If you find GitCodeNotes helpful, please consider giving it a star ⭐️ on GitHub! It helps others discover the project and keeps the maintainer motivated.

PS: tell your cat i said pspspspsspsss 🐈🐈‍⬛
