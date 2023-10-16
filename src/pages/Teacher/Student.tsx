import { FormControl, MenuItem, Select, Button, Box } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useEffect, useState } from 'react'
import { StudentModel, StudentSectionModel } from '../../types/StudentModel'
import MUIDataTable from 'mui-datatables'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { waringAlert } from '../../utils/SweetAlert';

export default function Student() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = {
    group: searchParams.get('group') || null,
    year: searchParams.get('year') || null,
    term: searchParams.get('term') || null,
  }
  const [studentList, setStudentList] = useState<StudentSectionModel[]>([])
  const [groupList, setGroupList] = useState<string[]>([])
  const [yearList, setYearList] = useState<number[]>([])
  const [selectGroup, setSelectGroup] = useState<string>('')
  const [selectYear, setSelectYear] = useState<number | string>('')
  const [selectTerm, setSelectTerm] = useState<number>(1)
  const columns = [
    {
      name: "studentNo",
      label: "รหัสนักศึกษา",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "nameTH",
      label: "ชื่อไทย",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "nameEN",
      label: "ชื่ออังกฤษ",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "userId",
      label: "จัดการ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number) => {
          return (
            <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={'100%'}>
              <Button fullWidth color='warning' variant='contained' onClick={() => navigate(`/teacher/student/${value}?group=${selectGroup}&year=${selectYear}&term=${selectTerm}`)}>
                แก้ไข
              </Button>
            </Box>
          )
        }
      }
    },
  ];

  useEffect(() => {
    fetchDropdown()
  }, [])

  const fetchDropdown = async () => {
    try {
      const response = await axios.get('/student/dropdown-filter')
      if (response && response.status === 200) {
        setGroupList(response.data?.groups as string[])
        setYearList(response.data?.years as number[])
        setFilter()
        if (!!selectGroup && !!selectYear && !!selectTerm) {
          onSearchClick()
        }
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

  const setFilter = async () => {
    if (!!params.group && !!params.year && !!params.term) {
      setSelectGroup(params.group)
      setSelectYear(+params.year)
      setSelectTerm(Number(params.term))
      clearParams()
    }
  }

  const onSearchClick = async () => {
    if (!selectGroup || !selectYear || !selectTerm) {
      return waringAlert('กรุณากรอกตัวกรองให้ครบ')
    }
    try {
      const response = await axios.get(`/student/find-all?roomGroup=${selectGroup}&roomYear=${selectYear}&roomTerm=${selectTerm}`)
      if (response && response.status === 200) {
        const data: StudentModel[] = response.data as StudentModel[]
        const temp: StudentSectionModel[] = data.map((d) => {
          const obj: StudentSectionModel = {
            userId: d.user.userId,
            nameEN: d.user.nameEN,
            nameTH: d.user.nameTH,
            studentNo: d.user.studentNo
          }
          return obj
        })
        setStudentList(temp)
      }
    } catch (error) {

    }


  }

  return (
    <div className='flex flex-col gap-2 px-2'>
      <h2 className='text-secondary'>รายชื่อนักศึกษา</h2>
      <div className='flex justify-between items-center'>
        <div className='w-full flex gap-3'>
          <div className='flex gap-2 items-center'>
            <span>กลุ่มเรียน</span>
            <FormControl variant='standard'>
              <Select
                value={selectGroup}
              >
                {(groupList && groupList.length > 0) && groupList.map((group, index) => (
                  <MenuItem key={index} value={group} onClick={() => setSelectGroup(group)}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
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
            <FormControl variant='standard'>
              <Select
                value={selectTerm}
              >
                <MenuItem value={1} onClick={() => setSelectTerm(1)}>1</MenuItem>
                <MenuItem value={2} onClick={() => setSelectTerm(2)}>2</MenuItem>
                <MenuItem value={3} onClick={() => setSelectTerm(3)}>3</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button variant='contained' onClick={onSearchClick}>ค้นหา</Button>
        </div>
        <div className='w-full flex justify-end px-2 gap-2'>
          <Button variant='contained' color='info'>นำเข้ารายชื่อนักศึกษา <FileUploadIcon fontSize='small' /></Button>
          <Button variant='contained' color='success'>ดาวน์โหลดแบบฟอร์มสำหรับนำเข้า<DownloadIcon fontSize='small' /></Button>
        </div>
      </div>

      <div className='w-full'>
        <MUIDataTable
          title={"รายชื่อนักศึกษาตามกลุ่มเรียน"}
          data={studentList}
          columns={columns}
          options={{
            elevation: 0,
            filter: false, print: false, downloadOptions: { filename: `รายชื่อนักศึกษากลุ่มเรียน ecp1n 2/2566` }, onDownload: (buildHead, buildBody, columns, data) => {
              if (columns.length > 0) {
                columns.pop()
              }
              if (data && data.length > 0) {
                for (let d of data) {
                  d.data.pop()
                }
              }
              return "\uFEFF" + '"1212","","","2255"\n' + buildHead(columns) + buildBody(data);
            },
            selectableRows: 'none',
            textLabels: {
              body: {
                noMatch: 'ไม่พบข้อมูล'
              }
            }
          }}
        />
      </div>
    </div>
  )
}