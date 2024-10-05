import { Menu } from 'primereact/menu';

export default function LeftNavigationBar() {

    const MenuItems = [
        { 
            label: 'Thống kê', 
            items: [
                { label: 'Thống kê bài làm', icon: 'pi pi-chart-pie', url: "/dashboard/test-analyst" },
                { label: 'Thống kê tài khoản', icon: 'pi pi-users', url: "/dashboard/user-analyst" },
            ]
        },
        { 
            label: 'Quản lý đề thi', 
            items: [
                { label: 'Quản lý bộ đề', icon: 'pi pi-folder', url: "/dashboard/category" },
                { label: 'Quản lý đề thi', icon: 'pi pi-file', url: "/dashboard/test" },
            ]
        },
        { label: 'Quản lý flash card', icon: 'pi pi-bookmark'},
        { 
            label: 'Quản lý người dùng', 
            items: [
                { label: 'Quản lý tài khoản', icon: 'pi pi-user', url: "/dashboard/account" },
                { label: 'Gửi thông báo', icon: 'pi pi-bell', url: "/dashboard/notify" },
                { label: 'Quản lý chatbox', icon: 'pi pi-inbox', url: "/dashboard/chat" },
        ]},
    ]

    return (
        <div >
            <Menu model={MenuItems} className="w-full" />
        </div>
    )
}