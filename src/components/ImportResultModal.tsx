import MUIDataTable from 'mui-datatables'
import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
type Input = {
    handleDialogClose: () => void,
    open: boolean
    data: any[]
}

function ImportResultModal({ open, handleDialogClose, data = [] }: Input) {
    let column = [
        {
            name: "nameTH",
            label: "ชื่อไทย",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "nameEN",
            label: "ชื่ออังกฤษ",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "studentNo",
            label: "รหัสนักศึกษา",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "status",
            label: "ผลลัพธ์",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: boolean) => {
                    return <>
                        {value === true && <span className='text-green-500'>สำเร็จ</span>}
                        {value === false && <span className='text-red-500'>ไม่สำเร็จ</span>}
                    </>
                }
            }
        },
        {
            name: "result",
            label: "หมายเหตุ",
            options: {
                filter: false,
                sort: false,
            }
        },
    ]

    const closeModal = () => {
        handleDialogClose()
    }

    return (
        <Dialog open={open} onClose={closeModal} maxWidth={'xl'} scroll='body'>
            <DialogTitle>สำเร็จ: <span className='text-green-500'>{data.filter((d) => d?.status === true).length}</span>, ไม่สำเร็จ: <span className='text-red-500'>{data.filter((d) => d?.status === false).length}</span></DialogTitle>
            <DialogContent><div className='w-full min-w-[90vw] max-h-fit'>
                {data && data.length > 0 && <MUIDataTable
                    title={"รายชื่อนักศึกษาที่อัปโหลด"}
                    data={data}
                    columns={column}
                    options={{
                        responsive: 'vertical',
                        pagination: false,
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
                />}
            </div></DialogContent>

        </Dialog>
    )
}

export default ImportResultModal