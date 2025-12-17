import { Component } from 'react';

import zxcvbn from 'zxcvbn';

import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

const cssDiv = { marginTop:10, marginBottom:10, textAlign:'left' };
const cssList = { marginTop:0 };

export default class PasswordStrengthMeter extends Component {
  render() {
    const { password, formValues } = this.props;

    const otherValues = Object
        .entries(formValues)
        .filter(([ k, v ]) => !k.toLowerCase().includes('password')) // don't warn them that their old password is a "common word"
        .map(([ k, v ]) => v);

    const { score, feedback } = zxcvbn(password, [ ...otherValues, 'example-site-name', 'example-user-email@example.test' ]);

    return (
      <div style={cssDiv}>
        <FormLabel>{emojiFor(password, score)} Password strength: {wordFor(password, score)}</FormLabel>
        {!feedback?.warning && !feedback?.suggestions?.length ? null : (
          <ul style={cssList}>
            {!feedback.warning ? null :     <li><FormHelperText error>{feedback?.warning}</FormHelperText></li>}
            {feedback.suggestions?.map(s => <li><FormHelperText>{s}</FormHelperText></li>)}
          </ul>
        )}
      </div>
    );
  }
}

function wordFor(password, score) {
  if(!password) return '';
  switch(score) {
    case 0:  return 'very weak';
    case 1:  return 'weak';
    case 2:  return 'ok';
    case 3:  return 'strong';
    case 4:  return 'very strong';
    default: return '';
  }
}

function emojiFor(password, score) {
  if(!password) return '❔';
  switch(score) {
    case 0:  return '❌';
    case 1:  return '❌';
    case 2:  return '⚠️';
    case 3:  return '✅';
    case 4:  return '✅';
    default: return '❔';
  }
}
