"use client";
import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Business from "../../../../img/business1.png";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import createAxiosInstance from "@/app/axiosInstance";
import { useFormik } from "formik";
import { listingSchema } from "@/schema/signUp";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CircularProgress } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { businessTypes } from "@/types/types";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import useMediaQuery from "@mui/material/useMediaQuery";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

export default function Businesspage1() {
  const [checked, setChecked] = useState(false);
  const [address, setAddress] = useState<any[]>([]);
  const [businessTypes, setBusinessTypes] = useState([
    "QC",
    "Listing",
    "Trading",
  ]);
  const [addressLoader, setAddressLoader] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [nav, setnav] = useState<boolean>(true);
  const [gst, setGst] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = useState<businessTypes>();
  const [businessData, setBusinessData] = useState<any>([]);
  const matches = useMediaQuery("(min-width:600px)");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const searchParams = useSearchParams();

  // const businessID = localStorage.getItem("businessId");

  const id = searchParams.get("id");

  // console.log(checked);

  const postBusiness = async (values: any) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.post(`business`, {
        logo: "",
        GSTIN: "",
        leagalName: values.displayName,
        displayName: values.displayName,
        description: values.description,
        dateOfIncorporation: parseInt(values.dateOfIncorporation),
        // mobile: values.mobile,
        createdBy: userData?._id,
        businessType: businessTypes,
        address: values.address,
        defaultBusiness: businessData.length !== 0 ? false : true,
      });
      router.push("/mybusinesses");
      toast.success("Business added successfully");
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
    }
  };

  // Function to generate an array of years from 1800 to the current year
  const generateYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  };

  // Example usage
  const yearsArray = generateYearsArray();

  const fetchAddress = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`business/address_fetch`);

      const newData = await response.data.data.address;

      setAddress(newData);

      setAddressLoader(false);
    } catch (error) {
      // console.log(error);
      setAddressLoader(false);
    }
  };

  const fetchUser = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`user`);

      const newData = await response.data.data;
      setUserData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const postGst = async (gst: string) => {
    try {
      alert("gst ran successfully");
      const createInstance = createAxiosInstance();
      const response = await createInstance.post(`business/verify_PAN`, {
        id_number: gst,
      });
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const fetchBusiness = async () => {
    try {
      const createInstance = createAxiosInstance();

      const url = `business/all_business`;

      const response = await createInstance.get(url);

      const newData = await response.data.data;
      setBusinessData(newData);
      // console.log(businessData);
      // console.log(response.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
    }
  };

  useEffect(() => {
    fetchAddress();
    fetchUser();
    fetchBusiness();
    //eslint-disable-next-line
  }, []);

  const initialValues = {
    displayName: "",
    description: "",
    dateOfIncorporation: "",
    // mobile: "",
    address: "",
    termsAndConditions: " ",
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
    validationSchema: listingSchema,

    onSubmit: (values, action) => {
      // console.log("values: ", values);
      {
        id ? updateBusiness() : postBusiness(values);
      }
      // postBusiness(values);
      // updateBusiness(values);
      action.resetForm();
    },
  });

  console.log(errors);

  const getCompany = async (id: string) => {
    try {
      setLoading(true);
      const createInstance = createAxiosInstance();
      const response = await createInstance.get(`business/${id}`);
      setEditData(response.data.data);
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getCompany(id);
    } //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (editData) {
      setFieldValue("displayName", editData?.displayName);
      setFieldValue("description", editData?.description);
      setFieldValue("dateOfIncorporation", editData?.dateOfIncorporation);
      setFieldValue("mobile", editData?.mobile);
      setFieldValue("address", editData?.address);
      // debugger;
      const delay = 5000;
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
    //eslint-disable-next-line
  }, [editData]);

  const updateBusiness = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(
        `business/update_business/${id}`,
        {
          leagalName: values.displayName,
          displayName: values.displayName,
          description: values.description,
          dateOfIncorporation: parseInt(values.dateOfIncorporation),
          createdBy: userData?._id,
          businessType: businessTypes,
          address: values.address,
          mobile: editData?.mobile || " ",
        }
      );
      router.push("/mybusinesses");
      toast.success("Business updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("unable to update data");
    }
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSmallMobiles = useMediaQuery("(max-width: 575px)");
  const isBiggerMobiles = useMediaQuery(
    "(min-width: 576px) and (max-width: 767px)"
  );
  const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  const isLaptops = useMediaQuery(
    "(min-width: 1025px) and (max-width: 1400px)"
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginX: "auto",
        mt: "0px",
        width: "calc(100% + 0px)",
        ...(isMobile && { width: "100%" }),
      }}
    >
      <ToastContainer />
      <Grid
        item
        xs={12}
        display={"flex"}
        flexDirection={"row"}
        marginLeft="15px"
        marginRight="15px"
        sx={{ marginTop: "0px", width: "100%", padding: "20px" }}
      >
        <Box
          sx={{
            marginRight: "auto",
            mt: "0px",
            marginTop: "0px",
          }}
        >
          <Breadcrumbs>
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontSize: 16,
                fontWeight: 400,
                color: "#2B376E",
              }}
            >
              Home
            </Typography>
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontSize: 16,
                fontWeight: 400,
                color: "#2B376E",
              }}
            >
              Onboard Business
            </Typography>
          </Breadcrumbs>
        </Box>
      </Grid>

      <PageContainer>
        <DashboardCard>
          <Grid
            item
            xs={12}
            sx={{
              mx: "0px",
              my: "0px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              ...(isMobile && { flexDirection: "column" }),
            }}
          >
            {matches == false ? (
              ""
            ) : (
              <Box
                sx={{
                  width: "50%",
                  ...(isMobile && { width: "100%", display: "none" }),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Image
                    alt="businessprofile"
                    src={Business}
                    className="image"
                    width={"300"}
                    style={{
                      width: "auto !important",
                      ...(isMobile && { width: "auto !important" }),
                    }}
                  />
                </Box>
              </Box>
            )}

            <Box sx={{ width: "50%", ...(isMobile && { width: "100%" }) }}>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mt: "20px",
                  cursor: "pointer",
                }}
                onClick={() => handleClickOpen()}
              >
                <Typography
                  sx={{
                    marginright: "auto",
                    color: "#2B376E",
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0em",
                  }}
                  variant="caption"
                >
                  Add your GSTIN and build trust
                </Typography>
                <InfoOutlinedIcon sx={{ color: "#000000", ml: "8px" }} />
              </FormControl>
              {loading ? (
                <Box sx={{ display: "flex", mx: "auto", marginY: "30px" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormControl
                    sx={{
                      mb: "10px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#333542",
                        my: "10px",
                        width: "100%",
                      }}
                    >
                      Company Name
                    </Typography>
                    <TextField
                      InputProps={{
                        sx: {
                          borderRadius: 25,
                          width: "100%",
                          height: 45,

                          color: "#64758B",

                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                        },
                      }}
                      name="displayName"
                      placeholder="Company Name"
                      value={values.displayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.displayName && touched.displayName ? (
                      <p
                        className="form-error"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          paddingLeft: "5px",
                        }}
                      >
                        {errors.displayName}
                      </p>
                    ) : null}
                  </FormControl>
                  <FormControl
                    sx={{
                      mb: "10px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#333542",
                        my: "10px",
                        width: "30%",
                      }}
                    >
                      Profile Description
                    </Typography>
                    <TextField
                      id="outlined-textarea"
                      multiline
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
                      name="description"
                      placeholder="Describe your Business Profile"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "10px",
                      }}
                    >
                      <Typography variant="caption" color="initial">
                        Describe the Business in 250 words
                      </Typography>
                      <Typography variant="subtitle2" color="initial">
                        {`${values?.description?.length || 0}/250`}
                      </Typography>
                      {errors.description && touched.description ? (
                        <p
                          className="form-error"
                          style={{
                            color: "red",
                            fontSize: "12px",
                            paddingLeft: "5px",
                          }}
                        >
                          {/* {errors.description} */}
                          Describe in 250 words
                        </p>
                      ) : null}
                    </Box>
                  </FormControl>

                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "16px" }}
                  >
                    <FormControl sx={{ width: "35%" }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#333542",
                          mb: "10px",
                        }}
                      >
                        Year of Establishment
                      </Typography>

                      <FormControl fullWidth>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="dateOfIncorporation"
                          placeholder="Established Year"
                          value={values.dateOfIncorporation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ borderRadius: "25px", width: "100%" }}
                        >
                          {yearsArray.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormControl>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        width: "63%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <FormControl
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "end",
                          width: "100%",
                        }}
                      >
                        <Link href="/addresses">
                          <Typography
                            sx={{
                              marginLeft: "auto",
                              color: "#2B376E",
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 600,
                              letterSpacing: "0em",
                              cursor: "pointer",
                              mb: "10px",
                            }}
                            variant="caption"
                          >
                            Select or Add Address
                          </Typography>
                        </Link>
                        <InfoOutlinedIcon
                          sx={{ color: "#000000", ml: "8px" }}
                        />
                      </FormControl>

                      <Box sx={{ width: "100%" }}>
                        <FormControl sx={{ width: "100%" }}>
                          <Select
                            name="address"
                            type="dropdown"
                            sx={{
                              borderRadius: "25px",
                              width: "100%",
                            }}
                            onChange={(e) => {
                              handleChange(e);
                              const selectedAddress = address.find(
                                (item: any) => item._id === e.target.value
                              );
                              setFieldValue("address", selectedAddress);
                            }}
                            value={
                              //ts:ignore
                              values.address
                                ? // @ts-ignore:next-line
                                  values.address?._id
                                : userData.address?._id || ""
                            }
                            onBlur={handleBlur}
                          >
                            {/* Previous (default) value */}
                            {userData.address && (
                              <MenuItem
                                value={editData?.address._id}
                                key={editData?.address._id}
                              >
                                {editData?.address.addressLine1}{" "}
                                {editData?.address.addressLine2}{" "}
                                {editData?.address.district}{" "}
                                {editData?.address.label}{" "}
                                {editData?.address.city}{" "}
                                {editData?.address.state}{" "}
                                {editData?.address.pincode}{" "}
                                {editData?.address.landmark}
                              </MenuItem>
                            )}

                            {address
                              .filter(
                                (item: any) =>
                                  !editData?.address ||
                                  item._id !== editData?.address._id
                              )
                              .map((item: any, index: any) => (
                                <MenuItem key={index} value={item._id}>
                                  {item.label} {item.addressLine1}{" "}
                                  {item.addressLine2} {item.district}{" "}
                                  {item.city} {item.state} {item.pincode}{" "}
                                  {item.landmark}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.address && touched.address ? (
                            <p
                              className="form-error"
                              style={{
                                color: "red",
                                fontSize: "12px",
                                paddingLeft: "5px",
                              }}
                            >
                              {errors.address}
                            </p>
                          ) : null}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: "10px", ml: "0px" }}>
                    <FormControlLabel
                      label="I Accept All The Terms And Conditions"
                      control={
                        <Checkbox
                          checked={checked}
                          name="termsAndConditions"
                          onClick={() => setChecked((prev) => !prev)}
                        />
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      marginLeft: "auto",
                      display: "flex",
                      justifyContent: "flex-start",
                      mt: "10px",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!checked}
                      sx={{
                        width: "auto",
                        borderRadius: 25,
                        padding: "10px 30px",
                        gap: 16,
                        background: "#2B376E",
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,
                        textTransform: "none",
                        letterSpacing: "0px",
                        textAlign: "center",
                        color: "#FFFFFF",
                        marginRight: "auto",
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          </Grid>
        </DashboardCard>
      </PageContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>GSTIN</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please write your Company&apos;s GST number so we can fetch your
            company Data from GSTIN
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="GSTIN"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setGst(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => postGst(gst)}>Send</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
