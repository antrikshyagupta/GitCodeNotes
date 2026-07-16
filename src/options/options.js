import { showToaster, showError, showFallbackError } from './optionsUI.js';

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const configSection = document.getElementById("configSection");
    const ghPatInput = document.getElementById("ghPat");
    const ghOwnerInput = document.getElementById("ghOwner");
    const ghRepoInput = document.getElementById("ghRepo");
    const saveConfigButton = document.getElementById("saveConfig");

    if (!ghPatInput || !ghOwnerInput || !ghRepoInput || !saveConfigButton) {
      showError("Critical error: Configuration elements not found. Please refresh the page.", configSection);
      return;
    }

    await loadConfiguration();

    try {
      await tagMapper.initialize();
    } catch (error) {}

    saveConfigButton.addEventListener("click", async () => {
      const ghPat = ghPatInput.value.trim();
      const ghOwner = ghOwnerInput.value.trim();
      const ghRepo = ghRepoInput.value.trim();

      if (!ghPat || !ghOwner || !ghRepo) {
        showToaster("Please fill all GitHub configuration fields", "error");
        return;
      }

      saveConfigButton.disabled = true;
      saveConfigButton.innerHTML = '<i class="bi bi-cloud-arrow-up-fill" style="margin-right: 8px;"></i> Saving...';

      try {
        await chrome.storage.local.set({ ghPat, ghOwner, ghRepo });
        showToaster("GitHub configuration saved successfully!", "success");
      } catch (error) {
        showToaster(`Error saving configuration: ${error.message}`, "error");
      } finally {
        saveConfigButton.disabled = false;
        saveConfigButton.innerHTML = '<i class="bi bi-cloud-arrow-up-fill" style="margin-right: 8px;"></i> Save Secure Configuration';
      }
    });

    const refreshBtn = document.getElementById("refreshDropdownsButton");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async () => {
        refreshBtn.disabled = true;
        await chrome.storage.local.remove(["dropdownOptions"]);
        showToaster("Tags refreshed successfully!", "success");
        setTimeout(() => refreshBtn.disabled = false, 1000);
      });
    }

    const clearCacheBtn = document.getElementById("clearCacheButton");
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener("click", async () => {
        if (confirm("Clear all extension cache? This will force a fresh sync from GitHub.")) {
          clearCacheBtn.disabled = true;
          await chrome.storage.local.remove(["dropdownOptions", "lastCacheUpdate"]);
          showToaster("Cache cleared successfully!", "success");
          setTimeout(() => clearCacheBtn.disabled = false, 1000);
        }
      });
    }


    async function loadConfiguration() {
      try {
        const result = await chrome.storage.local.get(["ghPat", "ghOwner", "ghRepo"]);
        if (result.ghPat) ghPatInput.value = result.ghPat;
        if (result.ghOwner) ghOwnerInput.value = result.ghOwner;
        if (result.ghRepo) ghRepoInput.value = result.ghRepo;
      } catch (error) {
        showError("Failed to load configuration. Some features may not work properly.", configSection);
      }
    }
  } catch (error) {
    showFallbackError();
  }
});