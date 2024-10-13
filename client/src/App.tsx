import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import Room from './Components/Room';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='home' element={<Home />} />
        <Route path='room' element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
