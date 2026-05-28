import React from "react";
import ChartBox from "../components/chart";
import Sidebar from "../components/Layout/Sidebar";

const ReportsPage = ()=>{

    return<>
    <div>
        <Sidebar />
        <div style={{marginLeft: '25%', padding: '10px', paddingTop: '20px', display: 'flex', gap: 20}}>
            <ChartBox />
            <ChartBox />
            <ChartBox />
        </div>
        
    </div>
        
    </>
}

export default ReportsPage