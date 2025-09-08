const isMonitored = (currentWebsite, settings) => {
  return currentWebsite in settings.monitoredSites;
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

const setData = (currentWebsite, isCurrentWebsiteMonitored, websiteTime) => {
  document.getElementById("domain").textContent = currentWebsite;
  if (isCurrentWebsiteMonitored) {
    document.getElementById("add-site-form").style.display = "none";
    document.getElementById("domain-total-time").textContent = Math.floor(
      websiteTime[currentWebsite] / 1000 / 60
    );
  } else {
    document.getElementById("domain-total-time").style.display = "none";
  }
  document.getElementById("is-monitored").textContent =
    isCurrentWebsiteMonitored;
};

async function loadWebsiteTimeFromExtensionStorageLocal() {
  const result = await chrome.storage.local.get(["websiteTime"]);
  return result.websiteTime || {};
}

//event listeners

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

// variables and states

let currentWebsite = "";
let totalTime = 0;
let isCurrentWebsiteMonitored = "no";
let settings = {};
let websiteTime = {};

async function init() {
  await getCurrentDomainInfo();
  settings = await loadSettingsFromExtensionStorageLocal();
  console.log("buscou settings", settings);
  isCurrentWebsiteMonitored = isMonitored(currentWebsite, settings);
  console.log("site monitorado?", isCurrentWebsiteMonitored);
  websiteTime = await loadWebsiteTimeFromExtensionStorageLocal();
  console.log("websiteTime:", websiteTime);

  setData(currentWebsite, isCurrentWebsiteMonitored, websiteTime);
}

init();
