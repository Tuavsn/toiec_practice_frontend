import { ReactNode } from "react"
import {
    Header,
    Footer
} from "../Common/Index"

export default function UserLayout({children} : {children:ReactNode}) {
    return (
        <div className="p-grid p-justify-center">
            <div className="p-col-12 p-md-10 p-lg-8 bg-primary">
                <Header />
                {children}
                <Footer />
            </div>
        </div>
    )
}