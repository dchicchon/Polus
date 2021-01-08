

// TOGGLES
// let clockToggle = document.getElementById('clock-toggle')
let toggles = document.getElementsByClassName("toggle")
for (let toggle of toggles) {
    let key = toggle.id
    console.log(key)
    chrome.storage.sync.get(key, result => {
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            chrome.storage.sync.set({ key: true })
        }
        if (result[key]) {
            toggle.checked = true
        } else {
            toggle.checked = false
        }
    })

    toggle.onclick = function () {
        if (this.checked) {
            console.log("ON ")
            console.log(this.checked)
            chrome.storage.sync.set({ [toggle.id]: true })
        }
        else {
            console.log("OFF")
            console.log(this.checked)
            chrome.storage.sync.set({ [toggle.id]: false })
        }
    }
}

document.getElementById("submitPhoto").onclick = function () {
    let photoURL = document.getElementById("photoURL").value
    console.log("Submitted photo!")
    let arr = photoURL.split('/')
    console.log(arr)
    let id = arr[arr.length - 1]
    console.log(id)
    let requestPhotoURL =
        `https://api.unsplash.com/photos/${id}/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&`;
    console.log(requestPhotoURL)
    fetch(requestPhotoURL, { mode: 'cors', credentials: 'omit' })
        .then(response => {
            if (!response.ok) throw response.statusText;
            return response
        })
        .then(response => response.json())
        .then(function (photo) {
            let url = photo.urls.raw;
            let location = photo.location.name ? `${photo.location.name}` : "Unknown";
            let author = photo.user.name ? `${photo.user.name}` : "Unknown";
            let photoLink = photo.links.html;
            let downloadLink = `https://unsplash.com/photos/${photo.id}/download?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&force=true`;
            chrome.storage.sync.set({
                background: { url, location, author, photoLink, downloadLink },
            });
        })
        .catch((err) => console.log(`Fetch failed: ${err}`));
}

// Changing new tab
chrome.storage.onChanged.addListener(function (result) {
    console.log(result)
    // if (result['newTab'] === false) {
    //     chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html" })
    // }
})
