import React from "react";
import { Link } from "react-router-dom";
import { Formik } from 'formik';
import styled from "styled-components";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    width : 100%;
    height : 100vh;
    flex-direction : column;
`

const Container = styled.div`
    width : 60%;
    border : 1px solid #4F98CA;
    padding : 2rem;
`

const Title = styled.div`
    background-color : #4F98CA;
    font-size : 1.5rem;
    color : #000;
    text-align : center;
    width: 60%;
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

const Image = styled.img`
    width : 100px;
    height : 100px;
    cursor : pointer;
    $:checked {
    outline: 2px solid #4F98CA;
    }
    margin : .2rem;
`

const RadioButton = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + img {
    outline: 2px solid #4F98CA;
  }
`

export default ({ data, setData, setPage }) => {

    const getPreviousPage = () => {
        setData({
            ...data,
            submit : false
        });
        setPage(1);
    }
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
                        icon : ""
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.born_date) {
                            errors.born_date = 'this field is required';
                        }
                        if (!values.first_name) {
                            errors.first_name = 'this field is required'
                        }
                        if (!values.icon){
                            errors.icon = "Choose an icon for your profile please";
                        }
                        return errors;
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        setData({
                            ...data,
                            ...values,
                            submit : true,
                        });
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
                        setFieldValue
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

                                <DatePicker
                                    name="born_date"
                                    onChange={e => setFieldValue('born_date', e)}
                                    onBlur={handleBlur}
                                    selected={values.born_date}
                                    placeholder="Born Date"
                                    iconPosition="left"
                                    error={errors.born_date && touched.born_date}
                                />
                                <Error>
                                    {errors.born_date && touched.born_date && errors.born_date}
                                </Error>

                                <div> Choose an icon for your profile : </div>
                                {
                                    [1,2,3,4,5,6,7,8,9,10].map( value => 
                                        <label key={value}>
                                            <RadioButton
                                                type="radio"
                                                name="icon"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={`/static/icons/icon-${value}.jpg`}
                                            />
                                            <Image src={`/static/icons/icon-${value}.jpg`} />
                                        </label>
                                    )
                                }
                                <Error>
                                    {errors.icon && touched.icon && errors.icon}
                                </Error>
                                <ButtonWrapper>
                                    <Button style={{ marginRight : "5px" }} onClick={getPreviousPage}>
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


// const RadioButtonField = (value, handleBlur, handleChange)=> {
//     return (
//         <label>
//             <RadioButton
//                 type="radio"
//                 name="icon"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={value}
//             />
//             <Image src={value} />
//         </label>
//     )
// }