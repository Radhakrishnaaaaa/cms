import React, { useEffect, useState } from "react";
import {
  CmsForcastPurchaseOrderUploadPO,
  CmsGetInnerForcastPurchaseOrderDetails,
  selectPurchaseList,
} from "../slice/SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Table, Button } from "react-bootstrap";
import arwdown from "../../../assets/Images/down_arw.svg";
import arwup from "../../../assets/Images/up_arrow.svg";
import editfill from "../../../assets/Images/editfill.svg";
import cancelfill from "../../../assets/Images/cancelfill.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import Uarw from "../../../assets/Images/u-arw.png";
import { useNavigate } from "react-router";

export const PurchaseLists = () => {
  const [show, setShow] = useState(false);
  const [showDataIndex, setShowDataIndex] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [uploadpoevent, setUploadpoevent] = useState({});
  console.log(JSON.stringify(uploadpoevent, null, 2));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchaseListdata = useSelector(selectPurchaseList);
  const purchaseList = purchaseListdata?.body;
  const [showpdfPreview, setshowpdfPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleToggleInnerTable = (index) => {
    setShowDataIndex(index === showDataIndex ? null : index);
  };
  const handleDocumentClick = (documentUrl) => {
    // window.open(documentUrl, '_parent');
    setSelectedDocument(documentUrl);
    setshowpdfPreview(true);
  };

  const handleOpenModal = (fcid) => {
    const nextFormState = {
      ...uploadpoevent,
      fc_id: fcid,
    };
    setUploadpoevent(nextFormState);
    handleShow();
  };

  const handleDateChange = (event) => {
    const { value, name } = event.target;
    const formattedDate = formatDate(value);
    setUploadpoevent((prevForm) => ({
      ...prevForm,
      [name]: formattedDate,
    }));
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf" && file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Only PDF && Image type files are allowed");
    } else {
      const fileName = file?.name;
      const parts = fileName.split(".");
      const extension = parts[parts.length - 1];
      const fileNameWithoutExtension = fileName
        .split(".")
        .slice(0, -1)
        .join(".");

      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setPdfPreview(reader.result);
        encodedFile = fileOutput.target.result.split(",")[1];
        nextFormState = {
          ...uploadpoevent,
          [e.target.name]: encodedFile,
          doc_name: fileName,
        };
        setUploadpoevent(nextFormState);
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
  };
  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setUploadpoevent((prevForm) => ({
      ...prevForm,
      doc_body: "",
      doc_name: "",
    }));
  };

  const handleResetUploadPo = () => {
    handleClose();
    setPdfPreview(null);
      setUploadpoevent({});
  }

  
  const navigateFcPoDetails = (po_name, fc_po_ids, order_value, due_date, fc_date, status) => {
    if(status){
    console.log(fc_po_ids, po_name, order_value, due_date ,status )                        
    navigate("/forecastpoDetails", {
        // state: item?.bom_name
        state: {
            fc_po_id: fc_po_ids,
            poName: po_name,
            orderValue : order_value,
            dueDate : due_date,
            fcDate : fc_date
          },
    });
  }
}

  const handlePOsubmit = async (e) => {
    e.preventDefault();
    if(uploadpoevent.fc_date === undefined){
      toast.error("Kindly Choose Date");
      return;
    }
    if (uploadpoevent.doc_body && uploadpoevent.fc_date !== undefined) {
      handleClose();
      await dispatch(CmsForcastPurchaseOrderUploadPO(uploadpoevent));
      setPdfPreview(null);
      // setUploadpoevent((prevForm) => ({
      //   ...prevForm,
      //   doc_name: "",
      // }));
      setUploadpoevent({});
      dispatch(CmsGetInnerForcastPurchaseOrderDetails());
    } else {
      toast.error("Please Upload Mandatory File");
    }
  };

  useEffect(() => {
    dispatch(CmsGetInnerForcastPurchaseOrderDetails());
  }, []);
  return (
    <div className="salestablealign">
      <div className="table-responsive mt-2">
        <Table className="salestable">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Company Name</th>
              <th>Transaction Name</th>
              <th>Document Number</th>
              <th>Bom Name</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Last Date Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(purchaseList) ? (
              purchaseList?.map((purchaselistdetails, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{purchaselistdetails?.fc_po_ids}</td>
                      <td>{purchaselistdetails?.client_name}</td>
                      <td>
                        <span className="border-item">
                          {purchaselistdetails?.document_title}
                        </span>
                      </td>
                      <td
                        onClick={() =>
                          handleDocumentClick(purchaselistdetails?.document_url?.content)
                        }
                      >
                        <span className="border-item">
                          {purchaselistdetails?.document_number}
                        </span>
                      </td>
                      <td>{purchaselistdetails?.bom_name}</td>
                      <td>{purchaselistdetails?.delivery_date}</td>
                      <td>{purchaselistdetails?.status}</td>
                      <td>{purchaselistdetails?.last_modified_date}</td>
                      <td>
                        <img
                          style={{ cursor: "pointer" }}
                          src={showDataIndex !== index ? arwdown : arwup}
                          onClick={() => handleToggleInnerTable(index)}
                        />{" "}
                        <img src={editfill} /> <img src={cancelfill} />{" "}
                      </td>
                    </tr>
                    {showDataIndex === index && (
                      <tr>
                        <td colSpan="9" className="text-center">
                          <div className="text-right">
                            <Button
                              size="sm"
                              className="upload_po_btn"
                              onClick={() =>
                                handleOpenModal(purchaselistdetails?.fc_po_ids)
                              }
                            >
                              Upload PO
                            </Button>
                          </div>
                          <Table responsive="xl" className="innerTable">
                            <thead>
                              <tr>
                                <th>Month</th>
                                <th>Document Date</th>
                                <th>Purchase Order</th>
                                <th>Quantity</th>
                                <th>Due Date</th>
                                <th>Order value</th>
                                <th>Order Status</th>
                                <th>Payment Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {purchaselistdetails?.forecast_details.map(
                                (forecast, index) => {
                                  const key = Object.keys(forecast)[0];
                                  const data = forecast[key];
                                  return (
                                    <tr key={index}>
                                      <td>{data.month}</td>
                                      <td>{data?.fc_date || "-"}</td>
                                      {/* <td>{data?.po_name}</td> */}
                                      <td style={{textDecoration: "underline"}} onClick={() => navigateFcPoDetails(data?.po_name, purchaselistdetails?.fc_po_ids, data?.order_value, data?.due_date, data?.fc_date, data?.monthly_status )}>{data?.po_name.replace(/\.[^.]+$/, '')}</td>
                                      <td>{data?.quantity}</td>
                                      <td>{data?.due_date}</td>
                                      <td>{data?.order_value}</td>
                                      <td>{data?.order_status}</td>
                                      <td>{data?.payment_status}</td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : null}
            {Array.isArray(purchaseList) && purchaseList.length === 0 && 
               (
              <tr>
                <td colSpan="6" className="text-center">
                  No Data Avaiable
                </td>
              </tr>
            )}
            <Modal
              show={showpdfPreview}
              size="lg"
              centered
              onHide={() => setshowpdfPreview(false)}
            >
                <Modal.Header closeButton>
                    Purchase Order
                </Modal.Header>
              {selectedDocument && (
                <div>
                  <iframe
                    src={selectedDocument}
                    style={{ width: "100%", height: "700px" }}
                  ></iframe>
                </div>
              )}
            </Modal>
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleResetUploadPo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column mb-4">
              <label
                htmlFor="date"
                style={{ fontSize: "14px", marginBottom: "2px" }}
              >
                Choose Month<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="date"
                name="fc_date"
                style={{ width: "50%" }}
                type="date"
                onChange={handleDateChange}
                required={true}
              />
            </div>
            <div className="upload-btn-wrapper">
              {pdfPreview ? (
                <>
                  <img
                    style={{ maxwidth: "100px", maxHeight: "100px" }}
                    src={pdfImage}
                    alt="pdf preview"
                  />
                  <button className="close" onClick={handleCancelPdfPreview}>
                    &times;
                  </button>
                </>
              ) : (
                <>
                  <button className="btn">
                    <img src={Uarw} alt="" />
                    <span className="uploadtext">Upload</span>
                    <input
                      type="file"
                      name="doc_body"
                      onChange={handleFileUpload}
                      required={true}
                    />
                  </button>
                </>
              )}
            </div>
            <div>
              {uploadpoevent.doc_name && (
                <p className="uploadimg-tag">{uploadpoevent.doc_name}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleResetUploadPo}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handlePOsubmit}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
