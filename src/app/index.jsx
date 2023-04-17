import { render } from 'preact';
import { actions, userSettings } from '../utils/index.jsx';
import App from './App.jsx';

window.onload = async () => {
  await actions.initializeUserSettings();
  await actions.initializeBackground();
  if (userSettings.value.newTab || userSettings.value.indexOpen) {
    if (userSettings.value.indexOpen) {
      userSettings.value = {
        ...userSettings.value,
        indexOpen: false
      }
    }
    return render(<App />, document.getElementById('app'));
  }
  actions.showDefaultTab();
};