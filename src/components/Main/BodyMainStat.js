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
import StatCard from "../StatCard";

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
  return (
    <div className="layout-main-stat">
      <Row>
        <Col>
          <StatCard title="Total Cards" value={50} bg="light" />
        </Col>
        <Col>
          <StatCard title="Todo" value={20} bg="warning" />
        </Col>
        <Col>
          <StatCard title="Doing" value={25} bg="info" />
        </Col>
        <Col>
          <StatCard title="Done" value={5} bg="success" />
        </Col>
        <Col>
          <StatCard title="Total Projects" value={23} bg="light" />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="stats-low-columns">
          <ul>
            <li className="raw-stats">
              <h5>
                Cards created in the last 7 days:{" "}
                <Badge pill bg="info">
                  10
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Cards completed in the last 7 days:{" "}
                <Badge pill bg="info">
                  2
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Average cards completed per day:{" "}
                <Badge pill bg="info">
                  0.3
                </Badge>
              </h5>
            </li>
            <li className="raw-stats">
              <h5>
                Most active project:{" "}
                <Badge pill bg="info">
                  Project Alpha
                </Badge>
              </h5>
            </li>
          </ul>
        </Col>
        <Col className="stats-low-columns">
          <div className="chart-container">
            <Bar
              data={{
                labels: ["Todo", "Doing", "Done"],
                datasets: [
                  {
                    label: "Card Status",
                    data: [20, 25, 5],
                    backgroundColor: ["#ffc107", "#17a2b8", "#28a745"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Card Status Distribution",
                  },
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
