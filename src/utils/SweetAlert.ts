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

export const ImageViewAlert = (url: string) => {
    return Swal.fire({
        width:'500px',
        imageWidth: '100%',
        imageHeight: '80%',
        imageUrl: url,
        showConfirmButton:false,
        background:'rgba(0, 0, 0, 0)',
        backdrop:'rgba(0, 0, 0, 0.9)',
      })
  }