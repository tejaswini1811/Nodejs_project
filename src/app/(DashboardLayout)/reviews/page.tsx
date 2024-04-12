"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Typography,
  Rating,
  TextField,
  Stack,
  Pagination,
  Breadcrumbs,
  useMediaQuery,
} from "@mui/material";
import { usePathname } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import createAxiosInstance from "@/app/axiosInstance";
import { uploadFile } from "../utilities/UploadFile";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Image from "next/image";
import notfound from "@/img/notfound.png";
import { useAppselector } from "@/redux/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function Reviews() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openReviewDialog, setOpenReviewDialog] = useState<boolean>(false);
  const [openUserReviewDialog, setOpenUserReviewDialog] =
    useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [reviews, setReviews] = useState<any>([]);
  const [userFeedbacks, setUserFeedbacks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = React.useState<number | null>(2);
  const [selectedUserFeedback, setSelectedUserFeedback] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_FILENAME_LENGTH = 10;

  const { _id } = useAppselector((state) => state?.user.value);
  const pathname: string = usePathname();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleReviewOpenDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleReviewOpenDialogUserFeedback = (userFeedback: any) => {
    setSelectedUserFeedback(userFeedback);
    setOpenUserReviewDialog(true);
  };
  useEffect(() => {
    if (selectedUserFeedback) {
      console.log(selectedUserFeedback);
    }
  }, [selectedUserFeedback]);
  console.log(selectedUserFeedback);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenReviewDialog(false);
    formik.resetForm();
    setSelectedFileName("");
  };

  const handleFeedbacksCloseDialog = () => {
    setOpenReviewDialog(false);
  };

  const handleFeedbacksCloseDialogUserReview = () => {
    setOpenUserReviewDialog(false);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchReviews();
  }, [_id]);

  useEffect(() => {
    fetchUserFeedbacks();
  }, [currentPage]);

  const validationSchema = Yup.object({
    ratings: Yup.string().required("Rating is required"),
    review: Yup.string().required("Review is required"),
  });

  const fetchReviews = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(`feedback/user-feedback/${_id}`);

      const newData = response.data.data[0];

      setReviews(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/feedback/get-approved-feedbacks?pageNumber=${currentPage}&count=12`
      );

      setUserFeedbacks(response.data.data[0].records);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };
  // console.log(userFeedbacks);
  let submitCounter = 2;
  const formik = useFormik({
    initialValues: {
      ratings: "",
      review: "",
      file: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {

      try {
        // Check if user has already submitted feedback
        const hasSubmittedFeedback = submitCounter > 1;
        if (hasSubmittedFeedback) {
          toast.error("Feedback is already submitted.");
          handleCloseDialog();
          resetForm(); // Clear form fields
          return;
        }

      try {
        let imageUrl: any;
        const axiosInstance = createAxiosInstance();

        if (values.file) {
          imageUrl = await uploadFile(values.file);
          if (imageUrl) {
            await axiosInstance
              .post("/feedback/capture-feedback", {
                ratings: values.ratings,
                review: values.review,
                attachment: imageUrl || "",
              })
              .then(({ data: { data } }) => {
                toast.success("Review submitted successfully!");
                // fetchQueries();
                resetForm();
                setSelectedFileName("");
                handleCloseDialog();
              })
              .catch((err: any) => {
                const msg =
                  typeof err?.response?.data === "string"
                    ? err?.response?.data
                    : err?.response?.data;
                if (msg) {
                  toast.error(msg);
                }
              });
          }
        } else {
          await axiosInstance
            .post("/feedback/capture-feedback", {
              ratings: values.ratings,
              review: values.review,
              attachment: imageUrl || "",
            })
            .then(({ data: { data } }) => {
              toast.success("Review submitted successfully!");
              // fetchQueries();
              resetForm();
              setSelectedFileName("");
              handleCloseDialog();
            })
            .catch((err: any) => {
              const msg =
                typeof err?.response?.data === "string"
                  ? err?.response?.data
                  : err?.response?.data;
              if (msg) {
                toast.error(msg);
              }
            });
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred");
      }}catch (outerError:any) {
        toast.error(outerError?.message || "An error occurred");
      }
    },
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to megabytes

      if (fileSizeInMB > 10) {
        toast.error("File size must be less than 10 MB.");
        event.target.value = null;
        return;
      }

      formik.setFieldValue("file", file);
      setSelectedFileName(file.name);
    } else {
      formik.setFieldValue("file", null);
      setSelectedFileName("");
    }
  };
  let dateNow = dayjs();

  function truncateReview(review: any, wordLimit: any) {
    if (review?.length > wordLimit) {
      return review.substring(0, wordLimit) + "...";
    } else {
      return review;
    }
  }

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery(
    "(min-width: 320px) and (max-width: 575px)"
  );
  const isBigMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );
  const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const isLaptops = useMediaQuery(
    "(min-width: 1025px) and (max-width: 1400px)"
  );

  const attachmentExtension = reviews?.attachment
    ?.split(".")
    .pop()
    .toLowerCase();

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2}>
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
          <Stack spacing={1} direction={"row"}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{
                  background: "#2B305C !important",
                  color: "#fff",
                }}
              >
                Add Review
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                sx={{ borderRadius: "25px !important" }}
              >
                <DialogTitle
                  sx={{
                    backgroundColor: "#2B305C",
                    textAlign: "center",
                    color: "#fff",
                    display: "relative",
                  }}
                >
                  Add Review
                  <Button
                    onClick={handleCloseDialog}
                    color="primary"
                    sx={{ position: "absolute", right: "1px", top: "9px" }}
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
                      <form
                        onSubmit={formik.handleSubmit}
                        style={{ width: "100%" }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <FormControl>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#333542",
                                mb: "5px",
                              }}
                            >
                              Star Rating
                            </Typography>
                            <Rating
                              name="ratings"
                              id="ratings"
                              value={parseInt(formik.values.ratings, 6)}
                              onChange={formik.handleChange}
                              defaultValue={0}
                            />
                            {formik.touched.ratings &&
                              formik.errors.ratings && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ my: 1 }}
                                >
                                  {formik.errors.ratings}
                                </Typography>
                              )}
                          </FormControl>
                          <FormControl>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#333542",
                                mb: "5px",
                                mt: "5px",
                              }}
                            >
                              Your Review
                            </Typography>
                            <TextField
                              multiline
                              rows={4}
                              placeholder="Enter your review"
                              variant="outlined"
                              id="review"
                              name="review"
                              value={formik.values.review}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.review && formik.errors.review && (
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                {formik.errors.review}
                              </Typography>
                            )}
                          </FormControl>
                          <FormControl>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#333542",
                                mb: "5px",
                                mt: "5px",
                              }}
                            >
                              Upload Image or Video
                            </Typography>
                            <Box sx={{ display: "flex" }}>
                              <label
                                htmlFor="file-upload"
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px 16px",
                                  backgroundColor: "#f4f4f4",
                                }}
                              >
                                <span>Attachment</span>
                              </label>
                              <input
                                className="file_new"
                                accept="image/*, video/*, "
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                  display: "none",
                                  padding: "9.5px 10px",
                                }}
                              />
                              <TextField
                                value={
                                  selectedFileName
                                    ? ` ${selectedFileName}`
                                    : "No files selected."
                                }
                                InputProps={{
                                  readOnly: true,
                                  sx: {
                                    width: "273px",
                                    borderRadius: "0px",
                                    height: "40px",
                                  },
                                }}
                              />
                            </Box>
                            {formik.errors.file && (
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                {formik.errors.file}
                              </Typography>
                            )}
                          </FormControl>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: "10px",
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              sx={{
                                backgroundColor: "#2B305C",
                                padding: "6px 35px",
                              }}
                            >
                              Submit
                            </Button>
                          </Box>
                        </Box>
                      </form>
                    </Box>
                  </Grid>
                </DialogContent>
              </Dialog>
            </Box>
          </Stack>
        </Box>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <>
            <Grid
              container
              spacing={2}
              sx={{
                marginLeft:"0px",
                marginTop:"0px",
                overflow:"",
                gap: "15px",
                ...(isSmallMobiles && { width: "150%", gap: "15px" }), // Adjust for small mobiles
                ...(isBigMobiles && { width: "65.5%", gap:"15px" }), // Adjust for big mobiles
                ...(isTablets && { width: "145%" ,gap:"20px"}), // Adjust for tablets
                ...(isLaptops && { width: "100%" }), // Adjust for laptop
              }}
            >
              {(reviews && reviews.length > 0) ||
              (userFeedbacks && userFeedbacks.length > 0) ? (
                <>
                  {reviews && (
                    <Card sx={{ width: "32%" }}>
                      <Box sx={{ height: "200px" }}>
                        {["png", "jpg", "jpeg"].includes(
                          attachmentExtension
                        ) ? (
                          <Image
                            alt="Image Attachment"
                            src={reviews.attachment}
                            width={400}
                            height={200}
                            style={{
                              width: "100% !important",
                              height: "200px",
                              borderRadius: "15px 15px 0px 0px",
                              objectFit: "cover",
                              background: "#f0f5f9",
                            }}
                          />
                        ) : attachmentExtension === "mp4" ? (
                          <iframe
                            title="Video Attachment"
                            width="100%"
                            height="200px"
                            src={reviews.attachment}
                            frameBorder="0"
                            allowFullScreen
                          />
                        ) : (
                          <Image
                            alt={
                              reviews.attachment
                                ? "Not available"
                                : "Unsupported file format"
                            }
                            src={""}
                            width={400}
                            height={200}
                            style={{
                              width: "100% !important",
                              height: "200px",
                              borderRadius: "15px 15px 0px 0px",
                              objectFit: "cover",
                              background: "#f0f5f9",
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ padding: "5px 15px 15px !important" }}>
                        <Box>
                          <Typography>
                            <Rating
                              name="read-only"
                              readOnly
                              value={parseInt(reviews.ratings)}
                              onChange={(event, newValue) => {
                                setValue(newValue);
                              }}
                            />
                          </Typography>
                          <Typography
                            sx={{
                              color: "#000",
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "500",
                              marginBottom: "5px",
                            }}
                          >
                            <CalendarMonthIcon
                              sx={{
                                color: "#5c934c",
                                fontSize: "21px",
                                marginRight: "5px",
                              }}
                            />
                            {dateNow.from(reviews?.createdAt, true)} ago
                          </Typography>
                          <Typography sx={{ textAlign: "justify" }}>
                            Status:{reviews?.status}
                          </Typography>
                          <Typography sx={{ textAlign: "justify" }}>
                            {truncateReview(reviews?.review, 73)}
                          </Typography>
                          <Box sx={{ textAlign: "Right", paddingTop: "10px" }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleReviewOpenDialog}
                              sx={{
                                background: "#2B305C !important",
                                color: "#fff",
                              }}
                            >
                              View 
                            </Button>
                            <Dialog
                              open={openReviewDialog}
                              onClose={handleFeedbacksCloseDialog}
                              maxWidth="md"
                              fullWidth
                              sx={{ borderRadius: "25px !important" }}
                            >
                              <DialogContent
                                sx={{
                                  padding: "1px",
                                  lineHeight: "0.334rem",
                                  position: "relative",
                                }}
                              >
                                <Button
                                  onClick={handleFeedbacksCloseDialog}
                                  color="primary"
                                  sx={{
                                    position: "absolute",
                                    right: "1px",
                                    top: "9px",
                                  }}
                                >
                                  <CancelOutlinedIcon sx={{ color: "#000" }} />
                                </Button>
                                {reviews && (
                                  <Box sx={{ display: "flex" }}>
                                    <Box sx={{ width: "40%" }}>
                                      {["png", "jpg", "jpeg"].includes(
                                        attachmentExtension
                                      ) ? (
                                        <Image
                                          alt="Image Attachment"
                                          src={reviews.attachment}
                                          width={300}
                                          height={304}
                                          style={{
                                            width: "100% !important",
                                            height: "90% !important",
                                            borderRadius: "15px",
                                            objectFit: "cover",
                                            background: "#f0f5f9",
                                          }}
                                        />
                                      ) : attachmentExtension === "mp4" ? (
                                        <iframe
                                          title="Video Attachment"
                                          width="100%"
                                          height="100%"
                                          src={reviews.attachment}
                                          frameBorder="0"
                                          allowFullScreen
                                          style={{ height: "100% !important" }}
                                        />
                                      ) : (
                                        <Image
                                          alt={
                                            reviews.attachment
                                              ? "Not available"
                                              : "Unsupported file format"
                                          }
                                          src={""}
                                          width={300}
                                          height={304}
                                          style={{
                                            width: "100% !important",
                                            height: "90% !important",
                                            borderRadius: "15px",
                                            objectFit: "cover",
                                            background: "#f0f5f9",
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Box
                                      sx={{
                                        padding: "15px 15px 15px !important",
                                        width: "59%",
                                      }}
                                    >
                                      <Box>
                                        <Typography>
                                          <Rating
                                            readOnly
                                            name="read-only"
                                            value={parseInt(reviews.ratings)}
                                            onChange={(event, newValue) => {
                                              setValue(newValue);
                                            }}
                                          />
                                        </Typography>
                                        <Typography
                                          sx={{
                                            color: "#000",
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: "500",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          <CalendarMonthIcon
                                            sx={{
                                              color: "#5c934c",
                                              fontSize: "21px",
                                              marginRight: "5px",
                                            }}
                                          />
                                          {dateNow.from(
                                            reviews?.createdAt,
                                            true
                                          )}{" "}
                                          ago
                                        </Typography>
                                        <Typography
                                          sx={{ textAlign: "justify" }}
                                        >
                                          Status:{reviews?.status}
                                        </Typography>
                                        <Typography
                                          sx={{ textAlign: "justify" }}
                                        >
                                          {reviews?.review}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </DialogContent>
                            </Dialog>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {userFeedbacks &&
                    userFeedbacks.map((item: any) => (
                      <>
                        <Card sx={{ width: "32%" }}>
                          <Box sx={{ height: "200px" }}>
                            {["png", "jpg", "jpeg"].includes(
                              item?.attachment?.split(".").pop().toLowerCase()
                            ) ? (
                              <Image
                                alt="Image Attachment"
                                src={item?.attachment}
                                width={400}
                                height={200}
                                style={{
                                  width: "100% !important",
                                  height: "200px",
                                  borderRadius: "15px 15px 0px 0px",
                                  objectFit: "cover",
                                  background: "#f0f5f9",
                                }}
                              />
                            ) : item?.attachment
                                ?.split(".")
                                .pop()
                                .toLowerCase() === "mp4" ? (
                              <iframe
                                title="Video Attachment"
                                width="100%"
                                height="200px"
                                src={item.attachment}
                                frameBorder="0"
                                allowFullScreen
                              />
                            ) : (
                              <Image
                                alt={
                                  item.attachment
                                    ? "Not available"
                                    : "Unsupported file format"
                                }
                                src={""}
                                width={400}
                                height={200}
                                style={{
                                  width: "100% !important",
                                  height: "200px",
                                  borderRadius: "15px 15px 0px 0px",
                                  objectFit: "cover",
                                  background: "#f0f5f9",
                                }}
                              />
                            )}
                          </Box>
                          <CardContent
                            sx={{ padding: "5px 15px 15px !important" }}
                          >
                            <Box>
                              <Typography>
                                <Rating
                                  readOnly
                                  name="read-only"
                                  value={parseInt(item?.ratings)}
                                  onChange={(event, newValue) => {
                                    setValue(newValue);
                                  }}
                                />
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#000",
                                  display: "flex",
                                  alignItems: "center",
                                  fontWeight: "500",
                                  marginBottom: "5px",
                                }}
                              >
                                <CalendarMonthIcon
                                  sx={{
                                    color: "#5c934c",
                                    fontSize: "21px",
                                    marginRight: "5px",
                                  }}
                                />
                                {dateNow.from(item?.createdAt, true)} ago
                              </Typography>
                              <Typography sx={{ textAlign: "justify" }}>
                                {truncateReview(item?.review, 73)}
                              </Typography>
                              <Box
                                sx={{ textAlign: "Right", paddingTop: "10px" }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleReviewOpenDialogUserFeedback(item)
                                  }
                                  sx={{
                                    background: "#2B305C !important",
                                    color: "#fff",
                                  }}
                                >
                                  View 
                                </Button>
                                <Dialog
                                  open={openUserReviewDialog}
                                  onClose={handleFeedbacksCloseDialogUserReview}
                                  maxWidth="md"
                                  fullWidth
                                  sx={{ borderRadius: "25px !important" }}
                                >
                                  <DialogContent
                                    sx={{
                                      padding: "1px",
                                      lineHeight: "0.334rem",
                                      position: "relative",
                                    }}
                                  >
                                    <Button
                                      onClick={
                                        handleFeedbacksCloseDialogUserReview
                                      }
                                      color="primary"
                                      sx={{
                                        position: "absolute",
                                        right: "1px",
                                        top: "9px",
                                      }}
                                    >
                                      <CancelOutlinedIcon
                                        sx={{ color: "#000" }}
                                      />
                                    </Button>
                                    <Box sx={{ display: "flex" }}>
                                      <Box sx={{ width: "40%" }}>
                                        {["png", "jpg", "jpeg"].includes(
                                          selectedUserFeedback?.attachment
                                            ?.split(".")
                                            .pop()
                                            .toLowerCase()
                                        ) ? (
                                          <Image
                                            alt="Image Attachment"
                                            src={
                                              selectedUserFeedback?.attachment
                                            }
                                            width="350"
                                            height={304}
                                            style={{
                                              width: "100% !important",
                                              height: "90% !important",
                                              borderRadius: "0",
                                              objectFit: "cover",
                                              background: "#f0f5f9",
                                            }}
                                          />
                                        ) : selectedUserFeedback?.attachment
                                            ?.split(".")
                                            .pop()
                                            .toLowerCase() === "mp4" ? (
                                          <iframe
                                            title="Video Attachment"
                                            width="100%"
                                            height="100%"
                                            src={
                                              selectedUserFeedback?.attachment
                                            }
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{
                                              height: "100% !important",
                                            }}
                                          />
                                        ) : (
                                          <Image
                                            alt={
                                              selectedUserFeedback?.attachment
                                                ? "Not available"
                                                : "Unsupported file format"
                                            }
                                            src={""}
                                            width={300}
                                            height={304}
                                            style={{
                                              width: "100% !important",
                                              height: "90% !important",
                                              borderRadius: "0px",
                                              objectFit: "cover",
                                              background: "#f0f5f9",
                                            }}
                                          />
                                        )}
                                      </Box>
                                      <Box
                                        sx={{
                                          padding: "15px 15px 15px !important",
                                          width: "59%",
                                        }}
                                      >
                                        <Box>
                                          <Typography>
                                            <Rating
                                              readOnly
                                              name="read-only"
                                              value={parseInt(
                                                selectedUserFeedback?.ratings
                                              )}
                                              onChange={(event, newValue) => {
                                                setValue(newValue);
                                              }}
                                            />
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: "#000",
                                              display: "flex",
                                              alignItems: "center",
                                              fontWeight: "500",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            <CalendarMonthIcon
                                              sx={{
                                                color: "#5c934c",
                                                fontSize: "21px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            {dateNow.from(
                                              selectedUserFeedback?.createdAt,
                                              true
                                            )}{" "}
                                            ago
                                          </Typography>
                                          <Typography
                                            sx={{ textAlign: "justify" }}
                                          >
                                            {selectedUserFeedback?.review}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </DialogContent>
                                </Dialog>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </>
                    ))}
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Image src={notfound} alt="No data found" />
                </Box>
              )}
            </Grid>

            <Box
              sx={{
                textAlign: "center",
                paddingTop: "20px",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Pagination
                count={12}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          </>
        </DashboardCard>
      </PageContainer>
    </>
  );
}

export default Reviews;
