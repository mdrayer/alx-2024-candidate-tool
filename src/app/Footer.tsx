import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box component="footer" mt={10} px={2}>
      <Typography align="center">
        <a
          href="https://github.com/mdrayer/alx-2024-candidate-tool"
          title="View code on GitHub"
        >
          <GitHubIcon />
        </a>
      </Typography>
    </Box>
  );
}

export default Footer;
