"use client"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Skeleton } from "primereact/skeleton"
import type React from "react"
import { useRef } from "react"
import { WordOfTheDay } from "../../../utils/types/type"

interface WordOfTheDayCardProps {
    wordData: WordOfTheDay
    loading: boolean
}

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({ wordData, loading }) => {
    const { play } = useAudio(wordData.audioUrl);
    const handlePlayAudio = () => {
        // Giả lập phát âm thanh
        if (!wordData.audioUrl ||loading) {
            return;
        }
        play()
    }

    if (loading) {
        return (
            <Card className="mb-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="text-center text-white p-3">
                    <Skeleton width="200px" height="2rem" className="mb-2" />
                    <Skeleton width="150px" height="1.5rem" className="mb-2" />
                    <Skeleton width="100%" height="1rem" className="mb-2" />
                    <Skeleton width="80%" height="1rem" />
                </div>
            </Card>
        )
    }

    if (!wordData) {
        return (
            <Card className="mb-4 text-center" style={{ background: "#f8f9fa", border: "2px dashed #dee2e6" }}>
                <p className="text-muted">Không thể tải từ vựng của ngày. Vui lòng thử lại sau.</p>
            </Card>
        )
    }

    return (
        <Card className="mb-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="text-center text-white p-3">
                <h3 className="text-2xl font-bold mb-1">Từ vựng của ngày</h3>
                <div className="flex align-items-center justify-content-center gap-2 mb-2">
                    <span className="text-3xl font-bold">{wordData.word}</span>
                    <Button
                        icon="pi pi-volume-up"
                        className="p-button-rounded p-button-text p-button-sm"
                        style={{ color: "white" }}
                        onClick={handlePlayAudio}
                        tooltip="Phát âm"
                    />
                </div>
                <p className="text-lg mb-2 opacity-90">{wordData.phonetic}</p>
                <p className="mb-2 font-medium">{wordData.definition}</p>
                <p className="text-sm opacity-80 italic">"{wordData.example}"</p>
            </div>
        </Card>
    )
}


interface UseAudio {
    play: () => void;
}

function useAudio(url: string): UseAudio {
    // Guard: đảm bảo có URL
    if (!url) {
   
        // Trả về stub để tránh undefined
        return { play: () => { } };
    }

    const audioRef = useRef<HTMLAudioElement>();

    // Khởi tạo Audio object một lần
    if (!audioRef.current) {
        audioRef.current = new Audio(url);
        // Optional: điều chỉnh volume, loop, etc.
        audioRef.current.volume = 0.8;
    }

    const play = () => {
        audioRef.current
            ?.play()
            .catch(err => console.error('Audio play error:', err));
    };

    return { play };
}