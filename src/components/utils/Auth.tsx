import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { login, signup } from '../../context/actions';
import { useStore } from '../../hooks/useStore';


interface Props {
  showAuthPopup?: boolean
  setShowAuthPopup?: Dispatch<SetStateAction<boolean>>
}

export default function Auth({ showAuthPopup, setShowAuthPopup }: Props): ReactElement {

  const [showAnotherForm, setShowAnotherForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const { dispatch, store } = useStore();

  const onLogin = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    login(email, password, dispatch, () => setShowAuthPopup && setShowAuthPopup(false));
  }

  const onRegister = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    if (!email || !password) {
      dispatch({ type: 'SIGNUP_FAILED', errorMsg: 'Felder dürfen nicht leer sein' });
      return;
    }
    if (password !== passwordRepeat) {
      dispatch({ type: 'SIGNUP_FAILED', errorMsg: 'PW müssen übereinstimmen' });
      return;
    }
    if (password.length < 4) {
      dispatch({ type: 'SIGNUP_FAILED', errorMsg: 'Passwort zu kurz' });
      return;
    }
    if (email.length < 4) {
      dispatch({ type: 'SIGNUP_FAILED', errorMsg: 'Keine gültige E-Mail' });
      return;
    }
    signup(email, password, dispatch, () => setShowAuthPopup && setShowAuthPopup(false));
  }

  return (
    <div className={showAuthPopup ? "authentication-popup visible" : "authentication-popup"}>
      <div className="container">
        <span className="close-auth" onClick={() => setShowAuthPopup && setShowAuthPopup(false)}>X</span>
        <div className={showAnotherForm ? "auth moveLeft" : "auth"}>
          <div className="login">
            <h2>Login</h2>
            <form>
              <label>E-Mail:</label>
              <input type="email" name="email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
              <label>Passwort:</label>
              <input type="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
              <input type="submit" value="Login" className="submit" onClick={onLogin} />
            </form>
            <p className="switchTo" id="to-register" onClick={() => setShowAnotherForm(!showAnotherForm)}>Registrieren</p>
          </div>
          <div className="register">
            <h2>Register</h2>
            <form>
              <label>E-Mail:</label>
              <input type="email" name="email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
              <label>Passwort:</label>
              <input type="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
              <label>Passwort Wiederholen:</label>
              <input type="password" name="password-repeat" value={passwordRepeat} onChange={(evt) => setPasswordRepeat(evt.target.value)} />
              <input type="submit" value="Register" className="submit" onClick={onRegister} />
            </form>
            <p className="switchTo" id="to-login" onClick={() => setShowAnotherForm(!showAnotherForm)}>Zum Login</p>
          </div>
        </div>
        {store.message && <p style={{ fontSize: '12px', marginTop: '10px', color: 'red' }}>{store.message}</p>}
      </div>
    </div>
  )
}
