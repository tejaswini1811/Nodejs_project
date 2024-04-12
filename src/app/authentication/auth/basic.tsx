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

  const [loader, setLoader] = useState<boolean>(false);

  const postBasic = async (values: basicTypes) => {
    try {
      setLoader(true);
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(`user`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });

      // console.log("response: ", response);

      if (response.status === 200) {
        toast.success("Basic Details Added Successfully");
      }
      Router.push("/authentication/complete");
      setLoader(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoader(false);
    }
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signUpSchema,

      onSubmit: (values, action) => {
        // console.log("values: ", values);
        postBasic(values);
        action.resetForm();
      },
    });

  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <form onSubmit={handleSubmit}>
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
              >
                Basic Details
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
                  }),
                }}
              >
                Please Enter you Basic Details
              </Typography>
            </Box>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="First Name"
              name="firstName"
              sx={{ maxWidth: "100%", marginY: "5px" }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: {
                  fontSize: "14px",
                  borderRadius: "25px",
                  maxWidth: "100%",
                  height: "45px",
                },
              }}
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstName && touched.firstName ? (
              <Typography
                variant="body1"
                color="initial"
                className="form-error"
                sx={{ color: "red", fontSize: "10px", paddingLeft: "5px" }}
              >
                {errors.firstName}
              </Typography>
            ) : null}
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Last Name"
              name="lastName"
              sx={{ maxWidth: "100%", marginY: "5px" }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: {
                  fontSize: "14px",
                  borderRadius: "25px",
                  maxWidth: "100%",
                  height: "45px",
                },
              }}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastName && touched.lastName ? (
              <Typography
                variant="body1"
                color="initial"
                className="form-error"
                sx={{ color: "red", fontSize: "10px", paddingLeft: "5px" }}
              >
                {errors.lastName}
              </Typography>
            ) : null}
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Email"
              name="email"
              sx={{ maxWidth: "100%", marginY: "5px" }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: {
                  fontSize: "14px",
                  borderRadius: "25px",
                  maxWidth: "100%",
                  height: "45px",
                },
              }}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
             {errors.email && touched.email ? (
              <Typography
                variant="body1"
                color="initial"
                className="form-error"
                sx={{ color: "red", fontSize: "10px", paddingLeft: "5px" }}
              >
                {errors.email}
              </Typography>
            ) : null}
            <Box>
              <LoadingButton
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                loading={loader}
                sx={{
                  marginTop: "3vh",
                  ...(isMobile && {
                    fontSize: "14px",
                  }),
                }}
              >
                Next
              </LoadingButton>
            </Box>
          </Box>
        </Stack>
      </form>
    </>
  );
};

export default Basic;
