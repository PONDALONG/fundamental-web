import React, { useState, useEffect} from 'react'
import { TextField, Button, Box, MenuItem, Select, FormControl } from "@mui/material"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as yup from "yup";
import { Formik } from "formik";
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { RoomModel } from '../types/RoomModel';
import axios from 'axios';
import { successAlert } from '../utils/SweetAlert';

const sectionSchema = yup.object().shape({
    roomGroup: yup.string().required("กรุณากรอกชื่อกลุ่มเรียน"),
    roomYear: yup.string().required("กรุณากรอกปีการศึกษา"),
    roomTerm: yup.number().required('กรุณาเลือกภาคเรียน'),
    roomStatus: yup.string().required('กรุณาเลือกสถานะ')
});

type dialogInput = {
    open: boolean,
    handleDialogClose: (success: boolean) => void,
    sectionId: number | null
}

function SectionModal({ open, handleDialogClose, sectionId = null }: dialogInput) {
    const [sectionForm, setSectionForm] = useState<RoomModel>(new RoomModel())

    useEffect(() => {
        if (sectionId) {
            findById()
        }
    }, [])

    const findById = () => {
        axios.get(`room/find?roomId=${sectionId}`).then((res) => {
            if (res && res.status === 200) {
                setSectionForm(res.data)
            }
        } )
    }

    const closeModal = (success: boolean) => {
        handleDialogClose(success)
    }

    const onSubmitSectionForm = (value: RoomModel) => {
        if (!sectionId) {
            createSection(value)
        } else {
            updateSection(value)
        }
    }

    const createSection = (value: RoomModel) => {
        axios.post('/room/create', value).then((res) => {
            if (res && res.status === 200) {
                successAlert(res.data.message).then(() => {
                    closeModal(true)
                })
            }
        })
    }

    const updateSection = (value: RoomModel) => {
        let updateBody:RoomModel = value
        updateBody.roomId = sectionId as number
        axios.post('/room/update', updateBody).then((res) => {
            if (res && res.status === 200) {
                successAlert(res.data.message).then(() => {
                    closeModal(true)
                })
            }
        })
    }
    return (
        <Dialog open={open} onClose={() => closeModal(false)} fullWidth >
            {sectionId && <DialogTitle>{"แก้ไขกลุ่มเรียน"}</DialogTitle>}
            {!sectionId && <DialogTitle>{"เพิ่มกลุ่มเรียน"}</DialogTitle>}
            <DialogContent>
                <Formik
                    onSubmit={onSubmitSectionForm}
                    initialValues={sectionForm}
                    validationSchema={sectionSchema}
                    enableReinitialize>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isValid,
                        dirty
                    }) => (
                        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
                            <Box
                                display={"flex"}
                                flexDirection="column"
                                gap={"1rem"}
                                sx={{ width: "100%", }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อกลุ่มเรียน"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.roomGroup}
                                    name="roomGroup"
                                    error={!!touched.roomGroup && !!errors.roomGroup}
                                    helperText={touched.roomGroup && errors.roomGroup}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ปีการศึกษา"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.roomYear}
                                    name="roomYear"
                                    error={!!touched.roomYear && !!errors.roomYear}
                                    helperText={touched.roomYear && errors.roomYear}
                                ></TextField>
                                <div className='flex gap-2 items-center w-full'>
                                    <span className='w-[100px]'>ภาคเรียน</span>
                                    <FormControl variant='standard' fullWidth>
                                        <Select
                                            label={'ภาคเรียน'}
                                            defaultValue={1}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.roomTerm}
                                            name="roomTerm"
                                            error={!!touched.roomTerm && !!errors.roomTerm}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='flex gap-2 items-center w-full'>
                                    <span className='w-[100px]'>สถานะ</span>
                                    <FormControl variant='standard' fullWidth>
                                        <Select
                                            label={'สถานะ'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.roomStatus}
                                            name="roomStatus"
                                            error={!!touched.roomStatus && !!errors.roomStatus}
                                        >
                                            <MenuItem value={'CLOSED'}>ปิดห้องเรียน</MenuItem>
                                            <MenuItem value={'OPEN'}>เปิดห้องเรียน</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                    <Button type="submit" color="success" variant="contained" disabled={!isValid || !dirty}>
                                        บันทัก
                                    </Button>
                                    <Button color="inherit" variant="contained" onClick={() => closeModal(false)}>
                                        ยกเลิก
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default SectionModal