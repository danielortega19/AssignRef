import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import debug from "sabio-debug";
import officialsService from "services/officialsService";
import crewOfficials from "services/crewsOfficialsService";
import "./dragNDrop.css";
import toastr from "toastr";
import PropTypes from "prop-types";

const _logger = debug.extend("dragNDrop");

function DragNDrop({ currentUser }) {
  const [crewOptions, setCrewOptions] = useState({
    crewOptionsList: [],
    crewOptionsComponents: [],
    isSearching: false,
  });
  const [crewId, setCrewId] = useState({ crewId: "" });

  const columnsTest = {
    Officials: {
      name: "All Officials",
      items: [],
    },
  };

  const [columns, setColumns] = useState(columnsTest);
  const [apiData, setApiData] = useState({ crewOfficials: [] });

  useEffect(() => {
    crewOfficials.getAll(1, 100).then(onGetCrewSuccess).catch(onGetCrewError);
  }, []);
  _logger(currentUser);

  useEffect(() => {
    officialsService
      .getByConferenceId(currentUser.conferenceId)
      .then(onOfficialsListSuccess)
      .catch(onOfficialsListError);
  }, [crewOptions.isSearching, columns.apiData?.items.length]);

  useEffect(() => {
    setApiData((prevState) => {
      const pageData = { ...prevState };

      pageData.crewOfficials = columns.apiData?.items.map(
        changeItemsDataToApiData
      );
      return pageData;
    });
  }, [columns.apiData?.items.length]);

  const onGetCrewSuccess = (response) => {
    setCrewOptions((prevState) => {
      const setData = { ...prevState };

      setData.crewOptionsList = response.item.pagedItems;
      setData.crewOptionsComponents =
        response.item.pagedItems.map(mapCrewsOptions);
      return setData;
    });
  };

  const onGetCrewError = () => {
    toastr["error"]("Server Error.", "Error when trying to retrived Crew Data");
  };

  const onOfficialsListSuccess = (response) => {
    const data = response.items || response.item.pagedItems;

    const idCheck = data.map((id) => id.id);
    _logger("id from officials", idCheck);
    const idChecks = columns.apiData?.items?.map((id) => Number(id.id));
    _logger("id from cloumns", idChecks);
    let isFound = idCheck.some((ids) => idChecks?.includes(ids));

    if (isFound) {
      for (let i = 0; i < idChecks.length; i++) {
        const idToDelete = idChecks[i];

        setColumns((prevState) => {
          const pageData = { ...prevState };

          pageData.Officials.items = [...pageData.Officials.items];

          const indexOf = data.findIndex((official) => {
            let result = false;

            if (official.id === Number(idToDelete)) {
              result = true;
            }

            return result;
          });

          if (indexOf >= 0) {
            data.splice(indexOf, 1);
            pageData.Officials.items = data.map(mapOfficials);
          }

          return pageData;
        });
      }
    } else {
      setColumns((prevState) => {
        const setData = { ...prevState };

        setData.Officials.items = data.map(mapOfficials);
        return setData;
      });
    }

    function mapOfficials(obj) {
      const newObj = {
        id: `${obj.id}`,
        url: obj.user.avatarUrl,
        name: `${obj.user.firstName}` + " " + `${obj.user.lastName}`,
        position: obj.primaryPosition.name,
        positionId: obj.primaryPosition.id,
      };
      return newObj;
    }
  };

  const onOfficialsListError = (err) => {
    if (err.response?.status === 404 && !crewId.crewId) {
      _logger("On first render there is no data. No error!");
    } else if (err.response?.status === 404 && conferenceId.conferenceId) {
      toastr["info"](
        "Please Select a different Conference",
        "No Officials Found"
      );
    } else {
      toastr["error"]("Server Error.", "Please try again");
    }
  };

  function mapCrewsOptions(obj) {
    return (
      <option key={obj.crewId.id} value={obj.crewId.id + "/" + obj.crewId.name}>
        {obj.crewId.name}
      </option>
    );
  }

  const onDragEnd = (result, columns, setColumns) => {
    _logger("result", result);
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    if (source.droppableId !== destination.droppableId) {
      _logger(result.draggableId === destItems.includes(result.draggableId));

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }

    setColumns;
  };

  const updateCrewId = (e) => {
    _logger("this isssssssssssssssssssssssssssss", e.target.value);
    if (e.target.value !== "") {
      const data = e.target.value.toString();
      const dataSplit = data.split("/");
      const id = dataSplit[0].toString();
      const crewName = dataSplit[1].toString();
      _logger(crewName);

      setCrewId((prevState) => {
        const setData = { ...prevState };
        setData.crewId = id;
        return setData;
      });
      setColumns((prevState) => {
        const setData = { ...prevState };
        Object.assign(setData, {
          apiData: {
            name: crewName,
            items: [],
          },
        });
        return setData;
      });
    }
  };
  const searchOfficials = (e) => {
    const data = e.target.value;
    if (data === "") {
      setCrewOptions((prevState) => {
        const setData = { ...prevState };
        setData.isSearching = !setData.isSearching;
        return setData;
      });
    }
    officialsService
      .getSearch(0, 20, data)
      .then(onOfficialsListSuccess)
      .catch(searchError);
  };

  const searchError = (err) => {
    if (err.response.data.errors.toString().includes("@Query")) {
      _logger("No Issues");
    } else if (err.response.status === 404) {
      toastr["info"](
        "Please check the name and try again",
        "No Officials Found"
      );
    } else {
      toastr["error"](
        "Server Error.",
        "Error when trying to search for Officials"
      );
    }
  };

  const changeItemsDataToApiData = (obj) => {
    const crewOfficials = {
      crewId: Number(crewId.crewId),
      officialId: Number(obj.id),
      positionId: obj.positionId,
    };
    return crewOfficials;
  };

  const addOfficials = () => {
    if (apiData.crewOfficials?.length === 0) {
      toastr["info"]("Please Add Officials", "Officials Input Needed");
    } else if (!apiData.crewOfficials) {
      toastr["info"]("Please Select a Crew", "Officials Input Needed");
    } else {
      crewOfficials
        .addCrewOfficials(apiData)
        .then(onAddCrewOfficialsSuccess)
        .catch(onAddCrewOfficialsError);
    }
  };

  const onAddCrewOfficialsSuccess = () => {
    toastr["success"]("All Officials Added Succesfully", "Succes");
  };
  const onAddCrewOfficialsError = (err) => {
    _logger(err);
    toastr["error"]("Please try again", "Server Error");
  };

  return (
    <>
      <div className="card dragndrop-card">
        <div className="container">
          <div className="d-flex flex-wrap gap-3">
            <div className="col-sm-3 my-5">
              <select
                id="Select Conference"
                className="form-control"
                onChange={updateCrewId}
              >
                <option value="">Please Select Crew </option>

                {crewOptions.crewOptionsComponents}
              </select>
            </div>

            <input
              type="text"
              className="dragndrop-searchinput from-control"
              onChange={searchOfficials}
              placeholder="Search Officials"
            />
            <button
              className="btn btn-primary my-5 mx-4"
              onClick={addOfficials}
            >
              Add Officials
            </button>
          </div>
        </div>
        <div className="mx-5 d-flex dragndrop-cardsmargin">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([id, column]) => {
              return (
                <div key={id}>
                  <h2 className="mx-5">{column.name}</h2>
                  <div className="mx-5 card">
                    <Droppable droppableId={id} key={id}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "rgb(172, 163, 163)"
                                : "lightgray",
                            }}
                            className="dragndrop-columns"
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        className="dragndrop-draggebleitems"
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                        style={{
                                          backgroundColor: snapshot.isDragging
                                            ? "#434346"
                                            : "gray",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <div className="d-flex">
                                          <img
                                            src={item.url}
                                            alt="pic"
                                            className="rounded-circle border broder-black  me-3"
                                            style={{
                                              height: "3rem",
                                              width: "3rem",
                                            }}
                                          />
                                          <div className="mx-3">
                                            <p className="dragndrop-cardcontent">
                                              {item.name}
                                            </p>
                                            <p className="dragndrop-cardcontent">
                                              {item.position}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
export default DragNDrop;

DragNDrop.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    conferenceId: PropTypes.number.isRequired,
  }).isRequired,
};
