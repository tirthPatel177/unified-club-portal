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

const ClubStats = ({club}) => {

    const [stats, setstats] = useState('');

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
        </div>
    )
}

export default ClubStats
