import { FormControl, MenuItem, Select, Button, Box } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useEffect, useState, useRef } from 'react'
import { StudentModel, StudentSectionModel } from '../../types/StudentModel'
import MUIDataTable from 'mui-datatables'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ensureRemove, successAlert, waringAlert } from '../../utils/SweetAlert';
import ImportResultModal from '../../components/ImportResultModal';
import { GroupListModel, TermListModel, YearListModel } from '../../types/RoomModel';

export default function Student() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = {
    group: searchParams.get('group') || null,
    year: searchParams.get('year') || null,
    term: searchParams.get('term') || null,
  }
  const [studentList, setStudentList] = useState<StudentSectionModel[]>([])
  const [groupList, setGroupList] = useState<GroupListModel[]>([])
  const [yearList, setYearList] = useState<YearListModel[]>([])
  const [termList, setTermList] = useState<TermListModel[]>([])
  const [selectGroup, setSelectGroup] = useState<string>('')
  const [selectYear, setSelectYear] = useState<number | string>('')
  const [selectTerm, setSelectTerm] = useState<number | string>(1)
  const importFile = useRef(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [resultData, setResultData] = useState<any[]>([])
  const setShowDialogOpen = () => {
    setShowDialog(true)
  }

  const setShowDialogClose = async () => {
    setShowDialog(false)
    window.location.reload()
  }
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
              <Button fullWidth color='error' variant='contained' onClick={() => removeStudent(value)}>
                ลบ
              </Button>
            </Box>
          )
        }
      }
    },
  ];

  useEffect(() => {
    if (resultData.length > 0) {
      setShowDialogOpen()
    } else {
      fetchGroup()
      checkParams()
      if (!!selectGroup && !!selectYear && !!selectTerm) {
        onSearchClick()
      } else {
        setStudentList([])
      }
    }
  }, [resultData, selectGroup, selectYear, selectTerm])

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

  const removeStudent = (userId: number) => {
    ensureRemove('ต้องการลบนักศึกษาคนนี้ใช่หรือไม่?').then(async(check) => {
      if (check.isConfirmed) {
        const response = await axios.delete(`/user/delete?userId=${userId}`)
        if (response && response.status === 200) {
          successAlert(response.data.message).then(() => {
            onSearchClick()
          })
        }
      }
      
    })
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

  const handleFileChange = async (e: any) => {
    if (!selectGroup || !selectYear || !selectTerm) {
      return waringAlert('กรุณากรอกตัวกรองให้ครบ').then(() => window.location.reload())
    }
    try {
      if (e?.target?.files && e?.target?.files[0]) {
        let response = await axios.get(`/room/find-YGT?roomGroup=${selectGroup}&roomYear=${selectYear}&roomTerm=${selectTerm}`)
        if (response && response.status === 200) {
          if (response.data.roomId) {
            let roomId = response.data.roomId as number
            importFile.current = e?.target?.files[0]
            ensureRemove(`ต้องการอัปโหลดรายชื่อที่ ${selectGroup} ${selectTerm}/${selectYear} ใช่หรือไม่?`).then(async (check) => {
              if (check.isConfirmed) {
                let formData = new FormData()
                formData.append('roomId', roomId.toString())
                if (!!importFile.current) {
                  formData.append('file', importFile.current)
                  let res = await axios.post('/student/import', formData)
                  if (res && res.status === 200) {
                    setResultData(res.data as any[])
                    setShowDialogOpen()
                  }
                } else {
                  waringAlert('เกิดข้อผิดพลาด ไม่พบไฟล์').then(() => {
                    window.location.reload()
                  })
                }

              }
            })
          }
        } else {
          return waringAlert('ไม่พบกลุ่มเรียนนี้ กรุณาเพิ่มกลุ่มเรียน').then(() => {
            window.location.reload()
          })
        }
      } else {
        window.location.reload()
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
                  <MenuItem key={index} value={group.roomGroup} onClick={() => onSelectGroup(group.roomGroup)} >{group.roomGroup}</MenuItem>
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
                  <MenuItem key={index} value={year.roomYear} onClick={() => onSelectYear(selectGroup, year.roomYear)} >{year.roomYear}</MenuItem>
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
                {(termList && termList.length > 0) && termList.map((term, index) => (
                  <MenuItem key={index} value={term.roomTerm} onClick={() => onSelectTerm(term.roomTerm)} >{term.roomTerm}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='w-full flex justify-end px-2 gap-2'>
          <label htmlFor="import-file" className='cursor-pointer p-2 bg-blue-500 rounded text-white hover:bg-blue-700 duration-300'>
            IMPORT รายชื่อนักศึกษา
            <input type="file" id="import-file" ref={importFile} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' onChange={handleFileChange} className='hidden' />
          </label>
          <Button variant='contained' color='success' href='/template_import_student.xlsx' download={true}>template<DownloadIcon fontSize='small' /></Button>
        </div>
      </div>

      <div className='w-full'>
        <MUIDataTable
          title={"รายชื่อนักศึกษาตามกลุ่มเรียน"}
          data={studentList}
          columns={columns}
          options={{
            elevation: 0,
            download: false,
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
      {showDialog && <ImportResultModal open={showDialog} handleDialogClose={setShowDialogClose} data={resultData}></ImportResultModal>}
    </div>
  )
}