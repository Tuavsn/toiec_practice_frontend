import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";
import { memo, useEffect, useState } from "react";
import { Comment_t } from "../../../utils/types/type";

interface UserAvatarProps {
    comment: Comment_t;
    // Allow passing standard Avatar props for flexibility
    size?: "normal" | "large" | "xlarge" | undefined;
    shape?: "circle" | undefined;
    className?: string;
    style?: React.CSSProperties;
    // Default icon if all image attempts fail and no label
    defaultFallbackIcon?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(({
    comment,
    size = "large", // Defaulting to "large" as used in CommentItem
    shape = "circle",
    className = "mr-3 flex-shrink-0", // Defaulting to classes used in CommentItem
    style,
    defaultFallbackIcon = "pi pi-user",
}) => {
    const [imageUrlToDisplay, setImageUrlToDisplay] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const originalUrl = comment.userAvatarUrl;
    const fallbackLabel = comment.userDisplayName ? comment.userDisplayName[0].toUpperCase() : 'U';
    const picsumUrl = `https://picsum.photos/seed/${comment.userId}/64/64`; // 64x64 avatar size

    useEffect(() => {
        setIsLoading(true); // Start loading when comment or originalUrl changes

        // Pre-emptive check for obviously invalid or placeholder URLs
        if (!originalUrl || originalUrl.trim() === "") {
            // If no valid original URL, or it's the known problematic placeholder, try Picsum directly
            setImageUrlToDisplay(picsumUrl);
            // We could still try to "load" picsum to be consistent, but for now, let's assume it works
            // or let Avatar handle its potential load failure by falling back to label/icon.
            // For simplicity here, if original is bad, we set picsum and consider loading done for picsum.
            // A more robust version would also "test load" picsum.
            setIsLoading(false); // Assuming Picsum URL construction is enough for this path
            return;
        }

        // Attempt to load the original URL
        const imageTester = new Image();
        imageTester.onload = () => {
            setImageUrlToDisplay(originalUrl);
            setIsLoading(false);
        };
        imageTester.onerror = () => {
            // Original URL failed to load (429, 404, CORS, etc.)
            // Fallback to Picsum URL
            setImageUrlToDisplay(picsumUrl);
            setIsLoading(false); // Consider loading done, Avatar will try to load picsumUrl
        };
        imageTester.src = originalUrl;

        // Cleanup: If the component unmounts while the image is still trying to load,
        // you might want to clear the onload/onerror handlers to prevent state updates
        // on an unmounted component, though React 18 handles this a bit better.
        return () => {
            imageTester.onload = null;
            imageTester.onerror = null;
            // You could also try imageTester.src = ""; to stop the browser from loading
        };
    }, [originalUrl, picsumUrl]); // Depend on originalUrl and picsumUrl (if comment.id changes)

    if (isLoading) {
        // Determine skeleton size based on Avatar size prop
        let skeletonSize = "3rem"; // default for "normal"
        if (size === "large") skeletonSize = "4rem";
        if (size === "xlarge") skeletonSize = "5rem";

        return (
            <Skeleton
                shape={shape}
                size={skeletonSize}
                className={className}
                style={style}
            />
        );
    }

    return (
        <Avatar
            image={imageUrlToDisplay || undefined}
            label={fallbackLabel}
            icon={(!imageUrlToDisplay && !fallbackLabel) ? defaultFallbackIcon : undefined}
            shape={shape}
            size={size}
            className={className}
            // Apply a default background style if no image is displayed (it's a label/icon)
            style={!imageUrlToDisplay ? { ...style, backgroundColor: '#607D8B', color: '#ffffff' } : style}
        />
    );
});

export default UserAvatar;