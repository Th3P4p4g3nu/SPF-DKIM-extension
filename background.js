console.log("background script init");
function nslookup(url, type) {
    const domain = new URL(url)
    chrome.storage.sync.set({ 'domain': domain.hostname});
    fetch(`https://dns.google.com/resolve?name=${domain.hostname}&type=${type}`)
        .then(response => response.json())
        .then(data => {
            if (data.Answer) {
                const res = data.Answer
                res.forEach(element => {
                    if (type = 'TXT' && element.data.indexOf('v=spf1') > -1) {
                        console.log(element)
                        chrome.storage.sync.set({ 'spf': element.data});
                    }
                });
            }
        });
}

function handleUpdated(tabid, changeInfo, tab) {
    if (changeInfo.url) {
        nslookup(changeInfo.url, 'TXT')
    }
}

function handleActivated(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, tab => {
        nslookup(tab.url, 'TXT')
    })
}


chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onUpdated.addListener(handleUpdated)