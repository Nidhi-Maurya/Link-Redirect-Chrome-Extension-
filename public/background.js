/* eslint-disable no-undef */
// /* eslint-disable no-undef */
// // Install/Update listener - Badge set karo welcome ke liye (red dot dikhega)
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    console.log('Extension installed/updated!'); // Debug log
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    // Note: Auto-popup nahi possible MV3 mein, user manually click karega
  }
});

// // Redirect chains track karne ke liye variables
 let redirectChains = new Map(); // tabId -> array of chain steps

// // Better redirect tracking: Headers received pe status code capture karo
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const tabId = details.tabId;
    const statusCode = details.statusCode;
    
    console.log(`Request: ${details.url}, Status: ${statusCode}, Tab: ${tabId}`); // Debug
    
    if (statusCode >= 300 && statusCode < 400 && tabId >= 0) { // Redirect status
      if (!redirectChains.has(tabId)) {
        redirectChains.set(tabId, []);
      }
      
      const chain = redirectChains.get(tabId);
      chain.push({
        fromUrl: details.url,
        statusCode: statusCode,
        type: 'Redirect',
        timestamp: Date.now()
      });
      
      console.log(`Redirect chain added for tab ${tabId}:`, chain); // Debug
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Request complete pe final status add karo aur storage mein save
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const tabId = details.tabId;
    const statusCode = details.statusCode;
    
    if (tabId >= 0 && redirectChains.has(tabId)) {
      const chain = redirectChains.get(tabId);
      // Final step add karo
      chain.push({
        fromUrl: details.url,
        statusCode: statusCode,
        type: 'Final',
        timestamp: Date.now()
      });
      
      console.log(`Chain completed for tab ${tabId}:`, chain); // Debug
      
      // Storage mein save (per tab)
      chrome.storage.sync.set({ [`chain_${tabId}`]: chain });
      
      // All chains aggregate karo
      chrome.storage.sync.get(null, (data) => {
        const allChains = Object.values(data)
          .filter(val => val && val.length > 0 && val[0].type === 'Redirect')
          .flat();
        chrome.storage.sync.set({ allRedirects: allChains });
        console.log('All redirects saved:', allChains); // Debug
      });
      
      // Memory clear
      redirectChains.delete(tabId);
    }
  },
  { urls: ["<all_urls>"] }
);

// Clear storage listener (popup se)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRedirects') {
    chrome.storage.sync.get(['allRedirects'], (data) => {
      const redirects = data.allRedirects || [];
      console.log('Sending redirects to popup:', redirects); // Debug
      sendResponse({ redirects });
    });
    return true; // Async
  } else if (request.action === 'clear') {
    chrome.storage.sync.clear(() => {
      redirectChains.clear();
      sendResponse({ success: true });
    });
    return true;
  }
});

// Tab close pe cleanup
chrome.tabs.onRemoved.addListener((tabId) => {
  redirectChains.delete(tabId);
});



