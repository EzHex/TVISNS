import {useEffect, useState} from "react";
import axiosInstance from "../Axios.tsx";
import User, {IUser} from "../User.tsx";

const Admin = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        axiosInstance
            .get(`/users`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className={"h1 text-center"}>Admin</div>
            <hr />
            <div className={"container"}>
                {
                    users.map((user: IUser) => {
                        return (
                            <User key={user.id} {...user}/>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Admin;