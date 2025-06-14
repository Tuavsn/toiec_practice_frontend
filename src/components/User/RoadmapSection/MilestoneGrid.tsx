import { Skeleton } from "primereact/skeleton"
import type React from "react"
import { MilestoneItem } from "../../../utils/types/type"
import { MilestoneItemCard } from "./MilestoneItemCard"

interface MilestoneGridProps {
    milestoneItems: MilestoneItem[]
    loading: boolean
}

export const MilestoneGrid: React.FC<MilestoneGridProps> = ({ milestoneItems, loading }) => {
    if (loading) {
        return (
            <div className="mt-7">
                <section className="bg-gray-300 mb-5 shadow-5 glassmorphism">
                    <h2 className='text-2xl font-bold mb-3 text-center'>Lộ trình học tập của bạn</h2>
                </section>

                <div className="grid">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="col-12 md:col-6 lg:col-4 xl:col-3">
                            <Skeleton height="120px" className="mb-2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (milestoneItems.length === 0) {
        return (
            <div className="mt-7 text-center p-4">
                <section className="bg-gray-300 mb-5 shadow-5 glassmorphism">
                    <h2 className='text-2xl font-bold mb-3 text-center'>Lộ trình học tập của bạn</h2>
                </section>
                <p className="text-muted">Không có dữ liệu lộ trình. Vui lòng thử lại sau.</p>
            </div>
        )
    }

    return (
        <div className="mt-7">
            <section className="bg-gray-300 mb-5 shadow-5 glassmorphism">
                <h2 className='text-2xl font-bold mb-3 text-center'>Lộ trình học tập của bạn</h2>
            </section>
            <div className="grid">
                {milestoneItems.map((item, index) => (
                    <div key={`${item.type}-${item.id}-${index}`} className="col-12 md:col-6 lg:col-4 xl:col-3">
                        <MilestoneItemCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    )
}