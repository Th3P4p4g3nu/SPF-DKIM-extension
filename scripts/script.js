const res = document.querySelector('#result')
const domainName = document.querySelector('#domainName')
//Get data about URL and SPF and display it in popup
window.onload = function () {
    chrome.storage.sync.get("domain", (response) => {
        domainName.innerHTML = response.domain
    });
    chrome.storage.sync.get("spf", (response) => {
        res.innerHTML = response.spf
    });
}
