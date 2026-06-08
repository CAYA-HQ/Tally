import React, {useEffect} from "react";
import ChartBox from "../components/chart";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import "../styles/components/chartStyle.css";
import {getReport} from '../utils/fetchBackend'
import {
  FiBarChart2,
  FiClipboard,
  FiCreditCard,
} from "react-icons/fi";
import { Reports } from "../utils/dummyData";
import { useReportStore } from "../utils/zustand";

export const percentage = Reports.map((r) => {
  let percent =
    (r.quantitySold / r.quantityBought) * 100;

  if (percent > 100) percent = 100;

  return Math.round(percent);
});

const last = Reports.at(-1);

const lastWeekCost = last?.weeklyCost || 0;
const lastWeekSales = last?.weeklySales || 0;

const lastWeekProfit = lastWeekSales - lastWeekCost;
export const summaryData = [lastWeekCost, lastWeekSales, lastWeekProfit]

const extraData = Reports.map((r) => {
  return r.quantityBought;
});

const getMultipleChart = [
  {
    title: "Total Capital",
    icon: <FiCreditCard
        style={{background: "rgb(119, 94, 221)", color: 'white',}}
    />,
    barFillStyle: {
      background: "rgb(119, 94, 221)",
    },
  },

  {
    title: "Total Sales",
    icon: <FiBarChart2 
    style={{background: "rgb(206, 43, 157)", color: 'white',}}/>,
    barFillStyle: {
      background: "rgb(206, 43, 157)",
    },
  },

  {
    title: "Total Income",
    icon: <FiClipboard
        style={{background: "rgb(66, 153, 225)", color: 'white',}}
    />,
    barFillStyle: {
      background: "rgb(66, 153, 225)",
    },
  },
];

export const chartIndicators = [
  { color: "rgb(209, 205, 201)", name: "sales target" },
  { color: "rgb(119, 94, 221)", name: "sales" },
  { color: "palevioletred", name: "stock"  },
];

const ReportsPage = () => {

     useEffect(() => {
          const init = async () => {
            try {
              await getReport();
              const reports = useReportStore.getState().reports
            } catch (err) {
              console.log(err);
            }
          };  
      
          init();
        }, []);


  return (
    <>
      <Sidebar />

      <div className="report-div">

        <Navbar />

        <div className="report-header">
          <h1>Report</h1>
        </div>

        <div className="reports-wrapper">

          {getMultipleChart.map((chart, i) => (
            <ChartBox
              key={i}
            //   data={percentage}
              chartBoxClass="chart-box"
              barChartClass="bar-chart"
              barFillClass="bar-fill"
              barDivClass="bar-div"
              barFillStyle={chart.barFillStyle}
            >

              <div className="chart-header">

                <span
                  style={{
                    fontSize: "22px",
                    color:
                      chart.barFillStyle.background,
                  }}
                >
                  {chart.icon}
                </span>

                <p style={{opacity: '.5', marginTop: '10%'}}>
                    {chart.title}</p>
                <p style={{fontSize: '25px', }}
                >${summaryData?.[i]}</p>

              </div>

            </ChartBox>
          ))}

        </div>

        <div className="big-chart-wrapper">

          <ChartBox
            data={percentage}
            chartBoxClass="big-chart-box"
            barChartClass="big-bar-chart"
            barFillClass="bar-fill"
            barDivClass="big-bar-div"
            extraBarData={extraData}
            extraBarClass="extra-bar-fill"
            extraBarDiv="extra-bar-div"
            style={{ gap: "5px" }}
            weeklyBar={true}
            style={{position: 'relative'}}
          >
            <div className="chart-indicator">
            {chartIndicators.map((item, i) => (<div key={i}>
                <p>{item.name}</p>
              <div
                className="indicator-dot"
                style={{
                  background: item.color,
                }}
              />
            </div>))}
            </div>
          </ChartBox>

          <ChartBox
            chartBoxClass="chart-box"
            boxStyle={{width: '200px', height: '150px'}}
          >
            <div style={{
                width: '100%', height: '100%', justifyContent: 'center',
                alignItems: 'flex-start', display: 'flex', flexDirection: 'column'
            }}>
                <p style={{ opacity: '.5'}}>Total Sold Items</p>
            <p style={{fontSize: '25px', }}>700</p>
            </div>
            
            
          </ChartBox>

          

        </div>

      </div>
    </>
  );
};

export default ReportsPage;