import Typography from '@mui/material/Typography';

const cssDiv = { width:'100%' };

const FullWidthError = ({ message, details }) => (
  <div style={cssDiv}>
    <Typography variant="h2">Error: {message}</Typography>
    <Typography variant="body1">{details}</Typography>
  </div>
);
export default FullWidthError;
