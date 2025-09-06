// background.js - Service Worker
// Aqui você pode implementar:
// - Monitoramento de tempo por site
// - Timers e alarmes
// - Comunicação entre scripts
// chrome.storage.local - para persistir dados no storage
// chrome.alarms - para controle do tempo

async function checkDailyReset() {
  const today = new Date().toISOString().split("T")[0];

  const result = await chrome.storage.local.get(["dailyData"]);
  const dailyData = result.dailyData || {};

  if (dailyData.date !== today) {
    const newDailyData = { date: today };
    await chrome.storage.local.set({ dailyData: newDailyData });
    console.log("Dados diários resetados para:", today);
  }
}

chrome.runtime.onStartup.addListener(checkDailyReset);
chrome.runtime.onInstalled.addListener(checkDailyReset);



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SITE_INFO") {
    console.log("Mensagem recebida do content.js:", message);

    // Aqui você pode atualizar o tempo de uso desse domínio
    // Exemplo:
    // calcularTempo(message.currentWebsite);

    sendResponse({ status: "ok" });
  }
});
