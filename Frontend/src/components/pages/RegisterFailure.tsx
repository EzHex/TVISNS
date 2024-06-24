import {Button, Form, FormFloating} from "react-bootstrap";
import {FormEvent, useEffect, useState} from "react";
import axiosInstance from "../Axios.tsx";
import IRoom from "../models/roomModel.tsx";

interface ISmallObject {
    id: number,
    title: string,
}

interface IFailure {
    id: number,
    failureState: string,
    description: string,
}

const RegisterFailure = () => {

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<number>(-1);

    const [objects, setObjects] = useState<ISmallObject[]>([]);
    const [selectedObject, setSelectedObject] = useState<number>(-1);

    const [description, setDescription] = useState<string>("");

    const [failures, setFailures] = useState<IFailure[]>([]);
    const handleSendFailure = (e: FormEvent) => {
        e.preventDefault();

        if (selectedRoom === -1 || selectedObject === -1)
            return;

        const failure = {
            objectId: selectedObject,
            description: description
        }

        axiosInstance
            .post(`/tenant/failures`, failure)
            .then(() => {
                window.location.reload()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {

        axiosInstance
            .get(`/tenant/failures`)
            .then((response) => {
                setFailures(response.data)
            })
            .catch((error) => {
                console.log(error);
            });

        axiosInstance
            .get(`/tenant/rooms`)
            .then((response) => {
                setRooms(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    useEffect(() => {
        if (selectedRoom === -1) return;
        axiosInstance
            .get(`/tenant/rooms/${selectedRoom}/objects`)
            .then((response) => {
                setObjects(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [selectedRoom]);

    return (
        <>
            <div className={"h1 text-center"}>Register Failure</div>
            <hr/>
            <div className="container">
                <div className={"border-black border-1"}>
                    <Form
                        onSubmit={handleSendFailure}
                    >
                        <Form.Select
                            className={"mb-3"}
                            name={"roomId"}
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(parseInt(e.target.value))}
                        >
                            <option value={-1}>Select room</option>
                            {
                                rooms.map((room: IRoom) => {
                                    return (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    )
                                })
                            }
                        </Form.Select>
                        {
                            selectedRoom !== -1 &&
                            <Form.Select
                                name={"objectId"}
                                className={"mb-3"}
                                value={selectedObject}
                                onChange={(e) => setSelectedObject(parseInt(e.target.value))}
                            >
                                <option value={-1}>Select object</option>
                                {
                                    objects.map((object: ISmallObject) => {
                                        return (
                                            <option key={object.id} value={object.id}>{object.title}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        }
                        {
                            selectedRoom !== -1 && selectedObject !== -1 &&
                            <FormFloating
                                className={"mb-3"}
                            >
                                <Form.Control
                                    as={"textarea"}
                                    type={"text"}
                                    placeholder={"Failure description"}
                                    name={"description"}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <label>Description</label>
                            </FormFloating>
                        }
                        <Button type="submit" className="btn btn-dark w-100">Submit</Button>
                    </Form>
                </div>

                <div className={""}>
                    {
                        failures.map((failure: IFailure) => {
                            return (
                                <div key={failure.id} className={"border border-1 border-black rounded mt-3 p-1"}>
                                    <div className={""}>{`Status: ${failure.failureState}`}</div>
                                    <div className={""}>{`Description: ${failure.description}`}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}
export default RegisterFailure;