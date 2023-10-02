import { Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader } from '@mui/material'
import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function Assignment() {
  return (
    <div className='flex flex-col gap-2 px-2'>
      <h2 className='text-secondary'>แบบฝึกหัด</h2>
      <div className='w-full flex gap-3'>
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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Card key={index} className='w-full'>
            <CardHeader
              title={"LAB" + (index + 1)}
              subheader="กำหนดส่ง 22 มกราคม 2566"
            />
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                Introduction into Fundamental of Computer Engineering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions className='flex justify-between'>
              <Button size="medium" className='text-blue-500'>รายละเอียด</Button>
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