import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth'
import './Login.css'

const LOGIN_URL = '/auth'

//TODO: CSS
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { authState, setAuthState } = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');

    const [pwd, setPwd] = useState('');

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);


    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                ({
                    email: email,
                    password: pwd
                }),
                {
                    withCredentials: true
                }
            );
            setAuthState({
                email: response?.data?.email,
                roles: response?.data?.roles,
                token: response?.data?.token,
                status: true,
            });
            console.log(authState?.token);
            console.log(authState?.roles);
            setEmail('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            console.log('oki')
            console.log(err.response.status) // this is 403
            console.log(err.response.data.message)  // this is Email not verified
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 401 || err.response?.status === 400) {
                setErrMsg('Invalid email or password'); // it goes here
            } else if (err.response?.status === 403) {
                setErrMsg('Email not verified')
            } else if (err.response?.status === 500) {
                setErrMsg('Internal server');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className='login-page'>
            <p ref={errRef}
                className={errMsg ? 'errmsg' : 'offscreen'}
                aria-live='assertive'
            >{errMsg}</p >
            <h1 className='header-left'>Login</h1>
            <form onSubmit={handleSubmit}>

                {/* ----------------Email----------------*/}

                <label
                    className='classic-label'
                    htmlFor='email'>
                    E-mail
                </label>
                <input
                    type='text'
                    id='email'
                    className='classic-input'
                    ref={userRef}
                    autoComplete='on'
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                    required
                />

                {/* ----------------Password----------------*/}

                <label
                    className='classic-label'
                    htmlFor='password'>
                    Password
                </label>
                <input
                    type='password'
                    id='password'
                    className='classic-input'
                    onChange={(e) => { setPwd(e.target.value) }}
                    value={pwd}
                    required
                />

                <button className='classic-button'>
                    Sign in
                </button>
                <p className="left-p register-p">Didn't register yet?</p>
                <p className='classic-link' onClick={() => { navigate('/register') }}>Register</p>
            </form>
        </section >
    )
}

export default Login
