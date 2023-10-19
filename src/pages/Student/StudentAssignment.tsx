import React, { useEffect, useState, useRef } from 'react'
import { Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AssignmentModel } from '../../types/AssignmentModel';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { StudentAssignmentModel } from '../../types/StudentAssignmentModel';
import TextEditor from '../../components/TextEditor';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ensureRemove, successAlert, waringAlert } from '../../utils/SweetAlert';
import { dateCountdown } from '../../utils/DateCountdown';
dayjs.extend(buddhistEra)

function StudentAssignment() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [assignment, setAssignment] = useState<AssignmentModel>(new AssignmentModel())
    const [studentAssignment, setStudentAssignment] = useState<StudentAssignmentModel>(new StudentAssignmentModel())
    const contentText = useRef('')
    const [file, setFile] = useState<File[]>([])
    const [resourceDelete, setResourceDelete] = useState<number[]>([])
    useEffect(() => {
        if (!id) {
            onBackClick()
        } else {
            findAssignment()
            findMyAssignment()
        }
    }, [])

    const findAssignment = async () => {
        try {
            const response = await axios.get(`/assignment/find?assignmentId=${id}`)
            if (response && response.status === 200) {
                setAssignment(response.data as AssignmentModel)
            }
        } catch (error) {

        }
    }

    const findMyAssignment = async () => {
        try {
            const response = await axios.get(`/student-assignment/my-assignment?assignmentId=${id}`)
            if (response && response.status === 200) {
                setStudentAssignment(response.data)
                contentText.current = (response.data as StudentAssignmentModel).stdAsmResult as string
            }
        } catch (error) {

        }
    }

    const onContentTextChange = (data: string) => {
        contentText.current = data
    }

    const onBackClick = () => {
        navigate('/assignment')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile([...file, e.target.files[0]]);
        }
    };

    const onRemoveFile = async (indexOfFile: number) => {
        const confirm = await ensureRemove("ต้องการลบไฟล์ใช่หรือไม่?")
        if (confirm.isConfirmed) {
            setFile(file.filter((f: File, index) => index != indexOfFile))
        }

    }

    const onRemoveResouce = async (fielResourceId: number) => {
        const ensure = await ensureRemove('ต้องการลบไฟล์ใช่หรือไม่')
        if (ensure.isConfirmed) {
            setResourceDelete([...resourceDelete, fielResourceId])
            const temp = studentAssignment
            temp.fileResources = temp.fileResources.filter((resource) => resource.fileResourceId != fielResourceId)
            setStudentAssignment(temp)
        }
    }

    const onSubmitForm = async () => {
        if (assignment.assignmentStatus.toUpperCase() === 'CLOSE') {
            return waringAlert('ไม่สามารถส่งงานได้ เนื่องจากงานปิดรับการส่งแล้ว')
        }
        if (studentAssignment.stdAsmStatus.toUpperCase() === 'CHECKED') {
            return waringAlert('งานนี้ผ่านการตรวจแล้ว ไม่สามารถส่งซ้ำได้')
        }
        let form: StudentAssignmentModel = studentAssignment
        form.stdAsmResult = contentText.current
        let formData = new FormData()
        formData.append('stdAsmId', form.stdAsmId.toString())
        if (form.stdAsmGroup) {
            formData.append('stdAsmGroup', form.stdAsmGroup)
        }
        formData.append('stdAsmResult', form.stdAsmResult)
        formData.append('stdAsmStatus', form.stdAsmStatus)
        formData.append('stdAsmScore', form.stdAsmScore.toString())
        formData.append('deleteFileIds', JSON.stringify(resourceDelete))

        if (file && file.length > 0) {
            for (let f of file) {
                formData.append('files', f)
            }
        }
        try {
            const response = await axios.post('student-assignment/send-assigment', formData)
            if (response && response.status === 200) {
                successAlert(response.data.message as string).then(() => {
                    window.location.reload()
                })
            }
        } catch (error) {

        }

    }


    const onCancelSubmit = async () => {
        try {
            ensureRemove('ต้องการยกเลิกการส่งงาน(งานที่ส่งไปแล้วจะหายไป)ใช่หรือไม่?').then(async (res) => {
                if (res.isConfirmed) {
                    const response = await axios.delete(`/student-assignment/cancel-send-assigment?stdAsmId=${studentAssignment.stdAsmId}`)
                    if (response && response.status === 200) {
                        successAlert(response.data.message as string).then(() => {
                            window.location.reload()
                        })
                    }
                }
            })
        } catch (error) {

        }
    }

    return (
        <div className='flex flex-col gap-2 px-2 w-full min-h-screen'>
            <div className='w-full my-2 flex justify-between items-center'>
                <Button color='inherit' variant='contained' onClick={onBackClick}>กลับ</Button>
                {(assignment.assignmentType.toUpperCase() === 'GROUP' && studentAssignment.stdAsmStatus.toUpperCase() === 'SUBMITTED') && <Button color='error' variant='contained' onClick={onCancelSubmit}>ยกเลิกส่งงาน</Button>}
            </div>
            <div className='w-full flex flex-col gap-2 px-2'>
                <Typography variant='h4'>{assignment.assignmentName}</Typography>
                {assignment.assignmentType.toUpperCase() === 'INDIVIDUAL' && <span>ประเภทงาน: เดี่ยว</span>}
                {assignment.assignmentType.toUpperCase() === 'GROUP' && <span>ประเภทงาน: กลุ่ม</span>}
                <span>กำหนดส่ง: {dayjs(new Date(assignment.assignmentEndDate)).locale('th').format('DD MMMM BBBB HH:mm')}</span>
                {new Date(assignment.assignmentEndDate).getTime() > new Date().getTime() && (
                    <span className='my-1'>เหลือเวลา: {dateCountdown(new Date(assignment.assignmentEndDate))}</span>
                )}
                {new Date(assignment.assignmentEndDate).getTime() < new Date().getTime() && (
                    <span className='my-1 text-red-500'>(เลยกำหนด)</span>
                )}
                <div className='w-full min-h-[200px] h-auto bg-white rounded-md shadow-md p-2'>
                    <div dangerouslySetInnerHTML={{ __html: assignment.assignmentDescription }}></div>
                </div>
                <div className='flex flex-col p-2 gap-2'>
                    <span className='text-lg'>ไฟล์:</span>
                    {(assignment.fileResources && assignment.fileResources.length > 0) && assignment.fileResources.map((file, index) => (
                        <a key={index} href={`${import.meta.env.VITE_API_ENDPOINT}/${file.fileResourcePath}`} target='_blank'><AttachFileIcon fontSize='inherit' />{file.fileResourceName}</a>
                    ))}
                </div>
            </div>
            <div className='w-full flex flex-col gap-2 px-2'>
                <Typography variant='h4'>ส่งงาน</Typography>
                {studentAssignment.stdAsmStatus.toUpperCase() === 'WAITING' && <span>สถานะงาน: ยังไม่ส่ง</span>}
                {studentAssignment.stdAsmStatus.toUpperCase() === 'SUBMITTED' && <span>สถานะงาน: <span className='text-green-500'>ส่งแล้ว</span></span>}
                {studentAssignment.stdAsmStatus.toUpperCase() === 'CHECKED' && <span>สถานะงาน: <span className='text-blue-500'>ตรวจแล้ว</span></span>}
                <span>ส่งเมื่อ: {studentAssignment.stdAsmStatus.toUpperCase() === 'WAITING' ? '-' : dayjs(new Date(studentAssignment.stdAsmDateTime)).locale('th').format('DD MMMM BBBB HH:mm')}</span>
                {studentAssignment.stdAsmStatus.toUpperCase() === 'CHECKED' && <span>คะแนน: {studentAssignment.stdAsmScore}</span>}
                <div className='w-full bg-white'>
                    <TextEditor sendData={onContentTextChange} data={contentText.current} />
                </div>
                <div className='w-full flex flex-col gap-2 mt-16 lg:mt-10 py-3'>
                    <span className='font-bold text-primary'>อัปโหลดไฟล์</span>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                        {(studentAssignment.fileResources && studentAssignment.fileResources.length > 0)
                            && studentAssignment.fileResources.map((resource, index) => (
                                <div key={index} className='relative group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-slate-500 duration-300 break-all'>
                                    <DeleteIcon
                                        onClick={() => onRemoveResouce(resource.fileResourceId)}
                                        className='absolute top-1 right-1 w-5 h-5 hover:text-red-500 hover:scale-150 duration-1000 cursor-pointer' />
                                    <Typography variant='inherit' noWrap whiteSpace={'unset'}>{resource.fileResourceName}</Typography>
                                    <a className='text-xs' target='_blank' href={`${import.meta.env.VITE_API_ENDPOINT}/${resource.fileResourcePath}`}>ดาวน์โหลด</a>
                                </div>
                            ))}

                        {(file && file.length > 0) && file.map((f: File, index) => (
                            <div key={index} className='relative group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-slate-500 duration-300 break-all'>
                                <DeleteIcon
                                    onClick={() => onRemoveFile(index)}
                                    className='absolute top-1 right-1 w-5 h-5 hover:text-red-500 hover:scale-150 duration-1000 cursor-pointer' />

                                <Typography variant='inherit' noWrap whiteSpace={'unset'} >{f.name}</Typography>
                            </div>
                        ))}
                        <Tooltip title="อัปโหลดไฟล์" placement='top-end'>
                            <label htmlFor="upload-file">
                                <div className='group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-slate-500 duration-300'>
                                    <AddIcon className='group-hover:text-white' />
                                </div>
                                <input className='hidden' onChange={handleFileChange} type="file" id='upload-file' />
                            </label>
                        </Tooltip>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center gap-2'>
                    <Button color='success' variant='contained' onClick={onSubmitForm}>ส่งงาน</Button>
                </div>
            </div>
        </div>
    )
}

export default StudentAssignment