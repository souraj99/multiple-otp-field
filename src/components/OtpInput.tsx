import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { OtpInputProps, OtpInputRef } from "./types";
import "./OtpInput.css";

const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  (
    {
      length = 4,
      onOtpSubmit = () => {},
      inputClassName = "otpInput",
      containerClassName = "otpContainer",
      disabled = false,
      ...inputProps
    },
    ref
  ) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
      if (inputRefs.current[0] && !disabled) {
        inputRefs.current[0].focus();
      }
    }, [disabled]);

    const handleChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      if (isNaN(Number(value))) return;

      const newOtp = [...otp];
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);

      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === length) {
        onOtpSubmit(combinedOtp);
      }

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleClick = (index: number) => {
      inputRefs.current[index]?.setSelectionRange(1, 1);
      if (index > 0 && !otp[index - 1]) {
        const firstEmptyIndex = otp.findIndex((val) => !val);
        if (firstEmptyIndex !== -1) {
          inputRefs.current[firstEmptyIndex]?.focus();
        }
      }
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (disabled) return;
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleReset = useCallback(() => {
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.focus();
    }, [length]);

    useImperativeHandle(ref, () => ({
      reset: handleReset,
    }));

    useEffect(() => {
      onOtpSubmit(otp.join(""));
    }, [otp, onOtpSubmit]);

    return (
      <div className={containerClassName}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            ref={(input) => (inputRefs.current[index] = input)}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={inputClassName}
            disabled={disabled}
            {...inputProps}
            inputMode="numeric"
          />
        ))}
      </div>
    );
  }
);

export default OtpInput;
