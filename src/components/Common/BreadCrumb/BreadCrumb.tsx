import { BreadCrumb } from 'primereact/breadcrumb';
import { Link, useLocation } from 'react-router-dom';

interface CustomBreadCrumItem {
    label: string,
    template: React.ReactNode;
}
export default function CustomBreadCrumb() {
    const location = useLocation(); // Lấy URL hiện tại từ React Router



    // Tạo các mục breadcrumb dựa trên đường dẫn URL hiện tại
    const items = generateBreadcrumbs(location.pathname);

    // Áp dụng iconItemTemplate cho từng mục breadcrumb
    const breadCrumbItems = items.map(item => ({
        ...item,
    }));

    return (
        <BreadCrumb model={breadCrumbItems} />
    );
}

// Hàm tạo các mục breadcrumb từ đường dẫn
const generateBreadcrumbs = (path: string) => {
    const segments = path.split('/').filter(Boolean); // Tách các phần của URL theo dấu "/"
    const breadcrumbs: CustomBreadCrumItem[] = [];
    let accumulatedPath = '';

    segments.forEach((segment) => {
        const [name, id] = segment.split('___'); // Tách "name" và "id" bằng "___"
        if (!id) {
            accumulatedPath += `/${name}`
            breadcrumbs.push({
                label: name.replace(/-/g, ' '),  // Hiển thị tên với khoảng trắng thay vì dấu "-"
                template: NavigateBreadcrumb(accumulatedPath, name.replace(/-/g, ' '))           // Đường dẫn URL với cả "name" và "id"
            });
        } else {
            accumulatedPath += `/${name}___${id}`; // Tạo URL đầy đủ cho từng segment
            breadcrumbs.at(-1)!.label += `:${decodeURIComponent(name)}`;

        }
    });

    return breadcrumbs;
};

function NavigateBreadcrumb(path: string, name: string): JSX.Element {
    return <Link to={path}>{name}</Link>
}