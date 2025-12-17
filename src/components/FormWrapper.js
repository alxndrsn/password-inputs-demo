import { PureComponent } from 'react';

import * as Sentry from "@sentry/react";
import * as yup from 'yup';
import { Formik, Form } from 'formik';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';

import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';

import FullWidthError from './FullWidthError';

import getDefaultValuesFrom from '../utils/get-default-values-from';
import validateWith from '../utils/validate-with';

yup.setLocale({ mixed:{ required:'required' } });

const sxFormLiner = { mt:1 }; // allow space for top form label
const cssAlertContainer = { marginBottom:8 };
const cssButtonContainer = { marginTop:10 };

export class FormWrapper extends PureComponent {
  state = {};

  static getDerivedStateFromError(formError) {
    console.log('Error in form rendering:', formError); // eslint-disable-line no-console
    return { formError };
  }

  constructor(props) {
    super(props);

    const { initialValues, schema } = props;
    this.initialValues = initialValues || getDefaultValuesFrom(schema);

    const { customSubmit, postTo } = props;
    if(customSubmit != null && postTo != null) throw new Error(`Invalid prop combination: customSubmit & postTo cannot be used together.`);
  }

  onSubmit = async (params, formik) => {
    // TODO filter out untouched fields (except the ID!).  This might mean removing all .required() markers
    // from param validation on /update endpoints.

    // Prevent double-submit.  For some reason, formik.isSubmitting is not available in
    // the FormikBag provided above.
    // See: https://github.com/jaredpalmer/formik/issues/3265
    // See: https://formik.org/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany
    if(this.isSubmitting) return;

    const { confirmSubmit, customSubmit, disableClearOnSuccess, onSuccess, preprocess, postTo, onSubmitError } = this.props;
    this.isSubmitting = true;

    try {
      if(confirmSubmit) {
        const confirmed = await confirmSubmit();
        if(!confirmed) return;
      }

      const processedParams = preprocess ? await preprocess(params) : params;
      const res = customSubmit ? await customSubmit(processedParams) : await apiPost(postTo, processedParams);
      if(onSuccess) await onSuccess(res, params); // TODO why not pass preprocessed params here?
      if(!disableClearOnSuccess) formik.resetForm();
    } catch(err) {
      if(err.disabledDefaultHandling) return;

      if(onSubmitError) {
        try {
          if(onSubmitError(err)) return;
        } catch(err2) {
          console.log('Form submission error:', err2, err); // eslint-disable-line no-console
          Sentry.captureException(err);
          Sentry.captureException(err2);
          alert(`Unhandled error: ${err2}`);
          return;
        }
      }

      if(err.bodyType === 'json') {
        if(err.body.error === 'uniqueness') {
          err.body.fields.forEach(field => {
            formik.setFieldError(field, 'already in use');
          });
          return;
        }

        if(err.body.formErrors) {
          err.body.formErrors.forEach(({ field, error }) => {
            formik.setFieldError(field, error);
          });
          return;
        }
      }

      console.log('Form submission error:', err); // eslint-disable-line no-console
      Sentry.captureException(err);
      alert(`Unhandled error: ${err}`);
    } finally {
      this.isSubmitting = false;
    }
  };

  render() {
    const { formError } = this.state;
    if(formError) return <FullWidthError message="cannot show form" details={formError.toString()}/>;

    const { schema, fields, submitLabel, onCancel, customValidate, hideError, children } = this.props;

    return (
      <Formik
        validate={customValidate || validateWith(schema)}
        initialValues={this.initialValues}
        onSubmit={this.onSubmit}
      >
        {formik => {
          const errors = Object.entries(formik.errors);

          const asButton = ({ key, label, onClick, icon, isPrimary=true, variant, type }) => {
            const { isSubmitting } = formik;
            const showSpinner = (isSubmitting || this.isSubmitting) && this.actionClicked === key;
            const handleClick = () => {
              this.actionClicked = key;
              onClick();
            };
            return (
              <Grid item key={label}>
                <Button disabled={isSubmitting || this.isSubmitting}
                    startIcon={isPrimary ? null : showSpinner ? <CircularProgress size={16}/> : icon}
                    endIcon  ={isPrimary ? showSpinner ? <CircularProgress size={16}/> : icon : null}
                    variant={variant ?? (isPrimary ? 'contained' : 'outlined')}
                    color={isPrimary ? 'primary' : 'secondary'}
                    onClick={handleClick} type={type}>{label}</Button>
              </Grid>
            );
          };

          const actions = this.props.actions ? this.props.actions(formik) : [
            { key:'submit', icon:<SendIcon/>, label:submitLabel || 'Submit', onClick:formik.submitForm, type:'submit' },
          ];
          if(onCancel) {
            actions.unshift({ key:'cancel', icon:<CancelIcon/>, label:'Cancel', onClick:onCancel, isPrimary:false });
          }

          return (
            <Form>
              <Grid container spacing={1} sx={sxFormLiner}>
                {Array.isArray(fields) ? fields : null}
                {Array.isArray(fields) ? null : fields(formik) /* FIXME fieldGenerator is an awful performance monster */}
                <Grid item xs={12}>
                  {hideError ? null : <Collapse in={!!(formik.submitCount && errors?.length)}>
                    <Grid container justifyContent="center" style={cssAlertContainer}>
                      <MuiAlert severity="error">
                        There are errors in the form above - please review.
                      </MuiAlert>
                    </Grid>
                  </Collapse>}
                  <Grid container justifyContent="center" spacing={2} style={cssButtonContainer}>
                    {actions.map(asButton)}
                  </Grid>
                </Grid>
              </Grid>
              {children}
            </Form>
          );
        }}
      </Formik>
    );
  }
}

function apiPost(...args) {
  console.log('Not implemnented: apiPost()', { args }); // eslint-disable-line no-console
}
