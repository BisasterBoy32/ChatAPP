import React from "react";
import styled from "styled-components";
import { FaUser, FaUsers, FaUserPlus, FaChalkboardTeacher } from "react-icons/fa";

const Container = styled.div`
    margin-top : 2rem;
    display: flex;
    flex-direction: column;
`;

const Choose = styled.div`
    cursor : pointer; 
    display : flex;
    width : 200px;
    margin-right: auto;
    padding : 1rem 0 1rem 2rem;
    font-size : 1.2rem;
    color : ${props => props.selected ? "#298bf0;" : "#AEAFE8"};
    border-left : ${props => props.selected ? "3px solid #298bf0;" : ""};
    &:hover {
        border-left : 3px solid #298bf0;
        color : #298bf0;
    }
`;

export default ({ selected, setSelected }) => {


    return (
        <Container>
            <Choose selected={selected==="profile"} onClick={e => setSelected("profile")}>
                <FaUser style={{ marginRight : "1rem"}} /> Profile 
            </Choose>
            <Choose selected={selected === "friends"} onClick={e => setSelected("friends")}>
                <FaUserPlus style={{ marginRight: "1rem" }} /> Friends 
            </Choose>
            <Choose selected={selected === "users"} onClick={e => setSelected("users")}>
                <FaUsers style={{ marginRight: "1rem" }} /> Users 
            </Choose>
            <Choose selected={selected === "group"} onClick={e => setSelected("group")}>
                <FaChalkboardTeacher style={{ marginRight: "1rem" }} /> Create Group 
            </Choose>
        </Container>
    )
}