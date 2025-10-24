import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { generateSampleCards } from "../../utils/sampleCards";
import { fetchCards } from "../../services/api";

function DemoCreator({
  setTriggerLoadCards,
  loadProjectNames,
}) {
  const [generatingSamples, setGeneratingSamples] = useState(false);
  const [dummyProjectName, setDummyProjectName] = useState("");

  // Handle sample card generation
  const handleGenerateSampleCards = async () => {
    if (!dummyProjectName.trim()) {
      toast.warning("Please type a project name", {
        position: "bottom-left",
      });
      return;
    }

    // Check if project name already exists
    try {
      const cards = await fetchCards();
      const existingProjects = cards.map((card) => card.title.toLowerCase());
      
      if (existingProjects.includes(dummyProjectName.trim().toLowerCase())) {
        toast.warning("This project name already exists! Please enter a different title.", {
          position: "bottom-left",
        });
        return;
      }
    } catch (error) {
      console.error("Error checking existing projects:", error);
      toast.error("Failed to validate project name. Please try again.");
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
    <div>
      <hr />
      <h5 className="pb-3 text-center text-decoration-underline">
        demo creator
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
      </Form>
    </div>
  );
}

export default DemoCreator;
