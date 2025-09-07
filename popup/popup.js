const isMonitored = (currentWebsite, settings) => {
  const isCurrentWebsiteMonitored = currentWebsite in settings.monitoredSites;
  if (isCurrentWebsiteMonitored) {
    document.getElementById("is-monitored").textContent =
      'yes';
  }
};

const loadSettingsFromExtensionStorageLocal = async () => {
  const result = await chrome.storage.local.get(["settings"]);
  return result.settings || { monitoredSites: {} };
};

const getCurrentDomainInfo = async () => {
  const result = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = result[0];
  const url = new URL(currentTab.url);
  currentWebsite = url.hostname;
};

const setData = () => {
  document.getElementById("domain").textContent = currentWebsite;
  document.getElementById("domain-total-time").textContent = totalTime;
  document.getElementById("is-monitored").textContent =
    isCurrentWebsiteMonitored;
};

let currentWebsite = "";
let totalTime = 0;
let isCurrentWebsiteMonitored = 'no';

const settings = await loadSettingsFromExtensionStorageLocal();
await getCurrentDomainInfo();
isCurrentWebsiteMonitored = isMonitored(currentWebsite, settings);

setData()

//event listeners
document.getElementById("add-site-form").addEventListener("submit", (e) => {
  // e.preventDefault();

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

const addSiteForm = document.getElementById("add-site-form");

if (isCurrentWebsiteMonitored) {
  addSiteForm.style.display = "none";
}
