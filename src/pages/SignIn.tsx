import { Box, Button, Typography, TextField } from '@mui/material'
import React from 'react'
import * as yup from "yup";
import { Formik } from "formik";
import BackgroundSignIn from '../assets/sign-in-bg.jpg'
import { LoginUserModel } from '../types/LoginUserModel';
import { successAlert, waringAlert } from '../utils/SweetAlert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores/store';
import { setUser } from '../stores/slice/user.slice';
import { UserModel } from '../types/userModel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const loginSchema = yup.object().shape({
  studentCode: yup.string().required("กรุณากรอกรหัสนักศึกษา"),
  password: yup.string().required("กรุณากรอกรหัสผ่าน"),
})

function SignIn() {
  const initialLoginForm = new LoginUserModel()
  const navigate = useNavigate()
  const user: UserModel = useSelector((state: RootState) => state.userReducer)
  const userDispatch = useDispatch()

  async function onSubmitLogin(value: LoginUserModel) {
    axios.post('/user/login', value).then((res) => {
      if (res) {
        if (res.status == 200) {
          successAlert('เข้าสู่ระบบสำเร็จ').then(() => {
            const token = res.data.access_token as string
            localStorage.setItem('access-token', token)
            const userProfile = res.data.profile as UserModel
            userDispatch(setUser(userProfile))
            navigate( user.role === 'STUDENT' ? '/' : '/teacher')
          })
        }
      }
    })
  }

  return (
    <div className='flex min-h-screen max-h-[100vh] overflow-hidden'>
      <div className='w-[50%] h-[100vh] hidden lg:block'>
        <img src={BackgroundSignIn} className='object-cover' width={'100%'} height={'100%'} />
      </div>
      <div className='w-full lg:w-[50%] min-w-[320px] flex flex-col gap-2 justify-center items-center bg-slate-100 px-3'>
        <Typography variant='h5' className='font-bold' >เข้าสู่ระบบ</Typography>
        <Typography variant='h6' className='font-bold hidden md:block' >รายวิชา Fundamental of Computer Engineering</Typography>
        <Typography variant='body2' className='font-bold md:hidden' >Fundamental of Computer Engineering</Typography>
        <Formik
          onSubmit={onSubmitLogin}
          initialValues={initialLoginForm}
          validationSchema={loginSchema}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className='w-[320px]'>
              <Box
                display={"flex"}
                flexDirection="column"
                gap={"1rem"}
              >
                <TextField
                  variant="outlined"
                  type={"text"}
                  label="ชื่อผู้ใช้งาน"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.studentCode}
                  name="studentCode"
                  error={!!touched.studentCode && !!errors.studentCode}
                  helperText={touched.studentCode && errors.studentCode}
                ></TextField>
                <TextField
                  variant="outlined"
                  type={"password"}
                  label="รหัสผ่าน"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                ></TextField>
                <Button type="submit" color="primary" variant="contained">
                  เข้าสู่ระบบ
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SignIn