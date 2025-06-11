import React from "react";

interface TestInfoBoxProps {
    limitTime: number,
    totalUserAttempt: number
}
const TestInfoBox: React.FC<TestInfoBoxProps> = React.memo((props) => {
    return (
        <section className="bg-gray-300 shadow-5 p-4" data-testid="test-info-box">
            <table>
                <tbody>
                    <tr className="mb-3" data-testid="time-limit-row">
                        <td>
                            <h3 className="inline">Thời gian làm bài:</h3>
                        </td>
                        <td>
                            <h4 className="inline pl-4" data-testid="time-limit">
                                {props.limitTime} phút ⏰
                            </h4>
                        </td>
                    </tr>
                    <tr className="mb-3" data-testid="user-attempt-row">
                        <td>
                            <h3 className="inline">Số người đã luyện tập:</h3>
                        </td>
                        <td>
                            <h4 className="inline pl-4" data-testid="user-attempt">
                                {props.totalUserAttempt} người 👤
                            </h4>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
});


export default TestInfoBox;