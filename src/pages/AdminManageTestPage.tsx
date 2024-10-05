import { Card } from "primereact/card";
import React, { memo } from "react";

export function AdminManageTestPage()
{

    return (
        <React.Fragment>
            <div key={'b'}>
    
                <Card className="my-2">
                    <h1>ĐÂY LÀ TRANG QUẢN LÝ TEST</h1>
                </Card>
            </div>
        </React.Fragment>
    )

}

export default memo(AdminManageTestPage);