import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AppUpdateDialogProps {
    onLater: () => void;
    onDownload: () => void;
}

export default function AppUpdateDialog({onLater, onDownload}: AppUpdateDialogProps) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    const handleLater = () => {
        handleClose();
        onLater();
    }

    const handleDownload = () => {
        handleClose();
        onDownload();
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"New Version Available"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A new app update is available. Download now to enjoy our new features.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Later</Button>
                    <Button onClick={handleClose} autoFocus>
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
