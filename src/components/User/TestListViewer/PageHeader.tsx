"use client"

import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"

interface PageHeaderProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export default function PageHeader({ searchTerm, setSearchTerm }: PageHeaderProps) {
    return (
        <main className="surface-card p-4 shadow-2 border-round mb-4">
            <header className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h1 className="text-3xl font-bold text-900 m-0">Thư viện đề thi</h1>
                <section className="mt-3 md:mt-0">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm đề thi..."
                            className="w-full"
                        />
                    </IconField>
                </section>
            </header>
        </main>
    )
}
