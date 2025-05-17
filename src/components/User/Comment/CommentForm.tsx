// Filename: src/features/comments/components/CommentForm.tsx
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Mention, MentionSearchEvent } from "primereact/mention";
import React, { FormEvent, useEffect, useRef, useState } from "react";

//------------------------------------------------------
// Định nghĩa Types cho Props và Suggestion Items
//------------------------------------------------------
interface MentionSuggestion {
    id: string; // userId
    name: string; // userDisplayName. This will be shown in suggestions.
    avatar?: string;
    // PrimeReact's `field` prop will use one of these keys for the actual value inserted.
    // We'll use 'id' for the value, so text becomes "... @[userId] ..."
    // The `onSearch` will filter based on 'name'.
    // `itemTemplate` will display 'name' and 'avatar'.
}

export interface CommentFormProps {
    onSubmit: (text: string, mentionedUserIds: string[]) => Promise<void | unknown> | void | unknown;
    initialText?: string;
    placeholder: string;
    isLoading: boolean;
    mentionSuggestions: MentionSuggestion[];
    onCancel?: () => void;
    autoFocus?: boolean;
}

//------------------------------------------------------
// Component Form để viết bình luận/trả lời
//------------------------------------------------------
const CommentForm: React.FC<CommentFormProps> = ({
    onSubmit,
    initialText = "",
    placeholder,
    isLoading,
    mentionSuggestions: initialMentionSuggestions,
    onCancel,
    autoFocus = false,
}) => {
    const [text, setText] = useState<string>(initialText);
    const [filteredSuggestions, setFilteredSuggestions] = useState<MentionSuggestion[]>([]);
    // const { toast } = useToast(); // Using the hook as defined in project.txt
    // If useToast() returns { toast: useRef<Toast>(null) }, you need a ToastProvider or to pass the ref.
    // For now, let's assume toast.current.show will be available if Toast is set up globally.
    // Example: if appToastRef is exported: const toast = appToastRef;

    const mentionInputRef = useRef<HTMLTextAreaElement>(null); // Ref for the underlying textarea

    useEffect(() => {
        // Initialize/update suggestions based on the prop
        setFilteredSuggestions(initialMentionSuggestions.filter(s => s.name));
    }, [initialMentionSuggestions]);

    useEffect(() => {
        if (autoFocus && mentionInputRef.current) {
            mentionInputRef.current.focus();
        }
    }, [autoFocus]);

    //------------------------------------------------------
    // Xử lý tìm kiếm trong Mention
    //------------------------------------------------------
    const handleMentionSearch = (event: MentionSearchEvent) => {
        setTimeout(() => {
            const query = event.query.toLowerCase();
            if (!query.trim().length && event.trigger === '@') { // Show all if query is empty after '@'
                setFilteredSuggestions(initialMentionSuggestions.filter(s => s.name));
            } else {
                const suggestions = initialMentionSuggestions.filter(
                    (item) => item.name && item.name.toLowerCase().includes(query) // Using 'includes' for broader search
                );
                setFilteredSuggestions(suggestions);
            }
        }, 250);
    };

    //------------------------------------------------------
    // Template cho mỗi item trong danh sách gợi ý Mention
    //------------------------------------------------------
    const mentionItemTemplate = (suggestion: MentionSuggestion): React.ReactNode => {
        return (
            <div className="flex align-items-center p-2 surface-border hover:surface-hover"> {/* Added PrimeFlex hover effect */}
                <Avatar image={suggestion.avatar} shape="circle" className="mr-2" icon="pi pi-user" size="normal" />
                <span className="font-medium text-sm">{suggestion.name}</span>
            </div>
        );
    };

    //------------------------------------------------------
    // Trích xuất ID người dùng được mention từ text
    // Pattern mặc định của Mention là @[value] nếu field là 'id'
    //------------------------------------------------------
    const extractMentionedUserIds = (currentText: string): string[] => {
        const regex = /@\[([^\]]+)\]/g; // Pattern @[userId]
        const matches = currentText.matchAll(regex);
        const userIds = new Set<string>();
        for (const match of matches) {
            userIds.add(match[1]);
        }
        return Array.from(userIds);
    };

    //------------------------------------------------------
    // Xử lý khi gửi form
    //------------------------------------------------------
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!text.trim() || isLoading) {
            return;
        }

        const mentionedUserIds = extractMentionedUserIds(text);
        try {
            await onSubmit(text, mentionedUserIds);
            setText("");
            // toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Đã gửi bình luận!', life: 3000 });
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            // toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể gửi bình luận. Vui lòng thử lại.', life: 3000 });
        }
    };

    // This is how PrimeReact Mention handles its underlying input component (e.g. InputTextarea)
    // The `inputRef` prop of Mention can be used to get a ref to the InputTextarea component instance,
    // not directly the HTMLTextAreaElement unless InputTextarea forwards it.
    // However, InputTextarea itself is a wrapper.
    // For focusing, we can use the `autoFocus` prop of InputTextarea, passed via `inputProps`.




    return (
        <form onSubmit={handleSubmit} className="comment-form mt-2 mb-3">
            <Mention
                value={text}
                // The type for `e` here is `React.ChangeEvent<HTMLTextAreaElement>` if inputComponent is InputTextarea
                onChange={(e: FormEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
                suggestions={filteredSuggestions}
                onSearch={handleMentionSearch}
                field="id" // This means the value inserted will be from suggestion.id, like @[the_user_id]
                placeholder={placeholder}
                itemTemplate={mentionItemTemplate}
                className="w-full"
                panelClassName="text-sm" // Apply text-sm to suggestion panel
                scrollHeight="150px"
            />
            <div className="flex justify-content-end mt-2">
                {onCancel && (
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        className="p-button-text p-button-sm text-sm mr-2"
                        onClick={onCancel}
                        disabled={isLoading}
                    />
                )}
                <Button
                    type="submit"
                    label="Gửi"
                    icon="pi pi-send"
                    className="p-button-sm text-sm"
                    loading={isLoading}
                    disabled={!text.trim() || isLoading}
                />
            </div>
        </form>
    );
};

export default CommentForm;