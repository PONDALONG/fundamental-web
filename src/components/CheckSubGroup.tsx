import React, { useState, useEffect } from 'react'
import { Button, IconButton, Switch, TextField, Tooltip, Typography, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { SubmittedAssignmentGroupModel } from '../types/StudentAssignmentModel'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { successAlert, waringAlert } from '../utils/SweetAlert';
import axios from 'axios';
dayjs.extend(buddhistEra)

type Input = {
    work: SubmittedAssignmentGroupModel
}

function CheckSubGroup({ work }: Input) {
    const navigte = useNavigate()
    const [scoreInput, setScoreInput] = useState<string | number>('')


    useEffect(() => {
        setScoreInput(work.stdAsmScore)
    }, [work])


    const onSave = async() => {
        try {
            if (isNaN(Number(scoreInput)) || !!!scoreInput || Number(scoreInput) < 0) {
                return waringAlert('กรุณากรอกคะแนนให้ถูกต้อง')
            }
            if (Number(scoreInput) > work.assignment.assignmentScore) {
                return waringAlert('คะแนนมากกว่าคะแนนที่กำหนด')
            }
            const response = await axios.post('/student-assignment/check-assignment', {
                stdAsmId: work.stdAsmId,
                stdAsmScore: Number(scoreInput)
            })
            if (response && response.status === 200) {
                successAlert(response.data.message as string)
            }
        } catch (error) {
            
        }
    }

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-2 px-2'>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            ชื่อแบบฝึดหัด:
                        </span>
                        <span className='font-bold text-primary'>{work.assignment.assignmentName}</span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            กำหนดส่ง:
                        </span>
                        <span className='font-bold text-primary'>{dayjs(new Date(work.assignment.assignmentEndDate)).locale('th').format('DD MMMM BBBB HH:mm')}</span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            ผู้ส่ง:
                        </span>
                        <span className='font-bold text-primary'>{work.student.user.nameTH} {work.student.user.studentNo} </span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            สมาชิก:
                        </span>
                        {work.studentInGroup.length > 0 && work.studentInGroup.map((member, index) => (
                            <span key={index} className='font-bold text-primary'>{member.nameTH} {member.studentNo} {index !== work.studentInGroup.length - 1 ? ',' : ''}</span>
                        ))}
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            ส่งเมื่อ:
                        </span>
                        <span className='font-bold text-primary'>{dayjs(new Date(work.stdAsmDateTime)).locale('th').format('DD MMMM BBBB HH:mm')} </span>
                        {new Date(work.stdAsmDateTime).getTime() > new Date(work.assignment.assignmentEndDate).getTime() && <span className='font-bold text-red-500'>ส่งล่าช้า</span>}
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-2 items-start px-3 w-[150px]'>
                <TextField label="คะแนน" variant="standard" required
                    name='score'
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">/{work.assignment.assignmentScore}</InputAdornment>,
                    }}
                />
            </div>
            <div className='w-full flex flex-col gap-2 items-center'>
                <div className='w-full min-h-[200px] h-auto bg-white rounded-md shadow-md p-2'>
                    <div dangerouslySetInnerHTML={{ __html: work.stdAsmResult }}></div>
                </div>
                <div className='w-full p-2'>
                    <span>ไฟล์ที่แนบ:</span>
                </div>
                <div className='w-full grid grid-cols-1 gap-2 items-center bg-slate-300 p-2'>
                    {(work.fileResources && work.fileResources.length > 0) && work.fileResources.map((file, index) => (
                        <a key={index} href={`${import.meta.env.VITE_API_ENDPOINT}/${file.fileResourcePath}`} target='_blank'><AttachFileIcon fontSize='inherit' />{file.fileResourceName}</a>
                    ))}
                </div>
            </div>
            <div className='w-full flex justify-center items-center gap-2 my-2'>
                <Button variant='contained' color='success' onClick={onSave} >บันทึก</Button>
                <Button variant='contained' color='inherit' onClick={() => navigte(-1)}>ยกเลิก</Button>
            </div>
        </div>
    )
}

export default CheckSubGroup