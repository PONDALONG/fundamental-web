export class UserModel {
  userId: number = 0;
  nameTH: string = "";
  nameEN: string = "";
  studentNo: string = "";
  role: string = "STUDENT";
  userStatus: string = "ACTIVE";
  createDate: Date | string = "";
  image: string | null = "";
}
