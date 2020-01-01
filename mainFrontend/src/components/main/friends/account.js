import React, { useContext } from "react";
import styled from "styled-components";
import { AccountsContext } from "../../../store/context";

const Container = styled.div`
    padding : .5rem ;
    display : flex;
    cursor : pointer;
    background-color : ${props => props.selected ? "rgb(174, 216, 219)" : "transparent"};
    &:hover {
        background-color : rgb(174, 216, 219);
    }
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: 1.3rem;
`
const ProfileImage = styled.div`
    width : 70px;
    height : 70px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    position : relative;
`

const IsActive = styled.div`
    width: 15px;
    height: 15px;
    background-color: rgb(97, 252, 118);;
    border-radius: 50%;
    position: absolute;
    bottom: 2px;
    right: 3px;
    border: 1px solid #fff;
`

export default ({ account, selected }) => {
    const accountsContext = useContext(AccountsContext);

    return (
        <Container
            selected={selected}
            onClick={() => accountsContext.dispatch({
                type: "SELECT_FRIEND",
                payload: account
            })
            }>
            <ProfileImage image={account.icon}>
                {account.active && <IsActive />}
            </ProfileImage>
            <Username > {account.username} </Username>
        </Container>
    )
}