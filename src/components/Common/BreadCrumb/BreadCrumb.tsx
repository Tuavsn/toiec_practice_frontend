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
            const formatName = changeName(name.replace(/-/g, ' '));

            breadcrumbs.push({
                label: formatName,  // Hiển thị tên với khoảng trắng thay vì dấu "-"
                template: NavigateBreadcrumb(accumulatedPath, formatName)           // Đường dẫn URL với cả "name" và "id"
            });
        } else {
            accumulatedPath += `/${name}___${id}`; // Tạo URL đầy đủ cho từng segment
        }
    });
    return breadcrumbs;
};

function NavigateBreadcrumb(path: string, name: string): JSX.Element {
    return <Link to={path}>{name}</Link>
}

function changeName(name: string): string {
    switch (name) {
        case "dashboard":
            return "Quản trị"
        case "categories":
            return "Bộ đề"
        case "tests":
            return "Đề thi";
        case "questions":
            return "Câu hỏi";
        case "upload":
            return "Đăng đề từ excel";
        default:
            return "Nhà";
    }
}