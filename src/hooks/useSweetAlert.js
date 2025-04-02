import Swal from "sweetalert2";

const useSweetAlert = () => {
  const toast = ({
    title = "Success!",
    text = "Added successfully!",
    icon = "success",
    background = "#602120",
  }) =>
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      background: background,
      color: "#EDF2F7",

      customClass: {
        container: "toast-container",
        popup: "toast-popup",
        icon: "toast-icon",
        title: "toast-title",
        htmlContainer: "toast-htmlcontainer",
        actions: "toast-actions",
        confirmButton: "toast-confirm",
        cancelButton: "toast-cancel",
      },

      toast: true,
      timer: 3000,
      position: "top-end",

      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      showConfirmButton: false,
    });
  return { toast };
};

export default useSweetAlert;
