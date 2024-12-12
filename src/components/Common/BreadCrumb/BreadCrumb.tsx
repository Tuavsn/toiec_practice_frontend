import { BreadCrumb } from 'primereact/breadcrumb';
import { Link, useLocation } from 'react-router-dom';

interface CustomBreadCrumItem {
    label: string;
    template: React.ReactNode;
}

export default function CustomBreadCrumb() {
    const location = useLocation(); // Get the current URL from React Router

    // Generate breadcrumb items based on the current path
    const items = generateBreadcrumbs(location.pathname);

    return (
        <BreadCrumb model={items} />
    );
}

// Function to generate breadcrumb items from the URL path
const generateBreadcrumbs = (path: string): CustomBreadCrumItem[] => {
    const segments = path.split('/').filter(Boolean); // Tách các phần của URL theo dấu "/"
    const breadcrumbs: { label: string, url: string }[] = [];
    let accumulatedPath = '';

    segments.forEach((segment) => {
        const [name, id] = segment.split('___'); // Tách "name" và "id" bằng "___"
        if (!id) {
            accumulatedPath += `/${name}`
            breadcrumbs.push({
                label: changeName(name.replace(/-/g, ' ')),  // Hiển thị tên với khoảng trắng thay vì dấu "-"
                url: accumulatedPath,            // Đường dẫn URL với cả "name" và "id"
            });
        } else {
            accumulatedPath += `/${name}___${id}`; // Tạo URL đầy đủ cho từng segment
            breadcrumbs.at(-1)!.label += `:${decodeURIComponent(name)}`;

        }
    });

    // Convert raw breadcrumb objects into `CustomBreadCrumItem`
    return breadcrumbs.map((breadcrumb) => ({
        label: breadcrumb.label,
        template: NavigateBreadcrumb(breadcrumb.url, breadcrumb.label),
    }));
};

// Component for breadcrumb navigation links
function NavigateBreadcrumb(path: string, name: string): JSX.Element {
    return <Link to={path}>{name}</Link>;
}

// Function to map URL segments to user-friendly names
function changeName(name: string): string {
    switch (name) {
        case 'dashboard':
            return 'Quản trị';
        case 'categories':
            return 'Bộ đề';
        case 'tests':
            return 'Đề thi';
        case 'questions':
            return 'Câu hỏi';
        case 'upload':
            return 'Đăng tệp từ excel';
        default:
            return name;
    }
}
