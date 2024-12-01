import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import React, { useRef } from "react";
import { ResourceIndex, ResourceSectionProps, ResourceType } from "../../utils/types/type";


const types = [
    { label: "Image", value: "image" },
    { label: "Audio", value: "audio" },
    { label: "Paragraph", value: "paragraph" },
];
const ResourceSection: React.FC<ResourceSectionProps> = ({ resourseIndexes, setResourseIndexes }) => {
    const emptyRow: ResourceIndex = { index: resourseIndexes.length, type: "paragraph", content: "", file: null };
    console.log("res len=", resourseIndexes.length);

    const addNewRow = () => {
        const newRes = [...resourseIndexes];
        newRes.push(emptyRow);
        setResourseIndexes(newRes);
    };
    const deleteRow = (index: number) => {

        const newRes = [...resourseIndexes.filter((_, resIndex) => resIndex !== index)]
        setResourseIndexes(newRes);
    };
    const handleTypeChange = (e: { value: ResourceType }, idx: number) => {
        const updateRes = resourseIndexes.map((res) =>
            res.index === idx ? { ...res, type: e.value } : res
        )
        setResourseIndexes(updateRes);;
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, idx: number) => {
        const updateRes = resourseIndexes.map((res) =>
            res.index === idx ? { ...res, content: e.target.value } : res
        )
        setResourseIndexes(updateRes);;
    };

    const handleFileChange = (event: FileUploadSelectEvent, idx: number) => {
        const updateRes = resourseIndexes.map((res) =>
            res.index === idx ? { ...res, file: event.files[0] } : res
        )
        setResourseIndexes(updateRes);;
    }

    const handleFileCancel = (idx: number) => {
        const updateRes = resourseIndexes.map((res) =>
            res.index === idx ? { ...res, file: null } : res
        )
        setResourseIndexes(updateRes);;
    }

    return (
        <section id="table-resources" className="pt-5">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="w-2">Type</th>
                        <th>Data</th>
                        <th className="w-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {resourseIndexes.map((_, rowIndex) => (
                        <ResourceRow
                            key={`row_${rowIndex}`}
                            rowIndex={rowIndex}
                            rows={resourseIndexes}
                            deleteRow={deleteRow}
                            handleContentChange={handleContentChange}
                            handleTypeChange={handleTypeChange}
                            handleFileChange={handleFileChange}
                            handleFileCancel={handleFileCancel}
                        />
                    ))}
                    <tr><td colSpan={3}> <Button
                        className="w-full"
                        severity="success"
                        label="Add row"
                        onClick={addNewRow}
                    /></td></tr>
                </tbody>
            </table>
        </section>
    );
}

interface ResourceRowProps {
    rowIndex: number;
    rows: ResourceIndex[];
    handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>, idx: number) => void
    handleTypeChange: (e: { value: ResourceType; }, idx: number) => void
    deleteRow: (index: number) => void;
    handleFileChange: (event: FileUploadSelectEvent, idx: number) => void;
    handleFileCancel: (idx: number) => void;
}

const ResourceRow: React.FC<ResourceRowProps> = ({ rowIndex, rows, handleContentChange, handleTypeChange, deleteRow, handleFileCancel, handleFileChange }) => {
    const fileUpload = useRef<FileUpload | null>(null);
    return (
        <tr>
            <td>
                <Dropdown
                    value={rows[rowIndex].type}
                    options={types}
                    onChange={(e) => handleTypeChange(e, rowIndex)}
                    optionLabel="label"
                    optionValue="value"
                />
            </td >
            {
                rows[rowIndex].type === "paragraph" ? (
                    <td>{
                        <textarea
                            className="w-full h-4rem"
                            placeholder="Input here..."
                            value={rows[rowIndex].content}
                            onChange={(e) => handleContentChange(e, rowIndex)}
                        />
                    }
                    </td>
                ) : (
                    <td className="bg-gray-200">{rows[rowIndex].content}</td>
                )
            }
            < td className="text-center" >
                {
                    rows[rowIndex].type !== "paragraph" && (
                        <span>
                            <FileUpload
                                ref={fileUpload}
                                className="w-full"
                                mode="basic"
                                chooseLabel={`Choose ${rows[rowIndex].type} file`}
                                accept={`${rows[rowIndex].type}/*`}
                                onSelect={(e) => handleFileChange(e, rowIndex)}
                            />
                            <Button
                                className="w-full my-2"
                                severity="warning"
                                label="Cancel"
                                onClick={() => { fileUpload.current?.clear(); handleFileCancel(rowIndex) }}
                            />
                        </span>
                    )
                }
                < Button
                    className="w-full"
                    severity="danger"
                    label="Delete row"
                    onClick={() => { deleteRow(rowIndex) }}
                />
            </td >
        </tr >
    );
};

export default ResourceSection;