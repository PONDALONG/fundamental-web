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
}

export class FileResourceModel {
    fileResourceId: number = 0
    fileResourceName: string = ""
    fileResourcePath: string = ""
    fileResourceType: string = ""
}