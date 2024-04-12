"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Breadcrumbs,
  Divider,
  Stack,
  TextField,
  Theme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import notfound from "@/img/notfound.png";
// import { quotes } from "../../db";
import { usePathname } from "next/navigation";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import createAxiosInstance from "@/app/axiosInstance";
import toast from "react-hot-toast";
import Image from "next/image";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useAppselector } from "@/redux/store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";

export default function Quote() {
  const [quoteData, setQuoteData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [option, setOption] = useState<string>("sent");

  const pathname = usePathname();

  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  let businessId = defaultBusinessId;
  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const fetchQuote = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/quote/quote_list/all/send?businessId=${businessId}&pageNumber=1&count=12`
      );

      const newData = response.data.data;

      setQuoteData(newData);
      console.log(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };
  const fetchQuoteReceived = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/quote/quote_list/all/received?businessId=${businessId}&pageNumber=1&count=12&searchValue=&catalogId=&filterByStatus=&sortBy=Newest`
      );

      const newData = response.data.data;

      setQuoteData(newData);
      console.log(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  const fetchQuoteCancelled = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/quote/quote_list/all/cancel?businessId=${businessId}&pageNumber=1&count=12&searchValue=&catalogId=&filterByStatus=&sortBy=Newest`
      );

      const newData = response.data.data;

      setQuoteData(newData);
      console.log(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (option === "sent") {
      fetchQuote();
    }
    if (option === "received") {
      fetchQuoteReceived();
    }
    if (option === "Cancelled") {
      fetchQuoteCancelled();
    }
  }, [option]);

  const handleHover = {
    backgroundColor: "#2b305c",
    textDecoration: "underline",
  };

  return (
    <>
      <Grid container spacing={6} mb={2}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
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

          <Stack spacing={1} direction={"row"}>
            <Box>
              <FormControl
                sx={{
                  width: 80,
                }}
                size="small"
              >
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={option}
                  defaultValue="Sent"
                  onChange={handleChange}
                >
                  <MenuItem value={"sent"}>Sent</MenuItem>
                  <MenuItem value={"received"}>Received</MenuItem>
                  <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Products & Services"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          width: 21,
                          height: 21,
                          padding: "2.83px, 2.84px, 2.84px, 2.83px",
                          color: "#BFC8D6",
                        }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "25px",
                    width: 255,
                    borderColor: "#CBD5E1",
                    backgroundColor: "#FFFFFF",
                  },
                }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <Grid
            container
            spacing={2}
            sx={{
              height: "auto",
              overflow: "auto",
              paddingBottom: "5px",
              margin: "0",
              paddinLeft: "0px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // height: "70vh",
                mx: "auto",
              }}
            ></Box>
            {quoteData?.length > 0 ? (
              quoteData?.map((item: any, index: number) => (
                <div key={index} style={{ width: "23%", marginRight: "16px" }}>
                  <Box key={item._id}>
                    <Card
                      sx={{
                        width: "100%",
                        background: "#f0f5f9",
                        marginBottom: "16px",
                      }}
                    >
                      {option === "received" ? (
                        <>
                          <CardContent sx={{ minHeight: "225px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#000000",
                                }}
                              >
                                {item?.listingName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "darkblue",
                                }}
                              >
                                {item?.QuoteUniqueId}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#2B376E",
                                  minHeight: "44px",
                                }}
                              >
                                {item?.businesslistingDetail?.listingLocation &&
                                typeof item?.businesslistingDetail
                                  ?.listingLocation === "string"
                                  ? item.businesslistingDetail.listingLocation
                                      .split("\n")
                                      .map(
                                        (line: any, index: any, lines: any) => (
                                          <span key={index}>
                                            {line?.trim()}
                                            {index < lines.length - 1 ? "" : ""}
                                          </span>
                                        )
                                      )
                                  : null}
                              </Typography>
                            </Box>

                            <Grid container spacing={0}>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  Quoted Price{" "}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#000000",
                                    marginBottom: "1px",
                                  }}
                                >
                                  {" "}
                                  {item.quotedPrice}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  Quoted Quantity{" "}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",

                                    marginBottom: "1px",
                                  }}
                                >
                                  {" "}
                                  {/* 1 sq.cm */}
                                  {item.quantity}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: "0em",
                                color: "#333542",
                                marginTop: "10px",
                                marginBottom: "1px",
                              }}
                            >
                              {" "}
                              {/* 1 sq.cm */}
                              <span
                                style={{ color: "orange", fontSize: "12px" }}
                              >
                                Delivery Time:{" "}
                              </span>{" "}
                              {item.deliveryTime} days
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: "0em",
                                color: "#333542",
                                marginTop: "0px",
                                marginBottom: "1px",
                              }}
                            >
                              {/* 1 sq.cm */}
                              <span
                                style={{ color: "orange", fontSize: "12px" }}
                              >
                                Date:{" "}
                              </span>{" "}
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </Typography>
                          </CardContent>
                        </>
                      ) : (
                        <>
                          <CardContent sx={{ minHeight: "268px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#000000",
                                }}
                              >
                                {item?.listingName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "darkblue",
                                }}
                              >
                                {item?.QuoteUniqueId}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#2B376E",
                                  minHeight: "44px",
                                }}
                              >
                                {item?.businesslistingDetail?.listingLocation &&
                                typeof item?.businesslistingDetail
                                  ?.listingLocation === "string"
                                  ? item.businesslistingDetail.listingLocation
                                      .split("\n")
                                      .map(
                                        (line: any, index: any, lines: any) => (
                                          <span key={index}>
                                            {line?.trim()}
                                            {index < lines.length - 1 ? "" : ""}
                                          </span>
                                        )
                                      )
                                  : null}
                              </Typography>
                            </Box>
                            {option === "sent" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  marginY: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <AccountCircleIcon
                                  sx={{
                                    width: "31px",
                                    height: "31px",
                                    color: "#fff",
                                    padding: "6px",
                                    borderRadius: "23px",
                                    background: "#5c934c",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#000000",
                                  }}
                                >
                                  {item?.rfqCreatorName}
                                </Typography>
                              </Box>
                            )}
                            <Grid container spacing={0}>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  Quoted Price{" "}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#000000",
                                    marginBottom: "1px",
                                  }}
                                >
                                  {" "}
                                  {item.quotedPrice}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  Quoted Quantity{" "}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",

                                    marginBottom: "1px",
                                  }}
                                >
                                  {" "}
                                  {/* 1 sq.cm */}
                                  {item.quantity}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: "0em",
                                color: "#333542",
                                marginTop: "10px",
                                marginBottom: "1px",
                              }}
                            >
                              {" "}
                              {/* 1 sq.cm */}
                              <span
                                style={{ color: "orange", fontSize: "12px" }}
                              >
                                Delivery Time:{" "}
                              </span>{" "}
                              {item.deliveryTime} days
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: "0em",
                                color: "#333542",
                                marginTop: "0px",
                                marginBottom: "1px",
                              }}
                            >
                              {/* 1 sq.cm */}
                              <span
                                style={{ color: "orange", fontSize: "12px" }}
                              >
                                Date:{" "}
                              </span>{" "}
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </Typography>
                          </CardContent>
                        </>
                      )}
                      <CardActions sx={{ padding: "0px" }}>
                        <Button
                          size="small"
                          sx={{
                            padding: "8px",
                            background: "#2b305c",
                            width: "100%",
                            textAlign: "center",
                            color: "#fff",
                            borderRadius: "0px",
                            "&:hover": handleHover,
                          }}
                        >
                          Cancel
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </div>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mx: "auto",
                }}
              >
                <Image src={notfound} alt="Not Found" />
              </Box>
            )}
          </Grid>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
