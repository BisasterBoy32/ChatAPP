import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const Container = styled.div`
    border: 1px solid #dedef9;
    border-radius: 4px;
    padding: .7rem 1rem;
    width: 97%;
    display : flex;
    cursor : pointer;
    &:hover {
        background-color : rgb(174, 216, 219);
    }
    position : relative;
    margin : 10px 0;
    box-shadow: 3px 4px 9px #dedef9;
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: .9rem;
    font-weight: 700;
`
const ProfileImage = styled.div`
    width : 50px;
    height : 50px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    position : relative;
`


const source = {
    // this function defines the item (object that is transfered whene 
    // dropping the component on the target) 
    beginDrag(props) {
        const { friend } = props;
        return ({
            friend
        });
    },
    // this function executed while the element is dropped
    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }
        const { onDrop } = props;
        const { friend } = monitor.getItem();
        // this function is defined in  the parent
        // it executes whene the element is droped on the target
        onDrop(friend);
    },
};

// this should be on the Source(Draggable element)
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

const Friend = ({ friend, connectDragSource ,isDragging}) => {
    return connectDragSource(
        <div>
            <Container style={{
                opacity: isDragging ? 0.25 : 1,
            }}>
                <ProfileImage image={friend.icon} />
                <Username > {friend.username} </Username>
            </Container>
        </div>
    )
};

// Export the wrapped version
export default DragSource("MEMBER", source, collect)(Friend)

