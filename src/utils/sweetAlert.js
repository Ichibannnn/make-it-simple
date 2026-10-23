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

export const confirmDeleteAttachment = async ({
  title = "Are you sure?",
  message = "Do you want to proceed with this action?",
  note = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "#9e77ed",
  allowOutsideClick = false,
  allowEscapeKey = true,
} = {}) => {
  const result = await Swal.fire({
    title,
    html: `
      <div class="confirm-action__body">
        <p class="confirm-action__message">${message}</p>
        ${note ? `<p class="confirm-action__note">${note}</p>` : ""}
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    reverseButtons: false,
    allowOutsideClick,
    allowEscapeKey,
    background: "#111927",
    customClass: {
      container: "confirm-action__container", // new
      popup: "confirm-action",
      title: "confirm-action__heading",
      htmlContainer: "confirm-action__content",
      actions: "confirm-action__actions",
      confirmButton: "confirm-action__confirm",
      cancelButton: "confirm-action__cancel",
    },
    didOpen: (popup) => {
      popup.style.setProperty("--confirm-action-color", confirmColor);
    },
  });

  return result.isConfirmed;
};
