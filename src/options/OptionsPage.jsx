import { signal } from "@preact/signals"
import Options from "../components/Options/Options"
import Button from "../components/Button/Button"
import { actions } from "../utils"
import './styles.scss'

const devMode = signal(import.meta.env.MODE === 'development')

function DevInfo() {

  const createTestEntries = () => {
    const generateFormats = (date) => {
      return {
        a1: date.toLocaleDateString("en-US").replaceAll("/", "_"),
        a2: date.toLocaleDateString("en-US"),
        a3: date.toLocaleDateString("es"), // Spanish
        a4: date.toLocaleDateString("cs"), // Czech
        a5: date.toLocaleDateString("da"), // Danish
        a6: date.toLocaleDateString("fr"), // French
        a7: date.toLocaleDateString("af"), // Afrikaans
      };
    };

    // run entries twice
    const entries = [
      {
        key: "a1",
        color: "blue",
        active: false,
        text: "Main Format",
      },
      {
        key: "a2",
        color: "blue",
        active: false,
        text: "Old Format",
      },
      {
        key: "a3",
        color: "blue",
        active: false,
        text: "Old 'Spanish' Format",
      },
      {
        key: "a4",
        color: "blue",
        active: false,
        text: "Old 'Czech' Format",
      },
      {
        key: "a5",
        color: "blue",
        active: false,
        text: "Old 'Danish' Format",
      },
      {
        key: "a6",
        color: "blue",
        active: false,
        text: "Old 'French' Format",
      },
      {
        key: "a7",
        color: "blue",
        active: false,
        text: "Old 'Afrikaans' Format",
      },
    ];

    const today = new Date();
    const todayFormats = generateFormats(today);
    // insert today entries
    entries.forEach((entry) => {
      console.info("Create Today Entry");
      const dateFormat = todayFormats[entry.key];
      chrome.storage.sync.set(
        {
          [dateFormat]: [entry],
        },
        (result) => {
          console.info({ result });
        }
      );
    });

    const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
    const twoWeeksAgoFormats = generateFormats(twoWeeksAgo);
    // insert twoweeksago entries
    entries.forEach((entry) => {
      console.info("Create Two Weeks Ago Entry");
      const dateFormat = twoWeeksAgoFormats[entry.key];
      chrome.storage.sync.set(
        {
          [dateFormat]: [entry],
        },
        (result) => {
          console.info({ result });
        }
      );
    });
  }

  const resetLocalEntries = () => {
    actions.resetLocalDatabase();

  }

  const resetSyncEntries = () => {
    actions.resetSyncDatabase();
  }

  const testFunc = () => {
    actions.testFunc();
  }

  const moveToLocal = () => {
    actions.moveToLocal();
  }
  const clearNotificationAlarms = () => {
    console.info("Removing alarms");
    actions.removeNotificationAlarms();
  }
  return (
    <div>
      <h2>Developer Info</h2>
      <div>
        <h3>Alarms</h3>
        <ul>
          <li
          // v-for="(alarm, index) in alarms" \
          // key="`${index}`"
          >
            <p
            // v-for="(alarm, key) in alarm"
            //  key="`${key}`"
            >
              {/* {key}: {alarm} */}
            </p>
            {/* <!-- Name: {{ alarm.name }} Scheduled Time: {{ alarm.scheduledTime }} --> */}
          </li>
        </ul>
      </div>
      <div>
        <h3>Permissions</h3>
        <ul>
          <li
          // v-for="(permission, index) in permissions" 
          // key="`${index}`"
          >
            {/* Permission: {permission} */}
          </li>
        </ul>
      </div>
      <div>
        <Button onClick={clearNotificationAlarms} title='Clear notification alarms' />
        <Button onClick={moveToLocal} title='Move to local' />
        <Button onClick={resetSyncEntries} title='Reset Sync Entries' />
        <Button onClick={resetLocalEntries} title='Reset Local Entries' />
        <Button onClick={createTestEntries} title='Create Test Entries' />
        <Button onClick={testFunc} title='Run Test Func' />
      </div>
    </div>
  )
}

function OptionsPage() {
  return (
    <div class="page">
      <div class="pane"></div>
      <div class="main">
        <h1 class="title-box">
          <span> <img src="/assets/polus_icon48.png" /> </span>
          <span class="title">Options</span>
        </h1>
        <Options />
        {devMode.value && <DevInfo />}
      </div>
      <div class="pane"></div>
    </div>
  )
}

export default OptionsPage