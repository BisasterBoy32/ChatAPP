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

const Error = styled.div`
    color: #fff;
    font-size: .8rem;
    padding: 2px 0 2px 7px;
    position: absolute;
    bottom: -20px;
    background-color: rgb(238, 150, 150);
    width: 100%;
    box-sizing: border-box;
`
const InputContainer = styled.div`
    width : 100%;
    position : relative;
    margin-bottom : 10px;
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
        <Wrapper className="animated fadeIn">
            <TitleWrap>
                <Title> Hello <strong> Beautiful,</strong> </Title>
                <Little > Enter you information below </Little>
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
                            <form onSubmit={handleSubmit} ref={formRef}  style={{width:"100%" ,marginBottom : "1rem"}}>
                                <InputContainer>
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
                                {errors.username && touched.username && errors.username &&
                                    <Error className="animated flash">
                                        {errors.username && touched.username && errors.username}
                                    </Error>   
                                }
                            </InputContainer>

                                                            <InputContainer>
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
                                {errors.email && touched.email && errors.email &&
                                    <Error className="animated flash">
                                        {errors.email && touched.email && errors.email}
                                    </Error>   
                                }
                            </InputContainer>



                            <InputContainer>
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
                                {errors.password1 && touched.password1 && errors.password1 &&
                                    <Error className="animated flash">
                                        {errors.password1 && touched.password1 && errors.password1}
                                    </Error>   
                                }
                            </InputContainer>
                               
                            <InputContainer>
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
                                {errors.password2 && touched.password2 && errors.password2 &&
                                    <Error className="animated flash">
                                        {errors.password2 && touched.password2 && errors.password2}
                                    </Error>   
                                }
                            </InputContainer>


                            </form>
                        )}
                </Formik>
        </Wrapper>
    )
};