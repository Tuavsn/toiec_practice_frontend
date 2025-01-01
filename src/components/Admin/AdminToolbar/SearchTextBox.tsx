import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useRef } from 'react';

const SearchTextBox: React.FC<{ dispatchSearch: (value: { type: "SET_SEARCH", payload: string }) => void }> = React.memo(
    ({ dispatchSearch }) => {
        const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.trim() || '';

            // Clear the previous timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Set a new debounce timeout
            debounceTimeoutRef.current = setTimeout(() => {
                dispatchSearch({ type: "SET_SEARCH", payload: value });
            }, 500);
        };

        return (
            <header className="flex align-items-center justify-content-end m-2">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText
                        onChange={handleInputChange}
                        placeholder="Tìm theo từ khóa..."
                        className="p-mb-2"
                        data-testid="lecture-search-input"
                    />
                </IconField>
            </header>
        );
    }
);


export default SearchTextBox;