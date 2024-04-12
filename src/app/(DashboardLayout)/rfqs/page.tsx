"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
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
// import { rfqs } from "../../db";
import { usePathname } from "next/navigation";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import createAxiosInstance from "@/app/axiosInstance";
import toast from "react-hot-toast";
import Image from "next/image";
import Noimagefound from "@/img/No-image-found.jpg";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useAppselector } from "@/redux/store";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import { useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Rfqs() {
  const [rfqData, setRfqData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [option, setOption] = useState<string>("sent");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState<any>(false);
  // const [rfqDetails, setRfqDetails] = useState<any>(false);
  const [rfqDetails, setRfqDetails] = useState<any[]>([]);

  const handleClickOpenDialog = (rfqId: any) => {
    setOpenDialog(true);
    fetchRfqDetails(rfqId);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const pathname = usePathname();
  const router = useRouter();
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  let businessId = defaultBusinessId;
  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const handleClickNavigate = (
    catalogId: any,
    createdBusinessId: any,
    bussinessListingId: any,
    businessId: any,
    rfqId: any
  ) => {
    router.push(
      `/create-quote?catalogueId=${catalogId}&createdBusinessId=${createdBusinessId}&bussinessListingId=${bussinessListingId}&businessId=${businessId}&rfqId=${rfqId}`
    );
  };

  // console.log('rfqData:', rfqDetails)

  const fetchRfq = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `rfq/list/${option}?businessId=${businessId}&pageNumber=1&count=100`
      );

      const newData = response.data.data;

      setRfqData(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  const deleteRfq = (id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = axiosInstance.get(`rfq/cancel_rfq/${id}`);
      toast.success("rfq deleted successfully");
      fetchRfq();
    } catch (err) {
      console.log(err);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    fetchRfq();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchRfq();
    // eslint-disable-next-line
  }, [option]);

  const openCancleRfqSwal = (id: string) => {
    handleClosePopover();
    Swal.fire({
      title: "Cancle Rfq",
      text: "Do you want to cancle this RFQ",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result: any) => {
      if (result.isConfirmed) {
        deleteRfq(id);
      }
    });
  };

  const handleHover = {
    backgroundColor: "#2b305c",
    textDecoration: "none",
  };

  const handleOpenPopover = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const fetchQuoteForm = async (catalogId: any) => {
  //   try {
  //     const axiosInstance = createAxiosInstance();

  //     const response = await axiosInstance.get(
  //       `quote/quote_attributes/form?catalogId=${catalogId}&language=English/`
  //     );

  //     const newData = response.data.data;

  //     setQuoteFormData(newData);

  //     setLoading(false);
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message[0] || "An error occurred");
  //     setLoading(false);
  //   }
  // };

  const fetchRfqDetails = async (rfqId: any) => {
    const axiosInstance = createAxiosInstance();

    try {
      const response = await axiosInstance.get(
        `rfq/received/${rfqId}/${businessId}`
      );

      const newData = response.data.data;

      setRfqDetails([newData]);
      // console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching RFQ details:", error);
      toast.error("An error occurred while fetching RFQ details");
    }
  };

  console.log(
    "rfqData___________",
    rfqData,
    "rfqDetails++++++++++++",
    rfqDetails
  );

  // useEffect(() => {
  //   fetchRfqDetails();
  //   // eslint-disable-next-line
  // }, []);

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
          <>
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
                  mx: "auto",
                }}
              ></Box>
              {rfqData.length > 0 ? (
                rfqData.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{ width: "23%", marginRight: "16px" }}
                  >
                    <Box key={item._id}>
                      {option === "received" ? (
                        <>
                          <Card
                            sx={{
                              width: "100%",
                              background: "#f0f5f9",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <CardContent
                              sx={{ minHeight: "245px", padding: "11px" }}
                            >
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
                                  {item.productName}
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
                                  {item?.RFQUniqueId}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  {item.address &&
                                  typeof item.address === "string"
                                    ? item.address
                                        .split(",")
                                        .map(
                                          (
                                            part: string,
                                            index: number,
                                            parts: string[]
                                          ) => {
                                            const trimmedPart = part.trim();

                                            if (index >= parts.length - 3) {
                                              if (index === parts.length - 3) {
                                                // Use a regex to remove "Division" from the part
                                                const withoutDivision =
                                                  trimmedPart
                                                    .replace(
                                                      /\bDivision\b/i,
                                                      ""
                                                    )
                                                    .trim();
                                                const words =
                                                  withoutDivision.split(" ");

                                                if (words.length === 2) {
                                                  // Convert to uppercase and take the first word
                                                  return (
                                                    <span key={index}>
                                                      {words[0].toUpperCase()}
                                                      {index < parts.length - 1
                                                        ? ", "
                                                        : ""}
                                                    </span>
                                                  );
                                                } else {
                                                  return (
                                                    <span key={index}>
                                                      {withoutDivision}
                                                      {index < parts.length - 1
                                                        ? ", "
                                                        : ""}
                                                    </span>
                                                  );
                                                }
                                              }
                                              return (
                                                <span key={index}>
                                                  {trimmedPart}
                                                  {index < parts.length - 1
                                                    ? ", "
                                                    : ""}
                                                </span>
                                              );
                                            }

                                            return null;
                                          }
                                        )
                                    : null}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "3px",
                                  marginY: "10px",
                                  alignItems: "flex-start",
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
                                  {item.name}
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
                                    Expected Price{" "}
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
                                    {item.expectedPrice}
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
                                    Required Quantity{" "}
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
                                    {item.requiredQuantity}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 12,
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
                                  Status:{" "}
                                </span>{" "}
                                {item.status}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 12,
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
                                  Date:{" "}
                                </span>{" "}
                                {item.createdAt}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ padding: "0px" }}>
                              {/* <Button
                          size="small"
                          onClick={() => openCancleRfqSwal(item.rfqId)}
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
                        </Button> */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  right: "0px",
                                  top: "0px",
                                }}
                              >
                                {item.status !== "Responded" && (
                                  <>
                                    <IconButton
                                      onClick={handleOpenPopover}
                                      sx={{
                                        "&:hover": {
                                          cursor: "pointer",
                                        },
                                      }}
                                    >
                                      <MoreVertIcon />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                              <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClosePopover}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                              >
                                <div className="extra-click">
                                  <Box>
                                    <Button
                                      variant="text"
                                      color="primary"
                                      onClick={() => {
                                        openCancleRfqSwal(item.rfqId);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </div>
                              </Popover>
                              {item.status !== "Responded" && (
                                <>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      handleClickOpenDialog(item.rfqId);
                                    }}
                                    sx={{
                                      padding: "8px",
                                      background: "#2b305c",
                                      width: "100%",
                                      textAlign: "center",
                                      color: "#fff",
                                      borderRadius: "0px",
                                      "&:hover": handleHover,
                                      ml: "0px !important",
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </>
                              )}
                            </CardActions>
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card
                            sx={{
                              width: "100%",
                              background: "#f0f5f9",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <CardContent
                              sx={{
                                minHeight: "225px",
                                padding: "11px !important",
                              }}
                            >
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
                                  {item.productName}
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
                                  {item?.RFQUniqueId}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  {item.address &&
                                  typeof item.address === "string"
                                    ? item.address
                                        .split(",")
                                        .map(
                                          (
                                            part: string,
                                            index: number,
                                            parts: string[]
                                          ) => {
                                            const trimmedPart = part.trim();

                                            if (index >= parts.length - 3) {
                                              if (index === parts.length - 3) {
                                                // Use a regex to remove "Division" from the part
                                                const withoutDivision =
                                                  trimmedPart
                                                    .replace(
                                                      /\bDivision\b/i,
                                                      ""
                                                    )
                                                    .trim();
                                                const words =
                                                  withoutDivision.split(" ");

                                                if (words.length === 2) {
                                                  // Convert to uppercase and take the first word
                                                  return (
                                                    <span key={index}>
                                                      {words[0].toUpperCase()}
                                                      {index < parts.length - 1
                                                        ? ", "
                                                        : ""}
                                                    </span>
                                                  );
                                                } else {
                                                  return (
                                                    <span key={index}>
                                                      {withoutDivision}
                                                      {index < parts.length - 1
                                                        ? ", "
                                                        : ""}
                                                    </span>
                                                  );
                                                }
                                              }
                                              return (
                                                <span key={index}>
                                                  {trimmedPart}
                                                  {index < parts.length - 1
                                                    ? ", "
                                                    : ""}
                                                </span>
                                              );
                                            }

                                            return null;
                                          }
                                        )
                                    : null}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "3px",
                                  marginY: "10px",
                                  alignItems: "flex-start",
                                }}
                              >
                                <VerticalShadesClosedOutlinedIcon
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
                                  {item.companyName}
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
                                    Expected Price{" "}
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
                                    {item.expectedPrice}
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
                                    Required Quantity{" "}
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
                                    {item.requiredQuantity}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 12,
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
                                  Date:{" "}
                                </span>{" "}
                                <span style={{ marginRight: "3px" }}>
                                  {new Date(item?.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                                <span>|</span>
                                <span style={{ marginLeft: "3px" }}>
                                  {new Date(item?.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ padding: "0px" }}>
                              <Button
                                size="small"
                                onClick={() => {
                                  openCancleRfqSwal(item.rfqId);
                                }}
                                sx={{
                                  padding: "8px",
                                  background: "#2b305c",
                                  width: "100%",
                                  textAlign: "center",
                                  color: "#fff",
                                  borderRadius: "0px",
                                  "&:hover": handleHover,
                                  ml: "0px !important",
                                }}
                              >
                                Cancel
                              </Button>
                            </CardActions>
                          </Card>
                        </>
                      )}
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

            <Dialog
              open={openDialog}
              keepMounted
              maxWidth="xs"
              fullWidth
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
              sx={{ borderRadius: "30px !important" }}
            >
              {rfqDetails.map((item: any, index: number) => (
                <>
                  <DialogContent sx={{ padding: "26px" }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        width: "100%",
                        marginLeft: "0px",
                        marginTop: "0px",
                      }}
                    >
                      <Box
                        key={index}
                        sx={{ display: "flex", width: "100%", gap: "10px" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Card
                            sx={{
                              width: "100%",
                              padding: "15px",
                              marginBottom: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.businessListingDetails?.productName}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#000",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <PlaceOutlinedIcon
                                  sx={{
                                    color: "#fff",
                                    fontSize: "34px",
                                    marginRight: "6px",
                                    background: "#5c934c",
                                    padding: "7px",
                                    borderRadius: "20px",
                                    boxShadow: "inset 0px 0px 6px 0px #fff",
                                  }}
                                />
                                <Typography>
                                  {item?.businessListingDetails?.address &&
                                  typeof item?.businessListingDetails
                                    ?.address === "string"
                                    ? item.businessListingDetails.address
                                        .split("\n")
                                        .map(
                                          (
                                            line: any,
                                            index: any,
                                            lines: any
                                          ) => (
                                            <span key={index}>
                                              {line?.trim()}
                                              {index < lines.length - 1
                                                ? ""
                                                : ""}
                                            </span>
                                          )
                                        )
                                    : null}
                                </Typography>
                              </Typography>
                            </Box>
                          </Card>
                          <Card
                            sx={{
                              width: "100%",
                              padding: "15px",
                              marginBottom: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: "#000",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                ID : {item?.rfqDetails?.RFQUniqueId}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                }}
                              >
                                RFQ Details
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.rfqDetails.name}
                              </Typography>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box sx={{ width: "50%" }}>
                                  <Typography sx={{ fontSize: "12px" }}>
                                    Expected Price
                                  </Typography>
                                  <Typography sx={{ fontSize: "14px" }}>
                                    {item?.expectedPrice}
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                  <Typography sx={{ fontSize: "12px" }}>
                                    Required Quantity
                                  </Typography>
                                  <Typography sx={{ fontSize: "14px" }}>
                                    {item?.requiredQuantity}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Typography
                                  sx={{
                                    color: "#5c934c",
                                    marginRight: "6px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item?.status}
                                </Typography>
                                <Typography
                                  sx={{
                                    marginRight: "0px",
                                    fontSize: "12px",
                                    display: "flex",
                                    // alignItems: "center",
                                  }}
                                >
                                  <span style={{ marginRight: "3px" }}>
                                    {new Date(
                                      item?.rfqDetails.createdAt
                                    ).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <span>|</span>
                                  <span style={{ marginLeft: "3px" }}>
                                    {new Date(
                                      item?.rfqDetails.createdAt
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                          <Card
                            sx={{
                              width: "100%",
                              padding: "15px",
                              marginBottom: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  marginBottom: "5px",
                                }}
                              >
                                Delivery Address
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#000",
                                  fontSize: "13px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <PlaceOutlinedIcon
                                  sx={{
                                    color: "#fff",
                                    fontSize: "34px",
                                    marginRight: "6px",
                                    background: "#5c934c",
                                    padding: "7px",
                                    borderRadius: "20px",
                                    boxShadow: "inset 0px 0px 6px 0px #fff",
                                  }}
                                />
                                <Typography>{item.deliveryAddress}</Typography>
                              </Typography>
                            </Box>
                          </Card>
                          {/* <Card
                            sx={{
                              width: "100%",
                              padding: "15px",
                              marginBottom: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  marginBottom: "5px",
                                }}
                              >
                                Product / Service Description
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#000",
                                  fontSize: "13px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                dhddhd
                              </Typography>
                            </Box>
                          </Card> */}
                        </Box>
                        {/* <Box sx={{ width: "59%" }}>
                          <Card sx={{ width: "100%", padding: "15px" }}>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#2B376E",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  marginBottom: "5px",
                                }}
                              >
                                About The Seller
                              </Typography>
                            </Box>
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                marginLeft: "0px",
                                marginTop: "0px",
                                width: "100%",
                                padding: "0px",
                              }}
                            >
                              <Grid
                                item
                                sx={{
                                  marginLeft: "0px",
                                  marginTop: "0px",
                                  width: "100%",
                                  padding: "0px",
                                }}
                              >
                                <Card sx={{ padding: "10px" }}>
                                  <Image
                                    src={Noimagefound}
                                    alt="No Image Found"
                                    height={155}
                                    width={135}
                                    style={{
                                      borderRadius: "12px",
                                      width: "100% !important",
                                    }}
                                  />

                                  <Box>
                                    <Typography
                                      sx={{
                                        color: "#2B376E",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      Bulk
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#000",
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <PlaceOutlinedIcon
                                        sx={{
                                          color: "#000",
                                          fontSize: "15px",
                                          marginRight: "6px",
                                        }}
                                      />
                                      {item.deliveryAddress}
                                    </Typography>
                                  </Box>
                                </Card>
                              </Grid>
                            </Grid>
                          </Card>
                        </Box> */}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "30px",
                            marginTop: "10px",
                            backgroundColor: "#2B376E",
                            textTransform: "none",
                          }}
                          onClick={() =>
                            handleClickNavigate(
                              item?.catalogId,
                              item?.rfqDetails.createdBusinessId,
                              item?.bussinessListingId,
                              item.businessId,
                              item.rfqDetails.ID
                            )
                          }
                        >
                          Respond with quote
                        </Button>
                      </Box>
                    </Grid>
                  </DialogContent>
                </>
              ))}
            </Dialog>
          </>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
