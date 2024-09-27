import { ReactNode } from "react"
import {
    Header,
    Footer
} from "../Common/Index"
import Container from "./Container"

export default function UserLayout({children} : {children:ReactNode}) {
    return (
        <Container>
            <Header />
                <div className="min-h-screen" style={{marginTop: "100px"}}>
                    {children}
                </div>
            <Footer />
        </Container>
    )
}