import { useEffect, useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import { actions } from '../../utils';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import {
  getFirestore,
  getDoc,
  updateDoc,
  setDoc,
  doc,
  collection,
} from 'firebase/firestore/lite';

import Toggle from '../Toggle/Toggle';
import Button from '../Button/Button';

import styles from './styles.module.scss';

const authPages = {
  SIGNUP: 'SIGNUP',
  LOGIN: 'LOGIN',
};

const authPage = signal(authPages.LOGIN);
const loggedIn = signal(false);
const showDelete = signal(false);
const email = signal('');
const password = signal('');
const confirmPassword = signal('');
const hasMessaging = signal(false);
const registeredMessaging = signal(false);

function LoginPage({ switchPage }) {
  const login = () => {
    console.log('login');
    console.log(email.value);
    console.log(password.value);
    const auth = getAuth();
    console.log('Logging In...');
    // use firebase signin system
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        console.log('User Credential');
        console.log(userCredential);
        email.value = '';
        password.value = '';
      })
      .catch((error) => {
        console.log('Error in signin');
        console.log({ error });
        // this.error = error.message;
      });
  };

  return (
    <div>
      <h2 className="page-title">Login</h2>
      <div className={styles.login_form}>
        <label for={styles.email}>Email</label>
        <input
          onInput={(e) => (email.value = e.target.value)}
          type="text"
          id={styles.email}
          className={styles.email}
          value={email.value}
        />
        <label for={styles.password}>Password</label>
        <input
          onInput={(e) => (password.value = e.target.value)}
          type="password"
          id={styles.password}
          className={styles.password}
          value={password.value}
        />
        <Button onClick={login} title="Login" />
        <p>
          Don't have an account?{' '}
          <span onClick={() => switchPage(authPages.SIGNUP)}>Sign up here</span>
        </p>
      </div>
    </div>
  );
}

function SignupPage({ switchPage }) {
  const signup = () => {
    console.log('Signing in...');
    if (password.value !== confirmPassword.value) {
      console.log('passwords must match');
      // this.error = "Passwords must match";
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        // this means that the signup was successful
        // lets create a document for this user based on the id
        console.log({ userCredential });
        const { uid } = userCredential.user;
        // lets create the user
        const firestore = getFirestore();
        const docRef = doc(firestore, 'users', uid);
        const userData = {
          extensionRegisterIds: [],
          mobileRegisterIds: [],
        };
        const addedDoc = await setDoc(docRef, userData);
        console.log({ addedDoc });
        email.value = '';
        password.value = '';
      })
      .catch((error) => {
        console.log('Error in Sign Up');
        console.log({ error });
      });
  };
  return (
    <div>
      <h2 className="page-title">Signup</h2>
      <div className={styles.login_form}>
        <label for={styles.email}>Email</label>
        <input
          onInput={(e) => (email.value = e.target.value)}
          type="text"
          id={styles.email}
          className={styles.email}
          value={email.value}
        />
        <label for={styles.password}>Password</label>
        <input
          onInput={(e) => (password.value = e.target.value)}
          type="password"
          id={styles.password}
          className={styles.password}
          value={password.value}
        />
        <label for={styles.password}>Confirm Password</label>
        <input
          onInput={(e) => (confirmPassword.value = e.target.value)}
          type="password"
          id={styles.password}
          className={styles.password}
          value={confirmPassword.value}
        />
        <Button onClick={signup} title="Signup" />
        <p>
          Already have an account?{' '}
          <span onClick={() => switchPage(authPages.LOGIN)}>Log in here</span>
        </p>
      </div>
    </div>
  );
}

function UserPage() {
  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sign Out successful');
        loggedIn.value = false;
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const deleteUser = () => {
    const auth = getAuth();
    const { currentUser } = auth;
    firebaseDeleteUser(currentUser)
      .then(() => {
        console.log('user was deleted');
      })
      .catch((error) => {
        console.log('error occurred while deleting user');
        console.log({ error });
      });
  };

  return (
    <div>
      <h3 className="page-title">User</h3>
      <Toggle
        name="messaging"
        description="Enable messaging"
        currentValue={hasMessaging.value}
        toggleItem={() => {
          actions.toggleMessaging();
          hasMessaging.value = !hasMessaging.value;
        }}
      />
      <Button onClick={logout} title="Log out" />
      <Button
        onClick={() => (showDelete.value = !showDelete.value)}
        title="Delete Account"
      />
      {showDelete.value && (
        <>
          <p>Are you sure you want to delete your account?</p>
          <Button color="orange" onClick={deleteUser} title="Confirm Delete" />
        </>
      )}
    </div>
  );
}

function AuthPage() {
  // lets check if user is logged in somehow?
  const switchPage = (value) => {
    authPage.value = value;
  };
  return authPage.value === authPages.LOGIN ? (
    <LoginPage switchPage={switchPage} />
  ) : (
    <SignupPage switchPage={switchPage} />
  );
}

function Account() {
  const [foundUser, setFoundUser] = useState();

  const registerMessaging = async () => {};

  const checkMessaging = async () => {
    hasMessaging.value = await actions.hasMessaging();
  };

  useEffect(() => {
    console.log('useeffect account');
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loggedIn.value = true;
        if (hasMessaging.value && loggedIn.value) {
          // if were logged in and we have gcm, we should register here?
        }
        setFoundUser(user);
      } else {
        console.log('user is not logged in');
        loggedIn.value = false;
      }
    });
    checkMessaging();
  }, []);
  return <div>{loggedIn.value ? <UserPage user={foundUser} /> : <AuthPage />}</div>;
}

export default Account;
