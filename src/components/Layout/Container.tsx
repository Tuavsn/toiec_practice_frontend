import { ReactNode } from "react";

export default function Container({children} : {children : ReactNode}) {
    return (
        <div className="p-d-flex p-jc-center p-ai-center p-px-2">
            <div className="custom-container p-shadow-3 p-py-5">
                {children}
            </div>
        </div>
    )
}