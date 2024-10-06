import { ReactNode } from "react"
import {
    LeftNavigationBar
} from "../Admin/Index"

export default function AdminLayout({children} : {children : ReactNode}) {
    return (
        <>
            <div className="grid min-h-screen" style={{marginTop: "100px"}}>
                <div className="col-2">
                    <LeftNavigationBar />
                </div>
                <div className="col-10">
                    {children}
                </div>
            </div>
        </>
    )
}