import type { PaginatorPageChangeEvent } from "primereact/paginator"
import { Paginator } from "primereact/paginator"

interface PaginationSectionProps {
  pageIndex: number
  totalRecords: number
  onPageChange: (event: PaginatorPageChangeEvent) => void
}

export default function PaginationSection({ pageIndex, totalRecords, onPageChange }: PaginationSectionProps) {
  return (
    <div className="mt-4">
      <Paginator
        first={pageIndex * 6}
        rows={6}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        className="border-round"
      />
    </div>
  )
}
