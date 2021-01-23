import isEmpty from 'lodash/isEmpty';

export const validateEmail = (value) =>
    value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)

export const validatePhoneNumber = (value) =>
    value && /^(\+)?([0-9]){10,16}$/i.test(value)

export const validate = (input) => {
    let errors = {}

    if (isEmpty(input)) return null;

    const {email, phoneNumber} = input;

    if (!validateEmail(email)) {
        errors.email = 'Please enter a valid email'
    }

    if (!validatePhoneNumber(phoneNumber)) {
        errors.email = 'Please enter a valid phone number'
    }

    if (!isEmpty(errors)) return errors;

    return null;
}