let atag = document.getElementById("pmode");
atag.onclick = () => pmode();

function pmode() {
  chrome.storage.local.get(["pmode"], function (result) {
    chrome.storage.local.set({ pmode: !result["pmode"] });
  });
}

chrome.storage.onChanged.addListener(function (result, storageArea) {
  // console.log(result);
  // console.log(storageArea);
  let mainView = document.getElementsByTagName("main");
  if (result["pmode"]['newValue']) {
    mainView[0].style.display = "none";
  } else {
    mainView[0].style.display = "block";
  }
});

// Testing
