import { useEffect, useState} from "react";
import axiosInstance from "../../Axios.tsx";
import {Link, useParams} from "react-router-dom";
import {
    Button,
    Form, FormControl,
    FormFloating,
    FormLabel, InputGroup,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader, OffcanvasTitle
} from "react-bootstrap";
import {ErrorMessage, Formik} from "formik";
import * as yup from "yup";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

export interface ICounter {
    id?: number;
    title: string;
    counterType: string;
    apartmentId?: number;
}

export interface IReading {
    id?: number;
    createDate: string;
    value: number;
    counterId: number;
}

const UtilityReadings = () => {
    const apartmentId = useParams().apartmentId;
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showReadingsOffcanvas, setShowReadingsOffcanvas] = useState(false);
    const [counters, setCounters] = useState<ICounter[]>([]);
    const [readings, setReadings] = useState<IReading[]>([]);
    const [currentCounter, setCurrentCounter] = useState<number>();

    const readingSchema = yup.object().shape({
        id: yup.number(),
        createDate: yup.string().required("Reading date is required"),
        value: yup.number().required("Value is required"),
        counterId: yup.number()
    })

    const counterSchema = yup.object().shape({
        id: yup.number(),
        title: yup.string().required("Title is required"),
        price: yup.number().min(0).required("Price is required"),
        counterType: yup.string().required("Counter type is required"),
        apartmentId: yup.number()
    })

    const counterTypes = {
        electricity: "Electricity",
        electricityNight: "Electricity (Night)",
        gas: "Gas",
        coldWater: "Water (Cold)",
        hotWater: "Water (Hot)"
    };

    const handleClose = () => setShowOffcanvas(false);

    const handleShow = () => setShowOffcanvas(true);

    const handleShowReadings = (counterId: number) => {
        axiosInstance
            .get(`/utility/counters/${counterId}/readings`)
            .then((response) => {
                setReadings(response.data);
                setCurrentCounter(counterId)
                setShowReadingsOffcanvas(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleCloseReadings = () => setShowReadingsOffcanvas(false);

    const handleCreateCounter = async (counter: ICounter) => {
        axiosInstance
            .post(`/utility/counters/${apartmentId}`, counter)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleCreateReading = async (reading: IReading) => {
        let correct : boolean = true;
        if (readings.length > 0) {
            const currentDate = new Date();
            const hasReadingForCurrentMonth = readings.some(reading => {
                const readingDate = new Date(reading.createDate);
                return readingDate.getFullYear() === currentDate.getFullYear() &&
                    readingDate.getMonth() === currentDate.getMonth();
            });

            if (hasReadingForCurrentMonth) {
                await MySwal.fire({
                    title: "Warning",
                    text: "The reading for the current month already exists",
                    icon: "warning",
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: 'btn btn-dark',
                        icon: 'text-dark',
                    }
                })
                    .then(() => {
                        correct = false;
                    });
            }
        }

        if (readings.length > 0 && reading.value < readings[0].value)
        {
            await MySwal.fire({
                title: "Warning",
                text: "The value cannot be less than the previous one",
                icon: "warning",
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-dark',
                    icon: 'text-dark',
                }
            })
            .then(() => {
                correct = false;
            });
        }

        if (!correct)
            return;

        axiosInstance
            .post(`/utility/counters/${currentCounter}/readings`, reading)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDeleteCounter = async (counterId: number) => {
        axiosInstance
            .delete(`/utility/counters/${counterId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        axiosInstance
            .get(`/utility/counters/${apartmentId}`)
            .then((response) => {
                setCounters(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className={"h1 text-center"}>Utility counters</div>
            <hr />
            <div className={"container"}>
                <div className={"d-flex justify-content-between mb-1"}>
                    <div className={"text-start"}>
                        <Link to={"/apartments"} className={"btn btn-dark"}>Apartments</Link>
                    </div>
                    <div className={"text-end"}>
                        <Button variant={"btn btn-outline-dark m-1"} onClick={handleShow}>Add</Button>
                    </div>
                </div>

                <div className={"text-end"}>

                </div>
                <table className={"table table-responsive"}>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        counters.map((counter: ICounter) => {
                            return (
                                <tr key={counter.id}>
                                    <td>{counter.title}</td>
                                    <td>
                                        {
                                            Object.entries(counterTypes)
                                                .map(([type, name]) =>
                                                    type == counter.counterType ? name : null )
                                        }
                                    </td>
                                    <td>
                                        <Button
                                            variant={"btn btn-outline-dark m-1"}
                                            onClick={() => handleShowReadings(counter.id!)}
                                        >
                                            Readings
                                        </Button>

                                        <Button
                                            variant={"btn btn-dark m-1"}
                                            onClick={() => handleDeleteCounter(counter.id!)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>

            <Offcanvas
                show={showOffcanvas}
                onHide={handleClose}
                backdrop={"static"}
            >
                <OffcanvasHeader closeButton>
                    <Offcanvas.Title>Add counter</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={counterSchema}
                            initialValues={{
                                title: "",
                                counterType: "electricity",
                                price: 0,
                                apartmentId: parseInt(apartmentId!)
                            }}
                            onSubmit={(values) => handleCreateCounter(values)}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form
                                    className={"mb-3"}
                                    onSubmit={handleSubmit}
                                >
                                    <FormFloating
                                        className={"mb-3"}
                                    >
                                        <FormControl
                                            type={"text"}
                                            name={"title"}
                                            value={values.title}
                                            onChange={handleChange}
                                            isInvalid={touched.title && !!errors.title}
                                        />
                                        <FormLabel>Title</FormLabel>
                                        <ErrorMessage
                                            name={"title"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </FormFloating>
                                    <InputGroup className={"mb-3"}>
                                        <InputGroup.Text>Price</InputGroup.Text>
                                        <FormControl
                                            type={"float"}
                                            name={"price"}
                                            value={values.price}
                                            onChange={handleChange}
                                            isInvalid={!!errors.price}
                                        />
                                        <ErrorMessage
                                            name={"price"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </InputGroup>
                                    <FormFloating
                                        className={"mb-3"}
                                    >
                                        <Form.Select
                                            name="counterType"
                                            value={values.counterType}
                                            onChange={handleChange}
                                            isInvalid={!!errors.counterType}>
                                            {
                                                Object.entries(counterTypes).map(([type, name]) => {
                                                    return <option key={type} value={type}>{name}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <FormLabel>Counter type</FormLabel>
                                        <ErrorMessage
                                            name={"counterType"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </FormFloating>
                                    <Button
                                        className={"w-100"}
                                        variant={"dark"}
                                        type={"submit"}
                                    >
                                        Add
                                    </Button>
                                </Form>
                                )}
                        </Formik>
                    </div>
                </OffcanvasBody>
            </Offcanvas>

            <Offcanvas
                show={showReadingsOffcanvas}
                onHide={handleCloseReadings}
                backdrop={"static"}
            >
                <OffcanvasHeader closeButton>
                    <OffcanvasTitle>
                        Readings
                    </OffcanvasTitle>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={readingSchema}
                            initialValues={{
                                createDate: new Date().toISOString().split('T')[0],
                                value: readings.length > 0 ? readings[0].value : 0,
                                counterId: currentCounter!
                            }}
                            onSubmit={(values) => {handleCreateReading(values)}}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form
                                    noValidate
                                    className={"mb-3"}
                                    onSubmit={handleSubmit}
                                >
                                    <FormFloating className={"mb-3"}>
                                        <FormControl
                                            type={"date"}
                                            name={"createDate"}
                                            value={values.createDate}
                                            onChange={handleChange}
                                            isInvalid={touched.createDate && !!errors.createDate}
                                        />
                                        <FormLabel>Reading date</FormLabel>
                                        <ErrorMessage
                                            name={"createDate"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </FormFloating>
                                    <InputGroup
                                        className={"mb-3"}
                                    >
                                        <InputGroup.Text>Value</InputGroup.Text>
                                        <FormControl
                                            type={"number"}
                                            name={"value"}
                                            value={values.value}
                                            onChange={handleChange}
                                            isInvalid={touched.value && !!errors.value}
                                        />
                                    </InputGroup>
                                    <Button
                                        className={"w-100"}
                                        variant={"dark"}
                                        type={"submit"}
                                    >
                                        Add
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        {
                            Object.values(readings).map((reading: IReading) => {
                                return (
                                    <div
                                        className={"border-black border rounded p-2 m-1"}
                                        key={reading.id}
                                    >
                                        <div className={"d-flex justify-content-between"}>
                                            <div className={"align-content-start"}>
                                                <div>{`Date: ${reading.createDate}`}</div>
                                                <div>{`Value: ${reading.value}`}</div>
                                            </div>
                                            <div className={"align-content-end"}>
                                                <Button
                                                    className={"btn btn-dark"}
                                                    onClick={() => {
                                                        axiosInstance
                                                            .delete(`/utility/counters/${currentCounter}/readings/${reading.id}`)
                                                            .then(() => {
                                                                window.location.reload();
                                                            })
                                                            .catch((error) => {
                                                                console.log(error);
                                                            });
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </>
    )
}

export default UtilityReadings;