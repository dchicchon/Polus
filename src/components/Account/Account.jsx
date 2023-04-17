import { useEffect, useState } from 'preact/hooks'
import { signal } from '@preact/signals';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

import Button from '../Button/Button'

import styles from './styles.module.scss'

const authPages = {
    SIGNUP: "SIGNUP",
    LOGIN: "LOGIN"
}

const authPage = signal(authPages.LOGIN)
const loggedIn = signal(false);
const email = signal('');
const password = signal('');
const confirmPassword = signal('');

function LoginPage({ switchPage }) {

    const login = () => {
        console.log('login')
        console.log(email.value);
        console.log(password.value)
        const auth = getAuth();
        console.log("Logging In...");
        // use firebase signin system
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                console.log("User Credential");
                console.log(userCredential);
                // this.page = "summary";
                // Here I then need to get some user info using firebase firestore methods
            })
            .catch((error) => {
                console.log("Error in signin");
                console.log({ error })
                // this.error = error.message;
            });
    }

    return (
        <div>
            <h2 className='page-title'>Login</h2>
            <div className={styles.login_form}>
                <label for={styles.email}>Email</label>
                <input onInput={e => email.value = e.target.value} type="text" id={styles.email} className={styles.email} value={email.value} />
                <label for={styles.password}>Password</label>
                <input onInput={e => password.value = e.target.value} type="password" id={styles.password} className={styles.password} value={password.value} />
                <Button onClick={login} title="Login" />
                <p>Don't have an account? {' '}<span onClick={() => switchPage(authPages.SIGNUP)}>Sign up here</span></p>
            </div>
        </div>
    )
}

function SignupPage({ switchPage }) {
    const signup = () => {
        console.log("Signing in...");
        if (password.value !== confirmPassword.value) {
            console.log('passwords must match')
            // this.error = "Passwords must match";
            return;
        }
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                console.log("User Credential");
                console.log(userCredential);
                // this.page = "summary";
                // this.$firebase.firestore().collection("users").doc()
            })
            .catch((error) => {
                console.log("Error in Sign Up");
                console.log({ error })
                // this.error = error.message;
            });
    }
    return (
        <div>
            <h2 className='page-title'>Signup</h2>
            <div className={styles.login_form}>
                <label for={styles.email}>Email</label>
                <input onInput={e => email.value = e.target.value} type="text" id={styles.email} className={styles.email} value={email.value} />
                <label for={styles.password}>Password</label>
                <input onInput={e => password.value = e.target.value} type="password" id={styles.password} className={styles.password} value={password.value} />
                <label for={styles.password}>Confirm Password</label>
                <input onInput={e => confirmPassword.value = e.target.value} type="password" id={styles.password} className={styles.password} value={confirmPassword.value} />
                <Button onClick={signup} title="Signup" />
                <p>Already have an account?  {' '}<span onClick={() => switchPage(authPages.LOGIN)}>Log in here</span></p>

            </div>
        </div>
    )
}

function UserPage() {
    const logout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("Sign Out successful");
            })
            .catch((error) => {
                console.log({ error })
            });
    }
    return (
        <div>
            <h3 className='page-title'>User page</h3>
            <Button onClick={logout} title='Log out' />
        </div>
    )
}

function AuthPage() {
    // lets check if user is logged in somehow?
    const switchPage = (value) => {
        authPage.value = value;
    }
    return authPage.value === authPages.LOGIN ? <LoginPage switchPage={switchPage} /> : <SignupPage switchPage={switchPage} />
}

function Account() {
    const [foundUser, setFoundUser] = useState();
    useEffect(() => {
        console.log('useeffect account');
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                loggedIn.value = true;
                console.log({ user })
                setFoundUser(user);
            } else {
                console.log('user is not logged in')
            }
        })
    }, [])
    return (
        <div>
            {loggedIn.value ? <UserPage user={foundUser} /> : <AuthPage />}
        </div>
    )
}

export default Account;