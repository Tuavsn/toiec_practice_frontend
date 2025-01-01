import { Card } from "primereact/card";
import React from "react";

export default function TempAdminPage({ text }: { text: string }) {

    return (
        <React.Fragment>
            <Card className="my-2">
                <h1>Đây là trang {text}</h1>
            </Card>
        </React.Fragment>

    )
}