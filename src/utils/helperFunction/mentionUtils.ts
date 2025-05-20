// Helper functions for handling mentions

/**
 * Extracts user IDs from a comment text with @mentions
 * @param text The comment text
 * @param userIdMap A mapping of email addresses to user IDs
 * @returns An array of user IDs that were mentioned
 */
export const extractMentionedUserIds = (text: string, userIdMap: Record<string, string>): string[] => {
    // Match email mentions in the format @username or @email.address@domain.com
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._-]+)/g
    const matches = text.match(mentionRegex) || []

    // Extract emails without the @ symbol and look up their user IDs
    const mentionedEmails = matches.map((match) => match.substring(1))
    const mentionedUserIds = mentionedEmails.map((email) => userIdMap[email]).filter((userId) => userId) // Filter out undefined values

    return mentionedUserIds
}

/**
 * Formats a comment for submission to the backend
 * @param text The comment text
 * @param userIdMap A mapping of email addresses to user IDs
 * @returns An object with the original text and metadata about mentions
 */
export const formatCommentForSubmission = (
    text: string,
    userIdMap: Record<string, string>,
): {
    text: string
    mentions: Array<{ userId: string; email: string }>
} => {
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._-]+)/g
    const matches = text.match(mentionRegex) || []
    const mentionedEmails = matches.map((match) => match.substring(1))

    const mentions = mentionedEmails
        .map((email) => ({
            email,
            userId: userIdMap[email] || "unknown",
        }))
        .filter((mention) => mention.userId !== "unknown")

    return {
        text,
        mentions,
    }
}
