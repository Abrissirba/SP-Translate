'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    chrome.pageAction.show(tabId);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(changeInfo.status === 'complete'){
            chrome.tabs.sendMessage(tabs[0].id, {action: 'refresh'}, function() {});
        }
    });

});
