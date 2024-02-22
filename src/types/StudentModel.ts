import { RoomModel } from "./RoomModel";
import { UserModel } from "./userModel";

export class StudentSectionModel {
  userId: number = 0;
  studentNo: string = "";
  nameTH: string = "";
  nameEN: string = "";
}

export class StudentGroupResponseModel {
  stdAsmId: number = 0;
  stdAsmResult: string | null = null;
  stdAsmStatus: string = "WATING";
  stdAsmGroup: string | null = null;
  stdAsmDateTime: Date | string = "";
  stdAsmScore: number = 0;
  student: StudentModel = new StudentModel();
}

export class StudentModel {
  studentId: number = 0;
  studentDate: string | Date = "";
  studentStatus: string = "ACTIVE";
  user: UserModel = new UserModel();
  room: RoomModel = new RoomModel()
}

export class StudentGroupModel {
  stdAsmId: number = 0;
  studentId: number = 0;
  studentNo: string = "";
  studentName: string = "";
  stdAsmGroup: string | null = "";
}

export class StudentSubmitIndividualModel {
  stdAsmId: number = 0
  studentNo: string = ""
  stdAsmStatus: string = "WATING"
  stdAsmScore: number = 0
  stdAsmDateTime: string | Date = ""
  stdName: string = ""
}

export class StudentSubmitGroupModel {
    stdAsmId: number = 0
    stdAsmGroup: string | null = ""
    memberStdNumber = new Array<string>()
    memberName = new Array<string>()
    stdAsmScore: number = 0
    stdAsmDateTime: string[] | Date[] = []
    stdAsmStatus: string = ""
}

export class StudentAssignmentGroupResponseModel {
    studentAssignments = new Array<StudentGroupResponseModel>()
    stdAsmGroup: string | null = ""
}
