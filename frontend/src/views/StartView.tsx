import { useState, useEffect } from "react"
import { MatchContainer } from "../Components/MatchContainer";

interface match {
  user: string,
  interests: string[]
}

export default function StartView() {
  const [newInterest, setNewInterest] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [matches, setMatches] = useState<match[]>([]);

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

  async function findMatch(interest: string) {
    console.log(interest);
    const user = localStorage.getItem('user');

    const interestObj = {
      interest: interest,
      user: user
    };

    const response = await fetch('http://localhost:1234/findmatch', {
      method: 'POST',
      body: JSON.stringify(interestObj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    let matchesToAdd: match[] = [];
    data.forEach((item: match) => {
      let match = { user: item.user, interests: item.interests };
      matchesToAdd.push(match);
    });
    setMatches(matchesToAdd);
  }

  return (
    <div>
      <h1>Welcome</h1>
      <section>
        <label htmlFor="interest-input">Interest:</label>
        <input type="text" id="interest-input" onChange={(e) => setNewInterest(e.target.value)}></input>
        <button onClick={addInterest}>Add</button>
      </section>
      <section>
        {interests ? interests.map((item, i) => <button key={i} onClick={() => findMatch(item)}>{item}</button>) : null}
        {matches ? matches.map((match, i) => <MatchContainer user={match.user} interests={match.interests} /> ) : null}
      </section>
    </div>
  )
}
