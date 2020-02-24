import React ,{ useState } from "react";
import styled from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";


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

export default () => {
    const [formError, setFormError] = useState("");
    const [requestSent ,setRequestSent] = useState(false);
    const [disable, setDisable] = useState(false);
    const [email, setEmail] = useState("");

    const sendRequest = (e) => {
        e.preventDefault()
        setDisable(true);
        axios.post(`reset_password/`, {email})
            .then(
                res => {
                    setDisable(false);
                    setRequestSent(true);
                },
                err => {
                    setDisable(false);
                    console.log("error : ", err.response.data.email[0])
                    setFormError(err.response.data.email[0]);
                    setTimeout(() => setFormError(""),3000);
                }
            )
    }

    if (requestSent){
        return (
            <Container> a reset link has been sent to your email check your email to reset your password</Container>
        )
    } else {
        return (
            <Container>
                <form onSubmit={sendRequest}>
                    <Input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
                    />
                    {formError &&
                        <Error> {formError} </Error>
                    }
                    <Button type="submit" disabled={disable}>
                        Confirm
                    </Button>
                    {disable && <CircularProgress />}
                </form>
            </Container>
        )
    }
};