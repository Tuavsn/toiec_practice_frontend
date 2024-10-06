import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';

export default function LeftNavigationBar() {
    
    const navigate = useNavigate(); // Use the hook to get the navigate function

    const MenuItems = [
        {
            label: 'Thống kê',
            items: [
                { label: 'Thống kê bài làm', icon: 'pi pi-chart-pie', command: () => navigate('/dashboard/test-analyst') },
                { label: 'Thống kê tài khoản', icon: 'pi pi-users', command: () => navigate('/dashboard/user-analyst') },
            ]
        },
        {
            label: 'Quản lý đề thi',
            items: [
                { label: 'Quản lý bộ đề', icon: 'pi pi-folder', command: () => navigate('/dashboard/category') },
                { label: 'Quản lý đề thi', icon: 'pi pi-file', command: () => navigate('/dashboard/test') },
            ]
        },
        {
            label: 'Quản lý người dùng',
            items: [
                { label: 'Quản lý tài khoản', icon: 'pi pi-user', command: () => navigate('/dashboard/account') },
                { label: 'Gửi thông báo', icon: 'pi pi-bell', command: () => navigate('/dashboard/notify') },
                { label: 'Quản lý chatbox', icon: 'pi pi-inbox', command: () => navigate('/dashboard/chat') },
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
