import { Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip } from '@mui/material'
import { useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
function Assignment() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col gap-2 px-2 w-full'>
      <h2 className='text-secondary'>แบบฝึกหัด</h2>
      <div className='flex gap-2 flex-col md:flex-row justify-start md:justify-between'>
        <div className='w-full flex flex-col sm:flex-row gap-3'>
          <div className='flex gap-2 items-center'>
            <span>กลุ่มเรียน</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={'ECP4N'}
              >
                <MenuItem value={'ECP4N'}>ECP4N</MenuItem>
                <MenuItem value={'ECP3N'}>ECP3N</MenuItem>
                <MenuItem value={'ECP1N'}>ECP1N</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='flex gap-2 items-center'>
            <span>ปีการศึกษา</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={'2566'}
              >
                <MenuItem value={'2566'}>2566</MenuItem>
                <MenuItem value={'2565'}>2565</MenuItem>
                <MenuItem value={'2564'}>2564</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='flex gap-2 items-center'>
            <span>ภาคเรียน</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={'1'}
              >
                <MenuItem value={'1'}>1</MenuItem>
                <MenuItem value={'2'}>2</MenuItem>
                <MenuItem value={'3'}>3</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='flex md:justify-end w-[200px]'>
          <Button variant='contained' color='success' onClick={() => navigate('/teacher/assignment-detail')} >เพิ่มแบบฝึกหัด</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Card key={index} className='w-full relative'>
            <div className='absolute top-1 right-1 cursor-pointer'>
              <Tooltip title='สถานะ: เปิดรับ' placement='top'>
                <div className='w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-400'>

                </div>
              </Tooltip>

            </div>
            <CardHeader
              title={"LAB" + (index + 1)}
            />
            <CardContent>
              <div className='w-full flex flex-col'>
                <div className='flex gap-2 items-center'>
                  <span>กำหนดส่ง:</span>
                  <span>22 ธันวาคม 2566</span>
                </div>
                <div className='flex gap-2 items-center'>
                  <span>ประเภทงาน:</span>
                  <span>กลุ่ม</span>
                </div>
                <div className='flex gap-2 items-center'>
                  <span>คะแนน:</span>
                  <span>10</span>
                </div>
              </div>
            </CardContent>
            <CardActions className='flex flex-col sm:flex-row sm:justify-between items-end sm:items-end'>
              <div className='flex flex-row gap-2'>
                <Button size="medium" variant='contained' color='info' onClick={() => navigate(`/teacher/assignment-detail/${1}`)}>รายละเอียด</Button>
                <Button size="medium" variant='contained' color='warning' onClick={() => navigate(`/teacher/submitted-assignment/${1}`)}>ตรวจงาน</Button>
              </div>

              <Typography variant="caption" color="text.secondary">
                15 มกราคม 2566
              </Typography>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Assignment