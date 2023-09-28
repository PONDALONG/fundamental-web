import { Backdrop, CircularProgress } from '@mui/material'

export default function Loader() {
    return (
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}