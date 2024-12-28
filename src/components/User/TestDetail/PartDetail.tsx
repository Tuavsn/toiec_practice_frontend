import { Chip } from "primereact/chip";
import React from "react";
import { PartDetailSectionProps } from "../../../utils/types/props";



const PartDetailSection: React.FC<PartDetailSectionProps> = React.memo(
    (props) => {
        return (
            <section>
                {
                    props.topicsOverview.map(topicsForCurrentPart => {
                        return (
                            <div key={"part detail " + topicsForCurrentPart.partNum}>
                                <h3>Phần {topicsForCurrentPart.partNum}</h3>
                                <span className="card flex flex-wrap gap-2">
                                    {
                                        topicsForCurrentPart.topicNames.map((topic, index2) => {
                                            return (
                                                <Chip key={"topic_" + index2} label={topic} />
                                            )
                                        })
                                    }
                                </span>
                            </div>
                        )
                    })
                }
            </section>
        )
    }
)

export default PartDetailSection;