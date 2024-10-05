import { Carousel } from "primereact/carousel";
import banner01 from "../../../assets/banner_01.jpg"
import banner02 from "../../../assets/banner_02.jpg"
import banner03 from "../../../assets/banner_03.png"


const banners = [
    { title: 'Banner 1', image: banner01, description: 'This is the first banner' },
    { title: 'Banner 2', image: banner02, description: 'This is the second banner' },
    { title: 'Banner 3', image: banner03, description: 'This is the third banner' },
]

const bannerTemplate = (banner: any) => {
    return (
        <div className="banner-item">
            <img src={banner.image} alt={banner.title} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} />
        </div>
    );
};


export default function Banner() {
    return (
        <div className="card">
            <Carousel value={banners} numVisible={1} numScroll={1} itemTemplate={bannerTemplate} circular autoplayInterval={3000} />
        </div>
    )
}
