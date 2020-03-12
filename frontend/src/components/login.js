import React, { useContext, useState } from "react";
import { UserContext } from "../store/context";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik } from 'formik';
import styled ,{ keyframes } from "styled-components";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FaGoogle } from "react-icons/fa";

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

export default ({formRef ,setProgress}) => {

    const user = useContext(UserContext);
    const [loginError, setLoginError] = useState(false);
    const classes = useStyles();

    const sendAccessToken = (backend, response) => {
        // send the access token to the server
        // the server will connect to the facebook with this access token and 
        // get this user data create a user or update
        // the current one and generate a season token
        // and send it to this user so he can be authenticated 
        const values = {
            access_token: response.accessToken
        }
        axios.post(`accounts/oauth/login/${backend}/`, values)
            .then(
                res => {
                    user.dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                    setProgress(false);
                },
                err => {
                    user.dispatch({ type: "LOGIN_FAILED", payload: err.response.message });
                    setProgress(false);
                }
            )
    }
    // whene user log in with google
    const responseGoogle = (response) => {
        sendAccessToken("google-oauth2", response)
    }
    // whene user login with facebook
    const responseFacebook = (response) => {
        sendAccessToken("facebook", response)
    }

    return (
        <Wrapper className="animated fadeIn">
            <TitleWrap>
                <Title> Welcome <strong> Back,</strong> </Title>
                <Little > Enter you information below or login with a social account </Little>
            </TitleWrap>
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
                                setSubmitting(false);
                                setProgress(false);
                                user.dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                            },
                            err => {
                                user.dispatch({ type: "LOGIN_FAILED", payload: err.response });
                                setLoginError(true);
                                setProgress(false);
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
                        <form onSubmit={handleSubmit} ref={formRef} style={{width:"100%"}}>
                            <InputContainer>
                                <TextField 
                                    label="Username or Email"
                                    type="text"
                                    name="username_or_email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    error={errors.username_or_email && touched.username_or_email}
                                    className={classes.input}
                                />
                                {errors.username_or_email && touched.username_or_email && errors.username_or_email &&
                                    <Error className="animated flash">
                                        {errors.username_or_email && touched.username_or_email && errors.username_or_email}
                                    </Error>   
                                }
                            </InputContainer>
                            <InputContainer>
                                <TextField 
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    label="Password"
                                    error={errors.password && touched.password}
                                    className={classes.input}
                                />
                                {errors.password && touched.password && errors.password && 
                                    <Error className="animated flash">
                                        {errors.password && touched.password && errors.password}
                                    </Error>
                                }
                                {loginError && 
                                    <Error className="animated flash">
                                        username or password incorrect
                                    </Error>
                                }
                            </InputContainer>
                        </form>
                    )}
            </Formik>
            <div style={{width: "100%"}} >
            <GoogleLogin
                clientId="740700554850-7g28qlulefo44hfc49s7aqra3b0ljice.apps.googleusercontent.com"
                buttonText=""
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                autoLoad={false}
                render={renderProps => (
                    <button 
                    className="google-css" 
                    onClick={renderProps.onClick} 
                    disabled={renderProps.disabled}>
                        <FaGoogle />
                    </button>
                  )}
            />
            <FacebookLogin
                appId="612218419594833"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa-facebook"
                cssClass="facebook-css"
                textButton=""
            />
            </div>
            <br />
            <div style={{width: "100%"}} >
            <Link to="/reset" className="forget"> forget password?  </Link>
            </div>
        </Wrapper>
    )
};