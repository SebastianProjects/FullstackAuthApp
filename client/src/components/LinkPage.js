import { Link } from 'react-router-dom';
import './LinkPage.css'

function LinkPage() {
    return (
        <section className='link-page'>
            <h1 className='header-left'>Login</h1>
            <Link to="/login" className='classic-link'>Login</Link>
            <h1 className='header-left'>Only as logged</h1>
            <Link to="/" className='classic-link'>Home</Link>
            <Link to="/editor" className='classic-link  '>Editors Page</Link>
            <Link to="/admin" className='classic-link'>Admin Page</Link>
        </section>
    )
}

export default LinkPage
