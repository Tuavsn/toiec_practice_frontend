import Logo from "../../../assets/Header-Logo.png"
import { Menubar } from "primereact/menubar"
import LoginDialog from "../LoginDialog/LoginDialog"
import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";

export default function Header() {

    const navigate = useNavigate();
    const op = useRef<OverlayPanel>(null);
    const HeaderItems = [
        { label: 'Trang chủ', icon: 'pi pi-home', command: () => navigate('/home') },
        { label: 'Khóa học', icon: 'pi pi-book', command: () => navigate('/course') },
        { label: 'Đề thi', icon: 'pi pi-folder', command: () => navigate('/test') },
        { label: 'Tra cứu', icon: 'pi pi-book', command: () => navigate('/lookup') },

    ]
    if (localStorage.getItem('role') === 'ADMIN') {
        HeaderItems.push({ label: 'Dashboard', icon: 'pi pi-cog', command: () => navigate('/dashboard') })
    }
    const HeaderStart = <img src={Logo} height={70} alt="Logo" />

    const HeaderEnd = localStorage.getItem('access_token') ?
        <div className="card flex justify-content-center pr-3">
            <div className="m-auto pr-2">
                {localStorage.getItem('email')}

            </div>
            <Button icon="pi pi-user" rounded text raised severity="info" aria-label="User"
                onClick={(e) => {
                    if (op.current) {
                        op.current.toggle(e)
                    }
                }
                } />
            <OverlayPanel ref={op}>
                <div className="block">
                <Button className="block" link>hả</Button>
                <Button className="block" link>đọc cái gì</Button>
                <Button className="block" link> mất 5 giây cuộc đời</Button>
                </div>
            </OverlayPanel>
        </div>
        :
        <LoginDialog />



    return (
        <div className="fixed top-0 left-0 right-0 z-5">
            <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} />
        </div>
    )
}