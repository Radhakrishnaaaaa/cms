import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getBomDetails, selectBomDetails, selectAllOutwardList, getallOutwardList, selectPriceBomDatabyID } from '../slice/BomSlice';
import { tableBOM, tableContent, textToast } from '../../../utils/TableContent';
import { type } from '@testing-library/user-event/dist/type';


const OriginalpartnoDetails = ({ props, id, onBomDetailsData, onDescription }) => {
    const [key, setKey] = useState('Mcategoryinfo');
    const categoryInfoData = props.bom_name;
    const categoryObjectkeys = props.bom_id;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bomdata = useSelector(selectBomDetails);
    // const bomdetailsdata = bomdata?.body?.parts;
    const outwardData = useSelector(selectAllOutwardList);
    console.log(outwardData, "all outward list data")
    const outwardDataList = outwardData?.body
    const [bomdetailsdata, setBomdetailsdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const XLSX = require('xlsx');
    const estimatematerial = () => {
        navigate('/estimatematerial', { state: { bomdata, dep_type: key } })
    }

    useEffect(() => {
        if (bomdata?.body?.parts) {
            setBomdetailsdata([...bomdata?.body?.parts])
        } else {
            // Handle the case where parts is null or undefined
            setBomdetailsdata([]);
        }
        setIsLoading(false);

    }, [bomdata])

    useEffect(() => {
        // Pass bomdetailsdata to the parent component
        if (bomdetailsdata) {
            onDescription(bomdata?.body?.description);
            onBomDetailsData(bomdetailsdata);
        }
    }, [bomdetailsdata, onBomDetailsData, onDescription]);
    useEffect(() => {
        const request = {
            "bom_name": categoryInfoData,
            "bom_id": categoryObjectkeys,
            "dep_type": key === "Mcategoryinfo" ? "Mechanic" : "Electronic",
        }
        setBomdetailsdata([])
        dispatch(getBomDetails(request));
        setIsLoading(true);
    }, [dispatch, categoryInfoData, categoryObjectkeys, key])

    useEffect(() => {
        const requestBody = {
            "bom_id": categoryObjectkeys
        }
        dispatch(getallOutwardList(requestBody))
    }, [key])
    if (!bomdetailsdata) {
        return null;
    }
    const handleTableRowClick = (outwardId, type) => {
        let path = `/outwardinnerdetails`;
        const outward_id_info = outwardId;
        navigate(path, { state: { outward_id_info: outward_id_info, dep_type: type } });
    };

    const generateExcelData = (item) => {
        if (key === 'Mcategoryinfo') {
            return {
                VIC_Part_No: item?.vic_part_number,
                Part_Name: item?.part_name,
                Material: item?.material,
                Technical_Details: item?.technical_details.replace(/\n/g, '""'),
                Description: item?.description.replace(/"/g, '""'),
                Qty_Per_Board: item?.required_quantity,
            };
        } else if (key === 'Ecategoryinfo') {
            return {
                Manufacturer_Part_No: item?.mfr_part_number,
                Part_Name: item?.part_name,
                Manufacturer: item?.manufacturer,
                Device_Category: item?.device_category,
                Mounting_Type: item?.mounting_type,
                Qty_Per_Board: item?.required_quantity,
            };
        }
    };
    const handleDownloadXL = () => {
        const excelData = bomdetailsdata.map(item => generateExcelData(item));
        downloadXL(excelData, key === 'Mcategoryinfo' ? 'M_Category_Info' : 'E_Category_Info');
    };

    const downloadXL = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data, { raw: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    // const convertToCSV = (data) => {
    //     const header = Object.keys(data[0]).join(',');
    //     const rows = data.map((item) => Object.values(item).join(','));
    //     return `${header}\n${rows.join('\n')}`;
    // };


    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative w-100 border-bottom d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <div className='partno-sec'>
                            <div className='tab-sec'>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                >
                                    <Tab eventKey="Mcategoryinfo" title="M - Category Info">
                                        <div className='table-responsive mt-4'>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>{tableBOM.vicNo}</th>
                                                        <th>{tableContent.partName}</th>
                                                        <th>{tableBOM.material}</th>
                                                        <th>{tableBOM.technicalDetails}</th>
                                                        <th>{tableBOM.description}</th>
                                                        <th>{tableBOM.qtyPerBoard}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">Loading...</td>
                                                        </tr>
                                                    ) : (Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                                                        bomdetailsdata.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item?.vic_part_number}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.material}</td>
                                                                <td>{item?.technical_details}</td>
                                                                <td>{item?.description}</td>
                                                                <td>{item?.required_quantity}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="Ecategoryinfo" title="E - Category Info">
                                        <div className='table-responsive mt-4' id={id}>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>{tableBOM.mfPrtno}</th>
                                                        <th>{tableContent.partName}</th>
                                                        <th>{tableBOM.Mftr}</th>
                                                        <th>{tableBOM.deviceCat}</th>
                                                        <th>{tableBOM.mountingType}</th>
                                                        <th>{tableBOM.qtyPerBoard}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">Loading...</td>
                                                        </tr>
                                                    ) : (Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                                                        bomdetailsdata.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item?.mfr_part_number}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.manufacturer}</td>
                                                                <td>{item?.device_category}</td>
                                                                <td>{item?.mounting_type}</td>
                                                                <td>{item?.required_quantity}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="Description" title="Description">
                                        <p className='mt-4'>{bomdata?.body?.description}</p>
                                    </Tab>
                                    <Tab eventKey="Outwardinfo" title="Outward Info">
                                        <div className='table-responsive mt-4'>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>{tableBOM.outwardId}</th>
                                                        <th>{tableBOM.partnerId}</th>
                                                        <th>{tableBOM.outwardDate}</th>
                                                        <th>{tableBOM.boardsQty}</th>
                                                        <th>{tableBOM.mtrlpercentage}</th>
                                                        <th>{tableBOM.partnerType}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(outwardDataList) && outwardDataList.length > 0 ? (
                                                        outwardDataList.map((item, index) => (
                                                            <tr key={index}>
                                                                <td><a onClick={(e) => handleTableRowClick(item?.outward_id, item?.type)} className="text-black linkformodal">{item?.outward_id}</a></td>
                                                                <td>{item?.partner_id}</td>
                                                                <td>{item?.outward_date}</td>
                                                                <td>{item?.boards_qty}</td>
                                                                <td>{item?.mtrl_prcnt}%</td>
                                                                <td>{item?.type}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    <div className='mobilemargin-top'>
                        <Button className="submit mb-1 submit-block"
                            onClick={handleDownloadXL}
                            disabled={bomdetailsdata.length === 0 || key === 'Description' || key === 'Outwardinfo'}>
                            Download Details
                        </Button>
                        &nbsp;
                        <Button
                            className="submit mb-1 submit-block"
                            onClick={estimatematerial}
                            disabled={key === 'Description' || key === 'Outwardinfo'}
                        >
                            {tableBOM.estMaterials}
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default OriginalpartnoDetails;