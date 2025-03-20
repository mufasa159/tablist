const cbtn = document.getElementById("cbtn");
const cicn = document.getElementById("cicn");
const ctxt = document.getElementById("ctxt");

const obtn = document.getElementById("obtn");
const otxt = document.getElementById("otxt");

const tlst = document.getElementById("tlst");

const form = document.getElementById("form");
const fcnl = document.getElementById("fcnl");
const fopn = document.getElementById("fopn");
const ftxt = document.getElementById("ftxt");

cbtn.addEventListener('click', copyToClipboard);
obtn.addEventListener('click', toggleOpenLinks);
fopn.addEventListener('click', open);
fcnl.addEventListener('click', cancel);

tlst.innerHTML = "";

chrome.tabs.query({}, function (tabs) {
   for (var i = 0; i < tabs.length; i++) {
      var x = document.createElement("li");
      var y = document.createElement("a");
      y.href = tabs[i].url;
      y.innerText = tabs[i].title;
      x.appendChild(y);
      tlst.appendChild(x);
   }
});

document.addEventListener('click', function (event) {
   if (event.target.tagName === 'A') {
      event.preventDefault();
      var tabUrl = event.target.getAttribute('href');
      chrome.tabs.query({}, function (tabs) {
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
   let copyText = "";

   for (let i = 0; i < document.links.length; i++) {
      copyText = copyText + "\r\n" + document.links[i];
   }

   try {
      navigator.clipboard.writeText(copyText);
      cbtn.classList.add("success");
      cicn.classList.add("b");
      ctxt.innerText = "Successfully Copied!";

   } catch (err) {
      cbtn.classList.add("error");
      ctxt.innerText = err;
   }
}

function toggleOpenLinks() {
   tlst.classList.add("hide");
   cbtn.classList.add("hide");
   obtn.classList.add("hide");
   form.classList.remove("hide");
   fcnl.classList.remove("hide");
   fopn.classList.remove("hide");
}

async function open() {
   const urls = ftxt.value.split("\n");
   urls.forEach(async (url) => {
      if (
         !url.startsWith("http") &&
         !url.startsWith("mailto") &&
         !url.startsWith("chrome") &&
         !url.startsWith("file")
      ) {
         await search(url);
      } else {
         await chrome.tabs.create({ url: url });
      }
   });
   cancel();
}

function cancel() {
   cbtn.classList.remove("success");
   cicn.classList.remove("b");
   cicn.classList.add("w");
   ctxt.innerText = "Copy to Clipboard";
   tlst.classList.remove("hide");
   cbtn.classList.remove("hide");
   obtn.classList.remove("hide");
   form.classList.add("hide");
   fcnl.classList.add("hide");
   fopn.classList.add("hide");
}

async function search(q) {
   try {
      await chrome.search.query({
         text: q,
         disposition: "NEW_TAB"
      }, function () {
         if (chrome.runtime.lastError) {
            console.error("Search failed:", chrome.runtime.lastError);
         }
      });
   } catch (ex) {
      console.error("Search failed:", ex);
   }
}