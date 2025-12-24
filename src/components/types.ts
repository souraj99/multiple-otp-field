export interface OtpInputProps {
  /**
   * The number of OTP digits (input fields).
   * @default 4
   */
  length?: number;

  /**
   * Callback function that is triggered when the full OTP is entered.
   * Receives the complete OTP as a string.
   */
  onOtpSubmit?: (otp: string) => void;

  /**
   * CSS class name for individual OTP input fields.
   * @default "otpInput"
   */
  inputClassName?: string;

  /**
   * CSS class name for the container wrapping all OTP input fields.
   * @default "otpContainer"
   */
  containerClassName?: string;

  /**
   * If true, disables all OTP input fields.
   * @default false
   */
  disabled?: boolean;
  /**
   * Placeholder value for each OTP input field.
   * @default ""
   */
  placeholderValue?: string;
}

/**
 * Ref type for OtpInput component, exposing methods to interact with it.
 */
export interface OtpInputRef {
  /**
   * Resets the OTP input fields to an empty state.
   */
  reset: () => void;
}
