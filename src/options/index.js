import { render } from 'preact';
import { actions } from '../utils/index.jsx';
import OptionPage from './OptionsPage.jsx';

window.onload = async () => {
    await actions.initializeUserSettings();
    render(<OptionPage />, document.getElementById('app'));
};
