import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import arw from '../../../assets/Images/left-arw.svg';
import view from '../../../assets/Images/view.svg';
import download from '../../../assets/Images/download.svg';
import pdf from '../../../assets/Images/pdf.svg';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { selectVendorsCategoryDetails, getVendorcategoryDetails, selectLoadingStatus, getOrdersList, selectOrdersList } from '../slice/VendorSlice';
import VendorRating from './VendorRating';
import { formFieldsVendor, tableContent, textToast } from "../../../utils/TableContent"
import "../styles/Vendors.css";

const VendorsPartenerDetails = () => {
    const [key, setKey] = useState('bankdetails');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { vendor_id, vendor_name, partner_type } = location.state;
    console.log(partner_type);
    const VendorcatDetails = useSelector(selectVendorsCategoryDetails);
    const orderslist = useSelector(selectOrdersList);
    const orderslistData = orderslist?.body;
    console.log(orderslistData);
    const isLoading = useSelector(selectLoadingStatus);
    const VendorcatDetailsdata = VendorcatDetails?.body;
    console.log(VendorcatDetailsdata);
    const documentUrls = (VendorcatDetailsdata?.documents || [])?.map(document => document.content) || [];
    useEffect(() => {
        const request = {
            "vendor_id": vendor_id,
            "vendor_name": vendor_name,
            "type": "Partners",
        }
        const requestBody = {
            "partner_id": vendor_id,
            "dep_type": partner_type && partner_type[0] ? partner_type[0].replace(/ /, '') : null
        }
        dispatch(getOrdersList(requestBody))
        dispatch(getVendorcategoryDetails(request))
    }, []);

    useEffect(() => {

    }, [dispatch])

    const handleNavigate = (item) => {
        navigate("/ordersinnerDetails", {
            state: {
                outward_id: item,
                partner_type: partner_type[0]
            }
        })
    }
    if (!VendorcatDetailsdata) {
        return null;
    }

    // const downloadDocument = (documentUrl, documentName) => {
    //     fetch(documentUrl)
    //         .then(response => response.blob())
    //         .then(blob => {
    //             const link = document.createElement("a");
    //             link.href = URL.createObjectURL(blob);
    //             link.download = documentName;
    //             link.click();
    //         })
    //         .catch(error => {
    //             console.error("Error downloading PDF:", error);
    //         });
    // };
    const openPDFInNewTab = async (url) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
        } catch (error) {
          console.error("Error loading PDF:", error);
        }
      };

    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} />{VendorcatDetailsdata?.partner_name} </h1>
                    </div>
                    {/* <div className='mobilemargin-top'>
                        <Button className='submit me-2 md-me-2 submitmobile' onClick={downloadpdf}>
                            {formFieldsVendor.download}
                        </Button>
                    </div> */}
                </div>

                <Row>
                    <Col xs={12} md={4}>

                        <h5 className='mb-2 mt-3 bomtag text-667 font-500'>
                            {formFieldsVendor.partnertype} : {Array.isArray(VendorcatDetailsdata?.partner_type)
                                ? VendorcatDetailsdata.partner_type.join(' & ')
                                : VendorcatDetailsdata?.partner_type}
                        </h5>
                        <h5 className='bomtag mb-2 text-667 font-500'>{formFieldsVendor.partnerDate} : {VendorcatDetailsdata?.vendor_date}</h5>
                        <h5 className="bomtag mb-2 text-667 font-500">
                            Address : {
                                [
                                    VendorcatDetailsdata?.address1,
                                    VendorcatDetailsdata?.address2,
                                    VendorcatDetailsdata?.landmark,
                                    VendorcatDetailsdata?.pin_code,
                                    VendorcatDetailsdata?.city_name,
                                    VendorcatDetailsdata?.state,
                                    VendorcatDetailsdata?.country
                                ]
                                    .filter(value => value !== undefined && value !== '' && value !== 'NA' && value !== 'na' && value !== '-' && value !== 'Nill' && value !== 'nill' && value !== 'NILL')
                                    .join(', ')
                            }
                        </h5>

                    </Col>

                    <Col xs={12} md={4}>

                        <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{formFieldsVendor.contact} : {VendorcatDetailsdata?.contact_number}</h5>
                        <h5 className='bomtag mb-2 text-667 font-500'>{tableContent.email} : {VendorcatDetailsdata?.email}</h5>
                    </Col>

                    <Col xs={12} md={4}>
                        <h5 className="mb-2 mt-3 bomtag text-667 font-500">{formFieldsVendor.gstNumber} : {VendorcatDetailsdata?.gst_number} </h5>
                        <h5 className='mb-2 bomtag text-667 font-500'>{formFieldsVendor.panNumber} : {VendorcatDetailsdata?.pan_number}</h5>

                    </Col>

                </Row>

                <div className='d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5'>
                    <div className='d-flex align-items-center'>
                        <div className='partno-sec vendorpartno-sec' >
                            <div className='tab-sec'>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}

                                >

                                    <Tab eventKey="bankdetails" title="Bank Details">
                                        <Row className='mt-4'>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2">{formFieldsVendor.holderName} :  {VendorcatDetailsdata?.holder_name}</p>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2">{formFieldsVendor.bankName} :  {VendorcatDetailsdata?.bank_name}</p>                                              
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2 d-flex" style={{"white-space":"nowrap"}} title={VendorcatDetailsdata?.account_number}>{formFieldsVendor.ACnum} : <span className="accnotag ps-1"> {VendorcatDetailsdata?.account_number} </span></p>
                                            </Col>
                                        </Row>
                                        
                                        <Row className='mt-2'>
                                            <Col xs={12} md={4}>
                                                <p>{formFieldsVendor.branchName} :  {VendorcatDetailsdata?.branch_name}</p>
                                            </Col>
                                            <Col xs={12} md={4}>                                               
                                                <p>{formFieldsVendor.ifscCode} :  {VendorcatDetailsdata?.ifsc_code}</p>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="otherinfo" title="Other Info">
                                        <p className='mt-4 mb-2 font-bold'>{formFieldsVendor.terms} :</p>
                                        {/* <p>{VendorcatDetailsdata?.terms_and_conditions}</p> */}
                                        <div className="pterms" dangerouslySetInnerHTML={{ __html: VendorcatDetailsdata?.terms_and_conditions }} />
                                        <p className='mt-4 mb-2 font-bold'>Custom Payment :</p>
                                        <div className="payments pterms" dangerouslySetInnerHTML={{ __html: VendorcatDetailsdata?.payments }} />
                                    </Tab>

                                    <Tab eventKey="documents" title="Documents">

                                        {VendorcatDetailsdata?.documents && VendorcatDetailsdata.documents.length > 0 ? (
                                            <Row className='mt-4'>

                                                {VendorcatDetailsdata.documents.map((document, index) => (
                                                    <Col xs={12} md={2} key={index}>
                                                        <p className='pdf-tag'>{document.document_name}</p>
                                                        <div className='doc-card position-relative'>
                                                            <div className='pdfdwn'><img src={pdf} alt="" /></div>
                                                            <div className='doc-sec position-absolute'>
                                                                <div className='d-flex justify-content-between'>
                                                                    {/* <Button className='view' onClick={() => downloadDocument(document.document, document.name)}>
                                                                        <img src={download} alt="" />
                                                                    </Button> */}
                                                                    <Button className='view' style={{ marginLeft: 'auto', fontSize: '1.5rem' }}  ><a href={documentUrls[index]} target="_blank" rel="noreferrer"><img src={view} alt="" /></a> </Button>
                                                                    {/* <Button className='view' style={{ marginLeft: 'auto', fontSize: '1.5rem' }}  ><a href={documentUrls[index]} target="_blank" rel="noreferrer"><img src={view} alt="" /></a> </Button> */}
                                    {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${documentUrls[index]}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))

                                                }
                                            </Row>
                                        ) : (
                                            <p>{textToast.noDoc}</p>
                                        )}

                                    </Tab>

                                    <Tab eventKey="orders" title="Orders">
                                        <div className="table-responsive mt-4 ms-4" id="tableData">
                                            <Table className="bg-header">
                                                <thead>
                                                    <tr>
                                                        <th>{formFieldsVendor.sno}</th>
                                                        <th>{formFieldsVendor.orderId}</th>
                                                        {/* <th>{formFieldsVendor.bomId}</th> */}
                                                        <th>{formFieldsVendor.orderDate}</th>
                                                        <th>{formFieldsVendor.boardsQty}</th>
                                                        <th>{formFieldsVendor.material}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(orderslistData) && orderslistData.length > 0 ? (
                                                        orderslistData?.map((item, index) => (
                                                            <tr key={index} >
                                                                <td>{index + 1}</td>
                                                                <td className='outward_underline' onClick={() => handleNavigate(item?.outward_id, item?.bom_id)}>{item?.outward_id}</td>
                                                                {/* <td>{item?.bom_id}</td> */}
                                                                <td>{item?.order_date}</td>
                                                                <td>{item?.qty}</td>
                                                                <td>{item?.mtrl_prcnt}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className='text-center'>no Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </Table>
                                        </div>

                                    </Tab>

                                    <Tab eventKey="stockinward" title="Stock Inward">
                                        <p className='mt-4 mb-2'>Coming Soon</p>
                                    </Tab>
                                    <Tab eventKey="availablestock" title="Available Stock">
                                        <p className='mt-4 mb-2'>Coming Soon</p>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}
        </>
    );
};

export default VendorsPartenerDetails;