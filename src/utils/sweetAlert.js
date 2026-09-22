import { toast } from "sonner";
import Swal from "sweetalert2";

const CONFIRM_DIALOG_THEME = {
  icon: "warning",
  color: "white",
  background: "#111927",
  showCancelButton: true,
  confirmButtonColor: "#9e77ed",
  cancelButtonColor: "#1C2536",
  heightAuto: false,
  width: "30em",
  allowOutsideClick: false,

  customClass: {
    container: "custom-container",
    title: "custom-title",
    htmlContainer: "custom-text",
    icon: "custom-icon",
    confirmButton: "custom-confirm-btn",
    cancelButton: "custom-cancel-btn",
  },
};

const loadingButtonHtml = (label) => `
  <div class="mui-btn-content">
    <span class="mui-spinner"></span>
    <span class="mui-label">${label}</span>
  </div>
`;

export const showConfirmAction = async ({ title = "Are you sure?", text = "", icon = "", confirmButtonText = "Confirm", cancelButtonText = "Cancel", loadingText = "Processing...", onConfirm }) => {
  const result = await Swal.fire({
    ...CONFIRM_DIALOG_THEME,

    title,
    text,
    icon,

    confirmButtonText,
    cancelButtonText,

    preConfirm: async () => {
      const confirmButton = Swal.getConfirmButton();

      confirmButton.disabled = true;
      confirmButton.innerHTML = loadingButtonHtml(loadingText);

      try {
        await onConfirm();

        return true;
      } catch (error) {
        console.log("SweetAlert Error: ", error);

        confirmButton.disabled = false;
        confirmButton.innerHTML = confirmButtonText;

        // Swal.showValidationMessage(error?.data?.errors?.message || error?.message || "Something went wrong.");
        toast.error("Error!", { description: error?.data?.errors?.message || error?.message || "Something went wrong." });

        return false;
      }
    },
  });

  return result.isConfirmed;
};
