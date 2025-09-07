// content.js - Script injetado nas páginas
// - Detecção de atividade na página
// - Exibição de avisos/bloqueios
// - Comunicação com background script

//busca e processamento de dados

const loadSettingsFromExtensionStorageLocal = async () => {
  const result = await chrome.storage.local.get(["settings"]);
  return result.settings || { monitoredSites: {} };
};

const isMonitored = (currentWebsite, settings) => {
  return currentWebsite in settings.monitoredSites;
};



// event listeners
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    chrome.runtime.sendMessage({ type: "SITE_HIDDEN", currentWebsite: window.location.hostname });
  } else {
    chrome.runtime.sendMessage({ type: "SITE_VISIBLE", currentWebsite: window.location.hostname });
  }
});

// window.addEventListener("blur", () => {
//   chrome.runtime.sendMessage({ type: "SITE_BLUR", currentWebsite: window.location.hostname });
// });

// window.addEventListener("focus", () => {
//   chrome.runtime.sendMessage({ type: "SITE_FOCUS", currentWebsite: window.location.hostname });
// });

(async () => {
  const currentWebsite = window.location.hostname;
  console.log("Current website:", currentWebsite);

  const settings = await loadSettingsFromExtensionStorageLocal();
  console.log("settings:", settings);

  const isCurrentWebsiteMonitored = isMonitored(currentWebsite, settings);
  console.log("isMonitored:", isCurrentWebsiteMonitored);

  if (isCurrentWebsiteMonitored) {
    chrome.runtime.sendMessage({
      type: "SITE_INFO",
      currentWebsite,
      timestamp: Date.now()
    });
  }
})();

