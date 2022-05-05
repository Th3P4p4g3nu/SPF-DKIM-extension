//Get DNS record from URL address
function nslookup(url, type, sender) {
  const domain = new URL(url);
  chrome.storage.sync.set({ domain: domain.hostname }); //Setting hostname in extension storage
  fetch(
    `https://dns.google.com/resolve?name=${type === "TXT"
      ? domain.hostname
      : `${sender}._domainkey.${domain.hostname}`
    }&type=${type}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.Answer) {
        const res = data.Answer;
        if (type == 'TXT') {
          res.forEach((element) => {
            if (type == "TXT" && element.data.indexOf("v=spf1") > -1) {
              chrome.storage.sync.set({ spf: element.data }); //Setting value for SPF in extension storage
            }
          });
        } else {
          //Check edrone DKIM
          if (
            sender === 'edrone'
          ) {
            chrome.storage.sync.set({ edroneDKIM: res[0].data });
          }
          //Check emaillabs DKIM
          if (
            sender === 'emaillabs'
          ) {
            chrome.storage.sync.set({ emaillabsDKIM: res[0].data });
          }
        }
      }
    });
}
//enable/disable popup + change icon
function isPopup(status) {
  if (status) {
    chrome.action.setIcon({ path: "/images/enabled.png" });
    chrome.action.setPopup({ popup: "popup.html" });
  } else {
    chrome.action.setIcon({ path: "/images/disabled.png" });
    chrome.action.setPopup({ popup: "" });
  }
}
//Both of this functions is using chrome WebAPI in order to get URL base on action
//This functions is executing when URL in current data is changed
function handleUpdated(tabid, changeInfo, tab) {
  if (changeInfo.url) {
    let url = changeInfo.url;
    //Cut WWW
    changeInfo.url.indexOf("www.") > -1
      ? (url = url.replace("www.", ""))
      : (url = url);
    nslookup(url, "TXT");
    nslookup(url, "CNAME", "edrone");
    nslookup(url, "CNAME", "emaillabs");
  }
}
//This functions is executing when user change active tab
function handleActivated(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url != "newtab") {
      let url = tab.url;
      tab.url.indexOf("www.") > -1
        ? (url = url.replace("www.", ""))
        : (url = url);
      nslookup(url, "TXT");
      nslookup(url, "CNAME", "edrone");
      nslookup(url, "CNAME", "emaillabs");
    }
  });
}
//Since we can't inject the content.js everytime user change the tab, we have to store the info about already loaded domains with edrone
chrome.storage.sync.set({ hostsHistory: [] }); //Set the array in storage
//Message handler
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (data) {
    if (data.content === "init") {
      port.postMessage({ req: "getAppId" }); //Get app_id request
    }
    if (data.app_id) {
      //if app_id exist
      isPopup(true); // enable popup
      //Add current domain to the array
      chrome.storage.sync.get("hostsHistory", (response) => {
        chrome.storage.sync.set({
          hostsHistory: [...response.hostsHistory, data.url],
        });
      });
    } else {
      isPopup(false); //Turn off popup
    }
  });
});
// on change function
chrome.tabs.onActivated.addListener(handleActivated);
//Everytime user change tab we check array if we can display the data about DNS
chrome.tabs.onActivated.addListener((activeInfo) => {
  isPopup(false);
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const domain = new URL(tab.url); // Get current URL
    chrome.storage.sync.get("hostsHistory", (response) => {
      if (response.hostsHistory.indexOf(domain.hostname) > -1) {
        isPopup(true);
      }
    });
  });
});
//on update current tab
chrome.tabs.onUpdated.addListener(handleUpdated);
