import React, { useContext ,useState } from "react";
import { UserContext } from "../store/context";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik } from 'formik';
import styled from "styled-components";

const Wrapper = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    width : 100%;
    height : 100vh;
    flex-direction : column;
`

const Container = styled.div`
    width : 50%;
    border : 1px solid #4F98CA;
    padding : 2rem;
`

const Title = styled.div`
    background-color : #4F98CA;
    font-size : 1.5rem;
    color : #000;
    text-align : center;
    width: 50%;
    padding: .5rem;
`
const Input = styled.input`
    border : 1px solid 
    ${props => props.error ? "rgb(211, 80, 80)" : "#4F98CA"};
    width : 100%;
    padding : .2rem;
    padding-left : 1rem;
    font-size : 1.2rem;
    margin-top : 1rem;
`

const Button = styled.button`
    background-color : #4F98CA;
    border : 1px solid #4F98CA;
    margin-top : 1rem;
    padding : .5rem 2rem;
    display : block;
    font-size : 1.2rem;
    color : #000;
`

const Error = styled.div`
    color : rgb(211, 80, 80);
    font-size : .8rem;
    margin : .3rem 0 0 .3rem;
`

export default () => {

    const user = useContext(UserContext);
    const [loginError ,setLoginError] = useState(false);

    return (
        <Wrapper>
            <Title>
                Chat APP
        </Title>
            <Container>
                <Formik
                    initialValues={{ username_or_email: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.username_or_email) {
                            errors.username_or_email = 'this field is required';
                        }

                        if (!values.password) {
                            errors.password = 'this field is required'
                        }

                        return errors;
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        axios.post("accounts/login/", values)
                            .then(
                                res => {
                                    user.dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                                    setSubmitting(false);
                                },
                                err => {
                                    user.dispatch({ type: "LOGIN_FAILED", payload: err.response });
                                    setLoginError(true);
                                    setTimeout(() => {
                                        setLoginError(false);
                                    }, 5000);
                                    setSubmitting(false);
                                }
                            )
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                            <form onSubmit={handleSubmit}>
                                <Input
                                    type="text"
                                    name="username_or_email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    placeholder="Username or Email"
                                    error={errors.username_or_email && touched.username_or_email}
                                />
                                <Error>
                                    {errors.username_or_email && touched.username_or_email && errors.username_or_email}
                                </Error>
                                <Input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    placeholder="Password"
                                    error={errors.password && touched.password}
                                />
                                <Error>
                                    {errors.password && touched.password && errors.password}
                                </Error>
                                {loginError && 
                                <Error> Username or password Incorrect </Error>
                                }
                                <Button type="submit" disabled={isSubmitting}>
                                    Login
                                </Button>
                            </form>
                        )}
                </Formik>
                <br />
                You don't have an account? Register from <Link to="/register">Here</Link>
            </Container>
        </Wrapper>
    )
};