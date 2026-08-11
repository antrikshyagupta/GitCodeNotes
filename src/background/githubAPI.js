class GithubAPI {
  async getConfig() {
    const res = await chrome.storage.local.get(["ghPat", "ghOwner", "ghRepo"]);
    if (!res.ghPat || !res.ghOwner || !res.ghRepo) throw new Error("GitHub not configured");
    return res;
  }

  async request(method, path, body = null) {
    const { ghPat, ghOwner, ghRepo } = await this.getConfig();
    const url = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${path}`;
    const options = {
      method,
      headers: {
        "Authorization": `Bearer ${ghPat}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      }
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    if (!res.ok && res.status !== 404) throw new Error(await res.text());
    return res.status === 404 ? null : await res.json();
  }

  async saveProblem(data) {
    const platform = data.url.includes("leetcode") ? "LeetCode" : data.url.includes("codeforces") ? "Codeforces" : data.url.includes("codechef") ? "CodeChef" : data.url.includes("geeksforgeeks") ? "GeeksForGeeks" : data.url.includes("interviewbit") ? "InterviewBit" : "Other";
    const safeTitle = data.question.replace(/[^a-zA-Z0-9-]/g, "-");
    const path = `${platform}/${safeTitle}.md`;

    const content = `---
Difficulty: ${data.level}
Tags: [${data.tags}]
Platform: ${platform}
URL: ${data.url}
Date: ${new Date().toISOString().split('T')[0]}
---

# ${data.question}

${data.revisionNeeded === 'Yes' ? '> [!WARNING]\n> **Revision Needed!**\n\n' : ''}

**Tags:** ${data.tags && data.tags.length > 0 ? data.tags.map(t => '`' + t + '`').join(', ') : 'None'}

<details>
<summary>Problem Statement</summary>
${data.statement || "No statement extracted"}
</details>

## Submission 1 - ${new Date().toISOString().split('T')[0]}

**Notes:**
${data.note || "No notes provided"}

**Code:**
\`\`\`${data.language || ""}
${data.code || ""}
\`\`\`
`;
    const b64Content = btoa(unescape(encodeURIComponent(content)));

    const [existing, existingIndex] = await Promise.all([
      this.request("GET", path),
      this.request("GET", "solved_index.json")
    ]);

    await this.request("PUT", path, {
      message: `Solve ${data.question}`,
      content: b64Content,
      sha: existing ? existing.sha : undefined
    });
    await this.updateIndexWithData(data.url, path, existingIndex);

    return { success: true, path };
  }


  async getProblemContent(path) {
    const existing = await this.request("GET", path);
    if (!existing) return null;
    return decodeURIComponent(escape(atob(existing.content)));
  }

  async updateProblemContent(path, newContent) {
    const existing = await this.request("GET", path);
    if (!existing) throw new Error("Problem file not found");

    const b64Content = btoa(unescape(encodeURIComponent(newContent)));
    await this.request("PUT", path, {
      message: `Update submissions for ${path}`,
      content: b64Content,
      sha: existing.sha
    });
    return { success: true };
  }

  async deleteProblem(url) {
    const index = await this.getIndex();
    const path = index[url];
    if (!path) return { success: true }; // Already not there

    const [existing, existingIndex] = await Promise.all([
      this.request("GET", path),
      this.request("GET", "solved_index.json")
    ]);

    if (existing) {
      await this.request("DELETE", path, {
        message: `Delete problem`,
        sha: existing.sha
      });
    }

    await this.updateIndexWithData(url, null, existingIndex);
    return { success: true };
  }

  async updateIndex(url, path) {
    const existing = await this.request("GET", "solved_index.json");
    await this.updateIndexWithData(url, path, existing);
  }

  async updateIndexWithData(url, path, existing) {
    let index = {};
    if (existing) {
      index = JSON.parse(decodeURIComponent(escape(atob(existing.content))));
    }

    if (path === null) {
      delete index[url];
    } else {
      index[url] = path;
    }

    const b64Index = btoa(unescape(encodeURIComponent(JSON.stringify(index))));
    await this.request("PUT", "solved_index.json", {
      message: path === null ? "Remove from index" : "Update index",
      content: b64Index,
      sha: existing ? existing.sha : undefined
    });
    await chrome.storage.local.set({ solvedIndex: index });
  }

  async getIndex() {
    const res = await chrome.storage.local.get("solvedIndex");
    if (res.solvedIndex) return res.solvedIndex;
    const existing = await this.request("GET", "solved_index.json");
    if (existing) {
      const index = JSON.parse(decodeURIComponent(escape(atob(existing.content))));
      await chrome.storage.local.set({ solvedIndex: index });
      return index;
    }
    return {};
  }
}
export const githubAPI = new GithubAPI();
