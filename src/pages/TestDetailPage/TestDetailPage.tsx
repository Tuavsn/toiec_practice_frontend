import { Card } from "primereact/card";
import { memo } from "react";
import CommentSection from "../../components/User/Comment/CommentSection";
import PartChooser from "../../components/User/TestDetail/PartChooser";
import PartDetailSection from "../../components/User/TestDetail/PartDetail";
import ResultTable from "../../components/User/TestDetail/ResultTable";
import TestInfoBox from "../../components/User/TestDetail/TestInfoBox";
import { useTestDetail } from "../../hooks/TestDetailPaperHook";
import { TargetType } from "../../utils/types/type";



function TestDetailPage() {

    const { testInfo, id } = useTestDetail();



    return (
        <main className="pt-5">
            <Card title={`Thông tin đề ${testInfo.name}`}>

                <TestInfoBox limitTime={testInfo.limitTime} totalUserAttempt={testInfo.totalUserAttempt} />
                <ResultTable id={testInfo.id} resultsOverview={testInfo.resultsOverview} />
                <PartChooser limitTime={testInfo.limitTime} testId={id} />
                <PartDetailSection topicsOverview={testInfo.topicsOverview} />
            </Card>
            <CommentSection targetId={testInfo.id} targetType={TargetType.TEST} />

        </main >
    )
}

export default memo(TestDetailPage);










