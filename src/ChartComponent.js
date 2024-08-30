import React, { useState, useRef, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { FaExpand, FaArrowsAltH } from "react-icons/fa";
import "./ChartComponent.css";

const ChartComponent = () => {
  const [activeTab, setActiveTab] = useState("Chart");
  const [timeRange, setTimeRange] = useState("1d");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareData, setCompareData] = useState([]);
  const containerRef = useRef(null);

  const dataSets = {
    "1d": [88,45,23,56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,112],
    "3d": [20,34,10,32,27,30,14,60,20,10,70,30,50],
    "1w": [10, 13, 5, 7, 6, 38, 23,34,10,23,45,67,78,50,56,43,23,56,67,32,54,78],
    "1m": [56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,11, 67,78,50,56],
    "6m": [88,45,23,56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,112],
    "1y": [88,45,23,56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,11, 67,78,50,56,43,23,56,67,32,54,78],
  };

  const comparisonDataSets = {
   "1d":  [10, 13, 5, 7, 6, 38, 23,34,10,23,45,67,78,50,56,43,23,56,67,32,54,78],
    "3d": [20,34,10,32,27,30,14,60,20,10,70,30,50],
    "1w": [78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,11, 67,78,50,56,43,23,56,67,32],
    "1m": [88,45,23,56,67,55,22,56,78,88,90,100,34,56,78,],
    "6m": [88,45,23,56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,11, ],
    "1y": [85,35,53,56,67,55,22,56,78,88,90,100,34,56,78,99, 105, 78,34, 34,67,22,11, 67,78,50,56,43,23,56,67,32,54,78],
  };

  const selectedData = dataSets[timeRange] || [];
  const comparisonData = isComparing ? (comparisonDataSets[timeRange] || []) : [];

  const meanValue = useMemo(() => {
    return selectedData.length > 0
      ? selectedData.reduce((a, b) => a + b, 0) / selectedData.length
      : 0;
  }, [selectedData]);

  const stdDev = useMemo(() => {
    return selectedData.length > 0
      ? Math.sqrt(
          selectedData
            .map(x => Math.pow(x - meanValue, 2))
            .reduce((a, b) => a + b, 0) / selectedData.length
        )
      : 0;
  }, [selectedData, meanValue]);

  const data = {
    labels: Array(selectedData.length).fill(''),
    datasets: [
      {
        label: "USD",
        data: selectedData,
        borderColor: "#5a67d8",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        fill: true,
        pointBackgroundColor: '#5a67d8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        borderWidth: 3,
        borderDash: [],
        tension: 0.4,
        shadowColor: 'rgba(30, 144, 255, 0.3)',
        shadowBlur: 10,
      },
      ...(isComparing ? [{
        label: "Comparison",
        data: comparisonData,
        borderColor: "#FF6347",
        backgroundColor: "rgba(255, 99, 71, 0.2)",
        fill: true,
        pointBackgroundColor: '#FF6347',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        borderWidth: 3,
        borderDash: [5, 5],
        tension: 0.4,
      }] : []),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333333',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#5a67d8',
        borderWidth: 2,
        callbacks: {
          label: function (tooltipItem) {
            return `USD ${tooltipItem.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#333333',
          font: {
            size: 14,
          },
          title: {
            display: false,
          },
        },
      },
    },
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleCompare = () => {
    setIsComparing(!isComparing);
    if (!isComparing) {
      setCompareData(comparisonDataSets[timeRange] || []);
    } else {
      setCompareData([]);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`chart-container ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <div className="value-display">
        <div className="current-value">
          <span className="amount">63,179.71</span>
          <span className="currency">USD</span>
        </div>
        <div className="change-value">+2,161.42 (3.54%)</div>
      </div>

      <div className="menu-tabs">
        {["Summary", "Chart", "Statistics", "Analysis", "Settings"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="menu">
        <div className="menu-actions">
          <button className="menu-btn" onClick={toggleFullscreen}>
            <FaExpand className="icon" />
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button className="menu-btn" onClick={toggleCompare}>
            <FaArrowsAltH className="icon" />
            {isComparing ? "Hide Comparison" : "Compare"}
          </button>
        </div>
        <div className="time-range">
          {["1d", "3d", "1w", "1m", "6m", "1y"].map((range) => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
