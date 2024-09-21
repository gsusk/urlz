import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useLayoutEffect } from "react";

function CountriesMap() {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartsection");
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoEquirectangular(),
        zoomLevel: 1,
        minZoomLevel: 1,
        panX: "none",
        panY: "none",
        maxPanOut: 0,
        layer: -1,
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        stroke: am5.color(0xffffff),
        fill: am5.color(0xffffff),
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      stroke: am5.color(0x000000),
      strokeWidth: 1,
      fillOpacity: 0.5,
    });

    polygonSeries;

    polygonSeries.mapPolygons.template.setAll({
      templateField: "polygonSettings",
    });

    polygonSeries.data.setAll([
      {
        id: "FR",
        name: "France",
        value: 100,
        polygonSettings: {
          stroke: am5.color(0xf3111a),
          tooltipText: "{value}",
          fill: am5.color(0xf3111a),
        },
      },
      {
        id: "ES",
        name: "Spain",
        value: 200,
        polygonSettings: {
          stroke: am5.color(0x999999),
          tooltipText: "{value}",
          fill: am5.color(0x999999),
        },
      },
    ]);
    return () => root.dispose();
  }, []);

  return (
    <section
      id="chartsection"
      style={{ width: "100%", height: "500px" }}
    ></section>
  );
}

export default CountriesMap;
