import React, { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom';
import './Register.css';

const FIRSTNAME_REGEX = /^[a-zA-Z][a-zA-Z]{3,24}$/;
const LASTNAME_REGEX = /^[a-zA-Z][a-zA-Z]{3,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

//TODO: CSS
function Register() {
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setfirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    console.log(result);
    console.log(firstName);
    setValidFirstName(result)
  }, [firstName]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    console.log(result);
    console.log(lastName);
    setValidLastName(result)
  }, [lastName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result)
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result)
    const match = pwd === matchPwd;
    setValidMatchPwd(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [firstName, lastName, email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ch1 = FIRSTNAME_REGEX.test(firstName);
    const ch2 = LASTNAME_REGEX.test(lastName);
    const ch3 = EMAIL_REGEX.test(email);
    const ch4 = PWD_REGEX.test(pwd);
    if (!ch1 || !ch2 || !ch3 || !ch4) {
      setErrMsg('Invalid entry');
      return;
    }
    try {
      await axios.post(REGISTER_URL,
        ({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: pwd
        }),
        {
          headers: { 'Content-type': 'application/json' }
        }
      )
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response');
      } else if (err.response?.status === 400) {
        setErrMsg('Wrong input')
      } else if (err.response?.status === 409) {
        setErrMsg('User with this email already exists')
      } else {
        setErrMsg('Registration failed')
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      {success ? (
        <section className='register-page'>
          <h1 className='header-left'>
            Success
            <span className='valid'>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <p className='left-p' >Please verify your e-mail</p>
            <p className='classic-link' onClick={() => { navigate('/login'); }}>Login</p>
          </h1>
        </section>
      ) : (
        <section className='register-page'>
          <p ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
          >{errMsg}</p >
          <h1 className='header-left'>Register</h1>
          <form onSubmit={handleSubmit}>

            {/* ----------------First name----------------*/}

            <label
              className='classic-label'
              htmlFor='firstName'>
              First name
              <span className={validFirstName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validFirstName || !firstName ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='firstName'
              className='classic-input'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => { setfirstName(e.target.value) }}
              required
              aria-invalid={validFirstName ? 'false' : 'true'}
              aria-describedby='namenote'
              onFocus={() => { setFirstNameFocus(true) }}
              onBlur={() => { setFirstNameFocus(false) }}
            />
            <p id='namenote'
              className={firstNameFocus && firstName && !validFirstName ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters allowed.
            </p>

            {/* ----------------Last name----------------*/}

            <label
              htmlFor='lastName'
              className='classic-label'>
              Last name
              <span className={validLastName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validLastName || !lastName ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='lastName'
              className='classic-input'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => { setLastName(e.target.value) }}
              required
              aria-invalid={validLastName ? 'false' : 'true'}
              aria-describedby='namenote'
              onFocus={() => { setLastNameFocus(true) }}
              onBlur={() => { setLastNameFocus(false) }}
            />
            <p id='namenote'
              className={lastNameFocus && lastName && !validLastName ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters allowed.
            </p>

            {/* ----------------Email----------------*/}

            <label
              className='classic-label'
              htmlFor='email'>
              E-mail
              <span className={validEmail ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !email ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='email'
              className='classic-input'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => { setEmail(e.target.value) }}
              required
              aria-invalid={validEmail ? 'false' : 'true'}
              aria-describedby='uidnote'
              onFocus={() => { setEmailFocus(true) }}
              onBlur={() => { setEmailFocus(false) }}
            />
            <p id='uidnote'
              className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be valid e-mail address.
            </p>

            {/* ----------------Password----------------*/}

            <label
              className='classic-label'
              htmlFor='password'>
              Password
              <span className={validPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='password'
              className='classic-input'
              onChange={(e) => { setPwd(e.target.value) }}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby='pwdnote'
              onFocus={() => { setPwdFocus(true) }}
              onBlur={() => { setPwdFocus(false) }}
            />
            <p id='pwdnote'
              className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters. <br />
              Must include uppercase and lowercase letters, a number and a special character. <br />
              Allowed special characters: !@#$%
            </p>

            {/* ----------------Password----------------*/}

            <label
              className='classic-label'
              htmlFor='confirm-password'>
              Confirm password
              <span className={validMatchPwd && matchPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatchPwd || !matchPwd ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='confirm-password'
              className='classic-input'
              onChange={(e) => { setMatchPwd(e.target.value) }}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby='confirmnote'
              onFocus={() => { setMatchPwdFocus(true) }}
              onBlur={() => { setMatchPwdFocus(false) }}
            />
            <p id='confirmnote'
              className={matchPwdFocus && !validMatchPwd ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input.
            </p>

            <button className='classic-button' disabled={!validFirstName || !validLastName || !validEmail || !validPwd || !validMatchPwd ? true : false}>
              Sign in
            </button>
            <p className='left-p sign-p'>Already registered?</p>
            <p className='classic-link' onClick={() => { navigate('/login') }}>Login</p>
          </form>
        </section >
      )
      }
    </>
  )
}

export default Register;
