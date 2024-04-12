"use client"
import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import Link from "next/link";
import Logo from "@/img/Logo.png";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import createAxiosInstance from "@/app/axiosInstance";
import { signUpSchema } from "../../../schema/signUp";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { Stack } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from "@mui/lab/LoadingButton";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

interface basicTypes {
  firstName: string;
  lastName: string;
  email: string;
  title?: JSX.Element | JSX.Element[];
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
};

const Basic = () => {
  const Router = useRouter();


  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <Stack>
        <Box>
          <Typography
            sx={{
              textAlign: "center",
              marginBottom: "15px",
              ...(isMobile && {
                marginBottom: "10px",
              }),
            }}
          >
            <Image
              alt="logo"
              src={Logo}
              width={86}
              height={86}
              style={{
                ...(isMobile && {
                  width: "50px",
                  height: "50px",
                }),
              }}
            />
          </Typography>
          <Box
            sx={{
              ...(isMobile && {
                paddingBottom: "10px",
              }),
            }}
          >
            <Typography
              sx={{
                fontSize: "30px",
                fontFamily: "Popins San-Serif",
                textAlign: "center",
                marginBottom: "20px",
                color: "#1085BB",
                ...(isMobile && {
                  fontSize: "22px",
                  marginBottom: "0px",
                }),
              }}
            >
              AGRI REACH
            </Typography>
  
            <Typography
              sx={{
                fontSize: "20px",
                textAlign: "center",
                marginBottom: "15px",
                marginTop: "20px",
                color: "#000",
                fontWeight: "600",
                ...(isMobile && {
                  fontSize: "17px",
                  marginBottom: "10px",
                  marginTop: "5px",
                }),
              }}
              onClick={()=> Router.push('/profile')}
            >
              Complete Your Profile
            </Typography>
  
            <Typography
              sx={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2121210",
                fontWeight: "600",
                padding: "10px",
               
                ...(isMobile && {
                  fontSize: "13px",
                  padding: "0px",
                  lineHeight: "20px",
                  marginBottom: "10px",
                  textAlign: "center",
                }),
              }}
            >
              Complete your profile details to boost your profile reach to the clients and gain more business deals through SLCM AgriReach
            </Typography>
          </Box>
  
          <Box>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              sx={{
                marginTop: "4vh",
                fontWeight:"700",
                ...(isMobile && {
                  fontSize: "14px",
                }),
              }}
              onClick={()=> Router.push('/profile')}
            >
              Complete 
            </Button>
  
            <Button
              color="primary"
              variant="text"
              size="large"
              fullWidth
              type="submit"
              sx={{
                marginTop: "1vh",
                ...(isMobile && {
                  fontSize: "14px",
                }),
              }}
              onClick={()=> Router.push('/')}
            >
              Maybe Later
            </Button>
          </Box>
        </Box>
      </Stack>
    </>
  );
  
};

export default Basic;
