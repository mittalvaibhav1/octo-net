import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className="app">
      <Sidebar />
    </div>
  );
}

export default App;
