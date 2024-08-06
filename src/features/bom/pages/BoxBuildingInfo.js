import React, { useEffect, useState } from 'react'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getBoxBuildingInfoDetails, selectBoxBuildingInfoData, selectOutwardTopInfo } from '../slice/BomSlice';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {
  formFieldsVendor,
  tableBOM,
  tableContent,
} from "../../../utils/TableContent";

const BoxBuildingInfo = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const kit1Details = props?.props?.topDetailsInfo?.body
  console.log(kit1Details, "kit1Detailskit1Detailskit1Details")
  const bom_id = props?.bom_Id;
  console.log("bomid", bom_id);
  const quantity = props?.qnty;
  const againstPoValue = props?.againstPoValue;
  console.log(againstPoValue, "45678986756");
  console.log("qtyyyyyyyyyyyyyy", quantity)
  const [key, setKey] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const getData = useSelector(selectBoxBuildingInfoData);
  const topDetailsInfo = useSelector(selectOutwardTopInfo);
  const outward_id = location.state?.outward_id_info;
  console.log(outward_id)
  console.log("getDatatttt", getData);
  const body = getData?.body
  const boards = body?.boards || "";
  const getMparts = getData?.body || "";
  console.log("getMparts....", getMparts)
  const partner_id = getMparts?.partner_id;
  const sender_name = getMparts?.sender_name;
  const contact_details = getMparts?.contact_details;
  const receiver_name = getMparts?.receiver_name;
  const receiver_contact_num = getMparts?.receiver_contact_num;
  const outward_date = getMparts?.outward_date;
  const against_po = getMparts?.against_po;
  console.log(sender_name)
  const [mcategoryProvidedQty, setMCategoryProvidedQty] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState({});  
  const isError = getData?.statusCode === 404;

  useEffect(() => {
    const mKitTabKey = Object.keys(getMparts || {}).find(kitKey => kitKey.startsWith("M_KIT"));
    if (mKitTabKey) {
      setKey(mKitTabKey);
    }
  }, [getMparts]);

  useEffect(() => {
    const request = {
      "outward_id": outward_id,
      "bom_id": bom_id,
    }
    dispatch(getBoxBuildingInfoDetails(request))
  }, [])

  const SendSample = () => {
    navigate("/assignBoxBuilding", {
      state: {
        outward_id: outward_id,
        bom_id: bom_id,
        qty: quantity,
        type: "sendBoxBuildingInfo",
        partnerId : partner_id,
       againstPoValue :againstPoValue
        ,
        senderName : sender_name,
        contactDetails : contact_details,
        receiverName : receiver_name,
        receiverContactNum : receiver_contact_num,
        outwardDate : outward_date,
        againstPo : against_po,
      },
    });
  }

  const renderMpartsTabContent = (kitKey) => {
    if (!getMparts?.boards) {
      return <p>No content available for this kit</p>;
    }
    const kitData = getMparts[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
    const currentTab = "M_KIT1";
    const finalProduct = kitKey.startsWith("M_KIT");
    if (finalProduct) {
      const headers = kitKey.startsWith("M_KIT") ?
        [
          "VIC Part No",
          "Part Name",
          "Material",
          "Technical Details",
          "Description",
          "Qty per Board",
          "Batch.no",
          "Provided Qty",
          "Balance Qty"
        ] : []

       let totalBalanceQty = 0;
       let totalProvidedQnty = 0;
       let totalRequiredQnty = 0;
       const renderDataFields = (part, index) => {
        totalBalanceQty += parseInt(part?.balance_qty)
        totalProvidedQnty += parseInt(part?.provided_qty)
        totalRequiredQnty += parseInt(part?.qty_per_board)
        if (kitKey.startsWith("M_KIT")) {
          return (
            <>
              <td>{part?.vic_part_number}</td>
              <td>{part?.prdt_name}</td>
              <td>{part?.material}</td>
              <td>{part?.technical_details}</td>
              <td>{part?.description}</td>
              <td>{part?.qty_per_board }</td>
              <td>{part?.batch_no}</td>
              <td>{part?.provided_qty || 0}</td>
              <td>{part?.balance_qty}</td>                          
            </>
          );
        }       
        else {
          return <></>;
        }      
      };
      return (
        <>
        <div className="table-responsive mt-4" id="tableData">
          <Table className="bg-header">
            <thead>
              <tr>
                {headers.map((header, index) => (

                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(kitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
                .map((partKey, index) => {
                  const part = kitData[partKey];
                  return (
                    <tr key={index}>
                      {renderDataFields(part, index)}
                    </tr>)
                })}
            </tbody>
            <tfoot>
            <tr className="border-top">
                    <td> Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <tf></tf>
                    <td>{totalRequiredQnty}</td>
                    <td></td>
                    <td>{totalProvidedQnty}</td>
                    <td>{totalBalanceQty}</td>
                  </tr>
            </tfoot>
          </Table>
        </div>
        </>
      );
    }
    else {
      console.log("no dataaaaaa")
    }
  };

  const renderTabContent = (kitKey) => {
    if (!body?.boards) {
      return <p>No content available for this kit</p>;
    }
    const kitData = body.boards[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
    const filteredKitData = Object.keys(kitData).reduce((acc, key) => {
      if (key !== "status") {
          acc[key] = kitData[key];
      }
      return acc;
  }, {});

  if (Object.keys(filteredKitData).length === 0) {
      return <p>No data available for {kitKey}</p>;
  }
    const finalProduct = kitKey.startsWith("boards_kit");
    if (finalProduct) {
      const headers = kitKey.startsWith("boards_kit") ?
        [
          "S.No",
          "SVIC PCBA",
          "ALS PCBA",
          "Display Number",
          "SOM ID/IMEI ID",
          "E SIM No",
          "E SIM ID"
        ] : []
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("boards_kit")) {
          return (
            <>
              <td>{index + 1}</td>
              <td>{part?.svic_pcba}</td>
              <td>{part?.als_pcba}</td>
              <td>{part?.display_number}</td>
              <td>{part?.som_id_imei_id}</td>
              <td>{part?.e_sim_no}</td>
              <td>{part?.e_sim_id}</td>
            </>
          );
        }
        else {
          return <></>;
        }
      };
      return (
        <div className="table-responsive mt-4" id="tableData">
          <Table className="bg-header table-lasttr">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(filteredKitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
                .map((partKey, index) => {
                  const part = filteredKitData[partKey];
                  return (
                    <tr key={index}>
                      {renderDataFields(part, index)}
                    </tr>)
                })}
            </tbody>
          </Table>
        </div>
      );
    }
    else {
      console.log("no dataaaaaa")
    }
  };

  const [selectedParts, setSelectedParts] = useState([]);
  useEffect(() => {
    if (boards) {
      const tableBorads = Object.values(body?.boards || {})
      console.log("tablePartstableParts", tableBorads)
      setSelectedBoards([...tableBorads]);
    }
  }, [boards])

  useEffect(() => {
    if (getMparts) {
      const tableMparts = Object.values(getMparts?.M_KIT || {})
      console.log("tablePartstableParts", tableMparts)
      setSelectedParts([...tableMparts]);
    }
  }, [getMparts]);

  const convertToCamelCase = (str) => {
    let camelCaseStr = str.replace(/[_\s]([a-z])/ig, (match, group) => group.toUpperCase());
    camelCaseStr = camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1); 
    return camelCaseStr;
  }

  return (
    <>
      <div>

        <Row className="bom">
          <Col>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              {formFieldsVendor.bomId} :{" "}
              {topDetailsInfo && topDetailsInfo?.body?.bom_id}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              {tableContent.qty} : {quantity}
            </h5>
            <h5 className="bomtag text-667 font-500">
              {tableBOM.receiverName} :{" "}
              {getMparts && getMparts?.receiver_name}
            </h5>
          </Col>
          <Col>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              {tableBOM.outwardId} :{" "}
              {topDetailsInfo && topDetailsInfo?.body?.outward_id}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              {tableBOM.senderName}:{" "}
              {getMparts && getMparts?.sender_name}
            </h5>
            <h5 className="bomtag text-667 font-500">
              {tableBOM.receiverCnt} :{" "}
              {getMparts && getMparts?.receiver_contact_num}
            </h5>
          </Col>
          <Col>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              {tableBOM.partnerId} :{" "}
              {getMparts && getMparts?.partner_id}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              {tableBOM.senderCnt} :{" "}
              {getMparts && getMparts?.contact_details}
            </h5>
            <h5 className="bomtag text-667 font-500">
              {tableBOM.outwardDate}:{" "}
              {topDetailsInfo && topDetailsInfo.body?.created_date}
            </h5>
          </Col>
        </Row>
        <h5>Box Building Info</h5>
        {isError ? (
                                    <div className="coming-sec">
                                        <h4 className="mt-5">{tableContent?.nodata}</h4>
                                    </div>
                                ) : 
        <div className='d-flex justify-content-between position-relative w-100 border-bottom'>
          <div className='d-flex align-items-center'>
            <div className='partno-sec'>
        
              <div className='tab-sec'>
              
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >                 
                  {typeof getMparts === "object" ? 
                    Object.keys(getMparts)
                      .filter(kitKey => kitKey.startsWith("M_KIT"))
                      .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                      .map((kitKey, index) => (
                        <Tab eventKey={kitKey} title={kitKey} key={index}>
                          {renderMpartsTabContent(kitKey)}
                        </Tab>
                      )) : (<>
                      </>)
                  }

                  {typeof body === "object" && body.boards ? (
                    Object.keys(body?.boards).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                      .map((kitKey, index) => (
                        // <Tab eventKey={kitKey} title={kitKey} key={index}>
                        //   {renderTabContent(kitKey)}
                        // </Tab>
                        <Tab eventKey={kitKey} title={convertToCamelCase(kitKey)} key={index}>
                {renderTabContent(kitKey)}
            </Tab>
                      ))
                  ) : null}

                </Tabs>
               
              </div>
{/* } */}
            </div>
          </div>

          <div className='mobilemargin-top'>
            &nbsp;
            <Button
              className="submit mb-1 submit-block"
              onClick={SendSample}
            >
              Assign To Box Building
            </Button>
            &nbsp;
            <Button
              className="submit mb-1 submit-block"
            >
              Share Deliver Challan
            </Button>
          </div>
        </div>
}
      </div>

    </>
  )
}
export default BoxBuildingInfo;
