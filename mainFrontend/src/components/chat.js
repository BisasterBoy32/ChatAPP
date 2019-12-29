import React from "react";
import styled from "styled-components";

const Container = styled.div`
    flex : 1.5;
    border : 2px solid #4F98CA;
    border-radius : 4px;
`

const Main = styled.div`
    height : 80vh; 
`
const Input = styled.input`
    width : 100%;
    border-top : 2px solid  #4F98CA;
    font-size : 1.2rem;
    padding : .4rem;
    box-sizing: border-box;
`

const Button = styled.button`
    width : 100%;
    background-color :  #4F98CA;
    font-size : 1.4rem;
    text-align : center;
    cursor : pointer;
    border : 2px solid  rgb(31, 119, 179);
    padding : .2rem;
`

export default () => {

    return (
        <Container>
            <Main></Main>
            <form>
                <Input name="text" type="text" placeholder="Type ypur message..."/>
                <Button type="submit" >Send</Button>
            </form>
        </Container>
    )
}