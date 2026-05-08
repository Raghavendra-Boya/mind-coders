// hooks/useFormValidation.js
import { useCallback } from 'react';

export const useFormValidation = () => {
  const validateEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const validatePhone = useCallback((phone) => {
    return /^\d{10}$/.test(phone);
  }, []);

  const validateName = useCallback((name) => {
    return /^[A-Za-z\s]+$/.test(name.trim());
  }, []);

  const validateRequired = useCallback((value) => {
    return value && value.trim().length > 0;
  }, []);

  const validateForm = useCallback((formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = formData[field];
      
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.requiredMessage || `${field} is required`;
        return;
      }
      
      if (rule.email && value && !validateEmail(value)) {
        errors[field] = rule.emailMessage || 'Please enter a valid email';
        return;
      }
      
      if (rule.phone && value && !validatePhone(value)) {
        errors[field] = rule.phoneMessage || 'Phone number must be exactly 10 digits';
        return;
      }
      
      if (rule.name && value && !validateName(value)) {
        errors[field] = rule.nameMessage || 'Name should contain only letters';
        return;
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = rule.minLengthMessage || `Minimum ${rule.minLength} characters required`;
        return;
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = rule.maxLengthMessage || `Maximum ${rule.maxLength} characters allowed`;
        return;
      }
      
      if (rule.custom && value) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors[field] = customResult;
          return;
        }
      }
    });
    
    return errors;
  }, [validateEmail, validatePhone, validateName, validateRequired]);

  return {
    validateEmail,
    validatePhone,
    validateName,
    validateRequired,
    validateForm,
  };
};
