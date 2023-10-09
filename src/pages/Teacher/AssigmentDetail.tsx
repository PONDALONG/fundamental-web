import { Button, IconButton, Switch, TextField, Tooltip, Typography, Box } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import * as yup from "yup";
import { Formik } from "formik";
import dayjs from 'dayjs'
import React, { useState, useRef, useEffect } from 'react'
import TextEditor from '../../components/TextEditor'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ensureRemove } from '../../utils/SweetAlert';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIDataTable from 'mui-datatables'

const assignmentDetailSchema = yup.object().shape({
  title: yup.string().required("กรุณากรอกชื่อแบบฝึกหัด"),
  due: yup.string().required("กรุณาเลือกวันกำหนดส่ง"),
  score: yup.number().required('กรุณากรอกคะแนนแบบฝึกหัด')
})


function AssigmentDetail() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [assignmentStatus, setAssignmentStatus] = useState<boolean>(true)
  const [assignmentType, setAssignmentType] = useState<string>('INVIDUAL')
  const contentText = useRef("")
  const [file, setFile] = useState<File[]>([])
  const [initAssignmentDetailForm, setAssignmentDetailForm] = useState({
    title: "",
    due: dayjs(new Date()),
    score: ""
  })
  const [studentGroup, setStudentGroup] = useState(
    [
      {
        studentId: '123',
        name: 'winai jaibun',
        id: 1,
        group: '',
      },
      {
        studentId: '1234',
        name: 'winai jaibun',
        id: 2,
        group: '',
      },
      {
        studentId: '12345',
        name: 'winai jaibun',
        id: 3,
        group: '',
      },
    ]
  )
  const columns = [
    {
      name: "studentId",
      label: "รหัสนักศึกษา",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "name",
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
      name: "group",
      label: 'กลุ่ม',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number, tableMeta: any, updateValue: any,) => {
          return (
            <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={{ xs: "100%", lg: "50%" }} maxWidth={"70px"}>
              <TextField
                variant="outlined"
                type={"text"}
                label="กลุ่ม"
                onChange={(e) => updateValue(onInputStudentGroupChange(e.target.value, tableMeta.rowIndex))}
                value={studentGroup[tableMeta.rowIndex].group}
              ></TextField>
            </Box>
          )
        }
      }
    }
  ];

  useEffect(() => {
    console.log(id);
  }, [assignmentStatus])

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

  const onSubmitAssigmentDetail = async (value: any) => {
    console.log(value);
  }

  const onInputStudentGroupChange = (value: string, index: number) => {
    let group = studentGroup
    let newStudentGroup = group[index]
    newStudentGroup.group = value
    group[index] = newStudentGroup
    setStudentGroup(group)
  }

  return (
    <div className='flex flex-col gap-2 px-2'>
      <div className='flex gap-2 my-3 font-bold'>
        <span className='text-gray-400 hover:text-gray-700 duration-300 cursor-pointer' onClick={() => navigate('/teacher/assignment')}>Assignment</span>
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
          initialValues={initAssignmentDetailForm}
          validationSchema={assignmentDetailSchema}>
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
                  name='title'
                  value={values.title}
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='flex flex-col gap-2'>
                  <label className='font-bold text-primary'>กำหนดส่ง</label>
                  <DateTimePicker
                    label="กำหนดส่ง"
                    defaultValue={initAssignmentDetailForm.due}
                    value={values.due}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='font-bold text-primary'>คะแนน</label>
                  <TextField label="คะแนน" variant="outlined" required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='score'
                    value={values.score}
                    error={!!touched.score && !!errors.score}
                    helperText={touched.score && errors.score}
                  />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <label className='font-bold text-primary'>ประเภทงาน</label>
                <RadioGroup
                  defaultValue="INVIDUAL"
                  row
                  onChange={(e) => setAssignmentType(e.target.value)}
                >
                  <FormControlLabel value="INVIDUAL" control={<Radio />} label="เดี่ยว" />
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
                          filter: false, print: false, downloadOptions: { filename: `รายชื่อนักเรียนที่ส่งงาน ecp1n 2/2566` },
                          download: false,
                          selectableRows: 'none',
                          textLabels: {
                            body: {
                              noMatch: 'ไม่พบข้อมูล'
                            }
                          }
                        }}
                      />
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                      <Button type='submit' variant='contained' color='success' >บันทึก</Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}

              <div className='w-full'>
                <TextEditor sendData={onContentTextChange} />
              </div>
              <div className='w-full flex flex-col gap-2 mt-16 lg:mt-10 py-3'>
                <span className='font-bold text-primary'>อัปโหลดไฟล์</span>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                  {(file && file.length > 0) && file.map((f: File, index) => (
                    <div key={index} className='relative group h-20 w-full border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer hover:bg-slate-500 duration-300'>
                      <DeleteIcon
                        onClick={() => onRemoveFile(index)}
                        className='absolute top-1 right-1 w-5 h-5 hover:text-red-500 hover:scale-150 duration-1000 cursor-pointer' />
                      {f.name}
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
                <Button type='submit' variant='contained' color='success' >บันทึก</Button>
                <Button variant='contained' color='inherit' onClick={() => navigate('/teacher/assignment')}>ยกเลิก</Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AssigmentDetail