let currentWebsite = "";
let totalTime = 0;
let isMonitored = false;

await getCurrentDomainInfo()

async function loadSettingsFromExtensionStorageLocal() {
  const result = await chrome.storage.local.get(["settings"]);
  return result.settings || { monitoredSites: {} };
}

let settings = await loadSettingsFromExtensionStorageLocal();

async function getCurrentDomainInfo() {
  const result = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = result[0];
  const url = new URL(currentTab.url);
  const domain = url.hostname;

  currentWebsite = domain;

  document.getElementById("domain").textContent = domain;
  document.getElementById("domain-total-time").textContent = totalTime;
  document.getElementById("is-monitored").textContent = isMonitored;
}


document.getElementById("add-site-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newDomain = currentWebsite;
  const newLimit = document.getElementById("new-domain-max-time").value;

  console.log("Domain from form:", newDomain);
  console.log("Time Limit from form:", newLimit);

  settings.monitoredSites[newDomain] = { timeLimit: newLimit };
  chrome.storage.local.set({ settings });
});

document.getElementById("settingsButton").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});