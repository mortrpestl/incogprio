function showStatus(message) {
  console.log(message + " started");
  let status = document.getElementById("status");
  if (!status) {
    status = document.createElement("div");
    status.id = "status";
    document.body.appendChild(status);
  }
  status.textContent = message;
  status.style.opacity = "1";
  setTimeout(() => {
    status.style.opacity = "0";
  }, 750);
  console.log(message + " ended");
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.sync.get(["enabled", "text"]);
  const toggle = document.getElementById("toggle");
  const replacement = document.getElementById("replacement");
  const saveBtn = document.getElementById("save");

  toggle.checked = data.enabled || false;
  replacement.value = data.text || "";

  saveBtn.disabled = replacement.value.trim() === "";

  replacement.addEventListener("input", (e) => {
    saveBtn.disabled = e.target.value.trim() === "";
  });

  toggle.addEventListener("change", async () => {
    await chrome.storage.sync.set({ enabled: toggle.checked });
    chrome.runtime.sendMessage({ action: "replaceText" });
  });
});

document.getElementById("save").addEventListener("click", async () => {
  const toggle = document.getElementById("toggle");
  const replacement = document.getElementById("replacement");
  await chrome.storage.sync.set({ text: replacement.value });
  if (toggle.checked) chrome.runtime.sendMessage({ action: "replaceText" });
  showStatus("Text option saved.");
});

document.getElementById("reset").addEventListener("click", async () => {
  const toggle = document.getElementById("toggle");
  const replacement = document.getElementById("replacement");
  const saveBtn = document.getElementById("save");
  toggle.checked = false;
  replacement.value = "";
  saveBtn.disabled = true;
  await chrome.storage.sync.set({ enabled: false, text: "" });
  chrome.runtime.sendMessage({ action: "replaceText" });
  showStatus("Settings reset to default");
});
