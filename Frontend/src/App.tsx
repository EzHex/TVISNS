import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.js'
import MainNavbar from "./components/Navbar.tsx";
import {Route, Routes} from "react-router-dom";
import {Home} from "./components/pages/Home.tsx";
import {Login} from "./components/pages/Login.tsx";
import {Register} from "./components/pages/Register.tsx";
import NotFound from "./components/pages/NotFound.tsx";
import Apartments from "./components/pages/apartment/Apartments.tsx";
import Rooms from "./components/pages/room/Rooms.tsx";
import Objects from "./components/pages/object/Objects.tsx";
import UtilityReadings from "./components/pages/utilityReadings/UtilityReadings.tsx";
import Tenant from "./components/pages/Tenant.tsx";
import Admin from "./components/pages/Admin.tsx";
import RegisterFailure from "./components/pages/RegisterFailure.tsx";
import {Failures} from "./components/pages/Failures.tsx";

export default function App() {

  return (
    <div>
        <MainNavbar />
        <Routes>
            <Route path={"/"} element={<Home />} />

            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />

            <Route path={"/apartments"} element={<Apartments />} />
            <Route path={"/apartments/:apartmentId/rooms"} element={<Rooms />} />
            <Route path={"/apartments/:apartmentId/utility"} element={<UtilityReadings />} />
            <Route path={"/apartments/:apartmentId/failures"} element={<Failures />} />
            <Route path={"/apartments/:apartmentId/rooms/:roomId/objects"} element={<Objects />} />

            <Route path={"/tenant"} element={<Tenant />} />
            <Route path={"/register-failure"} element={<RegisterFailure />} />

            <Route path={"/admin"} element={<Admin />} />

            <Route path={"*"} element={<NotFound />} />
        </Routes>
    </div>
  )
}