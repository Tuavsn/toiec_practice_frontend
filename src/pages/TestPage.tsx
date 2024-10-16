
import { Button } from "primereact/button";
import { CategoryLabel, TestCard } from "../utils/types/type";
import { useState } from "react";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";

export default function TestPage() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [currentYear, setCurrentYear] = useState<number>(0);
    const allTestCards: TestCard[] = GetFakeData();
    const categoryLabel: CategoryLabel[] = GetLabel();
    const [first, setFirst] = useState(0);
    const [rows] = useState(4); // Number of courses per page
    const currentTestCards = allTestCards.slice(first, first + rows);
    return (
        <main className="pt-8">
            <h1>Thư viện đề thi</h1>
            <nav className="my-4">
                <Button className="m-1" key={"card all"} label="Tất cả"
                    severity={(currentIndex === -1 ? "info" : 'secondary')} rounded
                    onClick={
                        () => {
                            setCurrentIndex(-1);
                            alert("nhảy qua trang cate tổng")
                        }
                    } />

                {
                    categoryLabel.map((category, index) =>

                        <Button className="m-1" key={"card" + index} label={category.format}
                            severity={
                                currentIndex !== -1 && categoryLabel[currentIndex].format === category.format
                                    ? 'info'
                                    : 'secondary'
                            }

                            rounded
                            onClick={
                                () => {
                                    setCurrentIndex(index);
                                    alert("nhảy qua trang cate=" + category.format)
                                }
                            } />
                    )
                }
            </nav>
            {currentIndex !== -1 &&
                <nav>
                    <Button key={"year all"} className="m-1" label="Tất cả"
                        severity={(currentYear === 0 ? "info" : 'secondary')} text raised />
                    {
                        categoryLabel[currentIndex].year.map((year, index) =>

                            <Button className="m-1" key={"year" + index} label={year.toString()}
                                severity={(currentYear === year ? "info" : 'secondary')} text raised
                                onClick={
                                    () => {
                                        setCurrentYear(year);
                                        alert("nhảy qua trang cate=" + year)
                                    }
                                } />
                        )
                    }
                </nav>
            }

            <div className="flex flex-wrap row-gap-4 align-items-stretch mt-4" >
                {currentTestCards.map((testCard) => (

                    <Card style={{ flex: "1 1 0px" }} key={testCard.id} title={<p className="text-center">{testCard.name}</p>} className="flex align-items-left justify-content-center border-round m-2 shadow-2 min-h-full">
                        <div>
                            <p>
                                <strong>Format:</strong> {testCard.format}
                            </p>
                            <p>
                                <strong>Năm:</strong> {testCard.year}
                            </p>

                            <Button label="View Details" onClick={() => navigate(`/courses/${testCard.id}`)} />
                        </div>
                    </Card>

                ))}
            </div>
            <Paginator
                first={first}
                rows={rows}
                totalRecords={10}
                onPageChange={(e) => {
                    setFirst(e.first);
                }}
            />
        </main>
    );
}


function GetLabel(): CategoryLabel[] {
    return [
        {
            format: "Video",
            year: [2020, 2021, 2022, 2023],
        },
        {
            format: "Audio",
            year: [2018, 2019, 2021, 2023],
        },
        {
            format: "PDF",
            year: [2019, 2020, 2023],
        },
        {
            format: "E-book",
            year: [2021, 2022],
        },
        {
            format: "Webinar",
            year: [2020, 2023, 2024],
        },
        {
            format: "Interactive Course",
            year: [2021, 2022, 2023],
        },
        {
            format: "Article",
            year: [2018, 2019, 2020, 2021],
        },
        {
            format: "Tutorial",
            year: [2017, 2019, 2021, 2023],
        },
        {
            format: "Podcast",
            year: [2020, 2022, 2023],
        },
        {
            format: "Workshop",
            year: [2021, 2022, 2023, 2024],
        },
    ];

}

function GetFakeData(): TestCard[] {
    return [
        {
            id: "cat001",
            format: "Video",
            year: 2023,
            name: 'đề',
        },
        {
            id: "cat002",
            format: "Audio",
            year: 2022,
            name: 'đề',
        },
        {
            id: "cat003",
            format: "PDF",
            year: 2024,
            name: 'đề',
        },
        {
            id: "cat004",
            format: "E-book",
            year: 2021,
            name: 'đề',
        },
        {
            id: "cat005",
            format: "Webinar",
            year: 2023,
            name: 'đề',
        },
        {
            id: "cat006",
            format: "Interactive Course",
            year: 2024,
            name: 'đề',
        },
        {
            id: "cat007",
            format: "Article",
            year: 2020,
            name: 'đề',
        },
        {
            id: "cat008",
            format: "Tutorial",
            year: 2023,
            name: 'đề',
        },
        {
            id: "cat009",
            format: "Podcast",
            year: 2022,
            name: 'đề',
        },
        {
            id: "cat010",
            format: "Workshop",
            year: 2024,
            name: 'đề',
        },
    ];
}