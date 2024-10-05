import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';

export default function LeftNavigationBar() {
    const navigate = useNavigate(); // Use the hook to get the navigate function

    const MenuItems = [
        { 
            label: 'Thống kê', 
            items: [
                { label: 'Thống kê bài làm', icon: 'pi pi-chart-pie', command: () => navigate('/dashboard/statistics') },
                { label: 'Thống kê tài khoản', icon: 'pi pi-users', command: () => navigate('/dashboard/statistics/account') },
            ]
        },
        { 
            label: 'Quản lý đề thi', 
            items: [
                { label: 'Quản lý bộ đề', icon: 'pi pi-folder', command: () => navigate('/dashboard/manage-categories') },
                { label: 'Quản lý đề thi', icon: 'pi pi-file', command: () => navigate('/dashboard/manage-tests') },
            ]
        },
        { 
            label: 'Quản lý người dùng', 
            items: [
                { label: 'Quản lý tài khoản', icon: 'pi pi-user', command: () => navigate('/dashboard/manage-users') },
                { label: 'Gửi thông báo', icon: 'pi pi-bell', command: () => navigate('/dashboard/send-notifications') },
                { label: 'Quản lý chatbox', icon: 'pi pi-inbox', command: () => navigate('/dashboard/manage-chatbox') },
            ]
        },
    ];

    return (
        <div>
            <Menu 
                model={MenuItems} 
                className="w-full"
            />
        </div>
    );
}
