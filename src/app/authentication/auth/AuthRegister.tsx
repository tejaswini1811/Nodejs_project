"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import Link from "next/link";
// @ts-ignore:next-line
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppselector } from "@/redux/store";
import { Stack } from "@mui/system";
import { verifyOtpAsync } from "@/redux/features/authSlice";
import Cookies from "js-cookie";
import createAxiosInstance from "@/app/axiosInstance";
import Logo from "@/img/Logo.png";
import Image from "next/image";
import "@/app/global.css";
import LoadingButton from "@mui/lab/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [otp, setOtp] = useState<string>("");
  const [accessToken, setAccessToken] = useState<any>(null);
  const [userData, setUserData] = useState<any>();
  const [loader, setLoader] = useState<boolean>(false);
  const axiosInstance = createAxiosInstance();

  const dispatch = useDispatch();

  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoader(true);

      const response = await axiosInstance.get(`user`);

      const newData = await response.data.data;
      setUserData(newData);
      if (newData) {
        if (newData.isNewUser) {
          router.push("/authentication/basic");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    }
    //eslint-disable-next-line
  }, [accessToken]);

  const { sessionId, mobile } = useAppselector((state) => state?.auth.value);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const verifyAction: any = verifyOtpAsync({
        mobile: mobile,
        session_id: sessionId,
        otp_input: otp,
        language: "English",
      });
      const verifyOtpResult = await dispatch(verifyAction);

      if (verifyOtpAsync.fulfilled.match(verifyOtpResult)) {
        const apiRes = verifyOtpResult.payload;
        if (apiRes.status === "success") {
          toast.success("verified Please wait for Onboard..!");
          setAccessToken(apiRes.data.accessToken);
          localStorage.setItem("accessToken", apiRes.data.accessToken);
          Cookies.set("accessToken", apiRes.data.accessToken);
        }
      } else {
        toast.error("Something went wrong!, Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong!, Please try again.");
    }
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resendNumber = async () => {
    try {
      await axiosInstance.post("auth/otp_generate", {
        mobile: mobile,
      });
      toast.success(`OPT resent to ${mobile}`);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <Toaster position={"top-right"} />

      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

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
              paddingBottom: "0px",
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
            Verification
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
            Enter the 6-digit code just sent to your Mobile{" "}
            <span style={{ color: "#0f76a1" }}>{mobile}</span>{" "}
            <span
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => router.push("/authentication/login?state=edit")}
            >
              Edit
            </span>
          </Typography>
        </Box>
        <Stack
          className="align-inpt"
          mb={"7px"}
          sx={{
            ...(isMobile && {
              marginBottom: "5px",
            }),
          }}
        >
          <OtpInput
            inputStyle={{
              border: "1px solid #CFD3DB",
              marginLeft: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#F9FAFB",
            }}
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props) => <input {...props} />}
          />

          {/*
         <OTPInput
            className="otp-style"
            value={otp}
            onChange={setOtp}
            autoFocus
            OTPLength={6}
            marginY={"auto"}
            otpType="number"
            disabled={false}
            style={{
              textAlign: "center",
              width: "100%",
              justifyContent: "center !important",
            }}
          />
        */}
        </Stack>
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "10px",
              color: "#212121",
              fontWeight: "600",
              padding: "10px 0px 0px",
              ...(isMobile && {
                padding: "5px 5px 0px",
                fontSize: "14px",
                marginBottom: "2px",
              }),
            }}
          >
            {/* {seconds > 0 ? (
        <Typography variant="body1">Resend the OTP in <span style={{color:"blue"}}>{seconds}</span> seconds</Typography>
      ) : (
        <Typography variant="body1" color="initial">Didnt Recieve the otp <span style={{color:"blue",cursor:"pointer"}} onClick={()=>resendNumber()}>resend</span> to {mobile}</Typography>
      )} */}
          </Typography>

          <Typography
            sx={{
              fontSize: "14x",
              textAlign: "center",
              marginBottom: "10px",
              color: "#2121210",
              fontWeight: "600",
              padding: "0px 7px",
              ...(isMobile && {
                padding: "0px 5px 0px",
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
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "10px",
              color: "#2121210",
              fontWeight: "600",
              padding: "0px 7px 10px",
              ...(isMobile && {
                padding: "0px 5px 5px",
                fontSize: "14px",
                marginBottom: "5px",
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
        <Box>
          <LoadingButton
            color="primary"
            onClick={handleSubmit}
            variant="contained"
            size="large"
            fullWidth
            loading={loader}
            sx={{
              ...(isMobile && {
                fontSize: "14px",
              }),
            }}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
