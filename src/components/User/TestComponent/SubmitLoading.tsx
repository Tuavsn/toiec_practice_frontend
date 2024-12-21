import LoadingSpinner from "../../Common/Loading/LoadingSpinner";



function SubmitLoading() {
    return (
        <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
            <LoadingSpinner text="Xin vui lòng chờ...." />
        </div>

    )
}

export default SubmitLoading;
