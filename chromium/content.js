async function replacePriority() {
  const { enabled = false, text = "" } = await chrome.storage.sync.get(["enabled", "text"]);
  if (!enabled && !text) return;
  const maskText = text.trim() || "[REDACTED]";
  maskPriorityHeaders(enabled, maskText);
  maskPriorityTableCells(enabled, maskText);
}

function maskPriorityHeaders(enable, maskText) {
  document.querySelectorAll("h3").forEach(h3 => {
    if (!h3.textContent.includes("Preenlistment Priority")) return;
    const span = h3.querySelector("span");
    if (!span) return;

    span.dataset.originalPriorityText ??= span.textContent;

    span.textContent = enable ? maskText : span.dataset.originalPriorityText;
  });
}

function maskPriorityTableCells(enable, maskText) {
  const table = document.querySelector("#registration_details");
  if (!table) return;
  table.querySelectorAll("td").forEach(td => {
    if (!td.textContent.includes("Preenlistment Priority")) return;

    const iTag = td.nextElementSibling?.querySelector("i");
    if (!iTag) return;

    iTag.dataset.originalPriorityText ??= iTag.textContent;
    iTag.textContent = enable ? maskText : iTag.dataset.originalPriorityText;
  });
}

async function replaceSN() {
  const { studentEnabled = false } = await chrome.storage.sync.get(["studentEnabled"]);
  maskStudentSpans(studentEnabled);
}

function maskStudentSpans(enable) {
  const studentRegex = /20\d{2}-?\d{5}/g;

  document.querySelectorAll("span").forEach(el => {
    if (el.closest("h3") || el.closest("#registration_details")) return;

    el.dataset.originalStudentText ??= el.textContent;

    el.textContent = enable
      ? el.dataset.originalStudentText.replace(studentRegex, "[REDACTED]")
      : el.dataset.originalStudentText;
  });
}

//I don't completely understand what's going on here
const observer = new MutationObserver(mutations => {
  if (mutations.some(mutation =>
      Array.from(mutation.addedNodes).some(node =>
        node.nodeType === 1 && //1 - comment node
        (node.matches("h3") || node.matches("#registration_details") ||
         node.querySelector("h3") || node.querySelector("#registration_details"))
      )
  )) {
    replacePriority();
    replaceSN();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

replacePriority();
replaceSN();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes.enabled || changes.text) replacePriority();
  if (changes.studentEnabled) replaceSN();
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.updateType === "priority") replacePriority();
  if (msg.updateType === "student") replaceSN();
});
