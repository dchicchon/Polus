

// TOGGLES
// let clockToggle = document.getElementById('clock-toggle')
let toggles = document.getElementsByClassName("toggle")
for (let toggle of toggles) {
    let key = toggle.id
    console.log(key)
    chrome.storage.local.get(key, result => {
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            chrome.storage.local.set({ key: true })
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
            chrome.storage.local.set({ [toggle.id]: true })
        }
        else {
            console.log("OFF")
            console.log(this.checked)
            chrome.storage.local.set({ [toggle.id]: false })
        }
    }
}

 
