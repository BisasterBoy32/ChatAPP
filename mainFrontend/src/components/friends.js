import React from "react";
import styled from "styled-components";

const Container = styled.div`
    flex : .5;
    position : relative; 
    border : 2px solid #4F98CA;
    margin-left : .5rem;
    border-radius : 4px;
`

const Main = styled.div`
    height : 80%;
`

const Title = styled.div`
    text-align : center;
    background-color : #4F98CA;
    font-size : 1.4rem;
    padding : .2rem;
`

const Input = styled.input`
    width : 100%;
    border-top : 2px solid  #4F98CA;
    font-size : 1.2rem;
    padding : .4rem;
    box-sizing: border-box;
    position : absolute;
    bottom : 0px;
    right : 0px;
    left : 0px;
`

export default () => {

    return (
        <Container>
            <Title > Friends </Title>
            <Main>
                <Input name="text" type="search" placeholder="Search..." />
            </Main>
        </Container>
    )
}