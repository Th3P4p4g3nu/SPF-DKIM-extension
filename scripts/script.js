const resSpf = document.querySelector("#spf");
const resDkimEdrone = document.querySelector("#dkimOne");
const resDkimEmaillabs = document.querySelector("#dkimTwo");
const domainName = document.querySelector("#domainName");
const errorLog = document.querySelector("#error-log");
const advCheck = document.querySelector(".advanced");
//SPF checker function
const spfChecker = (record) => {
  let isEdrone = false;
  let results = [];
  //Validation of whole SPF
    //Check if record has ~all or -all
    if(record[record.length]==='-all'){
        results = [...results, 'better to use ~all instead of -all']
    }
    //Check syntax
    if(record[0]!='v=spf1'){
        results = [...results, 'wrong syntax of SPF record']
    }
  //Validation of edrone record
  if (record.indexOf("include:_spf.edrone.me") > -1 || record.indexOf("include:_spf.emaillabs.net.pl") > -1) {
    isEdrone = true;
    let edroneSPF =
      record.indexOf("include:_spf.edrone.me") > -1
        ? record[record.indexOf("include:_spf.edrone.me")]
        : record[record.indexOf("include:_spf.emaillabs.net.pl")];//Client can use emaillabs record as alt
    console.log('SPF: '+edroneSPF)
    if (edroneSPF.length != 22) {
      [...results, "wrong syntax of edrone SPF"];
    }
    if (edroneSPF.indexOf(" ") > -1) {
      [...results, "space inside edrone SPF"];
    }
    if (edroneSPF.indexOf("-") > -1 && edroneSPF.indexOf("_") < -1) {
      [...results, "breake instead of underscore"];
    }
  } else {
    results = [...results, "edrone SPF does not exist"];
  }
  return results;
};
//Get data about URL and SPF and display it in popup
window.onload = function () {
  chrome.storage.sync.get("domain", (response) => {
    domainName.innerHTML = response.domain;
    advCheck.href = `https://toolbox.googleapps.com/apps/checkmx/check?domain=${response.domain}`
  });
  chrome.storage.sync.get("spf", (response) => {
    const spf = response.spf.split(" ");
    resSpf.innerHTML = `${response.spf}`;
    spfChecker(spf).forEach((element) => {
      errorLog.insertAdjacentHTML('beforeend',`<li class="error-res">${element}</li>`)
    });
  });
  chrome.storage.sync.get("edroneDKIM", (response) => {
    resDkimEdrone.innerHTML = `${response.edroneDKIM}`;
  });
  chrome.storage.sync.get("emaillabsDKIM", (response) => {
    resDkimEmaillabs.innerHTML = `${response.emaillabsDKIM}`;
  });
};
