import React, { useState, forwardRef, useImperativeHandle, Ref } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingModalProps {
  setOpen: (open: boolean) => void;
}

const LoadingModal = forwardRef((props: LoadingModalProps, ref: Ref<{ setOpen: (open: boolean) => void }>) => {
    useImperativeHandle(ref, () => {
        return {
            setOpen: setOpen,
        }
    })
    const [open, setOpen] = useState(false)

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 99999 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
})

export default LoadingModal;