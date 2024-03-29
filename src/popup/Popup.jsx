import { signal } from '@preact/signals';
import Options from '../components/Options/Options';
import Account from '../components/Account/Account';

import './styles.scss'

const tabs = {
    OPTIONS: "OPTIONS",
    ACCOUNT: "ACCOUNT",
}

const tab = signal(tabs.OPTIONS);

function Popup() {
    return (
        <div class="main">
            <div class="container">
                {tab.value === tabs.OPTIONS && <Options linkToOptions />}
                {tab.value === tabs.ACCOUNT && <Account />}
            </div>
            <div class="popup_nav">
                <h3 onClick={() => tab.value = tabs.OPTIONS}>Options</h3>
                <h3 onClick={() => tab.value = tabs.ACCOUNT}>Account</h3>
            </div>
        </div>
    )
}

export default Popup;