"use client"

import { Button } from "primereact/button"
import { Skeleton } from "primereact/skeleton"
import { CategoryLabel } from "../../../utils/types/type"

interface FilterSectionProps {
    categoryLabels: CategoryLabel[]
    currentFormatIndex: number
    currentYear: number
    setNewFormat: (index: number) => void
    setCurrentYear: (year: number) => void
}

export default function FilterSection({
    categoryLabels,
    currentFormatIndex,
    currentYear,
    setNewFormat,
    setCurrentYear,
}: FilterSectionProps) {
    return (
        <div className="surface-card p-4 shadow-2 border-round mb-4">
            <h3 className="text-xl font-medium text-900 mb-3">Bộ lọc</h3>

            {/* Format Selection */}
            <div className="mb-3">
                <h4 className="text-lg font-medium text-700 mb-2">Định dạng</h4>
                <div className="flex flex-wrap gap-2">
                    {categoryLabels.length !== 0 ? (
                        <FormatButtons
                            categoryLabels={categoryLabels}
                            currentFormatIndex={currentFormatIndex}
                            setNewFormat={setNewFormat}
                        />
                    ) : (
                        <FormatSkeletons />
                    )}
                </div>
            </div>

            {/* Year Selection */}
            <div>
                <h4 className="text-lg font-medium text-700 mb-2">Năm</h4>
                <div className="flex flex-wrap gap-2">
                    <Button
                        key="year-all"
                        className="p-button-outlined"
                        label="Tất cả"
                        severity={currentYear === 0 ? "info" : "secondary"}
                        size="small"
                        onClick={() => setCurrentYear(0)}
                    />
                    {categoryLabels.length !== 0 ? (
                        <YearButtons
                            categoryLabels={categoryLabels}
                            currentFormatIndex={currentFormatIndex}
                            currentYear={currentYear}
                            setCurrentYear={setCurrentYear}
                        />
                    ) : (
                        <YearSkeletons />
                    )}
                </div>
            </div>
        </div>
    )
}
interface FormatButtonsProps {
    categoryLabels: CategoryLabel[]
    currentFormatIndex: number
    setNewFormat: (index: number) => void
}
// Sub-components for FilterSection
function FormatButtons({ categoryLabels, currentFormatIndex, setNewFormat }: FormatButtonsProps): JSX.Element[] {
    return categoryLabels.map((category: CategoryLabel, index: number) => (
        <Button
            key={`format-${index}`}
            label={category.format}
            severity={categoryLabels[currentFormatIndex].format === category.format ? "info" : "secondary"}
            size="small"
            rounded
            onClick={() => setNewFormat(index)}
        />
    ))
}

function FormatSkeletons() {
    return (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }, (_, index) => (
                <Skeleton width="8rem" height="2.5rem" borderRadius="35px" key={`format-skeleton-${index}`} />
            ))}
        </div>
    )
}

interface YearButtonsProps {
    categoryLabels: CategoryLabel[]
    currentFormatIndex: number
    currentYear: number
    setCurrentYear: (year: number) => void
}

function YearButtons({ categoryLabels, currentFormatIndex, currentYear, setCurrentYear }: YearButtonsProps): JSX.Element[] {
    return categoryLabels[currentFormatIndex].year.map((year, index) => (
        <Button
            key={`year-${index}`}
            className="p-button-outlined"
            label={year.toString()}
            severity={currentYear === year ? "info" : "secondary"}
            size="small"
            onClick={() => setCurrentYear(year)}
        />
    ))
}

function YearSkeletons() {
    return (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, index) => (
                <Skeleton width="5rem" height="2.5rem" borderRadius="6px" key={`year-skeleton-${index}`} />
            ))}
        </div>
    )
}
