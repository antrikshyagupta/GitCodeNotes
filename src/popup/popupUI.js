export const $ = id => document.getElementById(id);

const overlay = (id, html) => {
  let el = $(id) || document.createElement("div");
  el.id = id;
  el.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:var(--bg-gradient);display:flex;justify-content:center;align-items:center;z-index:9999;box-sizing:border-box;";
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
};

export const showLoadingState = () => {
  overlay("gitcodenotes-loading-overlay", `
    <div style="text-align:center;">
      <div style="width:40px;height:40px;border:3px solid var(--border-light);border-top-color:var(--primary-blue);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px auto;"></div>
      <div style="font-size:16px;font-weight:600;color:var(--text-main);margin-bottom:8px;">Loading...</div>
      <div style="color:var(--text-muted);font-size:13px;">Initializing GitCodeNotes</div>
      <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    </div>
  `);
};

export const hideLoadingState = () => {
  const el = $("gitcodenotes-loading-overlay");
  if (el) el.remove();
};

export const showError = msg => {
  hideLoadingState();
  overlay("gitcodenotes-error-overlay", `
    <div class="apple-card" style="text-align:center;width:100%;max-width:400px;height:100%;border-radius:0;border:none;box-shadow:none;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;">
      <div style="background:var(--danger-bg);width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;color:var(--danger-color);font-size:24px;">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <h3 style="color:var(--text-main);font-size:20px;margin-bottom:10px;">Error</h3>
      <p style="margin-bottom:24px;color:var(--text-muted);font-size:14px;word-break:break-word;">${msg}</p>
      <button class="btn btn-primary w-full" id="errorCloseBtn">Close</button>
    </div>
  `);
  $("errorCloseBtn").onclick = () => window.closeSidebar();
};

export const showConfigurationRequired = () => {
  hideLoadingState();
  overlay("gitcodenotes-config-overlay", `
    <div class="apple-card" style="text-align:center;width:100%;max-width:400px;height:100%;border-radius:0;border:none;box-shadow:none;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;">
      <div style="background:#f3f4f6;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;color:var(--text-muted);font-size:24px;">
        <i class="bi bi-gear-fill"></i>
      </div>
      <h3 style="color:var(--text-main);font-size:20px;margin-bottom:10px;">Configuration Required</h3>
      <p style="margin-bottom:24px;color:var(--text-muted);font-size:14px;">GitHub Configuration is required. Please set it up in the options page to start saving questions.</p>
      <div class="flex gap-3">
        <button id="configureBtn" class="btn btn-primary" style="flex:1;">Go to Settings</button>
        <button id="closeConfigBtn" class="btn btn-ghost" style="flex:1;">Close</button>
      </div>
    </div>
  `);
  $("configureBtn").onclick = () => { chrome.runtime.openOptionsPage(); window.closeSidebar(); };
  $("closeConfigBtn").onclick = () => window.closeSidebar();
};

export const showUnsupportedPage = () => {
  hideLoadingState();
  
  const sites = [
    { name: "LeetCode", url: "https://leetcode.com/favicon.ico" },
    { name: "Codeforces", url: "https://codeforces.com/favicon.ico" },
     { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/favicon.ico" },
      { name: "AtCoder", url: "https://atcoder.jp/favicon.ico" },
    { name: "CodeChef", url: "https://www.codechef.com/favicon.ico" },
    { name: "InterviewBit", url: "https://www.interviewbit.com/favicon.ico" },
    { name: "HackerRank", url: "https://www.hackerrank.com/favicon.ico" }
    
    
  ];

  const siteListHtml = sites.map((site, index) => `
    <div style="padding:12px 20px;${index < sites.length - 1 ? 'border-bottom:1px solid var(--border-light);' : ''}font-size:15px;font-weight:500;display:flex;align-items:center;gap:16px;">
      <img src="${site.url}" style="width:24px;height:24px;border-radius:6px;object-fit:contain;background:white;" onerror="this.src='../icons/icon-16.png'">
      ${site.name}
    </div>
  `).join('');

  overlay("gitcodenotes-unsupported-overlay", `
    <div class="apple-card" style="text-align:center;width:100%;max-width:400px;height:100%;border-radius:0;border:none;box-shadow:none;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;">
      <div style="background:#eff6ff;width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px auto;color:var(--primary-blue);font-size:32px;">
        <i class="bi bi-globe"></i>
      </div>
      <h3 style="color:var(--text-main);font-size:24px;margin-bottom:12px;">Unsupported Page</h3>
      <p style="color:var(--text-muted);font-size:16px;margin-bottom:24px;">This extension works on:</p>
      
      <div style="background:#fafafa;border:1px solid var(--border-light);border-radius:var(--radius-md);text-align:left;margin-bottom:32px;">
        ${siteListHtml}
      </div>

      <div class="flex gap-4">
        <button id="settingsBtn" class="btn btn-primary" style="flex:1;font-size:15px;padding:12px;">Go to Settings <i class="bi bi-chevron-right" style="font-size:13px;margin-left:4px;"></i></button>
        <button id="closeBtn" class="btn btn-ghost" style="flex:1;font-size:15px;padding:12px;">Close</button>
      </div>
    </div>
  `);
  
  $("settingsBtn").onclick = () => { chrome.runtime.openOptionsPage(); window.closeSidebar(); };
  $("closeBtn").onclick = () => window.closeSidebar();
};

export const showToast = (msg, type = "info") => {
  const existing = $("gitcodenotes-toast");
  if (existing) existing.remove();

  let t = document.createElement("div");
  t.id = "gitcodenotes-toast";
  
  const bgColors = { success: "#10b981", error: "#ef4444", info: "#2563eb" };
  const bg = bgColors[type] || bgColors.info;

  t.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:var(--radius-xl);font-size:14px;font-weight:500;z-index:10000;box-shadow:var(--shadow-lg);transition:all 0.3s;opacity:1;background:${bg};color:white;`;
  t.textContent = msg;
  
  document.body.appendChild(t);
  
  setTimeout(() => { 
    t.style.opacity = "0"; 
    t.style.transform = "translate(-50%, -20px)"; 
    setTimeout(() => t.remove(), 300); 
  }, 2000);
};

export const renderSubmissionsList = (subs, cleanUrl, tab, editFn, delFn) => {
  const container = $("submissionsListContainer");
  container.innerHTML = "";

  if (!subs.length) {
    container.innerHTML = "<p style='color:var(--text-muted);font-size:13px;text-align:center;'>No submissions found.</p>";
    return;
  }

  subs.forEach((sub, i) => {
    let div = document.createElement("div");
    div.style.cssText = "border:1px solid var(--border-light);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:12px;background:#fafafa;display:flex;justify-content:space-between;align-items:center;";
    
    div.innerHTML = `
      <div style="font-weight:600;font-size:14px;color:var(--text-main);">
        Submission ${i + 1} 
        <span style="font-weight:400;color:var(--text-muted);font-size:12px;margin-left:4px;">(${sub.date})</span>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost edit-btn" style="padding:6px 12px;font-size:13px;color:var(--primary-blue);">Edit</button>
        <button class="btn btn-ghost-danger del-btn" style="padding:6px 12px;font-size:13px;">Delete</button>
      </div>
    `;
    
    div.querySelector('.edit-btn').onclick = () => editFn(i, tab);
    div.querySelector('.del-btn').onclick = () => delFn(i, cleanUrl);
    
    container.appendChild(div);
  });
};