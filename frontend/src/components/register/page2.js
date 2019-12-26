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

const ButtonWrapper = styled.div`
    display : flex;
    justify-content : center;
`

export default ({ data, setData, setPage ,onFormSubmit}) => {

    return (
        <Wrapper>
            <Title>
                Chat APP
        </Title>
            <Container>
                <Formik
                    initialValues={{
                        born_date: data.born_date,
                        first_name: data.first_name,
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.born_date) {
                            errors.born_date = 'this field is required';
                        }
                        if (!values.first_name) {
                            errors.first_name = 'this field is required'
                        }
                        return errors;
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        setData({
                            ...data,
                            ...values
                        });
                        onFormSubmit();
                        setSubmitting(false);
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
                                    name="first_name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.first_name}
                                    placeholder="Your full name"
                                    error={errors.first_name && touched.first_name}
                                />
                                <Error>
                                    {errors.first_name && touched.first_name && errors.first_name}
                                </Error>

                                <Input
                                    type="text"
                                    name="born_date"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.born_date}
                                    placeholder="Born Date"
                                    error={errors.born_date && touched.born_date}
                                />
                                <Error>
                                    {errors.born_date && touched.born_date && errors.born_date}
                                </Error>
                                <ButtonWrapper>
                                    <Button style={{ marginRight : "5px" }} onClick={() => setPage(1)}>
                                        Previous
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        Register
                                    </Button>
                                </ButtonWrapper>
                            </form>
                        )}
                </Formik>
                <br />
                You have already an account? Login from <Link to="/">Here</Link>
            </Container>
        </Wrapper>
    )
};