"use client"

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
                    <span className="p-input-icon-left w-full md:w-auto">
                        <i className="pi pi-search" />
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm đề thi..."
                            className="w-full"
                        />
                    </span>
                </section>
            </header>
        </main>
    )
}
