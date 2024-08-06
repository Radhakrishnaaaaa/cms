import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
const PoForm = () => {
    const navigate = useNavigate();
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [selectedInwardid, setSelectedInwardid] = useState(null);
    const [isChecked, setIsChecked] = useState(true);

    return (
        <>
            <div className="wrap">
                <div className="d-flex justify-content-between">
                    <h6 className="title-tag">
                        <img
                            src={arw}
                            alt=""
                            className="me-3"
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        <span>Create Purchase Order</span>
                    </h6>
                </div>
                <div class="content-sec">
                    <Row>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Kind Attn: <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Kind Attn:"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    style={{ height: "100px" }}
                                />
                            </Form.Group>
                        </Col>
                       <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <div className='d-flex justify-content-end'>
                                    <Form.Label className="mb-0">Ship To<span className="text-danger">*</span></Form.Label>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                    />
                                </div>
                                <Form.Control
                                    as="textarea"
                                    name="Ship To"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    style={{ height: "100px" }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Po Terms And Conditions <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Po Terms And Conditions"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    className="supplierheight"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Request Line <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Request Line"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    className="supplierheight"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="wrap1">
                        <h5 className="inner-tag my-2">Primary Document Details</h5>
                        <div className="content-sec">
                            <Row>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Transaction Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Transaction Name"
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">PO No <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="PO No "
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Status <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value=""></option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">PO Date <span className="text-danger">*</span></Form.Label>
                                        {/* <Form.Control
                                                type="date"
                                                name="primaryDocumentDetails.document_date"
                                                placeholder="YYYY-MM-DD"
                                                value={form.primaryDocumentDetails.document_date}
                                                onChange={onUpdateField}
                                            /> */}
                                        <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Amendment No <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value=""></option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Amendment Date <span className="text-danger">*</span></Form.Label>
                                        <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0"> Quote Reference <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name=""
                                            placeholder=""
                                        // value={form.primaryDocumentDetails.delivery_date}
                                        // onChange={onUpdateField}                                              
                                        />

                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Quote Date <span className="text-danger">*</span></Form.Label>
                                        <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Buyer Code <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Buyer Code"
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Currency <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Currency"
                                            place holder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Client Po <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Client Po"
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                            <h5 className="inner-tag">Adding Products to purchase list</h5>
                            <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                                < div className="position-relative">
                                    <InputGroup className="mb-0 search-add">
                                        <Form.Control
                                            placeholder="Search add items"
                                            aria-label="search add items"
                                            aria-describedby="basic-addon2"
                                            type="search"
                                        />
                                        <Button
                                            variant="secondary"
                                            id="button-addon2"
                                        // disabled={!searchTerm.trim() || isAddButtonDisabled}
                                        // onClick={addItem}
                                        >
                                            + Add
                                        </Button>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className="wrap2 forecasttablealign">
                            <div className="table-responsive mt-4">
                                <Table className="bg-header">
                                    <thead>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Manufacturing Part no</th>
                                            <th>Part name</th>
                                            <th>Description</th>
                                            <th>Packaging</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="wrap3">
                            <div className="content-sec1">
                                <h6 className="inner-tag my-2">Total Amount</h6>
                                <p>Total( Basic )     :</p>
                                <p>GST - 1      :</p>
                                <p>GST - 2     :</p>
                                <p>Total GST(1+2):</p>
                                <h6 className="inner-tag my-2">Grand Total   : </h6>
                                <p>Amount In Words   :</p>
                            </div>
                        </div>
                        <div className="wrap4">
                            <h5 className="inner-tag my-2">Secondary Document Details</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Prepared By <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Document Title"
                                                placeholder=""
                                            // onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Checked By<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Document Title"
                                                placeholder=""
                                            // onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Authorized Signatory<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Document Title"
                                                placeholder=""
                                            // onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={12} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Note <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="buyerDetails"
                                                placeholder=""
                                                // onChange={onUpdateField}
                                                style={{ height: "100px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={12} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Terms & Conditions <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="buyerDetails"
                                                placeholder=""
                                                // onChange={onUpdateField}
                                                style={{ height: "100px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                        >
                            Save As Draft
                        </Button>
                        <Button type="submit" className="submit">
                            Create
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default PoForm;