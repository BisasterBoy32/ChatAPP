import React,{ useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styled from "styled-components";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { UserContext } from "../../../store/context";

const Title = styled.legend`
    font-size : 1.3rem;
    text-align : center;
    padding-bottom : .8rem;
    margin-bottom : 1rem;
    border-bottom : 2px solid #ccc;
`

const Container = styled.div`
    width : 250px;
    height : 400px;
`

const MembersTag = styled.div`
    font-size : 1.3rem;
    text-align : center;
    padding-bottom : .8rem;
    margin-bottom : 1rem;
    border-bottom : 2px solid #ccc;
`

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: "1rem 0 1rem 1rem"
    },
}));

export default ({ open, handleClose, name, type, members }) => {
    const classes = useStyles();
    const userContext = useContext(UserContext);
    const { user } = userContext.state

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <Container>
                        <Title> {name}({type}) </Title>
                        <MembersTag>members ({members.length})</MembersTag>
                        {
                            members.map(member => (
                                <Chip
                                    key={member.username}
                                    avatar={<Avatar alt="friend" src={member.icon} />}
                                    label={member.username}
                                    variant="outlined"
                                />
                            ))  
                        }
                        <Chip
                            avatar={<Avatar alt="friend" src={user.profile.icon} />}
                            label={user.username}
                            variant="outlined"
                        />
                    </Container>
                </div>
            </Fade>
        </Modal>
    )
}