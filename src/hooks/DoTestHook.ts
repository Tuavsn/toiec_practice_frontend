import { useCallback, useEffect, useState } from 'react';
import ConvertCheatSheetToHTML from '../utils/convertCheatSheetToHTML';
import { CheatEntry } from '../utils/types/type';

export function useDoTest() {
    const [isUserAnswerSheetVisible, setIsUserAnswerSheetVisible] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [resourcesElement, setResourcesElement] = useState<JSX.Element[]>([]);
    const [questionsElement, setQuestionsElement] = useState<JSX.Element[]>([]);
    const [mappingQuestionsWithPage, setMappingQuestionsWithPage] = useState<number[]>([]);
    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cheatSheet: CheatEntry[] = await fetchQuestionsData();
                const [resources, questions, mappingQuestionsPage] = ConvertCheatSheetToHTML(cheatSheet);
                setResourcesElement(resources);
                setQuestionsElement(questions);
                setMappingQuestionsWithPage(mappingQuestionsPage);
                console.log(mappingQuestionsPage);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
        mappingQuestionsWithPage
    };
}

async function fetchQuestionsData(): Promise<CheatEntry[]> {
    try {
        const response = await fetch("https://dummyjson.com/c/916c-e7ad-4651-b5d5");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parsing the response to JSON

        return data.cheatsheet;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return []; // Return empty arrays in case of an error
    }
}
