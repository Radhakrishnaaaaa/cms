import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
const {getbomPriceAPI,createForecastPurchaseOrderURL,getClientIdForecastPurchaseOrderDetails,saveDraftForecastPurchaseOrder,forcastPurchaseOrderEditGetAPI,getForecastPOGetBomsForClientName } = require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',  
    forecastdata: {},
    clientlist:{},
    draftdata:{},
    geteditforecastdata:{},
    bomlistdata:{},
    pricedata:{}
  

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

// Save forecast api
export const addForecast = createAsyncThunk(
    "add/addforecastdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('CmsCreateForcastPurchaseOrder', request);
    }
);



// Client list
export const clientlistSelection = createAsyncThunk(
    "clientnamelist/getclientList",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        };
        return makeApiCall('CmsGetClientIdForcastPurchaseOrderDetails', request);
    }
);
// draft
export const draftForecast = createAsyncThunk(
    "draft/draftforecastdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('CmsSaveDraftForecastPurchaseOrder', request);
    }
);

// get edit
export const geteditForecast = createAsyncThunk(
    "getedit/geteditforecastdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "fc_po_id": requestBody.fc_po_id,
        };
        console.log(request,"requestrequestrequest");
        return makeApiCall('CmsForcastPurchaseOrderEditGetAPI', request);
    }
);
// get bomlist
export const getbomnames = createAsyncThunk(
    "getbom/getebomlist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "client_name": requestBody.client_name,
        };
       // console.log(request,"requestrequestrequest");
        return makeApiCall('cmsForecastPOGetBomsForClientName', request);
    }
);

// get bomprice
export const getbomprice = createAsyncThunk(
    "getbompricedata/getebompricelist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "client_name": requestBody.client_name,
            "bom_name":requestBody.bom_name
        };
       // console.log(request,"requestrequestrequest");
        return makeApiCall('CmsForecastPOGetBomPriceForBomName', request);
    }
);

const ForecastSlice = createSlice({

    name: "forecastDetails",
    initialState,
    extraReducers: (builder) => {
        builder           

            //save client
            .addCase(addForecast.pending, (state, action) => {                
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addForecast.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.forecastdata = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(addForecast.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })

            //get client list
            .addCase(clientlistSelection.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(clientlistSelection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientlist = action.payload;
                state.hasError = false;
            })
            .addCase(clientlistSelection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

              //draft
              .addCase(draftForecast.pending, (state, action) => {                
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(draftForecast.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.draftdata = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(draftForecast.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })

            //get forecast
            .addCase(geteditForecast.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(geteditForecast.fulfilled, (state, action) => {
                state.isLoading = false;
                state.geteditforecastdata = action.payload;
                state.hasError = false;
            })
            .addCase(geteditForecast.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

              //get bomnames
              .addCase(getbomnames.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getbomnames.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bomlistdata = action.payload;
                state.hasError = false;
            })
            .addCase(getbomnames.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

             //get bomprice
             .addCase(getbomprice.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getbomprice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pricedata = action.payload;
                state.hasError = false;
            })
            .addCase(getbomprice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


    }

})
export const selectLoadingState = state => state.forecastData.isLoading;
export const selectAddforecastDetails = state => state.forecastData.forecastdata;
export const selectForecastClientList = state => state.forecastData.clientlist;
export const selecteditForecastList = state => state.forecastData.geteditforecastdata;
export const selectbomList= state => state.forecastData.bomlistdata;
export const selectbomPrice= state => state.forecastData.pricedata;

export default ForecastSlice.reducer;