import { useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register'
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Editor from './components/Editor';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import ROLES from './config/roles_list'
import useTheme from './hooks/useTheme';
import EmailVerify from './components/EmailVerify';

function App() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const theme = sessionStorage.getItem('theme');
    if (theme) {
      setTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [])

  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        {/* Public routes */}
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='linkpage' element={<LinkPage />} />
        <Route path='unauthorized' element={<Unauthorized />} />
        <Route path='register/:id/verify/:token' element={<EmailVerify />} />
        
        {/* Protected routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path='/' element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path='editor' element={<Editor />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='admin' element={<Admin />} />
        </Route>

        {/* Last resort */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes >

  );
}

export default App;
