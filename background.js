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

let activeSite = null;
let activeStartTime = null;
let websiteTime = {}; // cache local em memória, buscar do storage corretamente

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SITE_INFO") {
    switchSite(msg.currentWebsite);
  } else if (msg.type === "SITE_HIDDEN") {
    pauseSite(msg.currentWebsite);
  } else if (msg.type === "SITE_VISIBLE") {
    resumeSite(msg.currentWebsite);
  }
});

function switchSite(newSite) {
  if (activeSite && activeStartTime) {
    accumulateTime(activeSite);
  }
  activeSite = newSite;
  activeStartTime = Date.now();
}

function pauseSite(site) {
  if (activeSite === site && activeStartTime) {
    accumulateTime(site);
    activeStartTime = null;
  }
}

function resumeSite(site) {
  if (activeSite === site && !activeStartTime) {
    activeStartTime = Date.now();
  }
}

function accumulateTime(site) {
  const elapsed = Date.now() - activeStartTime;
  websiteTime[site] = (websiteTime[site] || 0) + elapsed; //preciso buscar o tempo já rodado no dia para somar, não adianta buscar do

  chrome.storage.local.set({ websiteTime });
}