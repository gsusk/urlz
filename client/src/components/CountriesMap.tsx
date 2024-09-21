import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useLayoutEffect } from "react";

function CountriesMap() {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdivb");
    let chart = root.container.children.push(
      am5map.MapChart.new(root, { projection: am5map.geoMercator() })
    );
  }, []);

  return <div id="chartdivb" style={{ width: "500px", height: "500px" }}></div>;
}

export default CountriesMap;
