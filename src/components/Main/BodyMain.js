import { Col } from "react-bootstrap";
import viewsCards from "../../utils/viewsCards";
import config from "../../config";

import "./BodyMain.css";

import BodyMainAll from "./BodyMainAll";
import BodyMainProject from "./BodyMainProject";
import BodyMainStat from "./BodyMainStat";

function BodyMain({
  viewCard,
  searchTerm,
  setSearchTerm,
  triggerLoadCards,
  setTriggerLoadCards,
  setTotalFilteredCards,
  searchProject,
  setSearchProject,
}) {
  const developmentModeEnabled = config.developmentMode?.enabled || false;

  return (
    <Col
      className={`layout-main${
        developmentModeEnabled ? " dev-mode" : ""
      } main-window-height`}
    >
      {viewCard === viewsCards[0] ? (
        <BodyMainAll
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          triggerLoadCards={triggerLoadCards}
          setTriggerLoadCards={setTriggerLoadCards}
          setTotalFilteredCards={setTotalFilteredCards}
        />
      ) : viewCard === viewsCards[1] ? (
        <BodyMainProject
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchProject={searchProject}
          setTotalFilteredCards={setTotalFilteredCards}
        />
      ) : viewCard === viewsCards[2] ? (
        <BodyMainStat />
      ) : (
        <div className="layout-main">
          <h2 className="text-center my-5">Select a mode to view cards.</h2>
        </div>
      )}
    </Col>
  );
}
export default BodyMain;
