import Canvas from './components/Canvas';
import {useEffect, useState} from 'react';
import './css/App.css';

function App() {

  return (
    <div className="App">
      <div id="Parametre">
        <h3>ENGINE 2D</h3>
      </div>
      <Canvas/>
      <p id="signature">BY MATTHEO DELELIS</p>
    </div>
  );
}

export default App;
