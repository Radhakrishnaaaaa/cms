import React from 'react'
import { Button, Col, Row, Spinner, Tab, TabPane, Table, Tabs, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { formFieldsVendor, tableBOM, tableContent } from '../../../utils/TableContent';
import VendorRating from './VendorRating';
import arw from "../../../assets/Images/left-arw.svg";
import { getCategoryInfoDetails, selectCategoryInfoData, selectLoadingStatus } from '../slice/VendorSlice';
import { useEffect, useState } from 'react';
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import ProductionLineTab from './ProductionLineTab';
import queryString from "query-string";
import BoardsInfo from './BoardsInfo';
import BoxBuildingInfo from '../../bom/pages/BoxBuildingInfo';
import VendorBoxBuildingInfo from './VendorBoxBuildingInfo';

const OrdersInnerDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = queryString.parse(location.search);
    const [key, setKey] = useState(queryParams.tab || 'catinfo');
    const { outward_id, partner_type } = location?.state;
    console.log(partner_type, outward_id);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const isLoading = useSelector(selectLoadingStatus);
    const data = useSelector(selectCategoryInfoData);
    // const categoryinfoData = data?.body || {};
    const [categoryinfoData, setcategoryinfoData] = useState({});

    useEffect(() => {
        if (data?.body) {
            setcategoryinfoData(data?.body)
        } else {
            // Handle the case where parts is null or undefined
            setcategoryinfoData({});
        }      

    }, [data])

    console.log(categoryinfoData, "ommmmmmmmmmmmmmmmm");
    const bom_id = categoryinfoData?.bom_id;
    const outwardId = categoryinfoData?.outward_id
    console.log(outwardId)
    const [activeKey, setActiveKey] = useState(null);

    const handleClose = () => {
        setShow(false);
        setModalIsOpen(false); // Close the modal when the modal is closed.
    };

    const handleShow = () => {
        setShow(true);
        setModalIsOpen(true); // Open the modal when the modal is shown.
    };
    const handleNavigateBack = () => {
        navigate(-1);
    }

    const routeBoards = () => {
        let path = `/sendboards`;
        navigate(path, {
            state: {
                outward_id: outward_id,
                bom_id: categoryinfoData?.bom_id,
                partner_id: categoryinfoData?.partner_id,
                qty: categoryinfoData?.qty,
                tab: key,
                categoryinfoData: categoryinfoData,
                against_po: categoryinfoData?.against_po,
            }


        });
    }
    console.log(key);
    const renderTabContent = (kitKey) => {
        const kitData = categoryinfoData?.KITS[kitKey];
        if (Array.isArray(kitData) && kitData.length === 0) {
            return <p>No data available for {kitKey}</p>;
        }
        return (
            <div className="table-responsive mt-4 ms-4" id="tableData">
                <Table className='bg-header'>
                    <thead>
                        <tr>
                            {kitKey.startsWith('E-KIT') ? (
                                <>
                                    <th>{formFieldsVendor?.sno}</th>
                                    <th>{formFieldsVendor?.manufactnum}</th>
                                    <th>Part Name</th>
                                    <th>Manufacturer</th>
                                    <th>Device Category</th>
                                    <th>Mounting Type</th>
                                    <th>Batch No</th>
                                    <th>Required Quantity</th>
                                    <th>Provided Quantity</th>
                                    <th>Balance Quantity</th>
                                </>
                            ) : (
                                []
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(kitData)?.map((partKey, index) => {
                            const part = kitData[partKey];
                            return (
                                <tr key={index}>
                                    {kitKey.startsWith('E-KIT') ? (
                                        <>
                                            <td>{index + 1}</td>
                                            <td>{part?.mfr_part_number}</td>
                                            <td>{part?.part_name}</td>
                                            <td>{part?.manufacturer}</td>
                                            <td>{part?.device_category}</td>
                                            <td>{part?.mounting_type}</td>
                                            <td>{part?.batch_no}</td>
                                            <td>{part?.required_quantity}</td>
                                            <td>{part?.provided_qty}</td>
                                            <td>{part?.balance_qty}</td>
                                        </>
                                    ) : ([])}

                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </Table>
            </div>
        );
    };

    const renderMpartsTabContent = (kitKey) => {
        // const kitData = categoryinfoData && categoryinfoData[kitKey] ;
        const kitData = categoryinfoData && categoryinfoData[kitKey] ? categoryinfoData[kitKey] : {};

        if (typeof kitData !== 'object' || kitData === null || (Array.isArray(kitData) && kitData.length === 0)) {
            return <p>No Data Available for {kitKey}</p>;
        }
        console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
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
                    "Batch No",
                    "Provided Qty",
                    "Balance Qty"
                ] : []
            const renderDataFields = (part, index) => {
                if (kitKey.startsWith("M_KIT")) {
                    return (
                        <>
                            <td>{part?.vic_part_number}</td>
                            <td>{part?.prdt_name}</td>
                            <td>{part?.material}</td>
                            <td>{part?.technical_details}</td>
                            <td>{part?.description}</td>
                            <td>{part?.qty_per_board}</td>
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
                    </Table>
                </div>
            );
        }
        else {
            console.log("no dataaaaaa")
        }
    };

    const renderCommonRow = () => (
        <Row>
            <Col xs={12} md={4}>
            <h5 className="bomtag mt-3 mb-2 text-667 font-500">{formFieldsVendor.orderId} : {categoryinfoData?.outward_id}</h5>
                {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">{formFieldsVendor.bomId} : {categoryinfoData?.bom_id}</h5> */}
                <h5 className='mb-2 bomtag text-667 font-500'>{tableContent.qty} : {categoryinfoData?.qty}</h5>
                <h5 className='bomtag mb-2 text-667 font-500'>{tableBOM.receiverName}: {categoryinfoData?.receiver_name}</h5>
   
            </Col>

            <Col xs={12} md={4}>            
                <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{tableBOM.senderName}: {categoryinfoData?.sender_name}</h5>
                <h5 className='bomtag mb-2 text-667 font-500'>{tableBOM.receiverCntNum} : {categoryinfoData?.receiver_contact_num}</h5>
                <h5 className="bomtag text-667 font-500">{formFieldsVendor.orderDate}: {categoryinfoData?.order_date}</h5>
            </Col>

            <Col xs={12} md={4}>
         
                <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{tableBOM.senderCnt} : {categoryinfoData?.contact_details}</h5>
                <h5 className='bomtag text-667 font-500'>{formFieldsVendor.material}: {categoryinfoData?.mtrl_prcnt}</h5>
            </Col>
        </Row>
    );

    // useEffect(() => {
    //     if (outward_id) {
    //         navigate(`?tab=${key}`, { state: outward_id });
    //     }
    // }, [key, navigate, outward_id]);

    useEffect(() => {
        const request = {
            "outward_id": outward_id,
            "dep_type": partner_type
        };
         setcategoryinfoData({});
        dispatch(getCategoryInfoDetails(request));
    }, []);

    const handleTabSelect = (key) => {
        setActiveKey(key);
    };

    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={handleNavigateBack} />{outward_id}</h1>
                         
                    </div>
                    <div className='tab-sec'>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="catinfo" title="Category Info">

                                {renderCommonRow()}
                                <div className='d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5'>
                                    <div className='d-flex align-items-center'>
                                        <div className='partno-sec vendorpartno-sec' >
                                            <div className='tab-sec'>
                                                <Tabs
                                                    id="controlled-tab-example"
                                                    defaultActiveKey={Object.keys(categoryinfoData?.KITS ?? {})[0]}
                                                >

                                                    {(typeof categoryinfoData === 'object' && categoryinfoData?.KITS) ? (
                                                        Object.keys(categoryinfoData?.KITS)
                                                            .filter(kitKey => kitKey.startsWith('E-KIT'))
                                                            .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                            .map((kitKey, index) => (
                                                                <Tab eventKey={kitKey} title={kitKey} key={index}>
                                                                    {renderTabContent(kitKey)}
                                                                </Tab>
                                                            ))

                                                    ) : null}

                                                    {(typeof categoryinfoData === "object" && categoryinfoData) ? (
                                                        Object.keys(categoryinfoData)
                                                            .filter(kitKey => kitKey.startsWith('M_KIT'))
                                                            .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                            .map((kitKey, index) => (
                                                                <Tab eventKey={kitKey} title={kitKey} key={index}>
                                                                    {renderMpartsTabContent(kitKey)}
                                                                </Tab>
                                                            ))

                                                    ) : null}
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="boards" title="Boards Info">
                                {renderCommonRow()}
                                {key == "boards" ? (<BoardsInfo outward_id={outwardId} dep_type={partner_type}></BoardsInfo>) : (null)}
                            </Tab>
                                {categoryinfoData.type !== "EMS" ? (<Tab eventKey="productioninfo" title="Final Product Info">
                                    {renderCommonRow()}
                                    <ProductionLineTab modalIsOpen={modalIsOpen} handleClose={handleClose} handleShow={handleShow} categoryinfoData={categoryinfoData} outward_id={outward_id} />
                                </Tab>) : null
                }
                        </Tabs>
                    </div>
                    <div className='mobilemargin-top'>
                        {key === 'productioninfo' && (
                            <Button className='submit me-2 md-me-2 submitmobile' onClick={routeBoards}>
                                Send Final Products
                            </Button>
                        )}
                        {key === 'boards' && categoryinfoData?.type === "EMS" && (
                            <Button className='submit me-2 md-me-2 submitmobile' onClick={routeBoards}>
                                Send Boards
                            </Button>
                        )}
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


            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom}
            />
        </>
    )
}

export default OrdersInnerDetails;