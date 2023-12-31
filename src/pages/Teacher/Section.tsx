import Paper from '@mui/material/Paper';
import { Button, FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import SectionModal from '../../components/SectionModal';
import axios from 'axios';
import dayjs from 'dayjs';
import { RoomModel } from '../../types/RoomModel';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ensureRemove, successAlert } from '../../utils/SweetAlert';
function Section() {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [sectionId, setSectionId] = useState<number | null>(null)
  const [yearList, setYearList] = useState<number[]>([])
  const [termList, setTermList] = useState<number[]>([])
  const [selectYear, setSelectYear] = useState<number | string>('')
  const [selectTerm, setSelectTerm] = useState<number>(1)
  const [sectionList, setSectionList] = useState<RoomModel[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const params = {
    year: searchParams.get('year') || null,
    term: searchParams.get('term') || null,
  }
  useEffect(() => {
    getFilterList()
    setFilter()
    if (!!selectYear && !!selectTerm) {
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

  const clearParams = () => {
    searchParams.delete('year')
    searchParams.delete('term')
    setSearchParams(searchParams)
  }

  const setFilter = () => {
    if (params.year && params.term) {
      setSelectYear(params.year as string)
      setSelectTerm(Number(params.term) as number)
      clearParams()
    }
    
  }

  const onEditClick = (id: number) => {
    setSectionId(id)
    handleDialogOpen()
  }

  const onDeleteSection = (id: number, roomName: string) => {
    ensureRemove(`ต้องการลบ ${roomName} ใช่หรือไม่?`).then(async(check) => {
      if (check.isConfirmed) {
        const response = await axios.delete(`/room/delete?roomId=${id}`)
        if (response && response.status === 200) {
          successAlert(response.data.message as string).then(() => {
            getSectionList()
          })
        }
      }
    })
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
                value={selectYear}
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
                value={selectTerm}
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
          <Paper elevation={3} key={index} className='flex flex-col justify-center items-center py-2 bg-white h-24 relative'>
            <div className='flex items-center gap-1 justify-center absolute top-1 right-0 group-hover:text-white mx-2'>

              <Tooltip title='แก้ไข' className='text-base hover:text-yellow-500 duration-200 cursor-pointer'>
                <EditIcon className='text-base' onClick={() => onEditClick(section.roomId)} />
              </Tooltip>
              <Tooltip title='ลบ' className='text-base hover:text-red-500 duration-200 cursor-pointer'>
                <DeleteIcon className='text-base' onClick={() => onDeleteSection(section.roomId, `${section.roomGroup} ${section.roomTerm}/${section.roomYear}`)} />
              </Tooltip>
              {section.roomStatus.toUpperCase() === 'CLOSED' && (
                <Tooltip title='ปิด' className='text-base duration-200 cursor-pointer'>
                  <div className='w-3 h-3 rounded-full bg-red-500' />
                </Tooltip>
              )}
              {section.roomStatus.toUpperCase() === 'OPEN' && (
                <Tooltip title='เปิด' className='text-base duration-200'>
                  <div className='w-3 h-3 rounded-full bg-green-500' />
                </Tooltip>
              )}
            </div>
            <Typography onClick={() => navigate(`/teacher/section/${section.roomId}?year=${selectYear}&term=${selectTerm}&group=${section.roomGroup}`)} className='cursor-pointer hover:scale-150 font-bold text-lg duration-200'>{`${section.roomGroup} ${section.roomTerm}/${section.roomYear}`}</Typography>
          </Paper>))}
      </div>
      {dialogOpen && <SectionModal open={dialogOpen} handleDialogClose={handleDialogClose} sectionId={sectionId} />}
    </div>
  )
}

export default Section