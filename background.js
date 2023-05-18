updateBadgeText();

chrome.tabs.onCreated.addListener(updateBadgeText);
chrome.tabs.onRemoved.addListener(updateBadgeText);

function updateBadgeText() {
   chrome.tabs.query({}, function (tabs) {
      chrome.action.setBadgeText({ text: tabs.length.toString() });
   });
}