import {ICounter, IReading} from "./pages/utilityReadings/UtilityReadings.tsx";
import {
    Button,
    Form,
    FormControl,
    FormFloating, FormLabel, InputGroup,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    OffcanvasTitle
} from "react-bootstrap";
import {useState} from "react";
import axiosInstance from "./Axios.tsx";
import {ErrorMessage, Formik} from "formik";
import * as yup from "yup";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const UtilityCounter = (counter : ICounter) => {

    const counterTypes = {
        electricity: "Electricity",
        electricityNight: "Electricity (Night)",
        gas: "Gas",
        coldWater: "Water (Cold)",
        hotWater: "Water (Hot)"
    };

    const readingSchema = yup.object().shape({
        id: yup.number(),
        createDate: yup.date().required("Reading date is required"),
        value: yup.number().required("Value is required"),
        counterId: yup.number()
    })

    const [readings, setReadings] = useState<IReading[]>([]);

    const [showReadingCanvas, setShowReadingCanvas] = useState(false);

    const handleCloseReadingCanvas = () => setShowReadingCanvas(false);
    const handleShowReadingCanvas = () => {
        axiosInstance
            .get(`/utility/counters/${counter.id}/readings`)
            .then((response) => {
                setReadings(response.data);
                setShowReadingCanvas(true);
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
            .post(`/utility/counters/${counter.id}/readings`, reading)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className={"container border rounded m-1 p-3 justify-content-between d-flex space-between"}>
            <div>
                <div>{`Title: ${counter.title}`}</div>
                <div>
                    {
                        Object.entries(counterTypes)
                            .map(([type, name]) =>
                                type == counter.counterType ? `Type: ${name}` : null )
                    }
                </div>
            </div>
            <div>
                <Button
                    variant={"btn btn-outline-dark"}
                    onClick={handleShowReadingCanvas}
                >
                    Readings
                </Button>
            </div>
            <Offcanvas show={showReadingCanvas} onHide={handleCloseReadingCanvas} backdrop={"static"}>
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
                                createDate: new Date(),
                                value: readings.length > 0 ? readings[0].value : 0,
                                counterId: counter.id!
                            }}
                            onSubmit={(values) => {
                                handleCreateReading(values)
                            }}
                        >
                            {({handleSubmit, handleChange, values, touched, errors}) => (
                                <Form
                                    noValidate
                                    className={"mb-3"}
                                    onSubmit={handleSubmit}
                                >
                                    <FormFloating className={"mb-3"}>
                                        <FormControl
                                            type={"date"}
                                            name={"readingDate"}
                                            value={values.createDate.toISOString().split('T')[0]}
                                            onChange={handleChange}
                                            isInvalid={touched.createDate && !!errors.createDate}
                                            readOnly
                                        />
                                        <FormLabel>Reading date</FormLabel>
                                        <ErrorMessage
                                            name={"readingDate"}
                                            component={"div"}
                                            className={"text-danger"}/>
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
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    )
}

export default UtilityCounter;