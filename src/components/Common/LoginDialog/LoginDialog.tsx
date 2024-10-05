import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import Logo from "../../../assets/Header-Logo.png"
import GoogleLogo from "../../../assets/google-logo.png"

export default function LoginDialog() {

    const [visible, setVisible] = useState(false);

    return (
        <div className="card flex justify-content-center">
            <Button label="Đăng nhập" icon="pi pi-user" onClick={() => setVisible(true)} style={{backgroundColor: "#004B8D"}}/>
            <Dialog
                visible={visible}
                modal
                onHide={() => {if (!visible) return; setVisible(false); }}
                content={({ hide }) => (
                    <div className="h-full w-full flex justify-content-center align-items-center">
                        <Card 
                            title={(
                                <div>
                                    <img src={Logo} className="max-w-20rem" />
                                    <h2 className="my-2" style={{color: '#004B8D'}}>Đăng nhập</h2>
                                </div>
                            )} 
                            className="relative max-w-30rem text-center mx-auto p-6"
                        >
                            <Button type="button" outlined>
                                <img src={GoogleLogo} className="w-2rem" />
                                <p className="my-0 ml-2 font-bold text-lg text-gray-500">Đăng nhập với Google</p>
                            </Button>
                            <Button 
                                type="button" outlined className="absolute top-0 right-0 m-2 border-none" 
                                onClick={(e) => hide(e)}
                            >
                                <i className="pi pi-times text-xl" />
                            </Button>
                        </Card>
                    </div>
                )}
            >
            </Dialog>
        </div>
    )
}