import React , { useContext ,useState } from "react";
import { UserContext ,AlerContext } from "../../store/context";
import axios from "axios";
import { setConfig } from "../../helpers";
import Field from "./field";
import styled from "styled-components";

const Container = styled.div`
    min-width: 270px;
    width: 100%;
    padding: 3rem;
    border-radius: 11px;
    border: 2px solid #dedef9;
`

export default () => {
    const userContext = useContext(UserContext);
    const alertContext = useContext(AlerContext);
    const { user } = userContext.state;
    const [username , setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.first_name);

    const getAge = () => {
        const currentYear = new Date().getFullYear();
        const userBornYear = new Date(user.profile.born_date).getFullYear();
        const userAge = currentYear - userBornYear;

        return userAge;
    }

    // update user information
    const onUpdate = (setModify ,setCheck) => {
        const values = {
            username,
            email,
            first_name: firstName,
            profile : {
                icon : user.profile.icon,
                user : user.profile.user
            }
        }  
        // to remove modify icon 
        setCheck(false);
        const config = setConfig(userContext.state.token);
        axios.post("/accounts/update/" ,values , config)
        .then( 
            res => {
                userContext.dispatch({ action: "UPDATE_USER", payload: res });
                alertContext.dispatch({ type: "INFO_SUCCESS", payload: "Your profile information has changed succesfully" });
                // appear the check icon again and remove input
                setCheck(true);
                setModify(false);
            },
            err => {
                setCheck(true);
                let error = err.response.data
                error = error.username ? error.username[0] : error.non_field_errors[0];
                alertContext.dispatch({ type: "INFO_ERRO", payload: error});
            } 
        );
    }

    return (
        <Container className="animated zoomInUp">
            <Field value={email} onInputChange={setEmail} initValue={user.email} update={onUpdate} label="Email" />
            <Field value={firstName} onInputChange={setFirstName} initValue={user.first_name} update={onUpdate} label="Name" />
            <Field value={getAge()} label="Age" unChangeble/>
            <Field value={username} onInputChange={setUsername} initValue={user.username} update={onUpdate} label="Username" />
        </Container>
    )
}