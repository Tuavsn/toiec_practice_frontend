import { useEffect, useState } from "react";
import { UserDetailResultRow } from "../utils/types/type";
import { callGetUserDetailResultList } from "../api/api";

export const useProfilePage = () => {
    const averageListeningScore = 280;
    const averageReadingScore = 430;
    const toeicPartsInsightView = [75, 77, 61, 54, 60, 67, 89];
    return {
        averageListeningScore,
        averageReadingScore,
        toeicPartsInsightView
    }
}

export const useActiveLog = () => {
    const [dataForTable, setDataForTable] = useState<UserDetailResultRow[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResultData = await callGetUserDetailResultList();
                setDataForTable(userResultData.data.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [])
    return { dataForTable };
}