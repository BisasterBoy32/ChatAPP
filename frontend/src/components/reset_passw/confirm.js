import React, { useState ,useEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

const Container = styled.div`
    margin-top : 100px;
    margin-right : auto;
    margin-left : auto;
    width : 50%;
    border : 1px solid #4F98CA;
    padding : 2rem;
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
    display : inline-block;
    font-size : 1.2rem;
    color : #000;
`


const Error = styled.div`
    color : rgb(211, 80, 80);
    font-size : .8rem;
    margin : .3rem 0 0 .3rem;
`

export default (props) => {
    const [formError, setFormError] = useState("");
    const [Loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [reset , setReset] = useState(false);
    const [disable, setDisable] = useState(false);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const token=props.location.search.slice(7);

    useEffect(() => {
        console.log(props.location);
        // get the token from the URL
        axios.post("reset_password/validate_token/",{token})
        .then(
            res => {
                setValid(true);
                setLoading(false);
            },
            err => {
                console.log(err.response);
                setValid(false);
                setLoading(false);
            }
        )
    },[])

    const sendRequest = (e) => {
        e.preventDefault();
        const PasswordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!password || !password2){
            setFormError("enter the new password and confirm it");
            return null;
        }
        else {
            if (!PasswordValidator.test(password)) {
                setFormError('Password must be more than 8 chars contains chars upper case and numbers');
                return null;
            } else if (password !== password2 ) {
                setFormError("the 2 passwords doesn't match");
                return null;
            }
        }
        setDisable(true);
        const values = {
            password: password ,
            token 
        }
        axios.post(`reset_password/confirm/`, values)
            .then(
                res => {
                    setDisable(false);
                    setValid(false);
                    setReset(true);
                },
                err => {
                    setDisable(false);
                    setValid(false);
                    console.log("error : ", err.response)
                    setFormError("Invalid Token");
                    setTimeout(() => setFormError(""), 3000);
                }
            )
    }

    if (Loading) {
        return <Container> <h1> Loading... </h1></Container>
    } else if (valid) {
        return (
            <Container>
                <form onSubmit={sendRequest}>
                    <Input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="New Password"
                    />
                    <Input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword2(e.target.value)}
                        value={password2}
                        placeholder="Confirm Password"
                    />
                    {formError &&
                        <Error> {formError} </Error>
                    }
                    <Button type="submit" disabled={disable}>
                        Reset
                    </Button>
                    {disable && <CircularProgress />}
                </form>
            </Container>
        )
    } else if (reset) {
        return <Container><h1> Congratulation your password has been updated succefully <Link to=""> login in </Link> </h1></Container>
    } else {
        return <Container> <h1>Invalid Token :( </h1></Container>
    }
};