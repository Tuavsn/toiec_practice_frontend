import { Button } from "primereact/button";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React from "react";


export
    const SearchInput = ({ setGlobalFilter }: { setGlobalFilter: (value: string) => void }) => {
        const [searchValue, setSearchValue] = React.useState(""); // State for input

        try {
            return (
                <span>
                    
                    <InputText
                        type="search"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button onClick={() => setGlobalFilter(searchValue)}><InputIcon className="pi pi-search" /> Tìm</Button>
                </span>
            );
        } catch (error) {
            console.error("Error rendering SearchInput:", error);
            return <div>Error loading search input</div>; // Fallback UI
        }
    };