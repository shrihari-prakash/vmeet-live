import { useEffect, useState } from 'react';
import './App.css';

const TWITTER_OAUTH_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_OAUTH_TOKEN_URL = 'https://vmeet-live.onrender.com/token';
const TWITTER_API_URL = 'https://vmeet-live.onrender.com';

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setLoggedIn(true);
      getToken(code);
    }
  }, []);

  const getToken = async (code) => {
    const queryData = {
      code: code,
      grant_type: 'authorization_code',
      client_id: 'eC1Da0hBRWlSaXRtd0JFbV81NlA6MTpjaQ',
      redirect_uri: document.location.origin,
      code_verifier: 'challenge',
    };
    const token = await fetch(TWITTER_OAUTH_TOKEN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(queryData),
    }).then((response) => {
      return response.json();
    });
    const me = await fetch(`${TWITTER_API_URL}/user/shrihariprakash`, {
      headers: { Authorization: 'Bearer ' + token.access_token },
    }).then((response) => response.json());
    setUser(me);
  };

  const redirectToTwitter = () => {
    const queryData = {
      response_type: 'code',
      client_id: 'eC1Da0hBRWlSaXRtd0JFbV81NlA6MTpjaQ',
      redirect_uri: document.location.origin,
      scope: 'users.read tweet.write tweet.read offline.access',
      state: uuidv4(),
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    };

    const query = new URLSearchParams(queryData);
    window.location.href = `${TWITTER_OAUTH_AUTH_URL}?${query}`;
  };

  return (
    <>
      <button className='login' onClick={redirectToTwitter} disabled={loggedIn}>
        <img
          src='https://seeklogo.com/images/T/twitter-x-logo-0339F999CF-seeklogo.com.png?v=638258077460000000'
          width={32}
        ></img>
        &nbsp;
        {loggedIn
          ? 'Connected to Twitter' + (user.data ? ' as ' + user.data.name : '')
          : 'Login with Twitter'}
      </button>
    </>
  );
}

export default App;
