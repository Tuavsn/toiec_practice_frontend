import { InputText } from "primereact/inputtext"
import Logo from "../../../assets/Header-Logo.png"
import { Avatar } from "primereact/avatar"
import { Menubar } from "primereact/menubar"
import { Button } from "primereact/button"

export default function Header() {

    const HeaderItems = [
        { label:'Trang chủ' , icon: 'pi pi-home', to: '/home'},
        { label:'Đề thi' , icon: 'pi pi-folder', to: '/home'},
        { label:'Flash Card' , icon: 'pi pi-bookmark', to: '/home'},
    ]

    const HeaderStart = <img src={Logo} height={70} alt="Logo" />

    const HeaderEnd = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Button label="Đăng nhập" />
            {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
        </div>
    )

    return (
        <div className="fixed top-0 left-0 right-0">
            <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} />
        </div>
    )
}