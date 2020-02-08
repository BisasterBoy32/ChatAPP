import React, { useContext } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding : .3rem;
    display : flex;
    cursor : pointer;
    &:hover {
        background-color : rgb(174, 216, 219);
    }
    position : relative;
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: .8rem;
`
const ProfileImage = styled.div`
    width : 30px;
    height : 30px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    position : relative;
`

export default ({ friend }) => {
    return (
        <Container>
            <ProfileImage image={friend.icon} />
            <Username > {friend.username} </Username>
        </Container>
    )
};