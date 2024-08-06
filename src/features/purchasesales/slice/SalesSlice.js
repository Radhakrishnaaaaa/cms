import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
import { forecastCardDetails, forecatPostCommentApi } from "../../../utils/constant.development";

const { CmsForcastPurchaseOrderUploadPOURL, getCmsGetInnerForcastPurchaseOrderDetailsURL, forecastInnerDetails } = require("../../../utils/constant." + (apikey) + ".js");


const initialState = {
    data: {},
    purchaseListdata: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',  
    salesdata: {},
   
  

}
const devEvent = {
    "env_type": envtypekey
}
const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

// Helper function for making API calls
const makeApiCall = async (url, request) => {
    try {
        const response = await instance.post(url, request);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const CmsGetInnerForcastPurchaseOrderDetails = createAsyncThunk(
    "Purchasesales/fetchinglistDetails",
    async () => {
        try {
            const response = await instance.post('CmsGetForcastPurchaseOrderDetailsList', devEvent);
            console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);

export const CmsForcastPurchaseOrderUploadPO = createAsyncThunk(
    "Purchasesales/forecastPOuploadpo",
    async (request) => {
        const requestBody = {
            ...devEvent,
            ...request
        }
        try {
            const response = await instance.post('CmsForcastPurchaseOrderUploadPO', requestBody);
            console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);


// export const cmsGetForcastInnerDetails = createAsyncThunk(
//     "Purchasesales/forecatdetials",
//     async () => {
//         try {
//             const response = await axios.post(forecastInnerDetails, devEvent , config);
//             console.log(response?.data);
//             return response.data;
//         } catch (err) {
//             console.error(err);
//         }
//     }
// );

export const cmsGetForcastInnerDetails = createAsyncThunk(
    "Purchasesales/forecatdetials",
    async (requestobj) => {
      const requestBody = {
        ...devEvent,
        ...requestobj     
        
      }
      try {
        const response = await instance.post('CmsGetInnerForcastPurchaseOrderDetails', requestBody);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  )

  export const cmsUpdateForcastPostComments = createAsyncThunk(
    "Purchasesales/forecatpostComments",
    async (requestobj) => {
      const requestBody = {
        ...devEvent,
        ...requestobj             
      }
      try {
        const response = await instance.post('CmsForcastPurchaseOrderPostComment', requestBody);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  )


const SalesSlice = createSlice({

    name: "salesDetails",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(CmsGetInnerForcastPurchaseOrderDetails.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(CmsGetInnerForcastPurchaseOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchaseListdata = action.payload;
            state.hasError = false;
        })           
        .addCase(CmsGetInnerForcastPurchaseOrderDetails.rejected, (state, action) => {
            state.hasError = true;
            state.error = action.error;
            state.isLoading = false;
        })
        .addCase(CmsForcastPurchaseOrderUploadPO.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(CmsForcastPurchaseOrderUploadPO.fulfilled, (state, action) => {
            if(action.payload?.statusCode === 200){
                toast.success(`${action.payload?.body}`);
            }
            else{
                toast.error(`${action.payload?.body}`);
            }
            state.isLoading = false;
            state.uploadpoinps = action.payload;
            state.hasError = false;
        })           
        .addCase(CmsForcastPurchaseOrderUploadPO.rejected, (state, action) => {
            toast.dismiss();
            toast.error(`${action.payload?.body}`);
            state.hasError = true;
            state.error = action.error;
            state.isLoading = false;
        })
        
        .addCase(cmsGetForcastInnerDetails.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsGetForcastInnerDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.forecastDetails = action.payload;
            state.hasError = false;
          })
          .addCase(cmsGetForcastInnerDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          .addCase(cmsUpdateForcastPostComments.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsUpdateForcastPostComments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.forecastUpdateComments = action.payload;
            state.hasError = false;
          })
          .addCase(cmsUpdateForcastPostComments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })

    }

})
export const selectLoadingState = state => state.salesData.isLoading;
export const selectPurchaseList = state => state.salesData.purchaseListdata;
export const selectUploadPOinPurchase = state => state.salesData.uploadpoinps;
export const selectForecastData = state => state.salesData.forecastDetails;
export const selectForecastUpdateComments = state => state.salesData.forecastUpdateComments;


export default SalesSlice.reducer;