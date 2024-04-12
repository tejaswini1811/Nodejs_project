
export type quoteTypes={
_id:string,
createdAt:string,
productName:string,
deliveryTime:string,
expectedPrice:string,
expectedPriceDouble:number,
requiredQuantity:string,
location:string,
}

export type rfqType={
_id:string,
createdAt:string,
productName:string,
location:string,
expectedPrice:string,
requiredQuantity:string,
expectedPriceDouble:number,
deliveryTime:string,
}

export type buyLeadsType={
_id:string,
RFQUniqueId: string,
location: string
catalogName: string,
productName: string,
headingName: string,
expectedPrice: string,
requiredQuantity: string,
expectedPriceDouble: number,
createdAt: string
}

export type catalogType={
_id:string,
catalogUniqueId: string,
icon:string,
isActive:boolean,
name:string,
}

export type userType={
  _id:string,
  isEmailVerified:boolean,
  mobile:number,
  isMobileVerified:boolean,
  isNewUser:boolean,
  userType:string,
  status:boolean,
  fcmToken:[string],
  languages:string,
  isAadhaarVerified:boolean,
  favoriteCommodities:[string],
  isSLCMUser:boolean,
  isDelete:boolean,
  userUniqueId:string,
  deviceId:string,
  address:[
    {
        label:string,
        addressLine1: string,
        addressLine2: string,
        city: string,
        district: string,
        state: string,
        pincode: number,
        landmark: string,
        defaultFlag: boolean,
        _id: string,
    }
  ]
  createdAt:string,
  updatedAt:string,
  __v:number,
  refreshToken:string,
  refreshTokenExpireTime:string,
  email:string,
  firstName:string,
  image:string,
  lastName:string,
  billingAddress:{
    label:string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    district: string,
    state: string,
    pincode: number,
    landmark: string,
    defaultFlag: boolean,
    _id: string | number,
  },
  contactAddress: {
    label:string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    district: string,
    state: string,
    pincode: number,
    landmark: string,
    defaultFlag: boolean,
    _id: string | number,
  }
  defaultBusinessId:string,
}


export type businessTypes={
    _id:string,
    businessTypes:[
        string,
        string,
        string,
    ]
    legalName:string,
    displayName:string,
    description:string,
    dateOfIncorporation:number,
    mobile:number,
    address:{
        label:string,
        addressLine1: string,
        addressLine2: string,
        city: string,
        district: string,
        state: string,
        pincode: number,
        landmark: string,
        defaultFlag: boolean,
        _id: string,
    }
    isActive: boolean,
    isDeleted: boolean,
    defaultBusiness: boolean,
    createdBy: string,
    emdWalletCurrentAmount: number,
    businessUniqueId: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
}

export type addressType=address[];
       

export type marketplaceType = {
  isBusinessVerified: boolean
  name:string,
  thumbnail: string,
  createdAt: string,
  verifiedDate: string,
  id: string,
  ratings: number,
  ratingCount: number,
  businessId: string,
  address: string,
  priceWithUnit: string,
  price: number,
  unit: string,
  businessName: string,
  enquiries: number,
}


export type rfqFormType = {
  thumbnail: string,
  name: string,
  ratings: number,
  ratingCount: number,
  enquiries: number,
  RFQFormAttributes:[
    {
      basicDetails: [
        {
          id: string,
          fieldLabel: string,
          fieldPlaceholder: string,
          fieldType: string,
          fieldValidations: {
              isNumberOnly: boolean,
              isMandatory: boolean,
          },
          fieldKey: string,
          nameTranslation:[
            {
              value: string,
              language: string,
            }
          ],
          fieldOptions: [
            {
              optionValue: string,
              optionLabel: string,
            }
          ],
          fieldValidation: {
            isMandatory: boolean,
          }
          fieldDependendent:string
        }
      ],
      additionalDetails:[]
    }
  ],
  catalogId: string,
  businessId: string,
  listingId: string,
  address: string,
  businessName: string,
  price: string
}

export type bankType = {
  _id:string,
  accountHolderName:string,
  bankName:string,
  branch:string,
  accountNumber:string,
  ifsc:string,
  location:string,
  userId:string,
  businessId:string,
  isVerified:boolean,
  isAgriReachAccount:boolean,
  isDefault:boolean,
  isDeleted:boolean,
  createdAt:string,
  updatedAt:string,
  __v:number,
  contact_id:string,
  fund_account_id:string,
  isContactActive:boolean,
  isFoundAccountActive:boolean,
  status:string,
}

export type subscriptionType ={
  _id:string,
  price:number,
  qcReportsCount:number,
  businessListingCount:number,
  validityInDays:number,
  planType: string,
  name: string,
  isActive: string,
  subTotal: number,
  gstAmount: number,
  gstPercentage:number,
}

export type notificationType ={
  _id:string,
  notification:{
    title:string,
    body:string,
  }
  data:{
    module:string,
    redirectPath:string,
    rfqId:string,
    location:string,
    headingName:string,
    businessId:string,
    businessName:string,
    uniqueId:string,
  },
  userId:string,
  isRead:boolean,
  createdAt:string,
}

export type address = {
        label:string,
        addressLine1: string,
        addressLine2: string,
        city: string,
        district: string,
        state: string,
        pincode: number,
        landmark: string,
        defaultFlag: boolean,
        _id: string,
}