import Paper from '@mui/material/Paper';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
function Section() {
  return (
    <div className='flex flex-col gap-2 px-3'>
      <h2 className='text-secondary'>กลุ่มเรียน</h2>
      <div className='w-full flex gap-3'>
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
      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Paper elevation={3} key={index} className='group flex flex-col justify-center items-center py-2 bg-white hover:bg-slate-700 duration-500 cursor-pointer h-24'>
            <Typography className='group-hover:text-white font-bold text-lg duration-200'>ECP4N 2/2566</Typography>
            <span className='group-hover:text-white duration-200'>ทั้งหมด 10 คน</span>
          </Paper>))}
      </div>
    </div>
  )
}

export default Section