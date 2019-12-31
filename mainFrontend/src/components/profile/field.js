import React ,{useState} from "react";
import styled from "styled-components";
import { FaPencilAlt, FaTimes, FaCheck } from "react-icons/fa";

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

export default ({ value, initValue, label, onInputChange, unChangeble, update }) => {
    const [modify, setModify] = useState(false);
    const [check, setCheck] = useState(true);

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
                        onClick={() => {
                            onInputChange(initValue);
                            setModify(false);
                        }}> <FaTimes />
                    </Closer>
                    {check &&
                        <Check onClick={() => { update(setModify, setCheck) }}> <FaCheck /></Check>
                    }
                    {!check && <div className="lds-hourglass"></div>}
                </>
            }
        </Field>
    )
}