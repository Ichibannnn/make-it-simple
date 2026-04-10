import Swal from "sweetalert2";

export const sweetAlertDialog = async ({ title, text, icon = "warning", confirmButtonText = "Yes", cancelButtonText = "Cancel", onConfirm, showLoaderOnConfirm }) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,

    color: "white",
    background: "#111927",
    heightAuto: false,
    width: "30em",
    allowOutsideClick: false,

    confirmButtonColor: "#9e77ed",
    cancelButtonColor: "#1C2536",
    reverseButton: true,

    customClass: {
      container: "custom-container",
      title: "custom-title",
      htmlContainer: "custom-text",
      icon: "custom-icon",
      confirmButton: "custom-confirm-btn",
      cancelButton: "custom-cancel-btn",
    },

    showLoaderOnConfirm,

    preConfirm: async () => {
      if (!onConfirm) return true;

      try {
        return await onConfirm();
      } catch (error) {
        Swal.showValidationMessage(error?.data?.error?.message || "Something went wrong");
        return false;
      }
    },
  });

  return result;
};
