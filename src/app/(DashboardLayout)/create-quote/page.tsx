"use client";
import createAxiosInstance from "@/app/axiosInstance";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams, usePathname } from "next/navigation";
import {
    Box,
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
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppselector } from "@/redux/store";
import { useRouter } from "next/navigation";


function CreateQuote() {
    const [quoteForm, setQuoteForm] = useState<any>([]);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const catalogueId = searchParams.get("catalogueId");
    const businessId = searchParams.get("businessId");
    const createdBusinessId = searchParams.get("createdBusinessId");
    const bussinessListingId = searchParams.get("bussinessListingId");
    const rfqId = searchParams.get("rfqId");
    const { _id } = useAppselector((state) => state?.user.value);
    const router = useRouter();

    const fetchQuoteForm = async () => {
        const axiosInstance = createAxiosInstance();

        try {
            const response = await axiosInstance.get(
                `/quote/quote_attributes/form?catalogId=${catalogueId}&language=English`
            );

            const newData = response.data.data.form;

            setQuoteForm(newData);
        } catch (error) {
            console.error("Error fetching RFQ details:", error);
            toast.error("An error occurred while fetching RFQ details");
        }
    };
    useEffect(() => {
        fetchQuoteForm();
    }, []);

    // console.log("################################", quoteForm);
    const defaultSelect: any = {
        id: "000111",
        label: "All India",
    };

    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablets = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

    const generateDynamicValidationSchema = (dynamicFields: any) => {
        const dynamicSchema: any = {};

        dynamicFields.forEach((field: any) => {
            if (field.fieldValidations && field.fieldValidations.isMandatory) {
                dynamicSchema[field.fieldKey] = Yup.string().required(
                    `${field.fieldLabel} is required`
                );

                // console.log('fieldsss', field.fieldKey)
            }
        });

        return dynamicSchema;
    };
    const dynamicFormValidationSchema: any =
        generateDynamicValidationSchema(quoteForm);

    const validationSchema = Yup.object().shape({
        stringValue: Yup.string(),
        checkboxValue: Yup.boolean(),
        additionalCatalog: Yup.array(),
        ...dynamicFormValidationSchema,
    });

    const formik: any = useFormik({
        initialValues: {
            additionalNote: ''
        },
        validationSchema,
        onSubmit: async (values: any) => {
            try {
                const axiosInstance = createAxiosInstance();
                const updateFormValues = quoteForm.map(
                    (field: any) => ({
                        id: field?.id,
                        name: field?.fieldLabel,
                        nameTranslation: field?.nameTranslation,
                        fieldType: field?.fieldType,
                        fieldKey: field?.fieldKey,
                        fieldDependent: field?.fieldDependent || "",
                        valueString: values?.[field.fieldKey],
                        valueBoolean: false,
                        valueArray: []
                    })
                );

                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',updateFormValues)
                await axiosInstance.post(`/quote/create`,
                    {
                        attributes: updateFormValues,
                        forBusinessId: createdBusinessId,
                        createdByBusinessId: businessId,
                        businessListingId: bussinessListingId,
                        rfqId: rfqId,
                        catalogId: catalogueId,
                        contactPerson: _id,
                        additionalNote: values.additionalNote,
                    })
                    .then((res) => {
                        toast.success("Quote submitted successfully");
                        router.push("/rfqs");
                    });

            } catch (error: any) {
                toast.error(error?.message || "An error occurred");
            }
        },
    });

    const handleHover = {
        backgroundColor: "#2b305c",
        textDecoration: "none",
    };

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
                <Typography
                    sx={{
                        fontFamily: "Roboto",
                        fontSize: 20,
                        fontWeight: 400,

                        letterSpacing: "0.25px",
                        textAlign: "center",
                        color: "#2B376E",
                        ...(isMobile && { marginBottom: "20px" }),
                        ...(isTablets && { marginBottom: "20px" }),
                    }}
                >
                    {" "}
                    Home {pathname}
                </Typography>
            </Box>
            <PageContainer>
                <DashboardCard>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid
                            item
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 6, md: 12 }}
                            p={3}
                        >
                            {quoteForm?.map((field: any) =>
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
                            <Grid item xs={6} mt={-7}>
                                <FormControl
                                    margin="normal"
                                    fullWidth
                                    sx={{ borderRadius: "15px" }}
                                >
                                    <TextField
                                        type="text"
                                        label="Additional Note"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        name="additionalNote"
                                        value={formik.values.additionalNote}
                                        onChange={formik.handleChange}
                                        InputProps={{
                                        sx:{ borderRadius: "15px" }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Box
                                sx={{
                                    width: "100%",
                                    padding: "0px 20px 20px",
                                    textAlign: "right",
                                }}
                            >
                                <Button
                                    size="small"
                                    type="submit"
                                    sx={{
                                        padding: "8px 20px",
                                        background: "#2b305c",
                                        width: "auto",
                                        textAlign: "center",
                                        color: "#fff",
                                        borderRadius: "30px",
                                        ml: "0px !important",
                                        "&:hover": handleHover,
                                    }}
                                >
                                    Submit Quote
                                </Button>
                            </Box>
                        </Grid>
                    </form>
                </DashboardCard>
                <Toaster position={'top-right'} />
            </PageContainer>
        </Grid>
    );
}

export default CreateQuote;
