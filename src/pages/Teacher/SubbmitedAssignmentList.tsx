import React, { useState } from 'react'
import { FormControl, MenuItem, Select, Button, Box, TextField, Input, InputAdornment } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
function SubbmitedAssignmentList() {
    const navigate = useNavigate()
    const [submittedList, setSubmittedList] = useState<any[]>(
        [
            {
                studentId: '5555555',
                name: 'winai jaibun',
                status: 'SUBMITTED',
                id: 1,
                score: 10
            },
            {
                studentId: '5555555',
                name: 'winai jaibun',
                status: 'WAITING',
                id: 1,
                score: 0
            },
            {
                studentId: '5555555',
                name: 'winai jaibun',
                status: 'LATE',
                id: 1,
                score: 0
            },
        ]
    )
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
                            { String(value).toUpperCase() === 'SUBMITTED' && (
                                <span className='font-bold text-green-500'>ส่งงานแล้ว</span>
                            ) }
                            { String(value).toUpperCase() === 'WAITING' && (
                                <span className='font-bold'>ยังไม่ส่ง</span>
                            ) }
                            { String(value).toUpperCase() === 'LATE' && (
                                <span className='font-bold text-red-500'>ส่งเกินเวลากำหนด</span>
                            ) }
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
                                <Button fullWidth color='info' variant='contained'onClick={() => navigate(`/teacher/student-submitted/${1}`)} >
                                    ตรวจงาน
                                </Button>
                            )}
                        </Box>
                    )
                }
            }
        }
    ];
    return (
        <div className='flex flex-col gap-2 px-2 w-full'>
            <h2 className='text-secondary'>การส่งงาน</h2>
            <div className='w-full'>
                <MUIDataTable
                    title={"รายชื่อนักเรียนที่ส่งงาน"}
                    data={submittedList}
                    columns={columns}
                    options={{
                        filter: false, print: false, downloadOptions: { filename: `รายชื่อนักเรียนที่ส่งงาน ecp1n 2/2566` }, onDownload: (buildHead, buildBody, columns, data) => {
                            if (columns.length > 0) {
                                columns.pop()
                            }
                            if (data && data.length > 0) {
                                for (let d of data) {
                                    d.data.pop()
                                }
                            }
                            return "\uFEFF" + '"1212","","","2255"\n' + buildHead(columns) + buildBody(data);
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
            <div className='w-full flex gap-2 items-center'>
                    <Button variant='contained' color='inherit'onClick={() => navigate(`/teacher/assignment/`)}>กลับ</Button>
            </div>
        </div>
    )
}

export default SubbmitedAssignmentList