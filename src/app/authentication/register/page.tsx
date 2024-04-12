"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import useMediaQuery from "@mui/material/useMediaQuery";

//components
import AuthRegister from "../auth/AuthRegister";
import Carousell from "../components/carousel";

const Register2 = () => {
  const matches = useMediaQuery("(min-width:1200px)");

  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const isMobile = useMediaQuery("(max-width: 767px)");

  const isBigTablets = useMediaQuery("(max-width: 1299px)");

  return (
    <PageContainer title="Register" description="this is Register page">
      <Box
        sx={{
          display: "flex",
          alignItems: "normal",
          justifyContent: "center",
          background: "#2B305C",
          "&:before": {
            content: '""',
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        {!isMobileOrTablet && (
          <Box
            className="boxing-login"
            sx={{
              backgroundColor: "white !important",
              padding: "32px 80px",
              display: "flex",
              minWidth: "85vh",
              zIndex: "11",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0 7% 7% 0",
              ...(isMobile && {
                padding: "10px !important",
              }),
              ...(isBigTablets && {
                padding: "20px !important",
                minWidth: "50%",
              }),
            }}
          >
            <Carousell />
          </Box>
        )}
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{
            height: "100vh",
            ...(isMobile && {
              padding: "0px 20px",
            }),
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            lg={6}
            xl={6}
            md={8}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{
                px: 5,
                py: 4,
                zIndex: 1,
                borderRadius: "50px",
                ...(isMobile && {
                  padding: "20px 20px",
                }),
              }}
            >
              <AuthRegister />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Register2;
