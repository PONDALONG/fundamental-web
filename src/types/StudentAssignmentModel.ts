import { FileResourceModel } from "./AssignmentModel"

export class StudentAssignmentModel {
    stdAsmId: number = 0
    stdAsmResult: null | string = ""
    stdAsmStatus: string = "WAITING"
    stdAsmGroup: null | string = ""
    stdAsmDateTime: Date | string = ""
    stdAsmScore: number = 0
    fileResources = new Array<FileResourceModel>()
}