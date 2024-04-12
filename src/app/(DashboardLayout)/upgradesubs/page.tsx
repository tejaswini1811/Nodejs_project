"use client";
import * as React from "react";
import { Theme, ThemeProvider, createTheme } from "@mui/material";
import { Box, CssBaseline, Grid, Typography, Button } from "@mui/material";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import subscription from "@/img/subscription.jpg";
import { TextField } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import InputLabel from "@mui/material/InputLabel";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import Checkbox from "@mui/material/Checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import createAxiosInstance from "@/app/axiosInstance";
import Popover from "@mui/material/Popover";
import { subscriptionType } from "@/types/types";
import { useAppselector } from "@/redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Upgradesub() {
  const [walletBalance, setWalletBalance] = useState<any>();
  const [calculatedAmount, setCalculatedAmount] = useState('0.00');
  const [grandTotal, setGrandTotal] = useState<any>(0);
  const [walletPay, setWalletPay] = useState<any>(0);
  const [finalAmount, setFinalAmount] = useState<any>(0);
  const [previousValues, setPreviousValues] = useState({
    grandTotal: 0,
    walletPay: 0
  })
  const [oopen, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState<Boolean>(false);
  const [subscriptionData, setSubscriptionData] = useState<any>([]);
  const [topUp, setTopUp] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<any>([]);
  const [label, setLabel] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPinCode] = useState<any>();
  const [landMark, setLandMark] = useState<string>("");
  const [defaultFlag, SetDefaultFag] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [billingAddress, setBillingAddress] = useState({
    label: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const [addressRefresh, setAddressRefresh] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [nameTranslations, setNameTranslations] = useState([
    {
      value: "Warehouse",
      language: "English",
    },
  ]);
  const matches = useMediaQuery("(min-width:600px)");

  type ItemType = {
    _id: string;
    label: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: number;
  };

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");

  const pid: any = searchParams.get("pid");
  const plan = searchParams.get("plan");


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handledialogue = () => {
    setOpen(false);
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

  const open = Boolean(anchorEl);
  const id2 = open ? "simple-popover" : undefined;



  const axiosInstance = createAxiosInstance();

  useEffect(() => {

    const amount = (parseFloat(grandTotal) - parseFloat(walletPay)).toFixed(2);
    setCalculatedAmount(amount);
  }, [walletPay, grandTotal]);

  const fetchSubscription = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `subscription/all_subscription_plans`
      );
      const newData = response.data.data;


      const filteredData = newData.filter(
        (item: subscriptionType) => item._id === id
      );

      setSubscriptionData(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchTopUp = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `subscription/get/top_up_plan_list`
      );
      const newData = response.data.data;


      const filteredData = newData.filter((item: any) => item._id === id);

      setSubscriptionData(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };



  const postSubcription = async () => {


    try {
      const response = await axiosInstance.put(
        `subscription/update/subscription_plan/${id}`,
        {
          business: defaultBusinessId,
          subscriptionPlan: id,
          nameTranslations: nameTranslations,
          name: subscriptionData[0].name,
          price: subscriptionData[0].price,
          qcReportsCount: subscriptionData[0].qcReportsCount,
          businessListingCount: subscriptionData[0].businessListingCount,
          planType: subscriptionData[0].planType,
          validityInDays: subscriptionData[0].validityInDays.toString(),
        }
      );


    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateAndPost = async () => {
    await fetchSubscription(id);
    postSubcription();
  };


  useEffect(() => {
    if (subscriptionData.length) {
      setGrandTotal(subscriptionData[0].subTotal.toFixed(2))
      const prevValues = { ...previousValues };
      prevValues.grandTotal = subscriptionData[0].subTotal.toFixed(2);
      setPreviousValues(prevValues)
    }

  }, [subscriptionData])

  useEffect(() => {

    if (plan === "subs") {
      fetchSubscription(id);
    } else {
      fetchTopUp(id);
    }

  }, [id, plan]);

  const fetchAddress = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`business/address_fetch`);

      const newData = await response.data.data.address;

      setAddress(newData);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [addressRefresh]);

  const AddAddress = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(`business/add_address_user`, {
        label: label,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        pincode: parseInt(pincode),
        landmark: landMark,
        defaultFlag: defaultFlag,
      });

      const newData = await response.data.data.address;

      setAddress(newData);

    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {

    setLabel("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPinCode("");
    setLandMark("");
    SetDefaultFag(false);
    AddAddress();
  };
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setBillingAddress({
      label: item?.label,
      addressLine1: item?.addressLine1,
      addressLine2: item?.addressLine2,
      city: item?.city,
      state: item?.state,
      pincode: item?.pincode,
      landmark: item?.landmark,
    });
  };

  const handleDelete = async (item: any) => {

    const _id = item._id;
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.put(
        `business/delete_address/${_id}`
      );


    } catch (error) {
      console.log(error);
    }
  };

  const initializeRazorpay = (src: any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      if (parseFloat(calculatedAmount) === 0) {
        script.onerror = () => {
          resolve(false);

        };
        router.push("/subscription");
      } else {
        script.onload = () => {
          resolve(true);

        };
      }


      document.body.appendChild(script);
    });
  };


  const { firstName, lastName, email, mobile, defaultBusinessId, _id } =
    useAppselector((state) => state?.user.value);
  let invoiceId: any;
  let prices: any;
  let planTypes: any;
  let subTotals: any;
  let gstAmounts: any;
  let gstPercentages: any;
  let _ids: any;
  let myPrice = 9999;
  async function displayRazorpay() {
    try {
      if (subscriptionData.length > 0) {
        const { price, planType, subTotal, gstAmount, gstPercentage, _id } = subscriptionData[0];
        debugger;
        if (checked === true && parseFloat(walletPay) <= parseFloat(grandTotal) && Number(price) > 0) {
          debugger;
          const { price, planType, subTotal, gstAmount, gstPercentage, _id } =
            subscriptionData[0];
          if (Number(calculatedAmount) > 0) {
            if (plan === "subs") {
              prices = price;
              planTypes = planType;
              subTotals = calculatedAmount;
              gstAmounts = gstAmount;
              gstPercentages = gstPercentage;
              _ids = _id;

              const result = await axiosInstance.post(
                `payments/subscription_invoice/generate`,
                {
                  totalAmount: parseFloat(subTotal),
                  businessId: defaultBusinessId,
                  subscriptionPlan: _id,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "Upgrade",
                }
              );

              invoiceId = result.data.data._id;
            }
            if (plan === "topup") {
              prices = price;
              planTypes = planType;
              subTotals = calculatedAmount;
              gstAmounts = gstAmount;
              gstPercentages = gstPercentage;
              _ids = _id;

              const result = await axiosInstance.post(
                `payments/topup_invoice/generate`,
                {
                  totalAmount: parseFloat(subTotal),
                  topupPlanId: _id,
                  paymentSubscriptionId: pid,
                  businessId: defaultBusinessId,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "TopUp",
                }
              );

              invoiceId = result.data.data._id;
            }
            if (invoiceId) {
              const res = await initializeRazorpay(
                "https://checkout.razorpay.com/v1/checkout.js"
              );

              if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
              }


              const result = await axiosInstance.post(
                `payments/create_order_id`,
                {
                  amount: parseFloat(subTotals),
                  currency: "INR",
                  transactionType: "TopUp",
                  invoiceId: invoiceId,

                }
              );



              if (!result) {
                alert("Server error. Are you online?");
                return;
              }
              const { amount, id: order_id, currency } = result.data.data;

              const options = {
                key: process.env.RAZORPAY_KEY_ID || "",
                amount: amount || "",
                currency: currency,
                name: `${firstName} ${lastName}`,
                description: "Transaction for Upgrade of subscription.",

                order_id: order_id,
                handler: async function (response: any) {
                  const data = {
                    orderId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    type: "Upgrade",
                    description: "Transaction for TopUp",
                    PaymentTo: "SLCM",
                    transactionStatus: "Success",
                    PaymentFrom: `${firstName} ${lastName}`,
                    transactionAmount: amount,
                    transactionType: "CREDIT",
                    paymentType: "NEFT",
                    transactionObjective: "Payment",
                    invoiceId: invoiceId,
                    bankAccountId: "",
                  };

                  const result = await axiosInstance.post(
                    "payments/create_transaction",
                    data
                  );

                  const res = await axiosInstance.post(
                    `wallet/wallet-subscribe`,
                    {
                      amount: parseFloat(walletPay),
                    }
                  );
                  alert(result.data.message);
                  toast.success(result.data.message);
                  router.push("/subscription");
                },
                prefill: {
                  name: `${firstName} ${lastName}` || "",
                  email: { email } || "",
                  contact: { mobile } || "",
                },

                theme: {
                  color: "#3498db",
                },
              };

              const paymentObject = new (window as any).Razorpay(options);
              paymentObject.open();
            }
          }
          if (parseFloat(calculatedAmount) === 0 && plan === "topup") {
            try {
              const result: any = await axiosInstance.post(
                `payments/topup_invoice/generate`,
                {
                  totalAmount: parseInt((gstAmount + subTotal).toFixed(2)),
                  topupPlanId: _id,
                  paymentSubscriptionId: pid,
                  businessId: defaultBusinessId,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  transactionType: 'Wallet',
                  GSTPercentage: gstPercentage,
                  invoiceType: "TopUp",
                }
              );
              if (result.status === 200) {
                const res = await axiosInstance.post(
                  `wallet/wallet-subscribe`,
                  {
                    amount: parseFloat(grandTotal),
                  }
                );
                toast.success("Topup added");
                router.push(`/subscription`);
              } else {
                toast.error("Unexpected response status:", result.status);
              }
            } catch (error: any) {
              toast.error("Error making API request:", error);
            }
          }
          if (parseFloat(calculatedAmount) === 0 && plan === "subs") {
            try {
              const result: any = await axiosInstance.post(
                `payments/subscription_invoice/generate`,
                {
                  totalAmount: parseInt((gstAmount + subTotal).toFixed(2)),
                  businessId: defaultBusinessId,
                  transactionType: 'Wallet',
                  subscriptionPlan: _id,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "Upgrade",
                }
              );
              if (result?.status === 200) {
                const res = await axiosInstance.post(
                  `wallet/wallet-subscribe`,
                  {
                    amount: parseFloat(grandTotal),
                  }
                );
                toast.success("Subscription added");
                router.push(`/subscription`);
              } else {
                toast.error(
                  "Unexpected response status or data:",
                  result?.status
                );
              }
            } catch (error: any) {
              toast.error("Error making API request:", error);
            }
          }
        } else {
          debugger;
          if (Number(price) > 0) {
            if (plan === "subs") {
              prices = price;
              planTypes = planType;
              subTotals = calculatedAmount;
              gstAmounts = gstAmount;
              gstPercentages = gstPercentage;
              _ids = _id;

              const result = await axiosInstance.post(
                `payments/subscription_invoice/generate`,
                {
                  totalAmount: parseFloat(subTotal),
                  businessId: defaultBusinessId,
                  subscriptionPlan: _id,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "Upgrade",
                }
              );

              invoiceId = result.data.data._id;
            }
            if (plan === "topup") {
              prices = price;
              planTypes = planType;
              subTotals = calculatedAmount;
              gstAmounts = gstAmount;
              gstPercentages = gstPercentage;
              _ids = _id;

              const result = await axiosInstance.post(
                `payments/topup_invoice/generate`,
                {
                  totalAmount: parseFloat(subTotal),
                  topupPlanId: _id,
                  paymentSubscriptionId: pid,
                  businessId: defaultBusinessId,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "TopUp",
                }
              );

              invoiceId = result.data.data._id;
            }
            if (invoiceId) {
              const res = await initializeRazorpay(
                "https://checkout.razorpay.com/v1/checkout.js"
              );

              if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
              }


              const result = await axiosInstance.post(
                `payments/create_order_id`,
                {
                  amount: parseFloat(subTotals),
                  currency: "INR",
                  transactionType: "TopUp",
                  invoiceId: invoiceId,

                }
              );



              if (!result) {
                alert("Server error. Are you online?");
                return;
              }
              const { amount, id: order_id, currency } = result.data.data;

              const options = {

                key: process.env.RAZORPAY_KEY_ID || "",
                amount: amount || "",
                currency: currency,
                name: `${firstName} ${lastName}`,
                description: "Transaction for Upgrade of subscription.",

                order_id: order_id,
                handler: async function (response: any) {
                  const data = {
                    orderId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    type: "Upgrade",
                    description: "Transaction for TopUp",
                    PaymentTo: "SLCM",
                    transactionStatus: "Success",
                    PaymentFrom: `${firstName} ${lastName}`,
                    transactionAmount: amount,
                    transactionType: "CREDIT",
                    paymentType: "NEFT",
                    transactionObjective: "Payment",
                    invoiceId: invoiceId,
                    bankAccountId: "",
                  };

                  const result = await axiosInstance.post(
                    "payments/create_transaction",
                    data
                  );
                  alert(result.data.message);
                  toast.success(result.data.message);
                  router.push("/subscription");
                },
                prefill: {
                  name: `${firstName} ${lastName}` || "",
                  email: { email } || "",
                  contact: { mobile } || "",
                },

                theme: {
                  color: "#3498db",
                },
              };

              const paymentObject = new (window as any).Razorpay(options);
              paymentObject.open();
            }
          }
          if (price === "0" && plan === "topup") {
            try {
              const result: any = await axiosInstance.post(
                `payments/topup_invoice/generate`,
                {
                  totalAmount: parseInt((gstAmount + subTotal).toFixed(2)),
                  topupPlanId: _id,
                  paymentSubscriptionId: pid,
                  businessId: defaultBusinessId,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "TopUp",
                }
              );
              if (result.status === 200) {
                toast.success("Topup added");
                router.push(`/subscription`);
              } else {
                toast.error("Unexpected response status:", result.status);
              }
            } catch (error: any) {
              toast.error("Error making API request:", error);
            }
          }
          if (price === 0 && plan === "subs") {
            try {
              const result: any = await axiosInstance.post(
                `payments/subscription_invoice/generate`,
                {
                  totalAmount: parseInt((gstAmount + subTotal).toFixed(2)),
                  businessId: defaultBusinessId,
                  subscriptionPlan: _id,
                  billingAddress: address[0],
                  couponId: "",
                  couponDiscount: 0,
                  GSTAmount: gstAmount,
                  GSTPercentage: gstPercentage,
                  invoiceType: "Upgrade",
                }
              );
              if (result?.status === 200) {
                toast.success("Subscription added");
                router.push(`/subscription`);
              } else {
                toast.error(
                  "Unexpected response status or data:",
                  result?.status
                );
              }
            } catch (error: any) {
              toast.error("Error making API request:", error);
            }
          }
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const handleCheckboxChange = (event: any) => {
    if (event.target.checked === true) {
      setChecked(true);
      if (walletBalance > grandTotal) {
        setWalletPay(grandTotal);
        let total = walletBalance - grandTotal;
        setWalletBalance(total);
        setFinalAmount(0);
      } else {
        setWalletPay(walletBalance);
        let total = grandTotal - walletBalance;
        setFinalAmount(total.toFixed(2));
        setWalletBalance(0);
      }
    } else {
      setWalletBalance(walletBalance + parseFloat(walletPay)); // Ensure walletBalance remains a number
      setWalletPay(0);
      // Displaying wallet balance with 0 decimal places
      setFinalAmount(parseFloat(grandTotal).toFixed(2).replace(/\.0+$/, ""));
    }
  };
  

  const fetchWalletInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `wallet/wallet-info/${_id}`
      );

      const newData = response?.data?.data?.balance;
      setWalletBalance(newData);

      setLoading(false);
    } catch (error: any) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (_id) {
      fetchWalletInfo();

    }
  }, [_id]);

  return (
    <>
      <Box
        sx={{
          marginY: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ToastContainer />
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontSize: 20,
            fontWeight: 400,

            letterSpacing: "0.25px",
            textAlign: "center",
            color: "#2B376E",
          }}
        >
          {" "}
          Home {pathname}
        </Typography>
      </Box>
      <PageContainer>
        <DashboardCard>
          <Box sx={{ padding: "10px", width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                height: "650px",
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
                marginTop: "25px",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {matches == false ? (
                    ""
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Image
                          src={subscription}
                          alt="subscription img"
                          width={500}
                        />
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ width: matches ? "50%" : "100%" }}>
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>
                        {subscriptionData.map((item: any) => (
                          <div key={item.id}>
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
                                  fontSize: "16px",
                                  fontWeight: 500,

                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#333542",
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontSize: "20px",
                                  fontWeight: 600,

                                  letterSpacing: "0em",
                                  textAlign: "left",
                                  color: "#2B376E",
                                }}
                              >
                                ₹{item.price}
                              </Typography>
                            </Box>
                            <Box sx={{ marginTop: "10px" }}>
                              <Typography
                                sx={{
                                  textAlign: "left",
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 500,

                                  letterSpacing: "0em",
                                  color: "#333542",
                                }}
                              >
                                {item.qcReportsCount} QC Report
                              </Typography>
                              <Typography
                                sx={{
                                  textAlign: "left",
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontWeight: 500,

                                  letterSpacing: "0em",
                                  color: "#333542",
                                }}
                              >
                                {item.businessListingCount} Business Listing
                                count
                              </Typography>
                            </Box>
                          </div>
                        ))}
                      </div>
                    )}

                    <Box sx={{ marginY: "20px" }}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: "25px",
                          height: "45px",
                          gap: "15px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",

                          padding: "7px, 10.5px, 7px, 15px",

                          border: 1,

                          background: "#FFFFFF",
                          borderColor: "#CBD5E1",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <DiscountIcon
                            sx={{
                              width: "24px",
                              height: "24px",

                              border: "2px",
                              color: "#BFC8D6",
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,

                              letterSpacing: "0em",
                              textAlign: "left",
                              color: "#64758B",
                              textTransform: "none",
                            }}
                          >
                            Get discount by coupon code
                          </Typography>{" "}
                        </Box>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontFamily: "Material Icons",
                            fontSize: "24px",
                            fontWeight: 400,

                            letterSpacing: "0em",
                            textAlign: "center",
                            color: "#2B376E",
                          }}
                        />
                      </Button>

                    </Box>
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
                          fontSize: "16px",
                          fontWeight: 500,

                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#333542",
                        }}
                      >
                        Billing Address*
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            cursor: "pointer",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: 600,

                            letterSpacing: "0em",
                            textAlign: "left",
                            color: "#2B376E",
                          }}
                          onClick={handleClickOpen}
                        >
                          Select or Add Address
                        </Typography>
                        <InfoOutlinedIcon
                          sx={{
                            width: "24px",
                            height: "24px",

                            color: "#000000",
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ marginTop: "10px" }}>
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{ textAlign: "left" }}
                      >
                        {selectedItem?.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {selectedItem?.addressLine2}
                        {selectedItem?.addressLine1}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="initial"
                        sx={{ textAlign: "left" }}
                      >
                        {selectedItem?.city} - {selectedItem?.pincode}
                      </Typography>
                    </Box>
                    <Box sx={{ marginTop: "30px" }}>
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        <div>
                          {subscriptionData.map((item: any) => (
                            <div key={item.id}>
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
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Total Amount
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "20px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  ₹{item.price}
                                </Typography>
                              </Box>
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
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Coupon Discount
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "20px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  -
                                </Typography>
                              </Box>
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
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  GST ({item.gstPercentage}%)
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "20px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  ₹{item.gstAmount}
                                </Typography>
                              </Box>
                              <Divider sx={{ marginY: "20px" }} />
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
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Grand Total
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "20px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  ₹{grandTotal}
                                </Typography>
                              </Box>
                              {walletPay > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mt: "10px"
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      letterSpacing: "0em",
                                      textAlign: "left",
                                      color: "#333542",
                                    }}
                                  >
                                    Wallet Pay
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontSize: "20px",
                                      fontWeight: 600,
                                      letterSpacing: "0em",
                                      textAlign: "left",
                                      color: "#2B376E",
                                    }}
                                  >
                                    ₹{walletPay}
                                  </Typography>
                                </Box>
                              )}

                              <Divider sx={{ marginY: "20px" }} />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mt: "5px"
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "16px",
                                    fontWeight: 500,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#333542",
                                  }}
                                >
                                  Payable Amount
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    fontSize: "20px",
                                    fontWeight: 600,

                                    letterSpacing: "0em",
                                    textAlign: "left",
                                    color: "#2B376E",
                                  }}
                                >
                                  ₹{calculatedAmount}
                                </Typography>
                              </Box>
                            </div>
                          ))}
                        </div>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccountBalanceWalletIcon sx={{ marginRight: "10px" }} />
                        <Typography sx={{
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: walletBalance > 0 ? "green" : "gray",
                        }}>Wallet Balance:</Typography>
                        {walletBalance && (
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: walletBalance > 0 ? "green" : "gray",
                            }}
                          >
                             {Number.isInteger(walletBalance) ? walletBalance.toFixed(0) : walletBalance.toFixed(2)}
                          </Typography>
                        )}
                      </Box>


                      <Checkbox
                        onChange={handleCheckboxChange}
                      />

                      <Button
                        variant="contained"
                        onClick={displayRazorpay}
                        sx={{
                          backgroundColor: "#2B376E",
                          borderRadius: "25px",
                          textTransform: "none",
                          paddingX: "60px",
                          paddingY: "7px",
                          width: "207px",
                          height: "45px",
                          padding: "0px, 16px, 0px, 16px",
                          gap: "16px",
                        }}
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
                          Pay now
                        </Typography>
                      </Button>
                    </Box>
                    <Dialog
                      fullWidth={true}
                      maxWidth={"lg"}
                      open={oopen}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handledialogue}
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle
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
                        <HighlightOffOutlinedIcon
                          onClick={handledialogue}
                          sx={{
                            cursor: "pointer",
                            width: "32px",
                            height: "32px",
                            color: "#2B376E",
                          }}
                        />
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          <Grid
                            container
                            spacing={20}
                            sx={{
                              marginLeft: "0px",
                              marginTop: "0px",
                              padding: "0px !important",
                              width: "100%",
                            }}
                          >
                            <Grid
                              item
                              spacing={2}
                              sx={{
                                height: "auto",
                                overflow: "auto",
                                maxHeight: "60vh",
                                padding: "10px 10px 10px 10px !important",
                                margin: "0px !important",
                              }}
                            >
                              {address === 0 ? (
                                <Box>
                                  <Typography variant="body1" color="initial">
                                    Loading
                                  </Typography>
                                </Box>
                              ) : (
                                address.map((item: any, index: number) => (
                                  <Box
                                    onClick={() => {
                                      handleItemClick(item);
                                      handledialogue();
                                    }}
                                    sx={{
                                      padding: "10px",
                                      marginBottom: "10px",
                                      "&:hover": {
                                        boxShadow: "0px 0px 8px 0px #ddd",
                                        cursor: "pointer",
                                      },
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
                                          cursor: "pointer",
                                        }}
                                      >
                                        <LocationOnOutlinedIcon />
                                        <Typography
                                          variant="body1"
                                          color="initial"
                                        >
                                          Address {index + 1}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Divider sx={{ marginY: "5px" }} />
                                    <Typography
                                      key={item._id}
                                      variant="body1"
                                      color="initial"
                                    >
                                      {item.label} {item.addressLine1}{" "}
                                      {item.addressLine2} {item.city}{" "}
                                      {item.state}
                                    </Typography>
                                  </Box>
                                ))
                              )}
                            </Grid>
                            <Grid
                              item
                              xs={7}
                              sx={{
                                height: "auto",
                                overflow: "auto",
                                padding: "10px !important",
                                margin: "0px auto !important",
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
                                Add New Address
                              </Typography>
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
                                <TextField
                                  size="small"
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Address Lable"
                                  sx={{ maxWidth: "100%" }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "25px",
                                      maxWidth: "100%",
                                    },
                                  }}
                                  onChange={(e) => setLabel(e.target.value)}
                                />
                              </Box>
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
                                  Pincode
                                </InputLabel>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "left",
                                    gap: "20px",
                                  }}
                                >
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
                                    type="number"
                                    onChange={(e) => setPinCode(e.target.value)}
                                  />
                                  <Button
                                    variant="contained"
                                    startIcon={
                                      <MyLocationOutlinedIcon
                                        sx={{
                                          width: "24px",
                                          height: "24px",
                                          color: "#FFFFFF",
                                        }}
                                      />
                                    }
                                    sx={{
                                      borderRadius: "25px",
                                      backgroundColor: "#2B376E",
                                      textTransform: "none",
                                      width: "165px",
                                      height: "45px",
                                      padding: "5px, 15px, 5px, 15px",
                                      gap: "7px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily: "Source Sans 3",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        letterSpacing: "0em",
                                        textAlign: "left",
                                        color: "#FFFFFF",
                                      }}
                                    >
                                      My Location
                                    </Typography>
                                  </Button>
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
                                        onChange={(e) =>
                                          setCity(e.target.value)
                                        }
                                      />
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
                                        onChange={(e) =>
                                          setState(e.target.value)
                                        }
                                      />
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
                                  onChange={(e) =>
                                    setAddressLine1(e.target.value)
                                  }
                                />
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
                                  onChange={(e) =>
                                    setAddressLine2(e.target.value)
                                  }
                                />
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
                                  onChange={(e) => setLandMark(e.target.value)}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "left",
                                }}
                              >
                                <Checkbox
                                  onClick={() => SetDefaultFag(!SetDefaultFag)}
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

                              <Box sx={{ float: "right" }}>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  onClick={handleSubmit}
                                  sx={{
                                    textTransform: "none",
                                    paddingX: "30px",
                                    borderRadius: "25px",
                                    backgroundColor: "#2B376E",
                                    width: "207px",
                                    height: "45px",
                                    padding: "0px, 16px, 0px, 16px",
                                    gap: "16px",
                                  }}
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
                              </Box>
                            </Grid>
                          </Grid>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions></DialogActions>
                    </Dialog>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </DashboardCard>
      </PageContainer>
    </>
  );
}

