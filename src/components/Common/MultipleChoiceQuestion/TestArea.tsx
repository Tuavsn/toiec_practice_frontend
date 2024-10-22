import { Button } from "primereact/button"
import { ScrollPanel } from "primereact/scrollpanel"
import React from "react"
import { TestAreaProps } from "../../../utils/types/type"

export const TestArea: React.FC<TestAreaProps> = React.memo(
    ({ changePage, currentPageIndex, questionsElement, resourcesElement, parts }) => {
        return (
            <React.Fragment>
                <ScrollPanel
                    className="flex-1 custombar1  border-round m-2 shadow-2"
                    style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px' }}
                >
                    {resourcesElement[currentPageIndex]}
                </ScrollPanel>

                <div className="flex-1 ">
                    {
                        parts != "0" &&
                        <div className="flex justify-content-end gap-3 pr-3">
                            <Button icon="pi pi-angle-double-left" onClick={() => changePage(-1)}></Button>
                            <Button icon="pi pi-angle-double-right" onClick={() => changePage(1)}></Button>
                        </div>
                    }
                    <ScrollPanel
                        className="custombar1  border-round m-2 shadow-2"
                        style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px' }}
                    >
                        {questionsElement[currentPageIndex]}


                    </ScrollPanel>
                </div>
            </React.Fragment>
        )
    }
)