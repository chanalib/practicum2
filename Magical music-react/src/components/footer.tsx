import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        py: 4,
        mt: 4,
        width: "100vw",
        position: "relative",
        left: 0,
        right: 0,
        overflowX: "hidden",
      }}
    >
      {/* קונטיינר פנימי עם מרכוז */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          textAlign="center"
        >
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Magical Music
            </Typography>
            <Typography variant="body2" color="gray">
              ©️chana-liberman
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              צרו קשר
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <LocationOn />
              <Typography variant="body2">אגוז 3 קרית חיים</Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Phone />
              <Typography variant="body2">0548558558</Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Email />
              <Typography variant="body2">c558941h@gmail.com</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              עקבו אחרינו
            </Typography>
            <Box display="flex" justifyContent="center" gap={1}>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Facebook />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Instagram />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Twitter />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "gray", my: 3 }} />

        <Box textAlign="center">
          <Typography variant="body2" color="gray">
            <Link href="#" color="inherit" underline="hover">
              מדיניות פרטיות
            </Link>{" "}
            |{" "}
            <Link href="#" color="inherit" underline="hover">
              תנאי השירות
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
