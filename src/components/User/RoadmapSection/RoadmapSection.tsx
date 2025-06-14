import React from "react"
import { useRoadmap } from "../../../hooks/RoadmapHook"
import { MilestoneGrid } from "./MilestoneGrid"
import { PlacementTestPromo } from "./PlacementTestPromo"
import { WordOfTheDayCard } from "./WordOfTheDayCard"
export const RoadmapSection: React.FC = React.memo(

    () => {
        const { wordOfTheDay, milestoneItems, loading, error } = useRoadmap()

        if (error) {
            return (
                <div className="container mx-auto p-4">
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                        <i className="pi pi-exclamation-triangle text-red-500 text-2xl mb-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="container mx-auto p-4">
                <div className="col-12">
                    <PlacementTestPromo />
                    <WordOfTheDayCard wordData={wordOfTheDay} loading={loading} />
                    <MilestoneGrid milestoneItems={milestoneItems} loading={loading} />
                </div>
            </div>
        )
    }
)
export default RoadmapSection
