"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";
import Carousell from "../components/carousel";
import { useState } from "react";
import { useAppselector } from "@/redux/store";
import Register2 from "../register/page";
interface loginType {
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const Login2 = () => {
  const [isOtp, setIsOtp] = useState(false);
  const isAuth = useAppselector((state) => state?.auth.value);

  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const isMobile = useMediaQuery("(max-width: 767px)");

  const isBigTablets = useMediaQuery("(max-width: 1299px)");

  const matches = useMediaQuery("(min-width:1200px)");

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        className="boxer"
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
          className="tryone"
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
            className="countdown"
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
                // width: "60vw",
                // maxWidth: "27vw",
                borderRadius: "50px",
                ...(isMobile && {
                  padding: "20px 20px",
                }),
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* <Image alt="logo" src={"Logo"} width={50} height={50} /> */}
              </Box>
              <Box>
                <AuthLogin/>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Login2;
