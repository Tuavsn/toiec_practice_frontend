import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';

export default function LeftNavigationBar() {

    const navigate = useNavigate(); // Use the hook to get the navigate function

    const MenuItems = [

        {
            label: 'Quản lý đề thi',
            items: [
                { label: 'Quản lý bộ đề', icon: 'pi pi-folder', command: () => navigate('/dashboard/categories') },
            ]
        },
        {
            label: 'Quản lý bài giảng',
            items: [
                { label: 'Quản lý bài giảng', icon: 'pi pi-graduation-cap', command: () => navigate('/dashboard/lecture') },
            ]
        },
        {
            label: 'Quản lý chủ đề',
            items: [
                { label: 'Quản lý chủ đề', icon: 'pi pi-bookmark', command: () => navigate('/dashboard/topic') },
            ]
        },
        {
            label: 'Quản lý người dùng',
            items: [
                { label: 'Quản lý tài khoản', icon: 'pi pi-user', command: () => navigate('/dashboard/account') },
                { label: 'Quản lý chức danh', icon: 'pi pi-shield', command: () => navigate('/dashboard/role') },
                { label: 'Quản lý quyền', icon: 'pi pi-lock-open', command: () => navigate('/dashboard/permission') },
                // { label: 'Gửi thông báo', icon: 'pi pi-bell', command: () => navigate('/dashboard/notify') },
                // { label: 'Quản lý chatbox', icon: 'pi pi-inbox', command: () => navigate('/dashboard/chat') },
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
