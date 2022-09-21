import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  async function signup() {
    const account: object = {
      username: username,
      password: password
    };
    const response = await fetch('http://localhost:1234/signup', {
      method: 'POST',
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    console.log(data);
  }

  async function login() {
    const account: object = {
      username: loginUsername,
      password: loginPassword
    };
    const response = await fetch('http://localhost:1234/login', {
      method: 'POST',
      body: JSON.stringify(account),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem('user', data.user);
      localStorage.setItem('interests', JSON.stringify(data.interests));
      navigate('/start');
    }
  }

  return (
    <div className="App">
      <h1>InterestFinder</h1>
      <section>
        <h2>Sign up</h2>
        <label htmlFor='username'>User name</label>
        <input onChange={(e) => setUsername(e.target.value)} id="username" type="text" placeholder="Username"></input>
        <label htmlFor='password'>Password</label>
        <input onChange={(e) => setPassword(e.target.value)} id="password" type="password"></input>
        <button onClick={signup}>Skapa konto</button>
      </section>
      <section>
        <h2>Log in</h2>
        <label htmlFor='login-username'>User name</label>
        <input onChange={(e) => setLoginUsername(e.target.value)} id="login-username" type="text" placeholder="Username"></input>
        <label htmlFor='login-password'>Password</label>
        <input onChange={(e) => setLoginPassword(e.target.value)} id="login-password" type="password"></input>
        <button onClick={login}>Logga in</button>
      </section>
    </div>
  );
}

export default App;
