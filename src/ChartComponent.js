import React, { useState, useRef, useEffect } from "react";
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
    "1d": [1000, 10220, 16600, 1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000, 4500, 63500, 13000, 2179, 1000, 10220, 16600, 1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000, 4500, 63500, 13000, 2179, 5000, 2000, 42000, 3000, 53000, 2000, 14000, 4500, 63500, 13000, 2179, 1000, 10220, 16600, 1100, 5000],
    "3d": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,6500, 52800, 13200, 23600, 43900],
    "1w": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,62000, 62200, 62400, 62600, 62800, 63000, 63179],
    "1m": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,61500, 62000, 62500, 63000, 63500, 64000, 64500, 65000],
    "6m": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,60000, 61000, 62000, 63000, 64000, 65000],
    "1y": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,58000, 59000, 60000, 61000, 62000, 63000, 64000, 65000],
    "max": [70000, 82000, 94000, 86000, 88000, 90000, 82000, 88000, 94000, 95000],
  };

  const comparisonDataSets = {
    "1d": [8000, 9000, 15000, 2000, 6000, 2500, 40000, 3500, 50000, 1500, 13000, 3000, 60000, 12000, 2200, 1200, 10200, 16000, 1000, 5500, 2100, 42000, 3200, 54000, 2100, 12000, 4000, 62000, 12500, 2100, 1500, 10500, 16000, 1200, 5500, 2200, 40000, 3200, 54000, 2100, 13000, 5000, 63000, 14000, 2200],
    "3d": [8000, 9000, 15000, 2000, 6000, 2500, 40000, 3500, 50000, 1500, 13000, 3000, 60000, ],
    "1w": [8000, 9000, 15000, 2000, 6000, 2500, 40000, 3500, 50000, 1500, 13000, 3000, 60000, 12000, 2200, 1200, 10200, 16000, 1000,],
    "1m": [3500, 50000, 1500, 13000, 3000, 60000, 12000, 2200, 1200, 10200, 16000, 1000, 5500, 2100, 42000, 3200, 54000, 2100, 12000, 4000,],
    "6m": [1100, 5000, 2000, 42000, 3000, 53000, 2000, 14000,60000, 61000, 62000, 63000, 64000, 65000],
    "1y": [ 12500, 2100, 1500, 10500, 16000, 1200, 5500, 2200, 40000, 3200, 54000, 2100, 13000, 5000, 63000, 14000, 2200],
    "max": [80000, 73000, 84000, 96000, 88000, 90000, 72000, 93000, 94000, 95000],
  };

  const selectedData = dataSets[timeRange] || [];
  const data = {
    labels: Array(selectedData.length).fill(''),
    datasets: [
      {
        label: "USD",
        data: selectedData,
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        fill: true,
        pointBackgroundColor: '#1E90FF',
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
        data: compareData,
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
        borderColor: '#1E90FF',
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
          // Remove the y-axis label by setting title to false
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
          {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((range) => (
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

      {activeTab === "Chart" && <Line data={data} options={options} />}
      {activeTab === "Summary" && (
        <div className="tab-content">
          <h2>Summary</h2>
          <p>This is a summary of the data over the selected time range. Here you can provide a brief overview or highlights.</p>
        </div>
      )}
      {activeTab === "Statistics" && (
        <div className="tab-content">
          <h2>Statistics</h2>
          <ul>
            <li>Mean: {selectedData.reduce((a, b) => a + b, 0) / selectedData.length}</li>
            <li>Max: {Math.max(...selectedData)}</li>
            <li>Min: {Math.min(...selectedData)}</li>
            <li>Standard Deviation: {Math.sqrt(selectedData.map(x => Math.pow(x - selectedData.reduce((a, b) => a + b, 0) / selectedData.length, 2)).reduce((a, b) => a + b) / selectedData.length)}</li>
          </ul>
        </div>
      )}
      {activeTab === "Analysis" && (
        <div className="tab-content">
          <h2>Analysis</h2>
          <p>Here you can provide some analysis of the data, such as trends, correlations, or other insights.</p>
        </div>
      )}
      {activeTab === "Settings" && (
        <div className="tab-content">
          <h2>Settings</h2>
          <p>Customize your chart settings here. You might include options for changing the chart type, colors, or other preferences.</p>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
