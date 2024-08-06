import React, { useState } from "react";
import { Tabs, Tab,Form, Table } from 'react-bootstrap';
import cancelfill from "../../../assets/Images/cancelfill.svg";
const ApprovalsListDetails = () => {
    const [isChecked, setIsChecked] = useState(true);
    return (
        <>
            <div className='d-flex justify-content-between position-relative d-flex-mobile pt-2'>
                <div className='d-flex align-items-center'>
                    <div className='innertab-sec'>
                        <Tabs id="innerTabs">
                            <Tab eventKey="Pending" title="Pending">

                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </th>
                                                   
                                                    <th>PO No</th>
                                                    <th>Counter-Party</th>
                                                    <th>Creation Date</th>
                                                    <th>Due Date</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                           
                                          <tr>
                                          <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </td>
                                                <td> P0001 </td>
                                                <td> Electronics </td>
                                                <td> 27/11/2024 </td>
                                                <td> 07/11/2024 </td>
                                                <td> Rs 4000 </td>
                                                <td> <img src={cancelfill} /> </td>
                                                </tr> 
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Approved" title="Approved">
                                {/* Content for Approved inner tab */}
                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                        <thead>
                                                <tr>
                                                <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </th>
                                                    <th>PO No</th>
                                                    <th>Counter-Party</th>
                                                    <th>Creation Date</th>
                                                    <th>Due Date</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            
                                                <tr>
                                                <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </td>
                                                <td> P0001 </td>
                                                <td> Electronics </td>
                                                <td> 27/11/2024 </td>
                                                <td> 07/11/2024 </td>
                                                <td> Rs 4000 </td>
                                                <td> <img src={cancelfill} /> </td>
                                                </tr>
                                           
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Rejected" title="Rejected">
                                {/* Content for Rejected inner tab */}
                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                        <thead>
                                                <tr>
                                                <th>
                                                    <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </th>
                                                    <th>PO No</th>
                                                    <th>Counter-Party</th>
                                                    <th>Creation Date</th>
                                                    <th>Due Date</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked} 
                                                            onChange={() => setIsChecked(!isChecked)} 
                                                          />
                                                    </td>
                                                <td> P0001 </td>
                                                <td> Electronics </td>
                                                <td> 27/11/2024 </td>
                                                <td> 07/11/2024 </td>
                                                <td> Rs 4000 </td>
                                                <td> <img src={cancelfill} /> </td>
                                                </tr>
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                        
                    </div>
                </div>
                <div className="d-flex justify-content-end align-center mt-0 d-flex-mobile-align">
        <Form.Group className="mb-0">
        <Form.Control type="search" placeholder="Search" />
      </Form.Group>
      </div>
            </div>
        </>
    );
};

export default ApprovalsListDetails;
