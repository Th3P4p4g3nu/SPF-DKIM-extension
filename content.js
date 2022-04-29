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
var port = chrome.runtime.connect({ name: "edrone" });
port.postMessage({
  content: "init",
});
port.onMessage.addListener(function (data) {
  if (data.req === "getAppId") {
    if (document.querySelector('input[name="edrone_app_id"]')) {
      const appId = document.querySelector('input[name="edrone_app_id"]');
      port.postMessage({ app_id: appId.value, url: window.location.host });
    } else {
      waitForElm('input[name="edrone_app_id"]').then((input) => {
        port.postMessage({ app_id: input.value, url: window.location.host });
        console.log(input.value);
      });
    }
  }
});
