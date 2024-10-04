import { Card } from "primereact/card";
import Logo from "../assets/Header-Logo.png"
import GoogleLogo from "../assets/google-logo.png"
import { Button } from "primereact/button";

export default function LoginPage() {
    return (
        <div className="h-full w-full flex justify-content-center align-items-center">
            <Card 
                title={(
                    <div>
                        <img src={Logo} className="max-w-20rem" />
                        <h2 className="">Đăng nhập</h2>
                    </div>
                )} 
                className="relative max-w-30rem text-center mx-auto p-6"
            >
                <Button type="button" outlined>
                    <img src={GoogleLogo} className="w-2rem" />
                    <p className="my-0 ml-2 font-bold text-lg text-gray-500">Đăng nhập với Google</p>
                </Button>
                <Button 
                    type="button" icon="pi pi-angle-left" outlined className="absolute top-0 left-0 m-2 border-none" 
                    onClick={() =>  window.history.back()}
                >
                    Trở lại
                </Button>
            </Card>
        </div>
    )
}