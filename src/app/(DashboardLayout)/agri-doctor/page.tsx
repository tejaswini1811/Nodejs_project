"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import notfound from "@/img/notfound.png";
import Image from "next/image";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { IconUserQuestion } from "@tabler/icons-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "react-toastify/dist/ReactToastify.css";
import { AnyCnameRecord } from "dns";
import Link from "next/link";
import createAxiosInstance from "@/app/axiosInstance";
import dayjs from "dayjs";
import { useAppselector } from "@/redux/store";
import { uploadFile } from "../utilities/UploadFile";

function AgriDoctor() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [agriDoctorData, setAgriDoctorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [commodities, setCommodities] = useState<any[]>([]);

  const MAX_FILENAME_LENGTH = 10;
  const { _id } = useAppselector((state) => state?.user.value);
  const userId: any = _id;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
    setSelectedFileName("");
  };

  const fetchQueries = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `agri-doctor/query/${userId}?pageNumber=${currentPage}&count=12`
      );

      const newData = response.data.data[0]?.records;

      setAgriDoctorData(newData);

      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchQueries();
    }
  }, [userId, currentPage]);

  const fetchCommoditiesData = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`/commodity/commodities`);
      setCommodities(response.data.data);
    } catch (error) {
      console.error("Error fetching commodities data:", error);
    }
  };

  useEffect(() => {
    fetchCommoditiesData();
  }, []);

  const commodityOptions = commodities.map(commodity => ({
    name: commodity.name,
    id: commodity._id
  }));

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleHover = {
    backgroundColor: "#2b305c",
    textDecoration: "none",
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const validationSchema = Yup.object({
    commodityName: Yup.string().required("Commodity is required"),
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
    // file: Yup.mixed().required("File is required"),
  });

  const formik = useFormik({
    initialValues: {
      commodityName: "",
      subject: "",
      description: "",
      file: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let imageUrl: any;
        const axiosInstance = createAxiosInstance();
        const selectedCommodity = commodities.find(commodity => commodity.name === values.commodityName);
      
        if (selectedCommodity) {
          if (values.file) {
            imageUrl = await uploadFile(values.file);
          }

          await axiosInstance
            .post("/agri-doctor/create-ticket", {
              subject: values.subject,
              commodityId: selectedCommodity._id, 
              commodityName: values.commodityName,
              messages: {
                attachment: imageUrl || "",
                content: values.description,
              },
            })
            .then(({ data: { data } }) => {
              toast.success("Query submitted successfully!");
              fetchQueries();
              resetForm();
              setSelectedFileName("");
              handleCloseDialog();
            })
            .catch((err: any) => {
              const msg =
                typeof err?.response?.data?.message === "string"
                  ? err?.response?.data?.message
                  : err?.response?.data?.message[0];
              if (msg) {
                toast.error(msg);
              }
            });
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred");
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

  function truncateSubject(subject: any, wordLimit: any) {
    if (subject.length > wordLimit) {
      return subject.substring(0, wordLimit) + "...";
    } else {
      return subject;
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

  return (
    <>
      <ToastContainer />
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
            marginLeft: "0px !important",
            marginTop: "0px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "0px",
            paddingBottom: "15px",
            width: "100% !important",
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
                sx={{ background: "#2B305C !important", color: "#fff" }}
              >
                Ask Doctor
              </Button>

              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
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
                  Ask Doctor
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
                        <FormControl
                          fullWidth
                          sx={{ width: "100%", mb: "10px" }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select commodity
                          </InputLabel>
                          <Select
                            sx={{
                              borderRadius: 25,
                              width: "100%",
                              color: "#64758B",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,
                            }}
                            name="commodityName"
                            value={formik.values.commodityName}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Select commodity"
                          >
                            {commodities.map((commodity) => (
                              <MenuItem
                                key={commodity._id}
                                value={commodity.name}
                              >
                                {commodity.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.commodityName &&
                            formik.errors.commodityName && (
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ my: 1 }}
                              >
                                {formik.errors.commodityName}
                              </Typography>
                            )}
                        </FormControl>
                        <FormControl sx={{ width: "100%", mb: "10px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              mb: "5px",
                            }}
                          >
                            Subject
                          </Typography>
                          <TextField
                            id="subject"
                            name="subject"
                            placeholder="Subject"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: "100%",
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          />
                          {formik.touched.subject && formik.errors.subject && (
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ my: 1 }}
                            >
                              {formik.errors.subject}
                            </Typography>
                          )}
                        </FormControl>

                        <FormControl
                          sx={{ width: "100%", marginBottom: "10px" }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              mb: "5px",
                            }}
                          >
                            Description
                          </Typography>
                          <TextField
                            multiline
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Enter your description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            InputProps={{
                              sx: {
                                width: "100%",
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                borderRadius: "25px",
                              },
                            }}
                          />
                          {formik.touched.description &&
                            formik.errors.description && (
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                {formik.errors.description}
                              </Typography>
                            )}
                        </FormControl>

                        <Box
                          sx={{
                            display: "flex",
                            gap: "10px",
                            mt: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl>
                            <input
                              accept="image/*, video/*, .pdf, .doc, .docx"
                              id="file-upload"
                              type="file"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                            <label htmlFor="file-upload">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                              >
                                {selectedFileName
                                  ? `Selected File: ${selectedFileName}`
                                  : "Attachment"}
                              </Button>
                            </label>
                            {formik.errors.file && (
                              <Typography variant="body2" color="error">
                                {formik.errors.file}
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl>
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
                          </FormControl>
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
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "13px",
              }}
            >
              {agriDoctorData?.length > 0 ? (
                <>
                  {agriDoctorData?.map((ticket) => (
                    <Card
                      key={ticket._id}
                      sx={{
                        width: "24%",
                        background: "#f0f5f9",
                        marginBottom: "16px",
                        position: "relative",
                        ...(isSmallMobiles && { width: "100%", gap: "15px" }),
                        ...(isBigMobiles && { width: "48.5%" }),
                        ...(isTablets && { width: "48.5%" }),
                        ...(isLaptops && { width: "24%" }),
                      }}
                    >
                      <CardContent sx={{ padding: "11px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <IconUserQuestion
                            style={{
                              width: "34px",
                              height: "34px",
                              color: "#000",
                              padding: "6px",
                              borderRadius: "23px",
                              // background: "#5c934c",
                              position: "absolute",
                              top: "9px",
                              right: "9px",
                            }}
                          />
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
                            {truncateSubject(ticket.subject, 16)}
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
                            {ticket.tickedId}
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
                            <span style={{ color: "orange", fontSize: "12px" }}>
                              Last updated:{" "}
                            </span>
                            {dayjs(ticket.updatedAt).format(
                              "YYYY-MM-DD HH:mm:ss A"
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 12,
                              fontWeight: 500,
                              letterSpacing: "0em",
                              color: "#333542",
                              marginTop: "0px",
                              marginBottom: "1px",
                            }}
                          >
                            <span style={{ color: "orange", fontSize: "12px" }}>
                              Status:{" "}
                            </span>
                            {ticket.status}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box>
                        <Button
                          size="small"
                          onClick={() =>
                            router.push(
                              `/agri-doctor/query-info?id=${ticket?._id}`
                            )
                          }
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
                          View
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mx: "auto",
                    }}
                  >
                    <Image
                      src={notfound}
                      alt="Not Found"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                </>
              )}
            </Box>
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

export default AgriDoctor;
