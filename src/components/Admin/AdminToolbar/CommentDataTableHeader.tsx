// Filename: src/features/admin/components/comments/CommentDataTableHeader.tsx
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';
import React from 'react';

interface CommentDataTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFilterValue: "all" | "true" | "false";
  onActiveFilterChange: (value: "all" | "true" | "false") => void;
  totalRecords: number;
}

const CommentDataTableHeader: React.FC<CommentDataTableHeaderProps> = ({
  globalFilterValue,
  onGlobalFilterChange,
  activeFilterValue,
  onActiveFilterChange,
  totalRecords
}) => {
  const activeOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Chỉ hiện", value: "true" },
    { label: "Chỉ ẩn", value: "false" },
  ];

  return (
    <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-3 py-3">
      <h3 className="m-0 text-xl font-semibold">
        Quản lý Bình luận ({totalRecords})
      </h3>
      <div className="flex flex-column sm:flex-row align-items-center gap-2 w-full sm:w-auto">
        <Dropdown
          value={activeFilterValue}
          options={activeOptions}
          onChange={(e: DropdownChangeEvent) => onActiveFilterChange(e.value)}
          placeholder="Lọc theo trạng thái hiển thị"
          className="w-full sm:w-15rem text-sm" // Responsive width
        />
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Tìm kiếm bình luận..."
            className="w-full text-sm" // Full width on small, auto on larger
          />
        </IconField>
      </div>
    </div>
  );
};

export default CommentDataTableHeader;