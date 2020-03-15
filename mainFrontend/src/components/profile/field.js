import React ,{useState} from "react";
import styled from "styled-components";
import { FaPencilAlt, FaTimes, FaCheck } from "react-icons/fa";

const Field = styled.div`
    width : 100%;
    display : flex;
    justify-content : space-between;
    font-size  : 1.5 rem;
    padding : 1rem 0;
    position : relative;
`

const Label = styled.div`
    font-size : 1.2rem;
    width : 100%;
    flex : .5;
    text-align : center;
    padding : .5rem 1rem;
`

const Value = styled.div`
    font-size : 1.2rem;
    width : 100%;
    flex : 1.5;
    text-align : center;
    padding : .5rem 1rem;
`

const Modifier = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 5px;
    font-size : 1rem;
    color : #4F98CA;
    cursor : pointer;
`
const Closer = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 5px;
    font-size : 1rem;
    color : #4F98CA;
    cursor : pointer;
`

const Check = styled.div`
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 30px;
    font-size : 1rem;
    color : #4F98CA;
    cursor : pointer;

`

const Input = styled.input`
    width : 100%;
    flex : 1.5;
    font-size : 1.2rem;
    text-align : center;
    border : 1px solid  #dedef9;
    border-radius : 10px;
    background-color :  transparent;
    color : #000;
    padding : .5rem 1rem;
    &:focus {
        outline : none;
    }
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