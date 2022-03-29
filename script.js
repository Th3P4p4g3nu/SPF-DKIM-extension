const res = document.querySelector('#result')
const domainName = document.querySelector('#domainName')

window.onload = function () {
    chrome.storage.sync.get("domain", (response) => {
        domainName.innerHTML = response.domain
    });
    chrome.storage.sync.get("spf", (response) => {
        res.innerHTML = response.spf
    });
}
