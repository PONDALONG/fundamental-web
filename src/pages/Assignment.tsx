import { MenuItem, Paper, Typography } from '@mui/material'
import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';

function Assignment() {
  return (
    <div className='flex flex-col gap-2 px-3'>
      <h2 className='text-secondary'>แบบฝึกหัด</h2>
      <div className='w-full'>
        <Select
          defaultValue={'ECP4N'}
        >
          <MenuItem value={'ECP4N'}>ECP4N</MenuItem>
          <MenuItem value={'ECP3N'}>ECP3N</MenuItem>
          <MenuItem value={'ECP1N'}>ECP1N</MenuItem>
        </Select>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Paper elevation={3} key={index} 
          className='group flex flex-col items-center py-2 cursor-pointer'>
            <Typography className='text-purple-500 font-bold text-lg group-hover:text-white duration-200'>ECP4N</Typography>
            <span className='group-hover:text-white duration-200'>ทั้งหมด 10 คน</span>
          </Paper>))}
      </div>
    </div>
  )
}

export default Assignment