import { isValidElement } from 'react';

export default function errorsAsString(errors) {
  if(!errors) return;
  if(typeof errors === 'string') return elementFor(errors);
  if(isValidElement(errors)) return errors;
  return JSON.stringify(errors);
}

function elementFor(errorString) {
  switch(errorString) {
    case 'password_pwned': return (
      <>
        This password has previously been included in a breach.<br/>
        For more information, see <a target="_blank" rel="noreferrer" href="https://haveibeenpwned.com/Passwords">here</a>.
      </>
    );
    case 'zero-q-nonzero-m': return 'must also be zero';
    default: return errorString;
  }
}
