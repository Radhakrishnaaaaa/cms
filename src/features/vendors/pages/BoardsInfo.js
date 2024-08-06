import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSendboarddata, selectCategoryInfoData, selectGetSendboards, selectLoadingStatus } from "../slice/VendorSlice";
import { Spinner } from 'react-bootstrap';
import { formFieldsVendor, sendBoardsText, tableContent, ordersTable } from '../../../utils/TableContent';
import { useLocation } from "react-router-dom";

const BoardsInfo = ({ outward_id }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingStatus);
    const getData = useSelector(selectGetSendboards);
    const finalBoarddata = getData?.body;
    const [activeKey, setActiveKey] = useState(null);
    const isError = getData?.statusCode === 404;
    const data = useSelector(selectCategoryInfoData);
    const categoryinfoData = data?.body;

    useEffect(() => {
        const request = {
            "outward_id": outward_id,
        };
        dispatch(getSendboarddata(request));
    }, [dispatch, outward_id]);

    useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            const firstTabKey = Object.keys(finalBoarddata.sorteddata)[0];
            setActiveKey(firstTabKey);
        }
    }, [finalBoarddata]);

    useEffect(() => {
        if (categoryinfoData && categoryinfoData.sorteddata) {
            const firstTabKey = Object.keys(categoryinfoData.sorteddata)[0];
            setActiveKey(firstTabKey);
        }
    }, [categoryinfoData]);

    const handleTabSelect = (key) => {
        setActiveKey(key);
    };

    const renderTabContent = (kitKey) => {
        if (!finalBoarddata?.sorteddata) {
            return <p>No content available for this kit</p>;
        }
        const kitData = finalBoarddata.sorteddata[kitKey];
        if (Array.isArray(kitData) && kitData.length === 0) {
            return <p>No data available for {kitKey}</p>;
        }
        console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
        const filteredKitData = Object.keys(kitData).reduce((acc, key) => {
            if (key !== "status") {
                acc[key] = kitData[key];
            }
            return acc;
        }, {});
    
        if (Object.keys(filteredKitData).length === 0) {
            return <p>No data available for {kitKey}</p>;
        }
        const headers = ["S.No", "SVIC PCBA", "ALS PCBA", "Display Number", "SOM ID/IMEI ID", "E SIM No", "E SIM ID"];
            return (
                <div className="table-responsive mt-4" id="tableData">
                <Table className="bg-header table-lasttr">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(filteredKitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                            .map((partKey, index) => {
                                const part = filteredKitData[partKey];
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{part?.svic_pcba}</td>
                                        <td>{part?.als_pcba}</td>
                                        <td>{part?.display_number}</td>
                                        <td>{part?.som_id_imei_id}</td>
                                        <td>{part?.e_sim_no}</td>
                                        <td>{part?.e_sim_id}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>
        );
    };

    const convertToCamelCase = (str) => {
        let camelCaseStr = str.replace(/[_\s]([a-z])/ig, (match, group) => group.toUpperCase());
        camelCaseStr = camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1); 
        return camelCaseStr;
      }

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
                                ) : (
                                    <>
                                        {"BOXBUILDING" && typeof finalBoarddata === "object" && finalBoarddata?.sorteddata ? (
                                            <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                                {Object.keys(finalBoarddata.sorteddata)
                                                    .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                    .map((kitKey, index) => (
                                                        // <Tab eventKey={kitKey} title={kitKey} key={index}>
                                                        //     {renderTabContent(kitKey)}
                                                        // </Tab>
                                                        <Tab eventKey={kitKey} title={convertToCamelCase(kitKey)} key={index}>
                {renderTabContent(kitKey)}
            </Tab>
                                                    ))}
                                            </Tabs>
                                        ) : "EMS" && finalBoarddata && finalBoarddata.sorteddata ? (
                                            <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                                {Object.keys(finalBoarddata.sorteddata).map((kitKey) => (
                                                    <Tab key={kitKey} eventKey={kitKey} title={kitKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}>
                                                        <div className="table-responsive">
                                                            <Table className="bg-header">
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
                                                                    {Object.keys(finalBoarddata.sorteddata[kitKey]).map((boardKey, index) => (
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
                                    </>
                                )}

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

export default BoardsInfo;
