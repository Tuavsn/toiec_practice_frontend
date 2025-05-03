"use client"

import { useState } from "react"
import FilterSection from "../../components/User/TestListViewer/FilterSection"
import PageHeader from "../../components/User/TestListViewer/PageHeader"
import PaginationSection from "../../components/User/TestListViewer/PaginationSection"
import SkillTabs from "../../components/User/TestListViewer/SkillTabs"
import TestCardGrid from "../../components/User/TestListViewer/TestCardGrid"
import { useTestCard } from "../../hooks/TestCardHook"
import { TestCard } from "../../utils/types/type"

export default function TestPage() {
    const {
        currentFormatIndex,
        categoryLabels,
        setCurrentYear,
        totalItemsRef,
        setNewFormat,
        onPageChange,
        currentYear,
        testCards,
        pageIndex,
    } = useTestCard()

    const [searchTerm, setSearchTerm] = useState("")
    const [activeSkillTab, setActiveSkillTab] = useState(0)

    // Define skill types
    const skillTypes = [
        { name: "Tất cả", value: "all" },
        { name: "Listening", value: "listening" },
        { name: "Reading", value: "reading" },
        { name: "Speaking", value: "speaking" },
        { name: "Writing", value: "writing" },
    ]

    // Filter function for search
    const filterBySearch = (card: TestCard) => {
        if (!searchTerm) return true
        return card.name.toLowerCase().includes(searchTerm.toLowerCase())
    }

    return (
        <div className="surface-ground">
            <div className="p-4">
                <PageHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <SkillTabs skillTypes={skillTypes} activeSkillTab={activeSkillTab} setActiveSkillTab={setActiveSkillTab} />

                <FilterSection
                    categoryLabels={categoryLabels}
                    currentFormatIndex={currentFormatIndex}
                    currentYear={currentYear}
                    setNewFormat={setNewFormat}
                    setCurrentYear={setCurrentYear}
                />

                <div className="surface-card p-4 shadow-2 border-round">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h3 className="text-xl font-medium text-900 m-0">Danh sách đề thi</h3>
                        {testCards && (
                            <span className="text-500">
                                Hiển thị {testCards.length} / {totalItemsRef.current} đề thi
                            </span>
                        )}
                    </div>

                    <TestCardGrid testCards={testCards} filterFn={filterBySearch} />

                    <PaginationSection pageIndex={pageIndex} totalRecords={totalItemsRef.current} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    )
}
