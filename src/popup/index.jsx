import { render } from 'preact';
import { initializeApp } from "firebase/app";
import { actions } from '../utils/index.jsx';
import Popup from './Popup';

window.onload = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAftmgN4XuDp-RoqJ90x08z1smU6RRHrWk",
        authDomain: "polus-296119.firebaseapp.com",
        projectId: "polus-296119",
        storageBucket: "polus-296119.appspot.com",
        messagingSenderId: "274422794820",
        appId: "1:274422794820:web:311613ef0f5e16cf594a11"
    };
    const firebaseApp = initializeApp(firebaseConfig)
    actions.initializeUserSettings();
    render(<Popup />, document.getElementById('app'));
};
