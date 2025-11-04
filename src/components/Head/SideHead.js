import { Button, Col, Row } from "react-bootstrap";
import viewsCards from "../../utils/viewsCards";

function SideHead({ viewCard, setViewCard, setProjectNameSelected }) {
  const developmentModeEnabled = process.env.REACT_APP_DESIGN_ENABLED === "true";

  return (
    <Col
      className={`layout-sidebar${developmentModeEnabled ? " dev-mode" : ""}`}
    >
      <Row className="sidebar-item gap-1">
        <h5 className="text-center">view</h5>
        <Button
          variant="outline-primary"
          active={viewCard === viewsCards[0]}
          onClick={() => {
            setViewCard(viewsCards[0]);
            setProjectNameSelected("");
          }}
        >
          ALL
        </Button>
        <Button
          variant="outline-success"
          active={viewCard === viewsCards[1]}
          onClick={() => {
            setViewCard(viewsCards[1]);
          }}
        >
          Projects
        </Button>
        <Button
          variant="outline-warning"
          active={viewCard === viewsCards[2]}
          onClick={() => {
            setViewCard(viewsCards[2]);
            setProjectNameSelected("");
          }}
        >
          Stats
        </Button>
      </Row>
    </Col>
  );
}
export default SideHead;
