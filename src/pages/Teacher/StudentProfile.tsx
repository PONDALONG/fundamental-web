import { TextField, Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip, Switch } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StudentModel } from '../../types/StudentModel';
import axios from 'axios';
import { ensureRemove, successAlert } from '../../utils/SweetAlert';

function StudentProfile() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const params = {
        group: searchParams.get('group') || null,
        year: searchParams.get('year') || null,
        term: searchParams.get('term') || null,
    }
    const [userProfile, setUserProfile] = useState<StudentModel>(new StudentModel())
    const [userStatus, setUserStatus] = useState<boolean>(false)
    useEffect(() => {
        if (!!id) {
            findById()
        }
    }, [])

    const findById = async () => {
        try {
            const response = await axios.get(`/student/find?userId=${id}`)
            if (response && response.status === 200) {
                setUserProfile(response.data as StudentModel)
                setUserStatus((response.data as StudentModel).user.userStatus.toUpperCase() === 'ACTIVE' )
            }
        } catch (error) {

        }
    }

    const onBackPageClick = () => {
        navigate(`/teacher/student?group=${params.group}&year=${params.year}&term=${params.term}`)
    }

    const onResetPasswordClick = async () => {
        try {
            ensureRemove('ต้องการรีเซ็ตรหัสผ่านนักศึกษาใช่หรือไม่?').then(async (res) => {
                if (res.isConfirmed) {
                    const response = await axios.post(`/user/reset-password`, {
                        userId: id
                    })
                    if (response && response.status === 200) {
                        successAlert(response.data.message as string)
                    }
                }
            })
        } catch (error) {

        }
    }

    const onUpdateStatusClick = async() => {
        try {
            const response = await axios.post('/user/update-status', {
                userId: id,
                userStatus: userStatus === true ? 'ACTIVE' : 'INACTIVE'
            }) 
            if (response && response.status === 200) {
                successAlert('อัปเดตสถานะสำเร็จ').then(() => {
                    findById()
                })
            }
        } catch (error) {
            
        }
    }

    return (
        <div className='flex flex-col gap-2 px-2'>
            <div className='flex gap-2 items-center'>
                <h2 className='text-secondary cursor-pointer hover:text-primary duration-200' onClick={onBackPageClick} >รายชื่อนักศึกษา</h2>
                <h2 className='hidden md:block text-secondary'>{'>'}</h2>
                <h2 className='hidden md:block text-secondary'>{userProfile.user.studentNo}</h2>
            </div>
            <div className='w-full flex flex-col items-center gap-2'>
                {!!!userProfile.user.image && <Avatar className='bg-secondary w-40 h-40'><Typography variant='inherit' noWrap>{userProfile.user.studentNo}</Typography></Avatar>}
                {!!userProfile.user.image && <img src={`${import.meta.env.VITE_API_ENDPOINT}/${userProfile.user.image}`} className='w-40 h-40 rounded-full border-solid border-secondary border-4 object-cover'></img>}
                <span>ข้อมูลส่วนตัว</span>
                <form className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full my-3'>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="ชื่อไทย"
                        value={userProfile.user.nameTH}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="ชื่ออังกฤษ"
                        value={userProfile.user.nameEN}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="รหัสนักศึกษา"
                        value={userProfile.user.studentNo}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="กลุ่มเรียน"
                        value={userProfile.room.roomGroup}
                        disabled
                    ></TextField>
                    <div className='w-full'>
                        <span className='hidden lg:block mr-2'>สถานะผู้ใช้งาน: </span>
                        <span className='font-bold text-red-500'>INACTIVE</span>
                        <Switch color='success' checked={userStatus} onChange={() => setUserStatus(!userStatus)} />
                        <span className='font-bold text-green-500'>ACTIVE</span>
                    </div>
                    <div className='w-full flex items-center gap-2'>
                        <Button color='success' variant='contained' type='button' onClick={onUpdateStatusClick}>บันทึก</Button>
                        <Button color='info' variant='contained' type='button' onClick={onResetPasswordClick} >รีเซ็ตรหัสผ่าน</Button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default StudentProfile