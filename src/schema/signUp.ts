import * as Yup from "yup";

export const signUpSchema = Yup.object({
  firstName: Yup.string()
    .min(2)
    .max(25)
    .required("please enter your First Name"),
  lastName: Yup.string().min(2).max(25).required("please enter your Last Name"),
  email: Yup.string().email(),
});

export const phoneSchema = Yup.object({
  mobile: Yup.number()
    .min(10)
    .max(10)
    .required("please enter your number to proceed"),
});

export const addressSchema = Yup.object({
  label: Yup.string().min(2).required("please enter the label"),
  pincode: Yup.number().min(6).required("please enter the pincode"),
  city: Yup.string().min(2).required("please enter the city"),
  district: Yup.string().min(2).required("please enter the district"),
  state: Yup.string().min(2).required("please enter the state"),
  addressLine1: Yup.string()
    .min(2)
    .required("please enter you building Number or name"),
  addressLine2: Yup.string()
    .min(2)
    .required("please enter your street name or road name "),
  landmark: Yup.string().min(2),
  default: Yup.boolean().required("is this your default Address"),
});

export const profileSchema = Yup.object({
  firstName: Yup.string()
    .min(2)
    .max(25)
    .required("please enter your First Name"),
  lastName: Yup.string().min(2).max(25).required("please enter your Last Name"),
  mobile: Yup.number().required("please enter your number to proceed"),
  email: Yup.string().email(),
});

export const listingSchema = Yup.object({
  displayName: Yup.string()
    .min(2)
    .max(25)
    .required("please enter the Company Name"),
  description: Yup.string()
    .min(1, 'describe in 250 words')
    .max(250, 'describe in 250 words')
    .required("describe in 250 words"),
  dateOfIncorporation: Yup.number().required(
    "please enter date of Estbalishment"
  ),
  // mobile:Yup.number().min(10).required(
  //   "please enter you Mobile Number"
  // ),
});

export const bankSchema = Yup.object({
  holderName: Yup.string().min(2).required("please enter Account Holder Name"),
  accountNumber: Yup.number().min(2).required("please enter the Account Number"),
  confirmAccountNumber: Yup.number().min(2).required("please Confirm the Account Number"),
  ifsc: Yup.string().required("please enter your IFSC"),
  bankName: Yup.string().min(2).required("please enter the Bank name"),
  branch: Yup.string().min(2).required("please enter the branch"),
  bankAddress: Yup.string()
    .min(2)
    .required("please enter the Bank Address"),
});
