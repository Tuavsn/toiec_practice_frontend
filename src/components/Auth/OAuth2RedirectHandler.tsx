import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const message = queryParams.get('message');
        const status = queryParams.get('status');
        if (message && status && status === '403' && message === 'BLOCKED ACCOUNT') {
            toast.current?.show({
                severity: 'error',
                summary: 'Tài khoản của bạn đã bị khóa',
                detail: 'Vui lòng liên hệ với quản trị viên để biết thêm thông tin chi tiết',
                life: 5000,
            });
        }
        else {

            const iduser = queryParams.get('iduser');
            const token = queryParams.get('token');
            const avatar = queryParams.get('avatar');
            const email = queryParams.get('email') ?? "Khong co email";
            const role = queryParams.get('role') ?? "Khong co role";

            if (iduser && token && avatar) {
                localStorage.setItem('iduser', iduser);
                localStorage.setItem('access_token', token);
                localStorage.setItem('avatar', decodeURIComponent(avatar));
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);
            }
        }

        navigate('/');
    }, [navigate]);

    return null;
};

export default OAuth2RedirectHandler;