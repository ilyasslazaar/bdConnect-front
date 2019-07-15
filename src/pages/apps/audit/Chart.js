import React from "react";
import { Bar } from "react-chartjs-2";
import { groupBy, get } from "lodash";

import { connect } from "react-redux";

const formatData = data => {
  if (data.result && data.result.length > 0) {
    const result = {
      datasets: [
        {
          label: "# of actions",
          backgroundColor: "rgba(87,106,61,0.5)",
          borderColor: "rgba(87,106,61,0.7)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(87,106,61,0.7)",
          hoverBorderColor: "rgba(87,106,61,0.7)",
          minBarLength: 2
        }
      ]
    };
    const groupedData = groupBy(data.result, i =>
      get(i, "uriName.name", "Others")
    );
    result.labels = Object.keys(groupedData);
    result.datasets[0].data = Object.values(groupedData).map(i => i.length);
    return result;
  }

  return {};
};

const options = {
  scales: {
    xAxes: [
      {
        stacked: true
      }
    ],
    yAxes: [
      {
        stacked: true
      }
    ]
  }
};

const ChartCmp = ({ data, loading }) =>
  !loading && get(data, "labels", []).length > 0 ? (
    <Bar data={data} options={options} />
  ) : (
    ""
  );

const mapStateToProps = state => {
  const { appData } = state;
  return {
    data: formatData(appData.pages.audit.data),
    loading: appData.pages.audit.loading
  };
};

export const Chart = connect(mapStateToProps)(ChartCmp);
