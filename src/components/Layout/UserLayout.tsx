import { ReactNode } from "react"

export default function UserLayout({children} : {children:ReactNode}) {
    return (
        <>
            <div id='user-layout' className="min-h-screen" style={{marginTop: "100px"}}>
                {children}
            </div>
        </>
    )
}