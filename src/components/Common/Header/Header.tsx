import { InputText } from "primereact/inputtext"
import Logo from "../../../assets/Header-Logo.png"
import { Menubar } from "primereact/menubar"
import LoginDialog from "../LoginDialog/LoginDialog"

export default function Header() {

    const HeaderItems = [
        { label:'Trang chủ' , icon: 'pi pi-home', url: '/home'},
        { label:'Khóa học' , icon: 'pi pi-book', url: '/course'},
        { label:'Đề thi' , icon: 'pi pi-folder', url: '/test'},
        { label:'Dashboard' , icon: 'pi pi-cog', url: '/dashboard'},
    ]

    const HeaderStart = <img src={Logo} height={70} alt="Logo" />

    const HeaderEnd = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <LoginDialog />
        </div>
    )

    return (
        <div className="fixed top-0 left-0 right-0 z-1">
            <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} />
        </div>
    )
}