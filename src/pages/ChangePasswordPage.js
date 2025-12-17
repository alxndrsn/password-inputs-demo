import { Component } from 'react';
import * as yup from 'yup';
import { Field } from 'formik';

import Grid from '@mui/material/Grid';

import { FormWrapper } from '../components/FormWrapper';
import FixedWidthPage from '../components/FixedWidthPage';
import PasswordField from '../components/FormikPasswordField';

import checkPasswordPwnage from '../utils/check-password-pwnage';

function password() {
  // N.B. order of validations affects the validation errors returned.
  // `required()` appears before `min()` & `max()` for this reason.
  return yup.string().trim().required().min(8, 'must be at least 8 characters').max(64);
}

const schema = {
  password:     password(),
  newPassword1: password().when('password', (password, schema) => {
    return schema.notOneOf([ password ], 'New password is the same as old password.');
  }),
  newPassword2: yup.string().trim().required().when('newPassword1', (newPassword1, schema) => {
    return schema.oneOf([ newPassword1 ], 'New password fields do not match.');
  }),
};

const initialValues = { password:'', newPassword1:'', newPassword2:'' };

const fields = [
  <Grid item xs={12} key="p0"><Field component={PasswordField} name="password"     label="Old Password"         fullWidth variant="standard"/></Grid>,
  <Grid item xs={12} key="p1"><Field component={PasswordField} name="newPassword1" label="New Password"         fullWidth variant="standard" strengthMeter/></Grid>,
  <Grid item xs={12} key="p2"><Field component={PasswordField} name="newPassword2" label="Confirm New Password" fullWidth variant="standard"/></Grid>,
];

class ChangePasswordPage extends Component {
  onSubmit = async params => {
    console.log('TODO send to API:', { params }); // eslint-disable-line no-console
  };

  render() {
    const { navigate } = this.props;

    return (
      <FixedWidthPage maxWidth={300} center>
        <div style={{paddingLeft:10, paddingRight:10}}>
          <FormWrapper fields={fields} schema={schema}
            customSubmit={this.onSubmit}
            initialValues={initialValues}
            submitLabel="Change Password"
            preprocess={preprocess}
            onSuccess={() => navigate('/change-password/success')}
          />
        </div>
      </FixedWidthPage>
    );
  }
}
export default ChangePasswordPage;

async function preprocess({ password:oldPassword, newPassword1:newPassword }) {
  await checkPasswordPwnage('newPassword1', newPassword);
  const email = 'original-example-email@example.test';
  return { email, oldPassword, newPassword };
}
