import React from 'react'
import { Button, IconButton, Switch, TextField, Tooltip, Typography, InputAdornment } from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function SubmittedAssignment() {
    const navigte = useNavigate()
    const [scoreInput, setScoreInput] = useState('')
    return (
        <div className='flex flex-col gap-2 px-2 w-full'>
            <h2 className='text-secondary'>การส่งงาน</h2>
            <div className='flex flex-col gap-2 px-2'>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            ชื่อแบบฝึดหัด:
                        </span>
                        <span className='font-bold text-primary'>LAB1</span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span>
                            ผู้ส่ง:
                        </span>
                        <span className='font-bold text-primary'>วินัย ศรีบุรินท์ 61332110211-4</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-2 items-start px-3 w-[150px]'>
                <TextField label="คะแนน" variant="standard" required
                    name='score'
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">/10</InputAdornment>,
                    }}
                />
            </div>
            <div className='w-full flex flex-col gap-2 items-center'>
                <div className='w-full lg:w-[80%] min-h-[300px] bg-white shadow-md rounded-md'>

                </div>
                <div className='w-full lg:w-[80%]'>
                    <span>ไฟล์ที่แนบ:</span>
                </div>
                <div className='w-full lg:w-[80%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center bg-slate-300 p-2'>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                    <div className='h-20 bg-white rounded-md shadow-md flex justify-center items-center cursor-pointer hover:bg-slate-600 hover:text-white duration-200'>
                        <span>61332110211-4_LAB1.pdf</span>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center items-center gap-2 my-2'>
                    <Button variant='contained' color='success'>บันทึก</Button>
                    <Button variant='contained' color='inherit' onClick={() => navigte('/teacher/submitted-assignment')}>ยกเลิก</Button>
            </div>
        </div>
    )
}

export default SubmittedAssignment