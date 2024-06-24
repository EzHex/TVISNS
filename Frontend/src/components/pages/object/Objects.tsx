import IObject from "../../models/objectModel.tsx";
import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Button, Form, Offcanvas} from "react-bootstrap";
import Object from "./Object.tsx";
import axiosInstance from "../../Axios.tsx";
import * as yup from "yup";
import {ErrorMessage, Formik} from "formik";

const Objects = () => {
    const objectSchema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        image: yup.mixed(),
        grade: yup.number().min(0).max(10).required(),
        roomId: yup.number(),
    });
    const imageInput = useRef<HTMLInputElement>(null);

    const [objects, setObjects] = useState<IObject[]>([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    const apartmentId = useParams().apartmentId;
    const roomId = useParams().roomId;

    const handleCreate = async (object: FormData) => {
        console.log(object);
        axiosInstance
            .post(`/apartments/${apartmentId}/rooms/${roomId}/objects`, object, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        axiosInstance
            .get(`/apartments/${apartmentId}/rooms/${roomId}/objects`)
            .then((response) => {
                setObjects(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



    return (
        <div>
            <div className={"h1 text-center"}>Objects</div>
            <hr/>
            <div className="container pb-2">
            <Link to={`/apartments/${apartmentId}/rooms`} className="btn btn-dark">Rooms</Link>
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
                        objects.map((obj : IObject) => (
                            <Object key={obj.id} {...obj}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>

            <Offcanvas show={showOffcanvas} onHide={handleClose} backdrop={"static"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Object</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={objectSchema}
                            initialValues={{
                                title: '',
                                description: '',
                                image: null,
                                grade: 0,
                                roomId: roomId ? parseInt(roomId) : undefined,
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                if (imageInput.current === null) {
                                    console.log("No image selected");
                                    return;
                                }
                                // @ts-expect-error file exists
                                const file = imageInput.current.files[0];
                                const formData = new FormData();
                                formData.append('image', file);
                                formData.append('title', values.title);
                                formData.append('description', values.description);
                                formData.append('grade', values.grade.toString());
                                formData.append('roomId', values.roomId?.toString() ?? "");

                                handleCreate(formData).then(() => {
                                    setSubmitting(false);
                                })
                                setSubmitting(false);
                            }}
                        >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                                className={"mb-3"}
                            >
                                <Form.Floating className={"m-3"}>
                                    <Form.Control
                                        type={"text"}
                                        name={"title"}
                                        value={values.title}
                                        onChange={handleChange}
                                        isInvalid={touched.title && !!errors.title}
                                    />
                                    <Form.Label>Title</Form.Label>
                                    <ErrorMessage
                                        name={"title"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"m-3"}>
                                    <Form.Control
                                        type={"textarea"}
                                        name={"description"}
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={touched.description && !!errors.description}
                                    />
                                    <Form.Label>Description</Form.Label>
                                    <ErrorMessage
                                        name={"description"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Group className={"m-3"}>
                                    <input
                                        type={"file"}
                                        name={"image"}
                                        id={"image"}
                                        className={"form-control"}
                                        ref={imageInput}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name={"image"} component={"div"} className={"text-danger"} />
                                </Form.Group>
                                <Form.Floating className={"m-3"}>
                                    <Form.Control
                                        type={"number"}
                                        name={"grade"}
                                        value={values.grade}
                                        onChange={handleChange}
                                        isInvalid={touched.grade && !!errors.grade}
                                    />
                                    <Form.Label>Grade</Form.Label>
                                    <ErrorMessage
                                        name={"grade"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Button
                                    variant="btn btn-dark"
                                    type={"submit"}
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
    )
}

export default Objects;