import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GroupForm from "./group_form";
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #dedef9',
        boxShadow: theme.shadows[5],
        padding: "2rem",
        borderRadius : "10px",
        "&:focus" : {
            outline : "none"
        }
    },
}));

export default ({ setOpen, open, handleClose, update, name, type, members, groupId ,icon1}) => {
    const classes = useStyles();

    return (
        <DndProvider backend={Backend}>
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
                        {update && 
                            <GroupForm 
                                setOpen={setOpen}
                                name={name}
                                type={type}
                                members={members}
                                update = { update}
                                groupId={groupId}
                                icon1={icon1}
                            />
                        }
                        {!update && <GroupForm setOpen={setOpen} />}
                    </div>
                </Fade>
            </Modal>
        </DndProvider>
    )
}