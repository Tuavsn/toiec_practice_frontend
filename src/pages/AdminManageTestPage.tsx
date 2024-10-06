
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';

export function AdminManageTestPage() {
    // Use useLocation to get the current URL location
    const location = useLocation();

    // Function to get query parameters from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        // Get specific query parameter value
        const categoryID = params.get('category_id'); 
        return categoryID;
    };

    const categoryID = getQueryParams(); 

    return (
        <React.Fragment>
            <div key={'b'}>
                <Card className="my-2">
                    <h1>ĐÂY LÀ TRANG QUẢN LÝ TEST</h1>
                    {categoryID && <p>id của category là à à à à à à à: {categoryID}</p>}
                </Card>
            </div>
        </React.Fragment>
    );
}


export default memo(AdminManageTestPage);