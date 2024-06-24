import {Link, useParams} from "react-router-dom";
import {Button, Col, Form, Offcanvas, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import IRoom, {Direction} from "../../models/roomModel.tsx";
import Room from "./Room.tsx";
import axiosInstance from "../../Axios.tsx";
import * as yup from "yup";
import {ErrorMessage, Formik} from "formik";


const Rooms = () => {
    const roomSchema = yup.object().shape({
        name: yup.string().required(),
        area: yup.number().min(0, "Area can not be negative").required(),
        windowDirection: yup.string().required(),
        roomType: yup.string().required(),
        grade: yup.number().min(0).max(10).required()
    });

    const [rooms, setRooms] = useState<IRoom[]>([]);

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);

    const handleShow = () => setShowOffcanvas(true);


    const apartmentId = useParams().apartmentId;

    const handleCreate = async (room: yup.InferType<typeof roomSchema>) => {
        axiosInstance
            .post(`/apartments/${apartmentId}/rooms`, room)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        axiosInstance
            .get(`/apartments/${apartmentId}/rooms`)
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div className={"h1 text-center"}>Rooms</div>
            <hr/>
            <div className="container pb-2">
                <Link to="/apartments" className="btn btn-dark">Apartments</Link>
            </div>
            <div className="container pb-5">
                <div className="text-end">
                    <Button variant="btn btn-outline-dark" onClick={handleShow}>Create</Button>
                </div>
                <table className="table table-responsive">
                    <thead>
                    <tr>
                        <th className="col-8">Name</th>
                        <th className="col-4">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        rooms.map((room: IRoom) => (
                            <Room key={room.id} {...room}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>

            <Offcanvas show={showOffcanvas} onHide={handleClose} backdrop={"static"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Create room</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={roomSchema}
                            initialValues={{
                                name: "",
                                area: 0,
                                windowDirection: Direction.None,
                                roomType: "Other",
                                grade: 0
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleCreate(values).then(() => setSubmitting(false));
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    className="mb-3"
                                >
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            isInvalid={touched.name && !!errors.name}
                                            />
                                        <Form.Label>Name</Form.Label>
                                        <ErrorMessage
                                            name={"name"}
                                            component="div"
                                            className="text-danger" />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="number"
                                            name="area"
                                            value={values.area}
                                            onChange={handleChange}
                                            isInvalid={touched.area && !!errors.area}
                                            />
                                        <Form.Label>Area</Form.Label>
                                        <ErrorMessage
                                            name={"area"}
                                            component="div"
                                            className="text-danger" />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Select
                                            name="windowDirection"
                                            value={values.windowDirection}
                                            onChange={handleChange}
                                            isInvalid={touched.windowDirection && !!errors.windowDirection}
                                            >
                                            {
                                                Object.values(Direction).map((direction: string) => (
                                                    <option key={direction}>{direction}</option>
                                                ))
                                            }
                                        </Form.Select>
                                        <Form.Label>Window direction</Form.Label>
                                        <ErrorMessage
                                            name={"windowDirection"}
                                            component="div"
                                            className="text-danger" />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"} as={Row}>
                                        <Col xs={"9"}>
                                            <Form.Range
                                                name="grade"
                                                value={values.grade}
                                                onChange={handleChange}
                                                min={0}
                                                max={10}
                                            />
                                        </Col>
                                        <Col xs={"3"}>
                                            <Form.Control
                                                value={values.grade}
                                                isInvalid={touched.grade && !!errors.grade}></Form.Control>
                                        </Col>
                                        <ErrorMessage
                                            name={"grade"}
                                            component="div"
                                            className="text-danger" />
                                    </Form.Floating>

                                    <Form.Floating
                                        className={"mb-3"}
                                    >
                                        <Form.Select
                                            name={"roomType"}
                                            value={values.roomType}
                                            onChange={handleChange}
                                            isInvalid={touched.roomType && !!errors.roomType}
                                        >
                                            {
                                                [   "Other",
                                                    "Kitchen",
                                                    "Living room",
                                                    "Bedroom",
                                                    "Bathroom",
                                                    "Toilet",
                                                    "Balcony",
                                                    "Terrace",
                                                    "Hallway",
                                                    "Kids room"]
                                                    .map((roomType: string) => (
                                                    <option key={roomType}>{roomType}</option>
                                                ))
                                            }
                                        </Form.Select>
                                        <Form.Label>Room type</Form.Label>
                                        <ErrorMessage
                                            name={"roomType"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>

                                    <Button
                                        variant="btn btn-dark"
                                        type="submit"
                                        className={"w-100"}
                                    >
                                        Create
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
export default Rooms;