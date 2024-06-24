import {Button} from "react-bootstrap";
import axiosInstance from "./Axios.tsx";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(swal);

export interface IUser {
    id?: number;
    fullName: string;
    email: string;
    blocked: boolean;
}

const User = (user: IUser) => {
    const handleBlock = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, block user!',
            cancelButtonText: 'No, keep user',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance
                    .put(`/users/${user.id}/block`)
                    .then(() => {
                        window.location.href = "/admin";
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    const handleUnblock = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, unblock user!',
            cancelButtonText: 'No, keep user',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance
                    .put(`/users/${user.id}/unblock`)
                    .then(() => {
                        window.location.href = "/admin";
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    return (
        <div className={"container border rounded p-3 m-1"}>
            <div className={"d-flex justify-content-between"}>
                <div className={""}>
                    <div>Full name: {user.fullName}</div>
                    <div>Email: {user.email}</div>
                </div>
                <div>
                {
                    user.blocked
                        ? <Button variant={"btn btn-outline-dark"} onClick={handleUnblock}>Unblock</Button>
                        : <Button variant={"btn btn-dark"} onClick={handleBlock}>Block</Button>
                }
                </div>
            </div>
        </div>
    )
}

export default User;