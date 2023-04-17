import Toggle from '../Toggle/Toggle'
import styles from './styles.module.scss'

function Options() {
    const toggleItem = () => {
        console.log('toggleItem')
    }
    return (
        <div>
            <h2 className="page-title">Options</h2>
            <Toggle
                toggleItem={toggleItem}
                description="Change Photo Daily"
                name="changePhoto"
            // currentValue="userSettings['changePhoto']"
            />
            <Toggle
                toggleItem={toggleItem}
                name="newTab"
                // currentValue="userSettings['newTab']"
                description="Default New Tab"
            />
            <Toggle
                toggleItem="modifyNotificationPermission"
                name="notifications"
                // currentValue="userSettings['notifications']"
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
                {/* <Button :onClick="submitPhoto">Submit</Button> */}
            </div>

            <div>
                <p className={styles.extension_link}
                //   @click="openOptions"
                >Additional Options page</p>
            </div>

            <p className={styles.error}>
                {/* {error} */}
            </p>
        </div>
    )
}

export default Options