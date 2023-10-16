import axios from 'axios';
import FileSaver from 'file-saver';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
function SectionDetail() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const params = {
        group: searchParams.get('group') || null,
        year: searchParams.get('year') || null,
        term: searchParams.get('term') || null,
        roomId: searchParams.get('roomId') || null,
    }
    const [dataList, setDataList] = useState<any[]>([])
    const [columns, setColumns] = useState<any[]>([])

    useEffect(() => {
        if (!!id) {
            fetchScoreData()
        } else {
            onBackClick()
        }
    }, [])

    const onBackClick = () => {
        navigate(`/teacher/section?year=${params.year}&term=${params.term}`)
    }

    const onDownload = async (type: string) => {
        try {
            if (type === 'csv') {
                const response = await axios.get(`/room/export-score-student?roomId=${id}&type=${type}`)
                if (response && response.status === 200) {
                    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
                    const blobData = new Uint8Array([...bom, ...new TextEncoder().encode(response.data)]);
                    const blob = new Blob([blobData], {
                        type: 'text/csv; charset=utf-8'
                    })
                    FileSaver.saveAs(blob, `คะแนน ${params.group} ${params.term}-${params.year}.csv`)
                }
            } else if (type === 'excel') {
                const response = await axios.get(`/room/export-score-student?roomId=${id}&type=${type}`, {
                    responseType: 'blob'
                })
                if (response && response.status === 200) {
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    })
                    FileSaver.saveAs(blob, `คะแนน ${params.group} ${params.term}-${params.year}.xlsx`)
                }

            }
        } catch (error) {

        }

    }

    const fetchScoreData = async () => {
        try {
            const response = await axios.get(`/room/report-score-student?roomId=${id}`)
            if (response && response.status === 200) {
                let data: any[] = response.data?.data
                let header = response.data?.header as any[]
                let tempHeader: any[] = []
                for (let head of header) {
                    tempHeader.push({
                        name: head['id'],
                        label: head['title'],
                        options: {
                            filter: false,
                            sort: false,
                            customBodyRender: (value: any) => {
                                return (
                                    <div className='w-full min-w-max'>{value}</div>
                                )
                            }
                        }
                    })
                }
                setColumns(tempHeader)
                setDataList(data)
            }
        } catch (error) {

        }
    }

    return (
        <div className='flex flex-col gap-2 px-3'>
            <div className='flex gap-2 items-center'>
                <h2 className='text-secondary cursor-pointer hover:text-primary' onClick={onBackClick}>กลุ่มเรียน</h2>
                <h2 className='text-secondary'>{'>'}</h2>
                <h2 className='text-secondary'>คะแนน</h2>
            </div>
            <div className='w-full flex gap-2 items-center justify-end'>
                <Button color='success' variant='contained' onClick={() => onDownload('csv')}>Export CSV <DescriptionIcon fontSize='small'></DescriptionIcon></Button>
                <Button color='success' variant='contained' onClick={() => onDownload('excel')} >Export Excel <DescriptionIcon fontSize='small'></DescriptionIcon></Button>
            </div>
            <div className='w-full overflow-x-scroll'>
                {
                    (columns && columns.length > 0) && (
                        <div className='w-auto'>
                            <MUIDataTable
                                title={"รายชื่อนักศึกษาส่งงาน"}
                                data={dataList}
                                columns={columns}
                                options={{
                                    pagination: false,
                                    elevation: 0,
                                    filter: false,
                                    print: false,
                                    download: false,
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
            </div>
        </div>
    )
}

export default SectionDetail