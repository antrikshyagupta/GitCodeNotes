import { showLoadingState, hideLoadingState, showError, showConfigurationRequired, showUnsupportedPage, showToast, renderSubmissionsList, $ } from './popupUI.js';
import { normalizeProblemUrl, isSupportedProblemPage, detectLanguage } from './popupLogic.js';
import { githubAPI } from '../background/githubAPI.js';
import { cacheManager } from '../background/cacheManager.js';
import MultiSelectDropdown from '../components/multi-select-dropdown.js';

window.githubAPI = githubAPI;
window.cacheManager = cacheManager;
window.MultiSelectDropdown = MultiSelectDropdown;

document.addEventListener("DOMContentLoaded", async () => {
  window.closeSidebar = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "CLOSE_SIDEBAR" }).catch(() => { });
      }
    });
    window.close();
  };

  try {
    showLoadingState();

    if ($("closeSidebarBtn")) $("closeSidebarBtn").onclick = window.closeSidebar;
    if ($("closeSidebarBtnSolved")) $("closeSidebarBtnSolved").onclick = window.closeSidebar;

    $("settingsButton").onclick = () => {
      chrome.runtime.openOptionsPage();
      window.closeSidebar();
    };

    if ($("settingsButtonSolved")) {
      $("settingsButtonSolved").onclick = () => {
        chrome.runtime.openOptionsPage();
        window.closeSidebar();
      };
    }

    try {
      await window.tagMapper?.initialize();
    } catch (e) {
      console.warn("TagMapper failed to initialize:", e);
    }

    const conf = await chrome.storage.local.get(["ghPat", "ghOwner", "ghRepo"]);
    if (!conf.ghPat || !conf.ghOwner || !conf.ghRepo) {
      return showConfigurationRequired();
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      try {
        if (!tabs?.length) {
          return showError("Unable to get current tab information.");
        }

        const tab = tabs[0];
        const url = tab.url;

        if (!isSupportedProblemPage(url)) {
          return showUnsupportedPage();
        }

        const cleanUrl = normalizeProblemUrl(url);
        const solved = await window.githubAPI.getIndex();
        const originalKey = Object.keys(solved).find(k => normalizeProblemUrl(k) === cleanUrl);

        window.solvedPath = originalKey ? solved[originalKey] : null;
        window.isAlreadySolved = !!window.solvedPath;

        if (window.isAlreadySolved) {
          $("saveForm").style.display = "none";
          $("alreadySolvedView").style.display = "block";

          window.fullMarkdown = await window.githubAPI.getProblemContent(window.solvedPath) || "";
          const parts = window.fullMarkdown.split(/## Submission(?: \d+)? - /);
          window.baseDocument = parts[0];

          window.submissions = parts.slice(1).map(p => ({
            date: p.substring(0, p.indexOf('\n')).trim(),
            content: p.substring(p.indexOf('\n'))
          }));

          renderSubmissionsList(window.submissions, originalKey, tab, editSub, delSub);

          $("btnAddNewSubmission").onclick = () => {
            window.isAppending = true;
            $("alreadySolvedView").style.display = "none";
            $("saveForm").style.display = "block";
            initUI(tab).then(() => populateFormFromBaseDoc());
          };

          $("btnViewOnGitHub").onclick = () => {
            chrome.tabs.create({ url: `https://github.com/${conf.ghOwner}/${conf.ghRepo}/blob/main/${window.solvedPath}` });
          };

          $("btnDeleteProblem").onclick = async () => {
            if (!confirm("Delete problem from GitHub?")) return;

            const btn = $("btnDeleteProblem");
            btn.disabled = true;
            btn.textContent = "Deleting...";

            try {
              await window.githubAPI.deleteProblem(originalKey);
              showToast("Deleted", "success");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } catch (e) {
              showToast("Error", "error");
              btn.disabled = false;
              btn.textContent = "Delete Problem";
            }
          };

          hideLoadingState();
        } else {
          await initUI(tab);
          hideLoadingState();
        }
      } catch (err) {
        showError("An error occurred during initialization: " + err.message);
      }
    });
  } catch (e) {
    showError("An error occurred.");
  }
});

async function initUI(tab) {
  const opts = await window.cacheManager.getDropdownOptions();

  window.tagsDropdown = new window.MultiSelectDropdown("tagsDropdown", {
    placeholder: "Select tags...",
    items: opts.tags || [],
    allowCustom: true,
    maxHeight: "120px"
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.boxShadow = 'none';
        b.style.color = '#6b7280';
      });
      btn.classList.add('active');
      btn.style.background = 'white';
      btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      btn.style.color = 'var(--primary-blue)';
      $("level").value = btn.dataset.val;
      $("saveForm").dispatchEvent(new Event('change'));
    });
  });

  $("saveButton").onclick = async (e) => {
    e.preventDefault();
    await handleSave(tab);
  };


  const draftKeySuffix = window.isEditingSubmission ? `_edit_${window.editingSubmissionIndex}` : (window.isAppending ? `_append` : `_new`);
  const draftKey = `draft_${normalizeProblemUrl(tab.url)}${draftKeySuffix}`;
  const draftRes = await chrome.storage.local.get([draftKey]);
  const draft = draftRes[draftKey];

  if (draft) {
    if (draft.title && !window.isAppending && !window.isEditingSubmission) $("questionTitle").value = draft.title;
    if (draft.note) $("note").value = draft.note;
    if (draft.code) $("code").value = draft.code;
    if (draft.level && !window.isAppending && !window.isEditingSubmission) {
      $("level").value = draft.level;
      document.querySelector(`.diff-btn[data-val="${draft.level}"]`)?.click();
    }
    if (draft.revision !== undefined && !window.isAppending && !window.isEditingSubmission) $("revisionNeeded").checked = draft.revision;
    if (draft.tags && window.tagsDropdown && !window.isAppending && !window.isEditingSubmission) window.tagsDropdown.setValues(draft.tags);
  } else if (!window.isAppending && !window.isEditingSubmission) {
    chrome.tabs.sendMessage(tab.id, { action: "getTitle" }, res => {
      if (!chrome.runtime.lastError && res?.title && $("questionTitle")) {
        $("questionTitle").value = res.title;
      }
    });
  }

  const saveDraft = () => {
    chrome.storage.local.set({
      [draftKey]: {
        title: $("questionTitle").value,
        note: $("note").value,
        code: $("code").value,
        level: $("level").value,
        revision: $("revisionNeeded").checked,
        tags: window.tagsDropdown ? window.tagsDropdown.getValues() : []
      }
    });
  };

  $("saveForm").addEventListener("input", saveDraft);
  $("saveForm").addEventListener("change", saveDraft);
  if ($("tagsDropdown")) $("tagsDropdown").addEventListener("change", saveDraft);
}

function populateFormFromBaseDoc() {
  if (!window.baseDocument) return;

  const diffMatch = window.baseDocument.match(/Difficulty: (.*)/);
  const titleMatch = window.baseDocument.match(/# (.*)/);
  const tagsMatch = window.baseDocument.match(/Tags: \[(.*)\]/);
  const revMatch = window.baseDocument.match(/Revision Needed!/);

  if (diffMatch && $("level")) {
    const lev = diffMatch[1].trim();
    $("level").value = lev;
    document.querySelector(`.diff-btn[data-val="${lev}"]`)?.click();
  }

  if (titleMatch && $("questionTitle")) {
    $("questionTitle").value = titleMatch[1].trim();
  }

  if (tagsMatch && tagsMatch[1].trim() && window.tagsDropdown) {
    const parsedTags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
    window.tagsDropdown.setValues(parsedTags);
  }

  if ($("revisionNeeded")) {
    $("revisionNeeded").checked = !!revMatch;
  }
}

function editSub(i, tab) {
  window.isAppending = false;
  window.isEditingSubmission = true;
  window.editingSubmissionIndex = i;

  const sub = window.submissions[i];
  const notes = sub.content.match(/\*\*Notes:\*\*\n([\s\S]*?)(?=\*\*Code:\*\*)/);
  const code = sub.content.match(/\*\*Code:\*\*\n```[\w+#+-]*\n([\s\S]*?)```/);

  $("alreadySolvedView").style.display = "none";
  $("saveForm").style.display = "block";

  initUI(tab).then(() => {
    populateFormFromBaseDoc();
    if (notes) {
      $("note").value = notes[1].trim();
    }
    if (code) {
      $("code").value = code[1].trim();
    }
  });
}

async function delSub(i, url) {
  if (!confirm("Delete this submission?")) return;

  window.submissions.splice(i, 1);

  if (!window.submissions.length) {
    await window.githubAPI.deleteProblem(url);
    window.location.reload();
    return;
  }

  let md = window.submissions.reduce((acc, s, idx) => acc + `## Submission ${idx + 1} - ${s.date}\n${s.content}`, window.baseDocument);
  await window.githubAPI.updateProblemContent(window.solvedPath, md);
  renderSubmissionsList(window.submissions, url, null, editSub, delSub);
}

async function handleSave(tab) {
  const btn = $("saveButton");
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const rawTags = window.tagsDropdown.getValues() || [];
    const tags = window.tagMapper?.normalizeTags ? window.tagMapper.normalizeTags(rawTags) : rawTags;

    const stmt = await new Promise(resolve => {
      chrome.tabs.sendMessage(tab.id, { action: "getProblemStatement" }, res => {
        resolve(!chrome.runtime.lastError ? res?.statement : "");
      });
    });

    if (!$("questionTitle").value) {
      throw new Error("Title required");
    }

    const data = {
      question: $("questionTitle").value,
      note: $("note").value,
      code: $("code").value,
      statement: stmt,
      level: $("level").value,
      tags,
      url: normalizeProblemUrl(tab.url),
      revisionNeeded: $("revisionNeeded").checked ? "Yes" : "No",
      language: detectLanguage($("code").value)
    };

    if (window.isEditingSubmission || window.isAppending) {
      window.baseDocument = window.baseDocument.replace(/Difficulty: .*/, `Difficulty: ${data.level}`);
      window.baseDocument = window.baseDocument.replace(/Tags: \[.*\]/, `Tags: [${data.tags.join(', ')}]`);
      window.baseDocument = window.baseDocument.replace(/# .*/, `# ${data.question}`);

      const formattedTags = data.tags && data.tags.length > 0 ? data.tags.map(t => '\`' + t + '\`').join(', ') : 'None';
      window.baseDocument = window.baseDocument.replace(/\*\*Tags:\*\* .*/, `**Tags:** ${formattedTags}`);

      const hasRev = window.baseDocument.includes('Revision Needed!');
      if (data.revisionNeeded === 'Yes' && !hasRev) {
        window.baseDocument = window.baseDocument.replace(/(# .*?\n)/, `$1\n> [!WARNING]\n> **Revision Needed!**\n`);
      } else if (data.revisionNeeded === 'No' && hasRev) {
        window.baseDocument = window.baseDocument.replace(/\n?> \[!WARNING\]\n> \*\*Revision Needed!\*\*\n\n?/, '\n');
      }

      const contentString = `\n**Notes:**\n${data.note}\n\n**Code:**\n\`\`\`${data.language}\n${data.code}\n\`\`\`\n`;

      if (window.isEditingSubmission) {
        window.submissions[window.editingSubmissionIndex].content = contentString;
      } else {
        window.submissions.push({
          date: new Date().toISOString().split('T')[0],
          content: contentString
        });
      }

      let md = window.submissions.reduce((acc, s, i) => acc + `## Submission ${i + 1} - ${s.date}\n${s.content}`, window.baseDocument);
      await window.githubAPI.updateProblemContent(window.solvedPath, md);
    } else {
      await window.githubAPI.saveProblem(data);
    }

    const draftKeySuffix = window.isEditingSubmission ? `_edit_${window.editingSubmissionIndex}` : (window.isAppending ? `_append` : `_new`);
    chrome.storage.local.remove(`draft_${normalizeProblemUrl(tab.url)}${draftKeySuffix}`);
    tags.forEach(t => window.cacheManager.addDropdownOption("tags", t));
    showToast("Saved!", "success");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (e) {
    showToast(e.message, "error");
    btn.disabled = false;
    btn.textContent = "Save Question";
  }
}
