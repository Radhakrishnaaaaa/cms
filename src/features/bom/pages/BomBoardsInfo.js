import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSendboarddata,selectGetSendboards,selectLoadingStatus } from "../../vendors/slice/VendorSlice";
import { Spinner } from 'react-bootstrap';
import { formFieldsVendor, sendBoardsText,tableContent,ordersTable} from '../../../utils/TableContent';

const BomBoardsInfo = ({ outward_id ,setDisable}) => {

    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingStatus);
    const getData = useSelector(selectGetSendboards);
    const finalBoarddata = getData?.body;
    const [activeKey, setActiveKey] = useState(null);
    const isError = getData?.statusCode === 404;

    useEffect(() => {
        const request = {
            "outward_id": outward_id,
        };
        dispatch(getSendboarddata(request));
    }, [dispatch, outward_id]);

    useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            setDisable(false)
            const firstTabKey = Object.keys(finalBoarddata.sorteddata)[0];
            setActiveKey(firstTabKey);
        }
        
    }, [finalBoarddata]);
     // Check status and setDisable accordingly
     useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            Object.values(finalBoarddata.sorteddata).forEach((kit) => {
                if (kit.status === "Assigned") {
                    setDisable(true);
                }
            });
        }
    }, [finalBoarddata]);

    const handleTabSelect = (key) => {
        setActiveKey(key);
    };
      // Filter out empty rows
const filteredData = (kitKey) => {
    const kitData = finalBoarddata.sorteddata[kitKey];
    if (!kitData || !Object.keys(kitData).length) return []; // Return empty array if kitData is empty or undefined
    const boardKeys = Object.keys(kitData).filter(key => key !== 'status'); // Exclude 'status' field
    return boardKeys.filter(boardKey => {
        const board = kitData[boardKey];
        return Object.keys(board).every(field => board[field] !== ""); // Check if all fields are non-empty
    });
};
    return (
        <>
            <div className="wrap">
                <div className="mt-5 w-100">
                    <div className="w-100">
                        <div className="partno-sec vendorpartno-sec w-100">
                            <h1 className="title-tag mb-4">{sendBoardsText?.bInfo}</h1>
                            <div className="tab-sec-sendkit">
                                {isError ? (
                                    <div className="coming-sec">
                                        <h4 className="mt-5">{tableContent?.nodata}</h4>
                                    </div>
                                ) : finalBoarddata && finalBoarddata.sorteddata ? (
                                    <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                        {Object.keys(finalBoarddata.sorteddata).map((kitKey) => (
                                            <Tab key={kitKey} eventKey={kitKey} title={kitKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}>
                                                <div className="table-responsive">
                                                    <Table className="bg-header table-lasttr">
                                                        <thead>
                                                            <tr>
                                                                <th>{ordersTable?.Sno}</th>
                                                                <th>{sendBoardsText?.svicPcba}</th>
                                                                <th>{sendBoardsText?.somID}</th>
                                                                <th>{sendBoardsText?.eSimID}</th>
                                                                <th>{sendBoardsText?.alsPcba}</th>
                                                                <th>{sendBoardsText?.displayNo}</th>
                                                                <th>{sendBoardsText?.eSimNo}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {filteredData(kitKey).map((boardKey, index) => (
                                                            <tr key={boardKey}>
                                                                <td>{index + 1}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].svic_pcba}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].som_id_imei_id}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_id}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].als_pcba}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].display_number}</td>
                                                                <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_no}</td>
                                                            </tr>
                                                        ))}
                                                            
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}

        </>
    );
};

export default BomBoardsInfo;
