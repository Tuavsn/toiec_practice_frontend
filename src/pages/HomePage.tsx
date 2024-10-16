import { Card } from "primereact/card";
import {
    Banner
} from "../components/User/index";
import website from "../assets/website_flatform.jpg"
import android from "../assets/android_flatform.jpg"
import ios from "../assets/ios_flatform.jpg"
import roadmap from "../assets/roadmap-ico.png"
import slideico from "../assets/slide_ico.svg"
import testico from "../assets/test_ico.svg"
import sheetico from "../assets/sheet_ico.svg"
import logo from "../assets/Header-Logo.png"
import roadmappic from "../assets/roadmap.png"
import { Steps } from "primereact/steps";

export default function HomePage() {

    return (
        <>
            <Banner />
            <HomeContent />
        </>
    )
}

function HomeContent() {
    return (
        <>
            <Info />
            <News />
        </>
    )
}

function Info() {
    return (
        <>
            <div className="py-6">
                <h2 className="text-center">Chỉ có tại <a href="/home"><span style={{color: "#004B8D"}}>UTE TOEIC</span> <span style={{color: "#FF5757"}}>Practice</span></a></h2>
                <div className="grid">
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src={slideico} className="max-w-4rem mr-4"/>
                                <h3>Bài giảng chất lượng cao, phù hợp với mọi đối tượng</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài giảng phù hợp với mọi đối tượng, giúp người học dễ dàng tiếp cận và nhanh chóng làm quen với đề thi TOEIC.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src={testico} className="max-w-4rem mr-4"/>
                                <h3>Đầy đủ bài mẫu, bài tập, progress test như thi thật</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài tập phong phú, từ dễ đến khó giúp cho người học nhanh chóng đạt được mục tiêu mong muốn.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src={sheetico} className="max-w-4rem mr-4"/>
                                <h3>Có hệ thống chấm điểm và phân tích</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            TOEIC Practice cung cấp hệ thống chấm điểm bài thi chính xác kết hợp với hệ thống phân tích mạnh mẽ.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
            
            <div className="py-6 px-4 bg-gray-50">
                <div className="grid nested-grid">
                    <div className="col-4">
                        <div className="flex justify-content-center align-content-center p-3 h-full">
                            <img className="max-w-20rem border-round-lg" style={{objectFit: "contain"}} src={logo} />
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="grid">
                            <div className="col-12">
                                <h2><a href="/home"><span style={{color: "#004B8D"}}>UTE TOEIC</span> <span style={{color: "#FF5757"}}>Practice</span></a> đã có mặt trên nhiều nền tảng</h2>
                            </div>
                            <div className="col-12">
                                <div className="grid">
                                    <div className="col text-center">
                                        <Card className="h-full">
                                            <img className="max-w-14rem border-round-lg" src={website} />
                                        </Card>
                                    </div>
                                    <div className="col text-center">
                                        <Card className="h-full">
                                            <img className="max-w-15rem border-round-lg" src={android} />
                                        </Card>
                                    </div>
                                    <div className="col text-center">
                                        <Card className="h-full">
                                            <img className="max-w-15rem border-round-lg" src={ios} />
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6">
                <Card className="py-4 px-4">
                    <div className="flex gap-4 justify-content-center mb-4">
                        <img className="max-w-4rem" src={roadmap}/>
                        <h2>Lộ trình học tập tại <a href="/home"><span style={{color: "#004B8D"}}>UTE TOEIC</span> <span style={{color: "#FF5757"}}>Practice</span></a></h2>
                    </div>
                    <Steps className="mb-4" model={[
                        {
                            label: 'Làm bài test năng lực'
                        },
                        {
                            label: 'Tham gia khóa học miễn phí'
                        },
                        {
                            label: 'Ôn luyện đề thi'
                        }
                    ]}/>
                    <img src={roadmappic} className="w-full"/>
                </Card>
            </div>
        </>
    )
}

function News() {
    return (
        <>
            <div className="py-6">
                <h2 className="text-center"><a href="/course" style={{color: "#004B8D"}}>Bài giảng mới</a></h2>
                <div className="grid">
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/slide.svg" className="max-w-4rem mr-4"/>
                                <h3>Bài giảng chất lượng cao, phù hợp với mọi đối tượng</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài giảng phù hợp với mọi đối tượng, giúp người học dễ dàng tiếp cận và nhanh chóng làm quen với đề thi TOEIC.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/check_note.svg" className="max-w-4rem mr-4"/>
                                <h3>Đầy đủ bài mẫu, bài tập, progress test như thi thật</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài tập phong phú, từ dễ đến khó giúp cho người học nhanh chóng đạt được mục tiêu mong muốn.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/copy.svg" className="max-w-4rem mr-4"/>
                                <h3>Có hệ thống chấm điểm và phân tích</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            TOEIC Practice cung cấp hệ thống chấm điểm bài thi chính xác kết hợp với hệ thống phân tích mạnh mẽ.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="py-6">
                <h2 className="text-center"><a href="/test" style={{color: "#004B8D"}}>Đề thi mới</a></h2>
                <div className="grid">
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/slide.svg" className="max-w-4rem mr-4"/>
                                <h3>Bài giảng chất lượng cao, phù hợp với mọi đối tượng</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài giảng phù hợp với mọi đối tượng, giúp người học dễ dàng tiếp cận và nhanh chóng làm quen với đề thi TOEIC.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/check_note.svg" className="max-w-4rem mr-4"/>
                                <h3>Đầy đủ bài mẫu, bài tập, progress test như thi thật</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            Hệ thống bài tập phong phú, từ dễ đến khó giúp cho người học nhanh chóng đạt được mục tiêu mong muốn.
                            </p>
                        </Card>
                    </div>
                    <div className="col">
                        <Card className="p-4 h-full" header={(
                            <div className="flex align-items-center">
                                <img src="https://prepedu.com/_ipx/_/imgs/home/copy.svg" className="max-w-4rem mr-4"/>
                                <h3>Có hệ thống chấm điểm và phân tích</h3>
                            </div>
                        )}>
                            <p className="m-0">
                            TOEIC Practice cung cấp hệ thống chấm điểm bài thi chính xác kết hợp với hệ thống phân tích mạnh mẽ.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}