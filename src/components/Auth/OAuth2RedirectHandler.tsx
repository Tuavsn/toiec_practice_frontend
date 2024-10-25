import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const iduser = queryParams.get('iduser');
        const token = queryParams.get('token');
        const avatar = queryParams.get('avatar');
        const email = queryParams.get('email')??"Khong co email";
        const role = queryParams.get('role')??"Khong co role";

        if (iduser && token && avatar) {
            localStorage.setItem('iduser', iduser);
            localStorage.setItem('access_token', token);
            localStorage.setItem('avatar', decodeURIComponent(avatar));
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
        }

        navigate('/');
    }, [navigate]);

    return null;
};

export default OAuth2RedirectHandler;