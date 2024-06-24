import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Nav} from "react-bootstrap";
import logo from '../assets/house-chimney-blank.svg';
import {Link} from "react-router-dom";

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    window.location.href = '/';
}

export default function MainNavbar() {
    const role = localStorage.getItem('role');
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
                <Navbar.Brand>{
                    <img
                        alt="Home"
                        src={logo}
                        width="50"
                        height="50"
                        style={{ cursor: "pointer" }}
                        onClick={() => window.location.href = '/'}
                    />
                }</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className={"flex-grow-1 pe-3"}>
                        {role === "Admin" && <Nav.Link as={Link} to={"/admin"}>Admin menu</Nav.Link> }
                        {role === "Owner" && <Nav.Link as={Link} to={"/apartments"}>Apartments</Nav.Link> }
                        {role === "Tenant" && <Nav.Link as={Link} to={"/tenant"}>Tenant menu</Nav.Link> }
                    </Nav>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        {
                            localStorage.getItem('refreshToken')  ?
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link> :
                                <>
                                    <Nav.Link as={Link} to={"/login"}>Login</Nav.Link>
                                    <Nav.Link as={Link} to={"/register"}>Register</Nav.Link>
                                </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}