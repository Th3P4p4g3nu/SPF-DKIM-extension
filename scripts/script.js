const resSpf = document.querySelector('#spf')
const resDkim = document.querySelector('#dkim')
const domainName = document.querySelector('#domainName')
//SPF checker function
const spfChecker = record =>{
    let isEdrone = false
    let results = []
    if(record.indexOf('include:_spf.edrone.me')>-1){
        isEdrone = true
        let edroneSPF = record[record.indexOf('include:_spf.edrone.me')]
        if(edroneSPF.length != 22){[...results,'space inside edrone SPF']}
        if(edroneSPF.indexOf(" ")>-1){[...results,'space inside edrone SPF']}
        if(edroneSPF.indexOf("-")>-1){[...results,'breake instead of underscore']}
    }else{
        results = [...results,'edrone SPF not exist']
    }
    return results
}
//Get data about URL and SPF and display it in popup
window.onload = function () {
    chrome.storage.sync.get("domain", (response) => {
        domainName.innerHTML = response.domain
    });
    chrome.storage.sync.get("spf", (response) => {
        const spf = response.spf.split(' ')
        console.log(spfChecker(spf));
        resSpf.innerHTML = `${response.spf}`
    });
    chrome.storage.sync.get("dkim", (response) => {
        resDkim.innerHTML = `${response.dkim}`
    });
}
