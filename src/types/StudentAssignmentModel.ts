import { FileResourceModel } from "./AssignmentModel"
import { UserModel } from "./userModel"

export class StudentAssignmentModel {
    stdAsmId: number = 0
    stdAsmResult: null | string = ""
    stdAsmStatus: string = "WAITING"
    stdAsmGroup: null | string = ""
    stdAsmDateTime: Date | string = ""
    stdAsmScore: number = 0
    fileResources = new Array<FileResourceModel>()
}


export class SubmittedAssignmentGroupModel {
        stdAsmId: number = 0
        stdAsmResult: string = ""
        stdAsmStatus: string = "SUBMITTED"
        stdAsmGroup: string = ""
        stdAsmDateTime: string | Date = ""
        stdAsmScore: number = 0
        assignment = {
            assignmentId: 0,
            assignmentName: "",
            assignmentDescription: "",
            assignmentScore: 0,
            assignmentStatus: "",
            assignmentType: "",
            assignmentStartDate: "",
            assignmentEndDate: "",
        }
        student = {
            studentId: 0,
            user: {
                userId: 0,
                nameTH: "",
                nameEN: "",
                studentNo: "",
                role: "",
                userStatus: "",
                createDate: "",
                image: ""
            }
        }
        fileResources = new Array<FileResourceModel>()
        studentInGroup = new Array<UserModel>()
}

export class SubmittedAssignmentIndividualModel {
        stdAsmId: number = 0
        stdAsmResult: string = ""
        stdAsmStatus: string = "SUBMITTED"
        stdAsmGroup: string = ""
        stdAsmDateTime: string | Date = ""
        stdAsmScore: number = 0
        assignment = {
            assignmentId: 0,
            assignmentName: "",
            assignmentDescription: "",
            assignmentScore: 0,
            assignmentStatus: "",
            assignmentType: "",
            assignmentStartDate: "",
            assignmentEndDate: "",
        }
        student = {
            studentId: 0,
            user: {
                userId: 0,
                nameTH: "",
                nameEN: "",
                studentNo: "",
                role: "",
                userStatus: "",
                createDate: "",
                image: ""
            }
        }
        fileResources = new Array<FileResourceModel>()
}