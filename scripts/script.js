const resSpf = document.querySelector('#spf')
const resDkim = document.querySelector('#dkim')
const domainName = document.querySelector('#domainName')
//Get data about URL and SPF and display it in popup
window.onload = function () {
    chrome.storage.sync.get("domain", (response) => {
        domainName.innerHTML = response.domain
    });
    chrome.storage.sync.get("spf", (response) => {
        resSpf.innerHTML = `${response.spf}`
    });
    chrome.storage.sync.get("dkim", (response) => {
        resDkim.innerHTML = `${response.dkim}`
    });
}
