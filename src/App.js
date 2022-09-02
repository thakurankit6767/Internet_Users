import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";

import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  
  const [usersType, setCasesType] = useState("users");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("http://localhost:8080/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
         
        });
    };

    getCountriesData();
  }, []);

  console.log(usersType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "http://localhost:8080/all"
        : `http://localhost:8080/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Worldwide Internet Users</h1>
        </div>
        {/* <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            isRed
            active={usersType === "users"}
            users={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.users).format("0.0a")}
          />
          <InfoBox
            title="Recovered"
            active={usersType === "recovered"}
            users={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={usersType === "deaths"}
            users={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div> */}
        <Map
          countries={mapCountries}
          usersType={usersType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      {/* <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Users by Country</h3>
            <Table countries={tableData} />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default App;
