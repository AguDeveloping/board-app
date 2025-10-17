import { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import viewsCards from "../../utils/viewsCards";
import { PlusCircleFill } from "react-bootstrap-icons";
import { generateSampleCards } from "../../utils/sampleCards";
import config from "../../config";
import { fetchCards } from "../../services/api";
import { toast } from "react-toastify";

function SideMain({
  viewCard,
  setTriggerLoadCards,
  projectNameSelected,
  setProjectNameSelected,
}) {
  const [generatingSamples, setGeneratingSamples] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [dummyProjectName, setDummyProjectName] = useState("");

  const developmentModeEnabled = config.developmentMode?.enabled || false;

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

  // Handle sample card generation
  const handleGenerateSampleCards = async () => {
    if (!dummyProjectName.trim()) {
      toast.warning("Please type a  dummy project name", {
        position: "bottom-left",
      });
      return;
    }
    setGeneratingSamples(true);
    try {
      await generateSampleCards(10, dummyProjectName.trim());
      setTriggerLoadCards(true);
      await loadProjectNames();
      toast.success("10 sample cards have been generated successfully!");
    } catch (error) {
      console.error("Error generating sample cards:", error);
      toast.error("Failed to generate sample cards. Please try again.");
    } finally {
      setGeneratingSamples(false);
      setDummyProjectName("");
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
          <div>
            <hr />
            {/* h5 with underlined text */}

            <h5 className="pb-3 text-center text-decoration-underline">
              development mode
            </h5>
            <Form>
              <Form.Control
                type="text"
                className="m-auto d-block mb-3 p-2 border rounded w-100"
                placeholder="Enter project name"
                value={dummyProjectName}
                onChange={(e) => setDummyProjectName(e.target.value)}
              />

              <Button
                className="m-auto d-block mb-3 p-2 w-100"
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
                    10 Dummy Cards
                  </>
                )}
              </Button>
              {/* <input
              className="m-auto d-block mb-3 p-2 border rounded"
              type="text"
              placeholder="Enter project name"
            /> */}
            </Form>
          </div>
        ) : (
          <div></div>
        )}
      </Row>
    </Col>
  );
}
export default SideMain;
