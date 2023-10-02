import React from 'react'
import { Box, Button, Typography, Tooltip, IconButton } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function Content() {
    return (
        <div className='flex flex-col gap-3 px-2'>
            <h2 className='text-secondary'>เนื้อหารายวิชา</h2>
            <div className='flex items-center w-full'>
                <Button color='success' variant='contained'>เพิ่มเนื้อหา</Button>
            </div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6'>CH:1 Introduction to Computer Engineering</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free fro
                    </Typography>
                    <div className='grid grid-cols-1 gap-2 px-2 my-3'>
                        <div className='group cursor-pointer max-w-fit'>
                            <span className='flex items-center text-white bg-primary px-2 py-1 rounded-md group-hover:underline'>เอกสารบทที่1 <InsertDriveFileIcon fontSize='small' /></span>
                            
                        </div>
                        <Tooltip title="อัปโหลดไฟล์">
                            <div className='h-20 w-28 border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer'>
                                <IconButton>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6'>CH:1 Introduction to Computer Engineering</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free fro
                    </Typography>
                    <div className='grid grid-cols-1 gap-2 px-2 my-3'>
                        <div className='group cursor-pointer max-w-fit'>
                            <span className='flex items-center text-white bg-primary px-2 py-1 rounded-md group-hover:underline'>เอกสารบทที่1 <InsertDriveFileIcon fontSize='small' /></span>
                            
                        </div>
                        <Tooltip title="อัปโหลดไฟล์">
                            <div className='h-20 w-28 border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer'>
                                <IconButton>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6'>CH:1 Introduction to Computer Engineering</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free fro
                    </Typography>
                    <div className='grid grid-cols-1 gap-2 px-2 my-3'>
                        <div className='group cursor-pointer max-w-fit'>
                            <span className='flex items-center text-white bg-primary px-2 py-1 rounded-md group-hover:underline'>เอกสารบทที่1 <InsertDriveFileIcon fontSize='small' /></span>
                            
                        </div>
                        <Tooltip title="อัปโหลดไฟล์">
                            <div className='h-20 w-28 border-slate-400 border-solid border-[1px] rounded-lg flex justify-center items-center cursor-pointer'>
                                <IconButton>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div >
    )
}

export default Content