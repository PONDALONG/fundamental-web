import { Button, IconButton, Switch, TextField, Tooltip, Typography, Box, FormControl } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import * as yup from "yup";
import { Formik } from "formik";
import dayjs from 'dayjs'
import React, { useState, useRef, useEffect } from 'react'
import TextEditor from '../../components/TextEditor'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ensureRemove, successAlert, waringAlert } from '../../utils/SweetAlert';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIDataTable from 'mui-datatables'
import axios from 'axios';
import { AssignmentModel } from '../../types/AssignmentModel';
import { StudentGroupModel, StudentGroupResponseModel } from '../../types/StudentModel';

const assignmentDetailSchema = yup.object().shape({
  assignmentName: yup.string().required("กรุณากรอกชื่อแบบฝึกหัด"),
  assignmentScore: yup.number().required('กรุณากรอกคะแนนแบบฝึกหัด')
})


function AssigmentDetail() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams()
  const params = {
    group: searchParams.get('group') || null,
    year: searchParams.get('year') || null,
    term: searchParams.get('term') || null,
    roomId: searchParams.get('roomId') || null,
  }
  const [assignmentStatus, setAssignmentStatus] = useState<boolean>(true)
  const [assignmentType, setAssignmentType] = useState<string>('INDIVIDUAL')
  const [endDate, setEndDate] = useState(dayjs(new Date()))
  const contentText = useRef("")
  const [file, setFile] = useState<File[]>([])
  const [assignmentDetailForm, setAssignmentDetailForm] = useState<AssignmentModel>(new AssignmentModel())
  const [resourceDelete, setResourceDelete] = useState<number[]>([])
  const [studentGroup, setStudentGroup] = useState<StudentGroupModel[]>([])

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
      name: "studentName",
      label: "ชื่อ-สกุล",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: string, tableMeta: any, updateValue: any) => {
          return (
            <div className='flex flex-col'>
              <span>{value}</span>
            </div>
          )
        }
      }
    },
    {
      name: "studentGroup",
      label: 'กลุ่ม',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number, tableMeta: any, updateValue: any,) => {
          return (
            <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={{ xs: "100%", lg: "50%" }} maxWidth={"70px"}>
              <FormControl>
                <TextField
                  variant="outlined"
                  type={"text"}
                  label="กลุ่ม"
                  onChange={(e) => updateValue(onInputStudentGroupChange(e.target.value, tableMeta.rowIndex))}
                  value={studentGroup[tableMeta.rowIndex].stdAsmGroup || ''}
                ></TextField>
              </FormControl>
            </Box>
          )
        }
      }
    }
  ];

  useEffect(() => {
    if (!params.group || !params.year || !params.term || !params.roomId) {
      navigate('/teacher/assignment')
    }
    if (!!id) {
      findById(id)
    }
  }, [])

  const findById = async (id: string | number) => {
    try {
      const response = await axios.get(`/assignment/find?assignmentId=${id}`)
      if (response && response.status === 200) {
        setAssignmentDetailForm(response.data as AssignmentModel)
        contentText.current = response.data.assignmentDescription
        setAssignmentStatus(response.data.assignmentStatus === 'OPEN')        
        setAssignmentType(response.data.assignmentType)
        if ((response?.data?.assignmentType as string).toLocaleUpperCase() === 'GROUP') {
          findStudentAssignment()
        }
      } else if (!!!response) {
        navigate(`/teacher/assignment?group=${params.group}&year=${params.year}&term=${params.term}&roomId=${!!params.roomId ? params.roomId : ''}`)
      }
    } catch (error) {
    }
  }

  const onContentTextChange = (data: string) => {
    contentText.current = data
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile([...file, e.target.files[0]]);
    }
  };

  const onRemoveFile = async (indexOfFile: number) => {
    const confirm = await ensureRemove("ต้องการลบไฟล์ใช่หรือไม่?")
    if (confirm.isConfirmed) {
      setFile(file.filter((f: File, index) => index != indexOfFile))
    }

  }

  const onRemoveResouce = async (fielResourceId: number) => {
    const ensure = await ensureRemove('ต้องการลบไฟล์ใช่หรือไม่')
    if (ensure.isConfirmed) {
      setResourceDelete([...resourceDelete, fielResourceId])
      const assignment = assignmentDetailForm
      assignment.fileResources = assignment.fileResources.filter((resource) => resource.fileResourceId != fielResourceId)
      setAssignmentDetailForm(assignment)
    }
  }



  const onSubmitAssigmentDetail = async (value: AssignmentModel) => {
    if (isNaN(Number(value.assignmentScore)) || Number(value.assignmentScore) <= 0) {
      waringAlert('กรุณากรอกคะแนน')
      return
    }
    const assignment = new AssignmentModel()
    assignment.assignmentName = value.assignmentName
    assignment.assignmentDescription = contentText.current
    assignment.assignmentScore = Number(value.assignmentScore)
    assignment.assignmentEndDate = endDate.toDate().toISOString()
    assignment.assignmentStatus = assignmentStatus ? 'OPEN' : 'CLOSE'
    assignment.assignmentType = assignmentType
    assignment.assignmentStartDate = new Date().toISOString()
    assignment.assignmentId = value.assignmentId
    assignment.roomId = value.roomId
    console.log(assignment);

    if (!!id) {
      await updateAssignment(assignment)
    } else {
      await createAssignment(assignment)
    }
    setFile([])
    setResourceDelete([])
  }

  const updateAssignment = async (data: AssignmentModel) => {
    try {
      let formData = new FormData()
      formData.append('assignmentId', data.assignmentId.toString())
      formData.append('assignmentName', data.assignmentName)
      formData.append('assignmentDescription', data.assignmentDescription)
      formData.append('assignmentScore', data.assignmentScore.toString())
      formData.append('assignmentStartDate', data.assignmentStartDate.toString())
      formData.append('assignmentEndDate', data.assignmentEndDate.toString())
      formData.append('assignmentType', data.assignmentType)
      formData.append('assignmentStatus', data.assignmentStatus)
      formData.append('deleteFileIds', JSON.stringify(resourceDelete))
      formData.append('roomId', String(data.roomId))
      if (file && file.length > 0) {
        for (let f of file) {
          formData.append('files', f)
        }
      }
      const response = await axios.post('/assignment/update', formData)
      if (response && response.status === 200) {
        await successAlert(response.data.message)
        if (!!id) {
          findById(id)
        }
      }
    } catch (error) {
    }
  }

  const createAssignment = async (data: AssignmentModel) => {
    try {
      let formData = new FormData()
      formData.append('assignmentId', data.assignmentId.toString())
      formData.append('assignmentName', data.assignmentName)
      formData.append('assignmentDescription', data.assignmentDescription)
      formData.append('assignmentScore', data.assignmentScore.toString())
      formData.append('assignmentStartDate', data.assignmentStartDate.toString())
      formData.append('assignmentEndDate', data.assignmentEndDate.toString())
      formData.append('assignmentType', data.assignmentType)
      formData.append('assignmentStatus', data.assignmentStatus)
      formData.append('roomId', String(params.roomId))
      if (file && file.length > 0) {
        for (let f of file) {
          formData.append('files', f)
        }
      }
      const response = await axios.post('/assignment/create', formData)
      if (response && response.status === 200) {
        await successAlert(response.data.message)
        if (response.data.assignmentId) {
          window.location.href = `/teacher/assignment-detail/${response.data.assignmentId as number}?group=${params.group}&year=${params.year}&term=${params.term}&roomId=${!!params.roomId ? params.roomId : ''}`
        }
      }
    } catch (error) {

    }
  }

  const onInputStudentGroupChange = (value: string, index: number) => {
    let group = studentGroup
    let newStudentGroup = group[index]
    newStudentGroup.stdAsmGroup = value
    group[index] = newStudentGroup
    setStudentGroup(group)
  }

  const onAssignmentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentType(e.target.value)
    if (e.target.value.toUpperCase() === 'GROUP' && !!id) {
      findStudentAssignment()
    }
  }

  const findStudentAssignment = async () => {
    await axios.get(`/student-assignment/find-student?assignmentId=${id}`).then((res) => {
      if (res && res.status == 200) {
        const data = res.data as StudentGroupResponseModel[]
        const tempData: StudentGroupModel[] = data.map((d) => {
          const temp: StudentGroupModel = {
            stdAsmId: d.stdAsmId,
            studentId: d.student.studentId,
            studentName: d.student.user.nameTH,
            studentNo: d.student.user.studentNo,
            stdAsmGroup: d.stdAsmGroup
          }
          return temp
        })
        setStudentGroup(tempData)
      }
    })
  }

  const saveStudentGroup = async () => {
    try {
      const response = await axios.post(`/student-assignment/form-into-groups`, studentGroup)
      if (response && response.status === 200) {
        findStudentAssignment()
      }
    } catch (error) {

    }
  }


  return (
    <div className='flex flex-col gap-2 px-2'>
      <div className='flex gap-2 my-3 font-bold'>
        <span className='text-gray-400 hover:text-gray-700 duration-300 cursor-pointer' onClick={() => navigate(`/teacher/assignment?group=${params.group}&year=${params.year}&term=${params.term}&roomId=${!!params.roomId ? params.roomId : ''}`)}>Assignment</span>
        <span className='text-gray-400'>{'>'}</span>
        <span className='text-gray-400'>Assignment Detail</span>
      </div>
      <div className='w-full flex flex-col justify-center items-center gap-3 relative py-3'>
        <div className='absolute top-1 right-1 md:right-[20%] flex justify-center items-center'>
          <span className='hidden lg:block mr-2'>สถานะแบบฝึกหัด: </span>
          <span className='font-bold text-red-500'>ปิด</span>
          <Switch color='success' checked={assignmentStatus} onChange={() => setAssignmentStatus(!assignmentStatus)} />
          <span className='font-bold text-green-500'>เปิด</span>
        </div>
        <Formik
          onSubmit={onSubmitAssigmentDetail}
          initialValues={assignmentDetailForm}
          validationSchema={assignmentDetailSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit} className='w-[90%] md:w-[60%] flex flex-col justify-start gap-5'>
              <div className='flex flex-col gap-3'>
                <label className='font-bold text-primary'>ชื่อแบบฝึกหัด</label>
                <TextField label="ชื่อแบบฝึกหัด" variant="standard" required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name='assignmentName'
                  value={values.assignmentName}
                  error={!!touched.assignmentName && !!errors.assignmentName}
                  helperText={touched.assignmentName && errors.assignmentName}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='flex flex-col gap-2'>
                  <label className='font-bold text-primary'>กำหนดส่ง</label>
                  <DateTimePicker
                    label="กำหนดส่ง"
                    defaultValue={endDate}
                    onChange={(e) => setEndDate(dayjs(e))}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='font-bold text-primary'>คะแนน</label>
                  <TextField label="คะแนน" variant="outlined" required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='assignmentScore'
                    value={values.assignmentScore}
                    error={!!touched.assignmentScore && !!errors.assignmentScore}
                    helperText={touched.assignmentScore && errors.assignmentScore}
                  />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <label className='font-bold text-primary'>ประเภทงาน</label>
                <RadioGroup
                  defaultValue="INDIVIDUAL"
                  value={assignmentType}
                  row
                  onChange={(e) => onAssignmentTypeChange(e)}
                >
                  <FormControlLabel value="INDIVIDUAL" control={<Radio />} label="เดี่ยว" />
                  <FormControlLabel value="GROUP" control={<Radio />} label="กลุ่ม" />
                </RadioGroup>
              </div>
              {(!!id && assignmentType === 'GROUP') && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography className='font-bold' >จัดการกลุ่ม</Typography>
                  </AccordionSummary>
                  <AccordionDetails className='flex flex-col gap-2'>
                    <div className='w-full'>
                      <MUIDataTable
                        title={"รายชื่อกลุ่มงาน"}
                        data={studentGroup}
                        columns={columns}
                        options={{
                          elevation: 0,
                          filter: false, print: false,
                          download: false,
                          selectableRows: 'none',
                          textLabels: {
                            body: {
                              noMatch: 'ไม่พบข้อมูล'
                            }
                          },
                          pagination: false
                        }}
                      />
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                      <Button type='submit' variant='contained' color='success' onClick={saveStudentGroup} >บันทึก</Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}

              <div className='w-full'>
                <TextEditor sendData={onContentTextChange} data={contentText.current} />
                {/* <TextEditor sendData={onContentTextChange} data={assignmentDetailForm.assignmentDescription} /> */}
              </div>
              <div className='w-full flex flex-col gap-2 mt-16 lg:mt-10 py-3'>
                <span className='font-bold text-primary'>อัปโหลดไฟล์</span>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                  {(assignmentDetailForm.fileResources && assignmentDetailForm.fileResources.length > 0)
                    && assignmentDetailForm.fileResources.map((resource, index) => (
                      <div key={index} className='relative group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-slate-500 duration-300 break-all'>
                        <DeleteIcon
                          onClick={() => onRemoveResouce(resource.fileResourceId)}
                          className='absolute top-1 right-1 w-5 h-5 hover:text-red-500 hover:scale-150 duration-1000 cursor-pointer' />
                        <Typography variant='inherit' noWrap whiteSpace={'unset'}>{resource.fileResourceName}</Typography>
                        <a className='text-xs' target='_blank' href={`${import.meta.env.VITE_API_ENDPOINT}/${resource.fileResourcePath}`}>ดาวน์โหลด</a>
                      </div>
                    ))}

                  {(file && file.length > 0) && file.map((f: File, index) => (
                    <div key={index} className='relative group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-slate-500 duration-300 break-all'>
                      <DeleteIcon
                        onClick={() => onRemoveFile(index)}
                        className='absolute top-1 right-1 w-5 h-5 hover:text-red-500 hover:scale-150 duration-1000 cursor-pointer' />

                      <Typography variant='inherit' noWrap whiteSpace={'unset'} >{f.name}</Typography>
                    </div>
                  ))}
                  <Tooltip title="อัปโหลดไฟล์" placement='top-end'>
                    <label htmlFor="upload-file">
                      <div className='group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-slate-500 duration-300'>
                        <AddIcon className='group-hover:text-white' />
                      </div>
                      <input className='hidden' onChange={handleFileChange} type="file" id='upload-file' />
                    </label>
                  </Tooltip>
                </div>
              </div>
              <div className='flex justify-center items-center gap-2'>
                <Button type='submit' variant='contained' color='success'>บันทึก</Button>
                <Button variant='contained' color='inherit' onClick={() => navigate(`/teacher/assignment?group=${params.group}&year=${params.year}&term=${params.term}&roomId=${!!params.roomId ? params.roomId : ''}`)}>ยกเลิก</Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AssigmentDetail