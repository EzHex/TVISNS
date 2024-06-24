import {useEffect, useState} from "react";
import ApartmentModel, {Types} from "../../models/apartmentModel.tsx";
import Apartment from "./Apartment.tsx";
import {Button, Form, InputGroup, Offcanvas} from "react-bootstrap";
import axiosInstance from "../../Axios.tsx";
import {ErrorMessage, Formik} from "formik";
import * as yup from 'yup';

const Apartments = () => {
    const apartment = yup.object().shape({
        title: yup.string().required("Title is required"),
        residence: yup.string().required("Residence is required"),
        microDistrict: yup.string().required("Micro District is required"),
        street: yup.string().required("Street is required"),
        houseNumber: yup.string().required("House number is required"),
        area: yup.number().min(0, "Area is non negative").required("Area is required"),
        roomNumber: yup.number().min(0, "Room count non negative").required("Room Number is required"),
        type: yup.string().required("Type is required"),
        floor: yup.number().required("Floor is required"),
        year: yup.string().required("Year is required"),
        heating: yup.string().required("Heating is required"),
    })

    const [apartments, setApartments] = useState<ApartmentModel[]>([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);

    const handleShow = () => setShowOffcanvas(true);

    const handleCreate = async (newApartment : yup.InferType<typeof apartment>) => {
        axiosInstance.post(`/apartments`, newApartment)
            .then(() => {
                handleClose();
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        axiosInstance
            .get(`/apartments`)
            .then((response) => {
                setApartments(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div className="h1 text-center">Apartments</div>
            <hr/>
            <div className="container pb-5">
                <div className="text-end">
                    <Button variant="btn btn-outline-dark" onClick={handleShow}>Create</Button>
                </div>
                <table className="table table-responsive">
                    <thead>
                    <tr>
                        <th className="col-4">Title</th>
                        <th className="col-5">Address</th>
                        <th className="col-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        apartments.map((apartment: ApartmentModel) => (
                            <Apartment key={apartment.id} {...apartment}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>

            <Offcanvas show={showOffcanvas} onHide={handleClose} backdrop={"static"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Create apartment</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={apartment}
                            initialValues={{
                                title: '',
                                residence: '',
                                microDistrict: '',
                                street: '',
                                houseNumber: '',
                                area: 0,
                                roomNumber: 0,
                                type: Types.Masonry,
                                floor: 0,
                                year: new Date().toISOString().split('T')[0],
                                heating: '',
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleCreate(values)
                                    .finally(() => {
                                    setSubmitting(false);
                                });
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
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            isInvalid={touched.title && !!errors.title}/>
                                        <Form.Label>Title</Form.Label>
                                        <ErrorMessage
                                            name={"title"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="residence"
                                            value={values.residence}
                                            onChange={handleChange}
                                            isInvalid={touched.residence && !!errors.residence}/>
                                        <Form.Label>Residence</Form.Label>
                                        <ErrorMessage
                                            name={"residence"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="microDistrict"
                                            value={values.microDistrict}
                                            onChange={handleChange}
                                            isInvalid={touched.microDistrict && !!errors.microDistrict}/>
                                        <Form.Label>Micro District</Form.Label>
                                        <ErrorMessage
                                            name={"microDistrict"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="street"
                                            value={values.street}
                                            onChange={handleChange}
                                            isInvalid={touched.street && !!errors.street}/>
                                        <Form.Label>Street</Form.Label>
                                        <ErrorMessage
                                            name={"street"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="houseNumber"
                                            value={values.houseNumber}
                                            onChange={handleChange}
                                            isInvalid={touched.houseNumber && !!errors.houseNumber}/>
                                        <Form.Label>House Number</Form.Label>
                                        <ErrorMessage
                                            name={"houseNumber"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <InputGroup className={"mb-3"}>
                                        <InputGroup.Text>Area</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="area"
                                            value={values.area}
                                            onChange={handleChange}
                                            isInvalid={touched.area && !!errors.area}
                                        />
                                        <InputGroup.Text>m²</InputGroup.Text>
                                    </InputGroup>
                                    <ErrorMessage
                                        name={"area"}
                                        component={"div"}
                                        className={"text-danger mb-3"}/>
                                    <InputGroup className={"mb-3"}>
                                        <InputGroup.Text>Room Number</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="roomNumber"
                                            value={values.roomNumber}
                                            onChange={handleChange}
                                            isInvalid={touched.roomNumber && !!errors.roomNumber}/>
                                    </InputGroup>
                                    <ErrorMessage
                                        name={"roomNumber"}
                                        component={"div"}
                                        className={"text-danger mb-3"} />
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            isInvalid={touched.type && !!errors.type}>
                                            {
                                                Object.keys(Types).map((type : string) => {
                                                    return <option key={type} value={type}>{type}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <Form.Label>Type</Form.Label>
                                        <ErrorMessage
                                            name={"type"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <InputGroup className={"mb-3"}>
                                        <InputGroup.Text>Floor</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="floor"
                                            value={values.floor}
                                            onChange={handleChange}
                                            isInvalid={touched.floor && !!errors.floor}/>
                                    </InputGroup>
                                    <ErrorMessage
                                        name={"floor"}
                                        component={"div"}
                                        className={"text-danger mb-3"} />
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="date"
                                            name="year"
                                            value={values.year}
                                            onChange={handleChange}
                                            isInvalid={touched.year && !!errors.year}/>
                                        <Form.Label>Year</Form.Label>
                                        <ErrorMessage
                                            name={"year"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="heating"
                                            value={values.heating}
                                            onChange={handleChange}
                                            isInvalid={touched.heating && !!errors.heating}/>
                                        <Form.Label>Heating</Form.Label>
                                        <ErrorMessage
                                            name={"heating"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>

                                    <Button
                                        variant={"dark"}
                                        type={"submit"}
                                        className={"w-100 mt-3"}
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

export default Apartments;