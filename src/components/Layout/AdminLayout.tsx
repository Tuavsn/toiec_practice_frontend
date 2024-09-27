import { ReactNode } from "react"
import {
    LeftNavigationBar
} from "../Admin/Index"
import { Footer, Header } from "../Common/Index"
import Container from "./Container"

export default function AdminLayout({children} : {children : ReactNode}) {
    return (
        <Container>
            <Header />
                <div className="grid min-h-screen" style={{marginTop: "100px"}}>
                    <div className="col-2">
                        <LeftNavigationBar />
                    </div>
                    <div className="col-10">
                        {children}
                    </div>
                </div>
            <Footer />
        </Container>
    )
}