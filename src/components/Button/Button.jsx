import styles from './styles.module.scss';

function Button({ onClick, title, color }) {
  const selectedColor = color || 'blue';
  return (
    <button
      className={`${styles.main_button} ${styles[selectedColor]}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default Button;
