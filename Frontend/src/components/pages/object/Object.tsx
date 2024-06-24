import IObject from "../../models/objectModel.tsx";
import {Button, FigureImage, Form, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {useRef, useState} from "react";
import {useParams} from "react-router-dom";
import axiosInstance from "../../Axios.tsx";
import {ErrorMessage, Formik} from "formik";
import * as yup from "yup";

const Object = (object : IObject) => {
    const objectSchema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        image: yup.mixed(),
        grade: yup.number().min(0).max(10).required(),
        roomId: yup.number(),
    });

    const imageInput = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const apartmentId = useParams().apartmentId;
    const roomId = useParams().roomId;

    const handleEdit = async (editObject: FormData) => {
        axiosInstance
            .put(`/apartments/${apartmentId}/rooms/${roomId}/objects/${object.id}`, editObject,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDelete = async () => {
        axiosInstance
            .delete(`/apartments/${apartmentId}/rooms/${roomId}/objects/${object.id}`)
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
                <td>{object.title}</td>
                <td>
                    <Button variant={"btn btn-outline-dark"} onClick={handleShow}>View</Button>
                </td>
            </tr>

            <Offcanvas show={show} onHide={handleClose} backdrop={"static"}>
                <OffcanvasHeader closeButton>
                    <Offcanvas.Title>Object</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className={"container pb-5"}>
                        <Formik
                            validationSchema={objectSchema}
                            initialValues={object}
                            onSubmit={(values, {setSubmitting}) => {
                                const formData = new FormData();
                                if (imageInput.current !== null) {
                                    // @ts-expect-error file exists
                                    const file = imageInput.current.files[0];
                                    formData.append('image', file);
                                }
                                formData.append('title', values.title);
                                formData.append('description', values.description);
                                formData.append('grade', values.grade.toString());
                                formData.append('roomId', values.roomId?.toString() ?? "");

                                handleEdit(formData).then(() => {
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
                                            as={"textarea"}
                                            type={"text"}
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
                                        {
                                            image && <FigureImage
                                                src={image}
                                                alt={"Object image"}
                                                className={"mb-3"}
                                            />
                                        }
                                        <Button
                                            variant={"btn btn-outline-dark"}
                                            className={"w-100"}
                                            onClick={() => {
                                                axiosInstance
                                                    .get(`/apartments/${apartmentId}/rooms/${roomId}/objects/${object.id}`, {
                                                        responseType: 'arraybuffer'
                                                    })
                                                    .then((response) => {
                                                        const arrayBufferView = new Uint8Array(response.data);
                                                        const blob = new Blob([arrayBufferView], { type: 'image/png' });
                                                        const imageUrl = URL.createObjectURL(blob);
                                                        setImage(imageUrl);
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });
                                            }}
                                        >
                                            Get image
                                        </Button>
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
                                        variant="btn btn-outline-dark"
                                        type={"submit"}
                                        className={"w-100 mb-3"}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant={"btn btn-dark"}
                                        className={"w-100 mb-3"}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </>
    )
}

export default Object;