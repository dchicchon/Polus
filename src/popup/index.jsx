import { render } from 'preact';
import { initializeApp } from "firebase/app";
import { actions } from '../utils/index.jsx';
import { firebaseConfig } from '../utils/config.js';
import Popup from './Popup';

window.onload = () => {
    const firebaseApp = initializeApp(firebaseConfig)
    actions.initializeUserSettings();
    render(<Popup />, document.getElementById('app'));
};
