// Content script to extract the title of the question
function getTitle() {
  try {
    const url = window.location.href;
    const sites = [
      { prefix: "https://leetcode.com", selector: ".text-title-large, .text-lg" },
      { prefix: "https://atcoder.jp", selector: ".h2, h2" },
      { prefix: "https://codeforces.com", selector: ".title, .problem-statement .title" },
      { prefix: "https://www.interviewbit.com", selector: ".p-tile__title, .problem-title" },
      { prefix: "https://www.hackerrank.com", selector: ".ui-icon-label, .problem-title, h1" },
      { prefix: "https://www.geeksforgeeks.org", selector: ".g-m-0, .problems_problem_content__title__P7ooj, h1" },
      { prefix: "https://www.codechef.com/", selector: ".problem-title, h1, .prob-title" }
    ];

    let title = "";
    const site = sites.find(s => url.startsWith(s.prefix));

    if (site) {
      const el = document.querySelector(site.selector);
      if (el) title = el.innerText.trim();
      else if (site.prefix.includes("codechef")) title = document.title.replace(/\s*-\s*CodeChef.*$/i, "").trim();
    }

    if (title) {
      title = title.replace(/^\d+\.\s*/, "")
        .replace(/\s*-\s*(LeetCode|AtCoder|Codeforces|InterviewBit|HackerRank|GeeksforGeeks|CodeChef).*$/i, "")
        .trim();
    }
    return title || "";
  } catch (error) {
    return "";
  }
}

// Clean up MathJax elements to render properly in Markdown
function cleanMathJax(element) {
  if (!element) return "";
  const clone = element.cloneNode(true);

  // Remove MathJax rendering spans that duplicate the text
  clone.querySelectorAll('.MathJax_Preview, .MathJax').forEach(el => el.remove());

  // Replace math/tex scripts with standard Markdown math syntax
  clone.querySelectorAll('script[type^="math/tex"]').forEach(el => {
    let math = el.textContent;
    // Fix GitHub unsupported macros
    math = math.replace(/\\operatorname\{([^}]+)\}/g, "\\text{$1}");
    math = math.replace(/\\operatorname/g, "\\text");

    const isDisplay = el.type.includes('mode=display');
    const textNode = document.createTextNode(isDisplay ? `$$${math}$$` : `$${math}$`);
    el.parentNode.replaceChild(textNode, el);
  });

  // Handle KaTeX elements (CodeChef) to avoid duplicate text
  clone.querySelectorAll('.katex').forEach(el => {
    const annotation = el.querySelector('annotation[encoding="application/x-tex"]');
    if (annotation) {
      let math = annotation.textContent;
      math = math.replace(/\\operatorname\{([^}]+)\}/g, "\\text{$1}");
      math = math.replace(/\\operatorname/g, "\\text");
      const isDisplay = el.parentElement && el.parentElement.classList.contains('katex-display');
      const textNode = document.createTextNode(isDisplay ? `$$${math}$$` : `$${math}$`);
      el.parentNode.replaceChild(textNode, el);
    } else {
      const mathml = el.querySelector('.katex-mathml');
      if (mathml) mathml.remove();
    }
  });

  let html = clone.innerHTML;

  // Fix Codeforces $$$ math $$$ syntax and unsupported macros in raw text
  html = html.replace(/\$\$\$(.*?)\$\$\$/g, (match, p1) => '$' + p1 + '$');
  html = html.replace(/\\operatorname\{([^}]+)\}/g, "\\text{$1}");
  html = html.replace(/\\operatorname/g, "\\text");

  return html.trim();
}

// Extract problem statement based on platform
function getProblemStatement() {
  try {
    let el = null;
    const url = window.location.href;

    if (url.startsWith("https://leetcode.com")) {
      el = document.querySelector(".x-content") || document.querySelector("[data-track-load='description_content']");
    } else if (url.startsWith("https://codeforces.com")) {
      el = document.querySelector(".problem-statement");
    } else if (url.startsWith("https://atcoder.jp")) {
      el = document.getElementById("task-statement");
    } else if (url.startsWith("https://www.codechef.com")) {
      el = document.getElementById("problem-statement");
    } else if (url.startsWith("https://www.geeksforgeeks.org")) {
      el = document.querySelector(".problems_problem_content__Xm_eO") || document.querySelector(".problems_problem_content__P7ooj");
    } else if (url.startsWith("https://www.interviewbit.com")) {
      el = document.querySelector(".p-content");
    }

    return el ? cleanMathJax(el) : "";
  } catch (error) {
    return "";
  }
}
function closeSidebar() {
  const wrapper = document.getElementById("gitcodenotes-sidebar-wrapper");
  if (wrapper) {
    wrapper.style.transform = "translateX(100%)";
    setTimeout(() => {
      wrapper.style.display = "none";
      const iframe = wrapper.querySelector("iframe");
      if (iframe) iframe.src = iframe.src;
    }, 300);
  }
}

// Enhanced message listener with error handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (!request || !request.action) {
      sendResponse({ error: "Invalid message format" });
      return true; // Indicate asynchronous response
    }

    switch (request.action) {
      case "getTitle":
        sendResponse({ title: getTitle(), success: true });
        break;

      case "getProblemStatement":
        sendResponse({ statement: getProblemStatement(), success: true });
        break;

      case "ping":
        // Health check
        sendResponse({
          success: true,
          message: "Content script is active",
          url: window.location.href,
        });
        break;

      case "TOGGLE_SIDEBAR":
        let wrapper = document.getElementById("gitcodenotes-sidebar-wrapper");
        if (wrapper) {
          if (wrapper.style.transform === "translateX(0%)") {
            closeSidebar();
          } else {
            wrapper.style.display = "block";
            void wrapper.offsetWidth; // force reflow
            wrapper.style.transform = "translateX(0%)";
          }
        } else {
          wrapper = document.createElement("div");
          wrapper.id = "gitcodenotes-sidebar-wrapper";
          wrapper.style.position = "fixed";
          wrapper.style.top = "0";
          wrapper.style.right = "0";
          wrapper.style.width = "400px";
          wrapper.style.height = "100vh";
          wrapper.style.backgroundColor = "transparent";
          wrapper.style.zIndex = "2147483647";
          wrapper.style.boxShadow = "-5px 0 25px rgba(0,0,0,0.15)";
          wrapper.style.transform = "translateX(100%)";
          wrapper.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          wrapper.style.display = "block";

          const iframe = document.createElement("iframe");
          iframe.src = chrome.runtime.getURL("popup.html");
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";
          iframe.style.backgroundColor = "white";

          wrapper.appendChild(iframe);
          document.body.appendChild(wrapper);

          void wrapper.offsetWidth;
          wrapper.style.transform = "translateX(0%)";
        }
        sendResponse({ success: true });
        break;

      case "CLOSE_SIDEBAR":
        closeSidebar();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({
          error: `Unknown action: ${request.action}`,
          success: false,
        });
    }
  } catch (error) {
    sendResponse({
      error: "An unexpected error occurred in the content script",
      success: false,
    });
  }

  // Return true to indicate we will respond asynchronously
  return true;
});


