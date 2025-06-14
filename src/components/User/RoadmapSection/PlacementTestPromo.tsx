"use client"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import React from "react"
import { useNavigate } from "react-router-dom"

export const PlacementTestPromo: React.FC = React.memo(
    () => {
        const navigate = useNavigate()

        const handleTestClick = () => {
            navigate("/test/684d4c4ad92602485312745d")
        }

        return (
            <Card
                className="text-center p-4 mb-5"
                style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                }}
            >
                <div className="text-white">
                    <h2 className="text-3xl font-bold mb-3">🎯 Kiểm tra trình độ miễn phí!</h2>
                    <p className="text-lg mb-4 line-height-3">
                        Bạn không chắc nên bắt đầu từ đâu? Làm bài kiểm tra đầu vào nhanh của chúng tôi để xác định trình độ và nhận
                        lộ trình học tập được cá nhân hóa cho riêng bạn.
                    </p>
                    <Button
                        label="Làm bài ngay"
                        icon="pi pi-arrow-right"
                        className="p-button-lg p-button-warning font-bold"
                        style={{
                            background: "#f59e0b",
                            border: "none",
                            padding: "12px 24px",
                            fontSize: "1.1rem",
                        }}
                        onClick={handleTestClick}
                    />
                </div>
            </Card>
        )
    }
)