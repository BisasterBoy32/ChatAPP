import React , { 
    useContext,
} from "react";
import { UserContext } from "../../store/context"
import styled from "styled-components";
import axios from "axios";
import { setConfig } from "../../helpers";
import Navigator  from "./navigator";
import { FaSignOutAlt } from "react-icons/fa";

const ProfileImage = styled.div`
    width : 130px;
    height : 130px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    margin: auto;
    background-size: contain;
    margin-top : 2rem;
    border : 5px solid #fff;
`
const Username = styled.div`
    text-align : center;
    margin-top : .5rem;
    margin-bottom : 2rem;
    font-size : 1.5rem;
    font-weight: 700;
`

const Container = styled.div`
    top : 60px;
    left : 0px;
    bottom : 0px;
    width: 270px;
    background-color : #dedef9;
`

const Logout = styled.button`
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 15px;
    left: 15px;
    cursor: pointer;
    font-size : 1.2rem;
    padding: .4rem .8rem;
    border: none;
    background-color : transparent;
    color : #AEAFE8;
    &:hover {
        color :  #298bf0;
    }
`

const Icon = styled.div`
    display : flex;
    align-itelms : center;  
    font-size : 14px;  
    margin-left : 5px;
`


export default ({selected , setSelected }) => {
    const userContext = useContext(UserContext);
    const {user} = userContext.state

    const logout = () => {
        const config = setConfig(userContext.state.token);
        axios.post("/accounts/logout/", null, config)
            .then(
                res => userContext.dispatch({ type: "LOGOUT" }),
                err => userContext.dispatch(
                    { type: "LOGOUT_FAILED", payload: err.response.data }
                )
            );
    };

    return (
        <Container >
                <ProfileImage image={user.profile.icon} />
                <Username>{user.username}</Username>
            <Navigator selected={selected} setSelected={setSelected} />
            <Logout onClick={logout}> Logout <Icon> <FaSignOutAlt/> </Icon></Logout>
        </Container>
    )
}