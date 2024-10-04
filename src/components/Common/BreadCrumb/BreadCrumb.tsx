import { BreadCrumb } from 'primereact/breadcrumb';

export default function CustomBreadCrumb() {

    const iconItemTemplate = (item: any, options: any) => {
        return (
            <a className={`${options.className} text-black-alpha-80 hover:text-blue-700`} href={item.url}>
                <span className={item.icon}></span>
                <span className="ml-2">{item.label}</span>
            </a>
        );
    };

    const BreadCrumbItems = [
        { label: 'Trang chủ', icon: 'pi pi-home', url: '/', template: iconItemTemplate},
        { label: 'Danh sách đề thi', icon: 'pi pi-file', url: '/category', template: iconItemTemplate},
    ]

    return (
        <BreadCrumb model={BreadCrumbItems}/>
    )
}