import React , { 
    useContext,
    useEffect ,
    useRef
} from "react";
import { UserContext } from "../../store/context"
import styled from "styled-components";
import axios from "axios";
import { setConfig } from "../../helpers";
import ProfileInfo from "./information"

const Container = styled.div`
    position : absolute;
    top : 60px;
    left : ${props => props.show ? "0px" : "-280px"};
    bottom : 0px;
    width : 300px;
    background-color : #4F98CA;
    transition : left 300ms ease-in-out;
    box-shadow : 8px 4px 10px rgb(137, 164, 187);
    border-radius : 4px;
`

const Humberger = styled.div`
    position : absolute;
    top : 3px;
    right : 3px;
    cursor : pointer;
`

const HumbergerBTN = styled.button`
    padding : 0px 1px;
`

const Logout = styled.button`
    position: absolute;
    bottom: 15px;
    left: 15px;
    cursor: pointer;
    padding: .4rem .8rem;
    border: 1px solid rgb(235,64,64);
    background-color : rgb(235, 64, 64);
    border-radius: 3px;
    color : #fff;
    transition : transform 300ms ease-in-out;
    &:hover {
        transform : scale(1.2);
    }
`

function closeProfile(ref ,setShow) {

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}

export default ({show ,setShow}) => {
    const userContext = useContext(UserContext);
    const wrapperRef = useRef(null);
    closeProfile(wrapperRef ,setShow)

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
        <Container ref={wrapperRef} show={show}>
                <Humberger onClick={(e) => {setShow(!show)}}>
                    <HumbergerBTN 
                    className={show ? "hamburger hamburger--stand is-active" : "hamburger hamburger--stand"}
                    type="button"
                    >
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span>
                        </span>
                    </HumbergerBTN>
                </Humberger>
                {show && <ProfileInfo />}
                <Logout onClick={logout}> Logout </Logout>
        </Container>
    )
}