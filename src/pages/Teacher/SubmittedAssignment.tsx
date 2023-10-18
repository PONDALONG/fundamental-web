import React, {useEffect} from 'react'
import { Button, IconButton, Switch, TextField, Tooltip, Typography, InputAdornment } from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { SubmittedAssignmentGroupModel, SubmittedAssignmentIndividualModel } from '../../types/StudentAssignmentModel'
import CheckSubGroup from '../../components/CheckSubGroup'
import CheckSubIndividual from '../../components/CheckSubIndividual'
function SubmittedAssignment() {
    const navigte = useNavigate()
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const params = {
      type: searchParams.get('type') || null
    }
    const [submitAssignmentGroup, setSubmitAssignmentGroup] = useState<SubmittedAssignmentGroupModel>(new SubmittedAssignmentGroupModel())
    const [submitAssignmentIndividual, setSubmitAssignmentIndividual] = useState<SubmittedAssignmentIndividualModel>(new SubmittedAssignmentIndividualModel())
    useEffect(() => {
        if (!!id && !!params.type) {
            findSubmittedAssignment()
        } else {
            navigte(-1)
        }
    },[])

    const findSubmittedAssignment = async() => {
        try {
            const response = await axios.get(`/student-assignment/find?stdAsmId=${id}`)
            if (response && response.status === 200) {
                if (params.type?.toUpperCase() === 'GROUP') {
                    setSubmitAssignmentGroup(response.data as SubmittedAssignmentGroupModel)
                } else if (params.type?.toUpperCase() === 'INDIVIDUAL') {
                    setSubmitAssignmentIndividual(response.data as SubmittedAssignmentIndividualModel)
                }
                
            } else {
                navigte(-1)
            }
        } catch (error) {
            
        }
    }

    return (
        <div className='flex flex-col gap-2 px-2 w-full'>
            <h2 className='text-secondary'>การส่งงาน</h2>
           { !!params.type && params.type.toUpperCase() === 'GROUP' && <CheckSubGroup work={submitAssignmentGroup} ></CheckSubGroup>}
           { !!params.type && params.type.toUpperCase() === 'INDIVIDUAL' && <CheckSubIndividual work={submitAssignmentIndividual} ></CheckSubIndividual>}
        </div>
    )
}

export default SubmittedAssignment