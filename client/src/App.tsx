import React, {useEffect} from 'react';
import './App.css';

function App() {
  const fetchLogin = async () => {
    window.location.href = 'http://localhost:3001/login';
  }

  useEffect(() => {
  })


  return (
    <div>
      <button onClick={() => fetchLogin()}>
        Login to Spotify
      </button>
      <h1>Welcome Test1</h1>
    </div>
  );
};

export default App;
