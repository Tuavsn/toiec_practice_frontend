// Filename: src/features/comments/components/CommentContentRenderer.tsx
import React from 'react';

interface MentionUser {
  id: string; // userId
  name: string; // userDisplayName
}

interface CommentContentRendererProps {
  content: string;
  // A list of users (id and name) that could be mentioned in this comment.
  // This helps map the @[userId] in content to a displayable name.
  // This list would typically come from the 'mentionSuggestions' or a similar map
  // containing all users participating in the current comment thread.
  potentialMentionedUsers: MentionUser[];
}

const CommentContentRenderer: React.FC<CommentContentRendererProps> = ({
  content,
  potentialMentionedUsers,
}) => {
  // Create a map for quick lookup of userId to name
  const userIdToNameMap = new Map(
    potentialMentionedUsers.map(user => [user.id, user.name])
  );

  // Regex to find @[userId] patterns
  const mentionRegex = /@\[([^\]]+)\]/g;

  // Split the content by mentions and interleave with styled spans
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    const [_fullMatch, userId] = match;
    const mentionName = userIdToNameMap.get(userId) || userId; // Fallback to userId if name not found

    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add highlighted mention
    parts.push(
      <span key={`${userId}-${match.index}`} className="p-mention-item font-semibold text-primary">
        @{mentionName}
      </span>
    );
    lastIndex = mentionRegex.lastIndex;
  }

  // Add any remaining text after the last mention
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <>{parts.map((part, index) => (
    <React.Fragment key={index}>{part}</React.Fragment>
  ))}</>;
};

export default CommentContentRenderer;