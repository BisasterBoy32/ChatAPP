import React ,{ useState, useRef } from "react";
import styled from "styled-components";
import Login from "./login";
import Register from "./register/index";
import { FaArrowRight ,FaArrowLeft } from "react-icons/fa";
import LinearProgress from '@material-ui/core/LinearProgress';

const Container = styled.div`
    width : 30%;
    @media (max-width: 1200px) {
        width : 35%;
    }
    @media (max-width: 1020px) {
        width : 40%;
    }
    @media (max-width: 900px) {
        width: 45%;
    }
    @media (max-width: 800px) {
        width : 50%;
    }
    @media (max-width: 700px) {
        width : 55%;
    }
    @media (max-width: 600px) {
        width : 60%;
    }
    @media (max-width: 500px) {
        width : 65%;
    }
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
    border : 2px solid #AEAFE8;
    border-radius : 6px;
    padding : .5rem 1rem;
    display : block;
    font-size : 1.2rem;
    color : #000;
    cursor : pointer;
    position : absolute;
    top: -21px;
    right: ${props=> props.left ? "" : "25px"};
    left: ${props=> props.left ? "25px" : ""};
    box-shadow: 8px 8px 12px 4px rgba(124,121,130,.3);
`

const Footer = styled.div`
    height : 55px;
    background-color : #BEB9C5;
    position : relative;
    width : 100%;
`

const Choose = styled.div`
    cursor : pointer;
    color : #1A181A;
    font-weight : ${ props => props.selected ? "700" : "500" };
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
    const [previous ,setPrevious] = useState(false);
    const loginForm = useRef(null);
    const RegisterForm = useRef(null);
    const preBtn = useRef(null);
    const [progress , setProgress] = useState(false);
    const [completed, setCompleted] = React.useState(0);

    React.useEffect(() => {
      function progress() {
        setCompleted(oldCompleted => {
          if (oldCompleted === 100) {
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldCompleted + diff, 100);
        });
      }
  
      const timer = setInterval(progress, 500);
      return () => {
        clearInterval(timer);
      };
    }, []);

    const getPreviouspage = () => {
        preBtn.current.click();
    } 
    
    const onButtonClicked = () => {
        if (login){
            loginForm.current.dispatchEvent(new Event("submit"));
            setProgress(true);
        }else  {
            RegisterForm.current.dispatchEvent(new Event("submit"));
        }
    };

    return (
        <Container className="animated slideInDown">
        {progress &&
            <LinearProgress variant="determinate" value={completed} className="progresser"/>
        }      
        <Wrapper>
            <Header>
                <Nav>
                    <Choose 
                    selected={login} 
                    onClick={() => { setLogin(true); setPrevious(false)} }> Sign In <div className="line"></div>
                     </Choose>
                    <Choose selected={!login} onClick={() => setLogin(false)}> Sign Up <div className="line"></div>   </Choose>
                </Nav>
            </Header>
            {login && <Login formRef={loginForm} setProgress={setProgress}/>}
            {!login && <Register setProgress={setProgress} formRef={RegisterForm} preBtn={preBtn} setPrevious={setPrevious} />}
        </Wrapper>
        <Footer >
            {previous && 
            <Button left onClick={getPreviouspage}>
                <FaArrowLeft style={{color : "#fff"}}/>
            </Button>
            }        
            <Button onClick={onButtonClicked}>
                <FaArrowRight style={{color : "#fff"}}/>
            </Button>
        </Footer>
        </Container>
    )
}