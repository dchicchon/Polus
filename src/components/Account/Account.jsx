import Button from '../Button/Button'
import { signal } from '@preact/signals';

import styles from './styles.module.scss'

const loggedIn = signal(false);
const username = signal('');
const password = signal('');

function LoginPage() {
    const login = () => {
        console.log('login')
        console.log(username);
        console.log(password)
    }
    return (
        <div>
            <h3 className={styles.account_title}>Login page</h3>
            <div className={styles.login_form}>
                <label for={styles.username}>Username</label>
                <input onInput={e => username.value = e.target.value} type="text" id={styles.username} className={styles.username} value={username} />
                <label for={styles.password}>Password</label>
                <input onInput={e => password.value = e.target.value} type="password" id={styles.password} className={styles.password} value={password} />
                <Button onClick={login} title="Login" />
            </div>
        </div>
    )
}

function UserPage() {
    return (
        <div>
            <h3 className={styles.account_title}>User page</h3>
            {/* what would we include here for users? */}
        </div>
    )
}

function Account() {
    return (
        <div>
            <h2 className="page-title">Account</h2>
            {loggedIn.value ? <UserPage /> : <LoginPage />}
        </div>
    )
}

export default Account;