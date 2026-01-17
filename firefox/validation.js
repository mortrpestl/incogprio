export function showStatus(message) {
  let status = document.getElementById("status");
  if (!status) {
    status = document.createElement("div");
    status.id = "status";
    document.body.appendChild(status);
  }
  status.textContent = message;
  status.style.opacity = "1";
  setTimeout(() => (status.style.opacity = "0"), 750);
}

// storage/script upate
export async function updateStorage(key, value) {
  await chrome.storage.sync.set({ [key]: value });
  chrome.runtime.sendMessage({ action: "replaceText" });
}

// resetter
export function resetField(toggleEl, inputEl, saveEl, storageKeys) {
  toggleEl.checked = false;
  inputEl.value = "";
  saveEl.disabled = true;

  const storageUpdate = {};
  storageKeys.forEach(
    (key) => (storageUpdate[key] = key.includes("Enabled") ? false : ""),
  );
  chrome.storage.sync.set(storageUpdate);
  chrome.runtime.sendMessage({ action: "replaceText" });
}

