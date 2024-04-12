"use client";
import react from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Business from "../../../img/business1.png";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import InputLabel from "@mui/material/InputLabel";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import { Divider, InputAdornment, ListItem, Stack } from "@mui/material";
import createAxiosInstance from "@/app/axiosInstance";
import { usePathname } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addressSchema, bankSchema } from "@/schema/signUp";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Paper } from "@mui/material";

import { IconButton } from "@mui/material";
import { useAppselector } from "@/redux/store";
import { LoadingButton } from "@mui/lab";

export default function BankAccount() {
  const [address, setAddress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [bankLoader, setBankLoader] = useState(true);
  const [editItem, setEditItem] = useState<any>(false);
  const [loadingBtn, setLoadingBtn] = useState<any>(false);
  const pathname = usePathname();
  const axiosInstance = createAxiosInstance();
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const businessId = defaultBusinessId;
  const [bank, setBank] = useState<any>();
  const [bankDetails, setBankDetails] = useState<any>();

  const fetchBank = async () => {
    try {
      const response = await axiosInstance.get(
        `bank_account/bank_accounts?businessId=${businessId}`
      );

      if (response.status === 200) {
        const newData = await response.data.data;
        debugger;
        console.log(newData);
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

  useEffect(() => {
    fetchBank();
  }, []);

  const open = Boolean(anchorEl);
  const id2 = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e: any, item: any) => {
    setEditItem(item);
    setAnchorEl(e.currentTarget);
  };

  // const postAddress = async (values: any) => {
  //     try {
  //         const response = await axiosInstance.put(`business/add_address_user`, {
  //             label: values.label,
  //             pincode: parseInt(values.pincode),
  //             city: values.city,
  //             state: values.state,
  //             district: values.district,
  //             addressLine1: values.addressLine1,
  //             addressLine2: values.addressLine2,
  //             landmark: values.landmark,
  //             defaultFlag: values.default,
  //         });
  //         if (response.status === 200) {
  //             toast.success("Address added successfully");
  //         }

  //         fetchAddresses();
  //     } catch (error: any) {
  //         console.error(error);
  //         toast.error(
  //             error?.response?.data?.message[0] ||
  //             "An error occurred while fetching bank data"
  //         );
  //     }
  // };

  const handleDelete = async (_id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.delete(
        `/bank_account/remove/${_id}`
      );
      if (response) {
        toast.success("Deleted successfully");
        handleClose();
        setEditItem('')
        fetchBank();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
    }
  };

  const updateAddress = async (values: any) => {
    try {
      if (values.id) {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.put(
          `business/update_address_user/`,
          {
            _id: values.id,
            label: values.label,
            pincode: parseInt(values.pincode),
            city: values.city,
            state: values.state,
            district: values.district,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            landmark: values.landmark,
            defaultFlag: values.default,
          }
        );
        if (response.status === 200) {
          toast.success("Address updated successfully");
        }
        setEditItem("");
        // console.log("response: ", reponse);
        // fetchAddresses();
        setUpdate(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
    }
  };

  const addBank = async (values: any) => {
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

      if (response.status === 200) {
        fetchBank();
        setLoadingBtn(false)
        formik.resetForm();
        toast.success("Bank added successfully");
      } else {
        // If the request was not successful, show the error message from the backend
        setLoadingBtn(false)
        toast.error("An error occurred");
      }

      setLoading(false);
    } catch (error: any) {
      toast.error("An error occurred");
      // toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoadingBtn(false)
    }
  };

  const validationSchema = Yup.object().shape({
    holderName: Yup.string()
      .min(2)
      .required("please enter Account Holder Name"),
    accountNumber: Yup.number()
      .min(2)
      .required("Please enter the Account Number"),
    confirAccountNumber: Yup.number()
      .oneOf(
        [Yup.ref("accountNumber"), undefined],
        "Account Numbers must match"
      )
      .required("Please confirm the Account Number"),
    ifsc: Yup.string().required("please enter your IFSC"),
    bankName: Yup.string().min(2).required("please enter the Bank name"),
    branch: Yup.string().min(2).required("please enter the branch"),
    bankAddress: Yup.string().min(2).required("please enter the Bank Address"),
  });

  const onEdit = (item: any) => {
    formik.setValues({
      holderName: item.accountHolderName,
      accountNumber: item.accountNumber,
      confirAccountNumber: item.accountNumber,
      ifsc: item.ifsc,
      bankName: item.bankName,
      branch: item.branch,
      bankAddress: item.bankAddress,
      selectedOption: item.selectedOption,
      businessId: item.businessId,
    });
  };

  const fetchIfsc = async (values: any) => {
    try {
      const response = await axiosInstance.get(
        `/payments/get_ifsc_details?ifsc=${values}`
      );

      if (response.status === 200) {
        const newData: any = await response.data.data;
        setBankDetails(newData.data);
        const updatedValues: any = {
          ...formik.values,
          bankName: newData.data.BANK,
          branch: newData.data.BRANCH,
          bankAddress: newData.data.ADDRESS,
        };
        formik.setValues(updatedValues);
      } else {
        setBankLoader(false);
      }
    } catch (error: any) {
      toast.error("Internal server error");
      setBankLoader(false);
    }
  };

  const handleVerifyClick = () => {
    fetchIfsc(formik.values.ifsc);
  };

  const formik = useFormik({
    initialValues: {
      holderName: "",
      accountNumber: "",
      confirAccountNumber: "",
      ifsc: "",
      bankName: "",
      branch: "",
      bankAddress: "",
      selectedOption: "",
      businessId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingBtn(true)
      addBank(values);
    },
  });

  return (
    <>
      <Grid
        container
        spacing={6}
        sx={{
          marginLeft: "0px",
          marginTop: "0px",
          width: "100%",
          padding: "0",
        }}
      >
        <ToastContainer />

        <Grid
          item
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: "20px",
            paddingLeft: "20px !important",
            paddingTop: "0px !important",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <h2 style={{ color: "#2B376E", margin: "0px" }}>
              {" "}
              Home {pathname}
            </h2>
          </Box>
        </Grid>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <Grid
            container
            spacing={2}
            sx={{
              marginX: "auto",
              marginTop: "0px",
              padding: "0px",
              width: "100% !important",
            }}
          >
            <div className="address-aligners w-full" style={{ width: "100%" }}>
              <Grid>
                <Box
                  sx={{
                    padding: "0px",
                  }}
                >
                  <Box id="alert-dialog-slide-description">
                    <Grid container spacing={10}>
                      <Grid item xs={5}>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "20px",
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                              textAlign: "left",
                              color: "#2B305C",
                            }}
                          >
                            Bank accounts
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            overflow: "hidden",
                            overflowY: "scroll",
                            maxHeight: "60vh",
                            minHeight: "60vh",
                            paddingX: "30px",
                          }}
                        >
                          {bankLoader ? (
                            <Typography variant="subtitle2">
                              Loading...
                            </Typography>
                          ) : (
                            bank.map((item: any, index: any) => (
                              <Box
                                className="finer"
                                sx={{
                                  paddingY: "20px",
                                  maxWidth: "300px",
                                }}
                                key={index}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "flex-start",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#2B376E",
                                      }}
                                    >
                                      Bank Name: {item.bankName}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#2B376E",
                                      }}
                                    >
                                      Account Holder: {item.accountHolderName}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#2B376E",
                                      }}
                                    >
                                      Account Number: {item.accountNumber}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#2B376E",
                                      }}
                                    >
                                      IFSC Code: {item.ifsc}
                                    </Typography>
                                    {/* Add other details you want to display */}
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Typography
                                      className="defaulter"
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#8CC53D",
                                      }}
                                    >
                                      {item.defaultFlag ? "Default" : " "}
                                    </Typography>

                                    <Box className="rested">
                                      <IconButton onClick={(e: any) => handleClick(e, item)}>
                                        <MoreVertIcon
                                          sx={{
                                            '&:hover': {
                                              cursor: 'pointer',
                                            },
                                          }}
                                        />
                                      </IconButton>
                                    </Box>

                                    <Popover
                                      className="over-edit"
                                      id={id2}
                                      open={open}
                                      anchorEl={anchorEl}
                                      onClose={handleClose}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                      }}
                                    >
                                      <div className="extra-click">
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "start",
                                            p: 2,
                                          }}
                                        >
                                          {/* <Button
                                            variant="text"
                                            color="primary"
                                            onClick={() => {
                                              onEdit(editItem);
                                              setUpdate(true);
                                            }}
                                          >
                                            Edit
                                          </Button> */}
                                          <Button
                                            variant="text"
                                            color="primary"
                                            onClick={() => {
                                              handleDelete(editItem._id);
                                            }}
                                          >
                                            Delete
                                          </Button>
                                        </Box>
                                      </div>
                                    </Popover>
                                  </Box>
                                </Box>
                                <Divider sx={{ marginY: "5px" }} />
                              </Box>
                            ))
                          )}
                        </Box>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "20px",
                            fontWeight: 600,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#2B305C",
                          }}
                        >
                          Add New Bank Account
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>
                          <Box
                            display={"flex"}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <FormControl sx={{ width: "100%" }}>
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
                                    width: "100%",
                                    height: 47,

                                    color: "#64758B",

                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                  },
                                }}
                                value={formik.values.holderName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.holderName &&
                                formik.errors.holderName && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.holderName}
                                  </p>
                                )}
                            </FormControl>
                            <FormControl sx={{ ml: "20px", width: "100%" }}>
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
                                    width: "100%",
                                    height: 47,

                                    color: "#64758B",

                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                  },
                                }}
                                value={formik.values.accountNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.accountNumber &&
                                formik.errors.accountNumber && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.accountNumber}
                                  </p>
                                )}
                            </FormControl>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <FormControl sx={{ width: "100%" }}>
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
                                value={formik.values.confirAccountNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                InputProps={{
                                  sx: {
                                    borderRadius: 25,
                                    width: "100%",
                                    height: 47,
                                    color: "#64758B",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                  },
                                }}
                              />
                              {formik.touched.confirAccountNumber &&
                                formik.errors.confirAccountNumber && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.confirAccountNumber}
                                  </p>
                                )}
                            </FormControl>
                            <FormControl sx={{ ml: "20px", width: "100%" }}>
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
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Button
                                        onClick={handleVerifyClick}
                                        variant="contained"
                                      >
                                        Verify
                                      </Button>
                                    </InputAdornment>
                                  ),
                                  sx: {
                                    borderRadius: 25,
                                    width: "100%",
                                    height: 47,
                                    // color: '#64758B',
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                  },
                                }}
                                value={formik.values.ifsc}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.ifsc && formik.errors.ifsc && (
                                <p
                                  style={{
                                    color: "red",
                                    marginTop: "5px",
                                    marginBottom: "-15px",
                                  }}
                                >
                                  {formik.errors.ifsc}
                                </p>
                              )}
                            </FormControl>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <FormControl sx={{ ml: "0px", width: "100%" }}>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#333542",
                                  my: "10px",
                                }}
                              >
                                Branch Name
                              </Typography>
                              <TextField
                                name="branchName"
                                value={formik.values.bankName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
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
                              {formik.touched.bankName &&
                                formik.errors.bankName && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.bankName}
                                  </p>
                                )}
                            </FormControl>
                            <FormControl sx={{ ml: "20px", width: "100%" }}>
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
                                name="ifsc"
                                value={formik.values.branch}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
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
                              {formik.touched.branch &&
                                formik.errors.branch && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.branch}
                                  </p>
                                )}
                            </FormControl>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <FormControl sx={{ ml: "0px", width: "100%" }}>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#333542",
                                  my: "10px",
                                }}
                              >
                                Branch Address
                              </Typography>
                              <TextField
                                name="ifsc"
                                value={formik.values.bankAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
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
                              {formik.touched.bankAddress &&
                                formik.errors.bankAddress && (
                                  <p
                                    style={{
                                      color: "red",
                                      marginTop: "5px",
                                      marginBottom: "-15px",
                                    }}
                                  >
                                    {formik.errors.bankAddress}
                                  </p>
                                )}
                            </FormControl>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "end",
                              mt: "20px",
                            }}
                          >
                            {update ? (
                              <Button
                                variant="contained"
                                sx={{
                                  textTransform: "none",
                                  paddingX: "30px",
                                  borderRadius: "25px",
                                  backgroundColor: "#2B376E",
                                  marginBottom: "20px",
                                }}
                                type="submit"
                                onClick={updateAddress}
                              >
                                update
                              </Button>
                            ) : (
                              // <Button
                              //   variant="contained"
                              //   sx={{
                              //     textTransform: "none",
                              //     paddingX: "30px",
                              //     borderRadius: "25px",
                              //     backgroundColor: "#2B376E",
                              //     marginTop: "15px",
                              //     width: "207px",
                              //     height: "45px",

                              //     padding: "0px, 16px, 0px, 16px",

                              //     gap: "16px",
                              //   }}
                              //   type="submit"
                              // >
                              //   <Typography
                              //     sx={{
                              //       fontFamily: "Poppins",
                              //       fontSize: "16px",
                              //       fontWeight: 600,

                              //       letterSpacing: "0px",
                              //       textAlign: "center",
                              //       color: "#FFFFFF",
                              //     }}
                              //   >
                              //     Save Address
                              //   </Typography>
                              // </Button>


                              <LoadingButton
                                color="primary"
                                variant="contained"
                                size="large"
                                fullWidth
                                type="submit"
                                loading={loadingBtn}
                                sx={{
                                  textTransform: "none",
                                  paddingX: "30px",
                                  borderRadius: "25px",
                                  backgroundColor: "#2B376E",
                                  marginTop: "15px",
                                  width: "207px",
                                  height: "45px",

                                  padding: "0px, 16px, 0px, 16px",

                                  gap: "16px",
                                }}
                              >
                                Save
                              </LoadingButton>
                            )}
                          </Box>
                        </form>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </div>
          </Grid>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
