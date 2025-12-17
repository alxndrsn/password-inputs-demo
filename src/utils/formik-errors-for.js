const formikErrorsFor = (form, field) => {
  const { touched, errors } = form || {};
  return touched && touched[field?.name] && errors && errors[field?.name];
};
export default formikErrorsFor;
