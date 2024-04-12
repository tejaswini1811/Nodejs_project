"use client";
import * as React from "react";
import styled from "@emotion/styled";
import "src/app/global.css";
import {
  Breadcrumbs,
  Paper,
  TextField,
  Theme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import Fade from "@mui/material/Fade";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import { buyleads } from "../../db";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { usePathname } from "next/navigation";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Popover from "@mui/material/Popover";
import Image from "next/image";
import notfound from "@/img/notfound.png";
import createAxiosInstance from "@/app/axiosInstance";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { CircularProgress } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { buyLeadsType } from "@/types/types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Card, FormControl } from "@mui/material";
import Slider from "@mui/material/Slider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useAppselector } from "@/redux/store";
import useMediaQuery from "@mui/material/useMediaQuery";

function formatDate(dateString: string) {
  // Define the type for options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Date(dateString).toLocaleString("en-US", options);

  // Replace slashes with hyphens
  return formattedDate.replace(/\//g, "-");
}
interface Data {
  city: string;
  _id: number;
}

interface catalogueType {
  _id: string;
  catalogUniqueId: string;
  icon: string;
  isActive: true;
  name: string;
}

export default function Buyleads() {
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange1, setPriceRange1] = useState({ min: 0, max: 10000000 });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState<Data[]>([]);
  const [catalogueData, setCatalogueData] = useState<catalogueType[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [count, setCount] = useState<Number>(12);
  const [lowestPrice, setLowestPrice] = useState<Number>(0);
  const [highestPrice, sethighestPrice] = useState<Number>(0);
  const [location, setLocation] = useState<String>("");
  // const [BusinessId, setBusinessId] = useState<String>(
  //   "652fc694630a7ea852dec793"
  // );
  const [searchValue, setsearchValue] = useState<String>("");
  const [catalogId, setcatalogId] = useState<String | null>("");
  const [sortBy, setsortBy] = useState<String>("Newest");
  const [filterApplied, setFilterApplied] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("reset");
  const [buyleads, setBuyLeads] = useState<buyLeadsType[]>([]);
  const [value, setValue] = React.useState(0);
  const [selectedCatalog, setSelectedCatalog] = useState("");
  const [open2, setOpen2] = React.useState(false);
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const pathname = usePathname();

  let BusinessId = defaultBusinessId;

  const handlePagesChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
  };

  const [anchorEl3, setAnchorEl3] = React.useState<null | HTMLElement>(null);
  const open3 = Boolean(anchorEl3);

  const handlePriceChange = (priceRange: string = "reset") => {
    setSelectedPriceRange(priceRange);
  };

  function handlePageNumber(value: number) {
    if (buyleads.length === 0 && value > 0) {
      return;
    }
    if (value === 0 || (pageNumber <= 1 && value < 0)) {
      setPageNumber(1);
    } else {
      setPageNumber((prevValue: number) => prevValue + value);
    }
  }
  // console.log("pageNumber: ", pageNumber);

  const handleSortBy = (SortBy: string) => {
    setsortBy(SortBy);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log(catalogId);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClearFilters = () => {
    setPageNumber(1);
    setCount(12);
    setLowestPrice(0);
    sethighestPrice(0);
    setLocation("");
    setsearchValue("");
    setcatalogId("");
    setsortBy("Newest");
    handlePriceChange("reset");
    setSelectedCatalog("");
  };

  const fetchBuyLeads = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      // Construct query parameters dynamically
      const params = {
        pageNumber,
        count,
        lowestPrice,
        highestPrice,
        location,
        businessId: BusinessId,
        catalogId,
        searchValue,
        sortBy,
      };

      // Filter out empty parameters
      const filteredParams: Record<string, string> = Object.entries(params)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const queryString = Object.keys(filteredParams)
        .map((key) => key + "=" + encodeURIComponent(filteredParams[key]))
        .join("&");

      const url = `rfq/buy_leads/list?${queryString}`;

      const response = await axiosInstance.get(url);

      const newData = await response.data.data;
      setBuyLeads(newData);
      setLoading(false);
    } catch (error: any) {
      console.log("error occured");
      setLoading(false);
    }
  };

  const fetchCity = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`/marketnearby/city`);
      const newData = await response.data.data;
      setCityData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchCatalogue() {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `productCatalog/catalogs_list?seeAll=true`
      );

      const responseData = await response.data.data;
      setCatalogueData(responseData);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBuyLeads();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (filterApplied || clearFilter || pageNumber) {
      fetchBuyLeads();
      setFilterApplied(false);
      setClearFilter(false);
    } // eslint-disable-next-line
  }, [filterApplied, clearFilter, pageNumber]);

  useEffect(() => {
    fetchCity();
    fetchCatalogue();
  }, []);

  const handleCatalogIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newcatalogId = event.target.value;
    setsearchValue(newcatalogId);

    if (newcatalogId.trim() !== "" || clearFilter) {
      setClearFilter(false);
      fetchBuyLeads();
    }
  };

  const sendRequestIfEmptyCatalogId = () => {
    if (catalogId?.trim() === "") {
      fetchBuyLeads(); // Fetch all data when the input is empty
    }
  };

  const handleHover = {
    color: "#fff",
  };

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


  // console.log("location: ", location);

  function truncateWords(str : any, numWords:any) {
    const words = str.split(' ');
    if (words.length > numWords) {
      return words.slice(0, numWords).join(' ') + '...';
    } else {
      return str;
    }
  }

  return (
    <>
      <Grid
        container
        spacing={6}
        mb={2}
        sx={{
          width: "100%",
          margin: "0px",
          padding: "0px",
          position: "relative",
        }}
      >
        <Grid
          className="waste"
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            marginTop: "0px !important",
            padding: "0px 15px !important",
            marginBottom: "15px",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              marginY: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              ...(isMobile && {
                flexDirection: "column",
              }),
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
            <Box sx={{ gap: "20px", display: "flex" }}>
              {/* SEARCH BOX */}
              <Box sx={{ width: "60%" }}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Buy leads looking for"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            width: "100%",
                            height: 21,
                            padding: "2.83px, 2.84px, 2.84px, 2.83px",
                            color: "#BFC8D6",
                          }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "25px",
                      width: "100%",
                      height: 45,

                      padding: "7px, 10.5px, 7px, 13px",
                      borderColor: "#CBD5E1",
                      backgroundColor: "#FFFFFF",
                    },
                  }}
                  value={searchValue}
                  onChange={handleCatalogIdChange}
                  onKeyUp={sendRequestIfEmptyCatalogId}
                />
              </Box>
              {/* SEARCH BOX END */}

              <Box sx={{ width: "40%" }}>
                <Button
                  variant="contained"
                  id="fade-button"
                  aria-controls={open3 ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open3 ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    backgroundColor: "#2B376E",
                    width: 125,
                    height: 45,
                    boxShadow: "none",
                    padding: "5px, 15px, 5px, 15px",
                    borderRadius: 25,
                    border: 1,

                    textTransform: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FilterAltOutlinedIcon
                      sx={{ color: "white", marginRight: "3px" }}
                    />{" "}
                    <Typography
                      sx={{
                        fontFamily: "Source Sans 3",
                        fontSize: 15,
                        fontWeight: 500,

                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#FFFFFF",
                      }}
                    >
                      Filter
                    </Typography>
                  </Box>
                </Button>

                <Popover
                  className="bullitin-filter buylead-filter"
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  // anchorOrigin={{
                  //   vertical: "bottom",
                  //   horizontal: "right",
                  // }}
                >
                  <Box sx={{ width: "auto", padding: "20px", height: "350px" }}>
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        mb: "20px",
                      }}
                    >
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        <Box sx={{ marginY: "10px" }}>
                          <Autocomplete
                            disablePortal
                            disableClearable={true}
                            id="combo-box-demo"
                            openText="Открыть"
                            options={catalogueData.map((option) => ({
                              id: option._id,
                              label: option.name,
                            }))}
                            getOptionLabel={(option) => option.label}
                            onChange={(e, value) => {
                              setcatalogId(value ? value.id : null);
                              setSelectedCatalog(value ? value.label : "");
                            }}
                            value={
                              selectedCatalog
                                ? {
                                    id: catalogId || "",
                                    label: selectedCatalog,
                                  }
                                : undefined
                            }
                            sx={{
                              width: 300,
                              height: "45px",
                              fieldset: {
                                borderRadius: "25px",
                                padding: "7px 10.5px 7px 15px",
                                border: 1,
                                borderColor: "#CBD5E1",
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                placeholder="Choose Catalogue Directory"
                                {...params}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </Box>
                      )}
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
                        }}
                      >
                        Price
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
                            setLowestPrice(0);
                            sethighestPrice(100000000);
                            handlePriceChange("reset");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "97px",
                            height: "35px",
                            textTransform: "none",
                            backgroundColor:
                              selectedPriceRange === "reset"
                                ? "#2B376E"
                                : "initial",
                            color:
                              selectedPriceRange === "reset"
                                ? "#FFFFFF"
                                : "initial",
                          }}
                        >
                          All Prices
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            setLowestPrice(0);
                            sethighestPrice(500);
                            handlePriceChange("under10000");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "130px",
                            height: "35px",
                            padding: "6px 14px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              selectedPriceRange === "under10000"
                                ? "#2B376E"
                                : "initial",
                            color:
                              selectedPriceRange === "under10000"
                                ? "#FFFFFF"
                                : "initial",
                          }}
                        >
                          Under ₹10000
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            setLowestPrice(501);
                            sethighestPrice(1500);
                            handlePriceChange("10000to15000");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "155px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              selectedPriceRange === "10000to15000"
                                ? "#2B376E"
                                : "initial",
                            color:
                              selectedPriceRange === "10000to15000"
                                ? "#FFFFFF"
                                : "initial",
                          }}
                        >
                          ₹10000 - ₹15000
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            setLowestPrice(1501);
                            sethighestPrice(100000000);
                            handlePriceChange("over15000");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "130px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              selectedPriceRange === "over15000"
                                ? "#2B376E"
                                : "initial",
                            color:
                              selectedPriceRange === "over15000"
                                ? "#FFFFFF"
                                : "initial",
                          }}
                        >
                          Over 15000
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
                        Sort By
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          marginY: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            handleSortBy("Newest");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "85px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              sortBy === "Newest" ? "#2B376E" : "initial",
                            color: sortBy === "Newest" ? "#FFFFFF" : "initial",
                          }}
                        >
                          Newest
                        </Button>

                        <Button
                          variant="contained"
                          onClick={(e) => {
                            handleSortBy("PriceAsc");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "155px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              sortBy === "PriceAsc" ? "#2B376E" : "initial",
                            color:
                              sortBy === "PriceAsc" ? "#FFFFFF" : "initial",
                          }}
                        >
                          Price: Low to High
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            handleSortBy("PriceDsc");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "155px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              sortBy === "PriceDsc" ? "#2B376E" : "initial",
                            color:
                              sortBy === "PriceDsc" ? "#FFFFFF" : "initial",
                          }}
                        >
                          Price: High to Low
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          marginY: "10px",
                          gap: "10px",
                          marginLeft: "93px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            handleSortBy("NameAsc");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "130px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              sortBy === "NameAsc" ? "#2B376E" : "initial",
                            color: sortBy === "NameAsc" ? "#FFFFFF" : "initial",
                          }}
                        >
                          Name:A to Z
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            handleSortBy("NameDsc");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "130px",
                            height: "35px",
                            textTransform: "none",
                            "&:hover": handleHover,
                            backgroundColor:
                              sortBy === "NameDsc" ? "#2B376E" : "initial",
                            color: sortBy === "NameDsc" ? "#FFFFFF" : "initial",
                          }}
                        >
                          Name: Z to A
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
                                textTransform: "none",
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
            </Box>
          </Box>
        </Grid>
      </Grid>
      <PageContainer>
        <DashboardCard>
          <>
            <Grid
              container
              spacing={2}
              sx={{
                height: "auto",
                overflow: "auto",
                // maxHeight: "80vh",
                paddingBottom: "25px",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                    width: "90%",
                    mx: "auto",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : buyleads.length > 0 ? (
                buyleads.map((item: buyLeadsType) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    key={item._id}
                    sx={{
                    ...(isSmallMobiles && { width: "100%", gap: "15px" }),
                    ...(isBigMobiles && { width: "48.5%" }),
                    ...(isTablets && { width: "48.5%" }),
                    ...(isLaptops && { width: "31.5%" }),
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        backgroundColor: "#f0f5f9",
                        borderRadius: "12px",
                        ...(isMobile && { minHeight: "200px" }),
                        ...(isTablets && { minHeight: "230px" }),
                      }}
                    >
                      <Box>
                        <Box sx={{ padding: "20px" }}>
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
                                fontSize: 16,
                                fontWeight: 700,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#2B376E",
                                marginBottom: "10px",
                              }}
                            >
                               {truncateWords(item.headingName, 4)}
                            </Typography>
                          </Box>
                          <Divider sx={{ color: "#CBD5E1" }} />
                          <Box
                            sx={{
                              display: "flex",
                              gap: "3px",
                              marginY: "10px",
                            }}
                          >
                            <PlaceOutlinedIcon
                              sx={{
                                width: 31,
                                height: 31,
                                color: "#fff",
                                borderRadius: "23px",
                                padding: "6px",
                                background: "#5c934c",
                                marginRight: "2px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,

                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              {item.location &&
                              typeof item.location === "string"
                                ? item.location
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
                                            const withoutDivision = trimmedPart
                                              .replace(/\bDivision\b/i, "")
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
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              marginTop: "15px",
                            }}
                          >
                            <Grid container spacing={0}>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  Expected Price{" "}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "1px",
                                  }}
                                >
                                  {" "}
                                  : ₹  {truncateWords(item.expectedPrice, 1)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                    marginBottom: "12px",
                                  }}
                                >
                                  Requirment Quantity{" "}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: 14,
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  {" "}
                                  : {item.requiredQuantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sx={{ textAlign: "left" }}>
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
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Grid>
                            </Grid>
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
            {loading ? (
              <Box></Box>
            ) : (
              <Grid item xs={12}>
                <Box sx={{ bottom: 40 }}>
                  <Stack spacing={2}>
                    <Pagination
                      count={10}
                      page={pageNumber}
                      onChange={handlePagesChange}
                      sx={{ display: "flex", justifyContent: "center" }}
                    />
                  </Stack>
                </Box>
              </Grid>
            )}
            <Dialog
              open={open2}
              onClose={handleClose2}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="md"
              fullWidth={true}
              sx={{
                "& .MuiDialog-paper": {
                  borderRadius: "20px",
                },
              }}
            >
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                      sx={{ maxHeight: "100%" }}
                    >
                      <Typography
                        sx={{
                          fontSize: "22px",
                          color: "#2B305C",
                          p: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Create Quote
                      </Typography>
                      <Button
                        onClick={handleClose2}
                        size="small"
                        sx={{ minWidth: "0px" }}
                      >
                        <CloseRoundedIcon
                          sx={{
                            marginLeft: "auto",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "1px solid #2B305C",
                            color: "##2B305C",
                            minWidth: "0px",
                          }}
                        />
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Card
                      sx={{
                        backgroundColor: "#FFFFFF",
                        padding: "19px",
                        borderRadius: "20px",
                      }}
                    >
                      <Box display="flex" flexDirection="column">
                        <Typography>₹ 50/unit</Typography>
                        <Typography>Minimum Order: 40 unit</Typography>
                        <Typography>MUG</Typography>
                        <Box sx={{ display: "flex" }}>
                          <PlaceOutlinedIcon
                            sx={{ width: "14", height: "14", color: "#BFC8D6" }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 500,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",
                            }}
                          >
                            Up, Ghaziabad
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                    <Card
                      sx={{
                        padding: "19px",
                        backgroundColor: "#FFFFFF",
                        mt: "16.5px",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 500,
                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#000000",
                        }}
                      >
                        ID:RQ1699357815PL
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 700,
                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#2B376E",
                        }}
                      >
                        RFQ DETAILS
                      </Typography>
                      <Typography>NAME</Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          mt: "10px",
                        }}
                      >
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 400,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",
                              marginBottom: "1px",
                            }}
                          >
                            EXPECTED PRICE{" "}
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 500,
                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#000000",
                              marginBottom: "1px",
                            }}
                          >
                            {" "}
                            ₹ 10/piece
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 400,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",
                              marginBottom: "1px",
                            }}
                          >
                            REQUIRED QUANTITY{" "}
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 500,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#333542",

                              marginBottom: "1px",
                            }}
                          >
                            {" "}
                            1 piece
                          </Typography>
                        </Grid>
                      </Box>
                    </Card>
                    <Card
                      sx={{
                        padding: "19px",
                        backgroundColor: "#FFFFFF",
                        mt: "16.5px",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "16.5px",
                          fontWeight: 600,
                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#000000",
                        }}
                      >
                        DELIVERY ADDRESS
                      </Typography>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: 500,
                            letterSpacing: "0em",
                            textAlign: "left",
                            color: "#333542",
                          }}
                        >
                          Room No.4, Poddar Court, Gate No.2, 7th Floor, 18,
                          Rabindra Sarani,Kolkata – 700001
                        </Typography>
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "20px",
                        maxHeight: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        display={"flex"}
                        justifyContent="start"
                        alignItems="start"
                      >
                        <FormControl>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                            }}
                          >
                            Quantity
                          </Typography>
                          <TextField
                            name="firstName"
                            placeholder="Enter Quantity"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 330,
                                height: 30,
                                backgroundColor: "#FFFFFF",
                                color: "#64758B",

                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </FormControl>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent="start"
                        alignItems="start"
                      >
                        <FormControl>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "5px",
                            }}
                          >
                            Unit of Measurement
                          </Typography>
                          <TextField
                            select
                            // label="Choose Unit of Measurement"
                            variant="outlined"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 330,
                                height: 30,
                                backgroundColor: "#FFFFFF",
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          >
                            <MenuItem value="option1">Option 1</MenuItem>
                            <MenuItem value="option2">Option 2</MenuItem>
                            <MenuItem value="option3">Option 3</MenuItem>
                          </TextField>
                        </FormControl>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent="start"
                        alignItems="start"
                      >
                        <FormControl>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "10px",
                            }}
                          >
                            Unit Price
                          </Typography>
                          <TextField
                            name="firstName"
                            placeholder="Enter Unit Price"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 330,
                                height: 30,
                                backgroundColor: "#FFFFFF",
                                color: "#64758B",

                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </FormControl>
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent="start"
                        alignItems="start"
                      >
                        <Typography sx={{ mt: "5px" }}>
                          Delivery Date
                        </Typography>
                        <Slider
                          size="small"
                          defaultValue={20}
                          aria-label="Small"
                          valueLabelDisplay="auto"
                          step={1}
                          min={0}
                          max={20}
                          sx={{ width: 330 }}
                        />
                      </Box>

                      <Box
                        display={"flex"}
                        justifyContent="start"
                        alignItems="start"
                      >
                        <FormControl>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#333542",
                              my: "5px",
                            }}
                          >
                            Contact Person
                          </Typography>
                          <TextField
                            select
                            // label="Choose Unit of Measurement"
                            variant="outlined"
                            InputProps={{
                              sx: {
                                borderRadius: 25,
                                width: 330,
                                height: 30,
                                backgroundColor: "#FFFFFF",
                                color: "#64758B",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 400,
                              },
                            }}
                          >
                            <MenuItem value="option1">Mayank</MenuItem>
                            <MenuItem value="option2">Suresh</MenuItem>
                            <MenuItem value="option3">Pawan</MenuItem>
                            <MenuItem value="option4">Sathish</MenuItem>
                          </TextField>
                        </FormControl>
                      </Box>
                      <FormControl>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#333542",
                            my: "5px",
                          }}
                        >
                          Additional Note
                        </Typography>
                        <TextField
                          InputProps={{
                            sx: {
                              width: 330,
                              height: 45,
                              color: "#64758B",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "flex-start",
                            },
                          }}
                          name="description"
                          placeholder="Additional Note"
                        />
                      </FormControl>

                      <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                          width: "330px",
                          height: "30px",
                          padding: "0px, 16px, 0px, 16px",
                          borderRadius: "25px",
                          gap: "16px",
                          backgroundColor: "#2B376E",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 600,
                          letterSpacing: "0px",
                          textAlign: "center",
                          color: "#FFFFFF",
                          mt: "9px",
                        }}
                      >
                        SUBMIT QUOTE
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
