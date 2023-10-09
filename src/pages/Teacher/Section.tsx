import Paper from '@mui/material/Paper';
import { Button, FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import SectionModal from '../../components/SectionModal';
function Section() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [sectionId, setSectionId] = useState<number | null>(null)
  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSectionId(null)
  }

  return (
    <div className='flex flex-col gap-2 px-3'>
      <h2 className='text-secondary'>กลุ่มเรียน</h2>
      <div className='w-full flex flex-col md:flex-row justify-start md:justify-between gap-3'>
        <div className='flex gap-3'>
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
        <div className='flex items-center'>
          <Button variant='contained' color='success' onClick={handleDialogOpen} >เพิ่มกลุ่มเรียน</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Paper elevation={3} key={index} className='group flex flex-col justify-center items-center py-2 bg-white hover:bg-slate-700 duration-500 cursor-pointer h-24 relative'>
            <div className='flex items-center gap-1 justify-center absolute top-1 right-0'>
              <Tooltip title='แก้ไข' className='text-base hover:text-yellow-500 duration-200'>
                  <EditIcon className='text-base' />
              </Tooltip>
              <Tooltip title='ลบ' className='text-base hover:text-red-500 duration-200'>
                  <DeleteIcon className='text-base' />
              </Tooltip>
            </div>
            <Typography className='group-hover:text-white font-bold text-lg duration-200'>ECP4N 2/2566</Typography>
            <span className='group-hover:text-white duration-200'>ทั้งหมด 10 คน</span>
          </Paper>))}
      </div>
      { dialogOpen && <SectionModal open={dialogOpen} handleDialogClose={handleDialogClose} sectionId={sectionId}  /> }
    </div>
  )
}

export default Section