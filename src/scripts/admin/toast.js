import { elements } from "./elements.js";

const SUCCESS_DURATION_MS = 3500;
const ERROR_DURATION_MS = 6000;

let hideTimer;

export function showToast(message, { isError = false } = {}) {
  const { toast } = elements;
  toast.textContent = message;
  toast.className = isError ? "toast bad" : "toast";
  toast.hidden = false;

  clearTimeout(hideTimer);
  hideTimer = setTimeout(
    () => {
      toast.hidden = true;
    },
    isError ? ERROR_DURATION_MS : SUCCESS_DURATION_MS,
  );
}

export function showErrorToast(message) {
  showToast(message, { isError: true });
}
