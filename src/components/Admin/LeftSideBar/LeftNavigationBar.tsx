import { Menu } from 'primereact/menu';

export default function LeftNavigationBar() {

    const MenuItems = [
        { 
            label: 'Thống kê', 
            items: [
                { label: 'Thống kê bài làm', icon: 'pi pi-chart-pie' },
                { label: 'Thống kê tài khoản', icon: 'pi pi-users' },
            ]
        },
        { 
            label: 'Quản lý đề thi', 
            items: [
                { label: 'Quản lý bộ đề', icon: 'pi pi-folder' },
                { label: 'Quản lý đề thi', icon: 'pi pi-file' },
            ]
        },
        { label: 'Quản lý flash card', icon: 'pi pi-bookmark'},
        { 
            label: 'Quản lý người dùng', 
            items: [
                { label: 'Quản lý tài khoản', icon: 'pi pi-user' },
                { label: 'Gửi thông báo', icon: 'pi pi-bell' },
                { label: 'Quản lý chatbox', icon: 'pi pi-inbox' },
        ]},
    ]

    return (
        <div >
            <Menu model={MenuItems} className="w-full" />
        </div>
    )
}