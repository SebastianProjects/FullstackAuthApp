import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import './Admin.css'
import ROLES_LIST from "../config/roles_list";
import { useNavigate, useLocation } from "react-router-dom";

const USERS_URL = '/users'

function Admin() {
    const [users, setUsers] = useState([]);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const getAllUsers = async () => {
            try {
                const response = await axiosPrivate.get(USERS_URL);
                setUsers(response.data);
            } catch (err) {
                console.log(err)
            }
        }

        getAllUsers();
    }, []);


    const deleteUser = async (userEmail) => {
        let isMounted = true;
        const controller = new AbortController();

        try {
            await axiosPrivate.delete((USERS_URL + `/${userEmail}`), {
                signal: controller.signal
            });
            isMounted && setUsers(users.filter(user => user.email !== userEmail));
        } catch (err) {
            if (err.code !== "ERR_CANCELED") {
                console.log(err)
                console.log(err.code)
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const asignRole = async (userEmail, role) => {
        let isMounted = true;
        const controller = new AbortController();

        try {
            const response = await axiosPrivate.patch((USERS_URL + `/${userEmail}`), { role });
            isMounted && setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.email === userEmail ? { ...user, roles: response.data.roles } : user
                )
            );
        } catch (err) {
            if (err.code !== "ERR_CANCELED") {
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    return (
        <section className="admin-page">
            <h1 className="header-center">Admins Page</h1>
            <p className="left-p">Welcome to admin's page!</p>
            <table className="user-table">
                <thead>     
                    <tr>        
                        <th className="left-p">First Name</th>
                        <th className="left-p">Last Name</th>
                        <th className="left-p">Email</th>
                        <th className="left-p">Delete</th>
                        <th className="left-p">Editor</th>
                        <th className="left-p">Admin</th>
                    </tr>
                </thead>
                <tbody >
                    {users?.map((user, key) => {
                        const roles = Object.values(user.roles);
                        const isEditor = roles.includes(ROLES_LIST.Editor);
                        const isAdmin = roles.includes(ROLES_LIST.Admin);
                        return (
                            <tr key={key}>
                                <td className="left-p">{user.firstName}</td>
                                <td className="left-p">{user.lastName}</td>
                                <td className="left-p">{user.email}</td>
                                <td className="left-p"><button className="classic-button" onClick={() => { deleteUser(user.email); }}>Delete</button></td>
                                <td className="left-p"><input className="check-button" type="checkbox" checked={isEditor} onChange={() => { asignRole(user.email, 'Editor'); }} />Editor</td>
                                <td className="left-p"><input className="check-button" type="checkbox" checked={isAdmin} onChange={() => { asignRole(user.email, 'Admin'); }} />Admin</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Link className='classic-link' to="/">Home</Link>
        </section>
    )
}

export default Admin
