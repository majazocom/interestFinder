import { useState, useEffect } from "react"

export default function StartView() {
  const [newInterest, setNewInterest] = useState('');
  const [interests, setInterests] = useState([]);

  function getInterests() {
    let interests = JSON.parse(localStorage.getItem('interests') || '');
    console.log(interests);
    setInterests(interests);
  };

  useEffect(() => getInterests(), []);
  
  async function addInterest() {
    const user = localStorage.getItem('user');
    const userInterest: object = {
        user: user,
        interest: newInterest
    };
    const response = await fetch('http://localhost:1234/addinterest', {
      method: 'POST',
      body: JSON.stringify(userInterest),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      <h1>Welcome</h1>
      <section>
        <label htmlFor="interest-input">Interest:</label>
        <input type="text" id="interest-input" onChange={(e) => setNewInterest(e.target.value)}></input>
        <button onClick={addInterest}>Add</button>
      </section>
      <section>
        {interests ? interests.map((item) => <button>{item}</button>) : null}
      </section>
    </div>
  )
}
