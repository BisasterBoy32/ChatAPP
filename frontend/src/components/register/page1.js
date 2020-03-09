import React ,{ useState } from "react";
import { Formik } from 'formik';
import styled from "styled-components";
import axios from "axios";
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

export default ({data ,setData , setPage ,formRef ,setPrevious}) => {
    const classes = useStyles();
    const [emailError, setEmailError] = useState(false);
    const [usernameError , setUsernameError] = useState(false);

    // this will be run to check if there is a user 
    // with the typed username 
    const handleUsernameErrors = (e) => {
        axios.post("/accounts/validate/",{
            username : e.target.value,
            email : ""
        })
        .then(
            res => setUsernameError(false),
            err => setUsernameError(true)
        )

    }

    // this will be run to check if there is a user 
    // with the typed username 
    const handleEmailErrors = (e) => {
        axios.post("/accounts/validate/",{
            username : "",
            email : e.target.value
        })
        .then(
            res => setEmailError(false),
            err => setEmailError(true)
        )

    }

    return (
        <Wrapper>
            <TitleWrap>
                <Title> Hello <strong> Beautiful,</strong> </Title>
                <Little > Enter you information below or login with a social account </Little>
            </TitleWrap>
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
                        if (usernameError){
                            errors.username = 'this username has been token choose another one'
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
                        if (emailError){
                            errors.email = 'a user with this email already exists'
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
                        setPrevious(true);
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
                            <form onSubmit={handleSubmit} ref={formRef}  style={{width:"100%"}}>
                                <TextField
                                    label="Username"
                                    type="text"
                                    name="username"
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleUsernameErrors(e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    error={errors.username && touched.username}
                                    className={classes.input}
                                />
                                <Error>
                                    {errors.username && touched.username && errors.username}
                                </Error>

                                <TextField
                                    type="email"
                                    name="email"
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleEmailErrors(e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    label="Email"
                                    error={errors.email && touched.email}
                                    className={classes.input}
                                />
                                <Error>
                                    {errors.email && touched.email && errors.email}
                                </Error>
                                <TextField
                                    type="password"
                                    name="password1"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password1}
                                    label="Password"
                                    className={classes.input}
                                    error={errors.password1 && touched.password1}
                                />
                                <Error>
                                    {errors.password1 && touched.password1 && errors.password1}
                                </Error>
                                <TextField
                                    type="password"
                                    name="password2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password2}
                                    label="Renter Password"
                                    error={errors.password2 && touched.password2}
                                    className={classes.input}
                                />
                                <Error>
                                    {errors.password2 && touched.password2 && errors.password2}
                                </Error>
                            </form>
                        )}
                </Formik>
        </Wrapper>
    )
};