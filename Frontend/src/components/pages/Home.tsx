import {Carousel} from "react-bootstrap";

import home1 from "../../assets/home1.svg";
import home2 from "../../assets/home2.svg";
import home3 from "../../assets/home3.svg";

export const Home = () => {
    return <div>
        <div className="h1 text-center">Home</div>
        <hr />
        <div className="container">
            <div className={"d-flex"}>
                <p className={"text-center align-content-center"}>
                    Welcome to Property Management Information System for Rental Entities!
                </p>
                <Carousel
                    variant={"dark"}
                    className={"w-50"}
                    controls={false}
                    indicators={false}
                >
                    <Carousel.Item interval={10000}>
                        <img
                            src={home1}
                            alt="First slide"
                            className="d-block w-100" // Add this class to make the image responsive
                            style={{ height: "300px" }} // Set fixed height
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={10000}>
                        <img
                            src={home2}
                            alt="Second slide"
                            className="d-block w-100" // Add this class to make the image responsive
                            style={{ height: "300px" }} // Set fixed height
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={10000}>
                        <img
                            src={home3}
                            alt="Third slide"
                            className="d-block w-100" // Add this class to make the image responsive
                            style={{ height: "300px" }} // Set fixed height
                        />
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    </div>;
};