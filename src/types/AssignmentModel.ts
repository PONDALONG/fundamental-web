export class AssignmentModel {
    assignmentId: number = 0
    assignmentName: string = ""
    assignmentDescription: string = ""
    assignmentScore: number = 0
    assignmentStatus: string = ""
    assignmentType: string = ""
    assignmentEndDate: Date | string = ""
    assignmentStartDate: Date | string = ""
    roomId: number = 0
    fileResources =  new Array<FileResourceModel>()
    studentAssignments = new Array<StudentAssignmentModel>()
}

export class FileResourceModel {
    fileResourceId: number = 0
    fileResourceName: string = ""
    fileResourcePath: string = ""
    fileResourceType: string = ""
}
export class StudentAssignmentModel {
    stdAsmId: number = 0
    stdAsmResult: null | string = ""
    stdAsmStatus: string = "WAITING"
    stdAsmGroup: null | string = ""
    stdAsmDateTime: Date | string = ""
    stdAsmScore: number = 0
    fileResources = new Array<FileResourceModel>()
}
