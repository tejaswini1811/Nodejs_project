"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import * as React from "react";
import styled from "@emotion/styled";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Theme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { IconGift } from "@tabler/icons-react";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import object from "../../img/OBJECTS.jpg";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Link from "next/link";
import Image from "next/image";
import createAxiosInstance from "../axiosInstance";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import { catalogType, buyLeadsType, marketplaceType } from "@/types/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import marketPlaceImage from "../../img/marketplace2333.png";
import businessListImage from "../../img/businessLIsting.png";
import { useAppselector } from "@/redux/store";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Dashboard = () => {
  const [marketPlace, setMarketPlace] = useState<marketplaceType[]>([]);
  const [loadingMarketPlace, setLoadingMarketPlace] = useState(true);

  const [flashImageUrl, setFlashImageUrl] = useState("");
  const [flashImageDescription, setFlashImageDescription] = useState("");
  const [reviews, setReviews] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [buyleads, setBuyLeads] = useState<buyLeadsType[]>([]);
  const [loading, setLoading] = useState(true);

  const [catalogueData, setCatalogueData] = useState<catalogType[]>([]);
  const { defaultBusinessId, showReferral } = useAppselector(
    (state) => state?.user.value
  );
  const [open, setOpen] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.put("/user/update-referral");
      formik.resetForm();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (showReferral === true) {
      handleClickOpen();
    }
  }, [showReferral]);

  const validationSchema = Yup.object({
    referralCode: Yup.string().required("Referral code is required"),
  });

  const formik = useFormik({
    initialValues: {
      referralCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post("/refer-earn/refer-user", {
          referalCode: values?.referralCode,
        });

        console.log(response);

        resetForm();
        handleClose();

        toast.success("Referral code submitted successfully!");
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message[0] || "An error occurred");
      }
    },
  });

  let BusinessId = defaultBusinessId;

  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>()
  function formatCreatedAt(createdAt: string) {
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${(hours % 12).toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  }

  const handleQuery = (id: string) => {
    router.push(`/marketplace?catalogueId=${id}`);
  };

  async function fetchMarketPlace() {
    try {
      setLoadingMarketPlace(true);
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `businessListing/list?pageNumber=1&count=4&sortBy=name&sortOrder=1`
      );

      const newData = await response.data.data;

      setMarketPlace(newData);
      setLoadingMarketPlace(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
    }
  }

  const fetchBuyLeads = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `rfq/buy_leads/list?pageNumber=1&count=3&businessId=${BusinessId}&sortBy=Newest`
      );

      const newData = await response.data.data;
      setBuyLeads(newData);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");

      setLoading(false);
    }
  };

  const fetchCatalogue = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/productCatalog/catalogs_list?seeAll=true`
      );

      const newData = response.data.data;

      setCatalogueData(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const fetchBasic = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`user`);

      const businessId = response.data.data.defaultBusinessId;

      const userData = response.data.data;

      localStorage.setItem("businessId", businessId);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      // console.log(userData.isNewUser);
    } catch (error: any) {
      console.error(error);
    }
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobile = useMediaQuery("(max-width: 575px)");
  const isBigMobile = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );
  const isBigSmallMobile = useMediaQuery(
    "(min-width: 576px) and (max-width: 600px)"
  );
  const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const isSmallTabletss = useMediaQuery(
    "(min-width: 991px) and (max-width: 1024px)"
  );
  const isBiggerDevice = useMediaQuery(
    "(min-width: 1366px) and (max-width: 5000px)"
  );
  const isSmallBiggerDevice = useMediaQuery(
    "(min-width: 1300px) and (max-width: 1365px)"
  );
  const isSmallBiggersDevice = useMediaQuery(
    "(min-width: 1366px) and (max-width: 1462px)"
  );

  const fetchFlash = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const flashImageResponse = await axiosInstance.get(
        "/flash-api/get-flash-image"
      );
      const flashImage = flashImageResponse.data.data;
      setFlashImageUrl(flashImage.imageUrl);
      setFlashImageDescription(flashImage.description);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const axiosInstance = createAxiosInstance(); // Create axios instance
      const response = await axiosInstance.get(
        "/feedback/get-latest-feedbacks"
      );
      const data = response.data.data;
      const extractedReviews = data.map((item: { review: any }) => item.review); // Extracting reviews from each object
      setReviews(extractedReviews);
    } catch (error) {
      console.error(error);
    }
  };

  function truncateWords(str: any, numWords: any) {
    const words = str.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    } else {
      return str;
    }
  }

  useEffect(() => {
    fetchBasic();
    fetchCatalogue();
    fetchBuyLeads();
    fetchMarketPlace();
    fetchFlash();
    fetchReviews();
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <ToastContainer  />
      <PageContainer title="Dashboard" description="this is Dashboard">
        <Box >
          <Grid
            container
            spacing={2}
            sx={{
              paddingLeft: "0px",
              paddingTop: "20px",
              marginLeft: "0px",
              width: "100%",
            }}
          >
            <CssBaseline />

            {/* {matches == true ? (
            ""
          ) : (
            
          )} */}

            <Card
              sx={{
                padding: "30px",
                boxShadow: "none",
                borderRadius: "13px",
                ...(isMobile && {
                  display: "flex !important",
                }),
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width:"1050px",
                    alignItems: "center",
                    ...(isMobile && {
                      flexDirection: "column",
                    }),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "76.3%",
                      justifyContent: "space-between",
                      overflowX: "scroll",
                      scrollbarColor: "#2B376E #FFFFFF",
                      ...(isMobile && {
                        flexDirection: "column",
                        width: "100%",
                      }),
                    }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        background: "#7B8FD9",
                        width: "49%",
                        padding: "10px 8px 4px",
                        borderRadius: "10px",
                        marginRight: "20px",
                        overflow: "visible",
                        ...(isMobile && {
                          width: "100%",
                          marginBottom: "15px",
                        }),
                        ...(isSmallMobile && {
                          flexDirection: "column-reverse",
                        }),
                        ...(isTablets && {
                          flexDirection: "column-reverse",
                        }),
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 20,
                            fontWeight: 600,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            marginBottom: "10px",
                          }}
                        >
                          Marketplace
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            ...(isMobile && {
                              fontSize: "14px",
                            }),
                          }}
                        >
                          Explore a diverse marketplace that caters to your
                          every need, offering quality products and unmatched
                          experiences
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "30px",
                            marginTop: "10px",
                            backgroundColor: "#2B376E",
                            textTransform: "none",
                          }}
                          onClick={() => router.push("/marketplace")}
                        >
                          View More
                        </Button>
                      </CardContent>
                      <CardMedia>
                        <Image
                          alt="Object"
                          src={marketPlaceImage}
                          width={186}
                          height={201}
                          style={{
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            borderRadius: "7px",
                            padding: "3px",
                            ...(isSmallMobile && {
                              width: "100%",
                              height: "201px",
                            }),
                            ...(isTablets && {
                              width: "100%",
                              height: "201px",
                            }),
                            ...(isBiggerDevice && {
                              width: "170px",
                              height: "170px",
                            }),
                          }}
                        />
                      </CardMedia>
                    </Card>
                    <Card
                      sx={{
                        display: "flex",
                        background: "#7B8FD9",
                        width: "49%",
                        padding: "10px 8px 4px",
                        borderRadius: "10px",
                        marginRight: "20px",
                        overflow: "visible",
                        ...(isMobile && {
                          width: "100%",
                          marginBottom: "15px",
                        }),
                        ...(isSmallMobile && {
                          flexDirection: "column-reverse",
                        }),
                        ...(isTablets && {
                          flexDirection: "column-reverse",
                        }),
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 20,
                            fontWeight: 600,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            marginBottom: "10px",
                          }}
                        >
                          Business Lists
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            ...(isMobile && {
                              fontSize: "14px",
                            }),
                          }}
                        >
                          Quality, convenience, and customer care Explore our
                          [products/services] and discover a new standard of
                          excellence. &quot;
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "30px",
                            marginTop: "10px",
                            backgroundColor: "#2B376E",
                            textTransform: "none",
                          }}
                          onClick={() => router.push("/business-listing")}
                        >
                          View More
                        </Button>
                      </CardContent>
                      <CardMedia>
                        <Image
                          alt="Object"
                          src={businessListImage}
                          width={186}
                          height={201}
                          style={{
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            borderRadius: "7px",
                            padding: "3px",
                            ...(isSmallMobile && {
                              width: "100%",
                              height: "201px",
                            }),
                            ...(isTablets && {
                              width: "100%",
                              height: "201px",
                            }),
                            ...(isBiggerDevice && {
                              width: "170px",
                              height: "170px",
                            }),
                          }}
                        />
                      </CardMedia>
                    </Card>
                    <Card
                      sx={{
                        display: "flex",
                        background: "#7B8FD9",

                        padding: "10px 8px 4px",
                        borderRadius: "10px",
                        marginRight: "20px",
                        overflow: "visible",
                        ...(isMobile && {
                          width: "100%",
                          marginBottom: "15px",
                        }),
                        ...(isSmallMobile && {
                          flexDirection: "column-reverse",
                        }),
                        ...(isTablets && {
                          flexDirection: "column-reverse",
                        }),
                      }}
                    >
                      <CardContent>
                        <Typography>
                          {flashImageUrl && (
                            <div style={{ width: "100%" }}>
                              <Image
                                alt="Flash Image"
                                src={flashImageUrl}
                                width={400} //necessary
                                height={160} //necessary
                                style={{
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                  borderRadius: "7px",
                                  padding: "3px",
                                }}
                              />
                            </div>
                          )}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            ...(isMobile && {
                              fontSize: "14px",
                            }),
                          }}
                        >
                          {truncateWords(flashImageDescription, 17)}
                        </Typography>
                        <Stack spacing={1} direction={"row"}>
                          <Box>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleOpenDialog}
                              sx={{
                                marginLeft: "280px",
                                background: "#2B305C !important",
                                color: "#fff",
                              }}
                            >
                              ReadMore
                            </Button>

                            <Dialog
                              open={openDialog}
                              onClose={handleCloseDialog}
                              maxWidth="sm"
                              fullWidth
                              sx={{
                                borderRadius: "25px !important",
                              }}
                            >
                              <DialogTitle
                                sx={{
                                  backgroundColor: "#2B305C",
                                  textAlign: "center",
                                  color: "#fff",
                                  display: "relative",
                                }}
                              >
                                <Button
                                  onClick={handleCloseDialog}
                                  color="primary"
                                  sx={{
                                    position: "absolute",
                                    right: "1px",
                                    top: "1px",
                                  }}
                                >
                                  <CancelOutlinedIcon sx={{ color: "#fff" }} />
                                </Button>
                              </DialogTitle>
                              <DialogContent
                                sx={{
                                  paddingX: "15px",
                                  paddingTop: "10px !important",
                                  paddingBottom: "15px",
                                }}
                              >
                                <Grid
                                  container
                                  spacing={2}
                                  sx={{
                                    marginLeft: "0px",
                                    marginTop: "0px",
                                    paddingLeft: "0px",
                                    paddingTop: "0px",
                                    width: "100% !important",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      padding: "10px",
                                      gap: "10px",
                                      width: "100%",
                                    }}
                                  >
                                    {flashImageUrl && (
                                      <div style={{ width: "100%" }}>
                                        <Image
                                          alt="Flash Image"
                                          src={flashImageUrl}
                                          width={550} //necessary
                                          height={260} //necessary
                                          style={{
                                            objectFit: "cover",
                                            border: "1px solid #ddd",
                                            borderRadius: "7px",
                                            padding: "3px",
                                          }}
                                        />
                                      </div>
                                    )}
                                    {flashImageDescription}
                                  </Box>
                                </Grid>
                              </DialogContent>
                            </Dialog>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{
                        display: "flex",
                        width: "100%",
                        background: "#7B8FD9",
                        padding: "10px 8px 4px",
                        borderRadius: "10px",
                        marginleft: "10px",
                        overflow: "visible",
                      }}
                    >
                      <CardContent style={{ width: "100%" }}>
                        <Typography
                          sx={{
                            width: "100%",
                            fontFamily: "Poppins",
                            fontSize: 20,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textAlign: "center",
                            color: "#FFFFFF",
                            marginBottom: "10px",
                          }}
                        >
                          Feedbacks
                        </Typography>
                        <ul>
                          {reviews.map((review, index) => (
                            <Typography
                              key={index}
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                                textAlign: "left",
                                color: "#FFFFFF",
                                marginBottom: "10px",
                              }}
                            >
                              <li>{review !== undefined && review !== null ? truncateWords(review, 14) : ""}</li>
                            </Typography>
                          ))}
                        </ul>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "30px",
                            marginLeft: "270px",
                            
                            backgroundColor: "#2B376E",
                            textTransform: "none",
                          }}
                          onClick={() => router.push("/reviews")}
                        >
                          ViewMore
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                  <Box
                    sx={{
                      width: "22%",
                      ...(isMobile && {
                        width: "100%",
                      }),
                    }}
                  >
                    <Card
                      sx={{
                        background: "#7B8FD9",
                        padding: "11px 15px",
                        borderRadius: "10px",
                        ...(isSmallTabletss && {
                          minHeight: "398px",
                        }),
                        ...(isSmallTabletss && {
                          minHeight: "398px",
                        }),
                        ...(isBiggerDevice && {
                          padding: "5px 15px",
                          // minHeight:" 252px"
                        }),
                        ...(isSmallBiggerDevice && {
                          minHeight: "275px",
                        }),
                        ...(isSmallBiggersDevice && {
                          minHeight: "252px",
                        }),
                      }}
                    >
                      <Box sx={{ paddingX: "8px" }}>
                        <Typography
                          sx={{
                            marginY: "5px",
                            fontFamily: "Poppins",
                            fontSize: 20,
                            fontWeight: 600,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#FFFFFF",
                          }}
                        >
                          Recent Buy Leads
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,

                            letterSpacing: "0px",
                            textAlign: "left",
                            color: "#FFFFFF",
                            marginBottom: "5px",
                          }}
                        >
                          Looking for Traders
                        </Typography>
                        <Divider sx={{ bgcolor: "white" }} />
                      </Box>
                      <Box>
                        <Carousel>
                          {loading ? (
                            <Box
                              sx={{
                                position: "absolute",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mx: "auto",
                              }}
                            >
                              <CircularProgress />
                            </Box>
                          ) : (
                            buyleads?.map((it: buyLeadsType) => (
                              <Box
                                key={it._id}
                                sx={{
                                  paddingX: "10px",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  fontSize="12px"
                                  color="white"
                                  fontFamily="Poppins"
                                  sx={{
                                    marginBottom: "5px",
                                    marginTop: "10px",
                                    fontWeight: "500",

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                  }}
                                >
                                  {it.location &&
                                  typeof it.location === "string"
                                    ? it.location
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
                                <Typography
                                  variant="caption"
                                  color="white"
                                  fontFamily="Poppins"
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontSize: 13,
                                      fontWeight: 600,

                                      letterSpacing: "0em",
                                      textAlign: "left",
                                      color: "#FFFFFF",
                                    }}
                                  >
                                    Required Quantity : ₹ {it.requiredQuantity}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontSize: 13,
                                      fontWeight: 600,

                                      letterSpacing: "0em",
                                      textAlign: "left",
                                      color: "#FFFFFF",
                                    }}
                                  >
                                    Exprected Price: {it.expectedPrice}
                                  </Typography>
                                </Typography>
                                <Typography
                                  sx={{
                                    marginTop: "10px",
                                    fontFamily: "Poppins",
                                    fontSize: 12,
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#FFFFFF",
                                  }}
                                >
                                  {formatCreatedAt(it.createdAt)}
                                </Typography>
                              </Box>
                            ))
                          )}
                        </Carousel>
                      </Box>
                    </Card>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Hero section ENDS */}

            {/* CATELOGUES section STARTING */}

            <Card
              sx={{
                padding: "30px",
                boxShadow: "none",
                borderRadius: "13px",
                marginTop: "20px",
                background: "#cfd8f95c",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "18px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textAlign: "left",
                      color: "#2B305C",
                    }}
                  >
                    Catalogues
                  </Typography>
                  <Link href="/catalogue" style={{ textDecoration: "auto" }}>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,

                        letterSpacing: "0em",
                        textAlign: "center",
                        color: "#2B376E",
                      }}
                    >
                      View All
                    </Typography>
                  </Link>
                </Box>

                <Grid
                  container
                  spacing={{ xs: 2, md: 2 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {catalogueData
                    ?.map((_: catalogType, index: number) => (
                      <Grid
                        item
                        xs={10}
                        sm={4}
                        md={2}
                        key={index}
                        sx={{
                          cursor: "pointer",
                          paddingLeft: "14px !important",
                          paddingTop: "5px !important",
                          ...(isSmallMobile && {
                            width: "50%",
                            maxWidth: "50%",
                          }),
                          ...(isBigMobile && {
                            width: "50%",
                            maxWidth: "50%",
                          }),
                        }}
                      >
                        {
                          <Paper
                            elevation={1}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "7px",
                            }}
                          >
                            <Box
                              key={_._id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                paddingX: "10px",
                                paddingY: "10px",
                                color: "#FFFFFF",
                                marginY: "5px",
                              }}
                              onClick={() => handleQuery(_._id)}
                            >
                              <Image
                                alt="image"
                                src={_.icon}
                                width={50}
                                height={50}
                                style={{
                                  objectFit: "contain",
                                  borderRadius: "40px",
                                  background: "#f6f6f6",
                                  padding: "3px",
                                  border: "1px solid #f6f6f6",
                                }}
                              />
                              <Typography
                                noWrap
                                sx={{
                                  display: "inline-block",
                                  width: "59%",
                                  fontFamily: "Poppins",
                                  fontSize: "15px",
                                  fontWeight: 500,
                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#333542",
                                }}
                              >
                                {_.name}
                              </Typography>
                            </Box>
                          </Paper>
                        }
                      </Grid>
                    ))
                    .slice(0, 12)}
                </Grid>
              </Box>
            </Card>

            {/* CATELOGUES section END */}
            {/* RECENTLY LISTED section START  */}
            <Card
              sx={{
                padding: "30px",
                boxShadow: "none",
                borderRadius: "13px",
                marginTop: "20px",
                background: "#fff",
                width: "100%",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginY: "15px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 20,
                      fontWeight: 600,

                      letterSpacing: "0.5px",
                      textAlign: "left",
                      color: "#2B305C",
                    }}
                  >
                    Recently Listed
                  </Typography>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,

                      letterSpacing: "0em",
                      textAlign: "center",
                      color: "#2B376E",
                    }}
                  >
                    View All
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={{ xs: 2, md: 2 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {loadingMarketPlace && (
                    // <Box
                    //   sx={{
                    //     position: "absolute",
                    //     display: "flex",
                    //     justifyContent: "center",
                    //     alignItems: "center",
                    //     // width:"90%",
                    //     // height:"20vh",
                    //     mx: "auto",
                    //   }}
                    // >
                    <Box sx={{ display: "flex", mx: "auto", marginY: "10px" }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {marketPlace.map((_: any, index: any) => (
                    <Grid
                      item
                      xs={10}
                      sm={4}
                      md={3}
                      key={index}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      {
                        <Card
                          sx={{
                            maxWidth: "345px",
                            background: "#f0f5f9",
                            borderRadius: "13px",
                            ...(isSmallMobile && {
                              width: "100%",
                              maxWidth: "100%",
                            }),
                            ...(isBigSmallMobile && {
                              width: "100%",
                              maxWidth: "100%",
                            }),
                          }}
                        >
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="140px"
                              width="140px"
                              image={_.thumbnail}
                              alt={_.name}
                            />
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {_.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#BFC8D6",
                                  gap: "15px",
                                }}
                              >
                                {" "}
                                <VerticalShadesClosedOutlinedIcon />
                                <Typography
                                  sx={{
                                    textAlign: "left",
                                    fontFamily: "Poppins",
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: "#000",
                                    letterSpacing: "0em",
                                  }}
                                >
                                  {_.businessName}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#BFC8D6",
                                  gap: "10px",
                                }}
                              >
                                <PlaceOutlinedIcon
                                  sx={{
                                    width: "20px",
                                    height: "20px",
                                    color: "#BFC8D6",

                                    padding: "2.5px, 3.33px, 2.1px, 3.33px",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#333542",

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                  }}
                                >
                                  {_.address
                                    .split(",")
                                    .map(
                                      (
                                        part: string,
                                        index: number,
                                        parts: string[]
                                      ) => {
                                        const trimmedPart = part.trim();

                                        if (index === parts.length - 3) {
                                          // Display the second-last part
                                          return (
                                            <span key={index}>
                                              {trimmedPart}
                                              {index < parts.length - 1
                                                ? ", "
                                                : ""}
                                            </span>
                                          );
                                        } else if (index === parts.length - 2) {
                                          // Display the third-last part
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
                                    )}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: "20px",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "3.5px, 7px, 3.5px, 7px",
                                    borderRadius: 25,
                                    backgroundColor: "#F7F7F7",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      paddingX: "6px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <StarBorderPurple500OutlinedIcon
                                      sx={{
                                        padding:
                                          "1.5px, 1.52px, 2.25px, 1.51px",
                                        color: "#FFBB3F",
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 12,
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      {_.rating} Ratings
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    // width: 120,
                                    // height: 26,
                                    // top: 314,
                                    // left: 479,
                                    padding: "3.5px, 7px, 3.5px, 7px",
                                    borderRadius: 25,
                                    backgroundColor: "#F7F7F7",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      paddingX: "6px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <QuestionAnswerOutlinedIcon
                                      sx={{
                                        // width: 15,
                                        // height: 20,
                                        // top: 317,
                                        // left: 485.71,
                                        padding:
                                          "3.33px, 1.67px, 3.33px, 1.67px",
                                        Color: "#2B376E",
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 12,
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      {_.enquires} Enquires
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                          {/* <CardActions>
                  <Button size="small" color="primary" onClick={handleClickOpen2}>
                   Generate RFQs
                  </Button>
                </CardActions> */}
                        </Card>
                      }
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
            {/* RECENTLY LISTED section END  */}

            {/* <Button variant="outlined" onClick={handleClickOpen}>
              dialog
            </Button> */}

            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              maxWidth="xs"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle sx={{ padding: "0px" }}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  sx={{ position: "absolute", right: "1px", top: "9px" }}
                >
                  <CancelOutlinedIcon sx={{ color: "#fff" }} />
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#2B305C",
                    padding: "10px",
                  }}
                >
                  <IconGift
                    style={{ color: "#fff", height: "25px", width: "25px" }}
                  />
                  <Typography
                    sx={{ color: "#fff", fontSize: "18px", fontWeight: "600" }}
                  >
                    Refer & Earn
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ padding: "10px !important" }}>
                <DialogContentText id="alert-dialog-slide-description">
                  Here you got a chance to earn coins. Use the Referral code to
                  earn coins and enjoy the AgriReach App.
                  <Typography>
                    Enter The Referral Code and earn the coins
                  </Typography>
                  <form onSubmit={formik.handleSubmit}>
                    <FormControl fullWidth sx={{ my: "15px" }}>
                      <TextField
                        id="referral-code"
                        name="referralCode"
                        label="Referral Code"
                        type="text"
                        variant="outlined"
                        value={formik.values.referralCode}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.referralCode &&
                          Boolean(formik.errors.referralCode)
                        }
                        helperText={
                          formik.touched.referralCode &&
                          formik.errors.referralCode
                        }
                      />
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          color: "#fff",
                          background: "#2B305C",
                          px: "20px",
                          "&:hover": { background: "#2B305C !important" },
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{
                          color: "#fff",
                          background: "#2B305C",
                          px: "20px",
                          "&:hover": { background: "#2B305C !important" },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </Grid>
        </Box>
      </PageContainer>
    </>
  );
};

export default Dashboard;
