import React, { useState } from 'react'
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

const sectionSchema = yup.object().shape({
    name: yup.string().required("กรุณากรอกชื่อกลุ่มเรียน"),
    year: yup.string().required("กรุณากรอกปีการศึกษา"),
    term: yup.number().required('กรุณาเลือกภาคเรียน')
});

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    sectionId: number | null
}

function SectionModal({ open, handleDialogClose, sectionId = null }: dialogInput) {
    const [sectionForm, setSectionForm] = useState({
        name: "",
        year: dayjs(new Date()).locale('th').add(543, 'year').get('year').toString(),
        term: 1
    })

    const closeModal = () => {
        handleDialogClose()
    }

    const onSubmitSectionForm = (value: any) => {
        console.log(value);

    }
    return (
        <Dialog open={open} onClose={closeModal} fullWidth >
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
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ปีการศึกษา"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.year}
                                    name="year"
                                    error={!!touched.year && !!errors.year}
                                    helperText={touched.year && errors.year}
                                ></TextField>
                                <div className='flex gap-2 items-center w-full'>
                                    <span className='w-[100px]'>ภาคเรียน</span>
                                    <FormControl variant='standard' fullWidth>
                                        <Select
                                            label={'ภาคเรียน'}
                                            defaultValue={1}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.term}
                                            name="term"
                                            error={!!touched.term && !!errors.term}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                    <Button type="submit" color="success" variant="contained" disabled={!isValid || !dirty}>
                                        บันทัก
                                    </Button>
                                    <Button color="inherit" variant="contained" onClick={closeModal}>
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