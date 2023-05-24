import React from "react";
import PropTypes from "prop-types";

function ApparelListSingleItem({ apparel }) {
  const isInactive = apparel.statusType.id !== 1;
  return (
    <>
      <tr>
        <td>
          <div className="d-flex">
            <img
              src={apparel.user.avatarUrl}
              alt="pic"
              className="rounded-circle border border-white me-3"
              style={{ height: "2.2rem", width: "2.2rem" }}
            />
            <p className="fw-bold h6">
              {apparel.user.firstName} {apparel.user.lastName}
            </p>
          </div>
        </td>
        <td>{apparel.apparelSize?.hatSize.name}</td>
        <td>{apparel.apparelSize?.shirtSize.name}</td>
        <td>{apparel.apparelSize?.jacketSize.name}</td>
        <td>{apparel.apparelSize?.pantsSize.name}</td>
        <td>{apparel.apparelSize?.pantsWaist}</td>
        <td>{apparel.apparelSize?.shoeSize}</td>
        <td className={`${isInactive ? "text-danger" : "text-success"}`}>
          {apparel.statusType.name}
        </td>
      </tr>
    </>
  );
}

export default ApparelListSingleItem;

ApparelListSingleItem.propTypes = {
  apparel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    apparelSize: PropTypes.shape({
      id: PropTypes.number.isRequired,
      hatSize: PropTypes.number.isRequired,
      jacketSize: PropTypes.number.isRequired,
      pantsSize: PropTypes.number.isRequired,
      pantsWaist: PropTypes.number.isRequired,
      shirtSize: PropTypes.number.isRequired,
      shoeSize: PropTypes.number.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
