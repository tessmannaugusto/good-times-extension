// options.js - Configurações avançadas (opcional)
// Aqui você pode implementar:
// - Lista de sites bloqueados
// - Configurações de horários
// - Exportar/importar dados

async function loadSettingsFromExtensionStorageLocal() {
  const result = await chrome.storage.local.get(["settings"]);
  return result.settings || { "monitoredSites": {} };
}

let settings = await loadSettingsFromExtensionStorageLocal();



document.getElementById('add-site-form').onsubmit( (e) => {
  e.preventDefault();
  
  const newDomain = document.getElementById('new-domain').value;
  const newLimit = document.getElementById('new-domain-max-time').value;
  
  console.log('Domain from form:', domain);
  console.log('Time Limit from form:', newLimit);

  settings.monitoredSites[newDomain] = { timeLimit: newLimit };
  chrome.storage.local.set({ settings });
});

// delete settings.monitoredSites[domain];
