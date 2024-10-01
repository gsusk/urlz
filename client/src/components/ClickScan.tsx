import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useLayoutEffect } from "react";
import { fillMissingDates } from "../utils/filldates";

export type ScanDataType = {
  date: string;
  views: number;
};

type PropTypes = { monthStats: ScanDataType[] };

export default function ClickScan({ monthStats }: PropTypes) {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        pinchZoomX: true,
      }),
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0,
        paddingBottom: 20,
        extraMax: 0.05,
        maxPrecision: 0,
        numberFormatter: am5.NumberFormatter.new(root, {
          numberFormat: "#", // This format shows only whole numbers
        }),
      }),
    );

    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(0xffffff), // White labels for Y-axis
    });

    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 1,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(0xffffff), // White labels for X-axis
    });

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "views",
        valueXField: "date",
        fill: am5.color(0x67b7dc), // Color for the fill
        stroke: am5.color(0x67b7dc), // Color for the line
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      }),
    );

    series.fills.template.setAll({
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x67b7dc), opacity: 0.5 }, // Color with 50% opacity
          { color: am5.color(0x67b7dc), opacity: 0 }, // Gradient fading to 0 opacity
        ],
      }),
      visible: true, // Make sure the fill is visible"
    });
    series.bullets.push(function (root, series, dataItem) {
      if (dataItem.dataContext?.views > 0) {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            fill: series.get("fill"),
            radius: 5,
            tooltipText: "{valueY}",
          }),
        });
      }
    });

    const filledData = fillMissingDates(monthStats);

    series.data.setAll(filledData);
    return () => root.dispose();
  }, [monthStats]);

  return (
    <>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </>
  );
}
