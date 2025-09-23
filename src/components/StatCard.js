import { Card } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./StatCard.css";

function StatCard({ title, value, bg }) {
  return (
    <Card className="stat-card" bg={bg} text={bg === 'light' ? 'dark' : 'white'}>
      <Card.Body className="stat-card-body">
        <Card.Title className="stat-card-title">{title}</Card.Title>
        <Card.Text className="stat-card-value">{value}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StatCard;