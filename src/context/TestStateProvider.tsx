// TestStateProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa một interface cho trạng thái của context
interface TestState {
  isOnTest: boolean; // Trạng thái kiểm tra: true nếu đang kiểm tra, false nếu không
  setIsOnTest: React.Dispatch<React.SetStateAction<boolean>>; // Hàm để cập nhật trạng thái kiểm tra
}

// Tạo một giá trị mặc định cho context
const defaultTestState: TestState = {
  isOnTest: false, // Giá trị mặc định là không đang kiểm tra
  setIsOnTest: () => { }, // Hàm giữ chỗ (placeholder function)
};

// Tạo context với giá trị mặc định
const TestStateContext = createContext<TestState>(defaultTestState);

// Tạo một component Provider cho context
export const TestStateProvider = ({ children }: { children: ReactNode }) => {
  const [isOnTest, setIsOnTest] = useState<boolean>(false); // Khởi tạo trạng thái kiểm tra

  return (
    <TestStateContext.Provider value={{ isOnTest, setIsOnTest }}>
      {children} {/* Truyền các component con vào đây để sử dụng context */}
    </TestStateContext.Provider>
  );
};

// Tạo hook tùy chỉnh để sử dụng context
export function useTestState() {
  const context = useContext(TestStateContext); // Lấy giá trị context
  if (!context) {
    // Kiểm tra xem hook có được sử dụng trong TestStateProvider không
    throw new Error("useTestState must be used within a TestStateProvider");
  }
  return context; // Trả về giá trị context
};
