
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { useTestCard } from "../hooks/TestCardHook";
import { Skeleton } from "primereact/skeleton";
import { CategoryLabel, TestCard } from "../utils/types/type";
import { NavigateFunction } from "react-router-dom";
import React from "react";

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
        navigate,
    } = useTestCard();


    return (
        <main className="pt-8">
            <section className="mt-5 bg-gray-300 shadow-5 p-3 glassmorphism">
                <h1 className="pl-4">Thư viện đề thi</h1>
            </section>
            <nav className="my-4">
                {categoryLabels.length !== 0 ?
                    categoryLabels.map((category, index) =>

                        <Button className="m-1" key={"card" + index} label={category.format}
                            severity={
                                categoryLabels[currentFormatIndex].format === category.format
                                    ? 'info'
                                    : 'secondary'
                            }
                            rounded
                            onClick={() => setNewFormat(index)
                            } />
                    )
                    :
                    <div className="flex flex-wrap flex-row gap-2">
                        {Array.from({ length: 8 }, (_, index) => <Skeleton width="8rem" height="3rem" borderRadius="35px" key={index} />)}

                    </div>
                }
            </nav>
            {
                <nav>
                    {RenderCategoryLabels(categoryLabels, currentFormatIndex, currentYear, setCurrentYear)}

                </nav>
            }

            <div className="flex flex-wrap row-gap-4 justify-content-center align-items-stretch mt-4" >
                {RenderTestCards(testCards, navigate)}

            </div>
            <Paginator
                first={pageIndex * 8}
                rows={8}
                totalRecords={totalItemsRef.current}
                onPageChange={onPageChange}
            />
        </main>
    );
}

function RenderTestCards(testCards: TestCard[] | null, navigate: NavigateFunction): import("react").ReactNode {
    if (testCards === null) {
        return (
            <div className="flex flex-row justify-content-center flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, index) => <Skeleton width="328px" height="360px" key={index} />)}
            </div>
        )
    }
    if (testCards.length === 0) {
        return (
            <div className="flex justify-content-center">
                <h5>Trang không có đề thi nào</h5>
            </div>
        )
    }
    return (
        testCards.map((testCard, index) => (

            <Card style={{ flex: '1 1 20%', minWidth: "300px", maxWidth: "20%", height: "100%" }} key={testCard.id + index} title={<p className="text-center">{testCard.name}</p>} className="flex align-items-left justify-content-center border-round m-2 shadow-2 min-h-full">
                <div>
                    <p>
                        <strong>Chuyên mục:</strong> {testCard.format}
                    </p>
                    <p>
                        <strong>Năm:</strong> {testCard.year}
                    </p>
                    <div className="flex justify-content-center">

                        <Button label="Xem chi tiết" onClick={() => navigate(`/test/${testCard.id}`)} />
                    </div>
                </div>
            </Card>

        )
        )
    )
}

function RenderCategoryLabels(categoryLabels: CategoryLabel[], currentFormatIndex: number, currentYear: number, setCurrentYear: (index: number) => void) {
    if (categoryLabels.length === 0) {
        return (
            <div className="inline-flex flex-wrap flex-row">
                {Array.from({ length: 3 }, (_, index) => <Skeleton className="m-1" width="98px" height="56px" key={index} />)}
            </div>
        )
    }
    return (
        <React.Fragment>

            <Button key={"year all"} className="m-1" label="Tất cả"
                severity={(currentYear === 0 ? "info" : 'secondary')} text raised />
            {
                categoryLabels[currentFormatIndex].year.map((year, index) =>

                    <Button className="m-1" key={"year" + index} label={year.toString()}
                        severity={(currentYear === year ? "info" : 'secondary')} text raised
                        onClick={
                            () => {
                                setCurrentYear(year);
                            }
                        } />
                )
            }
        </React.Fragment>
    )

}