import { useState } from "react";
import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import viewsCards from "../../utils/viewsCards";
import { PlusCircleFill } from "react-bootstrap-icons";
import { generateSampleCards } from "../../utils/sampleCards";
import config from "../../config";

function SideMain({ viewCard, setTriggerLoadCards }) {
  const [generatingSamples, setGeneratingSamples] = useState(false);

  const developmentModeEnabled = config.developmentMode?.enabled || false;

  // Handle sample card generation
  const handleGenerateSampleCards = async () => {
    setGeneratingSamples(true);
    try {
      await generateSampleCards(10);
      setTriggerLoadCards(true);
      alert("10 sample cards have been generated successfully!");
    } catch (error) {
      console.error("Error generating sample cards:", error);
      alert("Failed to generate sample cards. Please try again.");
    } finally {
      setGeneratingSamples(false);
    }
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
            <select id="projectSelect" className="form-select">
              <option value="">Choose...</option>
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
              <option value="project3">Project 3</option>
            </select>
          </div>
        ) : (
          <div></div>
        )}
      </Row>

      <Row className="sidebar-item  mt-auto">
        {developmentModeEnabled ? (
          <div>
            <hr />
            <h5 className="text-center">Development Mode</h5>
            <Button
              className="m-auto d-block mb-3"
              variant="success"
              onClick={handleGenerateSampleCards}
              disabled={generatingSamples}
            >
              {generatingSamples ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <PlusCircleFill className="me-2 mb-1" />
                  Add 10 Dummy Cards
                </>
              )}
            </Button>
            <input
              className="m-auto d-block mb-3 p-2 border rounded"
              type="text"
              placeholder="Enter project name"
            />
          </div>
        ) : (
          <div></div>
        )}
      </Row>
    </Col>
  );
}
export default SideMain;
