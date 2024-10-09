import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Access course ID from URL params

    return (
        <div>
            <h2>Course Details for ID: {id}</h2>
            {/* You can fetch and display the course details based on the ID here */}
        </div>
    );
};

export default CourseDetailsPage;
