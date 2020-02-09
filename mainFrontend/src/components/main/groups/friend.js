import React from "react";
import styled from "styled-components";
import { DragSource } from 'react-dnd'

const Container = styled.div`
    padding : .3rem;
    display : flex;
    cursor : pointer;
    &:hover {
        background-color : rgb(174, 216, 219);
    }
    position : relative;
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: .8rem;
`
const ProfileImage = styled.div`
    width : 30px;
    height : 30px;
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

