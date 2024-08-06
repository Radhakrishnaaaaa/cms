import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getFinalProducts,
  selectGetFinalProducts,
} from "../slice/VendorSlice";
import "../styles/Vendors.css";
const ProductionLineTab = ({outward_id}) => {
  const dispatch = useDispatch();
  const getData = useSelector(selectGetFinalProducts);
  const finalBoarddata = getData?.body;
  console.log(finalBoarddata);

  const renderTabContent = (productdata) => {
    const productKeys = Object.keys(finalBoarddata[productdata]);

     // Filtering out the "status" key
    const filteredProductKeys = productKeys.filter(key => key !== "status");
    
    if (filteredProductKeys.length === 0) {
      return <p>No data available for {productdata}</p>
    }
  
    return (
      <div className="table-responsive mt-4">
        <Table className="bg-header">
          <thead>
            <tr>
              <th>S.No</th>
              <th>UNIT NO</th>
              <th>SVIC PCBA</th>
              <th>ALS PCBA</th>
              <th>Display Number</th>
              <th>SOM ID/ IMEI ID</th>
              <th>E-SIM NO</th>
              <th>E-SIM ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductKeys.map((productKey, index) => {
              const item = finalBoarddata[productdata][productKey];
  
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item["unit_no"]}</td>
                  <td>{item["svic_pcba"]}</td>
                  <td>{item["alis_pcba"]}</td>
                  <td>{item["display_num"]}</td>
                  <td>{item["som_id"]}</td>
                  <td>{item["E_sim_no"]}</td>
                  <td>{item["E_sim_id"]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };
  
  
  useEffect(() => {
    const request = {
      "outward_id":outward_id,
    };
    dispatch(getFinalProducts(request));
  }, [dispatch, outward_id]);

  // Check if there is an error response
  if (getData?.statusCode === 404) {
    return (
      <div className='coming-sec'>
            <h4 className='mt-5'>No Data Available</h4>
        </div>
    );
  }
  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative w-100 align-items-end d-flex-mobile mt-5 w-100">
          <div className="d-flex align-items-center w-100">
            <div className="partno-sec vendorpartno-sec w-100">
              <div className="tab-sec-sendkit">
                <Tabs id="controlled-tab-example scrollable-tabs" style={{overflowX: "auto"}}>
                  {typeof finalBoarddata === "object" ? (
                    Object.keys(finalBoarddata)?.map((productdata, index) => (
                      <Tab
                        eventKey={productdata}
                        title={productdata.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}
                        key={index}
                      >
                        {renderTabContent(productdata)}
                      </Tab>
                    ))
                  ) : (
                    <></>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductionLineTab;
