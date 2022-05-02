//Watching the changes in DOM
function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
//Connect to the background.js
var port = chrome.runtime.connect({ name: "edrone" });
port.postMessage({
  content: "init",
});
//Send app_id when it exist
port.onMessage.addListener(function (data) {
  if (data.req === "getAppId") {
    if (document.querySelector('input[name="edrone_app_id"]')) {
      const appId = document.querySelector('input[name="edrone_app_id"]');
      port.postMessage({ app_id: appId.value, url: window.location.host });
    } else {
      waitForElm('input[name="edrone_app_id"]').then((input) => {//When function finds element send app_id value + domain
        port.postMessage({ app_id: input.value, url: window.location.host });
        console.log(input.value);
      });
    }
  }
});
