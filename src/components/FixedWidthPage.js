import Box from '@mui/material/Box';

import { generateStyleGetter } from '../utils/style-generator';

const boxSx = generateStyleGetter({
  maxWidth: maxWidth => ({ width:'100%', maxWidth, ml:'auto', mr:'auto', pb:5, pl:1, pr:1, boxSizing:'border-box' }),
  center: { textAlign:'center' },
});

export default function FixedWidthPage({ maxWidth, center, className, children }) {
  return (
    <>
      <Box sx={boxSx({ maxWidth, center })} className={className}>
        {children}
      </Box>
    </>
  );
}
