import React from 'react';
import Button from '@material-ui/core/Button';
import Model from "./group_model";

export default function TransitionsModal() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Create Group
            </Button>
            <Model setOpen={setOpen} open={open} handleClose={handleClose}/>
        </div>
    );
}