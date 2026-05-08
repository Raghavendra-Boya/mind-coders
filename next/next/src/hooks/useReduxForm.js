// hooks/useReduxForm.js
import { useDispatch, useSelector } from 'react-redux';
import { useFormValidation } from './useFormValidation';

export const useReduxForm = (formType, sliceName = 'form') => {
  const dispatch = useDispatch();
  const { validateForm } = useFormValidation();
  
  // Get form state from Redux store
  const formState = useSelector((state) => state[sliceName]);
  
  const formData = formState.formData?.[formType] || {};
  const errors = formState.errors?.[formType] || {};
  const loading = formState.loading || false;
  const status = formState.status || '';

  const setField = (field, value) => {
    if (sliceName === 'auth') {
      if (formType === 'signup') {
        dispatch({ type: 'auth/setSignupFormData', payload: { [field]: value } });
      } else if (formType === 'login') {
        dispatch({ type: 'auth/setLoginFormData', payload: { [field]: value } });
      }
    } else {
      dispatch({ type: `${sliceName}/setFormField`, payload: { formType, field, value } });
    }
  };

  const setErrors = (newErrors) => {
    if (sliceName === 'auth') {
      if (formType === 'signup') {
        dispatch({ type: 'auth/setSignupErrors', payload: newErrors });
      } else if (formType === 'login') {
        dispatch({ type: 'auth/setLoginErrors', payload: newErrors });
      }
    } else {
      dispatch({ type: `${sliceName}/setErrors`, payload: { formType, errors: newErrors } });
    }
  };

  const validate = (rules) => {
    const validationErrors = validateForm(formData, rules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    if (sliceName === 'auth') {
      if (formType === 'signup') {
        dispatch({ type: 'auth/resetSignupForm' });
      } else if (formType === 'login') {
        dispatch({ type: 'auth/resetLoginForm' });
      }
    } else {
      dispatch({ type: `${sliceName}/resetForm`, payload: formType });
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearStatus = () => {
    dispatch({ type: `${sliceName}/clearStatus` });
  };

  return {
    formData,
    errors,
    loading,
    status,
    setField,
    setErrors,
    validate,
    resetForm,
    clearErrors,
    clearStatus,
  };
};
