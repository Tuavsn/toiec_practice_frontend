import React, { createContext, useContext, ReactNode } from 'react';
import { Toast } from 'primereact/toast';

// Định nghĩa kiểu cho context với ref có thể nhận giá trị null ban đầu
interface ToastContextType {
    toast: React.MutableRefObject<Toast | null>;  // Cho phép giá trị null ban đầu
}

// Tạo context với kiểu đã định nghĩa
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook tuỳ chỉnh để truy cập Toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Định nghĩa kiểu props cho ToastProvider, bao gồm children
interface ToastProviderProps {
    children: ReactNode;
}

// Component ToastProvider
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    // Sử dụng useRef để tạo ref với giá trị ban đầu là null
    const toastRef = React.useRef<Toast | null>(null); // Cho phép giá trị ban đầu là null

    return (
        <ToastContext.Provider value={{ toast: toastRef }}>
            <Toast ref={toastRef} />
            {children} {/* Render các component con bên trong ToastProvider */}
        </ToastContext.Provider>
    );
};
