import React , { useContext ,useState } from "react";
import styled from "styled-components";
import { UserContext } from "../../store/context";
import { FaPencilAlt ,FaTimes } from "react-icons/fa"

const Container = styled.div`
    text-align : center;
`

const ProfileImage = styled.div`
    width : 170px;
    height : 170px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    margin: auto;
    background-size: contain;
    margin-top : 2rem;
    border : 1px solid #fff;
`
const Username = styled.div`
    text-align : center;
    margin-top : 1rem;
    margin-bottom : 2rem;
    font-size : 1.5rem;
`

const Field = styled.div`
    width : 100%;
    border-top : 2px solid #fff;
    display : flex;
    justify-content : space-between;
    font-size  : 1.5 rem;
    padding : 1rem 0;
    position : relative;
`

const Label = styled.div`
    width : 100%;
    flex : .5;
    text-align : center;
`

const Value = styled.div`
    width : 100%;
    flex : 1.5;
    text-align : center;
`

const Modifier = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 5px;
    font-size : .8rem;
    color : #fff;
    cursor : pointer;
    &:hover {
        color : #19E246;
    }
`
const Closer = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 5px;
    font-size : .8rem;
    color : #fff;
    cursor : pointer;
    &:hover {
        color : red;
    }
`
const Input = styled.input`
    width : 100%;
    flex : 1.5;
    text-align : center;
    border : 1px solid  #4F98CA;
    background-color :  #4F98CA;
    color : #000;
`

const FieldComp = ({ value , label}) => {
    const [modify , setModify] = useState(false);

    return (
        <Field> 
            <Label> {label} </Label>
            {!modify &&
                <>
                <Value> {value} </Value>
                <Modifier onClick={() => setModify(true)}> <FaPencilAlt /> </Modifier>
                </>
            }
            {modify &&
                <>
                <Input type="text" value={value} />
                <Closer onClick={() => setModify(false)}> <FaTimes /> </Closer>
                </>
            }
        </Field>
    )
}

export default () => {
    const userContext = useContext(UserContext);
    const { user } = userContext.state;
    const getAge = () => {
        const currentYear = new Date().getFullYear();
        const userBornYear = new Date(user.profile.born_date).getFullYear();
        const userAge = currentYear - userBornYear;

        return userAge;
    }

    return (
        <div>
            <ProfileImage image={user.profile.icon}/>
            <Username>{user.username}</Username>
            <FieldComp value={user.email} label="Email" />
            <FieldComp value={user.first_name} label="Name" />
            <FieldComp value={getAge()} label="Age" />
            <FieldComp value={user.username} label="Username" />
        </div>
    )
}