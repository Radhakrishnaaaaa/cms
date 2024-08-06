import React, { useState } from 'react';
import { Form, useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { toast, ToastContainer, Zoom } from "react-toastify";
import arwdown from "../../../assets/Images/down_arw.svg";
import arwup from "../../../assets/Images/up_arrow.svg"
import editfill from "../../../assets/Images/editfill.svg";
import cancelfill from "../../../assets/Images/cancelfill.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import Uarw from "../../../assets/Images/u-arw.png"
import { selectLoadingState } from '../slice/SalesSlice';
import { PurchaseLists } from './PurchaseLists';



const SalespurchaseList = () => {

    const [key, setKey] = useState('Active');
    const isLoading = useSelector(selectLoadingState);
    return (
        <>

            <div className='d-flex justify-content-between position-relative d-flex-mobile pt-2'>
                <div className='d-flex align-items-center'>
                {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
                    <div className='innertab-sec'>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="Active" title="Active">
                                <PurchaseLists />
                            </Tab>
                            <Tab eventKey="Quotations" title="Cancelled">
                            <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                    <th>Order No</th>
                                                    <th>Company Name</th>
                                                    <th>Transaction Name</th>
                                                    <th>Document Number</th>
                                                    <th>Due Date</th>
                                                    <th>Status</th>
                                                    <th>Last Date Modified</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>PTG-1</td>
                                                    <td>Excel Electronics</td>
                                                    <td><span className='border-item'>Client order for final product</span></td>
                                                    <td><span className='border-item'>CPO-PO00001</span></td>
                                                    <td>5 days left</td>
                                                    <td>Cancelled</td>
                                                    <td>27/11/2023,10:53 Am</td>
                                                    <td><img src={arwdown} />  <img src={cancelfill} /> </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Drafts" title="Drafts">
                            <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                    <th>Order No</th>
                                                    <th>Company Name</th>
                                                    <th>Transaction Name</th>
                                                    <th>Document Number</th>
                                                    <th>Request Status</th>
                                                    <th>Tracking</th>
                                                    <th>Status</th>
                                                    <th>Last Date Modified</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>PTG-1</td>
                                                    <td>Excel Electronics</td>
                                                    <td><span className='border-item'>Client order for final product</span></td>
                                                    <td><span className='border-item'>CPO-PO00001</span></td>
                                                    <td>Return Requested</td>
                                                    <td>Received</td>
                                                    <td>Open</td>
                                                    <td>27/11/2023,10:53 Am</td>
                                                    <td><img src={editfill} />  <img src={cancelfill} /> </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="ReturnOrder" title="Return Order">
                            <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                    <th>Order No</th>
                                                    <th>Company Name</th>
                                                    <th>Transaction Name</th>
                                                    <th>Document Number</th>
                                                    <th>Request Status</th>
                                                    <th>Tracking</th>
                                                    <th>Status</th>
                                                    <th>Last Date Modified</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>PTG-1</td>
                                                    <td>Excel Electronics</td>
                                                    <td><span className='border-item'>Client order for final product</span></td>
                                                    <td><span className='border-item'>CPO-PO00001</span></td>
                                                    <td>Return Requested</td>
                                                    <td>Received</td>
                                                    <td>Open</td>
                                                    <td>27/11/2023,10:53 Am</td>
                                                    <td><img src={editfill} /></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalespurchaseList;