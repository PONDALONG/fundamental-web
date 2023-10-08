import { TextField, Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentProfile() {
    const navigate = useNavigate()
    const [userProfile, setUserProfile] = useState<any>({
        firstname: "Winai",
        lastname: "Sriburin",
        studentId: "555555555555",
        section: "ecp1n"
    })
    return (
        <div className='flex flex-col gap-2 px-2'>
            <div className='flex gap-2 items-center'>
                <h2 className='text-secondary cursor-pointer hover:text-primary duration-200' onClick={() => navigate('/teacher/student')} >รายชื่อนักศึกษา</h2>
                <h2 className='hidden md:block text-secondary'>{'>'}</h2>
                <h2 className='hidden md:block text-secondary'>61332110211-4</h2>
            </div>
            <div className='w-full flex flex-col items-center gap-2'>
                <img src={'https://us-fbcloud.net/quiz/data/51/51475.qst1.question.jpg'} className='w-40 h-40 rounded-full border-solid border-secondary border-4 object-cover'></img>
                <span>ข้อมูลส่วนตัว</span>
                <form className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full my-3'>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="ชื่อ"
                        value={userProfile.firstname}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="นามสกุล"
                        value={userProfile.lastname}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="รหัสนักศึกษา"
                        value={userProfile.studentId}
                        disabled
                    ></TextField>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="กลุ่มเรียน"
                        value={userProfile.section}
                        disabled
                    ></TextField>
                </form>
                <span>แบบฝึกหัด</span>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
                    {['', '', '', '', '', '', '', '', '',].map((m, index) => (
                        <Card key={index} className='w-full relative'>
                            <div className='absolute top-1 right-1 cursor-pointer'>
                                <Tooltip title='สถานะ: เปิดรับ' placement='top'>
                                    <div className='w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-400'>

                                    </div>
                                </Tooltip>

                            </div>
                            <CardHeader
                                title={"LAB" + (index + 1)}
                            />
                            <CardContent>
                                <div className='w-full flex flex-col'>
                                    <div className='flex gap-2 items-center'>
                                        <span>กำหนดส่ง:</span>
                                        <span>22 ธันวาคม 2566</span>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <span>ประเภทงาน:</span>
                                        <span>กลุ่ม</span>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <span>คะแนน:</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardActions className='flex flex-col sm:flex-row sm:justify-between items-end sm:items-end'>
                                <Button size="medium" variant='contained' color='warning' onClick={() => navigate(`/teacher/student-submitted/${1}`)}>ตรวจงาน</Button>
                                <Typography variant="caption" color="text.secondary">
                                    15 มกราคม 2566
                                </Typography>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentProfile