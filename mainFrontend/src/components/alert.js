import React ,{useContext ,useEffect} from "react";
import { AlerContext } from "../store/context";
import styled from "styled-components";

const Container = styled.div`
    position : absolute;
    top : 100px;
    right : 50%;
    transform : translateX(50%);
    border : 1px solid ${props => props.success ? "rgb(56, 165, 13);" : "rgb(211, 35, 22);" }
    background-color :  ${props => props.success ? "rgb(152, 240, 80);" : "rgb(240, 91, 80);" }
    border-radius : 3px;
    color : #000;
    opacity : .8;
`
const Content = styled.div`
    font-size : .8rem;
    padding :  .4rem 1rem;
`

export default () => {
    const {state ,dispatch} = useContext(AlerContext);
    useEffect(() => {
        setTimeout(() => {
            dispatch({ type: "CLOSE_ALERT" })
        }, 4000)
    }, [state.msg]);
        if ( state.msg ){
            return (
                <Container success={state.type === "success"}>
                    <Content> {state.msg} </Content>
                </Container>
            )
        }
        return null;
}