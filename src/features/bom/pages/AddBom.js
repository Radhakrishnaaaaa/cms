import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import InputGroup from "react-bootstrap/InputGroup";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import Delete from "../../../assets/Images/Delete.svg";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  selectSearchCategory,
  getSearchcategory,
  selectSearchcomponentdata,
  getSearchcomponentdata,
  selectLoadingState,
  addBOM,
} from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  textToast,
  tableBOM,
  formFieldsVendor,
  tableContent,
} from "../../../utils/TableContent";
import { envtypekey } from "../../../utils/common";

const AddBom = () => {
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [key, setKey] = useState("Mechanic");
  const [qty_per_board, setQty_per_board] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSearch = useSelector(selectSearchCategory);
  const getCategory = useSelector(selectSearchcomponentdata);
  const isLoading = useSelector(selectLoadingState);
  const searchContainerRef = useRef(null);
  const [form, setForm] = useState({
    bom_name: "",
    bom_description: "",
  });
  const data = getSearch?.body;
  console.log(getSearch);


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);

  const openDeleteModal = (rowIndex, department) => {
    setDeleteRowIndex(rowIndex);
    setDeleteDepartment(department);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteRowIndex(null);
    setDeleteDepartment(null);
  };

  const confirmDelete = () => {
    // Perform the delete action
    if (deleteRowIndex !== null && deleteDepartment !== null) {
      deleterow(deleteRowIndex, deleteDepartment);
    }
    handleCloseDeleteModal();
  }






  useEffect(() => {
    setQty_per_board(
      selectedData.map((product) => product.qty_per_board || "")
    );
  }, [selectedData]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const searchData = data.map((category) => {
        if (Array.isArray(category) && category.length > 0) {
          const filteredCategory = category.filter(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log(data, "dataaaaaa");

          console.log(filteredCategory, "filtereddddddddddd");
          return filteredCategory.map((item) => [category]);
        }
        return [];
      });
      console.log(searchData, "searchData");

      const flatFilteredData = searchData
        .flat()
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v[0] === value[0]) === index
        );

      setFilteredData(flatFilteredData);
    }
  }, [getSearch]);

  const handleItemClick = (item) => {
    console.log(item[0][0]);
    setSearchTerm(item[0]?.[0]);
    setSearchTermvalue(item[0]?.[1]);
    setIsAddButtonDisabled(false);
    setFilteredData([]);
  };
  const deleterow = (index, department) => {
    const updatedSelectedData = [...selectedData];
    const filteredData = updatedSelectedData.filter(
      (product, i) => i !== index || product.department !== department
    );
    setSelectedProducts(filteredData);
    // console.log(updatedSelectedData, "checkingggggg")
  };
  const addItem = async () => {
    setFilteredData([]);
    if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
      return;
    }
    const department = key === "Mechanic" ? "Mechanic" : "Electronic";

    const request = {
      category_type: key,
      component_id: searchTerm,
      department: department,
    };

    try {
      const response = await dispatch(getSearchcomponentdata(request));
      const newItem = response.payload?.body;
      if (newItem) {
        console.log(selectedData, "selectedddd dataaaaaa");
        console.log(newItem.cmpt_id, " new cmptd ID");
        if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
          setSelectedProducts([...selectedData, newItem]);
          setIsAddButtonDisabled(true);
        } else {
          toast.error("Item already added.");
        }
        setSearchTerm("");
        setSearchTermvalue("");
      } else {
        toast.error("Item not found.");
        setSearchTerm("");
        setSearchTermvalue("");
      }
    } catch (error) {
      toast.error("Error adding item.");
      setSearchTerm("");
      setSearchTermvalue("");
    }
  };

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    };
    setForm(nextFormState);
  };
  const handleClearForm = () => {
    setForm({
      bom_name: "",
      bom_description: "",
    });
    setSearchTerm("");
  };
  const onSubmitBom = async (e) => {
    e.preventDefault();

    const requestBody = {
      env_type: envtypekey,
      bom_name: form.bom_name,
      bom_description: form.bom_description,
      "M-Category_info": selectedData
        .filter((product) => product.department === "Mechanic")
        .map((product, index) => ({
          cmpt_id: product.cmpt_id,
          ctgr_id: product.ctgr_id,
          ctgr_name: product.ctgr_name,
          department: "Mechanic",
          description: product.description,
          vic_part_number: product.vic_part_number,
          ptg_prt_num: product.ptg_prt_num,
          technical_details: product.technical_details,
          prdt_name: product.prdt_name,
          qty_per_board: product.qty_per_board,
          material: product.material,
        })),
      "E-Category_info": selectedData
        .filter((product) => product.department === "Electronic")
        .map((product) => ({
          cmpt_id: product.cmpt_id,
          ctgr_id: product.ctgr_id,
          ctgr_name: product.ctgr_name,
          department: "Electronic",
          description: product.description,
          mfr_prt_num: product.mfr_prt_num,
          ptg_prt_num: product.ptg_prt_num,
          mounting_type: product.mounting_type,
          sub_ctgr: product.sub_ctgr,
          sub_category: product.sub_category,
          qty_per_board: product.qty_per_board,
          manufacturer: product.manufacturer,
        })),
    };
    const response = await dispatch(addBOM(requestBody));
    if (response.payload?.statusCode === 200) {
      handleClearForm();
      setSelectedProducts([]);
    }
  };

  useEffect(() => {
    setSelectedProducts([]);
  }, []);

  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const handleQtyPerBoardChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseInt(newValue, 10) !== 0 &&
        parseInt(newValue, 10) >= 1)
    ) {
      setErrorDisplayed(false);

      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          qty_per_board: newValue === "" ? "" : String(newValue, 10),
        };
        return updatedSelectedData;
      });
    } else {
      if (!errorDisplayed) {
        toast.error("Qty per board must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
    console.log(newValue, "quantityyyyyy");
  };

  const handleSearch2 = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setFilteredData([]);
      return;
    }
    const request = {
      category_name: searchTerm,
      component_type: key,
    };
    setFilteredData([]);
    dispatch(getSearchcategory(request));
  };
  const handleTabChange = (key) => {
    setKey(key);
    setSearchTerm("");
    setFilteredData([]);
    setSearchTermvalue("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setFilteredData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
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
            {tableBOM.addBomTitle}
          </h3>
        </div>
        <form onSubmit={onSubmitBom}>
          <div className="content-sec">
            <h5> {tableBOM.bomInfo}</h5>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label> {tableBOM.bomName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="bom_name"
                    value={form.bom_name.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    {" "}
                    {tableBOM.description}
                    {textToast.maxlength}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bom_description"
                    value={form.bom_description}
                    onChange={onUpdateField}
                    required={true}
                    maxLength={500}
                  />
                </Form.Group>
              </Col>
            </Row>
            <>
              <div>
                <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                  <div className="position-relative" ref={searchContainerRef}>
                    <InputGroup className="mb-0 search-add search-add-align">
                      <Form.Control
                        placeholder="Search components"
                        aria-label="Search components"
                        aria-describedby="basic-addon2"
                        type="search"
                        value={searchTermvalue.trimStart()}
                        onChange={handleSearch2}
                      />
                      <Button
                        variant="secondary"
                        id="button-addon2"
                        disabled={!searchTerm.trim() || isAddButtonDisabled}
                        onClick={addItem}
                      >
                        + Add
                      </Button>
                    </InputGroup>
                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length==0?true:false}>
                      {filteredData &&
                        filteredData?.map((item, index) => (
                          <li key={index} onClick={() => handleItemClick(item)}>
                            {/* {item[0].join(" , ")} */}
                            {/* {item[0]?.[1]} */}
                            {item[0].slice(1).join(" , ")}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={handleTabChange}
                >
                  <Tab eventKey="Mechanic" title="M-Category Info">
                    {key === "Mechanic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th> {tableBOM.vicNo}</th>
                                <th> {tableBOM.prodName}</th>
                                <th> {tableBOM.category}</th>
                                <th> {tableBOM.technicalDetails}</th>
                                <th> {tableBOM.description}</th>
                                <th> {tableBOM.qtyPerBoard}</th>
                                <th> {tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (
                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Mechanic" && (
                                      <>
                                        <td>{product?.vic_part_number}</td>
                                        <td>{product?.prdt_name}</td>
                                        <td>{product?.ctgr_name}</td>
                                        <td>{product?.technical_details}</td>
                                        <td>{product?.description}</td>
                                        <td>
                                          {" "}
                                          <input
                                            type="text"
                                            className="input-50"
                                            value={product.qty_per_board}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                            }}
                                            onChange={(e) =>
                                              handleQtyPerBoardChange(
                                                e.target.value,
                                                rowIndex
                                              )
                                            }
                                            required
                                          />
                                        </td>
                                        {/* <td
                                          onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }
                                        >
                                          <img src={Delete} />
                                        </td> */}
                                        <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                                          <img src={Delete} alt="Delete Icon" />
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                  <Tab eventKey="Electronic" title="E- Category Info">
                    {key == "Electronic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th> {tableBOM.mfrPartNo}</th>
                                <th> {tableBOM.subCategory}</th>
                                <th> {tableBOM.deviceCat}</th>
                                <th> {tableBOM.qtyPerBoard}</th>
                                <th> {tableBOM.mountingType}</th>
                                <th> {tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (
                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Electronic" && (
                                      <>
                                        <td>{product?.mfr_prt_num}</td>
                                        <td>{product?.sub_category}</td>
                                        <td>{product?.ctgr_name}</td>
                                        <td>
                                          <input
                                            type="text"
                                            className="input-50"
                                            value={product.qty_per_board}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                            }}
                                            onChange={(e) =>
                                              handleQtyPerBoardChange(
                                                e.target.value,
                                                rowIndex
                                              )
                                            }
                                            required
                                          />
                                        </td>
                                        <td>{product?.mounting_type}</td>
                                        {/* <td
                                          onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }
                                        >
                                          <img src={Delete} />
                                        </td> */}
                                        <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                                          <img src={Delete} alt="Delete Icon" />
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                </Tabs>
              </div>
            </>
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
            <Button type="submit" className="submit">
              {formFieldsVendor.btnCreate}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden"> {formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}

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

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Body>
          Are you sure you want to delete the selected item?
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <div className="mt-3 d-flex justify-content-center">
            <Button
              type="button"
              className="cancel me-2"
              onClick={handleCloseDeleteModal} >
              No
            </Button>
            <Button type="submit" className="submit" onClick={confirmDelete}>
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddBom;
