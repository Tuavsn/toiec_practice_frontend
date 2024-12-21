import React from 'react';

// Function to find non-unique keys in nested JSX elements
export function findNonUniqueKeys(elements: React.ReactNode): string[] {
    const keys = new Set<string>();
    const nonUniqueKeys = new Set<string>();

    function traverse(element: React.ReactNode) {
        if (!element || typeof element !== 'object') return;

        // Check if it's a valid JSX.Element
        if (React.isValidElement(element)) {
            const key = element.key;

            // If the element has a key
            if (key !== null && key !== undefined) {
                const keyString = String(key); // Convert to string for consistency
                // Check for uniqueness
                if (keys.has(keyString)) {
                    nonUniqueKeys.add(keyString); // Add to non-unique set
                } else {
                    keys.add(keyString); // Add to unique set
                }
            }

            // Recursively traverse children
            React.Children.forEach(element.props.children, traverse);
        }
    }

    // Start traversal
    React.Children.forEach(elements, traverse);

    // Log message for no non-unique keys
    if (nonUniqueKeys.size === 0) {
        console.log('All keys are unique.');
    } else {
        console.log('Non-unique keys found:', Array.from(nonUniqueKeys));
    }

    return Array.from(nonUniqueKeys);
}