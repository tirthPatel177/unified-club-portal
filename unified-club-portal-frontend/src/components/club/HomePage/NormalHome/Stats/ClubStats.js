import React, {useState, useEffect} from 'react'
import Separator from '../separator'
import {
    Chart,
    ChartTitle,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisTitle,
    ChartCategoryAxisItem,
  } from "@progress/kendo-react-charts";
import "hammerjs";

const ClubStats = ({club}) => {

    const [stats, setstats] = useState({
        club_val: [],
    }
    );


    const [isloading, setisloading] = useState(true)

    const fetchStats = () => {
        let fromData = new FormData();
        fromData.append('club_name', club);
        fetch("http://127.0.0.1:8000/api/club/stats_of_club", {
            method: 'POST',
            body: fromData
        }).then(
            data => data.json()
        ).then(
            data => {setstats(data)
                console.log(data)
                setTimeout(setisloading(false), 500)
            }
        )
    }

    useEffect(() => {
        fetchStats();
    }, [])

    

    return (
        <div>
            <Separator />
            <label className="section-title">Club Stats</label>
            <div className='my-app'>
                { isloading ? null :
                    <div>
                    </div>
                }   
            </div>
        </div>
    )
}

export default ClubStats
