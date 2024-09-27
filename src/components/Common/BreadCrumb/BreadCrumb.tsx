import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';

export default function CustomBreadCrumb() {

    const BreadCrumbItems = [
        { label: 'Trang chủ', url: '/'},
        { label: 'Danh sách đề thi', url: '/category'},
    ]

    return (
        <BreadCrumb model={BreadCrumbItems}/>
    )
}