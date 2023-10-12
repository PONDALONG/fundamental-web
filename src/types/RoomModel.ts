export class RoomModel {
  roomId: number = 0
  roomYear: string = ""
  roomGroup: string = ""
  roomTerm: number = 1
  roomStatus: string = "CLOSED"
}


export class GroupListModel  {
  roomGroup: string = ""
}

export class YearListModel  {
  roomYear: string = ""
}

export class TermListModel {
  roomTerm: number | string = ""
}