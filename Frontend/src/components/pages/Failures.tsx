import {useEffect, useState} from "react";
import axiosInstance from "../Axios.tsx";
import {Link, useParams} from "react-router-dom";
import {Button, Form, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import IObject from "../models/objectModel.tsx";


interface IFailure {
    id?: number,
    description: string,
    failureState: string,
    apartmentId?: number,
    objectId?: number,
    tenantId?: number
}

export const Failures = () => {
    const apartmentId = useParams().apartmentId;
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const [object, setObject] = useState<IObject|undefined>(undefined);
    const [failures, setFailures] = useState<IFailure[]>([]);

    const handleStatusChange = (id: number, status: string) => {
        axiosInstance
            .put(`/apartments/${apartmentId}/failures/${id}`, {
                failureState: status
            })
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleOffCanvasOpen = (objectId: number) => {
        axiosInstance
            .get(`/objects/${objectId}`)
            .then((response) => {
                setObject(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        setShowOffCanvas(true);
    }

    const handleOffCanvasClose = () => {
        setShowOffCanvas(false);
    }

    useEffect(() => {
        axiosInstance
            .get(`/apartments/${apartmentId}/failures`)
            .then((response) => {
                setFailures(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className={"h1 text-center"}>Failures</div>
            <hr/>
            <div className={"container"}>
                <Link
                    to={`/apartments`}
                    className={"btn btn-dark"}
                >
                    Apartments
                </Link>
            </div>
            <div className={"container"}>
                <div className={""}>
                    {
                        failures.map((failure: IFailure) => {
                            return (
                                <div key={failure.id} className={"border border-1 border-black rounded mt-3 p-1"}>
                                    <div className={"d-flex justify-content-between"}>
                                        <div className={"text-start"}>
                                            <div className={"fw-bold"}>{`Status: ${failure.failureState}`}</div>
                                            <div className={""}>{`Description: ${failure.description}`}</div>
                                        </div>
                                        <div>
                                            <Button
                                                className={"m-1"}
                                                variant={"btn btn-outline-dark"}
                                                onClick={() => handleOffCanvasOpen(failure.objectId!)}
                                            >
                                                View object
                                            </Button>
                                        </div>
                                        <div className={"text-end"}>
                                            {
                                                failure.failureState === "CREATED" && <>
                                                    <Button
                                                        className={"m-1"}
                                                        variant={"btn btn-outline-dark"}
                                                        onClick={() => handleStatusChange(failure.id!, "IN_PROGRESS")}
                                                    >
                                                        Set in progress
                                                    </Button>
                                                    <Button
                                                        className={"m-1"}
                                                        variant={"btn btn-outline-dark"}
                                                        onClick={() => handleStatusChange(failure.id!, "DONE")}
                                                    >
                                                        Set to done
                                                    </Button>
                                                </>
                                            }
                                            {
                                                failure.failureState === "IN_PROGRESS" && <>
                                                    <Button
                                                        className={"m-1"}
                                                        variant={"btn btn-outline-dark"}
                                                        onClick={() => handleStatusChange(failure.id!, "DONE")}
                                                    >
                                                        Set to done
                                                    </Button>
                                                </>
                                            }

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Offcanvas
                show={showOffCanvas}
                onHide={handleOffCanvasClose}
                backdrop={"static"}
            >
                <OffcanvasHeader closeButton>
                    <Offcanvas.Title>Object</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className={"container pb-5"}>
                        <Form.Floating className={"m-3"}>
                            <Form.Control
                                readOnly
                                type={"text"}
                                name={"title"}
                                value={object?.title}
                            />
                            <Form.Label>Title</Form.Label>

                        </Form.Floating>
                        <Form.Floating className={"m-3"}>
                            <Form.Control
                                readOnly
                                as={"textarea"}
                                type={"text"}
                                name={"description"}
                                value={object?.description}
                            />
                            <Form.Label>Description</Form.Label>
                        </Form.Floating>
                        <Form.Floating className={"m-3"}>
                            <Form.Control
                                type={"number"}
                                name={"grade"}
                                value={object?.grade}
                                readOnly
                            />
                            <Form.Label>Grade</Form.Label>
                        </Form.Floating>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </>
    );
}