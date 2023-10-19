import React, { useEffect } from 'react'
import { Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip } from '@mui/material'
import { useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AssignmentModel } from '../../types/AssignmentModel';
import axios from 'axios';
import { dateCountdown } from '../../utils/DateCountdown';
dayjs.extend(buddhistEra)

function AssignmentStudent() {
    const navigate = useNavigate()
    const [assignmentList, setAssignmentList] = useState<AssignmentModel[]>([])

    useEffect(() => {
        findAssignments()
    }, [])

    const findAssignments = async () => {
        try {
            const response = await axios.get('/assignment/find-my-assignments')
            if (response && response.status === 200) {
                setAssignmentList(response.data as AssignmentModel[])
            }
        } catch (error) {

        }
    }

    return (
        <div className='flex flex-col gap-2 px-2 w-full'>
            <h2 className='text-secondary'>แบบฝึกหัด</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                {(assignmentList && assignmentList.length > 0) && assignmentList.map((assignment, index) => (
                    <Card key={index} className='w-full relative'>
                        <div className='absolute top-1 right-1 cursor-pointer'>
                            {assignment.assignmentStatus.toUpperCase() === 'OPEN' && (
                                <Tooltip title='สถานะ: เปิดรับ' placement='top'>
                                    <div className='w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-400'>
                                    </div>
                                </Tooltip>
                            )}
                            {assignment.assignmentStatus.toUpperCase() === 'CLOSE' && (
                                <Tooltip title='สถานะ: ปิดรับ' placement='top'>
                                    <div className='w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-400'>
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                        <CardHeader
                            title={assignment.assignmentName}
                        />
                        <CardContent>
                            <div className='w-full flex flex-col'>
                                <div className='flex gap-2 items-center'>
                                    <span>กำหนดส่ง:</span>
                                    <span>{dayjs(new Date(assignment.assignmentEndDate)).locale('th').format('DD MMMM BBBB HH:mm')}</span>
                                </div>
                                {new Date(assignment.assignmentEndDate).getTime() > new Date().getTime() && (
                                    <span className='my-1'>{dateCountdown(new Date(assignment.assignmentEndDate))}</span>
                                )}
                                {new Date(assignment.assignmentEndDate).getTime() < new Date().getTime() && (
                                    <span className='my-1 text-red-500'>(เลยกำหนด)</span>
                                )}
                                <div className='flex gap-2 items-center'>
                                    <span>ประเภทงาน:</span>
                                    {assignment.assignmentType.toUpperCase() === 'INDIVIDUAL' && <span>เดี่ยว</span>}
                                    {assignment.assignmentType.toUpperCase() === 'GROUP' && <span>กลุ่ม</span>}
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <span>คะแนน:</span>
                                    <span>{assignment.assignmentScore}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardActions className='flex flex-col sm:flex-row sm:justify-between items-end sm:items-end'>
                            <div className='flex flex-row gap-2'>
                                <Button size="medium" variant='contained' color='info' onClick={() => navigate(`/assignment/${assignment.assignmentId}`)}>รายละเอียด</Button>
                            </div>
                            <Typography variant="caption" color="text.secondary">
                                {dayjs(new Date(assignment.assignmentStartDate)).locale('th').format('DD MMMM BBBB')}
                            </Typography>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default AssignmentStudent