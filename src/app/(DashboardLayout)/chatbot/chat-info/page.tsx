"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import createAxiosInstance from "@/app/axiosInstance";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Logo from "@/img/Logo.png";
import Image from "next/image";
import { useAppselector } from "@/redux/store";
import { uploadFile } from "../../utilities/UploadFile";

export default function ChatInfo() {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [messages, setMessages] = useState<any>();
  const [messageDetails, setMessageDetails] = useState<any>();
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const chatId: any = searchParams.get("id");
  const axiosInstance = createAxiosInstance();
  const { image } = useAppselector((state) => state?.user.value);

  useEffect(() => {
    fetchMessages();
    fetchMessageDetailsByMessageId();
  }, []);
  const fetchMessages = async () => {
    await axiosInstance
      .get(`/chatbot/message/${chatId}`)
      .then((result: any) => {
        if (result && result?.data?.data?.length > 0) {
          setMessages(result?.data?.data);
        }
      });
  };

  const fetchMessageDetailsByMessageId = async () => {
    await axiosInstance
      .get(`/chatbot/chat-info/${chatId}`)
      .then((result: any) => {
        if (result && result?.data?.data?.length > 0) {
          setMessageDetails(result?.data?.data[0]);
        }
      });
  };

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const validationSchema = Yup.object({
    message: Yup.string().required("Message is required"),
    // file: Yup.mixed().required("File is required"),
  });

  const formik = useFormik({
    initialValues: {
      message: "",
      file: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let imageUrl: any;
      if (values.file) {
        imageUrl = await uploadFile(values.file);
        if (imageUrl) {
          axiosInstance.post(`/chatbot/${chatId}/message`, {
              attachment: imageUrl || "",
              content: values.message,
            })
            .then(({ data: { data } }) => {
              toast.success("Response submitted successfully!");
              resetForm();
              setSelectedFileName("");
              fetchMessages();
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
      } else {
        axiosInstance
          .post(`/chatbot/${chatId}/message`, {
            attachment: "",
            content: values.message,
          })
          .then(({ data: { data } }) => {
            toast.success("Response submitted successfully!");
            resetForm();
            setSelectedFileName("");
            fetchMessages();
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
    },
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);

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

  const handleCancel = () => {
    formik.resetForm();
    setSelectedFileName("");
    setExpanded(false);
  };

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
        </Box>
      </Grid>

      <PageContainer>
        <DashboardCard>
          <>
            <Accordion expanded={expanded} onChange={handleExpansion}>
              <Box sx={{ backgroundColor: "#2B305C" }}>
                <AccordionSummary
                  className="according"
                  expandIcon={<ExpandMoreIcon sx={{ color: "#FFFFFF" }} />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#FFFFFF",
                    margin: "0px",
                  }}
                >
                  Reply
                </AccordionSummary>
              </Box>

              <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                <AccordionDetails>
                  <Box>
                    <FormControl sx={{ width: "100%" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#333542",
                          mb: "5px",
                        }}
                      >
                        Message
                      </Typography>
                      <TextField
                        rows={5}
                        multiline
                        id="message"
                        name="message"
                        placeholder="Enter Your Message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                          sx: {
                            height: "20vh",
                            width: "100%",
                            color: "#64758B",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                          },
                        }}
                      />
                      {formik.touched.message && formik.errors.message && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {formik.errors.message}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "10px",
                      alignItems: "center",
                    }}
                  >
                    <FormControl sx={{}}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#333542",
                          mb: "5px",
                        }}
                      >
                        Attachments{" "}
                        <span
                          className="grey-required"
                          style={{ fontSize: "12px", color: "#797979" }}
                        >
                          ( jpg, png, pdf, mp4, docx file extensions are allowed
                          only )
                        </span>
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
                          <span>Browse...</span>
                        </label>
                        <input
                          className="file_new"
                          accept="image/*, video/*, .pdf, .doc, .docx"
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none", padding: "9.5px 10px" }}
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
                              width: "600px",
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

                    <FormControl>
                      <Box
                        sx={{
                          display: "flex",
                          pt: "25px",
                          gap: "20px",
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
                          disabled={messageDetails?.status === "Closed"}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "#2B305C",
                            padding: "6px 35px",
                            ml: "auto",
                          }}
                          onClick={() => {
                            handleCancel();
                            setExpanded(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </FormControl>
                  </Box>
                </AccordionDetails>
              </form>
            </Accordion>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper elevation={1}>
                  <Box sx={{ backgroundColor: "#2B305C", mt: "20px" }}>
                    <Stack
                      display="flex"
                      flexDirection="row"
                      sx={{ padding: "10px" }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#FFFFFF",
                        }}
                      >
                        Chat Info
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <div>
                    <Box display="flex" sx={{ padding: "8px", mt: "5px" }}>
                      <Box sx={{ marginRight: "auto" }}>
                        <div>
                          <Stack
                            display="flex"
                            flexDirection="row"
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              Chat Id:{" "}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {" "}
                              {messageDetails?.tickedId}
                            </Typography>
                          </Stack>
                        </div>
                      </Box>
                    </Box>
                    <Divider />

                    <Box display="flex" sx={{ padding: "8px", mt: "5px" }}>
                      <Box sx={{ marginRight: "auto" }}>
                        <div>
                          <Stack
                            display="flex"
                            flexDirection="row"
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {" "}
                              Subject:
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {messageDetails?.subject}
                            </Typography>
                          </Stack>
                        </div>
                      </Box>
                    </Box>
                    <Divider />
                    <Box display="flex" sx={{ padding: "8px", mt: "5px" }}>
                      <Box sx={{ marginRight: "auto" }}>
                        <div>
                          <Stack
                            display="flex"
                            flexDirection="row"
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {" "}
                              Status:
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {messageDetails?.status}
                            </Typography>
                          </Stack>
                        </div>
                      </Box>
                    </Box>
                    <Divider />
                    <Box display="flex" sx={{ padding: "8px", mt: "5px" }}>
                      <Box sx={{ marginRight: "auto" }}>
                        <div>
                          <Stack
                            display="flex"
                            flexDirection="row"
                            sx={{ mb: 1 }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {" "}
                              Last Updated:
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {dayjs(messageDetails?.updatedAt).format(
                                "YYYY-MM-DD HH:mm:ss A"
                              )}
                            </Typography>
                          </Stack>
                        </div>
                      </Box>
                    </Box>
                  </div>
                  <Divider />
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <Paper elevation={1}>
                  <Box sx={{ mt: "20px" }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 500,
                        backgroundColor: "#2B305C",
                        color: "#FFFFFF",
                        padding: "10px",
                      }}
                    >
                      Chat
                    </Typography>
                  </Box>
                  <Box 
                  sx={{
                    p:'5px 0px',
                  }}
                  >
                    {messages?.map((item: any) => (
                      <>
                        <Stack direction={"row"} key={item.id}>
                          {item.sendBy === "doctor" ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "left",
                                padding: "10px",
                                width: "100%",
                                background: "#dddddd57",
                                margin: "5px 10px",
                                gap: "5px",
                              }}
                            >
                              <Box
                                sx={{
                                  lineHeight: "1",
                                  textAlign: "center",
                                  width: "92px",
                                  height: "72px",
                                  borderRight: "1px solid #ddd",
                                  padding: "5px",
                                }}
                              >
                                <Image
                                  alt="logo"
                                  src={Logo}
                                  width={40}
                                  height={40}
                                  style={{
                                    padding: "5px",
                                    background: "#fff",
                                    borderRadius: "25px",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#000",
                                  }}
                                >
                                  Agri-Doctor
                                </Typography>
                              </Box>
                              <Box sx={{ width: "84%", padding: "0px 10px" }}>
                                <Typography>{item?.content}</Typography>
                                <Typography
                                  sx={{ width: "100%", marginTop: "5px" }}
                                >
                                  Attachment:
                                  {(
                                    <a
                                      href={item?.attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "auto",
                                      }}
                                    >
                                      {item?.attachment}
                                    </a>
                                  ) || "NA"}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "left",
                                width: "100%",
                                padding: "10px",
                                background: "#f0f5f9",
                                margin: "5px 10px",
                              }}
                            >
                              <Box
                                sx={{
                                  lineHeight: "1",
                                  textAlign: "center",
                                  width: "92px",
                                  height: "72px",
                                  borderRight: "1px solid #ddd",
                                  padding: "5px",
                                }}
                              >
                                <Image
                                  alt="User"
                                  src={image}
                                  width={40}
                                  height={40}
                                  style={{
                                    padding: "5px",
                                    background: "#fff",
                                    borderRadius: "25px",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#000",
                                  }}
                                >
                                  You
                                </Typography>
                              </Box>
                              <Box sx={{ width: "84%", padding: "0px 10px" }}>
                                <Typography>{item?.content}</Typography>
                                <Typography
                                  sx={{ width: "100%", marginTop: "5px" }}
                                >
                                  Attachment:
                                  {(
                                    <a
                                      href={item?.attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "auto",
                                      }}
                                    >
                                      {item?.attachment}
                                    </a>
                                  ) || "NA"}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
