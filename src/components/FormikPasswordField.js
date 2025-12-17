// Why have a different Component?
//
//   * password fields need immediate feedback (e.g. "passwords do not
//     match"), rather than update-on-blur
//   * consistent formatting for password fields including the meter,
//     and those without

import { lazy, PureComponent, Suspense } from 'react';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FullWidthSpinner from './FullWidthSpinner';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import errorsAsString from '../utils/errors-as-string';
import formikErrorsFor from '../utils/formik-errors-for';

const PasswordStrengthMeter = lazy(() => import('./PasswordStrengthMeter'));

export default class FormikPasswordField extends PureComponent {
  state = { maskPassword:true };

  onChange = e => {
    const { value } = e.target;
    const { field, form } = this.props;

    // clear haveibeenpwned error when the value is changed to prevent out-dated message misleading users
    if(form.errors[field.name] === 'password_pwned') form.setFieldError(field.name, null);

    form.setFieldValue(field.name, value);
  };

  toggleMaskPassword = () => {
    this.setState({ maskPassword:!this.state.maskPassword });
  };

  handleMouseDownPassword = e => {
    e.preventDefault();
  };

  render() {
    const { children, field, form, label, variant, fullWidth, strengthMeter, ...props } = this.props;
    const { value } = field;

    const { maskPassword } = this.state;

    const errors = formikErrorsFor(form, field);

    const inputId      = 'password-input-' + field.name;
    const helperTextId = 'password-input-' + field.name + '-text';

    return (
      <FormControl className={errors ? 'error' : ''} error={!!errors} variant={variant} fullWidth={fullWidth}>
        <InputLabel htmlFor={inputId}>{label}</InputLabel>
        <Input
          {...props}
          id={inputId}
          value={value}
          onChange={this.onChange}
          aria-describedby={helperTextId}
          type={maskPassword ? 'password' : 'text'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={this.toggleMaskPassword}
                onMouseDown={this.handleMouseDownPassword}
                edge="end"
              >
                {maskPassword ? <VisibilityOff/> : <Visibility/>}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id={helperTextId}>{errorsAsString(errors)}</FormHelperText>
        {!strengthMeter ? null : (
          <Suspense fallback={<FullWidthSpinner/>}>
            <PasswordStrengthMeter password={value} formValues={form.values}/>
          </Suspense>
        )}
        {children}
      </FormControl>
    );
  }
}
