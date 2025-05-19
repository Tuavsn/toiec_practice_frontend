import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

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
            label: 'Quản lý bài học',
            items: [
                { label: 'Quản lý bài học', icon: 'pi pi-graduation-cap', command: () => navigate('/dashboard/lecture') },
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
                { label: 'Quản lý bình luận', icon: 'pi pi-comments', command: () => navigate('/dashboard/comment') },
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
