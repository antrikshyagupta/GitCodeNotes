export function showToaster(message, type = "success") {
  const oldToaster = document.getElementById("cq-toaster");
  if (oldToaster) oldToaster.remove();

  const toaster = document.createElement("div");
  toaster.id = "cq-toaster";
  toaster.style.position = "fixed";
  toaster.style.top = "24px";
  toaster.style.right = "32px";
  toaster.style.zIndex = "9999";
  toaster.style.minWidth = "220px";
  toaster.style.maxWidth = "350px";
  toaster.style.padding = "14px 22px";
  toaster.style.borderRadius = "8px";
  toaster.style.fontSize = "1rem";
  toaster.style.boxShadow = "0 2px 12px rgba(0,0,0,0.12)";
  toaster.style.transition = "opacity 0.3s";
  toaster.style.opacity = "1";
  toaster.style.pointerEvents = "none";
  toaster.style.color = type === "error" ? "#721c24" : "#155724";
  toaster.style.background = type === "error" ? "#f8d7da" : "#d4edda";
  toaster.style.border = type === "error" ? "1px solid #f5c6cb" : "1px solid #c3e6cb";
  toaster.textContent = message;
  document.body.appendChild(toaster);
  setTimeout(() => {
    toaster.style.opacity = "0";
    setTimeout(() => toaster.remove(), 600);
  }, 3500);
}

export function showError(message, configSection) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger";
  errorDiv.style = "margin: 20px 0; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; border-radius: 4px;";
  errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
  if(configSection) configSection.insertAdjacentElement("afterend", errorDiv);
  setTimeout(() => {
    if (errorDiv.parentNode) errorDiv.remove();
  }, 10000);
}


export function showFallbackError() {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2 style="color: #dc3545;">Error</h2>
      <p>A critical error occurred while loading the options page.</p>
      <p>Please refresh the page and try again.</p>
      <button onclick="location.reload()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}