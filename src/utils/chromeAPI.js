/* eslint-disable no-undef */

const isChrome = typeof chrome !== "undefined" && chrome.runtime?.sendMessage;

export const getRedirects = async () => {
  return new Promise((resolve) => {
    if (isChrome) {
      chrome.runtime.sendMessage({ action: "getRedirects" }, (response) => {
        resolve(response || { redirects: [] });
      });
    } else {
      const stored = JSON.parse(localStorage.getItem("redirects") || "[]");
      resolve({ redirects: stored.length ? stored : [] });
    }
  });
};

export const clearRedirects = async () => {
  return new Promise((resolve) => {
    if (isChrome) {
      chrome.runtime.sendMessage({ action: "clear" }, resolve);
    } else {
      
      localStorage.removeItem("redirects");
      resolve();
    }
  });
};
