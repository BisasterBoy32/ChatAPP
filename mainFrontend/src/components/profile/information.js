import React , { useContext ,useState } from "react";
import styled from "styled-components";
import { UserContext } from "../../store/context";
import { FaPencilAlt ,FaTimes ,FaCheck } from "react-icons/fa";
import axios from "axios";
import { setConfig } from "../../helpers";

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

const Check = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 20px;
    font-size : .8rem;
    color : #fff;
    cursor : pointer;
    &:hover {
        color : #19E246;
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

const FieldComp = ({ value, initValue, label, onInputChange, unChangeble, update}) => {
    const [modify , setModify] = useState(false);

    return (
        <Field> 
            <Label> {label} </Label>
            {!modify &&
                <>
                <Value> {value} </Value>
                {!unChangeble && <Modifier onClick={() => setModify(true)}> <FaPencilAlt /> </Modifier>}
                </>
            }
            {modify &&
                <>
                <Input type="text" value={value} onChange={(e) => onInputChange(e.target.value)} />
                <Closer 
                    onClick={() =>{
                        onInputChange(initValue);
                        setModify(false);
                    } }> <FaTimes />
                </Closer>
                <Check onClick={update}>
                    <FaCheck />
                </Check>
                </>
            }
        </Field>
    )
}

export default () => {
    const userContext = useContext(UserContext);
    const { user } = userContext.state;
    const [username , setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.first_name);

    const getAge = () => {
        const currentYear = new Date().getFullYear();
        const userBornYear = new Date(user.profile.born_date).getFullYear();
        const userAge = currentYear - userBornYear;

        return userAge;
    }

    // update user information
    const onUpdate = () => {
        const values = {
            username,
            email,
            first_name: firstName,
            profile : {
                icon : user.profile.icon,
                user : user.profile.user
            }
        }

        const config = setConfig(userContext.state.token)
        axios.post("/accounts/update/" ,values , config)
        .then( 
            res => userContext.dispatch({action : "UPDATE_USER" , payload : res }),
            err => console.log(err)
        );
    }

    return (
        <div>
            <ProfileImage image={user.profile.icon}/>
            <Username>{user.username}</Username>
            <FieldComp value={email} onInputChange={setEmail} initValue={user.email} update={onUpdate} label="Email" />
            <FieldComp value={firstName} onInputChange={setFirstName} initValue={user.first_name} update={onUpdate} label="Name" />
            <FieldComp value={getAge()} label="Age" unChangeble/>
            <FieldComp value={username} onInputChange={setUsername} initValue={user.username} update={onUpdate} label="Username" />
        </div>
    )
}