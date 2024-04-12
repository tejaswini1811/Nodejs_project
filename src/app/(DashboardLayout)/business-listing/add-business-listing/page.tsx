"use client";
import createAxiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import { useAppselector } from "@/redux/store";
import Swal from "sweetalert2";
import DialogActions from "@mui/material/DialogActions";
export type CatlogType = {
  id: string;
  name: string;
  fieldType: string;
  fieldKey: string;
  fieldDependendent: string;
  valueString: string;
  valueArray: string[];
  valueBoolean: boolean;
  status: string;
};

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [uploadType, setUploadType]: any = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [appGallery, setAppGallery] = useState<any>();
  const [catalogForm, setCatalogForm]: any = useState([]);
  const [basicDetails, setBasicDetails] = useState<CatlogType[]>([]);
  const [additionalDetails, setadditionalDetails] = useState<CatlogType[]>([]);
  const [specificationDetails, setspecificationDetails] = useState<
    CatlogType[]
  >([]);
  const [catalogList, setCatalogList] = useState([
    {
      catalogUniqueId: "",
      icon: "",
      isActive: true,
      name: "",
      _id: "",
    },
  ]);
  const [isThirdParty, setIsThirdParty] = useState(false);
  const [businessDetails, setBusinessDetails]: any = useState([]);
  const [selectedCatalogid, setSelectedCatalogId] = useState<any>();
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [selectedImageUrlsSystem, setSelectedImageUrlsSystem] = useState<any>([]);
  const [showAdditionalCatalog, setShowAdditionalCatalog] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const createInstance = createAxiosInstance();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
  }, []);

  const contactPerson: any = JSON.parse(user);
  const router = useRouter();
  let BLPayload: any = {};
  const { _id, defaultBusinessId } = useAppselector(
    (state) => state?.user.value
  );

  const businessId = defaultBusinessId;

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

  const chnageListedBy = (e: any) => {
    if (e.target.value === "third_party") {
      setIsThirdParty(true);
    } else {
      setIsThirdParty(false);
    }
  };

  const handleDelete = (deletedUrl: string) => {
    setSelectedImageUrls((prevUrls) =>
      prevUrls.filter((url) => url !== deletedUrl)
    );
  };

  const handleDeleteCatalog = (deletedUrl: string) => {
    setAdditionalCatalogArray((prevUrls) =>
      prevUrls.filter((url) => url !== deletedUrl)
    );
  };

  const handleDeleteAll = () => {
    setSelectedImageUrls([]);
  };

  // const handleDelete1 = (deletedUrl: string) => {
  //   additionalCatalogArray((prevUrls) =>
  //     prevUrls.filter((url) => url !== deletedUrl)
  //   );
  // };

  // const handleDeleteAll1 = () => {
  //   additionalCatalogArray([]);
  // };

  const handleTermsChange = (event: any) => {
    setTermsChecked(event.target.checked);
  };

  const handleUploadClick = async (e: any) => {
    const selectedFiles = e.target.files;
    try {
      const uploadedUrls = await Promise.all(
        Array.from(selectedFiles).map(async (file: any) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await createInstance.post('upload/file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const imageUrl = response.data.data.url;
          console.log(response.data.data.url, '****', response)

          return imageUrl;
        })
      );

      // Update selectedImageUrlsSystem with unique URLs
      const uniqueUploadedUrls = uploadedUrls.filter(
        (url) => !selectedImageUrlsSystem.includes(url)
      );

      setSelectedImageUrlsSystem((prevUrls: any) => [...prevUrls, ...uniqueUploadedUrls]);
    } catch (error: any) {
      const msg =
        typeof error?.response?.data?.message === 'string'
          ? error?.response?.data?.message
          : error?.response?.data?.message[0];

      if (msg) {
        toast.error(msg, { duration: 3000 });
      }
    }
  };

  useEffect(() => {
    if (selectedImageUrls.length > 0 || selectedImageUrlsSystem.length > 0) {
      // formik.setErrors({
      //   ['listingPhotosField']: ``,
      // });
      formik.setFieldError('listingPhotosField', '');
    }
  }, [selectedImageUrls, selectedImageUrlsSystem])

  const fetchCatalogList = async () => {
    try {
      setIsLoading(true);
      const response = await createInstance.get(
        `productCatalog/catalogs_list`,
        {
          params: {
            seeAll: true,
          },
        }
      );
      setCatalogList(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching business listings:", error);
    }
  };

  const fetchBUsinessDetails = async (id: any) => {
    try {
      setIsLoading(true);
      const response = await createInstance.get(`business/all_business`);
      setBusinessDetails(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching business listings:", error);
    }
  };

  const fetchInAppGallery = async (catalogId: any) => {
    try {
      setIsLoading(true);
      const response = await createInstance.get(
        `in-app-gallery/get-all-inAppGalleryImages`,
        {
          params: {
            catalogId: catalogId,
          },
        }
      );

      if (response.data) {
        setAppGallery(response.data.data);
        // setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching InappGallery Images:", error);
    }
  };

  useEffect(() => {
    fetchCatalogList();
    fetchBUsinessDetails(businessId);
    //eslint-disable-next-line
  }, []);

  const fetchCatalogForm = async (id: string) => {
    await createInstance(`productCatalog/catalog_form`, {
      params: {
        language: "English",
        catalogId: id,
      },
    })
      .then(({ data: { data } }) => {
        // console.log("%%%%%%%%%%%%%%%%%%%%%%", data.listingFormAttributes[0]);
        // let resdata: CatlogType[] = [...data.listingFormAttributes[0].basicDetails];
        setBasicDetails(data.listingFormAttributes[0].basicDetails);
        setspecificationDetails(
          data.listingFormAttributes[0].specificationDetails
        );
        setadditionalDetails(data.listingFormAttributes[0].additionalDetails);
      })
      .catch((error) => {
        console.log("Business in this id do not exist!", error);
      });
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClickOpen1 = () => {
    setOpenDialog1(true);
  };

  const handleClose1 = () => {
    setOpenDialog1(false);
  };

  useEffect(() => {
    if ((selectedCatalogid !== undefined) && (selectedCatalogid !== '')) {
      formik.resetForm();
      formik.setErrors({});
      formik.setTouched({});

      setSelectedCatalogId(selectedCatalogid);
      formik.setFieldValue('catalogId', selectedCatalogid);
      formik.setFieldValue('business', formik.values.business);
      formik.setFieldValue('businessName', formik.values.businessName);
      formik.setFieldValue('mobile', formik.values.mobile);
      formik.setFieldValue('mobilePrefix', formik.values.mobilePrefix);
      formik.setFieldValue('contactPersonName', formik.values.contactPersonName);
      formik.setFieldValue('altMobile', formik.values.altMobile);
      formik.setFieldValue('isAltMobile', formik.values.isAltMobile);
      formik.setFieldValue('listed_by', formik.values.listed_by);

      fetchCatalogForm(selectedCatalogid);
      fetchInAppGallery(selectedCatalogid);
      //eslint-disable-next-line
    }
  }, [selectedCatalogid]);

  const generateDynamicValidationSchema = (dynamicFields: any) => {
    const dynamicSchema: any = {};

    dynamicFields.forEach((field: any) => {
      if (field.fieldValidations && field.fieldValidations.isMandatory) {
        if ((field.fieldKey === "optionalKey10") && (field.fieldType !== "textField")) {
          dynamicSchema[field.fieldKey] = Yup.array().test(
            'required',
            'Supply Region is required',
            (value) => {
              return value && value.length > 0;
            }
          );
        } else if ((field.fieldKey === "optionalKey5") && (field.fieldType !== "textField")) {
          dynamicSchema[field.fieldKey] = Yup.array().required(
            "Nature of Business is required"
          );
        } else if (field.fieldKey === "listingPhotosField") {
          if (selectedImageUrls.length > 0 || selectedImageUrlsSystem.length > 0) {
            // formik.setFieldError(field.fieldKey, null);
            dynamicSchema[field.fieldKey] = Yup.mixed();
          } else {
            dynamicSchema[field.fieldKey] = Yup.string().required(
              `${field.fieldLabel} is required`
            );
          }
        } else {
          dynamicSchema[field.fieldKey] = Yup.string().required(
            `${field.fieldLabel} is required`
          );
        }
      }
    });

    return dynamicSchema;
  };

  const [additionalCatalogArray, setAdditionalCatalogArray] = useState<
    string[]
  >([]);

  const handleCheckboxClick1 = (imageUrl: string) => {
    setAdditionalCatalogArray((prevUrls) => {
      const isSelected = prevUrls.includes(imageUrl);
      const updatedUrls = isSelected
        ? prevUrls.filter((url) => url !== imageUrl)
        : [...prevUrls, imageUrl];
      // console.log("image url array: ", updatedUrls);
      return updatedUrls;
    });
  };

  const createBusinessListing = async (BLPayload: any) => {
    try {
      await createInstance
        .post("/businessListing/create", BLPayload)
        .then((res) => {
          toast.success("Business listing successfully created");
          router.push("/business-listing");
        });
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        // const errorMessage = error.response.data.message.join(', ');
        const errorMessage = error.response.data.message[0];
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const dynamicValidationSchemaBasic: any =
    generateDynamicValidationSchema(basicDetails);
  const dynamicValidationSchemaAdditional: any =
    generateDynamicValidationSchema(additionalDetails);
  const dynamicValidationSchemaSpecification: any =
    generateDynamicValidationSchema(specificationDetails);
  const validationSchema = Yup.object().shape({
    business: Yup.string().required("Business is required"),
    catalogId: Yup.string().required("Catalog is required"),
    // businessName: Yup.string().required("Business Name is required"),
    isTermsChecked: Yup.boolean().oneOf(
      [true],
      "Please accept the terms and conditions"
    ),
    // mobile: Yup.string().required("Mobile is required"),
    stringValue: Yup.string(),
    checkboxValue: Yup.boolean(),
    listed_by: Yup.string().required(),
    additionalCatalog: Yup.array(),
    ...dynamicValidationSchemaBasic,
    ...dynamicValidationSchemaAdditional,
    ...dynamicValidationSchemaSpecification,
  });
  const formik: any = useFormik({
    initialValues: {
      business: businessId || businessDetails[0]?.id,
      businessName: "",
      catalogId: "",
      stringValue: "",
      checkboxValue: false,
      listed_by: "self",
      mobile: "",
      mobilePrefix: "",
      contactPersonName: "",
      altMobile: "",
      isAltMobile: false,
      isAdditionalActive: false,
      isTermsChecked: false,
    },
    validationSchema,
    onSubmit: async (values: any) => {
      try {

        const updatedAdditionalDetails = additionalDetails.map(
          (field: any) => ({
            id: field?.id,
            name: field?.fieldLabel,
            nameTranslation: field?.nameTranslation,
            fieldType: field?.fieldType,
            fieldKey: field?.fieldKey,
            fieldDependent: field?.fieldDependent || "",
            valueString: values?.[field.fieldKey] || "",
            valueBoolean: false,
            valueArray: [],
          })
        );
        const updatedSpecificationDetails = specificationDetails.map(
          (field: any) => ({
            id: field?.id,
            name: field?.fieldLabel,
            nameTranslation: field?.nameTranslation,
            fieldType: field?.fieldType,
            fieldKey: field?.fieldKey,
            fieldDependent: field?.fieldDependent || "",
            valueString: values?.[field.fieldKey] || "",
            valueBoolean: false,
            valueArray: [],
          })
        );
        const updatedBasicDetails = basicDetails.map((field: any) => ({
          id: field?.id,
          name: field?.fieldLabel,
          nameTranslation: field?.nameTranslation,
          fieldType: field?.fieldType,
          fieldKey: field?.fieldKey,
          fieldDependent: field?.fieldDependent || "",
          valueString: values?.[field.fieldKey] || "",
          valueBoolean: false,
          valueArray: [],
        }));

        if (selectedImageUrls.length > 0 || selectedImageUrlsSystem.length > 0) {
          const multiUploadImageField: any = updatedBasicDetails.find(
            (field: any) => field.fieldType === "multiUploadImage"
          );
          if (multiUploadImageField) {
            multiUploadImageField.valueString = ""
            multiUploadImageField.valueArray = selectedImageUrls.length > 0
              ? selectedImageUrls
              : selectedImageUrlsSystem;
          }
        }

        const additionalSupRegion: any = updatedAdditionalDetails.find(
          (field: any) => field.name === "Supply Region"
        );

        if (additionalSupRegion) {
          // Assuming 'Supply Region' has an array field named 'valueArray'
          additionalSupRegion.valueArray = values[additionalSupRegion.fieldKey];
          additionalSupRegion.valueString = "";
        }

        const specificationNatureOfBusiness: any = updatedSpecificationDetails.find(
          (field: any) => field.name === "Nature of Business"
        );

        if (specificationNatureOfBusiness) {
          specificationNatureOfBusiness.valueArray = values[specificationNatureOfBusiness.fieldKey];
          specificationNatureOfBusiness.valueString = "";
        }

        // BLPayload["name"] = values.businessName
        (BLPayload["thumbnail"] = ""),
          (BLPayload["name"] =
            values.businessName || updatedBasicDetails[0].valueString),
          // (BLPayload["listingCatalog"] = selectedCatalogid),
          (BLPayload["listingCatalog"] = [selectedCatalogid]);
        (BLPayload["contactPerson"] = isThirdParty ? "" : contactPerson?._id),
          (BLPayload["mobile"] = values.mobile),
          (BLPayload["mobilePrefix"] = values?.countryCode || "+91"),
          (BLPayload["contactPersonName"] = values.contactPersonName),
          (BLPayload["business"] = values?.business),
          (BLPayload["secondaryListingCatalog"] = additionalCatalogArray),
          (BLPayload["altMobile"] = values.altMobile),
          (BLPayload["isAltMobile"] = values.isAltMobile),
          (BLPayload["createdBy"] = _id),
          (BLPayload["attributes"] = [
            {
              additionalDetails: updatedAdditionalDetails,
              basicDetails: updatedBasicDetails,
              specificationDetails: updatedSpecificationDetails,
            },
          ]);

        Swal.fire({
          title: "Confirm Submission",
          text: "Please review the listing details thoroughly before confirming. Once confirmed details cannot be edited",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result: any) => {
          if (result.isConfirmed) {
            createBusinessListing(BLPayload);
          }
        });
      } catch (error: any) {
        toast.error(error?.message || "An error occurred");
      }
    },
  });

  //To check if any error in formik
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', formik.errors)

  return (
    <>
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader
              title="Business Details"
              sx={{
                backgroundColor: "#2B305C",
                color: "#fff",
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Grid item xs={12} sx={{ mt: 3, p: 3 }}>
                  <FormControl
                    component="fieldset"
                    margin="normal"
                    sx={{ alignContent: "start" }}
                  >
                    <Box>
                      <FormLabel component="legend">Listed By</FormLabel>
                    </Box>
                    <RadioGroup
                      aria-label="listed_by"
                      name="listed_by"
                      value={formik.values.listed_by}
                      onChange={(e: any) => {
                        chnageListedBy(e);
                        formik.handleChange(e);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="self"
                        control={<Radio />}
                        label="Self"
                      />
                      <FormControlLabel
                        value="third_party"
                        control={<Radio />}
                        label="Third party"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    {!isThirdParty ? (
                      <>
                        <Box
                          sx={{
                            marginTop: "15px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ marginRight: "10px", marginTop: "25px" }}
                          >
                            Business:
                          </Typography>
                          <FormControl margin="normal">
                            <InputLabel htmlFor="business">Business</InputLabel>
                            <Select
                              id="business1"
                              name="business"
                              label="business"
                              sx={{ minWidth: "25rem" }}
                              value={formik.values.business}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              {businessDetails.map((option: any) => (
                                <MenuItem key={option._id} value={option._id}>
                                  {option.displayName}
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched.business &&
                              formik.errors.business && (
                                <p style={{ color: "red" }}>
                                  {formik.errors.business}
                                </p>
                              )}
                          </FormControl>
                        </Box>
                        <Box
                          sx={{
                            marginTop: "15px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Typography variant="subtitle1">
                            Contact Person:
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ marginLeft: "5px", color: "grey" }}
                          >
                            {contactPerson?.firstName} {contactPerson?.lastName}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      ""
                    )}
                  </FormControl>
                  {!isThirdParty && (
                    <>
                      <Box sx={{ display: "flex" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginRight: "10px", marginTop: "15px" }}
                        >
                          Alternate Mobile Number:
                        </Typography>
                        <FormControl margin="normal" sx={{ width: "100%" }}>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                            sx={{ borderRadius: "20px" }}
                            id="outlined-mobile-input"
                            label="Alternate Mobile Number"
                            type="tel"
                            name="altMobile"
                            onChange={formik.handleChange}
                            value={formik.values.altMobile}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                          />
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="isAltMobile"
                              name="isAltMobile"
                              checked={formik.values.isAltMobile}
                              onChange={(e) => {
                                // Ensure only true or false is set for isAltMobile
                                formik.handleChange(e);
                                formik.setFieldValue(
                                  "isAltMobile",
                                  e.target.checked
                                );
                              }}
                            />
                          }
                          label="Use this number for business Listing!"
                        />
                      </Box>
                    </>
                  )}
                  {isThirdParty && (
                    <>
                      <Box sx={{ display: "flex" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginRight: "10px", marginTop: "15px" }}
                        >
                          Business Name:
                        </Typography>
                        <TextField
                          name="businessName"
                          id="businessName1"
                          label="Business Name"
                          onChange={formik.handleChange}
                          value={formik.values.businessName}
                          onBlur={formik.handleBlur}
                          type="text"
                        />
                        {formik.touched.businessName &&
                          formik.errors.businessName && (
                            <p style={{ color: "red" }}>
                              {formik.errors.businessName}
                            </p>
                          )}
                      </Box>
                    </>
                  )}
                  {isThirdParty && (
                    <>
                      <Box sx={{ display: "flex" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginRight: "10px", marginTop: "25px" }}
                        >
                          Mobile:
                        </Typography>
                        <FormControl margin="normal" sx={{ width: "100%" }}>
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                            sx={{ borderRadius: "20px" }}
                            id="outlined-mobile-input"
                            label="Mobile Number"
                            type="tel"
                            name="mobile"
                            onChange={formik.handleChange}
                            value={formik.values.mobile}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                          />
                        </FormControl>
                      </Box>
                      <Box sx={{ display: "flex" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginRight: "10px", marginTop: "15px" }}
                        >
                          Contact person:
                        </Typography>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            fullWidth
                            type="text"
                            id="contactPersonName"
                            name="contactPersonName"
                            label="Contact Person Name"
                            multiline
                            variant="outlined"
                            sx={{ minWIdth: "25rem" }}
                            onChange={formik.handleChange}
                            value={formik.values.contactPersonName}
                          />
                        </FormControl>
                      </Box>
                    </>
                  )}
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ marginRight: "10px", marginTop: "25px" }}
                    >
                      Catalog:
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel htmlFor="catalogId">Catalogue</InputLabel>
                      <Select
                        id="catalogId"
                        name="catalogId"
                        label="Catalogue"
                        sx={{ minWidth: "25rem" }}
                        value={formik.values.catalogId}
                        // onChange={(e: any) => {
                        //     formik.handleChange(e);
                        //     setSelectedCatalogId(e.target.value);
                        // }}

                        onChange={(e: any) => {
                          setSelectedCatalogId(e.target.value);
                          formik.handleChange(e);
                        }}
                      >
                        {catalogList.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            <Image
                              src={option.icon}
                              style={{ marginRight: "5px" }}
                              width={20}
                              height={20}
                              alt="catalog icon"
                            ></Image>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.catalogId && formik.errors.catalogId && (
                        <p style={{ color: "red" }}>
                          {formik.errors.catalogId}
                        </p>
                      )}
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          {Boolean(basicDetails.length) && (
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title="Basic Details"
                sx={{
                  backgroundColor: "#2B305C",
                  color: "#fff",
                  mb: 4,
                }}
              />
              <Grid container>
                <Grid
                  item
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 6, md: 12 }}
                  p={3}
                >
                  {basicDetails?.map((field: any) =>
                    field?.fieldType === "dropdownField" ? (
                      <>
                        <Grid item xs={6} mt={-8}>
                          <FormControl margin="normal" fullWidth>
                            <InputLabel
                              htmlFor={field.fieldKey}
                              sx={{ marginTop: "10px", marginLeft: "8px" }}
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
                              placeholder={field?.fieldPlaceholder}
                              value={formik.values[field.fieldKey] || ""}
                              onChange={formik.handleChange}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <MenuItem
                                  key={option.optionValue}
                                  value={option?.optionValue}
                                >
                                  {option?.optionLabel}
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "textareaAddressField" ? (
                      <>
                        {" "}
                        <Grid item xs={6} key={field._id} mt={-8}>
                          {" "}
                          <FormControl
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          >
                            <InputLabel
                              htmlFor={field.fieldKey}
                              sx={{ marginTop: "10px", marginLeft: "8px" }}
                            >
                              {field?.fieldLabel}
                            </InputLabel>
                            <Select
                              key={field._id}
                              style={{ margin: "10px" }}
                              label={field?.fieldLabel}
                              fullWidth
                              sx={{ borderRadius: "15px" }}
                              id={field.fieldKey}
                              name={field.fieldKey}
                              placeholder={field?.fieldPlaceholder}
                              value={formik.values[field.fieldKey] || ""}
                              onChange={formik.handleChange}
                            >
                              {contactPerson?.address?.map((option: any) => (
                                <MenuItem
                                  key={option._id}
                                  value={`${option?.label}, ${option?.addressLine1}, ${option?.landmark}, ${option?.city}, ${option?.state}, Pin:${option?.pincode} `}
                                >
                                  <Typography>{option?.label}</Typography>
                                  <Typography>
                                    {option?.addressLine1}
                                  </Typography>
                                  <Typography>{option?.landmark}</Typography>
                                  <Box sx={{ display: "flex" }}>
                                    <Typography>{option?.city}</Typography>
                                    <Typography>{option?.state}</Typography>
                                    <Typography>
                                      ,{option?.pincode}
                                    </Typography>{" "}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "radioOptionField" ? (
                      <>
                        <Grid item xs={12} key={field._id} mt={-8}>
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
                              placeholder={field?.fieldPlaceholder}
                              value={formik.values[field.fieldKey] || ""}
                              onChange={formik.handleChange}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <FormControlLabel
                                  key={option.optionValue}
                                  value={option.optionValue}
                                  control={<Radio />}
                                  label={option.optionLabel}
                                />
                              ))}
                            </RadioGroup>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "checkboxOptionField" ? (
                      <>
                        <Grid item xs={12} key={field._id} mt={-8}>
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
                                color: "grey",
                                flexDirection: "row",
                              }}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <FormControlLabel
                                  key={option.optionValue}
                                  control={
                                    // Use Checkbox instead of Radio for checkboxes
                                    <Checkbox
                                      checked={formik.values[
                                        field.fieldKey
                                      ]?.includes(option.optionValue)}
                                      onChange={formik.handleChange}
                                    />
                                  }
                                  label={option.optionLabel}
                                />
                              ))}
                            </FormGroup>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "multiUploadImage" ? (
                      <>
                        {" "}
                        <Grid item xs={6} mt={-8}>
                          <FormControl
                            fullWidth
                            sx={{ mt: 3.2 }}
                            key={field._id}
                          >
                            <InputLabel id="demo-simple-select-label">
                              Upload your listing photos
                            </InputLabel>
                            <Select
                              sx={{
                                borderRadius: "15px",
                              }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={uploadType}
                              label="Upload your listing photos"
                              // onChange={(e: any) =>
                              //   setUploadType(e.target.value)
                              // }
                              onChange={(e: any) => {
                                setUploadType(e.target.value);
                                formik.handleChange(e);
                              }}
                              onBlur={formik.handleBlur}
                            >
                              <MenuItem value={""}>None</MenuItem>
                              <MenuItem
                                value={"App Gallery"}
                                onClick={handleClickOpen}
                              >
                                App Gallery
                              </MenuItem>
                              <MenuItem
                                value={"Choose file"}
                                onClick={handleDeleteAll}
                              >
                                Choose file
                              </MenuItem>
                            </Select>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                          <Grid container spacing={1} direction="row" mb={3}>
                            {selectedImageUrls.map((item, index) => (
                              <>
                                <Grid item xs={4} key={index}>
                                  <Chip
                                    label={item?.slice(0, 20)}
                                    variant="outlined"
                                    onDelete={() => handleDelete(item)}
                                  />
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                        {uploadType === "Choose file" && (
                          <Grid item xs={6} mt={-8}>
                            <FormControl
                              margin="normal"
                              fullWidth
                              key={field._id}
                              sx={{ borderRadius: "15px" }}
                            >
                              <TextField
                                InputLabelProps={{
                                  style: {
                                    borderRadius: 15,
                                  },
                                }}
                                id="outlined-file"
                                name="file"
                                inputProps={{ accept: 'image/*', multiple: true }}
                                onChange={handleUploadClick}
                                type="file"
                              />
                            </FormControl>
                          </Grid>
                        )}
                        {uploadType === "App Gallery" && (
                          <Dialog open={openDialog} onClose={handleClose}>
                            <DialogTitle>
                              InAppGallry
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  p: 2,
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                }}
                                onClick={handleClose}
                              >
                                <CloseIcon sx={{ cursor: "pointer" }} />
                              </Box>
                            </DialogTitle>
                            <DialogContent>
                              {appGallery && appGallery.length > 0 ? (
                                <>
                                  <Grid container spacing={2} direction="row">
                                    {appGallery &&
                                      appGallery.length > 0 &&
                                      appGallery?.map(
                                        (item: any, index: number) => (
                                          <Grid item xs={4} key={index}>
                                            <Image
                                              src={item.imageUrl}
                                              width={150}
                                              height={150}
                                              alt={`Picture ${index + 1}`}
                                            />
                                            <Checkbox
                                              checked={selectedImageUrls.includes(
                                                item.imageUrl
                                              )}
                                              onChange={() =>
                                                handleCheckboxClick(
                                                  item.imageUrl
                                                )
                                              }
                                            />
                                          </Grid>
                                        )
                                      )}
                                  </Grid>
                                </>
                              ) : (
                                <Grid container spacing={2} direction="row">
                                  <Grid item xs={12}>
                                    <Typography
                                      textAlign={"center"}
                                      variant="h6"
                                    >
                                      No data found
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
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
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values[field.fieldKey] || ""}
                              style={{ margin: "10px" }}
                            />
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )
                  )}
                </Grid>
              </Grid>
            </Card>
          )}

          {Boolean(specificationDetails.length) && (
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title="Specification Details"
                sx={{
                  backgroundColor: "#2B305C",
                  color: "#fff",
                  mb: 6,
                }}
              />
              <Grid container spacing={6} p={3}>
                <Grid
                  item
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid container columnSpacing={3}>
                    {specificationDetails?.map((field: any) =>
                      field?.fieldType === "dropdownField" ? (
                        <>
                          <Grid item xs={6} mt={-5}>
                            <FormControl margin="normal" fullWidth>
                              <InputLabel
                                htmlFor={field.fieldKey}
                                sx={{ marginTop: "10px", marginLeft: "8px" }}
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
                                placeholder={field?.fieldPlaceholder}
                                value={formik.values[field.fieldKey] || ""}
                                onChange={formik.handleChange}
                              >
                                {field?.fieldOptions?.map((option: any) => (
                                  <MenuItem
                                    key={option.optionValue}
                                    value={option?.optionValue}
                                  >
                                    {option?.optionLabel}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formik.touched[field.fieldKey] &&
                                formik.errors[field.fieldKey] &&
                                Array.isArray(formik.errors[field.fieldKey]) ? (
                                formik.errors[field.fieldKey].map(
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
                                <p style={{ color: "red", marginLeft: "10px" }}>
                                  {formik.errors[field.fieldKey]}
                                </p>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      ) : field?.fieldType === "textareaAddressField" ? (
                        <>
                          {" "}
                          <Grid item xs={6} key={field._id} mt={-5}>
                            {" "}
                            <FormControl
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            >
                              <InputLabel
                                htmlFor={field.fieldKey}
                                sx={{ marginTop: "10px", marginLeft: "8px" }}
                              >
                                {field?.fieldLabel}
                              </InputLabel>
                              <Select
                                key={field._id}
                                style={{ margin: "10px" }}
                                label={field?.fieldLabel}
                                fullWidth
                                sx={{ borderRadius: "15px" }}
                                id={field.fieldKey}
                                name={field.fieldKey}
                                placeholder={field?.fieldPlaceholder}
                                value={formik.values[field.fieldKey] || ""}
                                onChange={formik.handleChange}
                              >
                                {contactPerson?.address?.map((option: any) => (
                                  <MenuItem
                                    key={option._id}
                                    value={`${option?.label}, ${option?.addressLine1}, ${option?.landmark}, ${option?.city}, ${option?.state}, Pin:${option?.pincode} `}
                                  >
                                    <Typography>{option?.label}</Typography>
                                    <Typography>
                                      {option?.addressLine1}
                                    </Typography>
                                    <Typography>{option?.landmark}</Typography>
                                    <Box sx={{ display: "flex" }}>
                                      <Typography>{option?.city}</Typography>
                                      <Typography>{option?.state}</Typography>
                                      <Typography>
                                        ,{option?.pincode}
                                      </Typography>{" "}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                              {formik.touched[field.fieldKey] &&
                                formik.errors[field.fieldKey] &&
                                Array.isArray(formik.errors[field.fieldKey]) ? (
                                formik.errors[field.fieldKey].map(
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
                                <p style={{ color: "red", marginLeft: "10px" }}>
                                  {formik.errors[field.fieldKey]}
                                </p>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      ) : field?.fieldType === "radioOptionField" ? (
                        <>
                          <Grid item xs={12} key={field._id} mt={-3}>
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
                                placeholder={field?.fieldPlaceholder}
                                value={formik.values[field.fieldKey] || ""}
                                onChange={formik.handleChange}
                              >
                                {field?.fieldOptions?.map((option: any) => (
                                  <FormControlLabel
                                    key={option.optionValue}
                                    value={option.optionValue}
                                    control={<Radio />}
                                    label={option.optionLabel}
                                  />
                                ))}
                              </RadioGroup>
                              {formik.touched[field.fieldKey] &&
                                formik.errors[field.fieldKey] &&
                                Array.isArray(formik.errors[field.fieldKey]) ? (
                                formik.errors[field.fieldKey].map(
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
                                <p style={{ color: "red", marginLeft: "10px" }}>
                                  {formik.errors[field.fieldKey]}
                                </p>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      ) : field?.fieldType === "checkboxOptionField" ? (
                        <>
                          <Grid item xs={12} key={field._id} mt={-5}>
                            {/* <FormControl
                              margin="normal"
                              sx={{ marginLeft: "10px" }}
                              fullWidth
                              component="fieldset"
                              key={field._id}
                            >
                              <FormLabel component="legend">
                                {field?.fieldLabel}
                              </FormLabel>
                              <FormGroup // Use FormGroup instead of RadioGroup for checkboxes
                                sx={{
                                  display: "flex",
                                  marginLeft: "5px",
                                  color: "grey",
                                  flexDirection: "row",
                                }}
                              >
                                {field?.fieldOptions?.map((option: any) => (
                                  <FormControlLabel
                                    key={option.optionValue}
                                    control={
                                      <Checkbox
                                        checked={formik.values[
                                          field.fieldKey
                                        ]?.includes(option.optionValue)}
                                        onChange={formik.handleChange}
                                      />
                                    }
                                    label={option.optionLabel}
                                  />
                                ))}
                              </FormGroup>
                              {formik.touched[field.fieldKey] &&
                                formik.errors[field.fieldKey] &&
                                Array.isArray(formik.errors[field.fieldKey]) ? (
                                formik.errors[field.fieldKey].map(
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
                                <p style={{ color: "red", marginLeft: "10px" }}>
                                  {formik.errors[field.fieldKey]}
                                </p>
                              )}
                            </FormControl> */}

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
                                  color: "grey",
                                  flexDirection: "row",
                                }}
                              >
                                {field?.fieldOptions?.map((option: any) => (
                                  <FormControlLabel
                                    key={option.optionValue}
                                    control={
                                      <Checkbox
                                        checked={formik.values[
                                          field.fieldKey
                                        ]?.includes(option.optionValue)}
                                        // onChange={
                                        //     formik.handleChange
                                        // }

                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          formik.setFieldValue(
                                            field.fieldKey,
                                            isChecked
                                              ? [
                                                ...(formik.values[
                                                  field.fieldKey
                                                ] || []),
                                                option.optionValue,
                                              ]
                                              : formik.values[
                                                field.fieldKey
                                              ]?.filter(
                                                (val: any) =>
                                                  val !== option.optionValue
                                              ) || []
                                          );
                                          if (!isChecked) {
                                            formik.setErrors({
                                              [field.fieldKey]: `Nature of Business is required`,
                                            });
                                          }
                                        }}
                                        onBlur={formik.handleBlur}
                                      // onBlur={() => {
                                      //     formik.setFieldTouched(field.fieldKey, true);
                                      // }}
                                      />
                                    }
                                    label={option.optionLabel}
                                  />
                                ))}
                              </FormGroup>
                              {formik.touched[field.fieldKey] &&
                                formik.errors[field.fieldKey] &&
                                Array.isArray(formik.errors[field.fieldKey]) ? (
                                formik.errors[field.fieldKey].map(
                                  (error: any, index: any) => (
                                    <p
                                      key={index}
                                      style={{ color: "red", marginLeft: "10px" }}
                                    >
                                      {error}
                                    </p>
                                  )
                                )
                              ) : (
                                <p style={{ color: "red", marginLeft: "10px" }}>
                                  {formik.errors[field.fieldKey]}
                                </p>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={6} key={field._id} mt={-5}>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[field.fieldKey] || ""}
                                style={{ margin: "10px" }}
                              />
                            </FormControl>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </Grid>
                        </>
                      )
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          )}

          {Boolean(additionalDetails.length) && (
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title="Additional Details"
                sx={{
                  backgroundColor: "#2B305C",
                  color: "#fff",
                  mb: 4,
                }}
              />
              <Grid container spacing={6} p={3}>
                <Grid
                  item
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {additionalDetails?.map((field: any) =>
                    field?.fieldType === "dropdownField" ? (
                      <>
                        <Grid item xs={6} mt={-8}>
                          <FormControl margin="normal" fullWidth>
                            <InputLabel
                              htmlFor={field.fieldKey}
                              sx={{ marginTop: "10px", marginLeft: "8px" }}
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
                              placeholder={field?.fieldPlaceholder}
                              onChange={formik.handleChange}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <MenuItem
                                  key={option.optionValue}
                                  value={option?.optionValue}
                                >
                                  {option?.optionLabel}
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "textareaAddressField" ? (
                      <>
                        {" "}
                        <Grid item xs={6} key={field._id} mt={-8}>
                          {" "}
                          <FormControl
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          >
                            <InputLabel
                              htmlFor={field.fieldKey}
                              sx={{ marginTop: "10px", marginLeft: "8px" }}
                            >
                              {field?.fieldLabel}
                            </InputLabel>
                            <Select
                              key={field._id}
                              style={{ margin: "10px" }}
                              label={field?.fieldLabel}
                              fullWidth
                              sx={{ borderRadius: "15px" }}
                              id={field.fieldKey}
                              name={field.fieldKey}
                              placeholder={field?.fieldPlaceholder}
                              value={formik.values[field.fieldKey] || ""}
                              onChange={formik.handleChange}
                            >
                              {contactPerson?.address?.map((option: any) => (
                                <MenuItem
                                  key={option._id}
                                  value={`${option?.label}, ${option?.addressLine1}, ${option?.landmark}, ${option?.city}, ${option?.state}, Pin:${option?.pincode} `}
                                >
                                  <Typography>{option?.label}</Typography>
                                  <Typography>
                                    {option?.addressLine1}
                                  </Typography>
                                  <Typography>{option?.landmark}</Typography>
                                  <Box sx={{ display: "flex" }}>
                                    <Typography>{option?.city}</Typography>
                                    <Typography>{option?.state}</Typography>
                                    <Typography>
                                      ,{option?.pincode}
                                    </Typography>{" "}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "radioOptionField" ? (
                      <>
                        <Grid item xs={12} key={field._id} mt={-8}>
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
                              placeholder={field?.fieldPlaceholder}
                              value={formik.values[field.fieldKey] || ""}
                              onChange={formik.handleChange}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <FormControlLabel
                                  key={option.optionValue}
                                  value={option.optionValue}
                                  control={<Radio />}
                                  label={option.optionLabel}
                                />
                              ))}
                            </RadioGroup>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
                              </p>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    ) : field?.fieldType === "checkboxOptionField" ? (
                      <>
                        <Grid item xs={12} key={field._id} mt={-8}>
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
                                color: "grey",
                                flexDirection: "row",
                              }}
                            >
                              {field?.fieldOptions?.map((option: any) => (
                                <FormControlLabel
                                  key={option.optionValue}
                                  control={
                                    <Checkbox
                                      checked={formik.values[
                                        field.fieldKey
                                      ]?.includes(option.optionValue)}
                                      // onChange={
                                      //     formik.handleChange
                                      // }

                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        formik.setFieldValue(
                                          field.fieldKey,
                                          isChecked
                                            ? [
                                              ...(formik.values[
                                                field.fieldKey
                                              ] || []),
                                              option.optionValue,
                                            ]
                                            : formik.values[
                                              field.fieldKey
                                            ]?.filter(
                                              (val: any) =>
                                                val !== option.optionValue
                                            ) || []
                                        );
                                        if (!isChecked) {
                                          formik.setErrors({
                                            [field.fieldKey]: `Supply Region is required`,
                                          });
                                        }
                                      }}
                                      onBlur={formik.handleBlur}
                                    // onBlur={() => {
                                    //     formik.setFieldTouched(field.fieldKey, true);
                                    // }}
                                    />
                                  }
                                  label={option.optionLabel}
                                />
                              ))}
                            </FormGroup>
                            {formik.touched[field.fieldKey] &&
                              formik.errors[field.fieldKey] &&
                              Array.isArray(formik.errors[field.fieldKey]) ? (
                              formik.errors[field.fieldKey].map(
                                (error: any, index: any) => (
                                  <p
                                    key={index}
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    {error}
                                  </p>
                                )
                              )
                            ) : (
                              <p style={{ color: "red", marginLeft: "10px" }}>
                                {formik.errors[field.fieldKey]}
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
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values[field.fieldKey] || ""}
                              style={{ margin: "10px" }}
                            />{" "}
                          </FormControl>
                          {formik.touched[field.fieldKey] &&
                            formik.errors[field.fieldKey] &&
                            Array.isArray(formik.errors[field.fieldKey]) ? (
                            formik.errors[field.fieldKey].map(
                              (error: any, index: any) => (
                                <p
                                  key={index}
                                  style={{ color: "red", marginLeft: "10px" }}
                                >
                                  {error}
                                </p>
                              )
                            )
                          ) : (
                            <p style={{ color: "red", marginLeft: "10px" }}>
                              {formik.errors[field.fieldKey]}
                            </p>
                          )}
                        </Grid>
                      </>
                    )
                  )}
                </Grid>
              </Grid>
            </Card>
          )}

          <Box sx={{ marginLeft: "30px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="isAdditionalActive"
                  name="isAdditionalActive"
                  checked={formik.values.isAdditionalActive}
                  onChange={(e) => {
                    // Ensure only true or false is set for isAltMobile
                    formik.handleChange(e);
                    handleClickOpen1();
                    formik.setFieldValue(
                      "isAdditionalActive",
                      e.target.checked
                    );
                    setShowAdditionalCatalog(true);
                  }}
                />
              }
              label="Do you want to display the same listing in another catalogue type also?"
            />
            {additionalCatalogArray.length > 0 && (
              // <Grid container spacing={1} direction="row" mb={3}>
              //   {additionalCatalogArray.map((item, index) => (
              //     <>
              //       <Grid item xs={4} key={index}>
              //         <Chip
              //           label={item.slice(0, 20)}
              //           variant="outlined"
              //           onDelete={() => handleDeleteCatalog(item)}
              //         />
              //       </Grid>
              //     </>
              //   ))}
              // </Grid>

              <Grid container spacing={1} direction="row" mb={3}>
                {additionalCatalogArray.map((id, index) => {
                  const selectedCatalog = catalogList.find(
                    (option: any) => option._id === id
                  );
                  return (
                    <Grid container key={index}>
                      <Grid item xs={4} key={index}>
                        <Chip
                          sx={{ mt: 2 }}
                          label={
                            selectedCatalog
                              ? selectedCatalog.name.slice(0, 20)
                              : ""
                          }
                          variant="outlined"
                          onDelete={() => handleDeleteCatalog(id)}
                        />
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>

          <form>
            <Dialog open={openDialog1} onClose={handleClose1}>
              <DialogTitle>
                AdditionalCatalog
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                  onClick={handleClose1}
                >
                  <CloseIcon sx={{ cursor: "pointer" }} />
                </Box>
              </DialogTitle>
              <DialogContent>
                {catalogList.map((option) => (
                  <MenuItem
                    key={option._id}
                    value={option._id}
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
                      <Image
                        src={option.icon}
                        style={{ marginRight: "5px" }}
                        width={20}
                        height={20}
                        alt="catalog icon"
                      />
                      <Typography variant="body1" color="initial">
                        {option.name}
                      </Typography>
                    </Box>

                    <Box>
                      <Checkbox
                        checked={additionalCatalogArray.includes(option._id)}
                        onChange={(e) => {
                          if (additionalCatalogArray.length < 2) {
                            handleCheckboxClick1(option._id);
                          } else {
                            handleClose1();
                            Swal.fire({
                              title: "Additional Catalog",
                              html: "Only <strong>2</strong> Additional Catalog Can be Selected",
                              icon: "warning",
                            });
                          }
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => {
                    handleClose1();
                  }}
                >
                  Save changes
                </Button>
              </DialogActions>
            </Dialog>
          </form>

          <Box sx={{ marginLeft: "30px" }}>
            {" "}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isTermsChecked}
                  onChange={formik.handleChange}
                  name="isTermsChecked"
                />
              }
              label="I agree to the terms and conditions"
            />
            {formik.touched.isTermsChecked && formik.errors.isTermsChecked && (
              <p style={{ color: "red" }}>{formik.errors.isTermsChecked}</p>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              marginTop: "20px",
              alignItems: "flex-end",
              justifyContent: "end",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                margin: "30px",
                marginTop: "0px",
                backgroundColor: "#2B376E",
                color: "#FFFFFF",
                borderRadius: 25,
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
      <Toaster position={'top-right'} />
    </>
  );
}

export default Page;
