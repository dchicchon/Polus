
import styles from './styles.module.scss'

function Toggle({ description, toggleItem, name, currentValue }) {
    return (
        <div>
            {description}
            <label
                onClick={(e) => toggleItem(e, name)}
                //  @click="() => toggleItem($event, name)" 
                for="switch" className={styles.switch}>
                <input type="checkbox" className={styles.toggle}
                // :checked="currentValue" 
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
        </div>
    )
}

export default Toggle;