import Paper from '@mui/material/Paper';
import { Button, FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import SectionModal from '../../components/SectionModal';
import axios from 'axios';
import dayjs from 'dayjs';
import { RoomModel } from '../../types/RoomModel';
import { useNavigate } from 'react-router-dom';
function Section() {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [sectionId, setSectionId] = useState<number | null>(null)
  const [yearList, setYearList] = useState<number[]>([])
  const [termList, setTermList] = useState<number[]>([])
  const [selectYear, setSelectYear] = useState<number | string>('')
  const [selectTerm, setSelectTerm] = useState<number>(1)
  const [sectionList, setSectionList] = useState<RoomModel[]>([])
  useEffect(() => {
    getFilterList()
    if (!!selectYear && !!selectTerm) {
      console.log(selectYear, selectTerm);

      getSectionList()
    }
  }, [selectYear, selectTerm])

  const getFilterList = async () => {
    axios.get('/room/dropdown-filter').then((res) => {
      if (res && res.status === 200) {
        setYearList(res.data.years as number[])
        setTermList(res.data.terms as number[])
      }
    })
  }

  const getSectionList = async () => {
    axios.get(`/room/find-filter?year=${Number(selectYear)}&term=${Number(selectTerm)}`).then((res) => {
      if (res && res.status === 200) {
        setSectionList(res.data as RoomModel[])
      }
    })
  }

  const onEditClick = (id: number) => {
    setSectionId(id)
    handleDialogOpen()
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = (isFetch: boolean = false) => {
    setDialogOpen(false)
    setSectionId(null)
    if (isFetch) {
      getFilterList()
      getSectionList()
    }
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
                defaultValue={''}
              >
                {(yearList && yearList.length > 0) && yearList.map((year, index) => (
                  <MenuItem key={index} value={year} onClick={() => setSelectYear(year)} >{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='flex gap-2 items-center'>
            <span>ภาคเรียน</span>
            <FormControl variant='standard' >
              <Select
                defaultValue={1}
              >
                {(termList && termList.length > 0) && termList.map((term, index) => (
                  <MenuItem key={index} value={term} onClick={() => setSelectTerm(+term)} >{term}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='flex items-center'>
          <Button variant='contained' color='success' onClick={handleDialogOpen} >เพิ่มกลุ่มเรียน</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {(sectionList && sectionList.length > 0) && sectionList.map((section, index) => (
          <Paper elevation={3} key={index} onClick={() => navigate(`/teacher/section/${section.roomId}`)} className='group flex flex-col justify-center items-center py-2 bg-white hover:bg-slate-700 duration-500 cursor-pointer h-24 relative'>
            <div className='flex items-center gap-1 justify-center absolute top-1 right-0 group-hover:text-white mx-2'>

              <Tooltip title='แก้ไข' className='text-base hover:text-yellow-500 duration-200'>
                <EditIcon className='text-base' onClick={() => onEditClick(section.roomId)} />
              </Tooltip>
              {section.roomStatus.toUpperCase() === 'CLOSED' && (
                <Tooltip title='ปิด' className='text-base duration-200'>
                  <div className='w-3 h-3 rounded-full bg-red-500' />
                </Tooltip>
              )}
              {section.roomStatus.toUpperCase() === 'OPEN' && (
                <Tooltip title='เปิด' className='text-base duration-200'>
                  <div className='w-3 h-3 rounded-full bg-green-500' />
                </Tooltip>
              )}
            </div>
            <Typography className='group-hover:text-white font-bold text-lg duration-200'>{`${section.roomGroup} ${section.roomTerm}/${section.roomYear}`}</Typography>
          </Paper>))}
      </div>
      {dialogOpen && <SectionModal open={dialogOpen} handleDialogClose={handleDialogClose} sectionId={sectionId} />}
    </div>
  )
}

export default Section