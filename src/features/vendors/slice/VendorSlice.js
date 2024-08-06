import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";
import { localData } from "../../../utils/storage";
import { envtypekey, apikey } from "../../../utils/common";
import instance from "../../../utils/axios";

const {
    vendorListApi, vendorCreationURL,
    changeVendorStatusURL, getEditVendorDetailsURL, updateVendorDetailsURL,
    updateVendorRatingURL, getStatusURL, CreatePOURL, getPartnersOrderslistURL, getCategoryInfoDataURL, cmsFinalProductsURL, cmsGetFinalProductsURL,partnerSendBoardsApi,partnerGetSendBoardsApi,boxBuildingInfoGetAPI,getVendorApiURL,getVendorInnerURL,
}  =  require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',
    addVendorData: {},
    rating: {},
    vendorStatus: {},
    editvendordata: {},
    typeofvendor: {},
    orderslistdata: {},
    categoryinfolist: {},
    sendBoardsData : {},
    finalProducts: {},
    getProducts: {},
    getSendBoardsdata : {},
    boxBuildingData : {},
    vendorOrderData : {},
    vendorOrderIdData : {},
    vendorOrderInnerData : {},
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const devEvent = {
    "env_type": envtypekey
}

export const fetchVendorList = createAsyncThunk(
    "vendorList/vendorListdetails",
    async (status) => {
        const request = {
            "status": status,
            ...devEvent
        }
        try {
            const response = await instance.post('CmsVendorGetAllData', request);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const createVendor = createAsyncThunk(
    "vendor/createVendor",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            console.log(request, "request of createvendor")
            const response = await instance.post('cms_vendor_create', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const getVendorcategoryDetails = createAsyncThunk(
    "vendor/getVendorcategoryDetails",
    async (requestBody) => {
        const request = {
            "vendor_name": requestBody.vendor_name,
            "vendor_id": requestBody.vendor_id,
            "type": requestBody.type,
            ...devEvent
        }
        try {
            const response = await instance.post('Cms_vendor_get_detailsByName', request);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const changeVendorStatus = createAsyncThunk(
    "status/chaangeStatus",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('CmsVendorUpdateStatus', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const getVendorEditDetails = createAsyncThunk(
    "edit/editDetails",
    async (requestobj) => {
        let requestBody = {
            ...requestobj,
            ...devEvent
        }
        try {
            console.log(JSON.stringify(requestBody, null, 2));
            const response = await instance.post('Cms_vendor_get_detailsByName', requestBody);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const updateVendorDetails = createAsyncThunk(
    "update/updateVendor",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('cms_edit_vendor_details', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const updateVendorRating = createAsyncThunk(
    "update/vendorRating",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post('CmsVendorAddRating', request);
            // console.log(response, "Rating");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const listSelection = createAsyncThunk(
    "vendor/selectionType",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('CmsVendorGetAllDataDetails', request);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const getstatusofpo = createAsyncThunk(
    "purchasestatus/statusURL",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('CmsVendorUpdateStatus', request);
            console.log("status dataaa", response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
);
export const createpo = createAsyncThunk(
    "createpurchase/createURL",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            console.log(JSON.stringify(request, null, 2))
            const response = await instance.post(
                'CmsPurchaseOrderCreate',
                request
            );
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getOrdersList = createAsyncThunk(
    "getorderslist/outwardslist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsPartnersGetOutwardList',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getVendorOrder = createAsyncThunk(
    "VendorOrder/VendorOrderData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'Cms_vendor_get_detailsByName',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);


export const getVendorOrderInner = createAsyncThunk(
    "VendorOrder/VendorInnerOrderData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "po_id":requestBody.po_id
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
             'cmsVendorGetInnerOrderDetails',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getVendorApi = createAsyncThunk(
    "VendorOrder/VendorOrderIdData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "vendor_id" :requestBody.vendor_id
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsVendorGetOrderDetails',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getCategoryInfoDetails = createAsyncThunk(
    "getCategoryinfo/outwardslist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            console.log(JSON.stringify(request, null, 2))
            const response = await instance.post(
                'CmsBomGetEmsOutwardDetailsbyId',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const sendFinalProducts = createAsyncThunk(
    "sendfinalproducts/partners",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        console.log(JSON.stringify(request, null, 2));
        try {
            
            const response = await instance.post(
                'cmsFinalProductCreateInPartners',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getFinalProducts = createAsyncThunk(
    "getfinalproductsinfo/partners",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsGetFinalProductInPartners',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

// function for making API calls
const makeApiCall = async (url, request) => {
    try {
        const response = await instance.post(url, request);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Save sendboards
export const sendBoards = createAsyncThunk(
    "sendbordsinfo/sendBordsdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('partner_send_boards', request);
    }
);

// get SendBoard details

export const getSendboarddata = createAsyncThunk(
    "getBoardsdata/getSendBoarddata",
    async (requestBody) => {
        const request = {
           ...requestBody,           
            ...devEvent
        };
        return makeApiCall('partner_get_send_boards', request);
    }
);

// export const getBoxBuildingInfoDetails = createAsyncThunk(
//     "boxBuilding/getBoxBuildingInfoDetails",
// async (requestBody) => {
//   return makeApiCall(boxBuildingInfoGetAPI, requestBody);
// }
// );

export const getBoxBuildingInfoDetails = createAsyncThunk(
    "getBoxBuildingData/getBoxBuildingInfoDetails",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('partner_send_box_building', request);
    }
);



const vendorSlice = createSlice({
    name: "vendorDetails",
    initialState,
    extraReducers: (builder) => {
        builder
            // Active vendors
            .addCase(fetchVendorList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(fetchVendorList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(fetchVendorList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // create vendors
            .addCase(createVendor.pending, (state, action) => {
                // toast.loading("please wait, loading...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(createVendor.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.addVendorData = action.payload;
                state.hasError = false;
            })
            .addCase(createVendor.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // Get Vendorscategorydetails
            .addCase(getVendorcategoryDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorcategoryDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorcategoryDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            // change vendor status
            .addCase(changeVendorStatus.pending, (state, action) => {
                // toast.loading("please wait, updating...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(changeVendorStatus.fulfilled, (state, action) => {
                toast.dismiss();
                // , {
                //     onClose: () => window.location.reload()
                // }
                toast.success(`${action.payload?.body}`);
                state.vendorStatus = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(changeVendorStatus.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // get Vendor Edit Details
            .addCase(getVendorEditDetails.pending, (state, action) => {
                // toast.loading("please wait, fetching details...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorEditDetails.fulfilled, (state, action) => {
                toast.dismiss();
                state.editvendordata = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(getVendorEditDetails.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            // update vendor Details
            .addCase(updateVendorDetails.pending, (state, action) => {
                // toast.loading("please wait, updating details...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateVendorDetails.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(updateVendorDetails.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(updateVendorRating.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateVendorRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rating = action.payload;
                state.hasError = false;
            })
            .addCase(updateVendorRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(listSelection.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(listSelection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.typeofvendor = action.payload;
                state.hasError = false;
            })
            .addCase(listSelection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getstatusofpo.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getstatusofpo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.statusDetails = action.payload;
                state.hasError = false;
            })
            .addCase(getstatusofpo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            //  Create PO URL
            .addCase(createpo.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(createpo.fulfilled, (state, action) => {
                toast.dismiss();
                // if(action.payload.statusCode === 200){
                //     toast.success(`${action.payload?.body}`);
                // }
                // else{
                //     toast.error(`${action.payload?.body}`);
                // }
                // toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.createPODetails = action.payload;
                state.hasError = false;
            })
            .addCase(createpo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getOrdersList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getOrdersList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderslistdata = action.payload;
                state.hasError = false;
            })
            .addCase(getOrdersList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getCategoryInfoDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getCategoryInfoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categoryinfolist = action.payload;
                state.hasError = false;
            })
            .addCase(getCategoryInfoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            //save send boards
            .addCase(sendBoards.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(sendBoards.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.sendBoardsData = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(sendBoards.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })


            .addCase(sendFinalProducts.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(sendFinalProducts.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.finalProducts = action.payload;
                state.hasError = false;
            })
            .addCase(sendFinalProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getFinalProducts.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getFinalProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getProducts = action.payload;
                state.hasError = false;
            })
            .addCase(getFinalProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            .addCase(getSendboarddata.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSendboarddata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getSendBoardsdata = action.payload;
                state.hasError = false;
            })
            .addCase(getSendboarddata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getBoxBuildingInfoDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxBuildingData = action.payload;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })

            .addCase(getVendorOrder.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getVendorApi.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderIdData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorApi.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            .addCase(getVendorOrderInner.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorOrderInner.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderInnerData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorOrderInner.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


    }

})

export const selectVendorData = state => state.vendorData.editvendordata;
export const selectLoadingStatus = state => state.vendorData.isLoading;
export const selectVendorsCategoryDetails = state => state.vendorData.data;
export const selectVendorRating = state => state.vendorData.rating;
export const selectVendorStatus = state => state.vendorData.vendorStatus;
export const selectVendorType = state => state.vendorData.typeofvendor;
export const setStatusUpdate = (state) => state.purchaseData.statusDetails;
export const setCreatePO = (state) => state.purchaseData.createPODetails
export const selectOrdersList = (state) => state.vendorData.orderslistdata;
export const selectCategoryInfoData = (state) => state.vendorData.categoryinfolist;
export const selectGetFinalProducts = (state) => state.vendorData.getProducts;
export const selectGetSendboards = (state) => state.vendorData.getSendBoardsdata;
export const selectGetBoxBuildingData = (state) => state.vendorData.boxBuildingData;

export const selectVendorOrderData = (state) => state.vendorData.vendorOrderData;
export const selectVendorApiData = (state) => state.vendorData.vendorOrderIdData;
export const selectVendorOrderInnerData = (state) => state.vendorData.vendorOrderInnerData;
// export const selectVendorBoxBuildingInfo = (state) => state.vendorData.
export default vendorSlice.reducer;