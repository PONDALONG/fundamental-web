import { Box, Button } from '@mui/material';
import MUIDataTable from 'mui-datatables'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { StudentAssignmentGroupResponseModel, StudentSubmitGroupModel } from '../types/StudentModel';
import axios from 'axios';

type Input = {
    assignmentId: number
}

function SubmittedGroup({ assignmentId }: Input) {
    const navigate = useNavigate()
    const [submittedList, setSubmittedList] = useState<StudentSubmitGroupModel[]>([]) 

    const columns = [
        {
            name: "studentId",
            label: "รหัสนักศึกษา",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "name",
            label: "ชื่อ-สกุล",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string, tableMeta: any, updateValue: any) => {
                    return (
                        <div className='flex flex-col'>
                            <span>{value}</span>
                        </div>
                    )
                }
            }
        },
        {
            name: "status",
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
                                <span className='font-bold'>ยังไม่ส่ง</span>
                            )}
                            {String(value).toUpperCase() === 'LATE' && (
                                <span className='font-bold text-red-500'>ส่งเกินเวลากำหนด</span>
                            )}
                        </Box>
                    )
                }
            }
        },
        {
            name: "score",
            label: "คะแนน",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "id",
            label: 'จัดการ',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: number, tableMeta: any, updateValue: any) => {
                    return (
                        <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={{ xs: "100%", lg: "50%" }}>
                            {String(tableMeta.rowData[2]).toUpperCase() !== 'WAITING' && (
                                <Button fullWidth color='info' variant='contained' onClick={() => navigate(`/teacher/student-submitted/${1}`)} >
                                    ตรวจงาน
                                </Button>
                            )}
                        </Box>
                    )
                }
            }
        }
    ];


    const fetchData = async() => {
        try {
            const response = await axios.get(`/student-assignment/find-all?assignmentId=${assignmentId}`)
            if (response && response.data === 200) {
                const data: StudentAssignmentGroupResponseModel[] = response.data as StudentAssignmentGroupResponseModel[]
                const temp: StudentSubmitGroupModel[] = data.map((d) => {
                    const obj:StudentSubmitGroupModel = {
                        stdAsmGroup: d.stdAsmGroup,
                        stdAsmScore: d.studentAssignments[0].stdAsmScore,
                        stdAsmDateTime: d.studentAssignments[0].stdAsmDateTime,
                        memberName: d.studentAssignments.map((s: any) => s = s.student.user.nameTH),
                        memberStdNumber: d.studentAssignments.map((s: any) => s = s.student.user.studentNo)
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

export default SubmittedGroup