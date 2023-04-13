import { useEffect, useRef } from 'preact/hooks';

import Navbar from '../components/Navbar/Navbar.jsx';
import Clock from '../components/Clock/Clock.jsx';
import Calendar from '../components/Calendar/Calendar.jsx';
import { userSettings, actions } from '../utils/index.jsx';
import './styles.scss';

function App() {
  const backgroundRef = useRef(null);

  const mountBackground = () => {
    console.log('mountBackground')
    actions.getBackground().then((background) => {
      if (!background) return;
      const page = document.getElementsByTagName("html");
      const image = background.url;
      page[0].style.background = `rgba(0,0,0,0.9) url(${image + `&w=${window.innerWidth}`
        }) no-repeat fixed`;
      backgroundRef.current.style.display = userSettings.value.pmode
        ? "none"
        : "block";
    })
  }

  useEffect(() => {
    mountBackground();
  }, [])
  return (
    <div>
      <Navbar />
      <main ref={backgroundRef}>
        <Clock />
        <Calendar />
      </main>
    </div>
  );
}

export default App;
