import React, {useState, useEffect, useRef, useMemo, Children} from "react";

const ChartBox = ({
    data = [], chartBoxClass, barChartClass, boxStyle,
    barFillClass, barChartStyle, barFillStyle, children,
    extraBarClass, extraBartyle, extraBarData, barDivClass,
    extraBarDiv, style, weeklyBar
})=>{
    return (
  <>
    <div className={chartBoxClass} style={boxStyle}>
      {children}

      <div className={barDivClass}>

        {data.map((p, i) => (
          <div key={i} style={{width: '100%', height: '100%', display: 'flex', ...style}}>

            <div
              className={barChartClass}
              style={barChartStyle}
            >
              <div
                className={barFillClass}
                style={{
                  ...barFillStyle,
                  height: `${p}%`,
                }}
              ></div>
            </div>

            {extraBarData && (<div className={extraBarDiv}>
                <div
                className={extraBarClass}
                style={{
                  ...extraBartyle,
                  height: `${extraBarData?.[i] || 0}%`,
                }}
              ></div>
              </div>
            )}

            {weeklyBar && <p>WEEK {1+i}</p>}

          </div>
        ))}

      </div>
    </div>
  </>
);
}

export default ChartBox