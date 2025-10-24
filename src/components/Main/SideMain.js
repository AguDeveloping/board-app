import { useEffect, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import viewsCards from "../../utils/viewsCards";
import config from "../../config";
import { fetchCards } from "../../services/api";

import DemoCreator from "../App/DemoCreator";

function SideMain({
  viewCard,
  setTriggerLoadCards,
  projectNameSelected,
  setProjectNameSelected,
}) {
  const developmentModeEnabled = config.developmentMode?.enabled || false;
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    loadProjectNames();
  }, []);

  // list the differents title of cards into projectsName
  const loadProjectNames = async () => {
    const fetchProjectNames = async () => {
      const cards = await fetchCards();
      const projectNames = cards
        .filter(
          (card, index, self) =>
            index === self.findIndex((c) => c.title === card.title)
        )
        .map((card) => card.title);
      setProjectName(projectNames);
    };
    fetchProjectNames();
  };

  return (
    <Col
      className={`layout-sidebar${
        developmentModeEnabled ? " dev-mode" : ""
      } d-flex flex-column`}
    >
      <Row className="sidebar-item mt-2 mb-0 pt-0 pb-0 align-items-center">
        <Col xs={4} className="text-end">
          <h5 className="mb-0">mode</h5>
        </Col>
        <Col xs={8}>
          {viewCard === viewsCards[0] ? (
            <Badge className="p-3 fs-6 w-100 fw-normal" bg="secondary">
              All Cards
            </Badge>
          ) : viewCard === viewsCards[1] ? (
            <Badge className="p-3 fs-6 w-100 fw-normal" bg="secondary">
              Projects View
            </Badge>
          ) : viewCard === viewsCards[2] ? (
            <Badge className="p-3 fs-6 w-100 fw-normal" bg="secondary">
              Stats View
            </Badge>
          ) : (
            <Badge className="p-3 fs-6 w-100 fw-normal" bg="secondary">
              Click a view
            </Badge>
          )}
        </Col>
      </Row>

      <hr />
      <Row className="sidebar-item">
        {/* Input selector project */}
        {viewCard === viewsCards[1] ? (
          <div className="mb-3">
            <label htmlFor="projectSelect" className="form-label">
              Select Project
            </label>
            <select
              id="projectSelect"
              className="form-select"
              aria-label="Select Project"
              value={projectNameSelected}
              onChange={(e) => setProjectNameSelected(e.target.value)}
            >
              <option value="">Choose...</option>
              {Array.from(new Set(projectName)).map((name, index) => (
                <option key={index} value={name}>
                  {name.length > 20 ? name.substring(0, 26) + "..." : name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div></div>
        )}
      </Row>

      <Row className="sidebar-item  mt-auto">
        {developmentModeEnabled ? (
          <DemoCreator
            setTriggerLoadCards={setTriggerLoadCards}
            loadProjectNames={loadProjectNames}
          />
        ) : (
          <DemoCreator
            setTriggerLoadCards={setTriggerLoadCards}
            loadProjectNames={loadProjectNames}
          />
        )}
      </Row>
    </Col>
  );
}
export default SideMain;
