export interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
  inputClassName?: string;
  containerClassName?: string;
}

/**
 * OtpInput component for rendering a customizable OTP (One-Time Password) input field.
 * @param props - The properties passed to the component.
 * @param props.length - The number of OTP digits. Defaults to 4.
 * @param props.onOtpSubmit - Callback function called when all OTP digits are filled. Receives the complete OTP as a string.
 * @param props.inputClassName - CSS class name for individual input fields. Defaults to "otpInput".
 * @param props.containerClassName - CSS class name for the container div. Defaults to "otpContainer".
 * @returns A React component that renders an OTP input field.
 */
