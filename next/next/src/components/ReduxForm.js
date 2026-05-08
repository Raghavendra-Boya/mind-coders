// components/ReduxForm.js
import React from 'react';
import { useReduxForm } from '../hooks/useReduxForm';

const ReduxForm = ({ 
  formType, 
  sliceName = 'form', 
  onSubmit, 
  validationRules = {}, 
  children,
  className = "",
  ...props 
}) => {
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
  } = useReduxForm(formType, sliceName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
    
    // Clear field error when user types
    if (errors[name]) {
      clearErrors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearStatus();
    
    // Validate form if rules are provided
    if (Object.keys(validationRules).length > 0) {
      const isValid = validate(validationRules);
      if (!isValid) return;
    }
    
    // Call the provided onSubmit function
    if (onSubmit) {
      await onSubmit(formData, { resetForm, clearErrors, clearStatus });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      {children({
        formData,
        errors,
        loading,
        status,
        handleChange,
        handleSubmit,
        resetForm,
        clearErrors,
        clearStatus,
      })}
    </form>
  );
};

export default ReduxForm;
