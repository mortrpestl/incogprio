import { showStatus, updateStorage, resetField } from "./validation.js";

document.addEventListener("DOMContentLoaded", async () => {
  const storageKeys = ["enabled", "text", "studentEnabled"];
  const data = await chrome.storage.sync.get(storageKeys);

  const elements = {
    toggle: document.getElementById("toggle"),
    replacement: document.getElementById("replacement"),
    saveBtn: document.getElementById("save"),
    resetBtn: document.getElementById("reset"),
    studentToggle: document.getElementById("studentToggle"),
  };

  elements.toggle.checked = data.enabled || false;
  elements.replacement.value = data.text || "";
  elements.saveBtn.disabled = !elements.replacement.value.trim();
  elements.toggle.disabled = !elements.replacement.value.trim();
  elements.studentToggle.checked = data.studentEnabled || false;

  function checkTextAvailability() {
    const hasText = elements.replacement.value.trim().length > 0;
    elements.saveBtn.disabled = !hasText;
    elements.toggle.disabled = !hasText;
    if (!hasText) elements.toggle.checked = false;
  }

  checkTextAvailability(); 

  elements.replacement.addEventListener("input", (e) => {
    checkTextAvailability();
  });

  elements.toggle.addEventListener("change", async () => {
    await updateStorage("enabled", elements.toggle.checked);
    sendMessageToActiveTab("priority");
  });

  elements.saveBtn.addEventListener("click", async () => {
    await updateStorage("text", elements.replacement.value);
    showStatus("Replacement text saved.");
    sendMessageToActiveTab("priority");
  });

  elements.resetBtn.addEventListener("click", async () => {
    resetField(elements.toggle, elements.replacement, elements.saveBtn, ["enabled", "text"]);
    showStatus("Priority settings reset.");
    checkTextAvailability();
    sendMessageToActiveTab("priority");
  });

  elements.studentToggle.addEventListener("change", async () => {
    await updateStorage("studentEnabled", elements.studentToggle.checked);
    sendMessageToActiveTab("student");
  });

  function sendMessageToActiveTab(updateType) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { updateType });
      }
    });
  }
});
