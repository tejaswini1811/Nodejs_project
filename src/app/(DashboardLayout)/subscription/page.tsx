"use client";
import * as React from "react";
import {
  Breadcrumbs,
  Paper,
  Theme,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import createAxiosInstance from "@/app/axiosInstance";
import LinearProgress from "@mui/material/LinearProgress";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { subscriptionType } from "@/types/types";
import Swal from "sweetalert2";
import { useAppselector } from "@/redux/store";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

export default function Subscription() {
  const [progress, setProgress] = React.useState(0);
  const [subscriptionData, setSubscriptionData] = useState<subscriptionType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeSubscriptionData, setActiveSubscriptionData] = useState<any>();
  const [activeSubscriptionLoading, setActiveSubscriptionLoading] =
    useState<boolean>(true);
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);

  const businessID = defaultBusinessId;

  const openCancelSubscriptionSwal = () => {
    Swal.fire({
      title: "Cancel Subscription",
      text: "Do you really want to Cancel the subscription ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result: any) => {
      if (result.isConfirmed) {
        cancleSubscription();
      }
    });
  };

  const axiosInstance = createAxiosInstance();

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         return 0;
  //       }
  //       const diff = Math.random() * 10;
  //       return Math.min(oldProgress + diff, 100);
  //     });
  //   }, 500);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  const pathname = usePathname();

  const router = useRouter();

  const fetchUpgradableSubscription = async () => {
    try {
      const response = await axiosInstance.post(
        `subscription/upgradable_plans`,
        {
          business: businessID,
          type: "upgrade",
        }
      );
      const newData = await response.data.data;
      setSubscriptionData(newData);
      setLoading(false);
    } catch (error) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  const fetchAllSubscription = async () => {
    try {
      const response = await axiosInstance.get(
        `subscription/all_subscription_plans`
      );
      const newData = await response.data.data;
      setSubscriptionData(newData);
      setLoading(false);
    } catch (error) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  const fetchActiveubscription = async () => {
    try {
      const response = await axiosInstance.get(
        `subscription/active/${businessID}`
      );
      const newData = await response.data.data;
      setActiveSubscriptionData(newData);

      setProgress(response.data.data.qcReportsTotalCount);
      setActiveSubscriptionLoading(false);
    } catch (error) {
      toast.error("An error occurred");
      setActiveSubscriptionLoading(false);
    }
  };

  const cancleSubscription = async () => {
    try {
      const response = await axiosInstance.put(`subscription/cancel`, {
        business: businessID,
      });
      toast.success("subscription cancelled successfully");
      fetchActiveubscription();
      fetchAllSubscription();
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  useEffect(() => {
    activeSubscriptionData?.subscriptionPlan?.name
      ? fetchUpgradableSubscription()
      : fetchAllSubscription();

    //eslint-disable-next-line
  }, [activeSubscriptionData]);

  useEffect(() => {
    if (businessID) {
      fetchActiveubscription();
    }
    //eslint-disable-next-line
  }, [businessID]);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );
  const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  const isLaptops = useMediaQuery(
    "(min-width: 1025px) and (max-width: 1400px)"
  );

  return (
    <Grid
      sx={{
        marginX: "auto",
        paddingX: "0px",
        width: "100%",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          marginY: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
            }}
          >
            {activeSubscriptionData?.subscriptionPlan?.name && (
              <Box sx={{ padding: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 600,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#2B376E",
                    }}
                  >
                    {activeSubscriptionData?.subscriptionPlan?.name
                      ? activeSubscriptionData.subscriptionPlan.name
                      : "No active subscription plan"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 700,

                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#333542",
                      }}
                    >
                      Expire On:
                    </span>{" "}
                    {activeSubscriptionData?.expiryDate}
                  </Typography>
                </Box>
                <Divider sx={{ border: 1, color: "#CBD5E1", my: "10px" }} />

                <Box sx={{ display: "flex", gap: "20px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 500,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                    }}
                  >
                    Quality Inspection
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 500,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                    }}
                  >
                    {activeSubscriptionData?.qcReportsTotalCount}/
                    {activeSubscriptionData?.qcReportsRemainingCount}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", my: "20px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={activeSubscriptionData?.qcReportsRemainingCount}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 500,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                    }}
                  >
                    Listing{" "}
                    {activeSubscriptionData?.businessListingRemainingCount}/
                    {activeSubscriptionData?.businessListingTotalCount}
                  </Typography>
                </Box>
                <Box sx={{ my: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      activeSubscriptionData?.businessListingRemainingCount
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 500,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                    }}
                  >
                    Ad Campaign{" "}
                    {activeSubscriptionData?.addCampaignRemainingCount}/
                    {activeSubscriptionData?.addCampaignTotalCount}
                  </Typography>
                </Box>
                <Box sx={{ my: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={activeSubscriptionData?.addCampaignRemainingCount}
                  />
                </Box>
                <Box
                  sx={{
                    mt: "35px",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: "120.15px",
                      height: "45px",

                      padding: "0px, 16px, 0px, 16px",
                      borderRadius: "25px",
                      gap: "16px",
                      backgroundColor: "#2B376E",
                    }}
                    onClick={() => {
                      router.push(
                        `/subscription/subscription1?pid=${activeSubscriptionData._id}`
                      );
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 600,

                        letterSpacing: "0px",
                        textAlign: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      TopUp
                    </Typography>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      width: "120.15px",
                      height: "45px",
                      padding: "0px, 16px, 0px, 16px",
                      borderRadius: "25px",
                      gap: "16px",
                      backgroundColor: "#F90E0E",
                      "&.MuiButtonBase-root:hover": {
                        bgcolor: "#F90E0A",
                      },
                    }}
                    onClick={openCancelSubscriptionSwal}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "0px",
                        textAlign: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      Cancel
                    </Typography>
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <>
            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontWeight: 600,

                  
                  textAlign: "left",
                  color: "#2B376E",
                  my: "20px",
                }}
              >
                Upgrade Subscription
              </Typography>
            </Box>
          </>

      <PageContainer>
        <DashboardCard>
          
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "3vw" }}>
            {loading ? (
              <Box>
                <Typography variant="body1" color="initial">
                  loading
                </Typography>
              </Box>
            ) : (
              subscriptionData.map((item, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3vw",
                    width: "22%",
                    ...(isMobile && {
                      width: "100%",
                    }),
                    ...(isBiggerMobiles && {
                      width: "47.5%",
                    }),
                    ...(isTablets && {
                      width: "48.5%",
                    }),
                    ...(isTablets && {
                      width: "47.5%",
                    }),
                    ...(isLaptops && {
                      width: "30%",
                    }),
                  }}
                >
                  {
                    <Card sx={{ width: "21rem" }}>
                      <CardContent sx={{padding:"20px"}}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: "1.25em",
                                fontWeight: 600,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#2B376E",
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                          <Divider
                            sx={{
                              marginBottom: "1.25em",
                              marginTop: "10px",
                              borderColor: "#CBD5E1",
                            }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: "1em",
                                fontWeight: 500,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              Qc Report Count: {item.qcReportsCount}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: "1em",
                                fontWeight: 500,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              Listing Count: {item.businessListingCount}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginY: "0.625em",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: "1.25em",
                                fontWeight: 600,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#2B376E",
                              }}
                            >
                              Validity (In Days): {item.validityInDays}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: "1.25em",
                                fontWeight: 600,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#2B376E",
                              }}
                            >
                              {Number(item.price) === 0
                                ? "Free"
                                : `₹${item.price}`}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{
                                borderRadius: "1.438em",
                                textTransform: "none",

                                width: "7.509em",
                                height: "2.813",

                                padding: "0em, 1em, 0em, 1em",

                                gap: "1em",
                                backgroundColor: "#2B376E",
                              }}
                              onClick={() =>
                                router.push(
                                  `/upgradesubs?id=${item._id}&plan=subs`
                                )
                              }
                            >
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "1em",
                                  fontWeight: 600,

                                  letterSpacing: "0em",
                                  textAlign: "center",
                                  color: "#FFFFFF",
                                }}
                              >
                                {activeSubscriptionData?.subscriptionPlan?.name
                                  ? "Upgrade"
                                  : "Subscribe"}
                              </Typography>
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  }
                </Box>
              ))
            )}
          </Box>
        </DashboardCard>
      </PageContainer>
    </Grid>
  );
}
