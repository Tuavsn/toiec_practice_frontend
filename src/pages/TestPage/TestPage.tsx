
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTestCard } from "../../hooks/TestCardHook";
import { CategoryLabel, TestCard } from "../../utils/types/type";

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
                        {Array.from({ length: 6 }, (_, index) => <Skeleton width="8rem" height="3rem" borderRadius="35px" key={index} />)}

                    </div>
                }
            </nav>
            {
                <nav>
                    {RenderCategoryLabels(categoryLabels, currentFormatIndex, currentYear, setCurrentYear)}

                </nav>
            }

            <div className="flex flex-wrap row-gap-4 justify-content-center align-items-stretch mt-4" >
                {RenderTestCards(testCards)}

            </div>
            <Paginator
                first={pageIndex * 6}
                rows={6}
                totalRecords={totalItemsRef.current}
                onPageChange={onPageChange}
            />
        </main>
    );
}

function RenderTestCards(testCards: TestCard[] | null): ReactNode {
    if (testCards === null) {
        return (
            <div className="flex flex-row justify-content-center flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, index) => <Skeleton width="25vw" height="360px" key={index} />)}
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
        <div className="grid grid-nogutter">
            {testCards.map((testCard, index) => (
                <TestCardGridItem key={index} testCard={testCard} />
            ))}
        </div>
    );
}
const TestCardGridItem: React.FC<{ testCard: TestCard }> = ({ testCard: { id, name, completed, format, totalUser, year } }) => {

    return (
        <div className="col-12 sm:col-12 md:col-9 lg:col-6 xl:col-4 p-2">
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <h3 className="text-2xl font-bold white-space-nowrap text-overflow-ellipsis">{name}</h3>
                    <h5 className="font-semibold">{format}</h5>
                    <h4><b className="pr-3 inline">{totalUser}</b><i className="inline pi pi-user" style={{ color: 'var(--primary-color)' }}></i></h4>
                    
                    <Tag value={completed ? 'Hoàn thành' : 'Chưa thử'} severity={completed ? 'success' : 'warning'}></Tag>
                </div>
                <div className="flex align-items-center justify-content-between">
                    <h5 className="text-2xl font-semibold">{year}</h5>
                    <Link to={`/test/${id}`}>
                        <Button
                            label="Xem chi tiết"
                            className="p-button-rounded"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};
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
                severity={(currentYear === 0 ? "info" : 'secondary')} text raised
                onClick={() => { setCurrentYear(0); }} />
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