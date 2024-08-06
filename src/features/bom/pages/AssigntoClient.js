import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { selectLoadingState } from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import {
  formFieldsVendor,
  tableBOM,
  tableContent,
  gateEntryTable,
} from "../../../utils/TableContent";
import {
  listSelection,
  selectGetClientList,
} from "../../clients/slice/ClientSlice";
import {
  selectClientGetInfo,
  getClientinfo,
  saveClientData,
  selectClientSaveInfo,
} from "../slice/BomSlice";
import { Tabs, Tab } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AssigntoClient = () => {
  const [key, setKey] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const outward_id = location?.state?.outward_id;
  const isLoading = useSelector(selectLoadingState);
  const typeSelection = useSelector(selectGetClientList);
  const clientBody = typeSelection?.body;
  const clientData = useSelector(selectClientGetInfo);
  console.log(clientData)
 const emptybody= clientData?.body?.message;
  let clientBodyData;
  {
    clientData?.statusCode === 200 && (clientBodyData = clientData?.body);
  }
  const kits = clientBodyData?.kits || "";
  const  againstPoValue = clientBodyData?.against_po|| "NO PO for BOM"
  console.log(againstPoValue);
  const ClientQuantity = clientData?.body?.quantity;
  useEffect(() => {
    const requestobj = {
      status: "Active",
    };
    dispatch(listSelection(requestobj));

    const requestBody = {
      status: "FinalProduct",
      outward_id: outward_id,
    };
    dispatch(getClientinfo(requestBody));
  }, [dispatch]);
  useEffect(() => {
    if (clientData?.statusCode === 404) {
      setDisableButton(true);
    }
    else {
      setDisableButton(false);
    }
  }, [clientData]);

  const renderTabContent = (kitKey) => {
    if (!clientBodyData?.kits) {
      return <p>No content available for this kit</p>;
    }
    const kitData = clientBodyData.kits[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    const finalProduct = kitKey.startsWith("Final_product");
    if (finalProduct) {
      const headers = kitKey.startsWith("Final_product")
        ? [
            "S.No",
            "Unit No",
            "SVIC PCBA",
            "ALS PCBA",
            "Display Number",
            "SOM ID",
            "E Sim No",
            "E Sim ID",
          ]
        : [];
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("Final_product")) {
          return (
            <>
              <td>{index + 1}</td>
              <td>{part?.unit_no}</td>
              <td>{part?.svic_pcba}</td>
              <td>{part?.alis_pcba}</td>
              <td>{part?.display_num}</td>
              <td>{part?.som_id}</td>
              <td>{part?.E_sim_no}</td>
              <td>{part?.E_sim_id}</td>
            </>
          );
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
              {Object.keys(kitData)
                .sort(
                  (a, b) =>
                    parseInt(a.replace("kit", ""), 50) -
                    parseInt(b.replace("kit", ""), 50)
                ) // Sort the keys
                .map((partKey, index) => {
                  const part = kitData[partKey];
                  return <tr key={index}>{renderDataFields(part, index)}</tr>;
                })}
            </tbody>
          </Table>
        </div>
      );
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    outward_id: outward_id,
    sender_name: "",
    contact_details: "",
    receiver_name: "",
    receiver_contact_num: "",
    against_po: "",
    ded: "",
    client_id: "",
    client_name: "",
    quantity: ClientQuantity,
  });
  console.log(form, "formmmmmmmmmmmmmmmmmmm");
  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    };
    setForm(nextFormState);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
        const isoDate = date.toISOString().split('T')[0];
        setForm((prevDetails) => ({
            ...prevDetails,
            delivery_date: isoDate,
        }));
    }
    else {
        setForm((prevDetails) => ({
            ...prevDetails,
            delivery_date: '',
        }));
    }
};
  const handleClearForm = () => {
    setForm({
      outward_id: outward_id,
      sender_name: "",
      contact_details: "",
      receiver_name: "",
      receiver_contact_num: "",
      against_po: "",
      ded: "",
      client_id: "",
      client_name: "",
      quantity: ClientQuantity,
    });
    // clientBodyData="";
    setDisableButton(false);
    navigate(-1);
  };
  const onSubmitBom = async (e) => {
    e.preventDefault();

    const {
      outward_id,
      sender_name,
      contact_details,
      receiver_name,
      receiver_contact_num,
      ded,
      client_id,
      client_name,
    } = form;

    const requestBody = {
      // env_type: "Development",
      sender_name,
      receiver_name,
      receiver_contact_num,
      outward_id,
      ded: selectedDate.toISOString().split('T')[0],
      contact_details,
      // against_po,
      against_po: againstPoValue,
      outward_id: outward_id,
      qty: ClientQuantity,
      client_id: client_id,
      client_name: client_name,
    };

    // Data from both tabs
    const allKitData = {};

    // Process each tab's data
    Object.keys(clientBodyData?.kits).forEach((tabKey) => {
      const kitData = clientBodyData?.kits[tabKey];
      const tabData = [];

      if (kitData) {
        Object.keys(kitData).forEach((partKey) => {
          const partData = kitData[partKey];

          const kitItem = {
            svic_pcba: partData.svic_pcba,
            E_sim_id: partData.E_sim_id,
            som_id: partData.som_id,
            unit_no: partData.unit_no,
            display_num: partData.display_num,
            E_sim_no: partData.E_sim_no,
            alis_pcba: partData.alis_pcba,
            final_product_kit_id: partData.final_product_kit_id,
            status: partData.status,
          };

          tabData.push(kitItem);
        });
      }

      allKitData[tabKey] = tabData;
    });

    // Add all tab data to the request body
    requestBody["kits"] = allKitData;

    console.log(requestBody, "response of send kit");

    // Dispatch your action or handle the API call here
    const response = await dispatch(saveClientData(requestBody));

    if (response.payload?.statusCode === 404) {
      toast.error(response?.body);
    } else {
      console.log("successful");
      handleClearForm();
      setDisableButton(false);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    const selectedValue = e.target.value;
    const [client_id, client_name] = selectedValue.split(" , ");
    setForm((prevForm) => ({
      ...prevForm,
      client_id: client_id,
      client_name: client_name,
    }));
    console.log(selectedValue);
  };

  const getCategoryOptions = () => {
    if (Array.isArray(clientBody)) {
      return clientBody.map((value) => {
        return (
          <option value={`${value?.client_id} , ${value?.client_name}`}>
            {value?.client_id} - {value?.client_name}
          </option>
        );
      });
    }
  };
  useEffect(() => {
    const mKitNumbers = Object.keys(kits)
      .filter((kitKey) => kitKey.startsWith("Final_product_batch"))
      .map((kitKey) => parseInt(kitKey.replace("Final_product_batch", ""), 10));

    const highestMKitNumber = Math.min(...mKitNumbers);
    console.log(`Final_product_batch${highestMKitNumber}`);
    setKey(`Final_product_batch${highestMKitNumber}`);
  }, [kits]);
  return (
    <div>
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
      <>
        <div className="wrap">
          <div className="d-flex justify-content-between">
            <h3>
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => {
                  navigate(-1);
                }}
              />
              {tableBOM.assignHeader}
            </h3>
          </div>
          <form onSubmit={(e) => onSubmitBom(e)}>
            <div className="content-sec">
              <h5> {tableBOM.assignSubHeader}</h5>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.outwardId}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="outward_id"
                      value={outward_id}
                      onChange={onUpdateField}
                      disabled
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableContent.clientId}</Form.Label>
                    <Form.Select
                      name="client_id"
                      value={selectedOption}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">{tableBOM.selectClient}</option>
                      {getCategoryOptions()}
                    </Form.Select>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.againstPO}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="against_po"
                      // value={form?.against_po}
                      value={againstPoValue}
                      disabled
                      onChange={onUpdateField}
                      required={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.senderName}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="sender_name"
                      value={form.sender_name}
                      onChange={onUpdateField}
                      required={true}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableContent.contactDetails}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="contact_details"
                      value={form.contact_details.replace(/\D/g, "")}
                      onChange={onUpdateField}
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.receiverName}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="receiver_name"
                      value={form.receiver_name}
                      onChange={onUpdateField}
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.receiverCntNum}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="receiver_contact_num"
                      minLength={10}
                      maxLength={10}
                      value={form.receiver_contact_num.replace(/\D/g, "")}
                      onChange={onUpdateField}
                      pattern="[0-9]*"
                      required={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{gateEntryTable.quantity}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="quantity"
                      value={ClientQuantity}
                      disabled
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{tableBOM.DED}</Form.Label>
                                    <DatePicker
                                    selected={selectedDate}
                                    minDate={new Date()}
                                     onChange={handleDateChange}
                                     required={true}
                                        dateFormat="yyyy-MM-dd"
                                        name="ded"
                                        className="form-control"
                                        onFocus={(e) => e.target.readOnly = true}
                                    />
                                </Form.Group>
                            </Col>
              </Row>
              <div className="tab-sec-sendkit">
                {clientData?.statusCode === 200 ? (
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                  >
                    {typeof clientBodyData === "object" ? (
                      Object.keys(clientBodyData?.kits)
                        .sort(
                          (a, b) =>
                            parseInt(a.replace("kit", ""), 50) -
                            parseInt(b.replace("kit", ""), 50)
                        )
                        .map((kitKey, index) => (
                          <Tab eventKey={kitKey} title={kitKey} key={index}>
                            {renderTabContent(kitKey)}
                          </Tab>
                        ))
                    ) : (
                      <></>
                    )}
                  </Tabs>
                ) : (
                  <h5 className="d-flex justify-content-center coming-sec">
                  {emptybody}
                  </h5>
                )}
              </div>
            </div>

            <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
              <Button
                type="button"
                className="cancel me-2"
                onClick={() => {
                  navigate(-1);
                }}
              >
                {formFieldsVendor.btnCancel}
              </Button>
              {disableButton ? (
                <Button type="submit" className="submit" disabled>
                  {formFieldsVendor.btnAssign}
                </Button>
              ) : (
                <Button type="submit" className="submit">
                  {formFieldsVendor.btnAssign}
                </Button>
              )}
            </div>
          </form>
        </div>
        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">
                {" "}
                {formFieldsVendor.loader}
              </span>
            </Spinner>
          </div>
        )}
      </>
    </div>
  );
};

export default AssigntoClient;
