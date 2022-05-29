/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Auth.less';
import { useAuth } from '../contexts/authContext';
import { LocationState } from '../types/LocationState';

const AuthPage = (): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || '/events';
  const auth = useAuth();

  const handleSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    // console.log(email, password);

    if (
      (email && email.trim().length === 0) ||
      (password && password.trim().length === 0)
    ) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email,
          password,
        },
      };
    }

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        auth.login(
          resData.data.login.token,
          resData.data.login.userId,
          () => navigate(from, { replace: true }),
          // resData.data.login.tokenExpiration,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="auth-page">
      <h1>The Auth Page</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={emailRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordRef} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
