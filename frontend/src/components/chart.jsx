import React, {useState, useEffect, useRef, useMemo, Children} from "react";
import '../styles/components/chartStyle.css'

const ChartBox = ({
    data = [], chartBoxClass, barChartClass, boxStyle,
    barFillClass, barChartStyle, barFillStyle, children,
    extraBarClass, extraBarStyle, extraBarData, barDivClass,
    barChartDiv, style, weeklyBar, toolTipData, toolTipClass,
    toolTiptyle, toolTipColor,
})=>{

  const [showInfo, setShowInfo] = useState(null)
  const [cord, setCord] = useState({x: 0, y: 0})

  const handleMouseMove = (e)=>{
    setCord({
      x: e.clientX,
      y: e.clientY
    })
  }

  const toolTipStyle = {
    position: 'fixed',
    left: `${cord.x}px`,
    top: `${cord.y}px`,
    zIndex: '10',
    cursor: 'pointer',
  }

  return (
  <>
    <div className={chartBoxClass} style={boxStyle}>
      {children}

      <div className={barDivClass}>

        {data.map((p, i) => (
          
          <div key={i} style={{
            width: '100%', height: '100%', display: 'flex', ...style
          }}>

            <div className={barChartDiv}
              onMouseEnter={()=> setShowInfo(i)}
              onMouseLeave={()=> setShowInfo(null)}
              onMouseMove={handleMouseMove}
            >
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

              {extraBarData &&(
                <div
                className={extraBarClass}
                style={{
                  ...extraBarStyle,
                  height: `${extraBarData?.[i] || 0}%`,
                }}
              ></div>)}

              {toolTipData && showInfo === i && (
                <div
                  className={toolTipClass}
                  style={{
                    ...toolTipStyle,
                    ...toolTiptyle,
                    
                  }}
                >
                  {toolTipData[i] ? (
                    <>
                      <p style={{color: '#1a1a1a'}}>
                        Sales Target: 💲
                        {(
                          (toolTipData[i]?.weeklyCost || 0) *
                          (toolTipData[i]?.quantityBought || 0)
                        ).toLocaleString()}
                      </p>

                      <p style={{color: toolTipColor?.[1].color}}>
                        Sales: 💲{toolTipData[i]?.weeklySales || 0}
                      </p>

                      <p style={{color: toolTipColor?.[2].color}}>
                        stock:  {(toolTipData[i]?.quantityBought 
                          || 0).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              )}

            </div>

            {weeklyBar && <p>WEEK {1+i}</p>}

          </div>
        ))}

      </div>
      
    </div>
  </>);
}

export default ChartBox