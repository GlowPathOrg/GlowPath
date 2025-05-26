import React, { useEffect, useState } from "react";
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "../styles/ Visualisations.css";
import Footer from "../components/Footer";
import { useUser } from "../hooks/useUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const mockData = {
  myPlaces: [
     "123 Main St",
    "456 Office Rd",
    "789 Fitness Ave",
  ],
  averageRouteLength: {
    timestamps: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    lengths: [2.5, 2.8, 3.0, 3.2, 3.5, 3.7],
  },
  averageTripDuration: {
    timestamps: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    durations: [30, 32, 28, 35, 33, 31],
  },
  lastTrips: [
    { startTime: "2025-05-20 08:00", finishTime: "2025-05-20 08:45", duration: 45 },
    { startTime: "2025-05-19 18:15", finishTime: "2025-05-19 18:50", duration: 35 },
    { startTime: "2025-05-18 07:30", finishTime: "2025-05-18 08:10", duration: 40 },
  ],
  lastShares: [
    { date: "2025-05-21", shareDuration: 10, views: 25 },
    { date: "2025-05-20", shareDuration: 5, views: 10 },
    { date: "2025-05-19", shareDuration: 15, views: 30 },
  ],
  sosActivations: {
    timestamps: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    counts: [1, 3, 0, 2, 4, 1],
  },
};

const Visualisations: React.FC = () => {
  const { user } = useUser();
  const [myPlaces, setMyPlaces] = useState(mockData.myPlaces)
  const commonChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  useEffect(()=>{
    if (!user || !user?.places || user.places.length === 0) {
      console.warn('no user...using mock data')
      setMyPlaces(mockData.myPlaces)
    }
    else {
      console.log(user.places.length)
      setMyPlaces(user.places)
    }
  }, [user])
  return (
    <div className="visualisations-page">
      <h1>Visualisations</h1>

      {/* My Places Section */}
      <section className="section">
        <h2>My Places</h2>
        <ul>
          {myPlaces.map((place: string, idx) => (
            <li key={idx}>
              {place}
            </li>
          ))}
        </ul>
      </section>

      {/* Average Route Length Over Time */}
      <section className="section">
        <h2>Average Route Length Over Time</h2>
        <div className="chart-card" style={{ height: 300 }}>
          <Line
            data={{
              labels: mockData.averageRouteLength.timestamps,
              datasets: [
                {
                  label: "Avg Route Length (km)",
                  data: mockData.averageRouteLength.lengths,
                  borderColor: "blue",
                  tension: 0.3,
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
      </section>

      {/* Average Trip Duration Over Time */}
      <section className="section">
        <h2>Average Trip Duration Over Time</h2>
        <div className="chart-card" style={{ height: 300 }}>
          <Line
            data={{
              labels: mockData.averageTripDuration.timestamps,
              datasets: [
                {
                  label: "Avg Trip Duration (mins)",
                  data: mockData.averageTripDuration.durations,
                  borderColor: "green",
                  tension: 0.3,
                },
              ],
            }}
            options={commonChartOptions}
          />
        </div>
      </section>

      {/* Last Trips */}
      <section className="section">
        <h2>Last Trips</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>Finish Time</th>
              <th>Duration (mins)</th>
            </tr>
          </thead>
          <tbody>
            {mockData.lastTrips.map((trip, idx) => (
              <tr key={idx}>
                <td>{trip.startTime}</td>
                <td>{trip.finishTime}</td>
                <td>{trip.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Last Shares */}
      <section className="section">
        <h2>Last Shares</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Share Duration (mins)</th>
              <th># of Views</th>
            </tr>
          </thead>
          <tbody>
            {mockData.lastShares.map((share, idx) => (
              <tr key={idx}>
                <td>{share.date}</td>
                <td>{share.shareDuration}</td>
                <td>{share.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SoS Activations Over Time */}
      <section className="section">
        <h2>SoS Activations Over Time</h2>
        <div className="chart-card" style={{ height: 300 }}>
          <Bar
            data={{
              labels: mockData.sosActivations.timestamps,
              datasets: [
                {
                  label: "SoS Activations",
                  data: mockData.sosActivations.counts,
                  backgroundColor: "red",
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
