import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Link, Typography } from '@mui/material';

function Footer() {
  return (
    <Box component="footer" mt={10} px={2}>
      <Typography align="center">
        <Link
          href="https://github.com/mdrayer/alx-2024-candidate-tool"
          target="_blank"
          title="View code on GitHub"
        >
          <GitHubIcon />
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
