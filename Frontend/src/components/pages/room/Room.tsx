import IRoom, {Direction} from "../../models/roomModel.tsx";
import {Button, Col, Form, Offcanvas, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState} from "react";
import axiosInstance from "../../Axios.tsx";
import {ErrorMessage, Formik} from "formik";
import * as yup from "yup";

const Room = (room : IRoom) => {
    const roomSchema = yup.object().shape({
        name: yup.string().required(),
        area: yup.number().min(0, "Area can not be negative").required(),
        windowDirection: yup.string().required(),
        grade: yup.number().min(0).max(10).required()
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEdit = async (editRoom: yup.InferType<typeof roomSchema>) => {
        axiosInstance
            .put(`/apartments/${room.apartmentId}/rooms/${room.id}`, editRoom)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDelete = async () => {
        axiosInstance
            .delete(`/apartments/${room.apartmentId}/rooms/${room.id}`)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <tr>
                <td className="col-8">{room.name}</td>
                <td className="col-4">
                    <Button className={"m-1"} variant="btn btn-outline-dark" onClick={handleShow}>View</Button>
                    <Link className="btn btn-dark m-1" to={`/apartments/${room.apartmentId}/rooms/${room.id}/objects`}>Objects</Link>
                </td>
            </tr>

            <Offcanvas show={show} onHide={handleClose} backdrop={"static"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Room</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={roomSchema}
                            initialValues={room}
                            onSubmit={(values, { setSubmitting }) => {
                                handleEdit(values)
                                    .then(() => {
                                        setSubmitting(false);
                                    })
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors}) => (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    className={"mb-3"}
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
                                                onChange={handleChange}
                                                readOnly
                                                isInvalid={touched.grade && !!errors.grade}></Form.Control>
                                        </Col>
                                        <ErrorMessage
                                            name={"grade"}
                                            component="div"
                                            className="text-danger"/>
                                    </Form.Floating>
                                    <Button
                                        className="w-100 m-1"
                                        variant="btn btn-outline-dark"
                                        type={"submit"}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="w-100 m-1"
                                        variant="btn btn-dark"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Room;