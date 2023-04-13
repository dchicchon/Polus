import Navbar from '../components/Navbar/Navbar.jsx';
import Clock from '../components/Clock/Clock.jsx';
import './styles.scss';
import Calendar from '../components/Calendar/Calendar.jsx';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Clock />
        <Calendar />
      </main>
    </div>
  );
}

export default App;
