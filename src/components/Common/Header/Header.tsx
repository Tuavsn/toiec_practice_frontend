import { InputText } from "primereact/inputtext"
import Logo from "../../../assets/Header-Logo.png"
import { Menubar } from "primereact/menubar"
import LoginDialog from "../LoginDialog/LoginDialog"
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    const HeaderItems = [
        { label:'Trang chủ' , icon: 'pi pi-home', command: () => navigate('/home')},
        { label:'Khóa học' , icon: 'pi pi-book', command: () => navigate('/course')},
        { label:'Đề thi' , icon: 'pi pi-folder', command: () => navigate('/test')},
        { label:'Dashboard' , icon: 'pi pi-cog', command: () => navigate('/dashboard')},
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