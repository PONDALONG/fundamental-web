import React, { useEffect, useState } from 'react'
import { FormControl, MenuItem, Select, Button, Box, TextField, Input, InputAdornment } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SubmittedGroup from '../../components/SubmittedGroup'
import { StudentAssignmentGroupResponseModel, StudentSubmitGroupModel } from '../../types/StudentModel'
import axios from 'axios'
import SubmitIndividual from '../../components/SubmittedIndividual'
function SubbmitedAssignmentList() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const params = {
        group: searchParams.get('group') || null,
        year: searchParams.get('year') || null,
        term: searchParams.get('term') || null,
        roomId: searchParams.get('roomId') || null,
        type: searchParams.get('type') || null
    }

    useEffect(() => {
        if (!id) {
            backPageClick()
        }

    }, [])

    const backPageClick = () => {
        navigate(`/teacher/assignment?group=${params.group}&year=${params.year}&term=${params.term}&roomId=${!!params.roomId ? params.roomId : ''}`)
    }

    return (
        <div className='flex flex-col gap-2 px-2 w-full'>
            <h2 className='text-secondary'>การส่งงาน</h2>
            {!!params.type && params.type.toUpperCase() === 'GROUP' && <SubmittedGroup assignmentId={Number(id)}></SubmittedGroup>}
            { !!params.type && params.type.toUpperCase() === 'INDIVIDUAL' && (
                <SubmitIndividual assignmentId={Number(id)} ></SubmitIndividual>
            ) }
            <div className='w-full flex gap-2 items-center'>
                <Button variant='contained' color='inherit' onClick={backPageClick}>กลับ</Button>
            </div>
        </div>
    )
}

export default SubbmitedAssignmentList