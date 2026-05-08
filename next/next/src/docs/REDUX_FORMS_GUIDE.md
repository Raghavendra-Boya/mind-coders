# Redux Forms Integration Guide

This guide explains how to use Redux for form state management in your Next.js application.

## Overview

The Redux setup includes:
- **Auth Slice**: Handles authentication forms (login/signup)
- **Request Prayer Slice**: Handles prayer request forms
- **Form Slice**: Generic form handling for other forms
- **Custom Hooks**: Reusable form validation and Redux form management
- **Redux Provider**: Wraps the entire application

## Redux Store Structure

```javascript
{
  auth: {
    signupFormData: { name: "", email: "", mobileNo: "", source: 0 },
    loginFormData: { username: "", password: "" },
    user: null,
    isAuthenticated: false,
    signupLoading: false,
    loginLoading: false,
    signupErrors: {},
    loginErrors: {},
    signupStatus: "",
    loginStatus: ""
  },
  requestPrayer: {
    formData: { fullName: "", mobileNo: "", email: "", location: "", message: "" },
    errors: {},
    loading: false,
    status: ""
  },
  form: {
    formData: {},
    errors: {},
    loading: false,
    status: "",
    currentForm: null,
    isValid: false
  }
}
```

## Usage Examples

### 1. Authentication Forms

#### Login Form
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setLoginFormData, loginUser } from '../store/slices/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const { loginFormData, loginLoading, loginStatus } = useSelector(state => state.auth);

  const handleChange = (e) => {
    dispatch(setLoginFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({
      userName: loginFormData.username,
      source: 0,
    }));
    
    if (loginUser.fulfilled.match(result)) {
      // Handle success
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={loginFormData.username}
        onChange={handleChange}
      />
      <button disabled={loginLoading}>
        {loginLoading ? "Logging in..." : "Login"}
      </button>
      {loginStatus && <div>{loginStatus}</div>}
    </form>
  );
}
```

#### Signup Form
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setSignupFormData, signupUser } from '../store/slices/authSlice';

function SignupForm() {
  const dispatch = useDispatch();
  const { signupFormData, signupLoading, signupStatus } = useSelector(state => state.auth);

  const handleChange = (e) => {
    dispatch(setSignupFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signupUser({
      name: signupFormData.name,
      email: signupFormData.email,
      mobileNo: signupFormData.mobileNo,
      source: 0,
    }));
  };

  // Form JSX similar to login form
}
```

### 2. Prayer Request Form

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, submitPrayerRequest } from '../store/slices/requestPrayerSlice';

function RequestPrayerForm() {
  const dispatch = useDispatch();
  const { formData, loading, status } = useSelector(state => state.requestPrayer);

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(submitPrayerRequest(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
      <button disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
      {status && <div>{status}</div>}
    </form>
  );
}
```

### 3. Generic Forms

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setFormField, submitForm, resetForm } from '../store/slices/formSlice';

function GenericForm() {
  const dispatch = useDispatch();
  const { formData, loading, status } = useSelector(state => state.form);
  
  const formType = "myForm";
  const myFormData = formData[formType] || {};

  const handleChange = (e) => {
    dispatch(setFormField({ 
      formType, 
      field: e.target.name, 
      value: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitForm({
      endpoint: "/api/my-endpoint",
      formData: myFormData,
    }));
    
    if (submitForm.fulfilled.match(result)) {
      dispatch(resetForm(formType));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fieldName"
        value={myFormData.fieldName || ""}
        onChange={handleChange}
      />
      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {status && <div>{status}</div>}
    </form>
  );
}
```

## Custom Hooks

### useReduxForm Hook

```javascript
import { useReduxForm } from '../hooks/useReduxForm';

function MyForm() {
  const {
    formData,
    errors,
    loading,
    status,
    setField,
    validate,
    resetForm,
    clearErrors,
    clearStatus,
  } = useReduxForm('myForm', 'form');

  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate(validationRules);
    if (isValid) {
      // Submit form
    }
  };

  // Use the hook's methods in your form
}
```

### useFormValidation Hook

```javascript
import { useFormValidation } from '../hooks/useFormValidation';

function MyComponent() {
  const { validateEmail, validatePhone, validateForm } = useFormValidation();

  const validationRules = {
    email: { 
      required: true, 
      email: true,
      requiredMessage: "Email is required",
      emailMessage: "Please enter a valid email"
    },
    phone: { 
      required: true, 
      phone: true,
      requiredMessage: "Phone is required",
      phoneMessage: "Phone must be 10 digits"
    }
  };

  const errors = validateForm(formData, validationRules);
}
```

## ReduxForm Component

```javascript
import ReduxForm from '../components/ReduxForm';

function MyForm() {
  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
  };

  const handleSubmit = async (formData, { resetForm, clearErrors }) => {
    // Handle form submission
    console.log('Form data:', formData);
    // Reset form after successful submission
    resetForm();
  };

  return (
    <ReduxForm
      formType="myForm"
      sliceName="form"
      onSubmit={handleSubmit}
      validationRules={validationRules}
    >
      {({ formData, errors, loading, status, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}
          
          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          
          {status && <div className="status">{status}</div>}
        </form>
      )}
    </ReduxForm>
  );
}
```

## Best Practices

1. **Use appropriate slice**: Choose the right slice for your form type
2. **Handle loading states**: Always show loading indicators during form submission
3. **Validate forms**: Use validation rules to ensure data integrity
4. **Clear errors**: Clear field errors when users start typing
5. **Reset forms**: Reset forms after successful submission
6. **Error handling**: Display meaningful error messages to users
7. **Status messages**: Show success/error status to users

## Available Actions

### Auth Slice Actions
- `setSignupFormData(payload)`
- `setLoginFormData(payload)`
- `signupUser(formData)`
- `loginUser(formData)`
- `resetSignupForm()`
- `resetLoginForm()`
- `logout()`
- `clearAuthStatus()`

### Request Prayer Slice Actions
- `setFormData(payload)`
- `setErrors(payload)`
- `submitPrayerRequest(formData)`
- `resetForm()`

### Form Slice Actions
- `setFormData(payload)`
- `setErrors(payload)`
- `setFormField(payload)`
- `submitForm(payload)`
- `resetForm(formType)`
- `setValidation(isValid)`
- `clearStatus()`

## Error Handling

All async thunks handle errors automatically and update the status in the store. You can access error messages through the status field in your components.

```javascript
const { status } = useSelector(state => state.auth);

// Status will contain error messages like:
// "❌ Login failed: Invalid credentials"
// "⚠️ A request with this phone number already exists"
// "✅ Login successful!"
```

This setup provides a comprehensive Redux-based form management system that's scalable, maintainable, and provides excellent user experience.
