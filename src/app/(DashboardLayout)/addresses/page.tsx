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
import { Divider, ListItem, Stack } from "@mui/material";
import createAxiosInstance from "@/app/axiosInstance";
import { usePathname } from "next/navigation";
import { useFormik } from "formik";
import { addressSchema } from "@/schema/signUp";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Paper } from "@mui/material";

import { IconButton } from "@mui/material";

const initialValues = {
  label: "",
  addressLine1: "",
  addressLine2: "",
  state: "",
  city: "",
  district: "",
  pincode: "",
  landmark: "",
  default: false,
  _id: "",
};

export default function Businesspage1() {
  const [address, setAddress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any>(false);
  const pathname = usePathname();

  const fetchAddresses = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`business/address_fetch`);
      const newData = response.data.data.address;
      // console.log("response: ", response.data.data.address);
      setAddress(newData);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const open = Boolean(anchorEl);
  const id2 = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e: any, item: any) => {
    setEditItem(item)
    setAnchorEl(e.currentTarget);
  };

  const postAddress = async (values: any) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(`business/add_address_user`, {
        label: values.label,
        pincode: parseInt(values.pincode),
        city: values.city,
        state: values.state,
        district: values.district,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        landmark: values.landmark,
        defaultFlag: values.default,
      });
      if (response.status === 200) {
        toast.success("Address added successfully");
      }

      fetchAddresses();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message[0] ||
        "An error occurred while fetching bank data"
      );
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(
        `business/delete_address/${_id}`
      );

      // console.log("response", response);
      setEditItem('')
      fetchAddresses();
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
        fetchAddresses();
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

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: addressSchema,

    onSubmit: (values, action) => {
      // console.log("values: ", values);
      {
        update ? updateAddress(values) : postAddress(values);
      }

      action.resetForm();
    },
  });

  const onEdit = (item: any) => {
    setFieldValue("label", item.label);
    setFieldValue("pincode", item.pincode);
    setFieldValue("city", item.city);
    setFieldValue("state", item.state);
    setFieldValue("district", item.district);
    setFieldValue("addressLine1", item.addressLine1);
    setFieldValue("addressLine2", item.addressLine2);
    setFieldValue("landmark", item.landmark);
    setFieldValue("id", item._id);
  };

  return (
    <>
      <Grid container spacing={6} mb={2}>
        <ToastContainer />
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ display: "flex", mt: "23px", mb: "20px" }}>
            <h2 style={{ color: "#2B376E" }}> Home {pathname}</h2>
          </Box>
        </Grid>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ marginX: "auto" }}>
              <div
                className="address-aligners w-full"
                style={{ width: "100%" }}
              >
                <Grid>
                  <Box
                    sx={{
                      padding: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
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
                        My Addresses
                      </Typography>

                    </Box>
                    <Box>
                      <Box id="alert-dialog-slide-description">
                        <Grid container spacing={10}>
                          <Grid item xs={5}>
                            <Box
                              sx={{
                                overflow: "hidden",
                                overflowY: "scroll",
                                maxHeight: "60vh",
                                minHeight: "60vh",
                                paddingX: "30px",
                              }}
                            >
                              {loading ? (
                                <Typography variant="subtitle2">
                                  Loading...
                                </Typography>
                              ) : (
                                address.map((item: any, index) => (
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
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <LocationOnOutlinedIcon
                                          sx={{
                                            width: 20,
                                            height: 20,
                                            top: 2.5,
                                            left: 3.33,

                                            color: "#BFC8D6",
                                          }}
                                        />
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
                                          Address {index + 1}
                                        </Typography>
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
                                              <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => {
                                                  onEdit(editItem);
                                                  setUpdate(true);
                                                }}
                                              // onClick={() => handleEdit(index, data?.id)}
                                              >
                                                Edit
                                              </Button>
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
                                      {item.label} {item.addressLine1}{" "}
                                      {item.addressLine2} {item.city}{" "}
                                      {item.state} {item.district}{" "}
                                      {item.pincode}
                                    </Typography>
                                  </Box>
                                ))
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={7}>
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
                              Add New Address
                            </Typography>

                            <form onSubmit={handleSubmit}>
                              <Box sx={{ marginY: "10px" }}>
                                <InputLabel
                                  sx={{
                                    paddingBottom: "10px",
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Address Lable
                                </InputLabel>

                                <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      name="label"
                                      value={values.label}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      sx={{
                                        borderRadius: "25px",
                                        maxWidth: "100%",
                                        height: "45px",
                                      }}
                                    >
                                      <MenuItem value={"Home"}>
                                        <Typography
                                          variant="caption"
                                          color="initial"
                                        >
                                          Home
                                        </Typography>
                                      </MenuItem>
                                      <MenuItem value={"Office"}>
                                        <Typography
                                          variant="caption"
                                          color="initial"
                                        >
                                          Office
                                        </Typography>
                                      </MenuItem>
                                      <MenuItem value={"Random"}>
                                        <Typography
                                          variant="caption"
                                          color="initial"
                                        >
                                          Random
                                        </Typography>
                                      </MenuItem>
                                    </Select>
                                    {errors.label && touched.label ? (
                                      <Typography
                                        variant="caption"
                                        color={"red"}
                                        className="form-error"
                                      >
                                        {errors.label}
                                      </Typography>
                                    ) : null}
                                  </FormControl>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  marginY: "10px",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "left",
                                    gap: "20px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <InputLabel
                                      sx={{
                                        paddingBottom: "10px",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      Pincode
                                    </InputLabel>
                                    <TextField
                                      size="small"
                                      variant="outlined"
                                      placeholder="Pincode"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      InputProps={{
                                        sx: {
                                          borderRadius: "25px",
                                          maxWidth: "100%",
                                          height: "45px",
                                        },
                                      }}
                                      name="pincode"
                                      value={values.pincode}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {errors.pincode && touched.pincode ? (
                                      <Typography
                                        variant="caption"
                                        color={"red"}
                                        className="form-error"
                                      >
                                        {errors.pincode}
                                      </Typography>
                                    ) : null}
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <InputLabel
                                      sx={{
                                        paddingBottom: "10px",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      District
                                    </InputLabel>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      variant="outlined"
                                      placeholder="district"
                                      sx={{ maxWidth: "100%" }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      InputProps={{
                                        sx: {
                                          borderRadius: "25px",
                                          maxWidth: "100%",
                                          height: "45px",
                                        },
                                      }}
                                      name="district"
                                      value={values.district}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {errors.district && touched.district ? (
                                      <Typography
                                        variant="caption"
                                        color={"red"}
                                        className="form-error"
                                      >
                                        {errors.district}
                                      </Typography>
                                    ) : null}
                                  </Box>
                                  {/* <Button
                          variant="contained"
                          color="primary"
                          startIcon={<MyLocationOutlinedIcon />}
                          sx={{
                            borderRadius: "30px",
                            paddingX: "30px",
                            backgroundColor: "#2B376E",
                            textTransform: "none",
                          }}
                        >
                          Location
                        </Button> */}
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "left",
                                  gap: "20px",
                                }}
                              >
                                <Box>
                                  <Box
                                    sx={{
                                      marginY: "10px",
                                    }}
                                  >
                                    <InputLabel
                                      sx={{
                                        paddingBottom: "10px",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      City
                                    </InputLabel>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "left",
                                        gap: "20px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <TextField
                                          size="small"
                                          variant="outlined"
                                          placeholder="City"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          InputProps={{
                                            sx: {
                                              borderRadius: "25px",
                                              maxWidth: "100%",
                                              height: "45px",
                                            },
                                          }}
                                          name="city"
                                          value={values.city}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                        {errors.city && touched.city ? (
                                          <Typography
                                            variant="caption"
                                            color={"red"}
                                            className="form-error"
                                          >
                                            {errors.city}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box>
                                  <Box>
                                    <InputLabel
                                      sx={{
                                        paddingBottom: "10px",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        fontWeight: 500,

                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#333542",
                                      }}
                                    >
                                      State
                                    </InputLabel>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "left",
                                        gap: "20px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <TextField
                                          size="small"
                                          variant="outlined"
                                          placeholder="State"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          InputProps={{
                                            sx: {
                                              borderRadius: "25px",
                                              maxWidth: "100%",
                                              height: "45px",
                                            },
                                          }}
                                          name="state"
                                          value={values.state}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                        {errors.state && touched.state ? (
                                          <Typography
                                            variant="caption"
                                            color={"red"}
                                            className="form-error"
                                          >
                                            {errors.state}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                              <Box sx={{ marginY: "10px" }}>
                                <InputLabel
                                  sx={{
                                    paddingBottom: "10px",
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Building Number, Name
                                </InputLabel>
                                <TextField
                                  size="small"
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Building Number, Name"
                                  sx={{ maxWidth: "100%" }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "25px",
                                      maxWidth: "100%",
                                      height: "45px",
                                    },
                                  }}
                                  name="addressLine1"
                                  value={values.addressLine1}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.addressLine1 && touched.addressLine1 ? (
                                  <Typography
                                    variant="caption"
                                    color={"red"}
                                    className="form-error"
                                  >
                                    {errors.addressLine1}
                                  </Typography>
                                ) : null}
                              </Box>

                              <Box sx={{ marginY: "10px" }}>
                                <InputLabel
                                  sx={{
                                    paddingBottom: "10px",
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Road Name, Street Name
                                </InputLabel>
                                <TextField
                                  size="small"
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Road Name, Street Name"
                                  sx={{ maxWidth: "100%" }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "25px",
                                      maxWidth: "100%",
                                      height: "45px",
                                    },
                                  }}
                                  name="addressLine2"
                                  value={values.addressLine2}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.addressLine2 && touched.addressLine2 ? (
                                  <Typography
                                    variant="caption"
                                    color={"red"}
                                    className="form-error"
                                  >
                                    {errors.addressLine2}
                                  </Typography>
                                ) : null}
                              </Box>
                              <Box sx={{ marginY: "10px" }}>
                                <InputLabel
                                  sx={{
                                    paddingBottom: "10px",
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Near Landmark
                                </InputLabel>
                                <TextField
                                  size="small"
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Near Landmark"
                                  sx={{ maxWidth: "100%" }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "25px",
                                      maxWidth: "100%",
                                      height: "45px",
                                    },
                                  }}
                                  name="landmark"
                                  value={values.landmark}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.landmark && touched.landmark ? (
                                  <Typography
                                    variant="caption"
                                    color={"red"}
                                    className="form-error"
                                  >
                                    {errors.landmark}
                                  </Typography>
                                ) : null}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "left",
                                }}
                              >
                                <Checkbox
                                  name="default"
                                  value={values.default}
                                  onClick={handleChange}
                                  onBlur={handleBlur}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#212121",
                                  }}
                                >
                                  Mark as default address
                                </Typography>
                              </Box>
                            </form>
                          </Grid>
                        </Grid>
                      </Box>
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
                            marginRight: "40px",
                          }}
                          type="submit"
                          onClick={updateAddress}
                        >
                          update Address
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            paddingX: "30px",
                            borderRadius: "25px",
                            backgroundColor: "#2B376E",
                            marginBottom: "20px",
                            marginRight: "40px",
                            width: "207px",
                            height: "45px",

                            padding: "0px, 16px, 0px, 16px",

                            gap: "16px",
                          }}
                          type="submit"
                        >
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontWeight: 600,

                              letterSpacing: "0px",
                              textAlign: "center",
                              color: "#FFFFFF",
                            }}
                          >
                            Save Address
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </div>
            </Grid>
          </form>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
