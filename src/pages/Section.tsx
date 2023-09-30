import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
function Section() {
  return (
    <div className='flex flex-col gap-2 px-3'>
      <h2 className='text-secondary'>กลุ่มเรียน</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {['', '', '', '', '', '', '', '', '',].map((m, index) => (
          <Paper elevation={3} key={index} className='group flex flex-col items-center py-2 bg-purple-200 hover:bg-purple-400 duration-200 cursor-pointer'>
            <Typography className='text-purple-500 font-bold text-lg group-hover:text-white duration-200'>ECP4N</Typography>
            <span className='group-hover:text-white duration-200'>ทั้งหมด 10 คน</span>
          </Paper>))}
      </div>
    </div>
  )
}

export default Section