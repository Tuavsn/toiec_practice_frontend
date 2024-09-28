import Logo from "../../../assets/Toiec-Logo.png"

export default function Footer() {
    return (
        <div className="mt-5 pb-2 flex justify-content-between align-items-center">
            <img src={Logo} height={50} alt="Logo" />
            <div className="">
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