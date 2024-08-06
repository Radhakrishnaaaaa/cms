import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import { Spinner } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import { tableBOM, tableContent } from "../../../utils/TableContent";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { getBomDetails, getPatnersList, saveAssigntoEmsAPI, selectBomDetails, selectLoadingState, selectPartnerList} from "../slice/BomSlice";
import {selectAgainstPO , getagainstPO} from "../../clients/slice/ClientSlice"

const AssignBom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [key, setKey] = useState('Ecategoryinfo');
  const [type, setType] = useState('EMS');
  const [quantity, setQuantity] = useState("1");
  const [partnerId, setPartnerId] = useState('');
  const [form, setForm] = useState({
    type: type,
    partner_id: "",
    sender_name: "",
    contact_details: "",
    qty: "1",
    receiver_name: "",
    receiver_contact_num: "",
    against_po:""
  });
  const currentDate = new Date().toISOString().split('T')[0];
  const [deliveryEndDate, setDeliveryEndDate] = useState(currentDate);
  const [againstPoValue, setAgainstPoValue] = useState("")
  const {bomId, bomName} = location.state;
  const partnerslist = useSelector(selectPartnerList);
  const bomdetailsdata = useSelector(selectBomDetails);
  const againstPOdata = useSelector(selectAgainstPO);
  const bomdet = bomdetailsdata?.body;
  const isLoading = useSelector(selectLoadingState);
  const bomDetailsData = bomdetailsdata?.body?.parts;
  console.log(bomDetailsData);
  const [ecategoryInfobomData, setecategoryInfoBomData] = useState([]);
  const [mcategoryInfobomData, setmcategoryInfoBomData] = useState([]);
  const [mcategoryBatchNoValues, setMcategoryBatchNoValues] = useState({});
  const [ecategoryBatchNoValues, setEcategoryBatchNoValues] = useState({});
  const [mcategoryProvidedQty, setMcategoryProvidedQty] = useState([]);
  const [ecategoryProvidedQty, setEcategoryProvidedQty] = useState([]);
  const [totalEcategoryProvidedQty, setTotalEcategoryProvidedQty] = useState(0);
  const [totalMcategoryProvidedQty, setTotalMcategoryProvidedQty] = useState(0);

  console.log(ecategoryBatchNoValues);
  console.log(ecategoryInfobomData);
  console.log(bomdetailsdata);
  const Allpartners = partnerslist?.body;
  const handletypeChange = (e) =>{
    setType(e.target.value);
    setPartnerId("");
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
    const request = {
      "partner_type" : e.target.value
    }
    dispatch(getPatnersList(request));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const newQuantity = value ? parseInt(value, 10) : 1;

    if (isNaN(newQuantity) || newQuantity <= 0) {
      setQuantity(1); 
      return;
    }

    setQuantity(newQuantity);

    if (bomdet?.dep_type === "Mechanic") {
      const updatedBomData = mcategoryInfobomData.map((item) => ({
        ...item,
        required_quantity: (item.required_quantity / quantity) * newQuantity,
      }));
      setmcategoryInfoBomData(updatedBomData);
    } else if (bomdet?.dep_type === "Electronic") {
      const updatedBomData = ecategoryInfobomData.map((item) => ({
        ...item,
        required_quantity: (item.required_quantity / quantity) * newQuantity,
      }));
      console.log(JSON.stringify(updatedBomData, null, 2));
      setecategoryInfoBomData(updatedBomData);
    }

    const nextFormState = {
      ...form,
      [e.target.name]: newQuantity,
    };
    setForm(nextFormState);
  }
  const updateformfield = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    };
    setForm(nextFormState);
  }
  const getPartnersOptions = () => {
    if (Array.isArray(Allpartners) && Allpartners.length > 0) {
      return Allpartners?.map((value) => {
        return (
          <option value={`${value?.partner_id}`}>
            {value?.partner_id} - {value?.partner_name}
          </option>
        );
      });
    }
    else{
      return (
        <option disabled={true}>
          No Partners
        </option>
      )
    }
  }

  const handlePartnerChange = (e) => {
    setPartnerId(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  }

  const handleProvidedQtyChange = (e, index) => {
    const newProvidedQty = e.target.value;
  if (type === 'BOX BUILDING') {
    const updatedProvidedQty = [...mcategoryProvidedQty];
    updatedProvidedQty[index] = newProvidedQty;
    setMcategoryProvidedQty(updatedProvidedQty);
  } else if (type === 'EMS') {
    const updatedProvidedQty = [...ecategoryProvidedQty];
    updatedProvidedQty[index] = newProvidedQty;
    setEcategoryProvidedQty(updatedProvidedQty);
  }
  else if(type === 'EMS & BOX BUILDING'){
    if(bomdet?.dep_type === "Mechanic"){
      const updatedProvidedQty = [...mcategoryProvidedQty];
    updatedProvidedQty[index] = newProvidedQty;
    setMcategoryProvidedQty(updatedProvidedQty);
      const updatedBomData = mcategoryInfobomData.map((item, i) => ({
        ...item,
        provided_qty: i === index ? newProvidedQty : item.provided_qty,
        balance_qty: i === index ? (newProvidedQty - item?.required_quantity)?.toString() : (item.balance_qty)?.toString(),
      }));
    
      setmcategoryInfoBomData(updatedBomData);
     }
     else if(bomdet?.dep_type === "Electronic"){
      const updatedProvidedQty = [...ecategoryProvidedQty];
    updatedProvidedQty[index] = newProvidedQty;
    setEcategoryProvidedQty(updatedProvidedQty);
      const updatedBomData = ecategoryInfobomData.map((item, i) => ({
        ...item,
        provided_qty: i === index ? newProvidedQty : item.provided_qty,
        balance_qty: i === index ? (newProvidedQty - item?.required_quantity)?.toString() : (item.balance_qty)?.toString(),
      }));
       setecategoryInfoBomData(updatedBomData);
     }
  }

  // Update bomData based on the new providedQty
  if(bomdet?.dep_type === "Mechanic"){
    const updatedBomData = mcategoryInfobomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          provided_qty: newProvidedQty,
          balance_qty: (newProvidedQty - item?.required_quantity)?.toString()
        };
      } else {
        return item;
      }
    });
    setmcategoryInfoBomData(updatedBomData);
    const mcat = calculateTotalProvidedQty(updatedBomData);
    setTotalMcategoryProvidedQty(mcat);
   }
   else if(bomdet?.dep_type === "Electronic"){
    const updatedBomData = ecategoryInfobomData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          provided_qty: newProvidedQty,
          balance_qty: (newProvidedQty - item?.required_quantity)?.toString()
        };
      } else {
        return item;
      }
    });
    console.log(updatedBomData);
     setecategoryInfoBomData(updatedBomData);
     const ecat  = calculateTotalProvidedQty(updatedBomData);
     setTotalEcategoryProvidedQty(ecat);
   }
 
  };
  const calculateTotalProvidedQty = (data) => {
    return data.reduce((total, item) => {
      return total + (parseInt(item.provided_qty) || 0);
    }, 0);
  };
  const handleBatchNoChange = (e, index) => {
    const newBatchNo = e.target.value;
    if (type === 'BOX BUILDING') {
      setMcategoryBatchNoValues((prevValues) => ({
        ...prevValues,
        [index]: newBatchNo,
      }));
    } 
    else if (type === 'EMS') {
      setEcategoryBatchNoValues((prevValues) => ({
        ...prevValues,
        [index]: newBatchNo,
      }));
    }
    else if(type === "EMS & BOX BUILDING"){
      if (bomdet?.dep_type === 'Mechanic') {
        setMcategoryBatchNoValues((prevValues) => ({
          ...prevValues,
          [index]: newBatchNo,
        }));
        const updatedBomData = mcategoryInfobomData.map((item, i) => ({
          ...item,
          batch_no: i === index ? newBatchNo : item.batch_no,
          damage_qty: "0"
        }));
        setmcategoryInfoBomData(updatedBomData);
      } else if (bomdet?.dep_type === 'Electronic') {
        setEcategoryBatchNoValues((prevValues) => ({
          ...prevValues,
          [index]: newBatchNo,
        }));
        const updatedBomData = ecategoryInfobomData.map((item, i) => ({
          ...item,
          batch_no: i === index ? newBatchNo : item.batch_no,
          damage_qty: "0"
        }));
        setecategoryInfoBomData(updatedBomData);
      }
    }
  
    if (bomdet?.dep_type === 'Mechanic') {
      const updatedBomData = mcategoryInfobomData.map((item, i) => ({
        ...item,
        batch_no: i === index ? newBatchNo : item.batch_no,
        damage_qty: "0"
      }));
      setmcategoryInfoBomData(updatedBomData);
    } else if (bomdet?.dep_type === 'Electronic') {
      const updatedBomData = ecategoryInfobomData.map((item, i) => ({
        ...item,
        batch_no: i === index ? newBatchNo : item.batch_no,
        damage_qty: "0"
      }));
      setecategoryInfoBomData(updatedBomData);
    }
    console.log(bomdet?.dep_type);
  };

  const handleDeliveryData = (e) => {
    const selectedDate = e.target.value;
    setDeliveryEndDate(selectedDate);
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: selectedDate,
    }));
  }
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     // Check if mcategoryInfobomData or ecategoryInfobomData has data
  if (
    (key === "Mcategoryinfo" && (!mcategoryInfobomData || mcategoryInfobomData.length === 0)) ||
    (key === "Ecategoryinfo" && (!ecategoryInfobomData || ecategoryInfobomData.length === 0))
  ) {
    // Display toast message
    toast.error("At least one component is required.", {
      position: "top-center",
      autoClose: 3000, // milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    return; // Prevent further execution
  }

  if (key === "Mcategoryinfo") {
    mcategoryInfobomData.forEach((item) => {
      if (!item.hasOwnProperty('provided_qty')) {
        item.provided_qty = "0";
      }
    });
  } else if (key === "Ecategoryinfo") {
    console.log(ecategoryInfobomData);
    ecategoryInfobomData.forEach((item) => {
      if (!item.hasOwnProperty('provided_qty')) {
        item.provided_qty = "0";
      }
    });
    console.log(JSON.stringify(ecategoryInfobomData, null, 2));
  }
  
  
    const request = {
        ...form,
        "bom_id": bomId,
        against_po:againstPoValue
    }
    if (key === "Mcategoryinfo") {
      request.mcategoryInfo = mcategoryInfobomData;
    } else if(key === "Ecategoryinfo"){
      request.ecategoryInfo = ecategoryInfobomData;
    }

    if (type === "EMS & BOX BUILDING") {
        request.mcategoryInfo = mcategoryInfobomData;
        request.ecategoryInfo = ecategoryInfobomData;
    }
    const response = await dispatch(saveAssigntoEmsAPI(request));
    if (response.payload?.statusCode === 200) {
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      setMcategoryProvidedQty([]);
      setEcategoryProvidedQty([]);
      setMcategoryBatchNoValues({});
      setEcategoryBatchNoValues({});
    }
    

  }


  const handleKeyDown = (e) => {
    e.preventDefault();
  };


  useEffect(() => {
    if(type === "BOX BUILDING"){
      setKey("Mcategoryinfo");
    }
    else if(type === "EMS"){
      setKey("Ecategoryinfo");
    }
  }, [type]);

  useEffect(() => {
    const request = {
      "partner_type" : type
    }
    dispatch(getPatnersList(request));
  }, [])
  useEffect(() => {
    const request = {
        "bom_name": bomName,
        "bom_id": bomId,
        "dep_type": key === "Mcategoryinfo" ? "Mechanic" : "Electronic",
    }
    dispatch(getBomDetails(request));
}, [dispatch, bomId, bomName, key]);

useEffect(()=>{
  const requestBody = 
  {
    bom_id: bomId  
}
dispatch(getagainstPO(requestBody))
},[dispatch, bomId,selectAgainstPO])

useEffect(()=>{
  if (againstPOdata?.statuscode === 200){
    setAgainstPoValue(againstPOdata?.body?.po_id)
    }
    else if (againstPOdata?.statuscode === 404){
      // setAgainstPoValue("NO PO for Bom")
    }
},[selectAgainstPO, location])
  useEffect(() => {
    if(!isLoading){
      const updatedBomData = bomdetailsdata?.body?.parts?.map((item) => ({
        ...item,
      }));

      if(bomdet?.dep_type === "Mechanic"){
       setmcategoryInfoBomData(updatedBomData);
      }
      else if(bomdet?.dep_type === "Electronic"){
        console.log(JSON.stringify(updatedBomData, null, 2))
        setecategoryInfoBomData(updatedBomData);
      }
    }
  }, [bomdetailsdata]);

  // useEffect(() => {
  //   if (!isLoading) {
  //     const updatedBomData = bomdetailsdata?.body?.parts?.map((item) => ({
  //       ...item,
  //       required_quantity: quantity > 0 ? (item.required_quantity * quantity).toString() : item.required_quantity.toString(),
  //     }));
      
  //     if(bomdet?.dep_type === "Mechanic"){
  //       setmcategoryInfoBomData(updatedBomData);
  //      }
  //      else if(bomdet?.dep_type === "Electronic"){
  //       console.log(JSON.stringify(updatedBomData, null, 2))
  //        setecategoryInfoBomData(updatedBomData);
  //      }
  //   }
  // }, [quantity]);
  // console.log(JSON.stringify(form, null,2));
  // After mapping through mcategoryInfobomData
// const totalMcategoryProvidedQty = mcategoryProvidedQty.reduce((total, qty) => total + parseInt(qty), 0);
const totalMcategoryBalanceQty = mcategoryInfobomData.reduce((total, item, index) => total + parseInt(mcategoryProvidedQty[index] - item.required_quantity), 0);

// After mapping through ecategoryInfobomData
// const totalEcategoryProvidedQty = ecategoryProvidedQty.reduce((total, qty) => total + parseInt(qty), 0);
const totalEcategoryBalanceQty = ecategoryInfobomData.reduce((total, item, index) => total + parseInt(ecategoryProvidedQty[index] - item.required_quantity), 0);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between w-100">
          <h1 className="title-tag">
            <img
              src={arw}
              alt="back-buttton"
              className="me-3"
              onClick={() => navigate(-1)}
            />
            Assigning BOM
          </h1>
        </div>

        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="content-assigntobom">
            <h3 className="inner-tag">Details</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Select Type</Form.Label>
                  <Form.Select value={type} name="type" onChange={handletypeChange} required={true}>
                    {/* <option value="">Select a Type</option> */}
                    <option value="EMS">EMS</option>
                    {/* <option value="BOX BUILDING">Box Building</option> */}
                    {/* <option value="EMS & BOX BUILDING">EMS & Box Building</option> */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Partner ID</Form.Label>
                  <Form.Select name="partner_id" value={partnerId} onChange={handlePartnerChange} required={true}>
                    <option value="">Select a Partner</option>
                    {getPartnersOptions()}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" placeholder="" name="qty" min={1} value={quantity} onChange={handleQuantityChange} required={true}/>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Sender Name</Form.Label>
                  <Form.Control type="text" placeholder="" name="sender_name"  value={form?.sender_name}  onChange={updateformfield} required={true} />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Contact Details</Form.Label>
                  <Form.Control type="text" placeholder="" name="contact_details"  pattern="[0-9]*" minLength={10} maxLength={10} value={form?.contact_details.replace(/\D/g, "")} onChange={updateformfield} required={true} />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Receiver Name</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver_name"  onChange={updateformfield}  required={true}/>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Receiver Contact Number</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver_contact_num" pattern="[0-9]*" minLength={10} maxLength={10} value={form?.receiver_contact_num.replace(/\D/g, "")} onChange={updateformfield} required={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Against PO</Form.Label>
                  {/* <Form.Select>
                    <option></option>
                    {againstPOBody}
         
                  {/* </Form.Select>  */}
                  {/* <Form.Select name="against_po" onChange={updateformfield} required={true}>
                    <option value="">Select a PO ID</option>
                    {getagainstPOData()}
                  </Form.Select> */}
               <Form.Control type="text" placeholder="" name="against_po"  value={againstPoValue} required={true} disabled/> 
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Delivery End Date</Form.Label>
                  <Form.Control type="date" min={currentDate} value={deliveryEndDate} onKeyDown={handleKeyDown} name="ded" onChange={handleDeliveryData} required={true}/>
                </Form.Group>
              </Col>
            </Row>
            <div className='justify-content-between position-relative w-100 border-bottom d-flex-mobile'>
            <div className='align-items-center'>
                    <div className='tab-section'>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
                {type === "BOX BUILDING" || type === "EMS & BOX BUILDING" ? 
                (<Tab eventKey="Mcategoryinfo" title="M-Category Info">
                    <div className='table-responsive mt-3'>
                        <Table className='b-table'>
                            <thead>
                             <tr>
                             <th>{tableBOM.vicNo}</th>
                             <th>{tableContent.partName}</th>
                             <th>{tableBOM.material}</th>
                             <th>{tableBOM.technicalDetails}</th>
                             <th>{tableBOM.description}</th>
                             {/* <th>Available Qty</th> */}
                             <th>Required Quantity</th>
                             <th>Batch No</th>
                             <th>Provided Qty</th>
                             <th>Balance Qty</th>
                             <th>Damage Qty</th>
                            </tr>
                            </thead>
                        <tbody>
                        {mcategoryInfobomData && mcategoryInfobomData.length > 0 ? (
                                                mcategoryInfobomData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item?.vic_part_number}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.material}</td>
                                                                <td>{item?.technical_details}</td>
                                                                <td>{item?.description}</td>
                                                                {/* <td>{item?.available_quantity}</td>                                                          */}
                                                                <td>{item?.required_quantity}</td>
                                                                <td><input className="input-50" value={mcategoryBatchNoValues[index]?.trimStart() || ""} onChange={(e) => handleBatchNoChange(e, index)} required={true} /></td>
                                                                <td><input className="input-50" type="number" value={mcategoryProvidedQty[index]} onChange={(e) => handleProvidedQtyChange(e, index)} required={true} /></td>
                                                                <td>{(mcategoryProvidedQty[index] - item?.required_quantity) || 0}</td>
                                                                <td>0</td>
                                                                <td></td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className='text-center'>no Data Available</td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                    <td>Total</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{totalMcategoryProvidedQty || '0'}</td>
                                                    <td>{totalMcategoryBalanceQty || '-'}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    </tr>
                        </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                ) : (
                  <></>
                )}
                                    {type === "EMS" || type === "EMS & BOX BUILDING" ?
                                    (<Tab eventKey="Ecategoryinfo" title="E-Category Info">
                                    <div className='table-responsive mt-4'>
                                        <Table className='b-table'>
                                            <thead>
                                                <tr>
                                                    <th>Manufacturer Part No</th>
                                                    <th>Part Name</th>
                                                    <th>Manufacturer</th>
                                                    <th>device Category</th>
                                                    <th>Mounting Type</th>
                                                    {/* <th>Available Qty</th> */}
                                                    <th>Required Quantity</th>
                                                    <th>Batch No</th>
                                                    <th>Provided Qty</th>
                                                    <th>Balance Qty</th>
                                                    <th>Damage Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {ecategoryInfobomData && ecategoryInfobomData.length > 0 ? (
                                                        ecategoryInfobomData.map((item, index) => {
                                                          return(
                                                            <tr key={index}>
                                                                <td>{item?.mfr_part_number}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.manufacturer}</td>
                                                                <td>{item?.device_category}</td>
                                                                <td>{item?.mounting_type}</td> 
                                                                {/* <td>{item?.available_quantity}</td>*/}
                                                                <td>{item?.required_quantity}</td>
                                                                <td><input className="input-50" value={ecategoryBatchNoValues[index]?.trimStart() || ""} onChange={(e) => handleBatchNoChange(e, index)} required={true} /></td>
                                                                <td><input className="input-50" type="number" min={0} value={ecategoryProvidedQty[index]} onChange={(e) => handleProvidedQtyChange(e, index)} required={true} /></td>
                                                                <td>{(ecategoryProvidedQty[index] - item?.required_quantity) || 0}</td>
                                                                <td>0</td>
                                                            </tr>
                                                        );
                                                      })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className='text-center'>No Data Available</td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                    <td>Total</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{totalEcategoryProvidedQty || '0'}</td>
                                                    <td>{totalEcategoryBalanceQty || '-'}</td>
                                                    <td></td>
                                                    <td></td>
                                                    </tr>
                                            </tbody>
                                        </Table>
                                        </div>
                                    </Tab>
                                    ) : (<></>)}
                                </Tabs>
            </div>
            </div>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button type="button" className="cancel me-2" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="submit"
            disabled={
                (key === "Mcategoryinfo" && totalMcategoryProvidedQty === 0) ||
              (key === "Ecategoryinfo" && totalEcategoryProvidedQty === 0)
            }
            >
              Assign
            </Button>
          </div>
        </form>
      </div>
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
  );
};

export default AssignBom;
