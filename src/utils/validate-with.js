import { yupToFormErrors } from 'formik';
import * as yup from 'yup';

// Prevent empty strings from being stripped in the validation stage.
// see: https://github.com/jaredpalmer/formik/pull/2902#issuecomment-922492137
export default function validateWith(schema) {
  if(!schema) return;
  const shapedSchema = schema && yup.object().shape(schema);
  return async function validate(values) {
    // Allow e.g. button clicks to trigger before error message sizes cause components to shift.
    // See: https://github.com/jaredpalmer/formik/issues/1796#issuecomment-605685583
    await sleep(10);

    try {
      await shapedSchema.validate(values, { abortEarly:false });
    } catch (err) {
      if(err instanceof yup.ValidationError) return yupToFormErrors(err);
      else throw err;
    }
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
