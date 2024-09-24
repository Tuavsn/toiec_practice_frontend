import { ReactNode } from "react"
import {
    LeftNavigationBar
} from "../Admin/Index"

export default function AdminLayout({children} : {children : ReactNode}) {
    return (
        <div className="flex">
            <LeftNavigationBar />
            {children}
        </div>
    )
}