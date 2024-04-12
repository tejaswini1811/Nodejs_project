"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
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
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { bulletin, catalogue } from "../../db";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import Popover from "@mui/material/Popover";
import { usePathname } from "next/navigation";
import notfound from "@/img/notfound.png";
import Image from "next/image";
import createAxiosInstance from "@/app/axiosInstance";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { CircularProgress } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { rfqType, quoteTypes, catalogType } from "@/types/types";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useAppselector } from "@/redux/store";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import useMediaQuery from "@mui/material/useMediaQuery";

function formatDate(dateString: string | undefined | null): string {
  if (dateString && typeof dateString === "string") {
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = match[1];
      const month = match[2];
      const day = match[3];
      return `${day}-${month}-${year}`;
    }
  }
  return ""; // Return an empty string if the regex doesn't match or dateString is invalid
}

interface Data {
  city: string;
  _id: number;
}

interface options {
  id: string;
  label: string;
}

interface catalogueType {
  _id: string;
  catalogUniqueId: string;
  icon: string;
  isActive: true;
  name: string;
}

export default function Bulettin() {
  const [listRfq, setListRfq] = useState<rfqType[]>([]);
  const [listQuote, setListQuote] = useState<quoteTypes[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState<Data[]>([]);
  const [catalogueData, setCatalogueData] = useState<catalogType[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [count, setCount] = useState<number>(12);
  const [lowestPrice, setLowestPrice] = useState<number | undefined>(undefined);
  const [highestPrice, sethighestPrice] = useState<number | undefined>(
    undefined
  );
  const [location, setLocation] = useState<String>("");
  // const [BusinessId, setBusinessId] = useState<String>(
  //   "652fc694630a7ea852dec793"
  // );
  const [searchValue, setsearchValue] = useState<String>("");
  const [catalogId, setcatalogId] = useState<String | null>("");
  const [sortBy, setsortBy] = useState<String>("Newest");
  const [filterApplied, setFilterApplied] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("reset");
  const [selectedCatalog, setSelectedCatalog] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const pathname = usePathname();
  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const BusinessId = defaultBusinessId;
  // console.log("businessID: ", BusinessId);
  const handlePagesChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
  };

  type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
  };

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handlePriceChange = (priceRange: string = "reset") => {
    setSelectedPriceRange(priceRange);
  };

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

  function handlePageNumber(value: number) {
    if (itemsToMap.length === 0 && value > 0) {
      return;
    }
    if (value === 0 || (pageNumber <= 1 && value < 0)) {
      setPageNumber(1);
    } else {
      setPageNumber((prevValue: number) => prevValue + value);
    }
  }
  // console.log("pageNumber: ", pageNumber);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClearFilters = () => {
    setPageNumber(1);
    setLowestPrice(0);
    sethighestPrice(0);
    setLocation("");
    setsearchValue("");
    setcatalogId("");
    setsortBy("Newest");
    handlePriceChange("reset");
    setCount(12);
    setSelectedCatalog("");
    setSelectedLocation("");
  };

  const fetchRfq = async () => {
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

      const filteredParams: Record<string, string> = Object.entries(params)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const queryString = Object.keys(filteredParams)
        .map((key) => key + "=" + encodeURIComponent(filteredParams[key]))
        .join("&");

      const url = `bulletinBoard/rfq_list?${queryString}`;

      const response = await axiosInstance.get(url);

      const newData = await response.data.data;

      setListRfq(newData);

      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
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

      const url = `bulletinBoard/quote_list?${queryString}`;

      const response = await axiosInstance.get(url);

      const newData = await response.data.data;
      setListQuote(newData);
      // setListQuote(newData);
      setLoading(false);
    } catch (error) {
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

  const fetchCatalogue = async () => {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `/productCatalog/catalogs_list?seeAll=true`
      );

      const newData = response.data.data;

      setCatalogueData(newData);

      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleClearFilters();
    fetchRfq();
    fetchQuote(); //eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleClearFilters();

    fetchQuote();
    //eslint-disable-next-line
  }, [checked]);

  useEffect(() => {
    if (filterApplied || clearFilter) {
      fetchRfq();
      fetchQuote();
      setFilterApplied(false);
      setClearFilter(false);
    } //eslint-disable-next-line
  }, [filterApplied, clearFilter]);

  useEffect(() => {
    fetchCity();
    fetchCatalogue();
  }, []);

  useEffect(() => {
    if (pageNumber > 0) {
      fetchRfq();
      fetchQuote();
    } //eslint-disable-next-line
  }, [pageNumber]);

  // This effect will run whenever `pageNumber` changes and is greater than 0.

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setsearchValue(newValue);

    if (newValue.trim() !== "" || clearFilter) {
      setClearFilter(false);
      fetchRfq(); // Fetch all data when the input is empty
      fetchQuote();
    }
  };

  const sendRequestIfEmptyCatalogId = () => {
    if (!catalogId || catalogId.trim() === "") {
      fetchRfq(); // Fetch all data when the input is empty
      fetchQuote(); // Fetch all data when the input is empty
    }
  };

  const itemsToMap = checked ? listQuote : listRfq;
  const defaultSelect: any = {
    id: "000111",
    label: "All India",
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

  return (
    <Grid
      container
      spacing={2}
      sx={{
        paddingX: "0px",
        width: "100%",
        marginTop: "0px",
        marginLeft: "0px",
      }}
    >
      <Grid
        container
        spacing={6}
        mb={2}
        sx={{
          paddingX: "0px",
          width: "100%",
          marginTop: "0px",
          marginLeft: "0px",
        }}
      >
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            paddingTop: "0px !important",
            paddingLeft: "0px !important",
            ...(isMobile && {
              flexDirection: "column",
              paddingBottom: "10px",
            }),
            ...(isTablets && {
              flexDirection: "column",
              paddingBottom: "10px",
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

          <Stack
            spacing={1}
            direction={"row"}
            sx={{ ...(isMobile && { width: "100% !important" }) }}
          >
            <Box
              sx={{
                gap: "20px",
                display: "flex",
                ...(isMobile && {
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
                  gap: "10px",
                }),
              }}
            >
              <Box
                sx={{
                  marginRight: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(isMobile && {
                    marginRight: "0px",
                    width: "100%",
                    textAlign: "center",
                  }),
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: "0em",
                    textAlign: "left",
                    color: "#64758B",
                  }}
                >
                  RFQs
                </Typography>
                <Switch
                  size="medium"
                  checked={checked}
                  onClick={() => {
                    handleChange();
                    setClearFilter(true);
                    handleClearFilters();
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 400,

                    letterSpacing: "0em",
                    textAlign: "left",
                    color: "#64758B",
                  }}
                >
                  Quote List
                </Typography>
              </Box>

              {/* SEARCH BOX */}
              <Box sx={{ ...(isMobile && { width: "46%" }) }}>
                <Box>
                  <TextField
                    size="small"
                    variant="outlined"
                    placeholder="What you looking for"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{
                              width: 21,
                              height: 21,
                              padding: "2.83px, 2.84px, 2.84px, 2.83px",
                              color: "#BFC8D6",
                            }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "25px",
                        width: 255,
                        height: 45,

                        padding: "7px, 10.5px, 7px, 13px",
                        borderColor: "#CBD5E1",
                        backgroundColor: "#FFFFFF",
                        ...(isMobile && {
                          width: "100%",
                        }),
                      },
                    }}
                    value={searchValue}
                    onChange={handleValueChange}
                    onKeyUp={sendRequestIfEmptyCatalogId}
                  />
                </Box>
              </Box>

              {/* SEARCH BOX END */}

              <Box
                sx={{ ...(isMobile && { width: "46%", textAlign: "right" }) }}
              >
                <Button
                  variant="contained"
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
                  className="bullitin-filter"
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box sx={{ width: "auto", padding: "20px" }}>
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

                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        <Box sx={{ marginY: "10px" }}>
                          <Autocomplete
                            multiple={false}
                            disablePortal
                            id="combo-box-demo"
                            options={cityData.map((option: any) => ({
                              id: option._id,
                              label: option.city,
                            }))}
                            getOptionLabel={(option) => option.label}
                            onInputChange={(event, newValue) => {
                              if (!newValue) {
                                setClearFilter(true); // Set handleClearFilter to true when the value is cleared
                              }
                              setLocation(newValue); // Set the selected city when the input changes
                            }}
                            onChange={(e, value: any) => {
                              setLocation(value ? value.label : null); // Update catalogId if a value is selected
                              setSelectedLocation(value ? value.label : ""); // Update selectedCatalog if a value is selected
                            }}
                            // value={selectedLocation ? { label: selectedLocation } : null}
                            defaultValue={defaultSelect}
                            sx={{
                              width: 200,
                              fieldset: {
                                borderRadius: "25px",
                                height: "60px",
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                placeholder="Search by location"
                                {...params}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                label="Search by location"
                                sx={{
                                  borderRadius: "25px",
                                  width: 200,
                                  height: 40,

                                  padding: "7px, 10.5px, 7px, 13px",
                                  borderColor: "#CBD5E1",
                                  backgroundColor: "#FFFFFF",
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
                            sethighestPrice(10000);
                            handlePriceChange("under10000");
                          }}
                          sx={{
                            borderRadius: "25px",
                            width: "130px",
                            height: "35px",
                            padding: "5px 11px",
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
                            setLowestPrice(10000);
                            sethighestPrice(15000);
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
                            setLowestPrice(15001);
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
                            height: "35px",
                            width: "85px",
                            textTransform: "none",
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
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: 16,
                              fontWeight: 600,

                              letterSpacing: "0px",
                              textAlign: "center",
                              color: "#FFFFFF",
                            }}
                          >
                            Apply Filter
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Popover>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <PageContainer>
        <DashboardCard>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2vw" }}>
            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                  width: "100%",
                  mx: "auto",
                }}
              >
                <CircularProgress />
              </Box>
            ) : itemsToMap.length > 0 ? (
              itemsToMap.map((item: rfqType) => (
                <Box
                  key={item._id}
                  sx={{
                    width: "22.5%",
                    ...(isSmallMobiles && { width: "100%", gap: "15px" }),
                    ...(isBigMobiles && { width: "48.5%" }),
                    ...(isTablets && { width: "48.5%" }),
                    ...(isLaptops && { width: "31.5%" }),
                  }}
                >
                  <Card
                    sx={{
                      background: "#f0f5f9",
                      ...(isSmallMobiles && { marginBottom: "10px" }),
                    }}
                  >
                    <CardContent>
                      <Box sx={{ padding: "15px" }}>
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
                            {item.productName}
                          </Typography>
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
                        </Box>
                        <Divider sx={{ color: "#CBD5E1" }} />
                        <Box
                          sx={{
                            display: "flex",
                            gap: "3px",
                            marginY: "10px",
                            alignItems: "center",
                          }}
                        >
                          <PlaceOutlinedIcon
                            sx={{
                              width: "31px",
                              height: "31px",
                              color: "#fff",
                              padding: "6px",
                              backgroundColor: "#5c934c",
                              borderRadius: "23px",
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
                              height: "5.1vh",// Fixed height for the address container
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                            }}
                          >
                            {item.location && typeof item.location === "string"
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
                            marginTop: "20px",
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
                                : ₹ {item.expectedPrice}
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
                                  marginBottom: "1px",
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

                                  marginBottom: "1px",
                                }}
                              >
                                {" "}
                                : {item.requiredQuantity}
                              </Typography>
                            </Grid>
                            {checked && (
                              <>
                                <Grid item xs={6} sx={{ textAlign: "left" }}>
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontSize: 14,
                                      fontWeight: 600,

                                      letterSpacing: "0em",
                                      textAlign: "left",
                                      color: "#333542",
                                    }}
                                  >
                                    Delivery Time
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
                                    : {item.deliveryTime} days
                                  </Typography>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>
                      </Box>
                    </CardContent>
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
                <Image
                  src={notfound}
                  alt="Not Found"
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            )}

            <Grid item xs={12}>
             
                <Grid item xs={12}>
                  <Pagination
                    count={10}
                    page={pageNumber}
                    onChange={handlePagesChange}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  />
                </Grid>
            

              {/* <Grid
              item
              xs={12}
              sx={{
                textAlign: "end",
                display: "flex",
                justifyContent: "flex-end",
                position: "fixed",
                bottom: 0,
                right: 0,
                marginRight: "5%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#212121",
                  pb: "30px",
                }}
              >
                Copyright © 2023 Agri Reach. All Rights Reserved
              </Typography>
            </Grid> */}
            </Grid>
          </Box>
        </DashboardCard>
      </PageContainer>
    </Grid>
  );
}
