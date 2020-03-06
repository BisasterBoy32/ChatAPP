import React ,{ useState } from "react";
import styled from "styled-components";
import Login from "./login";
import Register from "./register/index";

const Container = styled.div`
    width : 30%;
    padding : 2rem 2rem 2.5rem 2rem;
    border-radius : 4px;
    box-shadow: 20px 20px 22px 10px rgba(124,121,130,.3);
    background-color: #F2F1F4;
`;

const Header = styled.div`
    display : flex;
    margin-bottom : 2rem;
`;

const Nav = styled.div`
    display : flex;
    margin-left : auto;
    justify-content : space-between;
    width : 120px;
`;

const Choose = styled.div`
    cursor : pointer;
    color : #1A181A;
    font-weight : ${ props => props.selected ? "500" : "700" };
    transition : transform 300ms ease-in-out;
    &:hover{
        transform : scale(1.2);
    }

    &:hover .line {
        width : 100%;
    }
`;

export default () => {
    const [login ,setLogin] = useState(true);

    return (
        <Container>
            <Header>
                <Nav>
                    <Choose selected={login} onClick={() => setLogin(true)}> Sign In <div className="line"></div> </Choose>
                    <Choose selected={!login} onClick={() => setLogin(false)}> Sign Up <div className="line"></div>   </Choose>
                </Nav>
            </Header>
            {login && <Login />}
            {!login && <Register />}
        </Container>
    )
}