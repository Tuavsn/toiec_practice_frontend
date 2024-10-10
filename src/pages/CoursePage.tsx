import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../utils/types/type";
export default function CoursePage() {
    const courses: CourseCard[] = [
        {
            id: '1',
            name: 'Course Name 1',
            topic: ['Topic1', 'Topic2'],
            format: 'Online',
            difficulty: 4,

        },
        {
            id: '2',
            name: 'Course Name 2',
            topic: ['Topic1', 'Topic3'],
            format: 'Offline',
            difficulty: 3,

        },
        {
            id: '3',
            name: 'Course Name 3',
            topic: ['Topic2'],
            format: 'Hybrid',
            difficulty: 3,

        },
        {
            id: '4',
            name: 'Course Name 4',
            topic: ['Topic4', 'Topic5'],
            format: 'Online',
            difficulty: 5,

        },
    ];

    const formatOptions = [
        { label: 'All', value: 'all' },
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
        { label: 'Hybrid', value: 'hybrid' },
    ];

    const difficultyOptions = [
        { label: 'All', value: 'all' },
        { label: '1 Star', value: 1 },
        { label: '2 Stars', value: 2 },
        { label: '3 Stars', value: 3 },
        { label: '4 Stars', value: 4 },
        { label: '5 Stars', value: 5 },
    ];

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedFormat, setSelectedFormat] = React.useState<any>(null);
    const [selectedDifficulty, setSelectedDifficulty] = React.useState<any>(null);
    const [first, setFirst] = React.useState(0);
    const [rows] = React.useState(4); // Number of courses per page

    const filteredCourses = courses.filter((course) => {
        const matchesFormat =
            !selectedFormat || selectedFormat === 'all' || course.format.toLowerCase() === selectedFormat;
        const matchesDifficulty =
            !selectedDifficulty || selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
        const matchesSearchTerm =
            course.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFormat && matchesDifficulty && matchesSearchTerm;
    });

    const totalRecords = filteredCourses.length;
    const currentCourses = filteredCourses.slice(first, first + rows);

    return (
        <div className="p-p-4">
            <h2 className="text-center text-4xl mt-4 pt-5">CÁC KHÓA HỌC NÊN THỬ</h2>
            <div className="flex justify-content-end flex-wrap ">
                <div className="flex align-items-center justify-content-center m-2">
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search courses..."
                        className="p-mb-2"
                    />
                </div>
                <div className="flex align-items-center justify-content-center m-2">
                    <Dropdown
                        value={selectedFormat}
                        options={formatOptions}
                        onChange={(e) => setSelectedFormat(e.value)}
                        placeholder="Select Format"
                        className="p-mb-2"
                    />
                </div>
                <div className="flex align-items-center justify-content-center m-2">
                    <Dropdown
                        value={selectedDifficulty}
                        options={difficultyOptions}
                        onChange={(e) => setSelectedDifficulty(e.value)}
                        placeholder="Select Difficulty"
                        className="p-mb-2"
                    />
                </div>
            </div>
            <div className="flex align-items-center justify-content-between row-gap-4 align-items-stretch mt-4">
                {currentCourses.map((course) => (

                    <Card key={course.id} title={course.name} className="scalein animation-duration-1000 flex align-items-center justify-content-center border-round m-2 shadow-2 min-h-full">
                        <div>
                            <p>
                                <strong>Topics:</strong> {course.topic.join(', ')}
                            </p>
                            <p>
                                <strong>Format:</strong> {course.format}
                            </p>
                            <p>
                                <strong>Difficulty:</strong> {'★'.repeat(course.difficulty)}
                                {'☆'.repeat(5 - course.difficulty)}
                            </p>
                            <Button label="View Details" onClick={() => navigate(`/courses/${course.id}`)} />
                        </div>
                    </Card>

                ))}
            </div>
            <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPageChange={(e) => {
                    setFirst(e.first);
                }}
            />
        </div>
    );
};
