import React, { useState } from 'react';
import { Form, useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast, ToastContainer, Zoom } from "react-toastify";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import SalesPurchaseListDetails from "./SalespurchaseListDetails";
import QuotationsListDetails from './QuotationsListDetails';
import ApprovalsListDetails from './ApprovalsListDetails';
import Modal from 'react-bootstrap/Modal';
import arw from "../../../assets/Images/left-arw.svg";
import arwdown from "../../../assets/Images/down_arw.svg";

const SalespurchaseList = () => {

    const [key, setKey] = useState('SalesPurchase');
    const [showPurchaseOrderModal, setPurchaseOrderShowModal] = useState(false);
    const [showInvoiceModal, setInvoiceShowModal] = useState(false);
    const [showproformaModal, setProformaShowModal] = useState(false);
    const handleClose = () => setPurchaseOrderShowModal(false); 
    const navigate = useNavigate();

    const handlePurchaseOrderClick = () => {
        setPurchaseOrderShowModal(true);
    };

    const handleInvoiceClick = () => {
        setInvoiceShowModal(true);
    };

    const handleProformaInvoiceClick = () => {
        setProformaShowModal(true);
    };



    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile border-bottom'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'>Sales & Purchase</h1>
                        <div className='tab-sec'>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >  
                                <Tab eventKey="SalesPurchase" title="Sales & Purchase">
                                    <SalesPurchaseListDetails />
                                </Tab>
                                <Tab eventKey="Quotations" title="Quotations">
                                    <QuotationsListDetails />
                                </Tab>
                                <Tab eventKey="Approvals" title="Approvals">
                                   <ApprovalsListDetails />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>

               
                        <Dropdown className="customdropdwn">
                            <Dropdown.Toggle id="dropdown-autoclose-true" className='p-2 bg-white border' align={{ lg: 'start', md: 'start', sm: 'start' }}>
                                Create Document
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handlePurchaseOrderClick}>Purchase Order</Dropdown.Item>
                                <Dropdown.Item href="/serviceorder">Service Order</Dropdown.Item>
                                <Dropdown.Item onClick={handleInvoiceClick}>Invoice</Dropdown.Item>
                                <Dropdown.Item onClick={handleProformaInvoiceClick}>Proforma Invoice</Dropdown.Item>
                                <Dropdown.Item href="/clientpo">Client Purchase Order</Dropdown.Item>
                            <Dropdown.Item href="/poreturn">Return Purchase Order</Dropdown.Item>
                            <Dropdown.Item href="/forecastpo">Forecast Purchase Order</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>


                </div>
            </div>

            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom} />

            <Modal show={showPurchaseOrderModal} centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                            />
                            <span>Please Add/Select Vendor</span>
                        </h6>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Vendor</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' >+ Add New Vendor</Button>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-4'>
                        <span>Excel Electronics</span>
                        <div className='justify content-end'> <img src={arwdown} /></div>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                        onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'onClick={() => navigate('/PoForm')}>Ok</Button>
                    </div>
                </div>
            </Modal>

            <Modal show={showInvoiceModal}  centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                            />
                            <span>Please Add/Select Client</span>
                        </h6>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Client</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' >+ Add New Client</Button>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-4'>
                        <span>Enter Buyer Name</span>
                        <div className='justify content-end'> <img src={arwdown} /></div>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                        onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'onClick={() => navigate('/Invoice')}>Ok</Button>
                    </div>
                </div>
            </Modal>

            <Modal show={showproformaModal}  centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                            />
                            <span>Please Add/Select Client</span>
                        </h6>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Client</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' >+ Add New Client</Button>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-4 mb-4'>
                        <span>Enter Buyer Name</span>
                        <div className='justify content-end'> <img src={arwdown} /></div>
                    </div>
                    <div className="border-top">
                    </div>
                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                        onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'onClick={() => navigate('/ProformaInvoice')}>Ok</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SalespurchaseList;