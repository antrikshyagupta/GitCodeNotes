export function normalizeProblemUrl(urlStr) {
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

export function isSupportedProblemPage(url) {
    const supportedPlatforms = [
      { pattern: /^https:\/\/leetcode\.com\/problems\//, name: "LeetCode" },
      { pattern: /^https:\/\/atcoder\.jp\/contests\/[^\/]+\/tasks\//, name: "AtCoder" },
      { pattern: /^https:\/\/codeforces\.com\/(problemset\/problem|contest\/\d+\/problem)\//, name: "Codeforces" },
      { pattern: /^https:\/\/www\.interviewbit\.com\/problems\//, name: "InterviewBit" },
      { pattern: /^https:\/\/www\.hackerrank\.com\/challenges\//, name: "HackerRank" },
      { pattern: /^https:\/\/www\.geeksforgeeks\.org\/problems\//, name: "GeeksforGeeks" },
      { pattern: /^https:\/\/www\.codechef\.com\/(problems\/|ide|practice\/course\/.+\/problems\/|contests\/.+\/problems\/)/, name: "CodeChef" }
    ];

    return supportedPlatforms.some(platform => platform.pattern.test(url));
  }