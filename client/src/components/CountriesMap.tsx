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
      })
    );

    polygonSeries.data.push({
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [26.5936, 55.6676],
            [26.175, 55.0033],
            [25.8594, 54.9192],
            [25.5473, 54.3317],
            [24.7683, 53.9746],
            [23.4845, 53.9398],
            [23.37, 54.2005],
            [22.7663, 54.3568],
            [22.8311, 54.8384],
            [21.2358, 55.2641],
            [21.0462, 56.07],
            [22.0845, 56.4067],
            [24.1206, 56.2642],
            [24.9032, 56.3982],
            [26.5936, 55.6676],
          ],
        ],
      },
    });
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
