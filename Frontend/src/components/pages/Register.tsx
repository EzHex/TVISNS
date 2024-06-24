import {FC} from "react";
import {Button, Form} from "react-bootstrap";
import {API_URL} from "../../config.tsx";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup';
import {ErrorMessage, Formik} from "formik";

const MySwal = withReactContent(Swal)

export const Register : FC = () => {
    const userRegister = yup.object().shape({
        fullName: yup.string().required("Full name is required"),
        email: yup.string().email("Please enter valid email address").required("Email is required"),
        password: yup.string().min(8, "Minimum 8 symbols").required("Password is required"),
    });


    const handleRegister = async (fullName: string, email: string, password: string) => {
        axios
            .post(`${API_URL}/auth/register`, {
                fullName: fullName,
                email: email,
                password: password,
            })
            .then(() => {
                window.location.href = '/login';
            })
            .catch((error) => {
                MySwal.fire({
                    title: 'Error',
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: 'btn btn-dark',
                        icon: 'text-dark',
                    }
                })
            });
    }

    return (
        <div>
            <div className="h1 text-center">Register</div>
            <hr/>
            <div className={"d-flex justify-content-center align-items-center"}>
                <Formik
                    validationSchema={userRegister}
                    initialValues={{
                        fullName: '',
                        email: '',
                        password: '',
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        handleRegister(values.fullName, values.email, values.password)
                            .finally(() => {
                                setSubmitting(false);
                            })
                    }}
                >
                {({     handleSubmit,
                        isSubmitting,
                        handleChange,
                        values,
                        touched,
                        errors }) => (
                        <Form
                            noValidate
                            onSubmit={handleSubmit}
                            className="container pb-5 w-50"
                            >
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    name="fullName"
                                    value={values.fullName}
                                    onChange={handleChange}
                                    isInvalid={touched.fullName && !!errors.fullName}
                                />
                                <ErrorMessage
                                    name={"fullName"}
                                    component={"div"}
                                    className={"text-danger"} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={touched.email && !!errors.email}
                                />
                                <ErrorMessage
                                    name={"email"}
                                    component={"div"}
                                    className={"text-danger"}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={touched.password && !!errors.password}
                                />
                                <ErrorMessage
                                    name={"password"}
                                    component={"div"}
                                    className={"text-danger"}/>
                            </Form.Group>
                            <Button
                                variant="dark"
                                type="submit"
                                className={"w-100 mt-3"}
                                disabled={isSubmitting}>
                                Register
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}