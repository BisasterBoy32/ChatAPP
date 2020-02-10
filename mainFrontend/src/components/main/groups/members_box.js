import React from "react";
import styled from "styled-components";
import { DropTarget } from 'react-dnd';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const Friendsbox = styled.div`
    padding : .5rem;
    overflow-y : scroll;
    height : 180px;
    margin-bottom : 10px;
    background-color : ${props => props.highlighted ? "gray" : ""};
    border : ${props => props.highlighted ? " 1px dashed black;" : " 1px solid black"};
`

// this should be on the target
const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    highlighted: monitor.canDrop(),
});

// when you have multiple targets
const target = {
  drop(props) {
    const { shape } = props;
    return ({
      shape,
    });
  }
}

const MembersBox = ({ groupMembers, setGroupMembers, connectDropTarget, highlighted}) => {

    const handleDelete = (targetId) => {
        // find this member and delete it
        const newMembers = groupMembers
        const targetIndex = groupMembers.findIndex(member => member.id === targetId);
        newMembers.splice(targetIndex, 1);
        setGroupMembers([...newMembers]);
    };

    return connectDropTarget(
        <div>
            <Friendsbox highlighted={highlighted} >
                {groupMembers.length === 0 ? "Drage and Drop the members here" : ""}
                {groupMembers.map(member => (
                    <Chip
                        key = {member.id}
                        avatar={<Avatar alt="friend" src={member.icon} />}
                        label={member.username}
                        onDelete={() => handleDelete(member.id)}
                        variant="outlined"
                        style={{ margin : "5px"}}
                        color="primary"
                    />
                ))}
            </Friendsbox>
        </div>
    )
}

export default DropTarget("MEMBER", target, collect)(MembersBox);