"use client";
import react, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import team from "@/img/team.png";
import createAxiosInstance from "@/app/axiosInstance";
import CommentIcon from "@mui/icons-material/Comment";
import notfound from "@/img/notfound.png";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import "react-toastify/dist/ReactToastify.css";
import { useAppselector } from "@/redux/store";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { ToastContainer, toast } from "react-toastify";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function HorizontalLinearStepper() {
  const [businessListing, setBusinessListing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessDetails, setBusinessDetails] = useState<any>();
  const createInstance = createAxiosInstance();

  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const businessId: any = defaultBusinessId;

  const [selectedBusinessId, setSelectedBusinessId] = useState<any>(defaultBusinessId);

  const fetchBusinessListings = async (businessSelected: any) => {
    try {
      setIsLoading(true);
      const response = await createInstance.get(`businessListing/my_list`, {
        params: {
          businessId: businessSelected ? businessSelected : businessId,
          count: 10,
          pageNumber: 1,
        },
      });
      setBusinessListing(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching business listings:", error);
    }
  };

  const fetchBUsinessDetails = async () => {
    try {
      setIsLoading(true);
      const response = await createInstance.get(`business/all_business`);
      setBusinessDetails(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching business listings:", error);
    }
  };

  const handleChange = (e: any) => {
    const newBusinessId = e.target.value;
    setSelectedBusinessId(newBusinessId);
    fetchBusinessListings(newBusinessId);
  };

  useEffect(() => {
    fetchBusinessListings(null);
    fetchBUsinessDetails();
    //eslint-disable-next-line
  }, []);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isBigMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );
  const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  const isLaptops = useMediaQuery(
    "(min-width: 1025px) and (max-width: 1400px)"
  );

  const isBiggerLaptops = useMediaQuery(
    "(min-width: 1401px) and (max-width: 5000px)"
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          marginX: "auto",
          paddingRight: "15px",
        }}
      >
        <Grid
          item
          xs={12}
          display={"flex"}
          flexDirection={"row"}
          sx={{
            alignItems: "center",
            padding: "20px",
            ...(isMobile && {
              margin: "0px",
              flexDirection: "column",
              justifyContent: "center",
            }),

            ...(isTablets && {
              margin: "0px",
              flexDirection: "column",
              justifyContent: "center",
            }),
          }}
        >
          <Box
            sx={{
              marginRight: "auto",
              paddingBottom: "15px",
              ...(isMobile && { margin: "0 auto" }),
              ...(isTablets && { margin: "0 auto" }),
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
                Home
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Roboto",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#2B376E",
                  textTransform: "uppercase",
                }}
              >
                Busines Listing
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "end",
              marginBottom: "25px",
            }}
          >
            <Link href="/business-listing/add-business-listing">
              <Button
                variant="contained"
                sx={{
                  width: 227,
                  height: "45px",
                  backgroundColor: "#2B376E",
                  color: "#FFFFFF",
                  textTransform: "none",
                  padding: "0px 16px", // Adjusted padding syntax
                  borderRadius: 25,
                  gap: 16,
                  marginRight: "10px",
                }}
              >
                Add Business Listing
              </Button>
            </Link>
            <FormControl>
              <InputLabel htmlFor="business">Business</InputLabel>
              <Select
                id="business"
                name="business"
                label="Business"
                placeholder="Business"
                sx={{ minWidth: "15rem" }}
                value={selectedBusinessId}
                onChange={handleChange}
              >
                {businessDetails?.map((option: any) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <PageContainer>
          <DashboardCard>
            <Grid
              container
              spacing={{ xs: 2, md: 2 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              mb={5}
            // sx={{
            //   height: "auto",
            //   overflow: "auto",
            //   maxHeight: "75vh",
            //   paddingBottom: "5px",
            // }}
            >
              {isLoading ? (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "20vh",
                    mx: "auto",
                  }}
                />
              ) : businessListing.length > 0 ? (
                businessListing.map((item: any, index: number) => (
                  <Grid
                    item
                    xs={10}
                    sm={4}
                    md={3}
                    mb={2}
                    key={index}
                    sx={{ cursor: "pointer" }}
                    spacing={10}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        marginTop: "20px",
                        minHeight: "348px",
                      }}
                    >
                      <Box
                        key={item._id}
                        sx={{
                          gap: "5px",
                          display: "flex",
                          justifyContent: "center",
                          paddingLeft: "10px",
                          paddingY: "20px",
                        }}
                      >
                        {item?.thumbnail ? (
                          <Image
                            alt="Product"
                            src={item?.thumbnail || ""}
                            height={110}
                            width={200}
                            style={{
                              borderRadius: "12px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Image
                            alt="Product"
                            src={team}
                            height={110}
                            width={200}
                            style={{
                              borderRadius: "12px",
                              objectFit: "contain",
                              opacity: "0.4",
                            }}
                          />
                        )}
                      </Box>
                      {/* <Box display="flex" justifyContent="flex-end"> */}
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.5,
                          paddingX: "8px",
                          color: "white",
                          borderRadius: "20px",
                          marginLeft: "13px",
                          backgroundColor:
                            item.status === "Pending Verification"
                              ? "red"
                              : "green",
                        }}
                      >
                        {item?.status}
                      </Typography>
                      {/* </Box> */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "self-start",
                          justifyContent: "flex-start",
                          rowGap: "4px",
                          wordBreak: "unset",
                          paddingLeft: "15px",
                          paddingBottom: "20px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#2B376E",
                            letterSpacing: "0em",
                            textAlign: "left",
                          }}
                        >
                          {item.name}
                        </Typography>{" "}
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#333542",
                            letterSpacing: "0em",
                          }}
                        >
                          {item.price}
                        </Typography>
                        <Box sx={{ display: "flex" }}>
                          <CommentIcon
                            sx={{
                              width: "20px",
                              height: "20px",
                              color: "#BFC8D6",

                              padding: "2.5px, 3.33px, 2.1px, 3.33px",
                            }}
                          />{" "}
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 11,
                              paddingLeft: "7px",
                              fontWeight: 500,
                              color: "#333542",
                              letterSpacing: "0em",
                              textAlign: "left",
                            }}
                          >
                            {item.enquiries} enquiries
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            // maxHeight: "30px",
                            // height: "30px",
                            display: "flex",
                            alignItems: "center",
                            color: "#BFC8D6",
                            gap: "5px",
                          }}
                        >
                          {" "}
                          <VerticalShadesClosedOutlinedIcon />
                          <Typography
                            sx={{
                              textAlign: "left",
                              fontFamily: "Poppins",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#333542",
                              letterSpacing: "0em",
                            }}
                          >
                            {item.businessName}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            // maxHeight: "30px",
                            // height: "30px",
                            display: "flex",
                            alignItems: "center",
                            color: "#BFC8D6",
                            gap: "5px",
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
                              fontSize: 11,
                              fontWeight: 500,
                              color: "#333542",

                              letterSpacing: "0em",
                              textAlign: "left",
                            }}
                          >
                            {item.address
                              ?.split(",")
                              ?.map(
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
                                        {index < parts.length - 1 ? ", " : ""}
                                      </span>
                                    );
                                  } else if (index === parts.length - 2) {
                                    // Display the third-last part
                                    return (
                                      <span key={index}>
                                        {trimmedPart}
                                        {index < parts.length - 1 ? ", " : ""}
                                      </span>
                                    );
                                  }

                                  return null;
                                }
                              )}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              // width: 120,
                              // height: 26,
                              // top: 314,
                              // left: 355,
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
                              <Box
                                sx={{
                                  backgroundColor: "green",
                                  display: "flex",
                                  borderRadius: "30px",
                                  paddingX: "12px",
                                  opacity: "0.7+",
                                }}
                              >
                                {" "}
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    letterSpacing: "4px",
                                    textAlign: "right",
                                    color: "#ffff",
                                    paddingTop: "3px",
                                  }}
                                >
                                  {item.ratings}
                                </Typography>
                                <StarIcon
                                  sx={{
                                    // width: 18,
                                    // height: 18,
                                    // top: 318,
                                    // left: 361.59,
                                    padding: "1.5px, 1.52px, 2.25px, 1.51px",
                                    color: "#FFBB3F",
                                  }}
                                />
                              </Box>
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
                                {item.ratingCount} Ratings
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
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
      </Grid>
    </>
  );
}
