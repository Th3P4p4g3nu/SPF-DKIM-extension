function nslookup(url, type) {
  const domain = new URL(url);
  chrome.storage.sync.set({ domain: domain.hostname });
  fetch(`https://dns.google.com/resolve?name=${domain.hostname}&type=${type}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Answer) {
        const res = data.Answer;
        res.forEach((element) => {
          if ((type = "TXT" && element.data.indexOf("v=spf1") > -1)) {
            console.log(element);
            chrome.storage.sync.set({ spf: element.data });
          }
        });
      }
    });
}
function disablePopup() {
  chrome.action.setIcon({ path: "/images/disabled.png" });
  chrome.action.setPopup({ popup: "" });
}
function enablePopup() {
  chrome.action.setIcon({ path: "/images/enabled.png" });
  chrome.action.setPopup({ popup: "popup.html" });
}
function handleUpdated(tabid, changeInfo, tab) {
  if (changeInfo.url) {
    let url = changeInfo.url;
    changeInfo.url.indexOf("www.") > -1
      ? (url = url.replace("www.", ""))
      : (url = url);
    nslookup(url, "TXT");
  }
}

function handleActivated(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url != "newtab") {
      let url = tab.url;
      tab.url.indexOf("www.") > -1
        ? (url = url.replace("www.", ""))
        : (url = url);
      nslookup(url, "TXT");
    }
  });
}
chrome.storage.sync.set({ hostsHistory: [] });
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (data) {
    if (data.content === "init") {
      port.postMessage({ req: "getAppId" });
    }
    if (data.app_id) {
      enablePopup();
      chrome.storage.sync.get("hostsHistory", (response) => {
        chrome.storage.sync.set({
          hostsHistory: [...response.hostsHistory, data.url],
        });
      });
    }
  });
});
chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onActivated.addListener((activeInfo) => {
  disablePopup();
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const domain = new URL(tab.url);
    chrome.storage.sync.get("hostsHistory", (response) => {
        if(response.hostsHistory.indexOf(domain.hostname)>-1){
            enablePopup();
        }
      });
  });
});
chrome.tabs.onUpdated.addListener(handleUpdated);
