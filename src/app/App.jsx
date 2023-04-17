import Navbar from '../components/Navbar/Navbar.jsx';
import Clock from '../components/Clock/Clock.jsx';
import Calendar from '../components/Calendar/Calendar.jsx';
import { userSettings } from '../utils/index.jsx';

import './styles.scss';

function App() {
  return (
    <div>
      <Navbar />
      <main
        style={{
          display: userSettings.value.pmode ? 'none' : 'block',
        }}
      >
        <Clock />
        <Calendar />
      </main>
    </div>
  );
}

export default App;
