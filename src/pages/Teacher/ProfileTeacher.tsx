import { Avatar, Button, Divider, Typography, TextField, Box } from '@mui/material'
import React, { useState } from 'react'
import * as yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import { ImageViewAlert, successAlert, waringAlert } from '../../utils/SweetAlert'
import axios from 'axios';
import { UserModel } from '../../types/userModel';
import { setUser } from '../../stores/slice/user.slice';
type PasswordModel = {
    old_pass: string,
    new_pass: string,
    new_pass2: string
}

const initialPasswordForm = {
    old_pass: "",
    new_pass: "",
    new_pass2: ""
};

const passwordSchema = yup.object().shape({
    old_pass: yup.string().required("กรุณากรอกรหัสผ่านเดิม"),
    new_pass: yup.string().required("กรุณากรอกรหัสผ่านใหม่"),
    new_pass2: yup.string().required("กรุณากรอกยืนยันรหัสผ่านใหม่"),
});
function ProfileTeacher() {
    const userImage = useSelector((state: RootState) => state.userReducer.image)
    const userStore = useSelector((state: RootState) => state.userReducer)
    const userDispatch = useDispatch()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('');
    const [userProfile, setUserProfile] = useState<any>({
        nameTH: userStore.nameTH,
        nameEN: userStore.nameEN,
    })



    const handleFileChange = (e: any) => {
        if (e?.target?.files && e?.target?.files[0]) {
            const selectedImage = e.target.files[0];
            setImageFile(selectedImage);
            const imageUrl = URL.createObjectURL(selectedImage);
            setImagePreview(imageUrl);
        }
    };
    const clearImageFile = () => {
        setImageFile(null)
        setImagePreview('')
    }

    const updateProfile = async () => {
        try {
            let formData = new FormData
            if (imageFile) {
                formData.append('file', imageFile)
            }
            const response = await axios.post('/user/update-profile', formData)
            if (response && response.status === 200) {
                successAlert('อัปเดตโปรไฟล์สำเร็จ').then(() => {
                    setImageFile(null)
                    setImagePreview('')
                    userDispatch(setUser(response.data as UserModel))
                    window.location.reload()
                })
            }
        } catch (error) {

        }
    }

    const onSubmitPassword = async (values: PasswordModel) => {
        try {
            if (values.new_pass !== values.new_pass2) {
                return waringAlert('รหัสผ่านใหม่ไม่เหมือนกัน')
            }
            if (values.old_pass === values.new_pass || values.old_pass === values.new_pass2) {
                return waringAlert('รหัสผ่านใหม่และรหัสผ่านเดิมซ้ำกัน')
            }

            const response = await axios.post('/user/change-password', {
                oldPassword: values.old_pass,
                newPassword: values.new_pass
            })
            if (response && response.status === 200) {
                successAlert(response.data.message as string).then(() => {
                    window.location.reload()
                })
            }
        } catch (error) {

        }


    }
    return (
        <div className='flex flex-col items-center gap-2 px-2 w-full'>
            <div className='w-full grid grid-cols-1 lg:grid-cols-2'>
                <div className='flex flex-col gap-3 items-center w-full px-3'>
                    <h2 className='text-secondary'>ข้อมูลส่วนตัว</h2>
                    <div className='flex flex-col items-center gap-5'>
                        {(!!!imagePreview && !!!imageFile && !!userImage) && (
                            <img src={`${import.meta.env.VITE_API_ENDPOINT}/${userImage}`} className='w-40 h-40 rounded-full border-solid border-secondary border-4 object-cover cursor-pointer' onClick={() => ImageViewAlert(`${import.meta.env.VITE_API_ENDPOINT}/${userImage}`)}></img>
                        )}
                        {(!!imagePreview && !!imageFile) && (
                            <label htmlFor="upload-image">
                                <img src={imagePreview} className='w-40 h-40 rounded-full border-solid border-secondary border-4 object-cover'></img>
                                <input type="file" id="upload-image" onChange={handleFileChange} className='hidden' />
                            </label>
                        )}
                        {(!!!imagePreview && !!!imageFile && !!!userImage) && <Avatar className='w-40 h-40 bg-secondary'><Typography variant='h4'>WS</Typography></Avatar>}
                        {(!!!imagePreview && !!!imageFile) && (
                            <div>
                                <label htmlFor="upload-image" className='cursor-pointer p-2 bg-blue-500 rounded text-white hover:bg-blue-700 duration-300'>
                                    อัปโหลดรูปโปรไฟล์
                                </label>
                                <input type="file" id="upload-image" onChange={handleFileChange} className='hidden' />
                            </div>
                        )}
                        {(!!imagePreview && !!imageFile) && (
                            <div className='flex justify-center items-center gap-2'>
                                <Button variant='contained' color='success' onClick={updateProfile} >บันทึก</Button>
                                <Button variant='contained' color='inherit' onClick={clearImageFile}>ยกเลิก</Button>
                            </div>
                        )}
                    </div>
                    <form className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full my-3'>
                        <TextField
                            variant="outlined"
                            type={"text"}
                            label="ชื่อภาษาไทย"
                            value={userProfile.nameTH}
                            disabled
                        ></TextField>
                        <TextField
                            variant="outlined"
                            type={"text"}
                            label="ชื่อภาษาอังกฤษ"
                            value={userProfile.nameEN}
                            disabled
                        ></TextField>
                    </form>
                </div>
                <div className='w-full flex flex-col gap-3 items-center px-3'>
                    <h2 className='text-secondary'>แก้ไขรหัสผ่าน</h2>
                    <Formik
                        onSubmit={onSubmitPassword}
                        initialValues={initialPasswordForm}
                        validationSchema={passwordSchema}
                        enableReinitialize
                    >
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
                            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                                <Box
                                    display={"flex"}
                                    flexDirection="column"
                                    gap={"1rem"}
                                    sx={{ width: "100%", }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type={"password"}
                                        label="รหัสผ่านเดิม"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.old_pass}
                                        name="old_pass"
                                        error={!!touched.old_pass && !!errors.old_pass}
                                        helperText={touched.old_pass && errors.old_pass}
                                    ></TextField>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type={"password"}
                                        label="รหัสผ่านใหม่"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.new_pass}
                                        name="new_pass"
                                        error={!!touched.new_pass && !!errors.new_pass}
                                        helperText={touched.new_pass && errors.new_pass}
                                    ></TextField>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type={"password"}
                                        label="ยืนยันรหัสผ่านใหม่"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.new_pass2}
                                        name="new_pass2"
                                        error={!!touched.new_pass2 && !!errors.new_pass2}
                                        helperText={touched.new_pass2 && errors.new_pass2}
                                    ></TextField>
                                    <Button type="submit" color="primary" variant="contained" disabled={(!isValid || !dirty)}>
                                        แก้ไขรหัสผ่าน
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>



        </div>
    )
}

export default ProfileTeacher