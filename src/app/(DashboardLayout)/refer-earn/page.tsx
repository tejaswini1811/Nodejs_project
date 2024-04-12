"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  Button,
  Card,
  Breadcrumbs,
} from "@mui/material";
import { IconGift, IconStarFilled, IconCopy } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createAxiosInstance from "@/app/axiosInstance";
import { useAppselector } from "@/redux/store";
import Swal from "sweetalert2";

function EarnRefer() {
  const [referralInfoData, setReferralInfo] = useState<any[]>([]);
  const [referralDetailsData, setReferralDetailsInfo] = useState<{
    referalCode: string;
    isRedeemEligble: boolean;
  }>();
  const [loading, setLoading] = useState(true);
  const [isRedeemEligible, setIsRedeemEligible] = useState(false);
  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const [referedUserCount, setReferedUserCount] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const pathname: string = usePathname();
  const { _id } = useAppselector((state) => state?.user.value);

  const redeemPoints = async () => {
    try {
      const confirmed = await Swal.fire({
        title: "Confirm !",
        text: "Are you sure you want to redeem your points?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });

      if (confirmed.isConfirmed) {
        const axiosInstance = createAxiosInstance();
        const response: any = await axiosInstance.post(
          `/refer-earn/reedem-points`
        );
        console.log('Response>>>>>>>>>>>',response)
        if (response.status===200) {
          Swal.fire("Success", response.data.message, "success");
        }
      }
    } catch (error:any) {
      Swal.fire(
        "Error",
        error.response.data.message[0] || "An error occurred while redeeming points","error"
      );
    }
  };

  const fetchReferralDetails = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/refer-earn/referal-details/${_id}`
      );

      const newData = response.data.data;

      setReferralDetailsInfo(newData);
      setIsRedeemEligible(newData.isRedeemEligble);
      setTotalEarnPoints(newData.totalEarnPoints);
      setReferedUserCount(newData.referedUserCount);
      setRemainingPoints(newData.remainingPoints);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.data || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (_id) {
      fetchReferralDetails();
    }
  }, [_id]);

  const fetchReferralInfo = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(`/refer-earn/referral-info`);

      const newData = response.data.data;

      setReferralInfo(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.data || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const steps = [
    {
      heading: "Registration :",
      label: " 50 Points",
      icon: <IconStarFilled />,
      pointKey: "registrationPoint",
    },
    {
      heading: "Subscription :",
      label: " 50 Points",
      icon: <IconStarFilled />,
      pointKey: "subscriptionPoint",
    },
    {
      heading: "List Business :",
      label: " 50 Points",
      icon: <IconStarFilled />,
      pointKey: "listBusinessPoint",
    },
  ];

  const copyPromoCode = (promoCode: any) => {
    navigator.clipboard.writeText(promoCode);
    toast.success("Referral code copied!");
  };

  return (
    <>
      <ToastContainer />
      <Grid
        container
        spacing={2}
        sx={{
          paddingLeft: "0px",
          paddingTop: "0px",
          marginTop: "0px",
          marginLeft: "0px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs>
              <Typography
                sx={{
                  fontFamily: "Roboto",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#2B376E",
                  textTransform: "uppercase",
                }}
              >
                Home {pathname}
              </Typography>
            </Breadcrumbs>
        </Box>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <>
            <Box>
              <Box sx={{ textAlign: "center" }}>
                <IconGift
                  style={{ width: "80px", height: "80px", color: "#2b305c" }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#000",
                    fontWeight: "500",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "Center",
                    justifyContent: "center",
                  }}
                >
                  Your Referral Code :{" "}
                  {referralDetailsData && (
                    <span
                      style={{
                        color: "#5c934c",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      {referralDetailsData.referalCode}
                    </span>
                  )}
                  <span
                    onClick={() =>
                      copyPromoCode(referralDetailsData?.referalCode)
                    }
                    style={{ display: "flex", marginLeft: "10px" }}
                  >
                    <IconCopy
                      style={{
                        height: "28px",
                        width: "28px",
                        padding: "5px",
                        background: "#f0f5f9",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </Typography>
              </Box>
              <Typography
                sx={{ width: "48%", margin: "0 auto", textAlign: "center" }}
              >
                I Love AgriRech , Hope you also love it! Please refer the code
                between your friends and earn total {" "}
                {referralInfoData.map((item: any, index: any) => (
                          <span
                            key={index}
                            style={{ color: "#5c934c",fontWeight:"900", fontSize: "17px" }}
                          >
                            {item.pointPerRefer}  {" "}
                          </span>
                        ))} points. Grab the chance and earn the points. Thanks !
              </Typography>

              <Box sx={{ marginTop: "30px" }}>
                <Stepper activeStep={2} alternativeLabel>
                  {steps.map(({ heading, label, icon , pointKey}) => (
                    <Step key={label}>
                      <StepLabel icon={icon} className="test">
                        {heading}{" "}
                        {referralInfoData.map((item: any, index: any) => (
                       <span
                            key={index}
                            style={{ color: "#5c934c", fontSize: "17px" }}
                          >
                            {item[pointKey]} Points
                          </span>
                         ))}
                         
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "30px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: "30px",
                    }}
                  >
                    <Card
                      style={{
                        width: "250px",
                        height: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid black",
                        marginRight: "15px",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>{referedUserCount}</strong>
                      </Typography>{" "}
                      {/* Dynamic value */}
                      <Typography variant="body2">Total Referrals</Typography>
                    </Card>

                    <Card
                      style={{
                        width: "250px",
                        height: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid black",
                        marginRight: "15px",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>{remainingPoints}</strong>
                      </Typography>{" "}
                      {/* Dynamic value */}
                      <Typography variant="body2">Remaining Points</Typography>
                    </Card>

                    <Card
                      style={{
                        width: "250px",
                        height: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid black",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <strong>{totalEarnPoints}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginLeft: "10px" }}
                      >
                        Total Points
                      </Typography>
                    </Card>
                  </Box>

                  <Button
                    variant="contained"
                    disabled={!isRedeemEligible}
                    color="primary"
                    sx={{ marginTop: "20px", width: "200px", height: "45px" }}
                    onClick={redeemPoints}
                  >
                    {isRedeemEligible
                      ? "Redeem"
                      : "Not Eligible To Redeem!! Earn More points"}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ marginTop: "30px" }}>
              <Typography
                sx={{
                  fontSize: "17px",
                  mb: "5px",
                  color: "#afafaf",
                }}
              >
                How to collect Loyality Points ?
              </Typography>
              <List
                sx={{
                  padding: "0px",
                }}
              >
                {referralInfoData.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: "0px",
                      mb: "8px",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        color: "#000",
                        fontWeight: "700",
                        marginRight: "5px",
                      }}
                    >
                      1.)
                    </span>{" "}
                    {item.registrationPoint} Points on the first successful
                    Registration.
                  </ListItem>
                ))}
                {referralInfoData.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: "0px",
                      mb: "8px",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        color: "#000",
                        fontWeight: "700",
                        marginRight: "5px",
                      }}
                    >
                      2.)
                    </span>{" "}
                    {item.subscriptionPoint} Points on taking the first
                    Subscription.
                  </ListItem>
                ))}
                {referralInfoData.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: "0px",
                      mb: "8px",
                      alignItems: "flex-start",
                      color: "#000",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        color: "#000",
                        fontWeight: "700",
                        marginRight: "5px",
                      }}
                    >
                      3.)
                    </span>{" "}
                    {item.listBusinessPoint} Points when you list your buisnes with
                    us (AgriReach).
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        </DashboardCard>
      </PageContainer>
    </>
  );
}

export default EarnRefer;
