import { useState, useEffect } from 'react'
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios'
import './EmailVerify.css'

function EmailVerify() {
    const [validUrl, setValidUrl] = useState(false);
    const params = useParams()

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const verify_url = `/register/${params.id}/verify/${params.token}`;
                const response = await axios.get(verify_url);
                console.log(response)
                setValidUrl(true);
            } catch (err) {
                if (!err?.response) {
                    console.log();
                } else if (err.response?.status === 400) {
                    console.log(err);
                } else {
                    console.log(err);
                }
                setValidUrl(false);
            }
        }
        verifyEmailUrl()
    }, [])

    return (
        <section className='email-verify-page'>
            {validUrl ? (
                <>
                    <h1 className='header-center'>
                        Email verified successfully
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </h1>
                    <Link to='/login' className='classic-link' >Login</Link>
                </>
            ) : (
                <h1 className='header-center'>
                    Verification link expired
                    <FontAwesomeIcon icon={faXmark} />
                </h1>
            )}
        </section>
    )
}

export default EmailVerify;
