import React ,{ useState, useRef } from "react";
import styled from "styled-components";
import Login from "./login";
import Register from "./register/index";
import { FaArrowRight } from "react-icons/fa";

const Container = styled.div`
    width : 30%;
`;

const Wrapper = styled.div`
    padding : 2rem 2rem 2.5rem 2rem;
    border-radius : 4px;
    box-shadow: 20px 20px 22px 10px rgba(124,121,130,.3);
    background-color: #F2F1F4;
`

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


const Button = styled.button`
    background-color : #AEAFE8;
    border : 1px solid #AEAFE8;
    border-radius : 6px;
    padding : .5rem 1rem;
    display : block;
    font-size : 1.2rem;
    color : #000;
    cursor : pointer;
    position : absolute;
    top: -21px;
    right: 25px;
`

const Footer = styled.div`
    height : 50px;
    background-color : #7C7982;
    position : relative;
    width : 100%;
`

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
    const loginForm = useRef(null);
    const RegisterForm = useRef(null);

    const onButtonClicked = () => {
        loginForm.current.submit()
    };

    return (
        <Container>
        <Wrapper>
            <Header>
                <Nav>
                    <Choose selected={login} onClick={() => setLogin(true)}> Sign In <div className="line"></div> </Choose>
                    <Choose selected={!login} onClick={() => setLogin(false)}> Sign Up <div className="line"></div>   </Choose>
                </Nav>
            </Header>
            {login && <Login formRef={loginForm}/>}
            {!login && <Register formRef={RegisterForm}/>}
        </Wrapper>
        <Footer >
            <Button onClick={onButtonClicked}>
                <FaArrowRight style={{color : "#fff"}}/>
            </Button>
        </Footer>
        </Container>
    )
}