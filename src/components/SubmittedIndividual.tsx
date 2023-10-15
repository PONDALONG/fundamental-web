import { Box, Button } from '@mui/material';
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { StudentAssignmentGroupResponseModel, StudentGroupModel, StudentGroupResponseModel, StudentModel, StudentSubmitGroupModel, StudentSubmitIndividualModel } from '../types/StudentModel';
import axios from 'axios';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra)

type Input = {
    assignmentId: number
}

function SubmitIndividual({ assignmentId }: Input) {
    const navigate = useNavigate()
    const [submittedList, setSubmittedList] = useState<StudentSubmitIndividualModel[]>([])



    const columns = [
        {
            name: "studentNo",
            label: "รหัสนักศึกษา",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "stdName",
            label: "ชื่อ-สกุล",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "stdAsmStatus",
            label: "สถานะ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string, tableMeta: any, updateValue: any) => {
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
                customBodyRender: (value: Date | null, tableMeta: any, updateValue: any) => {
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
                customBodyRender: (value: number, tableMeta: any, updateValue: any) => {
                    return (
                        <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={{ xs: "100%", lg: "50%" }}>
                            {String(tableMeta.rowData[2]).toUpperCase() !== 'WAITING' && (
                                <Button fullWidth color='info' variant='contained' onClick={() => navigate(`/teacher/student-submitted/${value}`)} >
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
                const data: StudentGroupResponseModel[] = response.data as StudentGroupResponseModel[]
                const temp: StudentSubmitIndividualModel[] = data.map((d) => {
                    const obj: StudentSubmitIndividualModel = {
                        stdAsmId: d.stdAsmId,
                        studentNo: d.student.user.studentNo,
                        stdName: d.student.user.nameTH,
                        stdAsmScore: d.stdAsmScore,
                        stdAsmDateTime: d.stdAsmDateTime,
                        stdAsmStatus: d.stdAsmStatus
                    }
                    return obj
                })
                setSubmittedList(temp)
            }
        } catch (error) {
            console.log(error);

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
                    filter: false, print: false, downloadOptions: { filename: `รายชื่อนักเรียนที่ส่งงาน ecp1n 2/2566` }, onDownload: (buildHead, buildBody, columns, data) => {
                        if (columns.length > 0) {
                            columns.pop()
                        }
                        if (data && data.length > 0) {
                            for (let d of data) {
                                d.data.pop()
                            }
                        }
                        let sum = 0
                        for (let i of data) {

                            sum += i.data[3]
                        }
                        return "\uFEFF" + buildHead(columns) + buildBody(data) + '\n' + `"","","รวม","${sum}"\n`;
                    },
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

export default SubmitIndividual