"use client";
import react from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link";
import createAxiosInstance from "@/app/axiosInstance";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/navigation";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import notfound from "../../../img/notfound.png";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import useMediaQuery from "@mui/material/useMediaQuery";
import "@/app/global.css";

export default function Businesspage() {
  const [open, setOpen] = useState<boolean>(false);
  const [businessData, setBusinessData] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [gst, setGst] = useState<string>("");
  const [sortBy, setsortBy] = useState<string>("");
  const [searchValue, setsearchValue] = useState<String>("");
  const [filterBy, setfilter] = useState<string>("");
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  //popover starts

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const open2 = Boolean(anchorEl);
  const id2 = open2 ? "simple-popover" : undefined;

  const open1 = Boolean(anchorEl);
  const id = open1 ? "simple-popover" : undefined;

  //popover ends

  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearFilters = () => {
    setfilter("");
    setsearchValue("");
    setsortBy("");
  };

  const fetchBusiness = async () => {
    try {
      const createInstance = createAxiosInstance();
      // Construct query parameters dynamically
      const params = {
        searchValue,
        filterBy,
        sortBy,
      };

      const filteredParams: Record<string, string> = Object.entries(params)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const queryString = Object.keys(filteredParams)
        .map((key) => key + "=" + encodeURIComponent(filteredParams[key]))
        .join("&");

      const url = `business/all_business?${queryString}`;

      const response = await createInstance.get(url);

      const newData = await response.data.data;

      setBusinessData(newData);
      setLoader(false);
      // console.log(businessData);
      // console.log(response.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
      setLoader(false);
    }
  };

  const businessDelete = async (id: string) => {
    // console.log("deleteId:", id);
    try {
      const createInstance = createAxiosInstance();

      const response = await createInstance.delete(`business/delete/${id}`);

      fetchBusiness();
      toast.success("business Deleted Successfully");
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const businessStatus = async (id: string, value: boolean) => {
    // console.log("deactivate Id:", id);
    try {
      const createInstance = createAxiosInstance();

      await createInstance.put(`business/update_business_status/${id}`, {
        isActive: value,
      });

      fetchBusiness();
      toast.success(
        `business ${value ? "Activated" : "Deactivated"} Successfully`
      );
    } catch (error) {
      toast.error(
        `An error occurred while ${
          status ? "Activated" : "Deactivated"
        }  the business`
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/mybusinesses/business?id=${id}`);
  };

  useEffect(() => {
    fetchBusiness();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (filterApplied || clearFilter || location) {
      fetchBusiness();
      setFilterApplied(false);
      setClearFilter(false);
    } // eslint-disable-next-line
  }, [filterApplied, clearFilter]);
  useEffect(() => {
    handleClearFilters();
    fetchBusiness();
    // eslint-disable-next-line
  }, []);

  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProductName = event.target.value;
    setsearchValue(newProductName);

    if (newProductName.trim() !== "" || clearFilter) {
      setClearFilter(false);
      fetchBusiness();
    }
  };

  const sendRequestIfEmptyProductName = () => {
    if (searchValue.trim() === "") {
      fetchBusiness(); // Fetch all data when the input is empty
    }
  };

  const openDeactivateBusinessSwal = (id: string) => {
    Swal.fire({
      title: "Deactivate Business",
      text: "Do you really want to Deactivate this business?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result: any) => {
      if (result.isConfirmed) {
        businessStatus(id, false);
      }
    });
  };

  const openDeleteBusinessSwal = (id: string) => {
    Swal.fire({
      title: "Delete Businsess",
      text: "Do you really want to Delete the business?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result: any) => {
      if (result.isConfirmed) {
        businessDelete(id);
      }
    });
  };

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
        sx={{ marginX: "auto", marginTop: "0px", width: "100% !important" }}
      >
        <>
          <ToastContainer />
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
                  My Businesses
                </Typography>
              </Breadcrumbs>
            </Box>

            <Box
              className="buisnessmy"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "auto",
                gap: "20px",
                ...(isMobile && {
                  flexDirection: "row",
                  margin: "0px",
                  width: "100%",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                }),
                ...(isTablets && {
                  margin: "0 auto",
                  gap: "10px",
                }),
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: 227,
                  height: "45px",
                  backgroundColor: "#2B376E",
                  color: "#FFFFFF",
                  textTransform: "none",
                  padding: "0px, 16px, 0px, 16px",
                  borderRadius: 25,
                  gap: 16,

                  ...(isBigMobiles && { width: "auto" }),
                }}
                onClick={handleClickOpen}
              >
                Onboard Business
              </Button>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <Button
                  onClick={handleClose}
                  size="small"
                  sx={{ minWidth: "0px" }}
                >
                  <CloseRoundedIcon
                    sx={{
                      marginLeft: "auto",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      border: "2px solid #2B376E",
                      color: "#2B376E",
                      minWidth: "0px",
                    }}
                  />
                </Button>
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#2B305C",

                    letterSpacing: 0.5,
                  }}
                >
                  Onboard Business
                </DialogTitle>
                <DialogContent
                  sx={{
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#333542",

                    letterSpacing: "0em",
                  }}
                >
                  <DialogContentText id="alert-dialog-description">
                    You don&apos;t have an active business for the business
                    listing. Kindly onboard your business now and then try.
                  </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: "center" }}>
                  <Link href="/mybusinesses/business">
                    <Button
                      variant="contained"
                      sx={{
                        width: 220,
                        height: 45,
                        backgroundColor: "#2B376E",
                        textTransform: "none",

                        padding: "0px, 16px, 0px, 16px",
                        borderRadius: 25,
                        gap: 16,
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,

                        letterSpacing: "0px",
                        textAlign: "center",
                        color: "#FFFFFF",
                      }}
                      onClick={handleClose}
                    >
                      Create a Business
                    </Button>
                  </Link>
                </DialogActions>
              </Dialog>

              <TextField
                InputProps={{
                  sx: {
                    borderRadius: 25,
                    width: 250,
                    height: 47,
                    color: "#64758B",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 400,
                    ...(isMobile && { width: "100%" }),
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchOutlinedIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                id="first-name-input"
                placeholder="Search my Business"
                aria-describedby="first-name-helper-text"
                onChange={handleProductNameChange}
                onKeyUp={sendRequestIfEmptyProductName}
              />
              <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                  width: 125,
                  height: 45,
                  boxShadow: "none",
                  padding: "5px, 15px, 5px, 15px",
                  borderRadius: 25,
                  border: 1,
                  backgroundColor: "#2B376E",
                  textTransform: "none",
                  ...(isMobile && { width: "46%" }),
                  ...(isBigMobiles && { width: "auto" }),
                }}
              >
                <FilterAltOutlinedIcon />
                Filter
              </Button>
              <Popover
                id={id2}
                open={open2}
                anchorEl={anchorEl}
                onClose={handleClose2}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box sx={{ width: "70vh", padding: "20px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 18,
                      fontWeight: 700,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#2B376E",
                      marginBottom: "10px",
                    }}
                  >
                    Filters
                  </Typography>
                  <Divider
                    sx={{
                      marginBottom: "10px",
                      width: 600,
                      top: 217,
                      left: 1326,
                      border: 1,
                      color: "#CBD5E1",
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,

                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#333542",
                        marginTop: "10px",
                      }}
                    >
                      Sort By
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        marginY: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setsortBy("newest");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            sortBy === "newest" ? "#2B376E" : "initial",
                          color: sortBy === "newest" ? "#FFFFFF" : "initial",
                        }}
                      >
                        Newest
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setsortBy("oldest");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            sortBy === "oldest" ? "#2B376E" : "initial",
                          color: sortBy === "oldest" ? "#FFFFFF" : "initial",
                        }}
                      >
                        Oldest
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setsortBy("nameAsc");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            sortBy === "nameAsc" ? "#2B376E" : "initial",
                          color: sortBy === "nameAsc" ? "#FFFFFF" : "initial",
                        }}
                      >
                        Name A to Z
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setsortBy("nameDsc");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            sortBy === "nameDsc" ? "#2B376E" : "initial",
                          color: sortBy === "nameDsc" ? "#FFFFFF" : "initial",
                        }}
                      >
                        Name Z to A
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,

                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#333542",
                        marginTop: "10px",
                      }}
                    >
                      FilterBy
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        marginY: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setfilter("Active");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            filterBy === "Active" ? "#2B376E" : "initial",
                          color: filterBy === "active" ? "#FFFFFF" : "initial",
                        }}
                      >
                        Active
                      </Button>

                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setfilter("Inactive");
                        }}
                        sx={{
                          borderRadius: "25px",
                          height: "35px",
                          width: "85px",
                          textTransform: "none",
                          backgroundColor:
                            filterBy === "Inactive" ? "#2B376E" : "initial",
                          color:
                            filterBy === "Inactive" ? "#FFFFFF" : "initial",
                        }}
                      >
                        In Active
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "30px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
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
                        <RefreshOutlinedIcon
                          sx={{
                            width: 24,
                            height: 24,

                            padding: "4px, 4px, 4px, 4px",
                            color: "#2B376E",
                          }}
                        />
                        <Button
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 16,
                            fontWeight: 600,

                            letterSpacing: "0em",
                            textAlign: "left",
                            color: "#2B376E",
                            textTransform: "none",
                          }}
                          variant="text"
                          onClick={() => {
                            setClearFilter(true);
                            handleClearFilters();
                          }}
                        >
                          {" "}
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontWeight: 600,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#2B376E",
                            }}
                          >
                            Clear Filter
                          </Typography>
                        </Button>
                      </Box>

                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          backgroundColor: "#2B376E",
                          textTransform: "none",
                          width: "174px",
                          height: "45px",
                          marginRight: "20px",
                        }}
                        onClick={() => setFilterApplied(true)}
                      >
                        Apply Filter
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </Grid>

          <PageContainer>
            <DashboardCard>
              <Box
                className="texter"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2vw",
                  width: "100%",
                }}
              >
                {loader ? (
                  <Box
                    sx={{
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // height: "70vh",
                      width: "100%",
                      mx: "auto",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : businessData.length > 0 ? (
                  businessData.map((item: any) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: "20px",
                        ...(isBigMobiles && { width: "48.5%" }),
                        ...(isTablets && { width: "48.5%" }),
                        ...(isLaptops && { width: "auto" }),
                        ...(isBiggerLaptops && { width: "auto" }),
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          background: "#f0f5f9",
                          ...(isBigMobiles && { width: "100%" }),
                          ...(isTablets && { width: "100%" }),
                          // ...(isLaptops && { width: "31%" }),
                          // ...(isBiggerLaptops && { width: "22%" }),
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "600" }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {item.displayName}
                            </Typography>
                            <Chip
                              label={item.isActive ? "Active" : "Inactive"}
                              color={item.isActive ? "primary" : "success"}
                              size="small"
                            />
                          </Box>
                          <Typography
                            sx={{ mb: 1.5, fontSize: "10px" }}
                            color="text.secondary"
                          >
                            <span style={{ color: "orangered" }}>
                              Year Of Establishment:{" "}
                            </span>{" "}
                            {item.dateOfIncorporation}
                          </Typography>
                          <Tooltip title={item.description}>
                            <Typography
                              variant="body2"
                              sx={{
                                cursor: "pointer",
                                width: "50px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Tooltip>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                          <Button
                            size="small"
                            onClick={() => openDeleteBusinessSwal(item._id)}
                          >
                            Delete
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleEdit(item._id)}
                          >
                            Edit
                          </Button>
                          {item.isActive == false ? (
                            <Button
                              size="small"
                              onClick={() => businessStatus(item._id, true)}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              onClick={() =>
                                openDeactivateBusinessSwal(item._id)
                              }
                            >
                              Deactivate
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Box>
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
              </Box>
            </DashboardCard>
          </PageContainer>
        </>
      </Grid>
    </>
  );
}
