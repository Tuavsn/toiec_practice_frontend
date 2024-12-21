import { Button } from "primereact/button"
import { Link } from "react-router-dom"
import { TestID } from "../../../utils/types/type"
import { LoadingSpinner } from "../../Common/Index"

function LoadingGetQuestionFromServer(id: TestID) {
    return (
        <section>
            <Link to={`/test/${id}`}>
                <Button className="fixed" label="Quay về" />
            </Link>
            <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                <LoadingSpinner text="Xin vui lòng chờ...." />
            </div>
        </section>

    )
}
export default {
    LoadingGetQuestionFromServer,
}