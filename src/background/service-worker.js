import { githubAPI } from "./githubAPI.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  function normalizeProblemUrl(urlStr) {
    if (!urlStr) return "";
    let cUrl = urlStr.split('?')[0].replace(/\/+$/, ''); // Remove trailing slashes and query params
    
    // 1. Codeforces
    const cfContestRegex = /^https?:\/\/(www\.)?codeforces\.com\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/;
    const matchCfContest = cUrl.match(cfContestRegex);
    if (matchCfContest) return `https://codeforces.com/problemset/problem/${matchCfContest[2]}/${matchCfContest[3]}`;
    
    const cfProblemsetRegex = /^https?:\/\/(www\.)?codeforces\.com\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/;
    const matchCfProblemset = cUrl.match(cfProblemsetRegex);
    if (matchCfProblemset) return `https://codeforces.com/problemset/problem/${matchCfProblemset[2]}/${matchCfProblemset[3]}`;

    // 2. LeetCode
    const lcRegex = /^https?:\/\/(www\.)?leetcode\.com\/problems\/([a-zA-Z0-9-]+)/;
    const matchLc = cUrl.match(lcRegex);
    if (matchLc) return `https://leetcode.com/problems/${matchLc[2]}/`;

    // 3. CodeChef
    const ccRegex = /^https?:\/\/(www\.)?codechef\.com\/.*problems\/([A-Za-z0-9_]+)/;
    const matchCc = cUrl.match(ccRegex);
    if (matchCc) return `https://www.codechef.com/problems/${matchCc[2]}`;

    // 4. GeeksForGeeks
    const gfgRegex = /^https?:\/\/(www\.)?geeksforgeeks\.org\/problems\/([a-zA-Z0-9-]+)/;
    const matchGfg = cUrl.match(gfgRegex);
    if (matchGfg) return `https://www.geeksforgeeks.org/problems/${matchGfg[2]}/1`;

    // 5. InterviewBit
    const ibRegex = /^https?:\/\/(www\.)?interviewbit\.com\/problems\/([a-zA-Z0-9-]+)/;
    const matchIb = cUrl.match(ibRegex);
    if (matchIb) return `https://www.interviewbit.com/problems/${matchIb[2]}/`;

    return cUrl;
  }

  if (msg.action === "checkSolvedStatus") {
    githubAPI.getIndex().then(index => {
      let path = null;
      const cleanUrl = normalizeProblemUrl(msg.url);
      for (const key in index) {
        if (normalizeProblemUrl(key) === cleanUrl) {
          path = index[key];
          break;
        }
      }
      if (path && sender.tab) {
        chrome.action.setIcon({ tabId: sender.tab.id, path: "icons/logo.png" });
        chrome.storage.local.set({ [`tab_${sender.tab.id}_path`]: path });
      }
      sendResponse({ solved: !!path, path });
    }).catch(() => sendResponse({ solved: false }));
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    const isRestricted = !tab.url || 
      (!tab.url.startsWith("http://") && 
       !tab.url.startsWith("https://") && 
       !tab.url.startsWith("file://")) || 
      tab.url.startsWith("https://chrome.google.com/webstore") ||
      tab.url.startsWith("https://microsoftedge.microsoft.com/addons");

    if (isRestricted) {
      chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_SIDEBAR" }).catch(e => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content/tagMapper.js", "src/content/content.js"]
      }).then(() => {
        chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_SIDEBAR" });
      }).catch(err => {
        console.error("Failed to inject sidebar script:", err);
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
      });
    });
  }
});
