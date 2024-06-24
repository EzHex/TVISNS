import {FC} from "react";
import axios from "axios";
import {API_URL} from "../../config.tsx";
import {Button, Form} from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import {ErrorMessage, Formik} from "formik";
import * as yup from 'yup';

const MySwal = withReactContent(Swal);

export const Login : FC = () => {
    const userLogin = yup.object().shape({
        email: yup.string().email().required("Email is required"),
        password: yup.string().required("Password is required"),
    });

    const handleLogin = async (email: string, password: string) => {
        axios
            .post(`${API_URL}/auth/login`, {
                email: email,
                password: password,
            })
            .then((response) => {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('role', response.data.role);
                window.location.href = '/';
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
                });
            });
    }

    return (
        <div>
            <div className="h1 text-center">Login</div>
            <hr/>
            <div className={"d-flex justify-content-center align-items-center"}>
                <Formik
                    validationSchema={userLogin}
                    initialValues={{
                    email: '',
                    password: '',
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                      handleLogin(values.email, values.password)
                          .finally(() => {
                              setSubmitting(false);
                          })
                    }}
                    >
                    {({   handleSubmit,
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
                            <Form.Group className="mb-3" controlId="validationFormik01">
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
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}