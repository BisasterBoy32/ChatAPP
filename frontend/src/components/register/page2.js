import React from "react";
import { Link } from "react-router-dom";
import { Formik } from 'formik';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    input : {
        width : "100%"
    },
}));


const Wrapper = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    flex-direction : column;
`
const Title = styled.div`
    font-size : 40px;
       letter-spacing: 4px;
`

const TitleWrap = styled.div`
    width : 331px;
    margin : 3rem;
`


const Little = styled.div`
    font-size : 18px;
    margin : 14px 0;
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
    width : 50px;
    height : 50px;
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

export default ({ data, setData, setPage ,formRef ,preBtn ,setPrevious}) => {
    const classes = useStyles();
    const getPreviousPage = () => {
        setPrevious(false);
        setData({
            ...data,
            submit : false
        });
        setPage(1);
    }
    return (
        <Wrapper>
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
                            <form onSubmit={handleSubmit} ref={formRef}  style={{width:"100%"}}>

                                <TextField
                                    type="text"
                                    name="first_name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.first_name}
                                    label="Your full name"
                                    error={errors.first_name && touched.first_name}
                                    className={classes.input}
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
                                    <Button ref={preBtn} type="button" style={{ display : "none" }} onClick={getPreviousPage}>
                                    </Button>
                                </ButtonWrapper>
                            </form>
                        )}
                </Formik>
        </Wrapper>
    )
};