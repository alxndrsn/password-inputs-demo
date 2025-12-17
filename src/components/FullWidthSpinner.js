import CircularProgress from '@mui/material/CircularProgress';

const cssDiv = { width:'100%', textAlign:'center', margin:10 };

const FullWidthSpinner = () => (
  <div style={cssDiv}>
    <CircularProgress/>
  </div>
);
export default FullWidthSpinner;
