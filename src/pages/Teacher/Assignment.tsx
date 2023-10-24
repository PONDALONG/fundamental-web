import { Card, Typography, CardActions, Button, CardContent, FormControl, CardHeader, Tooltip } from '@mui/material'
import { useState, useEffect } from 'react'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AssignmentModel } from '../../types/AssignmentModel';
import axios from 'axios';
import { GroupListModel, TermListModel, YearListModel } from '../../types/RoomModel';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { dateCountdown } from '../../utils/DateCountdown';
import { ensureRemove, successAlert } from '../../utils/SweetAlert';
dayjs.extend(buddhistEra)
function Assignment() {
  const [assignmentList, setAssignmentList] = useState<AssignmentModel[]>([])
  const [groupList, setGroupList] = useState<GroupListModel[]>([])
  const [yearList, setYearList] = useState<YearListModel[]>([])
  const [termList, setTermList] = useState<TermListModel[]>([])

  const [selectGroup, setSelectGroup] = useState<string>('')
  const [selectYear, setSelectYear] = useState<string>('')
  const [selectTerm, setSelectTerm] = useState<number | string>('')
  const [roomId, setRoomId] = useState<number | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const params = {
    group: searchParams.get('group') || null,
    year: searchParams.get('year') || null,
    term: searchParams.get('term') || null,
    roomId: searchParams.get('roomId') || null,
  }
  const navigate = useNavigate()


  useEffect(() => {
    checkParams()
    fetchGroup()
    if (!!selectGroup && !!selectYear && !!selectTerm) {
      fetchAssignment(selectGroup, selectYear, selectTerm)
      findRoomId(selectGroup, selectYear, selectTerm)
    } else {
      setAssignmentList([])
    }
  }, [selectGroup, selectYear, selectTerm])

  const fetchGroup = async () => {
    try {
      const response = await axios.get('/room/filterGroups')
      if (response && response.status === 200) {
        setGroupList(response.data as GroupListModel[])
      }
    } catch (error) {

    }
  }

  const clearParams = () => {
    searchParams.delete('year')
    searchParams.delete('group')
    searchParams.delete('term')
    setSearchParams(searchParams)
  }

  const checkParams = async () => {
    if (!!params.group && !!params.term && !!params.year) {
      const responseYear = await axios(`/room/filterYears?group=${params.group}`)
      if (responseYear && responseYear.status === 200) {
        setYearList(responseYear.data)
        const responseTerm = await axios.get(`/room/filterTerms?group=${params.group}&year=${params.year}`)
        if (responseTerm && responseTerm.status === 200) {
          setTermList(responseTerm.data)
          setSelectGroup(params.group)
          setSelectYear(params.year)
          setSelectTerm(params.term)
        }
      }
    }
  }

  const onSelectGroup = async (group: string) => {
    clearParams()
    setSelectGroup(group)
    setSelectTerm('')
    setSelectYear('')
    setYearList([])
    setTermList([])
    const response = await axios.get(`/room/filterYears?group=${group}`)
    if (response && response.status === 200) {
      setYearList(response.data as YearListModel[])
    }
  }

  const onSelectYear = async (group: string, year: string) => {
    clearParams()
    try {
      setSelectYear(year)
      setSelectTerm('')
      setTermList([])
      const response = await axios.get(`/room/filterTerms?group=${group}&year=${year}`)
      if (response && response.status === 200) {
        setTermList(response.data)
      }
    } catch (error) {

    }

  }

  const onSelectTerm = async (term: number | string) => {
    try {
      clearParams()
      setSelectTerm(term)
    } catch (error) {

    }
  }

  const fetchAssignment = async (group: string, year: string, term: number | string) => {
    try {
      let response = await axios.get(`/assignment/find-all?roomGroup=${group}&roomYear=${year}&roomTerm=${term}`)
      if (response && response.status === 200) {
        setAssignmentList(response.data as AssignmentModel[])
      }
    } catch (error) {

    }
  }

  const findRoomId = async (group: string, year: string, term: number | string) => {
    try {
      let response = await axios.get(`/room/find-YGT?roomGroup=${group}&roomYear=${year}&roomTerm=${term}`)
      if (response && response.status === 200) {
        if (response.data.roomId) {
          setRoomId(response.data.roomId as number)
        }
      }
    } catch (error) {

    }
  }

  const onDeleteAssignment = (id: number, assignmentName: string) => {
    ensureRemove(`ต้องการลบ ${assignmentName} ใช่หรือไม่?`).then(async(check) => {
      if (check.isConfirmed) {
        const response = await axios.delete(`/assignment/delete?assignmentId=${id}`)
        if (response && response.status === 200) {
          successAlert(response.data.message as string).then(() => {
            fetchAssignment(selectGroup, selectYear, selectTerm)
          })
        }
      }
    })
  }

  return (
    <div className='flex flex-col gap-2 px-2 w-full'>
      <h2 className='text-secondary'>แบบฝึกหัด</h2>
      <div className='flex gap-2 flex-col md:flex-row justify-start md:justify-between'>
        <div className='w-full flex flex-col sm:flex-row gap-3'>
          <div className='flex gap-2 items-center'>
            <span>กลุ่มเรียน</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={''}
                value={selectGroup}
              >

                {(groupList && groupList.length > 0) && groupList.map((group, index) => (
                  <MenuItem key={index} value={group.roomGroup} onClick={() => onSelectGroup(group.roomGroup)} >{group.roomGroup}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='flex gap-2 items-center'>
            <span>ปีการศึกษา</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={''}
                value={selectYear}
              >
                {(yearList && yearList.length > 0) && yearList.map((year, index) => (
                  <MenuItem key={index} value={year.roomYear} onClick={() => onSelectYear(selectGroup, year.roomYear)} >{year.roomYear}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='flex gap-2 items-center'>
            <span>ภาคเรียน</span>
            <FormControl variant='standard'>
              <Select
                defaultValue={''}
                value={selectTerm}
              >
                {(termList && termList.length > 0) && termList.map((term, index) => (
                  <MenuItem key={index} value={term.roomTerm} onClick={() => onSelectTerm(term.roomTerm)} >{term.roomTerm}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='flex md:justify-end w-[200px]'>
          <Button variant='contained' color='success' onClick={() => navigate(`/teacher/assignment-detail?group=${selectGroup}&year=${selectYear}&term=${selectTerm}&roomId=${roomId ? roomId : ''}`)} >เพิ่มแบบฝึกหัด</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
        {(assignmentList && assignmentList.length > 0) && assignmentList.map((assignment, index) => (
          <Card key={index} className='w-full relative'>
            <div className='absolute top-1 right-1 cursor-pointer flex gap-2'>
            <Tooltip title='ลบ' className='text-base hover:text-red-500 duration-200 cursor-pointer'>
                <DeleteIcon fontSize='large' className='text-base' onClick={() => onDeleteAssignment(assignment.assignmentId, `${assignment.assignmentName}`)} />
              </Tooltip>
              {assignment.assignmentStatus.toUpperCase() === 'OPEN' && (
                <Tooltip title='สถานะ: เปิดรับ' placement='top'>
                  <div className='w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-400'>
                  </div>
                </Tooltip>
              )}
              {assignment.assignmentStatus.toUpperCase() === 'CLOSE' && (
                <Tooltip title='สถานะ: ปิดรับ' placement='top'>
                  <div className='w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-400'>
                  </div>
                </Tooltip>
              )}
            </div>
            <CardHeader
              title={assignment.assignmentName}
            />
            <CardContent>
              <div className='w-full flex flex-col'>
                <div className='flex gap-2 items-center'>
                  <span>กำหนดส่ง:</span>
                  <span>{dayjs(new Date(assignment.assignmentEndDate)).locale('th').format('DD MMMM BBBB HH:mm')}</span>
                </div>
                {new Date(assignment.assignmentEndDate).getTime() > new Date().getTime() && (
                  <span className='my-1'>{dateCountdown(new Date(assignment.assignmentEndDate))}</span>
                )}
                {new Date(assignment.assignmentEndDate).getTime() < new Date().getTime() && (
                  <span className='my-1 text-red-500'>(เลยกำหนด)</span>
                )}
                <div className='flex gap-2 items-center'>
                  <span>ประเภทงาน:</span>
                  {assignment.assignmentType.toUpperCase() === 'INDIVIDUAL' && <span>เดี่ยว</span>}
                  {assignment.assignmentType.toUpperCase() === 'GROUP' && <span>กลุ่ม</span>}
                </div>
                <div className='flex gap-2 items-center'>
                  <span>คะแนน:</span>
                  <span>{assignment.assignmentScore}</span>
                </div>
              </div>
            </CardContent>
            <CardActions className='flex flex-col sm:flex-row sm:justify-between items-end sm:items-end'>
              <div className='flex flex-row gap-2'>
                <Button size="medium" variant='contained' color='info' onClick={() => navigate(`/teacher/assignment-detail/${assignment.assignmentId}?group=${selectGroup}&year=${selectYear}&term=${selectTerm}&roomId=${roomId ? roomId : ''}`)}>รายละเอียด</Button>
                <Button size="medium" variant='contained' color='warning' onClick={() => navigate(`/teacher/submitted-assignment/${assignment.assignmentId}?group=${selectGroup}&year=${selectYear}&term=${selectTerm}&roomId=${roomId ? roomId : ''}&type=${assignment.assignmentType}`)}>ตรวจงาน</Button>
              </div>

              <Typography variant="caption" color="text.secondary">
                {dayjs(new Date(assignment.assignmentStartDate)).locale('th').format('DD MMMM BBBB')}
              </Typography>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Assignment