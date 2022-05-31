/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  ButtonGroup,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import './Auth.less';
import { useAuth } from '../contexts/authContext';
import { LocationState } from '../types/LocationState';

const PasswordInput = ({
  passwordRef,
}: {
  passwordRef: React.RefObject<HTMLInputElement>;
}): JSX.Element => {
  const [show, setShow] = React.useState(false);

  return (
    <InputGroup>
      <Input
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        id="password"
        ref={passwordRef}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

const AuthPage = (): JSX.Element => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = React.useState<string>('');

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
        if (res.status !== 200 && res.status !== 201 && res.status !== 500) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(resData.errors[0].message);
        }
        auth.login(
          resData.data.login.token,
          resData.data.login.userId,
          () => navigate(from, { replace: true }),
          // resData.data.login.tokenExpiration,
        );
      })
      .catch(err => {
        console.log(err);
        setError(err.message);
      });
  };

  return (
    <div className="auth-page">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
          <AlertDescription>Please try again.</AlertDescription>
        </Alert>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email address"
            ref={emailRef}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <PasswordInput passwordRef={passwordRef} />
        </div>
        <div className="form-actions">
          <ButtonGroup variant="with-shadow" colorScheme="orange" spacing="6">
            <Button type="submit">Submit</Button>
            <Button onClick={() => setIsLogin(!isLogin)}>
              Switch to {isLogin ? 'Signup' : 'Login'}
            </Button>
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
