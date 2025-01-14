import Swal from "sweetalert2"
import Definer from "./Definer"

export const sweetErrorHandling = async (err: any, sweet_off: boolean = false, duration:number=0) => {
    let error_message = err.message.includes("att") ? err.message : Definer.general_err1;
    if (sweet_off) {
        alert(error_message);
    } else {
        await Swal.fire({
            icon: "error",
            text: error_message.split(":")[1],
            showConfirmButton: false,
            timer:duration
        })
    }
}

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000, reload: boolean = false) => {
    await Swal.fire({
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: duration,
        customClass: {
            popup: 'custom-swal-popup'
        }
    })
    if (reload) {
        window.location.reload()
    }
}

export const sweetTopSmallSuccessAlert = async (msg: string, duration: number = 2000, enable_forward: boolean = true) => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        icon: "success",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: duration
    })
    Toast.fire({
        icon: "success",
        title: msg
    }).then(data => {
        if (enable_forward) {
            window.location.reload()
        }
    })
}

export const sweetFailureProvider = (
    msg: string,
    show_button: boolean = false,
    enable_forward: boolean = false,
    forward_url: string = "/"
) => {
    Swal.fire({
        icon: "error",
        title: msg,
        showConfirmButton: show_button,
        confirmButtonText: "OK",
    }).then((data) => {
        if (enable_forward) {
            window.location.replace(forward_url);
        }
    });
};