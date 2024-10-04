import { InputText } from "primereact/inputtext"
import Logo from "../../../assets/Header-Logo.png"
import { Avatar } from "primereact/avatar"
import { Menubar } from "primereact/menubar"
import { Button } from "primereact/button"

export default function Header() {

    const HeaderItems = [
        { label:'Trang chủ' , icon: 'pi pi-home', url: '/home'},
        { label:'Đề thi' , icon: 'pi pi-folder', url: '/test'},
        { label:'Flash Card' , icon: 'pi pi-bookmark', url: '/flash-card'},
        { label:'Dashboard' , icon: 'pi pi-cog', url: '/dashboard'},
    ]

    const HeaderStart = <img src={Logo} height={70} alt="Logo" />

    const HeaderEnd = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Button label="Đăng nhập" onClick={() =>  window.open('/login', '_self')} />
            {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
        </div>
    )

    return (
        <div className="fixed top-0 left-0 right-0 z-1">
            <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} />
        </div>
    )
}