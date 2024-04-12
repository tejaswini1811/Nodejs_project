"use client"
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  InputAdornment,
  TextField,
} from "@mui/material";
import Link from "next/link";
import logo from "@/img/Logo.png";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast,{ Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import createAxiosInstance from "@/app/axiosInstance";
import { useDispatch } from "react-redux";
import { loginAsync } from "@/redux/features/authSlice";
import Logo from "@/img/Logo.png";
import "@/app/global.css";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppselector } from "@/redux/store";
import { useSearchParams } from "next/navigation";

interface loginType {
  title?: string;
  mobile?: JSX.Element | JSX.Element[];
  session_id?: JSX.Element | JSX.Element[];
}

function AuthLogin() {
  const [loader, setLoader] = useState<boolean>(false);

  const { mobile } = useAppselector((state) => state?.auth.value);

  const searchParams = useSearchParams();

  const state = searchParams.get("state");

  const router = useRouter();
  const axiosInstance = createAxiosInstance();
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    mobile: Yup.string()
      .length(10, "Mobile Number must be 10 digit")
      .required("Mobile Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      mobile: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoader(true);
        const loginAction: any = loginAsync({ mobile: values.mobile });
        const loginResult = await dispatch(loginAction);
        if (loginAsync.fulfilled.match(loginResult)) {
          const apiRes = loginResult.payload;

          if (apiRes?.data) {

            toast.success(`Otp Sent Successfully to ${values.mobile}`)

            router.push("/authentication/register");
          }
        } else {
          toast.error("Something went wrong!, Please try again.");
        }
      } catch (err) {
        toast.error("Something went wrong!, Please try again.");
      } finally {
        setLoader(false);
      }
    },
  });

  const isMobile = useMediaQuery("(max-width: 767px)");

  function editPhone() {
    if (state) {
      formik.setFieldValue("mobile", mobile);
    }
  }

  

  useEffect(() => {
    editPhone();
    //eslint-disable-next-line
  }, []);

  return (
    <>
    <Toaster  position={'top-right'}/>

      <form onSubmit={formik.handleSubmit}>
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
                  fontSize: "25px",
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
                Welcome
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
                Login to drive your agricultural transactions to a one-stop
                digital space
              </Typography>
            </Box>
            <Box>
              <TextField
                className="phone-text"
                sx={{
                  width: "100%",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        mt: "1",
                        ...(isMobile && {
                          marginTop: "5px",
                          fontSize: "13px",
                        }),
                      }}
                    >
                      +91
                    </InputAdornment>
                  ),
                }}
                id="outlined-mobile-input"
                label="Mobile Number"
                type="tel"
                name="mobile"
                onChange={formik.handleChange}
                value={formik.values.mobile}
                onBlur={formik.handleBlur}
                autoComplete="off"
                // placeholder="Phone Number"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p
                  style={{
                    color: "red",
                    marginTop: "5px",
                    marginBottom: "0px",
                    textAlign: "left",
                    ...(isMobile && {
                      fontSize: "13px",
                    }),
                  }}
                >
                  {formik.errors.mobile}
                </p>
              )}
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "15px",
                color: "#212121",
                fontWeight: "600",
                padding: "10px 10px 0px",
                ...(isMobile && {
                  padding: "5px 5px 0px",
                  fontSize: "14px",
                  marginBottom: "5px",
                }),
              }}
            >
              Have trouble logging in?{" "}
              <Link
                href="javascriptvoid:(0)"
                style={{
                  color: "rgb(43, 55, 110)",
                  fontWeight: "600",
                  textDecoration: "auto",
                  ...(isMobile && {
                    fontSize: "14px",
                  }),
                }}
              >
                Get Help
              </Link>
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2121210",
                fontWeight: "600",
                padding: "0px 7px 10px",
                ...(isMobile && {
                  padding: "0px 5px 5px",
                  fontSize: "14px",
                }),
              }}
            >
              By signing in, I agree to the{" "}
              <Link
                href="javascriptvoid:(0)"
                style={{
                  color: "rgb(43, 55, 110)",
                  fontWeight: "600",
                  textDecoration: "auto",
                  ...(isMobile && {
                    fontSize: "14px",
                  }),
                }}
              >
                &apos; Terms of Use &apos;
              </Link>
            </Typography>
          </Box>
        </Stack>
        <Box>
          <LoadingButton
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            loading={loader}
            sx={{
              ...(isMobile && {
                fontSize: "14px",
              }),
            }}
          >
            Sign In
          </LoadingButton>
        </Box>
      </form>
      {/* {subtitle} */}
    </>
  );
}

export default AuthLogin;
