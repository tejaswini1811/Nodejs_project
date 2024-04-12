"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { IconCashBanknote, IconCreditCard, IconFile } from '@tabler/icons-react';
import { useAppselector } from "@/redux/store";
import createAxiosInstance from "@/app/axiosInstance";
import dayjs from "dayjs";
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentsIcon from '@mui/icons-material/Payments';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type WalletInfo = {
    balance: number;

};

export default function WalletInfo() {

    const [walletInfo, setWalletInfo] = useState<WalletInfo | undefined>(undefined);
    const [walletHistory, setWalletHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [transactionCount, setTransactionCount] = useState(10);

    const pathname = usePathname();
    const axiosInstance = createAxiosInstance();

    const { _id } = useAppselector((state) => state?.user.value);
    const userId: any = _id;

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        formik.resetForm();
    };


    const fetchWalletInfo = async () => {
        try {
            const response = await axiosInstance.get(
                `wallet/wallet-info/${userId}`
            );

            const newData = response?.data?.data;
            setWalletInfo(newData);

            setLoading(false);
        } catch (error: any) {
            console.log(error);

            setLoading(false);
        }
    };

    const fetchWalletHistory = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`wallet/wallet-history/${userId}`);
            const newData = response?.data?.data;
            setWalletHistory(prevData => [...prevData, ...newData]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setTransactionCount(prevCount => prevCount + 10);
    };


    useEffect(() => {
        if (userId) {
            fetchWalletInfo();
            fetchWalletHistory();
        }
    }, [userId]);

    const validationSchema = Yup.object({
        paymentOptions: Yup.string().required("Payment Options is required"),
        amount: Yup.number()
            .required("Amount is required")
            .positive("Amount must be greater than 0")
            .max(walletInfo?.balance || 0, "Insufficient Points"),
        note: Yup.string().required("Note is required"),
        mobile: Yup.string().required("Mobile Number is required"),
        // upiId: Yup.string().required("UPI Id is required"),
        // bankAccountNumber: Yup.string().required("Bank Acount Number is required"),
        // ifscCode: Yup.string().required("IFSC is required"),
        // accountHolderName: Yup.string().required("User Name is required"),
    });

    const formik = useFormik({
        initialValues: {
            paymentOptions: "",
            amount: "",
            note: "",
            mobile: "",
            upiId: "",
            bankAccountNumber: "",
            ifscCode: "",
            accountHolderName: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axiosInstance.post('/wallet/reedmption-form', {
                    amount: values.amount,
                    paymentOptions: values.paymentOptions,
                    upiId: values.upiId,
                    note: values.note,
                    mobile: values.mobile,
                    bankAccountNumber: values.bankAccountNumber,
                    ifscCode: values.ifscCode,
                    accountHolderName: values.accountHolderName,
                });
                if (response.status === 200) {
                    toast.success('Form submitted successfully.');
                    handleCloseDialog();
                    resetForm();
                    fetchWalletHistory();
                }
            } catch (error: any) {
                console.error('Error submitting form:', error.message);
                const errorMsg = error?.response?.data?.data || 'An error occurred.';
                toast.error(errorMsg);
            }
        },
    });

    useEffect(() => {

        if (formik.values.paymentOptions === 'upi') {
            formik.setValues({
                ...formik.values,
                bankAccountNumber: "",
                ifscCode: "",
                accountHolderName: "",
            });
        } else if (formik.values.paymentOptions === 'bankAccount') {
            formik.setValues({
                ...formik.values,
                upiId: "",
            });
        }
    }, [formik.values.paymentOptions]);


    return (
        <>
            <ToastContainer />
            <Grid
                container
                spacing={2}
                sx={{
                    marginLeft: "0px",
                    marginTop: "0px",
                    paddingLeft: "0px",
                    paddingTop: "0px",
                    width: "100% !important",
                }}
            >
                <Box
                    sx={{
                        marginLeft: "0px !important",
                        marginTop: "0px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        width: "100% !important",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <h2 style={{ color: "#2B376E" }}> Home {pathname}</h2>

                    {/* <Stack spacing={1} direction={"row"}>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleOpenDialog}
                        sx={{ background: "#2B305C !important", color: "#fff" }}
                    >
                        Add Funds
                    </Button>
                </Box>
            </Stack> */}
                </Box>
            </Grid>
            <PageContainer>
                <DashboardCard>
                    <>
                        <Grid item xs={12}>
                            <Box>
                                <Paper elevation={1}
                                    sx={{
                                        height: "100px", width: "100%", display: "flex",
                                        alignItems: "center", justifyContent: "center", flexDirection: "column", borderRadius: "10px"
                                    }}>
                                    {walletInfo && (
                                        <Typography sx={{ fontSize: "24px", fontWeight: "900" }}>
                                            ₹ Rs. {walletInfo.balance}
                                        </Typography>
                                    )}
                                    <Typography sx={{ fontSize: "14px", mt: "10px", fontWeight: "100" }}>
                                        Total Available Balance
                                    </Typography>
                                    {/* <Button variant="contained"
                                        color="primary"
                                        onClick={handleOpenDialog}
                                        sx={{ background: "#2B305C !important", color: "#fff" }}>Redeem</Button> */}
                                    <Dialog
                                        open={openDialog}
                                        onClose={handleCloseDialog}
                                        maxWidth="xs"
                                        fullWidth
                                        sx={{
                                            borderRadius: "25px !important",
                                        }}
                                    >
                                        <DialogTitle
                                            sx={{
                                                backgroundColor: "#2B305C",
                                                textAlign: "center",
                                                color: "#fff",
                                                display: "relative",
                                            }}
                                        >
                                            Wallet
                                            <Button
                                                onClick={handleCloseDialog}
                                                color="primary"
                                                sx={{ position: "absolute", right: "1px", top: "9px" }}
                                            >
                                                <CancelOutlinedIcon sx={{ color: "#fff" }} />
                                            </Button>
                                        </DialogTitle>
                                        <DialogContent
                                            sx={{
                                                paddingX: "15px",
                                                paddingTop: "10px !important",
                                                paddingBottom: "15px",
                                            }}
                                        >
                                            <Grid
                                                container
                                                spacing={2}
                                                sx={{
                                                    marginLeft: "0px",
                                                    marginTop: "0px",
                                                    paddingLeft: "0px",
                                                    paddingTop: "0px",
                                                    width: "100% !important",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        alignItems: "center",
                                                        padding: "10px",
                                                        gap: "10px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <form
                                                        onSubmit={formik.handleSubmit}
                                                        style={{ width: "100%" }}
                                                    >
                                                        <FormControl sx={{ width: "100%", mb: "10px" }}>
                                                            <Typography
                                                                sx={{
                                                                    fontFamily: "Poppins",
                                                                    fontSize: 14,
                                                                    fontWeight: 500,
                                                                    color: "#333542",
                                                                    mb: "5px",
                                                                }}
                                                            >
                                                                Amount
                                                            </Typography>
                                                            <TextField
                                                                type='number'
                                                                id="amount"
                                                                name="amount"
                                                                placeholder="Amount"
                                                                value={formik.values.amount}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
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
                                                            {formik.touched.amount && formik.errors.amount && (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="error"
                                                                    sx={{ my: 1 }}
                                                                >
                                                                    {formik.errors.amount}
                                                                </Typography>
                                                            )}
                                                        </FormControl>

                                                        <FormControl
                                                            fullWidth
                                                            sx={{ width: "100%", mb: "10px" }}
                                                        >
                                                            <InputLabel id="demo-simple-select-label">
                                                                Payment Options
                                                            </InputLabel>
                                                            <Select
                                                                sx={{
                                                                    borderRadius: 25,
                                                                    width: "100%",
                                                                    color: "#64758B",
                                                                    fontFamily: "Poppins",
                                                                    fontSize: "14px",
                                                                    fontWeight: 400,
                                                                }}
                                                                name="paymentOptions"
                                                                value={formik.values.paymentOptions}
                                                                onBlur={formik.handleBlur}
                                                                onChange={formik.handleChange}
                                                                fullWidth
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                label="Payment Options"
                                                            >
                                                                <MenuItem value="upi">UPI</MenuItem>
                                                                <MenuItem value="bankAccount">Bank Account</MenuItem>
                                                            </Select>
                                                            {formik.values.paymentOptions === 'upi' && (
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder="UPI Id"
                                                                    name="upiId"
                                                                    value={formik.values.upiId}
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={formik.handleChange}
                                                                    InputProps={{
                                                                        sx: {
                                                                            borderRadius: "25px",
                                                                            marginTop: 2,
                                                                        },
                                                                    }}
                                                                    error={formik.touched.upiId && Boolean(formik.errors.upiId)}
                                                                    helperText={formik.touched.upiId && formik.errors.upiId}
                                                                />
                                                            )}
                                                            {formik.values.paymentOptions === 'bankAccount' && (
                                                                <>
                                                                    <TextField
                                                                        fullWidth
                                                                        placeholder="Bank Account Number"
                                                                        name="bankAccountNumber"
                                                                        value={formik.values.bankAccountNumber}
                                                                        onBlur={formik.handleBlur}
                                                                        onChange={formik.handleChange}
                                                                        InputProps={{
                                                                            sx: {
                                                                                borderRadius: "25px",
                                                                                marginTop: 2,
                                                                            },
                                                                        }}
                                                                        error={formik.touched.bankAccountNumber && Boolean(formik.errors.bankAccountNumber)}
                                                                        helperText={formik.touched.bankAccountNumber && formik.errors.bankAccountNumber}
                                                                    />
                                                                    <TextField
                                                                        fullWidth
                                                                        placeholder="IFSC"
                                                                        name="ifscCode"
                                                                        value={formik.values.ifscCode}
                                                                        onBlur={formik.handleBlur}
                                                                        onChange={formik.handleChange}
                                                                        InputProps={{
                                                                            sx: {
                                                                                borderRadius: "25px",
                                                                                marginTop: 2,
                                                                            },
                                                                        }}
                                                                        error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
                                                                        helperText={formik.touched.ifscCode && formik.errors.ifscCode}
                                                                    />
                                                                    <TextField
                                                                        fullWidth
                                                                        placeholder="User Name"
                                                                        name="accountHolderName"
                                                                        value={formik.values.accountHolderName}
                                                                        onBlur={formik.handleBlur}
                                                                        onChange={formik.handleChange}
                                                                        InputProps={{
                                                                            sx: {
                                                                                borderRadius: "25px",
                                                                                marginTop: 2,
                                                                            },
                                                                        }}
                                                                        error={formik.touched.accountHolderName && Boolean(formik.errors.accountHolderName)}
                                                                        helperText={formik.touched.accountHolderName && formik.errors.accountHolderName}
                                                                    />
                                                                </>
                                                            )}
                                                            {formik.touched.paymentOptions &&
                                                                formik.errors.paymentOptions && (
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="error"
                                                                        sx={{ my: 1 }}
                                                                    >
                                                                        {formik.errors.paymentOptions}
                                                                    </Typography>
                                                                )}
                                                        </FormControl>
                                                        <FormControl sx={{ width: "100%", mb: "10px" }}>
                                                            <Typography
                                                                sx={{
                                                                    fontFamily: "Poppins",
                                                                    fontSize: 14,
                                                                    fontWeight: 500,
                                                                    color: "#333542",
                                                                    mb: "5px",
                                                                }}
                                                            >
                                                                Mobile
                                                            </Typography>
                                                            <TextField
                                                                type='tel'
                                                                id="mobile"
                                                                name="mobile"
                                                                placeholder="Mobile"
                                                                value={formik.values.mobile}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            +91
                                                                        </InputAdornment>
                                                                    ),
                                                                    sx: {
                                                                        borderRadius: 25,
                                                                        width: "100%",
                                                                        color: "#64758B",
                                                                        fontFamily: "Poppins",
                                                                        fontSize: "14px",
                                                                        fontWeight: 400,
                                                                        backgroundColor: "#FFFFFF"
                                                                    },
                                                                    inputProps: {
                                                                        maxLength: 10,
                                                                        pattern: '[0-9]*',
                                                                        inputMode: 'numeric',
                                                                    },

                                                                }}
                                                            />
                                                            {formik.touched.mobile && formik.errors.mobile && (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="error"
                                                                    sx={{ my: 1 }}
                                                                >
                                                                    {formik.errors.mobile}
                                                                </Typography>
                                                            )}
                                                        </FormControl>

                                                        <FormControl
                                                            sx={{ width: "100%", marginBottom: "10px" }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontFamily: "Poppins",
                                                                    fontSize: 14,
                                                                    fontWeight: 500,
                                                                    color: "#333542",
                                                                    mb: "5px",
                                                                }}
                                                            >
                                                                Note
                                                            </Typography>
                                                            <TextField
                                                                multiline
                                                                id="note"
                                                                name="note"
                                                                rows={4}
                                                                placeholder="Enter your Notes"
                                                                value={formik.values.note}
                                                                onChange={formik.handleChange}
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
                                                            />
                                                            {formik.touched.note &&
                                                                formik.errors.note && (
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="error"
                                                                        sx={{ mt: 1 }}
                                                                    >
                                                                        {formik.errors.note}
                                                                    </Typography>
                                                                )}
                                                        </FormControl>

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: "10px",
                                                                mt: "10px",
                                                                justifyContent: "center",
                                                            }}
                                                        >


                                                            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                                                                <FormControl>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="primary"
                                                                        sx={{
                                                                            backgroundColor: "#2B305C",
                                                                            padding: "6px 35px",
                                                                            marginRight: '10px',
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </Button>
                                                                </FormControl>
                                                                <FormControl>
                                                                    <Button
                                                                        onClick={handleCloseDialog}

                                                                        variant="contained"
                                                                        color="primary"
                                                                        sx={{
                                                                            backgroundColor: "#2B305C",
                                                                            padding: "6px 35px",
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </FormControl>
                                                            </Box>

                                                        </Box>
                                                    </form>
                                                </Box>
                                            </Grid>
                                        </DialogContent>
                                    </Dialog>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ padding: "10px" }}>
                                <Box>
                                    <Typography sx={{ mt: "20px", fontSize: "20px", fontWeight: "900" }}>Transaction History</Typography>
                                </Box>
                                {walletHistory.slice(0, transactionCount).map((item, index) => (
                                    <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mt: "20px" }}>
                                        <Box sx={{ display: "flex", gap: "20px" }}>
                                            <div style={{ backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "10px" }}>
                                                {item.transactionType === "credit" ? (
                                                    <PaymentIcon />
                                                ) : (
                                                    <PaymentsIcon />
                                                )}
                                            </div>
                                            <div>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "700" }}>  {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss A")}</Typography>
                                                <Typography sx={{ fontSize: "14px", fontWeight: "200", color: item.transactionType === "credit" ? "green" : "red", }}> {item.transactionType}</Typography>
                                            </div>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Typography sx={{ fontSize: "14px", fontWeight: "600", color: item.transactionType === "credit" ? "green" : "red", }}>₹ Rs. {item.amount}</Typography>
                                            <Typography sx={{ fontSize: "14px", fontWeight: "600", color: item.transactionType === "credit" ? "green" : "red", }}>{item.transactionStatus}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
                                {walletHistory.length > transactionCount && (
                                    <Button onClick={handleLoadMore} disabled={loading}
                                        variant="contained"
                                        color="primary"
                                        sx={{ background: "#2B305C !important", color: "#fff" }}
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                    </Button>
                                )}
                                </div>
                            </Box>
                        </Grid>
                    </>
                </DashboardCard>
            </PageContainer>

        </>
    )
}
