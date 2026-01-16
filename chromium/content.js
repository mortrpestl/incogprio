async function replaceText() {
  const data = await chrome.storage.sync.get(["enabled", "text"]);
  const useMask = data.enabled && data.text;

  document.querySelectorAll("h3").forEach(h3 => {
    if (!h3.textContent.includes("Preenlistment Priority")) return;

    const span = h3.querySelector("span");
    if (!span) return;

    if (!span.dataset.originalText)
      span.dataset.originalText = span.textContent;

    span.textContent = useMask ? data.text : span.dataset.originalText;
  });

  const table = document.querySelector("#registration_details");
  if (!table) return;

  table.querySelectorAll("td").forEach(td => {
    if (!td.textContent.includes("Preenlistment Priority")) return;

    //registration_details view has the actual content in the <td> after the <td> Preenlistment Priority: is located
    const iTag = td.nextElementSibling?.querySelector("i");
    if (!iTag) return;

    if (!iTag.dataset.originalText)
      iTag.dataset.originalText = iTag.textContent;

    iTag.textContent = useMask ? data.text : iTag.dataset.originalText;
  });
}

const intervalId = setInterval(() => {
  replaceText();
  if (document.querySelector("#registration_details")) clearInterval(intervalId);
}, 500);

//not sure if necessary, just copied it from tutorial but CRS is probably not a SPA
new MutationObserver(replaceText)
  .observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.text || changes.enabled)) {
    replaceText();
  }
});

