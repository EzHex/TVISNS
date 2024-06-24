import axios from "axios";
import {API_URL} from "../config.tsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

async function RefreshAccessToken() {
    try {
        await axios
            .get(`${API_URL}/auth/access-token`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
                },
            })
            .then((response) => {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("role", response.data.role);
            });
    }
    catch (error) {
        MySwal.fire({
            title: "Request failed",
            text: "Please login again.",
            icon: "error",
            confirmButtonText: "Ok",
        }).then(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
        });
    }
}

export default RefreshAccessToken;