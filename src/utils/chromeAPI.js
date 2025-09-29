


// export const getRedirects = async () => {
//   return new Promise((resolve) => {
//     chrome.runtime.sendMessage({ action: 'getRedirects' }, (response) => {
//       resolve(response || { redirects: [] });
//     });
//   });
// };

// export const clearRedirects = async () => {
//   return new Promise((resolve) => {
//     chrome.runtime.sendMessage({ action: 'clear' }, resolve);
//   });
// };


/* eslint-disable no-undef */

const isChrome = typeof chrome !== "undefined" && chrome.runtime?.sendMessage;

// export const getRedirects = async () => {
//   return new Promise((resolve) => {
//     if (isChrome) {
//       // Extension environment
//       chrome.runtime.sendMessage({ action: "getRedirects" }, (response) => {
//         resolve(response || { redirects: [] });
//       });
//     } else {
//       // Dev fallback (localStorage)
//       const stored = JSON.parse(localStorage.getItem("redirects") || "[]");
//       resolve({ redirects: stored });
//     }
//   });
// };

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
      // Dev fallback
      localStorage.removeItem("redirects");
      resolve();
    }
  });
};
