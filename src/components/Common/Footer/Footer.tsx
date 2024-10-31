import Logo from "../../../assets/Header-Logo.png"
import { useTestState } from "../../../context/TestStateProvider";

export default function Footer() {
    // Lấy giá trị isOnTest từ context
    const { isOnTest } = useTestState();
    return ( !isOnTest &&
        <div className="mt-5 pb-2 flex justify-content-between align-items-center">
            <img src={Logo} height={60} alt="Logo" />
            <div>
                <p className="text-lg">
                    <a className="flex align-items-center gap-2" href="https://github.com/Tuavsn/toiec_practice_frontend" target="_blank">
                        <i className="pi pi-github" />
                        Github
                    </a>
                </p>
            </div>
            <div><p className="text-lg"><i>Developed From 2024</i></p></div>
        </div>
    )
}