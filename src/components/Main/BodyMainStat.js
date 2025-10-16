import { useEffect, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchCardsStat } from "../../services/api";
import StatCard from "../App/StatCard";

import "./BodyMainStat.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BodyMainStat = () => {
  const [stat, setStat] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCardsStat();
      if (!data) {
        return <div>No data available</div>;
      } else {
        setStat(data);
      }
    }
    fetchData();
  }, []);
  // add log to see the values on stat
  // console.log("Statistics data:", stat);
  if (!stat) return <div>Loading...</div>;

  const todoCount = stat.totalStatus.find((s) => s._id === "todo")?.count || 0;
  const doingCount =
    stat.totalStatus.find((s) => s._id === "doing")?.count || 0;
  const doneCount = stat.totalStatus.find((s) => s._id === "done")?.count || 0;

  return (
    <div className="layout-main-stat">
      <Row>
        <Col>
          <StatCard title="Total Cards" value={stat.totalCards ? stat.totalCards : 0} bg="light" />
        </Col>
        <Col>
          <StatCard title="Todo" value={todoCount} bg="warning" />
        </Col>
        <Col>
          <StatCard title="Doing" value={doingCount} bg="info" />
        </Col>
        <Col>
          <StatCard title="Done" value={doneCount} bg="success" />
        </Col>
        <Col>
          <StatCard
            title="Total Projects"
            value={stat.totalProjects ? stat.totalProjects : 0}
            bg="light"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="stats-low-columns">
          <ul>
            <li className="raw-stats">
              <h5>
                Cards created [last 7 days]:{" "}
                <Badge pill bg="info">
                  {stat.cardsCreatedLast7Days}
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Cards completed [last 7 days]:{" "}
                <Badge pill bg="info">
                  {stat.cardsCompletedLast7Days}
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Average completed [last 30 days]:{" "}
                <Badge pill bg="info">
                  {(stat.cardsCompletedLast30Days / 30).toFixed(1)}
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Most active:{" "}
                <Badge pill bg="info">
                  {stat.mostActiveProjectLast30Days?.name || "N/A"} (
                  {stat.mostActiveProjectLast30Days?.count || 0} cards)
                </Badge>
              </h5>
            </li>
          </ul>
        </Col>
        <Col className="stats-low-columns">
          <div className="chart-container">
            <h5 className="chart-title">Card Status Distribution</h5>
            <Bar
              data={{
                labels: ["Todo", "Doing", "Done"],
                datasets: [
                  {
                    label: "Card Status Distribution",
                    data: [todoCount, doingCount, doneCount],
                    backgroundColor: ["#ffc107", "#17a2b8", "#28a745"], // yellow, blue, green
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BodyMainStat;
