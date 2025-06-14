"use client"

import { Card } from "primereact/card"
import type React from "react"
import { useNavigate } from "react-router-dom"
import { MilestoneItem } from "../../../utils/types/type"

interface MilestoneItemCardProps {
    item: MilestoneItem
}

export const MilestoneItemCard: React.FC<MilestoneItemCardProps> = ({ item }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (item.type === "lecture") {
            navigate(`/lecture/${item.name}___${item.id}`)
        } else {
            navigate(`/test/${item.id}`)
        }
    }

    const getCardStyle = () => {
        if (item.type === "test") {
            return {
                borderLeft: "4px solid #3b82f6",
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            }
        }

        if (item.type === "lecture" && "mustTake" in item && item.mustTake) {
            return {
                borderLeft: "4px solid #f59e0b",
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            }
        }

        return {
            borderLeft: "4px solid #6b7280",
            background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        }
    }

    const getIcon = () => {
        if (item.type === "test") {
            return "pi pi-file-edit"
        }
        return "mustTake" in item && item.mustTake ? "pi pi-star-fill" : "pi pi-book"
    }

    const getTypeLabel = () => {
        if (item.type === "test") {
            return "Bài kiểm tra"
        }
        return "mustTake" in item && item.mustTake ? "Bài giảng bắt buộc" : "Bài giảng gợi ý"
    }

    return (
        <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-6 h-full"
            style={{ ...getCardStyle(), minHeight: "160px" }}
            onClick={handleClick}
        >
            <div className="p-4 h-full flex flex-column justify-content-between">
                <div>
                    <div className="flex align-items-center gap-2 mb-3">
                        <i className={`${getIcon()} text-xl`} />
                        <span className="text-sm font-medium text-600">{getTypeLabel()}</span>
                    </div>
                    <h4 className="font-bold text-900 mb-2 line-height-3">{item.name}</h4>
                </div>
                <div className="flex align-items-center justify-content-end mt-2">
                    <i className="pi pi-arrow-right text-primary" />
                </div>
            </div>
        </Card>
    )
}
