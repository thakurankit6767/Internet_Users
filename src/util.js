import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  users: {
    hex: "#00B5E2",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 100,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 100,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 100,
  },
};

export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.users > b.users) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, usersType = "users") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[usersType].hex}
      fillColor={casesTypeColors[usersType].hex}
      fillOpacity={0.3}
      radius={
        Math.sqrt(country[usersType]) * casesTypeColors[usersType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Users: {numeral(country.users).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
