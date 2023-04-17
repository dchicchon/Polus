import Toggle from '../Toggle/Toggle'
import Button from '../Button/Button'
import { userSettings } from '../../utils'
import styles from './styles.module.scss'

function Options() {
    const toggleItem = (name) => {
        if (name === 'notifications') {
            if (userSettings.value[name]) {
                chrome.permissions.remove(
                    {
                        permissions: ["notifications"],
                    },
                    (removed) => {
                        if (removed) {
                            if (!removed) return;
                        }
                    }
                );
            } else {
                chrome.permissions.request(
                    {
                        permissions: ["notifications"],
                    },
                    (granted) => {
                        if (!granted) return
                    }
                );
            }
        }
        userSettings.value = {
            ...userSettings.value,
            [name]: !userSettings.value[name]
        }
    }
    const submitPhoto = () => {
        console.log('submitPhoto')
        if (photoLink.length === 0) return;
        const arr = photoLink.split("/");
        const id = arr[arr.length - 1];
        const requestPhotoURL = `https://api.unsplash.com/photos/${id}/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&`;
        fetch(requestPhotoURL, { mode: "cors", credentials: "omit" })
            .then((response) => {
                if (!response.ok) throw response.statusText;
                return response;
            })
            .then((response) => response.json())
            .then((photo) => {
                let url = photo.urls.raw;
                let location = photo.location.name
                    ? `${photo.location.name}`
                    : "Unknown";
                let author = photo.user.name ? `${photo.user.name}` : "Unknown";
                let photoLink = photo.links.html;
                let downloadLink = `https://unsplash.com/photos/${photo.id}/download?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&force=true`;
                let background = {
                    url,
                    location,
                    author,
                    photoLink,
                    downloadLink,
                };
                state.background = background;
                actions.setBackground();
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const openOptions = () => {
        console.log('openOptions')
    }
    return (
        <div>
            <h2 className="page-title">Options</h2>
            <Toggle
                toggleItem={toggleItem}
                description="Change Photo Daily"
                name="changePhoto"
                currentValue={userSettings.value.changePhoto}
            />
            <Toggle
                toggleItem={toggleItem}
                name="newTab"
                currentValue={userSettings.value.newTab}
                description="Default New Tab"
            />
            <Toggle
                toggleItem={toggleItem}
                name="notifications"
                currentValue={userSettings.value.notifications}
                description="Get Notifications"
            />

            <div>
                Select Photo from
                <span>
                    <a
                        href="https://unsplash.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Unsplash
                    </a>
                </span>
                <input
                    id="photoURL"
                    type="text"
                    placeholder="https://unsplash.com/photos/NuBvAE6VfSM"
                // v-model="photoLink"
                />
                <Button onClick={submitPhoto} title="Submit" />
            </div>

            <div>
                <p className={styles.extension_link} onClick={openOptions}>Additional Options page</p>
            </div>

            <p className={styles.error}>
                {/* {error} */}
            </p>
        </div>
    )
}

export default Options