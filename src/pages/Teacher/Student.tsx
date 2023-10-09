import { FormControl, MenuItem, Select, Button, Box } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react'
import { StudentSectionModel } from '../../types/StudentModel'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom';

export default function Student() {
  const navigate = useNavigate()
  const [studentList, setStudentList] = useState<StudentSectionModel[]>([])

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
      name: "firstname",
      label: "ชื่อ",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "lastname",
      label: "นามสกุล",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "level",
      label: "สาขาวิขา",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "section",
      label: "กลุ่มเรียน",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "id",
      label: "จัดการ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: number) => {
          return (
            <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={1} justifyContent={"center"} alignItems={"center"} width={'100%'}>
              <Button fullWidth color='info' variant='contained' onClick={() => navigate('/teacher/student/1')}>
                รายละเอียด
              </Button>
              <Button fullWidth color='warning' variant='contained'>
                แก้ไข
              </Button>
              <Button fullWidth color='error' variant='contained'>
                ลบ
              </Button>
            </Box>
          )
        }
      }
    },
  ];

  const onSearchClick = async () => {
    let temp: StudentSectionModel[] = []
    for (let i = 0; i < 10; i++) {
      temp.push({
        id: (i + 1),
        studentId: '611111111111-10',
        firstname: 'วินัย',
        lastname: 'ใจบุญ',
        level: 'ECP4N',
        section: 'ECP1N 2/2566'
      })
    }
    setStudentList(temp)
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
                defaultValue={'ECP4N'}
              >
                <MenuItem value={'ECP4N'}>ECP4N</MenuItem>
                <MenuItem value={'ECP3N'}>ECP3N</MenuItem>
                <MenuItem value={'ECP1N'}>ECP1N</MenuItem>
              </Select>
            </FormControl>
          </div>
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