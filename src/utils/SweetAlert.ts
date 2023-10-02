import Swal from 'sweetalert2'

export const successAlert = (msg: string) => {
    return Swal.fire({
        title: 'Success',
        text: msg,
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
    })
}

export const waringAlert = (msg: string) => {
    return Swal.fire({
        title: 'Warning',
        text: msg,
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
        timer: 5000
    })
}

export const logoutAlert = () => {
    return Swal.fire({
      title: "Sign out",
      text: "คุณต้องการออกจากระบบใช่หรือไม่ ?",
      icon: "question",
      showConfirmButton: true,
      confirmButtonText: "ใช่",
      showCancelButton: true,
      cancelButtonText: "ไม่"
    })
}

export const ensureRemove = (msg: string) => {
    return Swal.fire({
        title: "Are you sure ?",
        text: msg,
        icon: "question",
        showConfirmButton: true,
        confirmButtonText: "ใช่",
        showCancelButton: true,
        cancelButtonText: "ไม่"
    })
}