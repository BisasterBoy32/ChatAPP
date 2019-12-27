import React from "react";
import { Link } from "react-router-dom";
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

export default ({data ,setData , setPage}) => {

    return (
        <Wrapper>
            <Title>
                Chat APP
        </Title>
            <Container>
                <Formik
                    initialValues={{ 
                        username: data.username,
                        email: data.email,
                        password1: data.password1,
                        password2: data.password2,
                    }}
                    validate={values => {
                        const errors = {};
                        const PasswordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
                        const EmailValidator = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/;

                        if (!values.username) {
                            errors.username = 'this field is required';
                        } 
                        if (!values.password1) {
                            errors.password1 = 'this field is required';
                        } else if (!PasswordValidator.test(values.password1)) {
                            errors.password1 = 'Password must be more than 8 chars contains chars upper case and numbers';
                        }
                        if (!values.password2) {
                            errors.password2 = 'this field is required';
                        }

                        if ( values.password1 !== values.password2){
                            errors.password2 = 'two password must match';
                        }

                        if (!values.email) {
                            errors.email = 'this field is required';
                        } else if (!EmailValidator.test(values.email)) {
                            errors.email = 'Enter a valid email address please!';
                        }
                        return errors;
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        setData({
                            ...data,
                            ...values
                        });
                        setSubmitting(false);
                        setPage(2);
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
                                    name="username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    placeholder="Username"
                                    error={errors.username && touched.username}
                                />
                                <Error>
                                    {errors.username && touched.username && errors.username}
                                </Error>

                                <Input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    placeholder="Email"
                                    error={errors.email && touched.email}
                                />
                                <Error>
                                    {errors.email && touched.email && errors.email}
                                </Error>
                                <Input
                                    type="password"
                                    name="password1"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password1}
                                    placeholder="Password"
                                    error={errors.password1 && touched.password1}
                                />
                                <Error>
                                    {errors.password1 && touched.password1 && errors.password1}
                                </Error>
                                <Input
                                    type="password"
                                    name="password2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password2}
                                    placeholder="Renter Password"
                                    error={errors.password2 && touched.password2}
                                />
                                <Error>
                                    {errors.password2 && touched.password2 && errors.password2}
                                </Error>
                                <Button type="submit" disabled={isSubmitting}>
                                    Next
                                </Button>
                            </form>
                        )}
                </Formik>
                <br />
                You have already an account? Login from <Link to="/">Here</Link>
            </Container>
        </Wrapper>
    )
};