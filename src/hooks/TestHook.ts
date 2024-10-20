import { useCallback, useState } from 'react';

export function useTest() {
    const [isUserAnswerSheetVisible, setIsUserAnswerSheetVisible] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [resourcesElement, setResourcesElement] = useState<JSX.Element[]>([]);
    const [questionsElement, setQuestionsElement] = useState<JSX.Element[]>([]);
    const [mappingQuestionsWithPage, setMappingQuestionsWithPage] = useState<number[]>([]);


    // Change the current page index
    const changePage = useCallback((offset: number) => {
        const newPageIndex = currentPageIndex + offset;
        if (newPageIndex >= 0 && newPageIndex < questionsElement.length) {
            setCurrentPageIndex(newPageIndex);
        }
    }, [currentPageIndex, questionsElement.length]);

    return {
        resourcesElement,
        questionsElement,
        isUserAnswerSheetVisible,
        setIsUserAnswerSheetVisible,
        currentPageIndex,
        setCurrentPageIndex,
        changePage,
        mappingQuestionsWithPage,
        setResourcesElement,
        setQuestionsElement,
        setMappingQuestionsWithPage
    };
}


