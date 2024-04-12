"use client";
import * as React from "react";
import { Breadcrumbs, Paper, Theme, ThemeProvider, createTheme } from "@mui/material";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import createAxiosInstance from "@/app/axiosInstance";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppselector } from "@/redux/store";

export default function Subscription() {
  const [progress, setProgress] = React.useState(0);

  const [subscriptionData, setSubscriptionData] = useState<any>([]);

  const pathname = usePathname();

  const params = useSearchParams();
  const pid: any = params.get("pid");

  const router = useRouter();

  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const businessId = defaultBusinessId;

  const fetchSubscription = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(
        `subscription/top_up_plan_list/app?businessId=${businessId}&count=12&pageNumber=1`
      );
      const newData = await response.data.data;
      setSubscriptionData(newData);
      // console.log("response", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubscription();
    //eslint-disable-next-line
  }, []);

  // console.log(subscriptionData);

  return (
    <Grid container spacing={2}>
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

      <PageContainer>
        <DashboardCard>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2vw" }}>
            {subscriptionData === 0 ? (
              <Box>
                <Typography variant="body1" color="initial">
                  loading
                </Typography>
              </Box>
            ) : (
              subscriptionData.map((item: any, index: number) => (
                <Box key={index}>
                  <Card>
                    <CardContent sx={{width:"20rem"}}>
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
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontWeight: 600,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",
                            }}
                          >
                            {Number(item.price) === 0
                              ? "Free"
                              : `₹${item.price}`}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{
                            marginBottom: "20px",
                            marginTop: "10px",
                            borderColor: "#CBD5E1",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginY: "10px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontWeight: 600,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",
                            }}
                          >
                            {item.planType}
                          </Typography>
                        </Box>
                        <Box>
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
                            {item.qcReportsCount} QC Report
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
                            {item.businessListingCount} Business Listing
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
                            {item.addCount || 0} Add Campaign
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
                              borderRadius: "25px",
                              textTransform: "none",

                              width: "120.15px",
                              height: "45px",

                              padding: "0px, 16px, 0px, 16px",

                              gap: "16px",
                            }}
                            onClick={() =>
                              router.push(
                                `/upgradesubs?id=${item._id}&pid=${pid}&plan=topup`
                              )
                            }
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
                              Add
                            </Typography>
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))
            )}
          </Box>
        </DashboardCard>
      </PageContainer>
    </Grid>
  );
}
