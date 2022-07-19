import React from "react";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import PanToolIcon from '@mui/icons-material/PanTool';
import { blue } from '@mui/material/colors';

export default function HandsDialog(props){
    const { onClose, users, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Raised hands</DialogTitle>
            <List sx={{ pt: 0 }}>
                {users.map((user) => (
                    <ListItem key={user.id}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PanToolIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}