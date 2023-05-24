import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Table } from "react-bootstrap";
import apparelSizesService from "services/apparelSizesService";
import debug from "sabio-debug";
import ApparelListSingleItem from "./ApparelListSingleItem";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import formikValidation from "./formikValitdationApparelList";
import "./apparelList.css";
import toastr from "toastr";

function ApparelList() {
  const _logger = debug.extend("apparelList");
  const [apparelList, setApparelList] = useState({
    apparelList: [],
    components: [],
    statusTypes: [],
    current: 1,
    pageSize: 10,
    total: 0,
    clear: false,
  });

  const [apparelSearch, setApparelSearch] = useState({ input: "" });

  useEffect(() => {
    if (apparelSearch.isSearching) {
      apparelSizesService
        .getSearchList(
          apparelList.current,
          apparelList.pageSize,
          apparelSearch.input
        )
        .then(onSearchSuccess)
        .catch(onSearchError);
    } else {
      apparelSizesService
        .getApparalList(apparelList.current, apparelList.pageSize)
        .then(onGetListSuccess)
        .catch(onGetListError);
    }
  }, [apparelList.current, apparelList.clear]);

  const onGetListSuccess = (response) => {
    const data = response.item;
    _logger("onGetListSuccess", response);
    setApparelList((prevState) => {
      const setData = { ...prevState };
      setData.apparelList = data.pagedItems;
      setData.components = data.pagedItems.map(mapList);
      setData.pageSize = data.pageSize;
      setData.total = data.totalCount;
      setData.totalAfterClear = data.totalCount;
      return setData;
    });
  };
  const onGetListError = () => {
    toastr["error"]("Server Error.", "Please try again");
  };

  const onPageChange = (page) => {
    if (apparelSearch.isSearching && apparelList.current !== 1) {
      setApparelList((prevState) => {
        const setData = { ...prevState };
        setData.current = 1;
        return setData;
      });
    }
    setApparelList((prevState) => {
      const setData = { ...prevState };
      setData.current = page;
      return setData;
    });
  };
  function mapList(obj) {
    return <ApparelListSingleItem key={obj.id} apparel={obj} />;
  }

  const searchApperal = (values) => {
    setApparelSearch((prevState) => {
      const setData = { ...prevState };

      setData.input = values.input;
      return setData;
    });
    let currentPage = 0;
    if (apparelList.current !== 1) {
      currentPage = 1;
    } else {
      currentPage = apparelList.current;
    }

    apparelSizesService
      .getSearchList(currentPage, apparelList.pageSize, values.input)
      .then(onSearchSuccess)
      .catch(onSearchError);
  };

  const onSearchSuccess = (response) => {
    setApparelSearch((prevState) => {
      const setData = { ...prevState };
      setData.isSearching = true;
      return setData;
    });
    setApparelList((prevState) => {
      const data = response.item;
      const setData = { ...prevState };
      setData.components = data.pagedItems.map(mapList);
      setData.total = data.totalCount;

      return setData;
    });
  };
  const onSearchError = (err) => {
    if (err.response.status === 404) {
      toastr["error"]("Please try a different name.", "No Officials Found");
    } else {
      toastr["error"]("Server Error.", "Please try again");
    }
  };

  const clearSearch = () => {
    setApparelSearch((prevState) => {
      const setData = { ...prevState };
      setData.isSearching = false;
      return setData;
    });
    setApparelList((prevState) => {
      const setData = { ...prevState };
      setData.clear = !setData.clear;
      setData.current = 1;

      return setData;
    });
  };
  return (
    <React.Fragment>
      <div className="container">
        <div className="card">
          <Formik
            initialValues={apparelSearch}
            onSubmit={searchApperal}
            onReset={clearSearch}
            validationSchema={formikValidation}
          >
            <Form>
              <div className="p-5 d-flex">
                <Field
                  className="form-control"
                  type="text"
                  placeholder="Search Official"
                  name="input"
                />
                <ErrorMessage
                  name="input"
                  component="div"
                  className="apparelList-hasError align-self-start"
                />
                <button type="submit" className="btn btn-outline-dark ms-1">
                  Search
                </button>

                <button type="reset" className="btn btn-outline-secondary ms-1">
                  Clear
                </button>
              </div>
            </Form>
          </Formik>

          <Table responsive hover variant="light">
            <thead>
              <tr>
                <th className="fw-bolder">User</th>
                <th className="fw-bolder ">Hat Size</th>
                <th className="fw-bolder">Shirt Size</th>
                <th className="fw-bolder">Jacket Size</th>
                <th className="fw-bolder">Pants Size</th>
                <th className="fw-bolder">Pants Waist</th>
                <th className="fw-bolder">Shoe Size</th>
                <th className="fw-bolder">Status</th>
              </tr>
            </thead>

            <tbody> {apparelList.components}</tbody>
          </Table>
          <div className="text-center my-3">
            <Pagination
              onChange={onPageChange}
              current={apparelList.current}
              total={apparelList.total}
              pageSize={apparelList.pageSize}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ApparelList;
