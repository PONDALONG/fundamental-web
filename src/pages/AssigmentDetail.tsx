import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import React, { useState, useRef } from 'react'


function AssigmentDetail() {

  return (
    <div className='flex flex-col gap-2 px-2'>
      <div className='flex gap-2 my-3 font-bold'>
        <span className='text-gray-400 hover:text-gray-700 duration-300 cursor-pointer'>Assignment</span>
        <span className='text-gray-400'>{'>'}</span>
        <span className='text-gray-400'>Assignment Detail</span>
      </div>
      <div className='w-full flex flex-col justify-center items-center gap-2'>
        <div className='w-[60%] flex flex-col justify-start gap-5'>
          <div className='flex flex-col gap-3'>
            <label className='font-bold text-primary'>ชื่อแบบฝึกหัด</label>
            <TextField label="ชื่อแบบฝึกหัด" variant="standard" />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-bold text-primary'>กำหนดส่ง</label>
            <DateTimePicker
              label="กำหนดส่ง"
              defaultValue={dayjs(new Date())}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssigmentDetail