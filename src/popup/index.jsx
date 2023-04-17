import { render } from 'preact';
import { actions } from '../utils/index.jsx';
import Popup from './Popup.jsx';

window.onload = () => {
    actions.initializeUserSettings();
    render(<Popup />, document.getElementById('app'));
};
