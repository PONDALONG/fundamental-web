import { Box, Button } from '@mui/material';
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { StudentAssignmentGroupResponseModel, StudentSubmitGroupModel } from '../types/StudentModel';
import axios from 'axios';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra)

type Input = {
    assignmentId: number
}

function SubmittedGroup({ assignmentId }: Input) {
    const navigate = useNavigate()
    const [submittedList, setSubmittedList] = useState<StudentSubmitGroupModel[]>([])

    const columns = [
        {
            name: "stdAsmGroup",
            label: "กลุ่ม",
            options: {
                filter: false,
                sort: false,
            },
            customBodyRender: (value: string) => {
                <span>{value}</span>
            }
        },
        {
            name: "memberStdNumber",
            label: "รหัสนักศึกษา",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string[]) => {
                    return (
                        <div className='flex flex-col'>
                            {value.map((v, index) => (
                                <span key={index} >{v}</span>
                            ))}
                        </div>
                    )
                }
            }
        },
        {
            name: "memberName",
            label: "ชื่อ-สกุล",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string[]) => {
                    return (
                        <div className='flex flex-col'>
                            {value.map((v, index) => (
                                <span key={index} >{v}</span>
                            ))}
                        </div>
                    )
                }
            }
        },
        {
            name: "stdAsmStatus",
            label: "สถานะ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string) => {
                    return (
                        <Box>
                            {String(value).toUpperCase() === 'SUBMITTED' && (
                                <span className='font-bold text-green-500'>ส่งงานแล้ว</span>
                            )}
                            {String(value).toUpperCase() === 'WAITING' && (
                                <span className='font-bold text-red-500'>ยังไม่ส่ง</span>
                            )}
                            {String(value).toUpperCase() === 'CHECKED' && (
                                <span className='font-bold text-blue-500'>ตรวจแล้ว</span>
                            )}
                        </Box>
                    )
                }
            }
        },
        {
            name: "stdAsmDateTime",
            label: "ส่งเมื่อ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: Date | null) => {
                    return (
                        <>
                            {!!value && <Box>
                                {dayjs(new Date(value)).locale('th').format('DD MMM BBBB HH:mm')}
                            </Box>}
                        </>

                    )
                }
            }
        },
        {
            name: "stdAsmScore",
            label: "คะแนน",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "stdAsmId",
            label: 'จัดการ',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: number, tableMeta: any) => {
                    return (
                        <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={{ xs: "100%", lg: "50%" }}>
                            {String(tableMeta.rowData[3]).toUpperCase() !== 'WAITING' && (
                                <Button fullWidth color='info' variant='contained' onClick={() => navigate(`/teacher/student-submitted/${value}?type=GROUP`)} >
                                    ตรวจงาน
                                </Button>
                            )}
                        </Box>
                    )
                }
            }
        }
    ];

    useEffect(() => {
        if (!!assignmentId) {
            fetchData()
        }
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`/student-assignment/find-all?assignmentId=${assignmentId}`)
            if (response && response.status === 200) {
                const data: StudentAssignmentGroupResponseModel[] = response.data as StudentAssignmentGroupResponseModel[]
                const temp: StudentSubmitGroupModel[] = data.map((d) => {
                    const obj: StudentSubmitGroupModel = {
                        stdAsmId: d.studentAssignments[0].stdAsmId,
                        stdAsmGroup: d.stdAsmGroup,
                        stdAsmScore: d.studentAssignments[0].stdAsmScore,
                        stdAsmDateTime: d.studentAssignments[0].stdAsmDateTime,
                        memberName: d.studentAssignments.map((s: any) => s = s.student.user.nameTH),
                        memberStdNumber: d.studentAssignments.map((s: any) => s = s.student.user.studentNo),
                        stdAsmStatus: d.studentAssignments[0].stdAsmStatus
                    }
                    return obj
                })
                setSubmittedList(temp)

            }
        } catch (error) {
        }
    }

    return (
        <div className='w-full'>
            <MUIDataTable
                title={"รายชื่อนักเรียนที่ส่งงาน"}
                data={submittedList}
                columns={columns}
                options={{
                    elevation: 0,
                    download: false,
                    filter: false, 
                    print: false, 
                    selectableRows: 'none',
                    textLabels: {
                        body: {
                            noMatch: 'ไม่พบข้อมูล'
                        }
                    }
                }}
            />
        </div>
    )
}

export default SubmittedGroup