// content.js - Script injetado nas páginas
// Aqui você pode implementar:
// - Detecção de atividade na página
// - Exibição de avisos/bloqueios
// - Comunicação com background script

const loadSettingsFromExtensionStorageLocal = async () => {
  const result = await chrome.storage.local.get(["settings"]);
  return result.settings || { monitoredSites: {} };
};

const isMonitored = (currentWebsite, settings) => {
  return currentWebsite in settings.monitoredSites;
};

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
