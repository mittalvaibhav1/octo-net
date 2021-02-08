import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import Login from './components/Login/Login';

function App() {
  const user = useSelector(selectUser);

  return (
    <div className="app">
      { user ? <>
          <Sidebar />
          <Chat />
        </> :
        <Login />
      }
    </div>
  );
}

export default App;
