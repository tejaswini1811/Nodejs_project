"use client";
import React, { useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Image from "next/image";
import logo from "@/img/logo.png";
import image1 from "@/img/flag.png";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Checkbox, Divider, ListItem, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { grey } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import { FormControl } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import createAxiosInstance from "@/app/axiosInstance";
import { useFormik } from "formik";
import { addressSchema, bankSchema, profileSchema } from "@/schema/signUp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useAppselector } from "@/redux/store";
import {
  userType,
  addressType,
  businessTypes,
  bankType,
  notificationType,
} from "@/types/types";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch } from "react-redux";
import { getUserDetailsAsync } from "@/redux/features/userSlice";
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "#1E293B" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [userData, setUserData] = useState<userType | null>();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState<any>([]);
  const [addressLoader, setAddressLoader] = useState<boolean>(true);
  const [businessData, setBusinessData] = useState<businessTypes[]>([]);
  const [businessDataLoader, setBussinessDataLoader] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [notication, setNotification] = useState<notificationType[]>([]);
  const [noticationLoader, setNotificationLoader] = useState(true);
  const [bankLoader, setBankLoader] = useState(true);
  const [bank, setBank] = useState<bankType[]>([]);
  const [uniqueId, setUniqueId] = useState<string>("");
  const axiosInstance = createAxiosInstance();
  const [favourites, setFavourites] = useState<any[]>([]);
  const [favouriteCommodities, setFavouritesCommodities] = useState<any[]>([]);
  const { defaultBusinessId, image } = useAppselector(
    (state) => state?.user.value
  );
  const [age, setAge] = React.useState("");
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<any>();

  const businessId = defaultBusinessId;
  const [open5, setOpen5] = React.useState(false);

  const theme = useTheme();
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const handleClickOpen5 = () => {
    setOpen5(true);
  };
  const handleClose5 = () => {
    setOpen5(false);
  };

  interface updateUser {
    image: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    contactAddress: string;
    billingAddress: string;
  }

  interface addBank {
    holderName: string;
    confirAccountNumber: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    bankAddress: string;
    branch: string;
    businessId: string;
  }

  const router = useRouter();

  useEffect(() => {
    axiosInstance.get('/user/profile-percentage')
      .then(response => {
        const { completionPercentage } = response.data.data;
        setCompletionPercentage(completionPercentage);
      })
      .catch(error => {
        console.error('Error fetching completion percentage:', error);
      });
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(`user`);

      const newData = await response.data.data;
      setUserData(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const dispatch = useDispatch();
  const updateUser = async (values: updateUser) => {
    try {
      const response = await axiosInstance.put(`user`, {
        image: values.image || "",
        firstName: values.firstName,
        lastName: values.lastName,
        mobile: values.mobile,
        email: values.email,
        contactAddress: values.contactAddress,
        billingAddress: values.billingAddress,
      });
      setUserData(response.data.data);
      if (response.status === 200) {
        toast.success("User Updated successfully");
        dispatch(getUserDetailsAsync());
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);

      let errorMessage = "An error occurred";

      if (error?.response?.data?.message) {
        // Check if it's a string error
        errorMessage = error.response.data.message[0];
      } else if (Array.isArray(error?.response?.data?.message)) {
        // Check if it's an array of errors
        errorMessage = error.response.data.message.join(", ");
      }
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const addBank = async (values: addBank) => {
    try {
      const response = await axiosInstance.post(`bank_account/add`, {
        accountHolderName: values.holderName,
        accountNumber: values.accountNumber,
        ifsc: values.ifsc,
        bankName: values.bankName,
        branch: values.branch,
        location: values.bankAddress,
        businessId: businessId,
      });

      // Check if the request was successful
      if (response.status === 200) {
        toast.success("Bank added successfully");
      } else {
        // If the request was not successful, show the error message from the backend
        toast.error(response.data.message || "An error occurred");
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      // toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoading(false);
    }
  };

  const fetchBank = async () => {
    try {
      const response = await axiosInstance.get(
        `bank_account/bank_accounts?businessId=${businessId}`
      );

      if (response.status === 200) {
        const newData = await response.data.data;
        setBank(newData);
        setBankLoader(false);
      } else {
        // Additional logic for a non-successful response, if needed

        setBankLoader(false);
      }
    } catch (error: any) {
      console.error(error);

      setBankLoader(false);
    }
  };

  const fileInputRef: any = useRef(null);

  const handleIconClick = (e: any) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setImageFile(e.target.files[0]);
  };

  const fetchAddress = async () => {
    try {
      const response = await axiosInstance.get(`business/address_fetch`);

      const newData = await response.data.data.address;

      setAddress(newData);

      setAddressLoader(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
      setAddressLoader(false);
    }
  };

  const fetchBusiness = async () => {
    try {
      const response = await axiosInstance.get(`business/all_business`);

      const newData = await response.data.data;

      setBusinessData(newData);

      // console.log("bsuiness: ", businessData);
      setBussinessDataLoader(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
      setBussinessDataLoader(false);
    }
  };

  const fetchNotification = async () => {
    try {
      const response = await axiosInstance.get(`notification/list`);
      const newData = await response.data.data;
      setNotification(newData);
      // console.log("bsuiness: ", businessData);
      setNotificationLoader(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
      setNotificationLoader(false);
    }
  };

  const readNotification = async (uniqueId: string) => {
    try {
      const response = await axiosInstance.put(
        `notification/mark_as_read/${uniqueId}`
      );
      fetchNotification();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
    }
  };

  const getFavouriteCommodities = async () => {
    try {
      const response = await axiosInstance.get(
        `commodity/commodities/favorite/all`
      );
      const newData = await response.data.data;
      setFavouritesCommodities(newData);
    } catch (error) {
      console.log("error");
    }
  };

  const getCommodities = async () => {
    try {
      const response = await axiosInstance.get(
        `commodity/commodities/expect_favorite`
      );
      const newData = await response.data.data;
      setFavourites(newData);
    } catch (error) {
      console.log("error");
    }
  };

  const postFavouriteCommodities = async () => {
    try {
      await axiosInstance.post(`commodity/favorite`, {
        favoriteCommodities: selectedImageUrls,
      });
      toast.success("favourite Commodities Added Successfully");
      getCommodities();
      getFavouriteCommodities();
    } catch (error) {
      console.log("error");
    }
  };

  const deleteFavouriteCommodities = async (id: string) => {
    try {
      await axiosInstance.delete(`commodity/favorite`, {
        data: {
          commodityId: id,
        },
      });
      toast.success("Favorite Commodities Deleted Successfully");
      getCommodities();
      getFavouriteCommodities();
    } catch (error) {
      console.error("Error deleting favorite commodity", error);
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchAddress();
    fetchNotification();
    fetchBank();
    getCommodities();
    getFavouriteCommodities();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchUser();
    //eslint-disable-next-line
  }, [submit]);

  // useEffect(() => {
  //   updateUser(values);
  // }, [submit]);

  const handleChange1 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setImageUrl(null);
    setImageFile("");
    setOpen(false);
  };

  const [open4, setOpen4] = useState(false);
  const handleClickOpen2 = () => {
    setOpen4(true);
  };

  const handleClose2 = () => {
    setOpen4(false);
  };

  interface FormValues {
    firstName: string;
    lastName: string;
    mobile: string;
    image: string;
    email: string;
    contactAddress: string;
    billingAddress: string;
  }

  const uploadProfile = async (values: any) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await axiosInstance.post("upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const uploadedImageUrl: any = response.data.data.url;
    values.image = uploadedImageUrl;
    if (uploadedImageUrl) {
      updateUser(values);
    }
  };

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    mobile: "",
    image: "",
    email: "",
    contactAddress: "",
    billingAddress: "",
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: profileSchema,

    onSubmit: (values, action) => {
      if (imageFile) {
        uploadProfile(values);
      } else {
        updateUser(values);
      }
      action.resetForm();
      handleClose();
    },
  });

  const handleChange3 = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open3 = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose3 = () => {
  //   setAnchorEl(null);
  // };

  // const handleSelect = (item) => {
  //   setSelectedAddress(item);
  //   handleClose3();
  // };

  const onEdit = () => {
    setFieldValue("firstName", userData?.firstName);
    setFieldValue("lastName", userData?.lastName);
    setFieldValue("email", userData?.email);
    setFieldValue("mobile", userData?.mobile);
    setFieldValue("contactAddress", userData?.contactAddress);
    setFieldValue("billingAddress", userData?.billingAddress);
  };

  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

  const handleCheckboxClick = (imageUrl: string) => {
    setSelectedImageUrls((prevUrls) => {
      const isSelected = prevUrls.includes(imageUrl);
      const updatedUrls = isSelected
        ? prevUrls.filter((url) => url !== imageUrl)
        : [...prevUrls, imageUrl];
      // console.log("image url array: ", updatedUrls);
      return updatedUrls;
    });
  };

  const openDeleteCommoditySwal = (id: string, name: string) => {
    Swal.fire({
      title: "Favourite Commodity",
      html: `Do you want to Delete <strong><em>${name}</em></strong> as Favourite Commodity?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFavouriteCommodities(id);
      }
    });
  };

  return (
    <>
      <Grid container spacing={1} sx={{ overflow: "auto", maxHeight: "90vh" }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Grid item xs={12} sx={{ marginRight: "15px" }}>
          <Grid display="flex">
            <Grid item xs={12} md={9} sx={{ mt: "15px", ml: "30px" }}>
              <Paper
                elevation={0}
                sx={{
                  width: "98%",
                  height: "100%",
                  top: 1000,
                  left: 3265,
                  borderRadius: 5,
                  mb: 3,
                }}
              >
                <Box
                  width="100%"
                  padding={"10px"}
                  sx={{ ml: "12px", pt: "20px" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2B376E",
                    }}
                  >
                    Profile Percentage
                  </Typography>



                </Box>
                <Box >
                  <MobileStepper
                    variant="progress"
                    steps={100}
                    position="static"
                    activeStep={completionPercentage}
                    backButton={<div style={{ visibility: 'hidden' }} />}
                    nextButton={<div style={{ visibility: 'hidden' }} />}
                    sx={{ width: "100%",
                      flexGrow: 1, backgroundColor: "#FFFFFF",
                      display: "flex", justifyContent: "center"
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', }}>
                    <div
                      style={{
                        width: `${completionPercentage}%`,
                        height: 4,

                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: "0px" }}>
                    {`${completionPercentage}%`}
                  </div>
                </Box>
                <Box
                  width="100%"
                  padding={"10px"}
                  sx={{ ml: "12px", pt: "20px" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2B376E",
                    }}
                  >
                    Account Settings
                  </Typography>
                </Box>
                <Box padding="1px" sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange1("panel1")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel1d-content"
                        id="panel1d-header"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          Profile Info
                        </Typography>
                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                          onClick={() => {
                            handleClickOpen();
                            onEdit();
                          }}
                        >
                          Edit
                        </Button>
                      </AccordionSummary>
                    </Box>
                    <AccordionDetails>
                      <Box display="flex" sx={{ padding: "8px" }}>
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
                                Name:{" "}
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
                                {userData?.firstName} {userData?.lastName}
                              </Typography>
                            </Stack>
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
                                Mobile Number:
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 400,
                                  ml: "2px",
                                }}
                              >
                                {userData?.mobile}{" "}
                                {userData?.isMobileVerified
                                  ? "verified"
                                  : "not verified"}
                              </Typography>
                            </Stack>
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
                                Email Address:
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 400,
                                  ml: "2px",
                                }}
                              >
                                {userData?.email}
                              </Typography>
                            </Stack>
                            <Stack
                              display="flex"
                              flexDirection="column"
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
                                Contact Address:{" "}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 400,
                                }}
                              >
                                {
                                  <Box>
                                    {userData?.contactAddress?.label}{" "}
                                    {userData?.contactAddress?.addressLine1}{" "}
                                    {userData?.contactAddress?.addressLine2}{" "}
                                    {userData?.contactAddress?.district}{" "}
                                    {userData?.contactAddress?.city}{" "}
                                    {userData?.contactAddress?.state}
                                    {" - "}
                                    {userData?.contactAddress?.pincode}{" "}
                                  </Box>
                                }
                              </Typography>
                            </Stack>
                            <Stack
                              display="flex"
                              flexDirection="column"
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
                                Billing Address:{" "}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 400,
                                }}
                              >
                                {
                                  <Box>
                                    {userData?.billingAddress?.label}{" "}
                                    {userData?.billingAddress?.addressLine1}{" "}
                                    {userData?.billingAddress?.addressLine2}{" "}
                                    {userData?.billingAddress?.district}{" "}
                                    {userData?.billingAddress?.city}{" "}
                                    {userData?.billingAddress?.state}
                                    {" - "}
                                    {userData?.billingAddress?.pincode}{" "}
                                  </Box>
                                }
                              </Typography>
                            </Stack>
                          </div>
                        </Box>
                        <Box sx={{ marginLeft: "auto", mr: "50px" }}>
                          {/* {userData?.image ? (
                            <Image
                              src={userData.image}
                              alt="profile image"
                              width={100}
                              height={100}
                              style={{ borderRadius: "100%" }}
                            />
                          ) : (
                            <CameraAltOutlinedIcon
                              sx={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                border: "2px solid #ccc",
                                padding: "15px",
                              }}
                            />
                          )} */}
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
                <Box padding="1px" sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange1("panel2")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel2d-content"
                        id="panel2d-header"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          My Addresses
                        </Typography>

                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                          onClick={() => {
                            router.push("/addresses");
                          }}
                        >
                          Add
                        </Button>
                      </AccordionSummary>
                    </Box>
                    {addressLoader ? (
                      <Typography variant="body1" color="initial">
                        Loading
                      </Typography>
                    ) : (
                      <Box>
                        {address.map((item: any, index: number) => (
                          <AccordionDetails key={index}>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {item?.label} {item?.addressLine1}{" "}
                              {item?.addressLine2} {item?.city} {item?.district}{" "}
                              {item?.state} {item?.pincode}{" "}
                              {item?.defaultFlag ? "defaultAddress" : " "}
                            </Typography>
                          </AccordionDetails>
                        ))}
                      </Box>
                    )}
                  </Accordion>
                </Box>
                <Box padding="1px" sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel6"}
                    onChange={handleChange1("panel6")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel6d-content"
                        id="panel6d-header"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          My Bank
                        </Typography>

                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                          onClick={() => {
                            router.push("/bank-account");
                          }}
                        >
                          Add
                        </Button>
                      </AccordionSummary>
                    </Box>
                    {bankLoader ? (
                      <Typography variant="body1" color="initial">
                        Loading......
                      </Typography>
                    ) : (
                      <Box>
                        {bank?.map((item: any, index: number) => (
                          <AccordionDetails key={index}>
                            <Box display="flex" sx={{ padding: "0px" }}>
                              <Box sx={{ marginRight: "auto" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 400,
                                    ml: "2px",
                                  }}
                                >
                                  <div>
                                    <Stack
                                      display="flex"
                                      flexDirection="row"
                                      sx={{ mb: "0px" }}
                                    >
                                      <Typography>
                                        Account Holder Name:{" "}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        color="initial"
                                      >
                                        {item?.accountHolderName}
                                      </Typography>
                                    </Stack>
                                    <Stack
                                      display="flex"
                                      flexDirection="row"
                                      sx={{ mb: "0px" }}
                                    >
                                      <Typography>Account Number: </Typography>
                                      <Typography
                                        variant="body1"
                                        color="initial"
                                      >
                                        {item?.accountNumber}
                                      </Typography>
                                    </Stack>
                                    {/* <Stack  display="flex"
                              flexDirection="row"
                              sx={{ mb: 1 }}>
                              <Typography>IFSC: {" "}</Typography>
                              <Typography variant="body1" color="initial">
                                {item?.ifsc}
                              </Typography>
                              </Stack> */}
                                    <Stack
                                      display="flex"
                                      flexDirection="row"
                                      sx={{ mb: "0px" }}
                                    >
                                      <Typography>Bank Name: </Typography>
                                      <Typography
                                        variant="body1"
                                        color="initial"
                                      >
                                        {item?.bankName}
                                      </Typography>
                                    </Stack>
                                    {/* <Stack  display="flex"
                              flexDirection="row"
                              sx={{ mb: 1 }}>
                              <Typography>Branch: {" "}</Typography>
                              <Typography variant="body1" color="initial">
                                {item?.branch}
                              </Typography>
                              </Stack> */}
                                    {/* <Stack  display="flex"
                              flexDirection="row"
                              sx={{ mb: 1 }}>
                              <Typography>Location: {" "}</Typography>
                              <Typography variant="body1" color="initial">
                                {item?.location}
                              </Typography>
                              </Stack> */}
                                  </div>
                                </Typography>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        ))}
                      </Box>
                    )}
                  </Accordion>
                </Box>
                <Box padding="1px" sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel3"}
                    onChange={handleChange1("panel3")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel3d-content"
                        id="panel3d-header"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          My Businesses
                        </Typography>
                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                          onClick={() => {
                            router.push("/mybusinesses");
                          }}
                        >
                          Edit
                        </Button>
                      </AccordionSummary>
                    </Box>

                    {businessDataLoader ? (
                      <Typography variant="body1" color="initial">
                        Loading...
                      </Typography>
                    ) : businessData.length === 0 ? (
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{
                          marginY: "5px",
                          marginX: "10px",
                          backgroundColor: "#ccc",
                          paddingY: "5px",
                          paddingX: "10px",
                          borderRadius: "20px",
                          display: "inline-block",
                        }}
                      >
                        You dont have any active businesses
                      </Typography>
                    ) : (
                      <Box>
                        {businessData.map((item) => (
                          <AccordionDetails key={item._id}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="body1" color="initial">
                                {item.displayName}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="initial"
                                sx={{
                                  maxWidth: "400px",
                                  overflow: "hidden",
                                  wordWrap: "break-word",
                                }}
                              >
                                {" "}
                                {item.description}
                              </Typography>
                              <Typography variant="body1" color="initial">
                                {item.dateOfIncorporation}
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        ))}
                      </Box>
                    )}
                  </Accordion>
                </Box>
                <Box padding="1px" sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel4"}
                    onChange={handleChange1("panel4")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel4d-content"
                        id="panel4d-header"
                        sx={{ color: "#1E293B" }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          Favourite Commodities
                        </Typography>
                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                          onClick={handleClickOpen5}
                        >
                          Edit
                        </Button>
                      </AccordionSummary>
                    </Box>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      {favouriteCommodities.map((item, index) => (
                        <Box key={item._id} sx={{ gap: "10px" }}>
                          <Item
                            sx={{ margin: "10px", paddingX: "20px" }}
                            onClick={() =>
                              openDeleteCommoditySwal(item._id, item.name)
                            }
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={30}
                              height={30}
                              style={{ borderRadius: "100%" }}
                            />
                            <Typography variant="caption" color="initial">
                              {item.name}
                            </Typography>
                          </Item>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </Box>

                <Box width="100%" padding={"10px"} sx={{ ml: "10px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2B376E",
                    }}
                  >
                    General Settings
                  </Typography>
                </Box>
                <Box padding={"1px"} sx={{ ml: "20px", mr: "20px" }}>
                  <Accordion
                    expanded={expanded === "panel5"}
                    onChange={handleChange1("panel5")}
                  >
                    <Box sx={{ backgroundColor: "#F1F5F9" }}>
                      <AccordionSummary
                        aria-controls="panel5d-content"
                        id="panel5d-header"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1E293B",
                            lineHeight: "30px",
                          }}
                        >
                          Notifications
                        </Typography>
                        <Button
                          sx={{
                            marginLeft: "auto",
                            fontFamily: "Poppins",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#2B376E",
                          }}
                        >
                          View
                        </Button>
                      </AccordionSummary>
                    </Box>
                    {noticationLoader ? (
                      <Typography variant="body1" color="initial">
                        Loading...
                      </Typography>
                    ) : notication?.length === 0 ? (
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{
                          marginY: "5px",
                          marginX: "10px",
                          backgroundColor: "#ccc",
                          paddingY: "5px",
                          paddingX: "10px",
                          borderRadius: "20px",
                          display: "inline-block",
                        }}
                      >
                        You dont have any Notification
                      </Typography>
                    ) : (
                      notication?.map((item, index) => (
                        <AccordionDetails
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 400,
                                ml: "2px",
                              }}
                            >
                              {item?.notification?.body}
                            </Typography>

                            <Typography variant="body1" color="orangered">
                              {" "}
                              {item.isRead ? " Read " : " "}
                            </Typography>
                          </Box>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              readNotification(item?.data?.uniqueId)
                            }
                          >
                            {item.isRead ? " " : "Mark As Read"}
                          </Button>
                        </AccordionDetails>
                      ))
                    )}
                  </Accordion>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3} sx={{ mt: "15px" }}>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  height: 150,
                  top: 150,
                  left: 1508,
                  borderRadius: 5,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    font: "Poppins",
                    fontSize: 16,
                    fontWeight: 600,
                    color: " #2B376E",
                    mb: 1,
                  }}
                >
                  More
                </Typography>
                <Divider sx={{ border: "1px solid #CBD5E1" }} />
                <Typography
                  sx={{
                    font: "Poppins",
                    fontSize: 14,
                    fontWeight: 600,
                    color: " #2B376E",
                    mt: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/privacy")}
                >
                  Privacy & Security
                </Typography>
                <Typography
                  sx={{
                    font: "Poppins",
                    fontSize: 14,
                    fontWeight: 600,
                    color: " #2B376E",
                    mt: 1,
                  }}
                >
                  Help & Support
                </Typography>
                <Link href="https://www.sohanlal.in/company-overview.html">
                  <Typography
                    sx={{
                      font: "Poppins",
                      fontSize: 14,
                      fontWeight: 600,
                      color: " #2B376E",
                      mt: 1,
                    }}
                  >
                    About SLCM AgriReach
                  </Typography>
                </Link>
              </Paper>
            </Grid>
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Paper elevation={1} sx={{ paddingX: "15px", padding: "20px" }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{}}>
                  <Stack display="flex" flexDirection="row">
                    <DialogTitle
                      id="alert-dialog-title"
                      sx={{
                        marginRight: "auto",
                        fontFamily: "Poppins",
                        fontsize: "20px",
                        fontWeight: 600,
                        color: "#2B305C",
                      }}
                    >
                      Edit Profile
                    </DialogTitle>
                    <DialogTitle>
                      <Button
                        onClick={handleClose}
                        size="small"
                        sx={{ minWidth: "0px" }}
                      >
                        <CloseRoundedIcon
                          sx={{
                            marginLeft: "auto",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid #2B376E",
                            color: "#2B376E",
                            minWidth: "0px",
                          }}
                        />
                      </Button>
                    </DialogTitle>
                  </Stack>
                  {/* <Box>
                    <CameraAltOutlinedIcon
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        padding: "18px",
                        marginLeft: "20px",
                        size: "small",
                      }}
                    />
                  </Box> */}
                  <Box
                    sx={{
                      width: "160px",
                      height: "160px",
                      background: "#ddd",
                      mx: "auto",
                      borderRadius: "79px",
                    }}
                  >
                    <label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                      />
                      <Avatar
                        className="editProfile"
                        onClick={handleIconClick}
                        src={imageUrl ? imageUrl : image}
                        sx={{
                          mx: "auto",
                          width: "100%",
                          height: "100%",
                          border: "5px solid #f1f1f1",
                          boxShadow: "0px 0px 5px -2px",
                          alignItems: "center",
                          "&:hover": {
                            filter: "brightness(50%)",
                          },
                        }}
                      />
                      {/* {imageUrl ?
                        <>
                          <Avatar
                            className='editProfile'
                            onClick={handleIconClick}
                            src={imageUrl}
                            sx={{
                              mx: 'auto',
                              width: { xs: 100, sm: 100, md: 160, lg: 160 },
                              height: { xs: 100, sm: 100, md: 160, lg: 160 },
                              border: '5px solid #f1f1f1',
                              boxShadow: '0px 0px 5px -2px',
                              alignItems: 'center',
                              '&:hover': {
                                filter: 'brightness(50%)',
                              },
                            }}
                          />
                        </>
                        :
                        <CameraAltOutlinedIcon
                          onClick={handleIconClick}
                          sx={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            border: "2px solid #ccc",
                            padding: "18px",
                            marginLeft: "20px",
                            cursor: "pointer",
                          }}
                        />
                      } */}
                    </label>
                  </Box>

                  <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FormControl sx={{ ml: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          my: "10px",
                        }}
                      >
                        First Name
                      </Typography>
                      <TextField
                        name="firstName"
                        InputProps={{
                          sx: {
                            borderRadius: 25,
                            width: 250,
                            height: 47,

                            color: "#64758B",

                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                          },
                        }}
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.firstName && touched.firstName ? (
                        <Typography
                          variant="caption"
                          color={"red"}
                          className="form-error"
                        >
                          {errors.firstName}
                        </Typography>
                      ) : null}
                    </FormControl>
                    <FormControl sx={{ ml: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          my: "10px",
                        }}
                      >
                        Last Name
                      </Typography>
                      <TextField
                        name="lastName"
                        InputProps={{
                          sx: {
                            borderRadius: 25,
                            width: 250,
                            height: 47,

                            color: "#64758B",

                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                          },
                        }}
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.lastName && touched.lastName ? (
                        <Typography
                          variant="caption"
                          color={"red"}
                          className="form-error"
                        >
                          {errors.lastName}
                        </Typography>
                      ) : null}
                    </FormControl>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <FormControl sx={{ ml: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          my: "10px",
                        }}
                      >
                        Mobile Number
                      </Typography>
                      <TextField
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputProps={{
                          sx: {
                            borderRadius: 25,
                            width: 250,
                            height: 47,
                            color: "#64758B",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton edge="start">
                                <Image
                                  alt="flag"
                                  src={image1}
                                  width={26}
                                  height={16.34}
                                />
                              </IconButton>
                              <Box
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 400,
                                  lineHeight: 21,
                                  color: "#1E1E1E",
                                }}
                              >
                                +91{" "}
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {errors.mobile && touched.mobile ? (
                        <Typography
                          variant="caption"
                          color={"red"}
                          className="form-error"
                        >
                          {errors.mobile}
                        </Typography>
                      ) : null}
                    </FormControl>
                    <FormControl sx={{ ml: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          my: "10px",
                        }}
                      >
                        Email Address
                      </Typography>
                      <TextField
                        name="email"
                        InputProps={{
                          sx: {
                            borderRadius: 25,
                            width: 250,
                            height: 47,
                            color: "#64758B",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                          },
                        }}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.email && touched.email ? (
                        <Typography
                          variant="caption"
                          color={"red"}
                          className="form-error"
                        >
                          {errors.email}
                        </Typography>
                      ) : null}
                    </FormControl>
                  </Box>
                  <FormControl
                    sx={{
                      marginY: "20px",
                      marginLeft: "20px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Link href="/addresses">
                      <Typography
                        sx={{
                          color: "#2B376E",
                          fontFamily: "Poppins",
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: "0em",
                          cursor: "pointer",
                        }}
                        variant="caption"
                      >
                        Select or Add Address
                      </Typography>
                    </Link>
                    <InfoOutlinedIcon
                      sx={{
                        color: "#000000",
                        ml: "15px",
                        width: "26px",
                        height: "26px",
                        border: "2px",
                      }}
                    />
                  </FormControl>
                  <Box display={"flex"} flexDirection={"row"}>
                    <FormControl sx={{ marginLeft: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          mb: "10px",
                        }}
                      >
                        Contact Address
                      </Typography>

                      <Box>
                        <FormControl sx={{ width: "450px", height: "47px" }}>
                          <Select
                            fullWidth
                            name="contactAddress"
                            type="dropdown"
                            sx={{ borderRadius: "25px" }}
                            onChange={(e) => {
                              handleChange3(e);
                              handleChange(e);
                              const selectedAddress = address.find(
                                (item: any) => item._id === e.target.value
                              );
                              setFieldValue("contactAddress", selectedAddress);
                            }}
                            value={
                              values.contactAddress
                                ? // @ts-ignore:next-line
                                values.contactAddress._id || ""
                                : userData?.contactAddress?._id || ""
                            }
                            onBlur={handleBlur}
                          >
                            {/* Previous (default) value */}
                            {userData?.contactAddress && (
                              <MenuItem
                                value={userData?.contactAddress?._id}
                                key={userData?.contactAddress?._id}
                              >
                                {userData?.contactAddress?.label}{" "}
                                {userData?.contactAddress?.addressLine1}{" "}
                                {userData?.contactAddress?.addressLine2}{" "}
                                {userData?.contactAddress?.district}{" "}
                                {userData?.contactAddress?.city}{" "}
                                {userData?.contactAddress?.state}{" "}
                                {userData?.contactAddress?.pincode}{" "}
                                {userData?.contactAddress?.landmark}
                              </MenuItem>
                            )}

                            {/* Available options (excluding the previous value) */}
                            {address
                              .filter(
                                (item: any) =>
                                  !userData?.contactAddress ||
                                  item._id !== userData?.contactAddress._id
                              )
                              .map((item: any, index: number) => (
                                <MenuItem key={index} value={item._id}>
                                  {item?.label} {item?.addressLine1}{" "}
                                  {item?.addressLine2} {item?.district}{" "}
                                  {item?.city} {item?.state} {item?.pincode}{" "}
                                  {item?.landmark}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </FormControl>
                  </Box>

                  <Box display={"flex"} flexDirection={"row"}>
                    <FormControl sx={{ ml: "20px", marginY: "20px" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          mb: "10px",
                        }}
                      >
                        Billing Address
                      </Typography>
                      <Box>
                        <FormControl sx={{ width: "450px", height: "47px" }}>
                          <Select
                            fullWidth
                            name="billingAddress"
                            type="dropdown"
                            sx={{ borderRadius: "25px" }}
                            onChange={(e) => {
                              handleChange3(e);
                              handleChange(e);
                              const selectedBillingAddress = address.find(
                                (item: any) => item._id === e.target.value
                              );
                              setFieldValue(
                                "billingAddress",
                                selectedBillingAddress
                              );
                            }}
                            value={
                              values.billingAddress
                                ? // @ts-ignore:next-line
                                values.billingAddress._id
                                : userData?.billingAddress?._id || ""
                            }
                            onBlur={handleBlur}
                          >
                            {/* Previous (default) value */}
                            {userData?.billingAddress && (
                              <MenuItem value={userData?.billingAddress._id}>
                                {userData?.billingAddress?.label}{" "}
                                {userData?.billingAddress?.addressLine1}{" "}
                                {userData?.billingAddress?.addressLine2}{" "}
                                {userData?.billingAddress?.district}{" "}
                                {userData?.billingAddress?.city}{" "}
                                {userData?.billingAddress?.state}{" "}
                                {userData?.billingAddress?.pincode}{" "}
                                {userData?.billingAddress?.landmark}
                              </MenuItem>
                            )}

                            {/* Available options (excluding the previous value) */}
                            {address
                              .filter(
                                (item: any) =>
                                  !userData?.billingAddress ||
                                  item._id !== userData?.billingAddress._id
                              )
                              .map((item: any, index: any) => (
                                <MenuItem key={index} value={item._id}>
                                  {item.label} {item.addressLine1}{" "}
                                  {item.addressLine2} {item.city}{" "}
                                  {item.district} {item.state} {item.pincode}{" "}
                                  {item.landmark}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </FormControl>
                  </Box>

                  <DialogActions>
                    <Button
                      variant="contained"
                      sx={{
                        width: 170,
                        height: 35,
                        borderRadius: 25,
                        gap: 13,
                        background: "#2B376E",
                        fontFamily: "Poppins",
                        fontSize: 14,
                        fontWeight: 600,
                        mr: "22px",
                        textTransform: "none",
                        letterSpacing: "0px",
                        textAlign: "center",
                        color: "#FFFFFF",
                      }}
                      type="submit"
                    >
                      Update Profile
                    </Button>
                  </DialogActions>
                </Box>
              </form>
            </Paper>
          </Dialog>

          <Dialog
            open={open4}
            onClose={handleClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Paper elevation={1} sx={{ paddingX: "15px", padding: "20px" }}>
              <Formik
                initialValues={{
                  holderName: "",
                  accountNumber: "",
                  confirAccountNumber: "",
                  ifsc: "",
                  bankName: "",
                  branch: "",
                  bankAddress: "",
                  selectedOption: "",
                  businessId: "",
                }}
                validationSchema={bankSchema}
                onSubmit={(values, actions: any) => {
                  // console.log(values);
                  addBank(values);
                  actions.resetForm();
                  handleClose2();
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{}}>
                      <Stack display="flex" flexDirection="row">
                        <DialogTitle
                          id="alert-dialog-title"
                          sx={{
                            marginRight: "auto",
                            fontFamily: "Poppins",
                            fontsize: "20px",
                            fontWeight: 600,
                            color: "#2B305C",
                          }}
                        >
                          Bank Details
                        </DialogTitle>
                        <DialogTitle>
                          <Button
                            onClick={handleClose2}
                            size="small"
                            sx={{ minWidth: "0px" }}
                          >
                            <CloseRoundedIcon
                              sx={{
                                marginLeft: "auto",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: "2px solid #2B376E",
                                color: "#2B376E",
                                minWidth: "0px",
                              }}
                            />
                          </Button>
                        </DialogTitle>
                      </Stack>
                      <Box>
                        <CameraAltOutlinedIcon
                          sx={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            border: "2px solid #ccc",
                            padding: "18px",
                            marginLeft: "20px",
                            size: "small",
                          }}
                        />
                      </Box>

                      <Box
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Name
                          </Typography>
                          <TextField
                            name="holderName"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,

                                color: "#64758B",

                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                            value={values.holderName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.holderName && touched.holderName ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.holderName}
                            </Typography>
                          ) : null}
                        </FormControl>
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Account Number
                          </Typography>
                          <TextField
                            name="accountNumber"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,

                                color: "#64758B",

                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                            value={values.accountNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.accountNumber && touched.accountNumber ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.accountNumber}
                            </Typography>
                          ) : null}
                        </FormControl>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Confirm Account Number
                          </Typography>
                          <TextField
                            name="confirAccountNumber"
                            value={values.confirAccountNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          />
                          {errors.confirAccountNumber &&
                            touched.confirAccountNumber ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.confirAccountNumber}
                            </Typography>
                          ) : null}
                        </FormControl>
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            IFSC
                          </Typography>
                          <TextField
                            name="ifsc"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                            value={values.ifsc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.ifsc && touched.ifsc ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.ifsc}
                            </Typography>
                          ) : null}
                        </FormControl>
                      </Box>

                      {/* hello */}

                      <Box
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Bank Name
                          </Typography>
                          <TextField
                            name="bankName"
                            value={values.bankName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          />
                          {errors.bankName && touched.bankName ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.bankName}
                            </Typography>
                          ) : null}
                        </FormControl>
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Branch
                          </Typography>
                          <TextField
                            name="branch"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 250,
                                height: 47,
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                            value={values.branch}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.branch && touched.branch ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.branch}
                            </Typography>
                          ) : null}
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl sx={{ ml: "20px" }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Bank Address
                          </Typography>
                          <TextField
                            name="bankAddress"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 400,
                                height: 47,
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                            value={values.bankAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.bankAddress && touched.bankAddress ? (
                            <Typography
                              variant="caption"
                              color={"red"}
                              className="form-error"
                            >
                              {errors.bankAddress}
                            </Typography>
                          ) : null}
                        </FormControl>
                      </Box>

                      <DialogActions sx={{ marginTop: "10px" }}>
                        <Button
                          variant="contained"
                          sx={{
                            width: 170,
                            height: 35,
                            borderRadius: 25,
                            gap: 13,
                            background: "#2B376E",
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 600,
                            mr: "22px",
                            textTransform: "none",
                            letterSpacing: "0px",
                            textAlign: "center",
                            color: "#FFFFFF",
                          }}
                          type="submit"
                        >
                          Update Profile
                        </Button>
                      </DialogActions>
                    </Box>
                  </form>
                )}
              </Formik>
            </Paper>
          </Dialog>

          <BootstrapDialog
            onClose={handleClose5}
            aria-labelledby="customized-dialog-title"
            open={open5}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Select Your Favurite Commodities
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose5}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ cursor: "pointer" }}>
              {favourites.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      width={30}
                      height={30}
                      style={{
                        borderRadius: "100%",
                      }}
                    />
                    <Typography variant="body1" color="initial">
                      {item?.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Checkbox
                      checked={selectedImageUrls.includes(item._id)}
                      onChange={() => handleCheckboxClick(item._id)}
                    />
                  </Box>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  postFavouriteCommodities();
                  getFavouriteCommodities();
                  handleClose5();
                }}
              >
                Save changes
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </Grid>
      </Grid>
    </>
  );
}
