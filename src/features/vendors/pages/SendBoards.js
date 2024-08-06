import React from 'react';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dndarw from '../../../assets/Images/download-up-arw.svg';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Papa from 'papaparse';
import excel from '../../../assets/Images/excel.svg'
import Table from "react-bootstrap/Table";
import { selectLoadingStatus, sendBoards, sendFinalProducts } from '../slice/VendorSlice';
import { Spinner } from 'react-bootstrap';
import { formFieldsVendor, sendBoardsText, tableContent, tableBOM, buttonTexts } from '../../../utils/TableContent';

const SendBoards = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    // const outward_id = location?.state;
    // console.log(outward_id);
    const isLoading = useSelector(selectLoadingStatus);
    const { outward_id, bom_id, partner_id, qty, tab, categoryinfoData, against_po } = location.state;
    console.log(bom_id);
    console.log(outward_id);
    console.log(partner_id);
    console.log(against_po, "against po");

    const [eCategoryData, setECategoryData] = useState([]);
    const [selectedVendorsMCategory, setSelectedVendorsMCategory] = useState([]);
    const [selectedVendorsECategory, setSelectedVendorsECategory] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [finalBoarddata, setFinalBoardData] = useState([]);
    console.log(tab);
    const [form, setForm] = useState({
        "bom_id": "",
        "order_id": "",
        "quantity": "",
        "delivery_date": "",
        "against_po": "",
    });
    const handleBackNavigation = () => {
        navigate(-1);
    };

    //download csv
    const exportExcel = () => {
        if (tab === "boards") {
            var headers = [
                "Sno,SVIC_PCBA,ALS_PCBA,Display_Number,SOM_ID_IMEI_ID,E_SIM_NO,E_SIM_ID",
            ];

        }
        else {
            var headers = [
                "sno,unit_no,svic_pcba,alis_pcba,display_num,som_id,E_sim_no,E_sim_id",
            ];
        }
        const fileName = tab === "boards" ? "SendBoards.csv" : "SendFinalProducts.csv";
        downloadFile({
            data: [...headers].join("\n"),
            fileName: fileName,
            fileType: "text/csv",
        });
    };
    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType });
        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
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
    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const nextFormState = {
            ...form,
            [name]: value.trimStart()
        }
        setForm(nextFormState);
    };


    const handleFileUpload = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files])
        const file = e.target.files[0];
        if (!file) {
            // File is null (upload cancelled), so do nothing
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                if (tab === "productioninfo") {
                    parseCSV(text);
                }
                else {
                    parseMCategoryCSV(text);
                }
            };
            reader.readAsText(file);
            setSelectedVendorsMCategory([]);
            setSelectedVendorsECategory([]);
        }

    };

    // const parseMCategoryCSV = (csvText) => {
    //     Papa.parse(csvText, {
    //         header: true,
    //         skipEmptyLines: true,
    //         complete: (result) => {
    //             setECategoryData(result.data);
    //             console.log(result.data, "result.data");
    //         },
    //         error: (error) => {
    //             console.error('CSV parsing error:', error.message);
    //         },
    //     });
    // };

    const parseMCategoryCSV = (csvText) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const parsedData = result.data;
    
                // Check for empty cells
                const emptyCells = [];
                parsedData.forEach((row, rowIndex) => {
                    Object.entries(row).forEach(([key, value]) => {
                        if (value === undefined || value === '') {
                            emptyCells.push({
                                row: rowIndex + 1, // Adding 1 to make it 1-based index
                                column: key,
                            });
                        }
                    });
                });
    
                if (emptyCells.length > 0) {
                    console.error('CSV contains empty cells:', emptyCells);
                    toast.warning(`CSV contains empty cells: ${emptyCells[0].column}`);
                    setECategoryData([]); // Clear data if there are empty cells
                    return;
                }
    
                setECategoryData(parsedData);
                console.log(parsedData, "result.data");
            },
            error: (error) => {
                console.error('CSV parsing error:', error.message);
                toast.error(`CSV parsing error: ${error.message}`);
            },
        });
    };
    

    const parseCSV = (csvText) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                const parsedData = result.data;
                await setFinalBoardData(parsedData);
                // Check for empty columns or cells
                const emptyCells = [];
                parsedData.forEach((row, rowIndex) => {
                    Object.entries(row).forEach(([key, value]) => {
                        if (value === undefined || value === '') {
                            emptyCells.push({
                                row: rowIndex + 1, // Adding 1 to make it 1-based index
                                column: key,
                            });
                        }
                    });
                });

                if (emptyCells.length > 0) {
                    console.error('CSV contains empty cells:', emptyCells);
                    toast.warning(`CSV contains empty cells: ${emptyCells[0].column}`);
                    return;
                }



            },
            error: (error) => {
                console.error('CSV parsing error:', error.message);
            },
        });
    };
    const removeattachment = () => {
        // const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles([]);
        setECategoryData([]);
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.value = null;
        }
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        // setIsButtonDisabled(true); 
        if (selectedFiles.length === 0) {
            // Show an error message or handle the lack of file
            toast.error("Please upload a CSV file.");
            return;
        }
        if (tab === "productioninfo") {
            const Productionform = {
                "bom_id": categoryinfoData?.bom_id,
                "OrderId": categoryinfoData?.outward_id,
                "Order_date": categoryinfoData?.order_date,
                "qty": categoryinfoData?.qty,
                "outward_id": categoryinfoData?.outward_id,
                "delivery_end_date": selectedDate.toISOString().split('T')[0],
                "against_po": against_po,
                "sender_name": categoryinfoData?.sender_name,
                "sender_contact": categoryinfoData?.contact_details,
                "receiver_name": categoryinfoData?.receiver_name,
                "receiver_contact": categoryinfoData?.receiver_contact_num,
                "material_percentage": categoryinfoData?.mtrl_prcnt,
            };

            const request = {
                ...Productionform,
                kits: finalBoarddata,
            };

           const response = await dispatch(sendFinalProducts(request));
           if (response.payload?.statusCode === 200){
            setTimeout(() => {
                navigate(-1);
            }, 2000)
        }
    }
        else {
            const formData = {
                "bom_id": bom_id,
                "outward_id": outward_id,
                "partner_id": partner_id,
                "quantity": qty,
                "delivery_end_date": selectedDate.toISOString().split('T')[0],
                "against_po": against_po,
            };
            const board_information =
                Array.isArray(eCategoryData) && eCategoryData.length > 0
                    ? eCategoryData.map((item) => ({
                        Sno: item.Sno,
                        SVIC_PCBA: item.SVIC_PCBA,
                        ALS_PCBA: item.ALS_PCBA,
                        Display_Number: item.Display_Number,
                        SOM_ID_IMEI_ID: item.SOM_ID_IMEI_ID,
                        E_SIM_NO: item.E_SIM_NO,
                        E_SIM_ID: item.E_SIM_ID

                    }))
                    : [];

            const requestBody = {
                ...formData,
                board_information

            };
            console.log(requestBody, "requestBody");
            const response = await dispatch(sendBoards(requestBody));
            if (response.payload?.statusCode === 200) {
                setIsButtonDisabled(true);
                setTimeout(() => {
                    navigate(-1)
                    // alert("om")
                }, 2000);
            }

            if (response.payload?.statusCode === 400) {
                setIsButtonDisabled(false);
            }

        }
    }



    return (
        <>
            <div className="wrap">
                <div className="d-flex  mt-3 justify-content-between">
                    <h1 className="title-tag"><img
                        src={arw}
                        alt=""
                        className="me-3 "
                        onClick={handleBackNavigation}
                    />{tab === "productioninfo" ? "Send Final Products" : "Send Boards"}</h1>
                    <Button
                        className="submit me-2 md-me-2 submitmobile"
                        onClick={exportExcel}
                    >
                        {sendBoardsText?.downloadCsvFormat}
                    </Button>
                </div>
                <form onSubmit={onFormSubmit}>
                    <div className="content-sec">
                        <h3 className='inner-tag'> {sendBoardsText?.details} </h3>
                        <Row>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{formFieldsVendor?.orderId} </Form.Label>
                                    <Form.Control type="text" placeholder="" value={outward_id} name="order_id" disabled />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label> {tableContent?.qty}</Form.Label>
                                    <Form.Control type="text" placeholder="" name="quantity" value={qty} onChange={onUpdateField} required={true} disabled={true} />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{tableBOM?.againstPO}</Form.Label>
                                    <Form.Control type="text" placeholder="" name="against_po" value={against_po} onChange={onUpdateField} required={true} disabled={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{sendBoardsText?.deliveryEndDate}</Form.Label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        name="delivery_date"
                                        className="form-control"
                                        onFocus={(e) => e.target.readOnly = true}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <div className="upload-btn-wrapper position-relative">
                                        <button className="btn">
                                            <img src={dndarw} alt="" className="dounload-img mb-2" />
                                            <span className='uploadtext'>{sendBoardsText?.csvFile}</span>
                                            <input
                                                type="file"
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                onChange={handleFileUpload}
                                                id="fileInput"
                                            />
                                        </button>

                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="excel-uploadsec">
                                                <div className='attachment-sec w-100'>
                                                    <span className="attachment-name"><img src={excel} alt="" className="dounload-img" /> {file.name}</span>
                                                    <span className="attachment-icon" onClick={removeattachment}> x </span>
                                                </div>
                                            </div>
                                        ))}

                                    </div>

                                </Form.Group>
                            </Col>
                        </Row>
                    </div>


                    {eCategoryData.length > 0 && (
                        <div className="preview-table">
                            <h1 className="inner-tag">{sendBoardsText?.preview}</h1>
                            <div className='table-responsive privew-align'>
                                <Table className='bg-header'>
                                    <thead>
                                        <tr>
                                            {Object.keys(eCategoryData[0]).map((header, index) => (
                                                <th key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eCategoryData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {Object.values(row).map((value, columnIndex) => (
                                                    <td key={columnIndex}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button type="button" className="cancel me-2" onClick={() => {
                            navigate(-1);
                        }}>
                            {buttonTexts?.cancel}
                        </Button>
                        <Button type="submit" className="submit" disabled={isButtonDisabled}>
                            {buttonTexts?.send}
                        </Button>
                    </div>

                </form>
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
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Zoom}

            />

        </>
    );
};

export default SendBoards;
