# Multiple OTP Field

A customizable and responsive OTP (One-Time Password) input component for React. This package provides an easy-to-use OTP input field that supports automatic focus movement, customizable length, and submission handling.

## Features

- **Customizable OTP length** (default is 4)
- **Auto-focuses on the next input field** when a digit is entered
- **Handles backspace** to move focus back to the previous field
- **Supports OTP submission callback** when the full OTP is entered
- **Includes a reset function via ref**
- **Fully responsive and adaptable to various screen sizes**
- **Prevents non-numeric input**
- **Disables input fields when needed**
- **Auto paste support** – automatically fills all fields when pasting an OTP code

## Installation

To install this package, run the following command in your project directory:

```bash
npm install multiple-otp-field
```

Or if you’re using Yarn:

```bash
yarn add multiple-otp-field
```

## Usage

### Basic Example

Here’s how to use the OTP input component in your React app.

#### 1. **Import the OTP input component:**

```tsx
import OtpInput from "multiple-otp-field";
```

#### 2. **Use the component in your app:**

```tsx
import React, { useRef } from "react";
import OtpInput from "multiple-otp-field";

const App: React.FC = () => {
  const otpRef = useRef<{ reset: () => void } | null>(null);

  const handleOtpSubmit = (otp: string) => {
    console.log("Submitted OTP:", otp);
  };

  return (
    <div>
      <h1>Enter OTP</h1>
      <OtpInput length={6} onOtpSubmit={handleOtpSubmit} ref={otpRef} />
      <button onClick={() => otpRef.current?.reset()}>Reset OTP</button>
    </div>
  );
};

export default App;
```

### Props

The `OtpInput` component accepts the following props:

| Prop                 | Type                               | Default          | Description                                                                                          |
| -------------------- | ---------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `length`             | `number`                           | `4`              | The number of OTP digits (input fields). Default is 4.                                               |
| `onOtpSubmit`        | `(otp: string) => void`            | `() => {}`       | A callback function that is triggered when the full OTP is entered. It receives the OTP as a string. |
| `inputClassName`     | `string`                           | `"otpInput"`     | CSS class name for individual input fields. Default is `"otpInput"`.                                 |
| `containerClassName` | `string`                           | `"otpContainer"` | CSS class name for the container div. Default is `"otpContainer"`.                                   |
| `disabled`           | `boolean`                          | `false`          | If `true`, disables the OTP input fields.                                                            |
| `ref`                | `React.Ref<{ reset: () => void }>` | `undefined`      | Provides access to the `reset()` function to clear the OTP input.                                    |

### Example with Custom OTP Length and Styles

```tsx
import React, { useRef } from "react";
import OtpInput from "multiple-otp-field";
import "./App.scss"; // Include your custom SCSS file

const App: React.FC = () => {
  const otpRef = useRef<{ reset: () => void } | null>(null);

  const handleOtpSubmit = (otp: string) => {
    console.log("OTP submitted:", otp);
  };

  return (
    <div className="app-container">
      <h1>OTP Input with Custom Styles</h1>
      <OtpInput
        length={6}
        onOtpSubmit={handleOtpSubmit}
        inputClassName="custom-input"
        containerClassName="custom-container"
        ref={otpRef}
      />
      <button onClick={() => otpRef.current?.reset()}>Reset OTP</button>
    </div>
  );
};

export default App;
```

### Styling and Responsiveness

The component is fully responsive, and you can easily customize its appearance using CSS. The input fields will automatically adjust their size based on the screen width.

To customize the appearance, you can style the component by targeting the `.otpInput` class or provide custom class names via the `inputClassName` and `containerClassName` props:

```scss
.otpInput {
  width: 3rem;
  height: 3rem;
  margin: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
}

.otpInput:focus {
  outline: none;
  border-color: #4caf50;
}

.custom-container {
  display: flex;
  justify-content: center;
}

.custom-input {
  width: 4rem;
  height: 4rem;
  margin: 0.5rem;
  font-size: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  border: 2px solid #007bff;
}
```

## Accessibility Considerations

- Uses `inputMode="numeric"` for mobile-friendly numeric input.
- Supports keyboard navigation for better usability.

## Contributing

We welcome contributions to this project! If you'd like to contribute, feel free to:

1. Fork the repository
2. Create a new branch
3. Make your changes and improvements
4. Create a pull request with a description of your changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
