copyBtn = document.getElementById("copyBtn");
tablist = document.getElementById("tablist");
statusText = document.getElementById("status");

copyBtn.addEventListener('click', copyToClipboard);

tablist.innerHTML = "";
chrome.tabs.query({}, function(tabs) {
   for (var i = 0; i < tabs.length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("class", "link");
      a.href = tabs[i].url;
      a.innerText = tabs[i].title;
      li.appendChild(a);
      tablist.appendChild(li);
   }
});

document.addEventListener('click', function(event) {
   if (event.target.tagName === 'A') {
      event.preventDefault();
      var tabUrl = event.target.getAttribute('href');
      chrome.tabs.query({}, function(tabs) {
         for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url === tabUrl) {
               chrome.tabs.update(tabs[i].id, { active: true });
               break;
            }
         }
      });
   }
});

function copyToClipboard() {
   copyText = "";
   for (let i = 0; i < document.links.length; i++) {
      copyText = copyText + "\r\n" + document.links[i];
   } 
   
   try {
      navigator.clipboard.writeText(copyText);
      copyBtn.setAttribute("class", "success");
      copyBtn.innerText = "Successfully Copied!";
   } catch (err) {
      console.log('Failed to copy: ', err);
      copyBtn.setAttribute("class", "error");
      copyBtn.innerText = "Successfully Copied!";
   }
}