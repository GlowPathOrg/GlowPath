import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for Pie Charts
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { RadialBarChart, RadialBar, Legend as RechartsLegend } from "recharts";
import "../styles/ Visualisations.css";
import Footer from "../components/Footer";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const mockData = {
  routeSafety: {
    safetyScores: [80, 85, 88, 90, 92, 87],
    timestamps: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    lightingFootTraffic: [
      { name: "Route 1", lighting: 70, footTraffic: 50 },
      { name: "Route 2", lighting: 85, footTraffic: 65 },
      { name: "Route 3", lighting: 60, footTraffic: 40 },
    ],
  },
  walkingPatterns: {
    averageTimes: [
      { demographic: "18-24", avgTime: 30 },
      { demographic: "25-40", avgTime: 45 },
    ],
  },
  panicMode: {
    panicActivations: [
      { time: "12AM", count: 5 },
      { time: "6AM", count: 2 },
      { time: "12PM", count: 3 },
      { time: "6PM", count: 8 },
    ],
    averageHelpTime: [5, 6, 7, 8],
    panicLocations: [
      { location: "Alexanderplatz", count: 15 },
      { location: "Brandenburg Gate", count: 10 },
      { location: "Checkpoint Charlie", count: 5 },
    ],
  },
};

const Visualisations: React.FC = () => {
  const commonChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="visualisations-page">
      <h1>Visualisations</h1>

      {/* Route Safety Section */}
      <section className="section">
        <h2>Route Safety Insights</h2>
        <div className="chart-card">
          <Line
            data={{
              labels: mockData.routeSafety.timestamps,
              datasets: [
                {
                  label: "Safety Score Over Time",
                  data: mockData.routeSafety.safetyScores,
                  borderColor: "blue",
                  tension: 0.2,
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
        <div className="chart-card">
          <RadialBarChart
            width={300}
            height={300}
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={mockData.routeSafety.lightingFootTraffic.map((route) => ({
              name: route.name,
              lighting: route.lighting,
              fill: route.lighting > 80 ? "#83a6ed" : "#8884d8",
            }))}
          >
            <RadialBar dataKey="lighting" background={{ fill: "#f3f3f3" }} />
            <RechartsLegend />
          </RadialBarChart>
        </div>
      </section>

      {/* Walking Patterns Section */}
      <section className="section">
        <h2>Walking Patterns</h2>
        <div className="chart-card">
          <Bar
            data={{
              labels: mockData.walkingPatterns.averageTimes.map((group) => group.demographic),
              datasets: [
                {
                  label: "Average Walking Time (mins)",
                  data: mockData.walkingPatterns.averageTimes.map((group) => group.avgTime),
                  backgroundColor: "green",
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
      </section>

      {/* Panic Mode Section */}
      <section className="section">
        <h2>Panic Mode Analytics</h2>
        <div className="chart-card">
          <Bar
            data={{
              labels: mockData.panicMode.panicActivations.map((entry) => entry.time),
              datasets: [
                {
                  label: "Panic Activations",
                  data: mockData.panicMode.panicActivations.map((entry) => entry.count),
                  backgroundColor: "orange",
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
        <div className="chart-card">
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr"],
              datasets: [
                {
                  label: "Average Help Time (mins)",
                  data: mockData.panicMode.averageHelpTime,
                  borderColor: "pink",
                  tension: 0.2,
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
        <div className="chart-card">
          <Pie
            data={{
              labels: mockData.panicMode.panicLocations.map((entry) => entry.location),
              datasets: [
                {
                  label: "Panic Activations by Location",
                  data: mockData.panicMode.panicLocations.map((entry) => entry.count),
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Visualisations;