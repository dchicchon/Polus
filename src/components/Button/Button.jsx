
import styles from './styles.module.scss'

function Button({ onClick, title }) {
    return (
        <button
            class={styles.main_button}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default Button;