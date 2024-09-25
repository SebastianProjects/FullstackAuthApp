import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import './Home.css'

const LOGOUT_URL = '/auth/logout'

function Home() {
    const navigate = useNavigate();
    const { authState, setAuthState } = useAuth();

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            await axios.post(LOGOUT_URL,
                {
                    withCredentials: true
                }
            );
            setAuthState({});
            navigate('/linkpage');
        } catch (err) {
            if (!err?.response) {
                alert('No server response');
            } else if (err.response?.status === 400) {
                alert('Invalid token')
            } else {
                alert('No token provided')
            }
        }
    }

    return (
        <section className='home-page'>
            <h1 className='header-center smaller'>Logged in as</h1>
            <h1 className='header-center italics'>{authState.email}</h1>
            <Link to="/editor" className='classic-link'>Go to the Editor page</Link>
            <Link to="/admin" className='classic-link'>Go to the Admin page</Link>
            <Link to="/linkpage" className='classic-link'>Go to the Link page</Link>
            <button onClick={() => { logout(); }} className='classic-button'>Logout</button>
        </section>
    )
}

export default Home
