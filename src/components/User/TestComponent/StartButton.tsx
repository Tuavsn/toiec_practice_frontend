import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { RenderPressStartButtonProps } from "../../../utils/types/props";

const RenderPressStartButton: React.FC<RenderPressStartButtonProps> = (props) => {
    return (
        <section>
            {/* Nút bắt đầu bài thi */}
            <Link to={`/test/${props.id}`}>
                <Button className="fixed" label="Quay về" />
            </Link>
            <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                <div className="text-center">

                    <Button label="Bắt đầu" onClick={() => {
                        // mở giao diện làm bài
                        props.startTestFunc();
                    }} />
                </div>
            </div>
        </section>
    )
}

export default RenderPressStartButton;