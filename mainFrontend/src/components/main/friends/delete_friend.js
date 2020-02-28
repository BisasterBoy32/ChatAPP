import React,{ useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';

import { WebSocketContext } from "../../../store/context"

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
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal({open ,setOpen ,friend}) {
  const classes = useStyles();
  const websocketContext = useContext(WebSocketContext);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteFriend = (e) => {
    e.stopPropagation()
    const data = {
      command: "delete_friend",
      friend : friend.id
    }
    websocketContext.websockets[friend.id].send(JSON.stringify(data))
  }

  return (
    <div >
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
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              are you sure that you want to delete {friend.username} from your friends list
            </p>
            <Button 
            variant="contained" 
            color="primary"
            onClick={deleteFriend}
            >
            Yes
            </Button>
            <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleClose} 
            style={{ marginLeft : "5px"}}>
            cancel
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}