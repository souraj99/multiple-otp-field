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
      placeholderValue = "",
      ...inputProps
    },
    ref
  ) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isPastingRef = useRef<boolean>(false);

    useEffect(() => {
      if (inputRefs.current[0] && !disabled) {
        inputRefs.current[0].focus();
      }
    }, [disabled]);

    // Web OTP API for automatic OTP detection from SMS
    useEffect(() => {
      if (disabled || typeof window === "undefined") return;

      const ac = new AbortController();
      abortControllerRef.current = ac;

      // Check if Web OTP API is available
      if ("OTPCredential" in window) {
        navigator.credentials
          .get({
            // @ts-ignore - OTPCredential might not be in all TypeScript definitions
            otp: { transport: ["sms"] },
            signal: ac.signal,
          })
          .then((credential: any) => {
            if (credential && credential.code) {
              const code = credential.code;
              const numericData = code.replace(/\D/g, "");
              if (numericData.length > 0) {
                const newOtp = Array(length).fill("");
                const pastedChars = numericData.slice(0, length).split("");
                pastedChars.forEach((char: string, idx: number) => {
                  if (idx < length) {
                    newOtp[idx] = char;
                  }
                });
                setOtp(newOtp);

                // Focus last input or next empty
                const nextEmptyIndex = newOtp.findIndex((val) => !val);
                const focusIndex =
                  nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
                inputRefs.current[focusIndex]?.focus();

                const combinedOtp = newOtp.join("");
                if (combinedOtp.length === length) {
                  onOtpSubmit(combinedOtp);
                }
              }
            }
          })
          .catch((err: Error) => {
            // Ignore abort errors and when API is not available
            if (err.name !== "AbortError") {
              console.log("Web OTP API error:", err);
            }
          });
      }

      return () => {
        ac.abort();
        abortControllerRef.current = null;
      };
    }, [disabled, length, onOtpSubmit]);

    const handleChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      // Skip if we're in the middle of a paste operation
      if (isPastingRef.current) {
        return;
      }

      const value = event.target.value;

      // Handle paste operation with multiple characters
      if (value.length > 1) {
        const numericData = value.replace(/\D/g, "");
        if (numericData.length === 0) return;

        const newOtp = [...otp];
        const chars = numericData.slice(0, length - index).split("");

        chars.forEach((char: string, idx: number) => {
          if (index + idx < length) {
            newOtp[index + idx] = char;
          }
        });

        setOtp(newOtp);

        // Focus on the next empty field or the last field
        const nextEmptyIndex = newOtp.findIndex((val) => !val);
        const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();

        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
          onOtpSubmit(combinedOtp);
        }
        return;
      }

      // Handle single character input
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

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      event.preventDefault();

      const pastedData = event.clipboardData.getData("text/plain").trim();
      // Filter only numeric characters
      const numericData = pastedData.replace(/\D/g, "");

      if (numericData.length === 0) return;

      // Set flag to prevent handleChange from interfering
      isPastingRef.current = true;

      // Start from the beginning for complete OTP paste
      const newOtp = Array(length).fill("");
      const pastedChars = numericData.slice(0, length).split("");

      pastedChars.forEach((char: string, idx: number) => {
        if (idx < length) {
          newOtp[idx] = char;
        }
      });

      setOtp(newOtp);

      // Focus on the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;

      // Use setTimeout to ensure state update completes before resetting flag
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
        isPastingRef.current = false;
      }, 0);

      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === length) {
        onOtpSubmit(combinedOtp);
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
            value={value || undefined}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={inputClassName}
            disabled={disabled}
            {...inputProps}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            placeholder={placeholderValue}
          />
        ))}
      </div>
    );
  }
);

export default OtpInput;
