import React from "react";
import styled from "styled-components";

const Container = styled.div`
    position : absolute;
    top : 0px;
    bottom : 0px;
    right : 0px
    left : 0px;
    display : flex;
    justify-content : center;
    align-items :center;
    color : #fff;
    background-color : #4F98CA;
`

export default () => {
    return (
        <Container>
            <h1>LOADING...</h1>
        </Container>
    )
}  