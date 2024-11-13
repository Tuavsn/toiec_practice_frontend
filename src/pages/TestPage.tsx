
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { useTestCard } from "../hooks/TestCardHook";

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
            <h1>Thư viện đề thi</h1>
            <nav className="my-4">
                {
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
                }
            </nav>
            {
                <nav>
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
                </nav>
            }

            <div className="flex flex-wrap row-gap-4 justify-content-center align-items-stretch mt-4" >
                {testCards.map((testCard, index) => (

                    <Card style={{ flex: '1 1 20%', minWidth: "300px", maxWidth: "20%", height: "100%" }} key={testCard.id + index} title={<p className="text-center">{testCard.name}</p>} className="flex align-items-left justify-content-center border-round m-2 shadow-2 min-h-full">
                        <div>
                            <p>
                                <strong>Format:</strong> {testCard.format}
                            </p>
                            <p>
                                <strong>Năm:</strong> {testCard.year}
                            </p>

                            <Button label="View Details" onClick={() => navigate(`/test/${testCard.id}`)} />
                        </div>
                    </Card>

                ))}
            </div>
            <Paginator
                first={pageIndex * 4}
                rows={4}
                totalRecords={totalItemsRef.current}
                onPageChange={onPageChange}
            />
        </main>
    );
}

