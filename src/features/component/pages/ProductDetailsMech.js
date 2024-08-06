import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import arw from '../../../assets/Images/left-arw.svg';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../styles/ProductDetails.css";
import undo from '../../../assets/Images/undo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, selectProductDetails, selectLoadingState, getTop5Vendors, selectTop5vendorDetails, rackDetails,selectRackDetails} from '../slice/ComponentSlice';
import PdfDownload from '../../../components/PdfDownload';
import { Spinner } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ComponentVendorDetails from './ComponentVendorDetails';
import noimagefound from  "../../../assets/Images/noimagefound.jpg";
import { FaStar } from "react-icons/fa";
import pdf from '../../../assets/Images/pdf.svg';
const ProductDetailsMech = () => {
    const [key, setKey] = useState('productdetails');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isLoading = useSelector(selectLoadingState);
  
    const { details, componentName } = location.state;
    const getproduct = useSelector(selectProductDetails);
    const productatrr = getproduct?.body?.product_attributes;
    const pdfUrl = getproduct?.body?.data_sheet;
    const subcategory = details?.sub_ctgr;
    const categoryname = details?.ctgr_name;
    const cmpt_id = details?.cmpt_id;
    const ctgr_id = details?.ctgr_id
    const comp_id =location.state?.cmpt_id;
    console.log(ctgr_id, categoryname)
   
    const rackData = useSelector(selectRackDetails);
    const racklist = rackData?.body;
    console.log(racklist,"lllllllllll")
    const excludedKeys = ["fail_qty", "rcd_qty", "out_going_qty", "rtn_qty"];

    const renderedAttributes = productatrr && Object.entries(productatrr).map(([key, value]) => (
      !excludedKeys.includes(key) && (
        <ul key={key}>
          <li>{(key).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</li>
          <li>{value}</li>
        </ul>
      )
    ));


    const redirectoCreatePO = () =>{
        navigate("/createpo", {
            state:{ 
              component: "singlecomponent",
              purchaselist: getproduct?.body
            }
        })
    }

    const [showFullCategoryName, setShowFullCategoryName] = useState(false);
    const handleMouseEnter = () => {
        setShowFullCategoryName(true);
    };

    const handleMouseLeave = () => {
        setShowFullCategoryName(false);
    };

   
    useEffect(() => {
        const request = {
            department: "Mechanic",
            "ctgr_name": componentName,
            "cmpt_id": details?.cmpt_id ||comp_id
        }
        dispatch(fetchProductDetails(request));
       
    }, [])


    useEffect(() => {
        const request = {
            "department": "Mechanic",
            "cmpt_id" : details?.cmpt_id || comp_id    
           
        }
        dispatch(rackDetails(request));

    }, [])

    const routeedit = (item) => {
        let path = `/editMechanicComponent`;
        navigate(path, {
          state: {
            productDetailsMechProp1: cmpt_id || comp_id,
            productDetailsMechPprop2: categoryname,
            productMechInnerDetails : "productDetailsMechanical"
          },
        });
      };
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
                <div className='d-flex position-relative d-flex-mobile-align'>
                    <h1 className='title-tag tageclipse' title={getproduct?.body?.ctgr_name}><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} />M - {getproduct?.body?.ctgr_name} </h1>
                  <div className='tab-sec'>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="productdetails" title="Product Details">
                                <div className='productdetails-sec mt-2'>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            <div className='product-img'>
                                            {getproduct?.body?.prt_img ? (
                                                     <img src={getproduct.body.prt_img} alt='' />
                                                ) : (
                                                       <img src={noimagefound} alt='No Image Found' />
                                            )}
                                            </div>
                                        </Col>

                                        <Col xs={12} md={4}>
                                            <div className='w-100 product-details list-align'>
                                                <div className='d-flex justify-content-end mb-3'>
                                                    <Button variant="outline-dark" className='editbtn' onClick={() => routeedit()}>Edit details</Button>
                                                </div>
                                                <ul>
                                                    <li>PTG Part Number</li>
                                                    <li>
                                                        {getproduct?.body?.ptg_prt_num}
                                                    </li>
                                                    <li>Part Name</li>
                                                    <li>
                                                        {getproduct?.body?.prdt_name}
                                                    </li>
                                                    <li>Part Number</li>
                                                    <li>
                                                        {getproduct?.body?.mfr_prt_num}
                                                    </li>                                                  
                                                    <li>Material</li>
                                                    <li>{getproduct?.body?.material}</li>                                                    
                                                    <li>Datasheet</li>
                                                    <li>{pdfUrl !== "" ? <PdfDownload pdfUrl={pdfUrl} /> : "-"}</li> 
                                                    {/* <li>{pdfUrl !== "" ?  <button  className='pdf-btn' onClick={() => openPDFInNewTab(`data:application/pdf;base64,${pdfUrl}`)}>
                                                                    <img src={pdf} alt="" /> Datasheet
                                                    </button> : "-"}</li> */}
                                                </ul>
                                            </div>
                                        </Col>

                                        <Col xs={12} md={4}>
                                            <div className='product-qty'>
                                                <div className='d-flex justify-content-between align-items-start mb-3'>
                                                    <h3 className='qty-tag'>QTY.</h3>
                                                    {/* <div className='d-flex justify-content-between align-items-center'>
                                                        <a><img src={bom} alt='' className='me-2' /></a>
                                                        <a><img src={checklist} alt='' className='me-2' /></a>
                                                        <a><img src={change} alt='' /></a>
                                                    </div> */}
                                                </div>

                                                <h2 className='amount-tag'>{getproduct?.body?.qty}</h2>
                                                <h3 className='qty-tag'>Inventory place</h3>
                                                {racklist && racklist.inventory_position && racklist.inventory_position.length > 0 && (
    <ul className='listrack'>
        {racklist.inventory_position.map((position, index) => (
            <li key={index}>{position?.inventory_position || "-"}{index+1!=racklist?.inventory_position?.length&&<span>,</span>}</li>
        ))}
    </ul>
)}
                                                {/* <h4 className='rack-tag'>{rackData?.body?.inventory_position || "-"}</h4> */}
                                                <div className='mt-3'>
                                                    {/* <Button className='c-btn me-3'>Utilize part</Button> */}
                                                    <Button className='c-btn'  onClick={redirectoCreatePO} >Create order</Button>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-start mt-4 mb-3'>
                                                    <h3 className='qty-tag'>Return storage QTY.</h3>
                                                    {/* <a><img src={undo} alt='' /></a> */}
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center mb-1'>
                                                    <div className='d-flex'>
                                                        <h2 className='amount-tag'>{rackData?.body?.rtn_qty || "-"}</h2>
                                                        <h4 className='rack-tag ms-2'>(Stored)</h4>
                                                    </div>
                                                    {/* <div className='d-flex'>
                                                        <h2 className='amount-tag'>4</h2>
                                                        <h4 className='rack-tag ms-2'>(Analysis)</h4>
                                                    </div> */}
                                                </div>
                                                {/* <h3 className='qty-tag'>Inventory place</h3>
                                                <h4 className='rack-tag'>Rack 4</h4> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className='productdetails-sec mt-4'>
                                  
                                    <Row>
                                        <Col xs={12} md={8}>
                                            <div className='product-details margin-top-align'>
                                            <ul className='my-3'>
                                                <li>Mold Required</li>
                                                                <li>{getproduct?.body?.mold_required === "req" ? "Required" : "Not-Required"}</li>
                                                                <li>Techanical Details</li>
                                                                <li>{getproduct?.body?.technical_details}</li>      
                                                                <li>Description</li>
                                                                <li>{getproduct?.body?.description}</li>
                                                </ul>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h3 className='attr-tag'>Product Attributes</h3>
                                                </div>
                                                <ul>
                                                    <li><b>Type</b></li>
                                                    <li>
                                                        <b>Description</b>
                                                    </li>
                                                </ul>

                                                {!isLoading ? renderedAttributes
                                                    : (
                                                        <div className="spinner-backdrop">
                                                            <Spinner animation="grow" role="status" variant="light" lo />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </Col>

                                        

                                    </Row>
                                </div>


                                <h1 className='title-tag mt-3'>Version Details</h1>

                                <div className='table-responsive mt-4'>
                                    <Table className='cp-table'>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Action</th>
                                                <th>Description</th>
                                                <th>Batch No</th>
                                                <th>Issued to</th>
                                                <th>Quantity</th>
                                                <th>Closing Quantity</th>
                                                <th>PO No.</th>
                                                <th>Invoice No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>01-01-01</td>
                                                <td>PTG1AB789</td>
                                                <td>1AB789</td>
                                                <td>1AB789</td>
                                                <td>Agenew</td>
                                                <td>20</td>
                                                <td>20</td>
                                                <td>999</td>
                                                <td>999</td>
                                            </tr>
                                         
                                         
                                        </tbody>
                                    </Table>

                                </div>
                            </Tab>
                            <Tab eventKey="vendordetails" title="Vendor Details">  
                            {key == "vendordetails" ? (<ComponentVendorDetails cmpt_id={cmpt_id || comp_id}/>) : (null)}
                                                   
                                
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsMech;
