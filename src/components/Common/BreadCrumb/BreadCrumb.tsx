import { BreadCrumb } from 'primereact/breadcrumb';

interface CustomBreadCrumbProps {
    items: { label: string, icon: string, url: string }[];
}

export default function CustomBreadCrumb({ items }: CustomBreadCrumbProps) {

    const iconItemTemplate = (item: any, options: any) => {
        return (
            <a className={`${options.className} text-black-alpha-80 hover:text-blue-700`} href={item.url}>
                <span className={item.icon}></span>
                <span className="ml-2">{item.label}</span>
            </a>
        );
    };

    const breadCrumbItems = items.map(item => ({
        ...item,
        template: iconItemTemplate,
    }));

    return (
        <BreadCrumb model={breadCrumbItems}/>
    )
}