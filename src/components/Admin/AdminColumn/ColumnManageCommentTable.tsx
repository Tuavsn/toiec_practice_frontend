// Filename: src/features/admin/components/comments/CommentToxicityCell.tsx
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import React from 'react';
import { TOXIC_THRESHOLD } from '../../../constant/Constant';
import { Comment_t, CommentReport } from '../../../utils/types/type';
interface CommentToxicityCellProps {
    rowData: Comment_t | CommentReport;
}

interface ToxicityInfo {
    key: "probInsult" | "probThreat" | "probHateSpeech" | "probSpam" | "probSevereToxicity" | "probObscene"; // Ensures keys are valid fields of Comment_t
    label: string;        // Vietnamese label
    shortLabel: string;   // Short label for progress bar display
}

const toxicityFields: ToxicityInfo[] = [
    { key: "probInsult", label: "Xúc phạm (Insult)", shortLabel: "Xúc phạm" },
    { key: "probThreat", label: "Đe dọa (Threat)", shortLabel: "Đe dọa" },
    { key: "probHateSpeech", label: "Thù ghét (Hate Speech)", shortLabel: "Thù ghét" },
    { key: "probSpam", label: "Spam", shortLabel: "Tin rác" },
    { key: "probSevereToxicity", label: "Độc hại nặng (Severe)", shortLabel: "Độc nặng" },
    { key: "probObscene", label: "Tục tĩu (Obscene)", shortLabel: "Tục tĩu" },
];

const CommentToxicityCell: React.FC<CommentToxicityCellProps> = ({ rowData }) => {
    return (
        <div className="flex flex-column gap-1" style={{ minWidth: '150px' }}>
            {toxicityFields.map((field) => {
                const value = rowData[field.key] as number | undefined;
                const percentage = typeof value === 'number' ? Math.round(value * 100) : 0;
                const isToxic = percentage > (TOXIC_THRESHOLD * 100); // Assuming TOXIC_THRESHOLD is 0 to 1

                let progressBarColor = '#4caf50'; // Green (Good)
                if (percentage > 75) progressBarColor = '#f44336'; // Red (High)
                else if (percentage > 50) progressBarColor = '#ff9800'; // Orange (Medium)
                else if (percentage > TOXIC_THRESHOLD * 100) progressBarColor = '#ffeb3b'; // Yellow (Slightly elevated, text might need to be dark)


                const tooltipId = `toxicity-tooltip-${rowData.id}-${field.key}`;

                return (
                    <React.Fragment key={field.key}>
                        <Tooltip target={`.${tooltipId}`} content={`${field.label}: ${percentage}%`} position="top" />
                        <div className={`flex align-items-center justify-content-between text-xs ${tooltipId}`}>
                            <span className={`mr-1 ${isToxic ? 'text-red-500 font-semibold' : 'text-color-secondary'}`}>
                                {field.shortLabel}:
                            </span>
                            <ProgressBar
                                color={progressBarColor}
                                value={percentage}
                                showValue={true} // Show percentage on the bar
                                style={{ height: '12px', width: '60px', flexShrink: 0 }}
                                className={isToxic ? 'p-progressbar-danger' : 'p-progressbar-success'} // Use PrimeReact severity classes
                                pt={{ // PassThrough to customize
                                    value: { style: { fontSize: '0.6rem', lineHeight: '12px', color: percentage > 50 ? 'white' : 'black' } }
                                }}
                            />
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

interface CommentActionsCellProps {
    rowData: Comment_t;
    onConfirmDelete: (comment: Comment_t) => void;
    onToggleActive: (comment: Comment_t) => void;
}

const CommentActionsCell: React.FC<CommentActionsCellProps> = ({
    rowData,
    onConfirmDelete,
    onToggleActive,
}) => {
    return (
        <div className="flex justify-content-end gap-2"> {/* Use gap for spacing */}
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-sm" // Make buttons small
                tooltip="Xóa bình luận"
                tooltipOptions={{ position: 'top' }}
                onClick={() => onConfirmDelete(rowData)}
            />
            <Button
                icon={rowData.active ? "pi pi-eye-slash" : "pi pi-eye"}
                className={`p-button-rounded ${rowData.active ? "p-button-warning" : "p-button-info"} p-button-sm`}
                tooltip={rowData.active ? "Ẩn bình luận" : "Hiện bình luận"}
                tooltipOptions={{ position: 'top' }}
                onClick={() => onToggleActive(rowData)}
            />
        </div>
    );
};

export default {
    CommentActionsCell,
    CommentToxicityCell
}