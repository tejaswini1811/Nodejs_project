"use client";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Divider,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Breadcrumbs,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState, useEffect } from "react";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import notfound from "../../img/notfound.png";
import { rlisted } from "@/app/db";
import Popover from "@mui/material/Popover";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import createAxiosInstance from "@/app/axiosInstance";
import { CircularProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useSearchParams } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import VerticalShadesClosedOutlinedIcon from "@mui/icons-material/VerticalShadesClosedOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  useFormik,
} from "formik";
import _ from "lodash";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAppselector } from "@/redux/store";
import {
  addressType,
  catalogType,
  marketplaceType,
  rfqFormType,
} from "@/types/types";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import no_image from "@/img/No-image-found.jpg";
import { IconDiscountCheck } from "@tabler/icons-react";
interface Data {
  city: string | null;
  _id: number | null;
}

type listData = {
  _id: string;
  name: string;
  thumbnail: string;
  listingCatalog: string;
  business: string;
  attributes: [
    {
      basicDetails: [
        {
          id: string;
          name: string;
          fieldType: string;
          fieldKey: string;
          fieldDependendent: string;
          valueString: string;
          valueArray: [string];
          valueBoolean: boolean;
        }
      ];
      specificationDetails: [
        {
          id: string;
          name: string;
          fieldType: string;
          fieldKey: string;
          fieldDependendent: string;
          valueString: string;
          valueArray: [];
          valueBoolean: boolean;
        }
      ];
      additionalDetails: [
        {
          id: string;
          name: string;
          fieldType: string;
          fieldKey: string;
          fieldDependendent: string;
          valueString: string;
          valueArray: [];
          valueBoolean: boolean;
        }
      ];
    }
  ];
  ratings: number;
  ratingCount: number;
  enquiries: number;
  status: string;
  rejectReasons: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  seller: {
    _id: string;
    logo: string;
    displayName: string;
    description: string;
    address: string;
    gstFlag: false;
  };
};

enum Duration {
  LastSixMonths = "last 6 months",
  ThisYear = "this year",
  AnyTime = "any time",
}

export default function Marketplace() {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [cityData, setCityData] = useState<Data[]>([]);
  const [catalogueData, setCatalogueData] = useState<catalogType[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [count, setCount] = useState<number>(12);
  const [lowestPrice, setLowestPrice] = useState<number | undefined>(undefined);
  const [highestPrice, sethighestPrice] = useState<number | undefined>(
    undefined
  );
  const [selectedDuration, setSelectedDuration] = useState<Duration>(
    Duration.LastSixMonths
  );

  const [location, setLocation] = useState<String>("All India");
  const [loadingMarketPlace, setLoadingMarketPlace] = useState<boolean>(true);
  const [searchValue, setsearchValue] = useState<String>("");
  const [sortBy, setsortBy] = useState<string>("verifiedDate");
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("reset");
  const [marketPlace, setMarketPlace] = useState<marketplaceType[]>([]);
  const [ratingCount, setRatingCount] = useState<any>(0);
  const [productName, setProductName] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [autoSearchValue, setAutoSearchValue] = useState<boolean>(true);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [RFQData, setRFQData] = useState<any>();

  const [RFQLoader, setRFQLoader] = useState<boolean>(true);
  const [listData, setListData] = useState<any>([]);
  const [address, setAddress] = useState<any>([]);
  const [addressLoader, setAddressLoader] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const catalogueId = searchParams.get("catalogueId");

  const [open2, setOpen2] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { defaultBusinessId } = useAppselector((state) => state?.user.value);
  const BusinessId = defaultBusinessId;

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    Formik.resetForm();
  };

  const handlePagesChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageNumber(value);
  };

  const [catalogId, setcatalogId] = useState<string>(catalogueId || "");

  const pathname = usePathname();

  const handleSortBy = (SortBy: string, sortOrder: number) => {
    setsortBy(SortBy);
    setSortOrder(sortOrder);
  };

  const handlePriceChange = (priceRange: string = "reset") => {
    setSelectedPriceRange(priceRange);
  };

  const handleUnitChange = (unitRange: string = "") => {
    setUnit(unitRange);
  };

  const handleDurationChange = (duration: Duration) => {
    setSelectedDuration(duration);
  };

  // const handleRatingChange = (RatingRange: any = "reset") => {
  //   setRatingCount(ratingCount);
  // };

  // function handlePageNumber(value: number) {
  //   if (marketPlace.length === 0 && value > 0) {
  //     return;
  //   }
  //   if (value === 0 || (pageNumber <= 1 && value < 0)) {
  //     setPageNumber(1);
  //   } else {
  //     setPageNumber((prevValue: number) => prevValue + value);
  //   }
  // }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleNextPageClick = () => {
  //   setPageNumber((prevCount: any) => prevCount + 1);
  //   console.log("pagenumber: ", pageNumber);
  // };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClearFilters = () => {
    setAutoSearchValue(false);
    setPageNumber(1);
    setLowestPrice(0);
    sethighestPrice(0);
    setLocation("");
    setsearchValue("");
    setcatalogId("");
    setsortBy("verifiedDate");
    handlePriceChange("reset");
    setRatingCount(0);
    setSortOrder(-1);
    setProductName("");
    setUnit("");
    setSelectedCatalog("");
    setSelectedLocation("");
    setSelectedDuration(Duration.LastSixMonths);
  };

  async function fetchMarketPlace() {
    try {
      setLoadingMarketPlace(true);
      const axiosInstance = createAxiosInstance();

      // Construct query parameters dynamically
      const params = {
        pageNumber,
        count,
        sortOrder,
        ratingCount,
        lowestPrice,
        highestPrice,
        location,
        sortBy,
        catalogId,
        productName,
        unit,
        timeDuration: selectedDuration || undefined,
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

      const url = `businessListing/list?${queryString}`;

      const response = await axiosInstance.get(url);

      const newData = await response.data.data;

      setMarketPlace(newData);
      setLoadingMarketPlace(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");

      setLoading(false);
    }
  }

  const fetchCity = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`/marketnearby/city`);
      const newData = await response.data.data;
      setCityData(newData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchBusinessListDetails = async (id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(
        `businessListing/business_list?businessListId=${id}`
      );
      const newData = await response.data.data;
      setListData(newData);
      // console.log(listData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchRFQForm = async (id: string) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(
        `/rfq/rfq_form?bussinessListingId=${id}`
      );

      const newData = await response.data.data;
      console.log("**************", newData);
      setRFQData(newData);
      setRFQLoader(false);
    } catch (error) {
      console.log(error);
      setRFQLoader(false);
    }
  };

  const generateDynamicValidationSchema = (dynamicFields: any) => {
    const dynamicSchema: any = {};
    dynamicFields?.forEach((field: any) => {
      // if (field.fieldValidations && field.fieldValidations.isMandatory) {
      //   if (field.fieldKey === "optionalKey10") {
      //     dynamicSchema[field.fieldKey] = Yup.array().required(
      //       "Supply Region is required"
      //     );
      //   }
      //   if (field.fieldKey === "optionalKey5") {
      //     dynamicSchema[field.fieldKey] = Yup.array().required(
      //       "Nature of Business is required"
      //     );
      //   }
      //   else {
      dynamicSchema[field.fieldKey] = Yup.string().required(
        `${field.fieldLabel} is required`
      );
      // }
      // }
    });

    return dynamicSchema;
  };

  const dynamicValidationSchemaBasic: any = generateDynamicValidationSchema(
    RFQData?.RFQFormAttributes[0]?.basicDetails
  );
  const validationSchema = Yup.object().shape({
    isTermsChecked: Yup.boolean().oneOf(
      [true],
      "Please accept the terms and conditions"
    ),
    stringValue: Yup.string(),
    checkboxValue: Yup.boolean(),
    // listed_by: Yup.string().required(),
    additionalCatalog: Yup.array(),
    ...dynamicValidationSchemaBasic,
  });

  const Formik: any = useFormik({
    initialValues: {
      isTermsChecked: false,
    },
    validationSchema,
    onSubmit: async (values: any, action) => {
      setIsLoading(true);
      const updatedBasicDetails =
        RFQData?.RFQFormAttributes[0]?.basicDetails?.map((detail: any) => ({
          ...detail,
          valueString: values?.[detail.fieldKey] || "",
          name: detail.fieldLabel,
          valueArray: [],
          valueBoolean: false,
        }));
      const updatedAdditionalDetails =
        RFQData?.RFQFormAttributes[0]?.additionalDetails?.map(
          (detail: any) => ({
            ...detail,
            valueString: values?.[detail.fieldKey] || "",
            valueArray: values?.[detail.fieldKey] || [],
            name: detail.fieldLabel,
            valueBoolean: false,
          })
        );
      // console.log("Formik values:", values);
      // console.log("Updated Basic Details:", updatedBasicDetails);
      // console.log("Updated Additional Details:", updatedAdditionalDetails);
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`rfq/create`, {
          attributes: [
            {
              basicDetails: updatedBasicDetails,
              additionalDetails: updatedAdditionalDetails,
            },
          ],
          catalogId: RFQData?.catalogId,
          businessId: RFQData?.businessId,
          bussinessListingId: RFQData?.listingId,
          createdBusinessId: BusinessId,
        });
        // console.log("values: ", values);
        action.resetForm();
        handleClose2();
        toast.success("form submitted");
      } catch (error) {
        toast.error("Error");
        handleClose2();
      } finally {
        setIsLoading(false);
      }
    },
  });

  async function fetchCatalogue() {
    try {
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get(
        `productCatalog/catalogs_list?seeAll=true`
      );

      const responseData = await response.data.data;
      setCatalogueData(responseData);
    } catch (error: any) {
      toast.error(error?.response?.data?.message[0] || "An error occurred");
    }
  }

  useEffect(() => {
    if (
      filterApplied ||
      clearFilter ||
      (location === "" && location == "All India")
    ) {
      fetchMarketPlace();
      setFilterApplied(false);
      setClearFilter(false);
    } // eslint-disable-next-line
  }, [filterApplied, clearFilter, location, selectedDuration]);

  useEffect(() => {
    handleClearFilters();
    fetchCity();
    fetchCatalogue();
    fetchAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMarketPlace();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (pageNumber > 1) {
      fetchMarketPlace();
    } // eslint-disable-next-line
  }, [pageNumber]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  const debouncedFetchMarketPlace = _.debounce(fetchMarketPlace, 3000);
  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProductName = event.target.value;
    setProductName(newProductName);

    if (newProductName.trim() !== "" || clearFilter) {
      setClearFilter(false);
      debouncedFetchMarketPlace();
    }
  };

  const sendRequestIfEmptyProductName = () => {
    if (productName.trim() === "") {
      fetchMarketPlace(); // Fetch all data when the input is empty
    }
  };

  const fetchAddress = async () => {
    try {
      const axiosInstance = createAxiosInstance();
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

  const mobile = searchParams.get("mobile");
  const defaultSelect: any = {
    id: "000111",
    label: "All India",
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
        paddingX: "0px",
        width: "100%",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          marginTop: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          ...(isMobile && {
            flexDirection: "column",
          }),
          ...(isTablets && {
            flexDirection: "column",
            paddingTop: "10px",
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
        <Box
          sx={{
            gap: "20px",
            display: "flex",
            ...(isMobile && {
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
            }),
          }}
        >
          {/* SEARCH BOX */}
          <Box
            sx={{
              ...(isMobile && { width: "100%" }),
              ...(isBiggerMobiles && { width: "45%" }),
            }}
          >
            <Box sx={{ ...(isMobile && { width: "100%" }) }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Products & Services"
                sx={{
                  ...(isMobile && {
                    width: "100%",
                  }),
                }}
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
                          ...(isMobile && {
                            width: "100%",
                          }),
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
                      width: "100% !important",
                    }),
                  },
                }}
                value={productName}
                onChange={handleProductNameChange}
                onKeyUp={sendRequestIfEmptyProductName}
              />
            </Box>
          </Box>

          {/* SEARCH BOX END */}

          {loading ? (
            <div>Loading...</div>
          ) : (
            <Box
              sx={{
                ...(isMobile && {
                  width: "46%",
                }),
                ...(isBiggerMobiles && { width: "26%" }),
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={cityData.map((option: any) => ({
                  id: option._id,
                  label: option.city,
                }))}
                getOptionLabel={(option: any) => option.label}
                onInputChange={(event, newValue) => {
                  if (!newValue) {
                    setClearFilter(true);
                  }
                  setLocation(newValue);
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
                    height: "45px",
                  },
                  ...(isMobile && {
                    width: "100%",
                  }),
                }}
                renderInput={(params) => (
                  <TextField
                    placeholder="Search by location"
                    label="Search by location"
                    {...params}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      borderRadius: "25px",
                      width: 200,
                      height: 40,

                      padding: "7px, 10.5px, 7px, 13px",
                      borderColor: "#CBD5E1",
                      backgroundColor: "#FFFFFF",
                      ...(isMobile && {
                        width: "100%",
                      }),
                    }}
                  />
                )}
              />

              {/* <Autocomplete
                multiple={false}
                limitTags={1}
                id="multiple-limit-tags"
                options={cityData.map((option: any) => ({
                  id: option._id,
                  label: option.city,
                }))}
                getOptionLabel={(option: any) => option.label}
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
                    height: "45px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Search by location"
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

              /> */}
            </Box>
          )}

          <Box
            sx={{
              ...(isMobile && {
                width: "46%",
              }),
              ...(isBiggerMobiles && { width: "21%" }),
            }}
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
                ...(isMobile && {
                  width: "100%",
                }),
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
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ padding: "20px" }}>
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
                        onChange={(e, value: any) => {
                          setcatalogId(value ? value.id : null);
                          setSelectedCatalog(value ? value.label : "");
                        }}
                        value={
                          selectedCatalog
                            ? { id: catalogId || "", label: selectedCatalog }
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginY: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                      marginY: "10px",
                    }}
                  >
                    Duration
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Any Time Button */}
                    <Button
                      variant="contained"
                      onClick={() => handleDurationChange(Duration.AnyTime)}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        marginRight: "10px",
                        backgroundColor:
                          selectedDuration === Duration.AnyTime
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedDuration === Duration.AnyTime
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E", // Change text color to white on hover
                        },
                      }}
                    >
                      Any Time
                    </Button>

                    {/* Last 6 Months Button */}
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleDurationChange(Duration.LastSixMonths)
                      }
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        marginRight: "10px",
                        backgroundColor:
                          selectedDuration === Duration.LastSixMonths
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedDuration === Duration.LastSixMonths
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E", // Change text color to white on hover
                        },
                      }}
                    >
                      Last 6 Months
                    </Button>

                    {/* This Year Button */}
                    <Button
                      variant="contained"
                      onClick={() => handleDurationChange(Duration.ThisYear)}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          selectedDuration === Duration.ThisYear
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedDuration === Duration.ThisYear
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E", // Change text color to white on hover
                        },
                      }}
                    >
                      This Year
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginY: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                      marginY: "10px",
                    }}
                  >
                    Choose Unit
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setUnit("");
                        handleUnitChange("");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor: unit === "" ? "#2B376E" : "initial",
                        color: unit === "" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      All
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setUnit("sq.ft");
                        handleUnitChange("sq.ft");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          unit === "sq.ft" ? "#2B376E" : "initial",
                        color: unit === "sq.ft" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      sq.ft
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setUnit("sq.cm");
                        handlePriceChange("sq.cm");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          unit === "sq.cm" ? "#2B376E" : "initial",
                        color: unit === "sq.cm" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      sq.cm
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setUnit("sq.m");
                        handleUnitChange("sq.m");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          unit === "sq.m" ? "#2B376E" : "initial",
                        color: unit === "sq.m" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      sq.m
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setUnit("sq.yrd");
                        handleUnitChange("sq.yrd");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          unit === "sq.yrd" ? "#2B376E" : "initial",
                        color: unit === "sq.yrd" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      sq.yrd
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
                        textTransform: "none",
                        backgroundColor:
                          selectedPriceRange === "reset"
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedPriceRange === "reset"
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
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
                        textTransform: "none",
                        backgroundColor:
                          selectedPriceRange === "under10000"
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedPriceRange === "under10000"
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
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
                        textTransform: "none",
                        backgroundColor:
                          selectedPriceRange === "10000to15000"
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedPriceRange === "10000to15000"
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
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
                        textTransform: "none",
                        backgroundColor:
                          selectedPriceRange === "over15000"
                            ? "#2B376E"
                            : "initial",
                        color:
                          selectedPriceRange === "over15000"
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      Over 15000
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginY: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,

                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#333542",
                      marginY: "10px",
                    }}
                  >
                    Customer Reviews
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setRatingCount("4");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          ratingCount === "4" ? "#2B376E" : "initial",
                        color: ratingCount === "4" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "yellow",
                        }}
                      >
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                      </Box>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setRatingCount("3");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          ratingCount === "3" ? "#2B376E" : "initial",
                        color: ratingCount === "3" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "yellow",
                        }}
                      >
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                      </Box>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setRatingCount("2");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          ratingCount === "2" ? "#2B376E" : "initial",
                        color: ratingCount === "2" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "yellow",
                        }}
                      >
                        <StarIcon fontSize="medium" />{" "}
                        <StarIcon fontSize="medium" />{" "}
                      </Box>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        setRatingCount("1");
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          ratingCount === "1" ? "#2B376E" : "initial",
                        color: ratingCount === "1" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "yellow",
                        }}
                      >
                        <StarIcon fontSize="medium" />{" "}
                      </Box>
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
                        handleSortBy("verifiedDate", 1);
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          sortBy === "verifiedDate" ? "#2B376E" : "initial",
                        color:
                          sortBy === "verifiedDate" ? "#FFFFFF" : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      Newest
                    </Button>

                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleSortBy("price", 1);
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          sortBy === "price" && sortOrder === 1
                            ? "#2B376E"
                            : "initial",
                        color:
                          sortBy === "price" && sortOrder === 1
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      Price: Low to High
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleSortBy("price", -1);
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          sortBy === "price" && sortOrder === -1
                            ? "#2B376E"
                            : "initial",
                        color:
                          sortBy === "price" && sortOrder === -1
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
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
                        handleSortBy("name", 1);
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          sortBy === "name" && sortOrder === 1
                            ? "#2B376E"
                            : "initial",
                        color:
                          sortBy === "name" && sortOrder === 1
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
                      }}
                    >
                      Name:A to Z
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleSortBy("name", -1);
                      }}
                      sx={{
                        borderRadius: "25px",
                        textTransform: "none",
                        backgroundColor:
                          sortBy === "name" && sortOrder === -1
                            ? "#2B376E"
                            : "initial",
                        color:
                          sortBy === "name" && sortOrder === -1
                            ? "#FFFFFF"
                            : "initial",
                        "&:hover": {
                          color: "#FFFFFF",
                          background: "#2B376E",
                        },
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
      <PageContainer>
        <DashboardCard>
          <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2vw" }}>
              {loadingMarketPlace && (
                <Box sx={{ display: "flex", mx: "auto", marginY: "10px" }}>
                  <CircularProgress />
                </Box>
              )}
              {marketPlace.map((_, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3vw",
                    width: "22%",
                    ...(isMobile && {
                      width: "100%",
                    }),
                    ...(isBiggerMobiles && {
                      width: "47.5%",
                    }),
                    ...(isTablets && {
                      width: "48.5%",
                    }),
                    ...(isTablets && {
                      width: "47.5%",
                    }),
                    ...(isLaptops && {
                      width: "30%",
                    }),
                  }}
                >
                  {
                    <Card
                      sx={{
                        maxWidth: "100%",
                        background: "#f0f5f9",
                        ...(isMobile && {
                          width: "100%",
                          marginBottom: "15px",
                        }),
                        ...(isBiggerMobiles && {
                          marginBottom: "0px",
                        }),
                        ...(isTablets && {
                          width: "100%",
                        }),
                        ...(isLaptops && {
                          width: "100%",
                        }),
                      }}
                      onClick={() => {
                        handleClickOpen2();
                        fetchRFQForm(_.id);
                        fetchBusinessListDetails(_.id);
                      }}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140px"
                          image={_.thumbnail ? _.thumbnail : no_image.src}
                          alt={_.name} 
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                            {_.name}
                            {_.isBusinessVerified === true && (
                            <IconDiscountCheck style={{ fill: 'blue',color:"white",height:"30px",width:"30px",marginLeft:"5px" }} />
                            )}
                          </Typography>
                          
                          <Box
                            sx={{
                              // maxHeight: "30px",
                              // height: "30px",
                              display: "flex",
                              alignItems: "center",
                              color: "#BFC8D6",
                              gap: "15px",
                              marginBottom: "5px",
                            }}
                          >
                            {" "}
                            <VerticalShadesClosedOutlinedIcon
                              sx={{
                                width: "31px",
                                height: "31px",
                                color: "#fff",
                                padding: "6px",
                                background: "#5c934c",
                                borderRadius: "23px",
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                display: "inline-block",
                                width: "180px",
                                fontFamily: "Poppins",
                                fontSize: "17px",
                                fontWeight: 500,
                                letterSpacing: "0em",
                                textAlign: "left",
                                color: "#333542",
                              }}
                            >
                              {_.businessName}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#BFC8D6",
                              gap: "10px",
                            }}
                          >
                            <PlaceOutlinedIcon
                              sx={{
                                width: "31px",
                                height: "31px",
                                color: "#fff",
                                padding: "6px",
                                background: "#5c934c",
                                borderRadius: "23px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#333542",

                                letterSpacing: "0em",
                                textAlign: "left",
                              }}
                            >
                              {_.address
                                .split(",")
                                .map(
                                  (
                                    part: string,
                                    index: number,
                                    parts: string[]
                                  ) => {
                                    const trimmedPart = part.trim();

                                    if (index === parts.length - 3) {
                                      // Display the second-last part
                                      return (
                                        <span key={index}>
                                          {trimmedPart}
                                          {index < parts.length - 1 ? ", " : ""}
                                        </span>
                                      );
                                    } else if (index === parts.length - 2) {
                                      // Display the third-last part
                                      return (
                                        <span key={index}>
                                          {trimmedPart}
                                          {index < parts.length - 1 ? ", " : ""}
                                        </span>
                                      );
                                    }

                                    return null;
                                  }
                                )}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "20px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "3.5px, 7px, 3.5px, 7px",
                                borderRadius: 25,
                                backgroundColor: "#F7F7F7",
                              }}
                            >
                              <Box
                                sx={{
                                  paddingX: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <StarBorderPurple500OutlinedIcon
                                  sx={{
                                    padding: "1.5px, 1.52px, 2.25px, 1.51px",
                                    color: "#FFBB3F",
                                  }}
                                />
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
                                  {_.ratings}  Ratings
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                // width: 120,
                                // height: 26,
                                // top: 314,
                                // left: 479,
                                padding: "3.5px, 7px, 3.5px, 7px",
                                borderRadius: 25,
                                backgroundColor: "#F7F7F7",
                              }}
                            >
                              <Box
                                sx={{
                                  paddingX: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <QuestionAnswerOutlinedIcon
                                  sx={{
                                    // width: 15,
                                    // height: 20,
                                    // top: 317,
                                    // left: 485.71,
                                    padding: "3.33px, 1.67px, 3.33px, 1.67px",
                                    Color: "#2B376E",
                                  }}
                                />
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
                                  {_.enquiries} Enquires
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  }
                </Box>
              ))}
            </Box>
            <Grid item xs={12}>
              <Box sx={{ bottom: 40 }}>
                <Stack spacing={2}>
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
                </Stack>
              </Box>
            </Grid>
          </>
        </DashboardCard>
      </PageContainer>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // open={true}
        maxWidth="xl"
        fullWidth={true}
      >
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  backgroundColor: "#FFFFFF",
                  padding: "15px",
                  borderColor: "#19B7AE",
                  borderRadius: "20px",
                }}
              >
                <CancelOutlinedIcon
                  onClick={handleClose2}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "end",
                    marginLeft: "auto",
                    mb: "0px",
                    mt: "-15px",
                    color: "#2B376E",
                  }}
                />
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                  <Grid item xs={5}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFF5F5",
                        height: "38%",
                        borderRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <VerticalShadesClosedOutlinedIcon
                          sx={{ width: "24", height: "24", color: "#BFC8D6" }}
                        />
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
                          {loading
                            ? "loading"
                            : listData[0]?.seller?.displayName}
                        </Typography>
                      </Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ ml: "20px", my: "5px" }}
                      >
                        <Chip
                          label={loading ? "loading" : listData[0]?.status}
                          sx={{
                            color: "#FFFFFF",
                            backgroundColor: "#DB5A5A",
                            width: "65px",
                            height: "25px",
                          }}
                        />
                      </Stack>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontWeight: 600,

                          letterSpacing: "0.5px",
                          textAlign: "left",
                          color: "#2B305C",
                          ml: "20px",
                        }}
                      >
                        {loading ? "loading" : listData[0]?.seller?.description}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "13px",
                          fontWeight: 600,

                          letterSpacing: "0.5px",
                          textAlign: "left",
                          color: "#A98B8B",
                          ml: "20px",
                          my: "2px",
                        }}
                      >
                        Address
                      </Typography>
                      <Grid item xs={6}>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: 500,

                            letterSpacing: "0em",
                            textAlign: "left",
                            color: "#756E6E",
                            ml: "20px",
                          }}
                        >
                          {loading ? "loading" : listData[0]?.seller?.address}
                        </Typography>
                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "100px",
                          my: "5px",
                        }}
                      >
                        <Box
                          sx={{
                            paddingX: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <StarBorderPurple500OutlinedIcon
                            sx={{
                              width: 18,
                              height: 18,
                              top: 318,
                              left: 361.59,
                              padding: "1.5px, 1.52px, 2.25px, 1.51px",
                              color: "#FFBB3F",
                            }}
                          />
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
                            {loading ? "0" : listData[0]?.ratingCount} Ratings
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            paddingX: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <QuestionAnswerOutlinedIcon
                            sx={{
                              width: 15,
                              height: 20,
                              top: 317,
                              left: 485.71,
                              padding: "3.33px, 1.67px, 3.33px, 1.67px",
                              Color: "#2B376E",
                            }}
                          />
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
                            {loading ? "0" : listData[0]?.enquiries} Enquires
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mb: "20px" }}>
                        <Typography
                          variant="body1"
                          color="initial"
                          sx={{ color: "blue" }}
                        >
                          {" "}
                          SPECIFICATION DETAILS:
                        </Typography>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="initial"
                            sx={{ color: "lightcoral" }}
                          >
                            Company Type:{" "}
                            <span style={{ color: "darkslateblue" }}>
                              {listData[0]?.attributes[0]
                                ?.specificationDetails[2]?.valueString
                                ? listData[0]?.attributes[0]
                                    ?.specificationDetails[2]?.valueString
                                : "no Data available"}
                            </span>{" "}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="initial"
                            sx={{ color: "lightcoral" }}
                          >
                            Nature of Business:{" "}
                            <span style={{ color: "darkslateblue" }}>
                              {listData[0]?.attributes[0]
                                ?.specificationDetails[3]?.valueString
                                ? listData[0]?.attributes[0]
                                    ?.specificationDetails[3]?.valueString
                                : "no Data available"}
                            </span>{" "}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="initial"
                            sx={{ color: "lightcoral" }}
                          >
                            local Mandis:{" "}
                            <span style={{ color: "darkslateblue" }}>
                              {listData[0]?.attributes[0]?.additionalDetails[0]
                                ?.valueString
                                ? listData[0]?.attributes[0]
                                    ?.additionalDetails[0]?.valueString
                                : "no Data Available"}
                            </span>{" "}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFF5F5",
                        my: "12px",
                        height: "62%",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "15px",
                          fontWeight: 700,

                          letterSpacing: "0.5px",
                          textAlign: "left",
                          color: "#2B305C",
                        }}
                      >
                        Get the best Quote
                      </Typography>

                      {RFQLoader ? (
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "15px",
                            fontWeight: 700,

                            letterSpacing: "0.5px",
                            textAlign: "left",
                            color: "#2B305C",
                          }}
                        >
                          Loading......
                        </Typography>
                      ) : (
                        <>
                          <form onSubmit={Formik.handleSubmit}>
                            <Grid container spacing={2}>
                              {RFQData?.RFQFormAttributes[0]?.basicDetails?.map(
                                (item: any, index: number) =>
                                  item?.fieldType !== "dropdownField" &&
                                  item?.fieldType !== "textareaAddressField" ? (
                                    <Grid
                                      key={index}
                                      xs={6}
                                      sx={{
                                        paddingLeft: "20px",
                                        paddingTop: "15px",
                                      }}
                                    >
                                      <FormControl>
                                        <Typography
                                          sx={{
                                            fontFamily: "Poppins",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: "#333542",
                                            mt: "20px",
                                            mb: "0px",
                                          }}
                                        >
                                          {item.fieldLabel}
                                        </Typography>
                                        <TextField
                                          type={item.fieldType}
                                          onChange={Formik.handleChange}
                                          onBlur={Formik.handleBlur}
                                          id={item.id}
                                          // value={Formik.values[item.fieldLabel]}
                                          placeholder={item.fieldPlaceholder}
                                          key={item.fieldKey}
                                          label={item?.fieldLabel}
                                          name={item.fieldKey}
                                          value={
                                            Formik.values[item.fieldKey] || ""
                                          }
                                          InputProps={{
                                            sx: {
                                              borderRadius: 25,
                                              width: "330px",
                                              height: "40px",
                                              backgroundColor: "#FFFFFF",
                                              color: "#64758B",

                                              fontFamily: "Poppins",
                                              fontSize: "14px",
                                              fontWeight: 400,
                                            },
                                          }}
                                        />
                                        {Formik.touched[item.fieldKey] &&
                                        Formik.errors[item.fieldKey] &&
                                        Array.isArray(
                                          Formik.errors[item.fieldKey]
                                        ) ? (
                                          Formik.errors[item.fieldKey].map(
                                            (error: any, index: any) => (
                                              <p
                                                key={index}
                                                style={{
                                                  color: "red",
                                                  marginLeft: "10px",
                                                  marginTop: "5px",
                                                }}
                                              >
                                                {error}
                                              </p>
                                            )
                                          )
                                        ) : (
                                          <p
                                            style={{
                                              color: "red",
                                              marginLeft: "10px",
                                              marginTop: "5px",
                                            }}
                                          >
                                            {Formik.errors[item.fieldKey]}
                                          </p>
                                        )}
                                      </FormControl>
                                    </Grid>
                                  ) : item?.fieldType !==
                                    "textareaAddressField" ? (
                                    <>
                                      <Box
                                        display="flex"
                                        justifyContent="start"
                                        alignItems="center"
                                        sx={{
                                          // mt: "20px",
                                          mr: "35px",
                                          gap: "20px",
                                          paddingLeft: "20px",
                                        }}
                                      >
                                        <Box>
                                          <FormControl>
                                            <Typography
                                              sx={{
                                                fontFamily: "Poppins",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#333542",
                                                mt: "-15px",
                                              }}
                                            >
                                              {item.fieldLabel}
                                            </Typography>
                                            <FormControl
                                              sx={{
                                                width: "330px",
                                                height: "30px",
                                                mt: "-3px",
                                                // paddingLeft: "20px",
                                              }}
                                            >
                                              <Select
                                                fullWidth
                                                displayEmpty
                                                name={item.fieldKey}
                                                type={item.fieldType}
                                                key={item.fieldKey}
                                                id={item.id}
                                                sx={{
                                                  borderRadius: "25px",
                                                  backgroundColor: "#FFFFFF",
                                                }}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                                placeholder={
                                                  item.fieldPlaceholder
                                                }
                                                value={
                                                  Formik.values[
                                                    item.fieldKey
                                                  ] || ""
                                                }
                                              >
                                                {item?.fieldOptions?.map(
                                                  (
                                                    itemOption: any,
                                                    index: number
                                                  ) => (
                                                    <MenuItem
                                                      key={index}
                                                      value={
                                                        itemOption.optionValue
                                                      }
                                                    >
                                                      {itemOption.optionLabel}
                                                    </MenuItem>
                                                  )
                                                )}
                                              </Select>
                                              {Formik.touched[item.fieldKey] &&
                                              Formik.errors[item.fieldKey] &&
                                              Array.isArray(
                                                Formik.errors[item.fieldKey]
                                              ) ? (
                                                Formik.errors[
                                                  item.fieldKey
                                                ].map(
                                                  (error: any, index: any) => (
                                                    <p
                                                      key={index}
                                                      style={{
                                                        color: "red",
                                                        marginLeft: "10px",
                                                        marginTop: "-2px",
                                                      }}
                                                    >
                                                      {error}
                                                    </p>
                                                  )
                                                )
                                              ) : (
                                                <p
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                    marginTop: "-2px",
                                                  }}
                                                >
                                                  {Formik.errors[item.fieldKey]}
                                                </p>
                                              )}
                                            </FormControl>
                                          </FormControl>
                                        </Box>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Box
                                        display="flex"
                                        justifyContent="start"
                                        alignItems="center"
                                        sx={{
                                          // mt: "20px",
                                          mr: "35px",
                                          gap: "20px",
                                          paddingLeft: "20px",
                                        }}
                                      >
                                        <Box>
                                          <FormControl>
                                            <Typography
                                              sx={{
                                                fontFamily: "Poppins",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#333542",
                                                mt: "-15px",
                                              }}
                                            >
                                              {item.fieldLabel}
                                            </Typography>
                                            <FormControl
                                              sx={{
                                                width: "330px",
                                                height: "30px",
                                                // paddingLeft: "20px",
                                              }}
                                            >
                                              <Select
                                                fullWidth
                                                displayEmpty
                                                name={item.fieldKey}
                                                value={
                                                  Formik.values[
                                                    item.fieldKey
                                                  ] || ""
                                                }
                                                type={item.fieldType}
                                                key={item.fieldKey}
                                                id={item.id}
                                                sx={{
                                                  borderRadius: "25px",
                                                  backgroundColor: "#FFFFFF",
                                                }}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                                placeholder={
                                                  item.fieldPlaceholder
                                                }
                                              >
                                                {address.map(
                                                  (
                                                    option: any,
                                                    index: number
                                                  ) => (
                                                    <MenuItem
                                                      key={index}
                                                      value={`${option?.label}, ${option?.addressLine1}, ${option?.landmark}, ${option?.city}, ${option?.state}, Pin:${option?.pincode} `}
                                                    >
                                                      <Typography>
                                                        {option?.label}
                                                      </Typography>
                                                      <Typography>
                                                        {option?.addressLine1}
                                                      </Typography>
                                                      <Typography>
                                                        {option?.landmark}
                                                      </Typography>
                                                      <Box
                                                        sx={{ display: "flex" }}
                                                      >
                                                        <Typography>
                                                          {option?.city}
                                                        </Typography>
                                                        <Typography>
                                                          {option?.state}
                                                        </Typography>
                                                        <Typography>
                                                          ,{option?.pincode}
                                                        </Typography>{" "}
                                                      </Box>
                                                    </MenuItem>
                                                  )
                                                )}
                                              </Select>

                                              {Formik.touched[item.fieldKey] &&
                                              Formik.errors[item.fieldKey] &&
                                              Array.isArray(
                                                Formik.errors[item.fieldKey]
                                              ) ? (
                                                Formik.errors[
                                                  item.fieldKey
                                                ].map(
                                                  (error: any, index: any) => (
                                                    <p
                                                      key={index}
                                                      style={{
                                                        color: "red",
                                                        marginLeft: "10px",
                                                        marginTop: "-2px",
                                                      }}
                                                    >
                                                      {error}
                                                    </p>
                                                  )
                                                )
                                              ) : (
                                                <p
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                    marginTop: "-2px",
                                                  }}
                                                >
                                                  {Formik.errors[item.fieldKey]}
                                                </p>
                                              )}
                                            </FormControl>
                                          </FormControl>
                                        </Box>
                                      </Box>
                                    </>
                                  )
                              )}
                            </Grid>
                            <Grid container spacing={2} mt={12}>
                              {RFQData?.RFQFormAttributes[0]?.additionalDetails?.map(
                                (field: any) =>
                                  field?.fieldType === "dropdownField" ? (
                                    <>
                                      <Grid item xs={6} mt={-8}>
                                        <FormControl margin="normal" fullWidth>
                                          <InputLabel
                                            htmlFor={field.fieldKey}
                                            sx={{
                                              marginTop: "5px",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            {field?.fieldLabel}
                                          </InputLabel>
                                          <Select
                                            key={field._id}
                                            style={{ margin: "10px" }}
                                            label={field?.fieldLabel}
                                            id={field.fieldKey}
                                            fullWidth
                                            sx={{ borderRadius: "15px" }}
                                            name={field.fieldKey}
                                            placeholder={
                                              field?.fieldPlaceholder
                                            }
                                            value={
                                              Formik.values[field.fieldKey] ||
                                              ""
                                            }
                                            onChange={Formik.handleChange}
                                          >
                                            {field?.fieldOptions?.map(
                                              (option: any) => (
                                                <MenuItem
                                                  key={option.optionValue}
                                                  value={option?.optionValue}
                                                >
                                                  {option?.optionLabel}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                          {Formik.touched[field.fieldKey] &&
                                          Formik.errors[field.fieldKey] &&
                                          Array.isArray(
                                            Formik.errors[field.fieldKey]
                                          ) ? (
                                            Formik.errors[field.fieldKey].map(
                                              (error: any, index: any) => (
                                                <p
                                                  key={index}
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                  }}
                                                >
                                                  {error}
                                                </p>
                                              )
                                            )
                                          ) : (
                                            <p
                                              style={{
                                                color: "red",
                                                marginLeft: "10px",
                                              }}
                                            >
                                              {Formik.errors[field.fieldKey]}
                                            </p>
                                          )}
                                        </FormControl>
                                      </Grid>
                                    </>
                                  ) : field?.fieldType ===
                                    "radioOptionField" ? (
                                    <>
                                      <Grid
                                        item
                                        xs={12}
                                        key={field._id}
                                        mt={-8}
                                      >
                                        <FormControl
                                          margin="normal"
                                          sx={{ marginLeft: "10px" }}
                                          fullWidth
                                          component="fieldset"
                                          key={field._id}
                                        >
                                          <FormLabel component="legend">
                                            {field?.fieldLabel}
                                          </FormLabel>
                                          <RadioGroup
                                            sx={{
                                              display: "flex",
                                              marginLeft: "5px",
                                              color: "grey",
                                              flexDirection: "row",
                                            }}
                                            aria-label={`radio-${field.fieldKey}`}
                                            id={field.fieldKey}
                                            name={field.fieldKey}
                                            placeholder={
                                              field?.fieldPlaceholder
                                            }
                                            value={
                                              Formik.values[field.fieldKey] ||
                                              ""
                                            }
                                            onChange={Formik.handleChange}
                                          >
                                            {field?.fieldOptions?.map(
                                              (option: any) => (
                                                <FormControlLabel
                                                  key={option.optionValue}
                                                  value={option.optionValue}
                                                  control={<Radio />}
                                                  label={option.optionLabel}
                                                />
                                              )
                                            )}
                                          </RadioGroup>
                                          {Formik.touched[field.fieldKey] &&
                                          Formik.errors[field.fieldKey] &&
                                          Array.isArray(
                                            Formik.errors[field.fieldKey]
                                          ) ? (
                                            Formik.errors[field.fieldKey].map(
                                              (error: any, index: any) => (
                                                <p
                                                  key={index}
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                  }}
                                                >
                                                  {error}
                                                </p>
                                              )
                                            )
                                          ) : (
                                            <p
                                              style={{
                                                color: "red",
                                                marginLeft: "10px",
                                              }}
                                            >
                                              {Formik.errors[field.fieldKey]}
                                            </p>
                                          )}
                                        </FormControl>
                                      </Grid>
                                    </>
                                  ) : field?.fieldType ===
                                    "checkboxOptionField" ? (
                                    <>
                                      <Grid
                                        item
                                        xs={12}
                                        key={field._id}
                                        mt={"-35px"}
                                      >
                                        <FormControl
                                          margin="normal"
                                          sx={{ marginLeft: "10px" }}
                                          fullWidth
                                          component="fieldset"
                                          key={field._id}
                                        >
                                          <FormLabel component="legend">
                                            {field?.fieldLabel}
                                          </FormLabel>
                                          <FormGroup
                                            sx={{
                                              display: "flex",
                                              marginLeft: "5px",
                                              mt: "-10px",
                                              color: "grey",
                                              flexDirection: "row",
                                            }}
                                          >
                                            {field?.fieldOptions?.map(
                                              (option: any) => (
                                                <FormControlLabel
                                                  key={option.optionValue}
                                                  control={
                                                    <Checkbox
                                                      checked={Formik.values[
                                                        field.fieldKey
                                                      ]?.includes(
                                                        option.optionValue
                                                      )}
                                                      onChange={
                                                        Formik.handleChange
                                                      }
                                                    />
                                                  }
                                                  label={option.optionLabel}
                                                />
                                              )
                                            )}
                                          </FormGroup>
                                          {Formik.touched[field.fieldKey] &&
                                          Formik.errors[field.fieldKey] &&
                                          Array.isArray(
                                            Formik.errors[field.fieldKey]
                                          ) ? (
                                            Formik.errors[field.fieldKey].map(
                                              (error: any, index: any) => (
                                                <p
                                                  key={index}
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                  }}
                                                >
                                                  {error}
                                                </p>
                                              )
                                            )
                                          ) : (
                                            <p
                                              style={{
                                                color: "red",
                                                marginLeft: "10px",
                                              }}
                                            >
                                              {Formik.errors[field.fieldKey]}
                                            </p>
                                          )}
                                        </FormControl>
                                      </Grid>
                                    </>
                                  ) : (
                                    <>
                                      <Grid item xs={6} key={field._id} mt={-8}>
                                        <FormControl
                                          margin="normal"
                                          fullWidth
                                          key={field._id}
                                          sx={{ borderRadius: "15px" }}
                                        >
                                          <TextField
                                            fullWidth
                                            type={field.fieldType}
                                            id={field.fieldKey}
                                            InputProps={{
                                              style: {
                                                borderRadius: 15,
                                              },
                                            }}
                                            InputLabelProps={{
                                              style: {
                                                borderRadius: 15,
                                              },
                                            }}
                                            name={field.fieldKey}
                                            label={field.fieldLabel}
                                            multiline
                                            variant="outlined"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value={
                                              Formik.values[field.fieldKey] ||
                                              ""
                                            }
                                            style={{ margin: "10px" }}
                                          />
                                          {Formik.touched[field.fieldKey] &&
                                          Formik.errors[field.fieldKey] &&
                                          Array.isArray(
                                            Formik.errors[field.fieldKey]
                                          ) ? (
                                            Formik.errors[field.fieldKey].map(
                                              (error: any, index: any) => (
                                                <p
                                                  key={index}
                                                  style={{
                                                    color: "red",
                                                    marginLeft: "10px",
                                                  }}
                                                >
                                                  {error}
                                                </p>
                                              )
                                            )
                                          ) : (
                                            <p
                                              style={{
                                                color: "red",
                                                marginLeft: "10px",
                                              }}
                                            >
                                              {Formik.errors[field.fieldKey]}
                                            </p>
                                          )}
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )
                              )}
                            </Grid>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "left",
                                gap: "10px",
                                mt: "-10px",
                                mb: "-10px",
                              }}
                            >
                              <Checkbox
                                checked={Formik.values.isTermsChecked}
                                onChange={Formik.handleChange}
                                name="isTermsChecked"
                                sx={{
                                  width: "17px",
                                  height: "16px",
                                  backgroundColor: "#FFFFFF",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: 12,
                                  fontWeight: 500,

                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#000000",
                                }}
                              >
                                I Accept All The Terms And Conditions*
                              </Typography>
                            </Box>
                            {Formik.touched.isTermsChecked &&
                              Formik.errors.isTermsChecked && (
                                <p style={{ color: "red" }}>
                                  {Formik.errors.isTermsChecked}
                                </p>
                              )}

                            <Box
                              sx={{
                                marginLeft: "auto",
                                display: "flex",
                                justifyContent: "end",
                                mt: "-30px",
                                mb: "80px",
                              }}
                            >
                              <LoadingButton
                                type="submit"
                                color="primary"
                                size="large"
                                variant="contained"
                                loading={isLoading}
                              >
                                Submit RFQ
                              </LoadingButton>
                              {/* <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                  textTransform: "none",
                                  paddingX: "30px",
                                  borderRadius: "30px",
                                  backgroundColor: "#2B376E",

                                  width: 207,
                                  height: 45,
                                }}
                              >
                                Submit RFQ
                              </Button> */}
                            </Box>
                          </form>
                        </>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={7}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFF5F5",
                        mb: "20px",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "20px",
                          fontWeight: 400,

                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#226AF7",
                        }}
                      >
                        PICTURES & VIDEOS
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        {listData[0]?.attributes[0]?.basicDetails[7]?.valueArray.map(
                          (item: any, index: number) => (
                            <Image
                              key={index}
                              alt={`Product ${index + 1}`}
                              src={item}
                              height={155}
                              width={135}
                              style={{ borderRadius: "12px" }}
                            />
                          )
                        )}
                      </Box>
                    </Paper>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFF5F5",
                        mb: "20px",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "20px",
                          fontWeight: 400,

                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#226AF7",
                        }}
                      >
                        CUSTOMERS REVIEWS & RATING
                      </Typography>
                      <Box sx={{ display: "flex", gap: "5px" }}>
                        <StarIcon
                          sx={{
                            width: "20px",
                            height: "20px",
                            color: "#F9CC4A",
                          }}
                        />

                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: 400,

                            letterSpacing: "0em",
                            textAlign: "left",
                            color: "#000000",
                          }}
                        >
                          {loading ? "0" : listData[0]?.ratings} Ratings out of
                          5
                        </Typography>
                      </Box>
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
                        {loading ? "0" : listData[0]?.ratingCount} Ratings
                      </Typography>
                    </Paper>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "10px",
                        backgroundColor: "#FFF5F5",
                        mb: "20px",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          mb: "20px",
                          fontFamily: "Poppins",
                          fontSize: "20px",
                          fontWeight: 400,
                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#226AF7",
                        }}
                      >
                        YOU MAY ALSO LIKE
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "row",
                          gap: "15px",
                          width: "65vw",
                        }}
                      >
                        {marketPlace.slice(0, 3).map((_, index: number) => (
                          <Grid
                            item
                            xs={10}
                            sm={4}
                            md={3}
                            key={index}
                            sx={{ cursor: "pointer" }}
                          >
                            {
                              <Card
                                sx={{ Width: "345px" }}
                                onClick={() => {
                                  handleClickOpen2();
                                  fetchRFQForm(_.id);
                                  fetchBusinessListDetails(_.id);
                                }}
                              >
                                <CardActionArea>
                                  <CardMedia
                                    component="img"
                                    height="140px"
                                    image={
                                      _.thumbnail ? _.thumbnail : no_image.src
                                    }
                                    alt={_.name}
                                  />
                                  <CardContent>
                                    <Typography
                                      gutterBottom
                                      variant="h5"
                                      component="div"
                                    >
                                      {_.name}
                                    </Typography>
                                    <Box
                                      sx={{
                                        // maxHeight: "30px",
                                        // height: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#BFC8D6",
                                        gap: "15px",
                                      }}
                                    >
                                      {" "}
                                      <VerticalShadesClosedOutlinedIcon />
                                      <Typography
                                        noWrap
                                        sx={{
                                          display: "inline-block",
                                          width: "180px",
                                          fontFamily: "Poppins",
                                          fontSize: "17px",
                                          fontWeight: 500,
                                          letterSpacing: "0em",
                                          textAlign: "left",
                                          color: "#333542",
                                        }}
                                      >
                                        {_.businessName}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#BFC8D6",
                                        gap: "10px",
                                      }}
                                    >
                                      <PlaceOutlinedIcon
                                        sx={{
                                          width: "20px",
                                          height: "20px",
                                          color: "#BFC8D6",

                                          padding:
                                            "2.5px, 3.33px, 2.1px, 3.33px",
                                        }}
                                      />
                                      <Typography
                                        sx={{
                                          fontFamily: "Poppins",
                                          fontSize: 14,
                                          fontWeight: 500,
                                          color: "#333542",

                                          letterSpacing: "0em",
                                          textAlign: "left",
                                        }}
                                      >
                                        {_.address
                                          .split(",")
                                          .map(
                                            (
                                              part: string,
                                              index: number,
                                              parts: string[]
                                            ) => {
                                              const trimmedPart = part.trim();

                                              if (index === parts.length - 3) {
                                                // Display the second-last part
                                                return (
                                                  <span key={index}>
                                                    {trimmedPart}
                                                    {index < parts.length - 1
                                                      ? ", "
                                                      : ""}
                                                  </span>
                                                );
                                              } else if (
                                                index ===
                                                parts.length - 2
                                              ) {
                                                // Display the third-last part
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
                                          )}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginTop: "20px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                          padding: "3.5px, 7px, 3.5px, 7px",
                                          borderRadius: 25,
                                          backgroundColor: "#F7F7F7",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            paddingX: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                          }}
                                        >
                                          <StarBorderPurple500OutlinedIcon
                                            sx={{
                                              padding:
                                                "1.5px, 1.52px, 2.25px, 1.51px",
                                              color: "#FFBB3F",
                                            }}
                                          />
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
                                            {_.ratings} Ratings
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          // width: 120,
                                          // height: 26,
                                          // top: 314,
                                          // left: 479,
                                          padding: "3.5px, 7px, 3.5px, 7px",
                                          borderRadius: 25,
                                          backgroundColor: "#F7F7F7",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            paddingX: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                          }}
                                        >
                                          <QuestionAnswerOutlinedIcon
                                            sx={{
                                              // width: 15,
                                              // height: 20,
                                              // top: 317,
                                              // left: 485.71,
                                              padding:
                                                "3.33px, 1.67px, 3.33px, 1.67px",
                                              Color: "#2B376E",
                                            }}
                                          />
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
                                            {_.enquiries} Enquires
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            }
                          </Grid>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
