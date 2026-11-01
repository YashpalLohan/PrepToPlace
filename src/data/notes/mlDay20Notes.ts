export const mlDay20Notes = {
  id: "ml-foundations-day-20-model-deployment-fastapi-docker",
  day: 20,
  title: "Model Deployment 101: FastAPI + Docker",
  track: "AI / ML",
  section: "ML Foundations",
  contentFile: "mlDay20Content.md",
  status: "not-started",
  overview: "Save a model with joblib, wrap it in a FastAPI endpoint, run it locally, optionally containerise.",
  resources: [
    { title: "FastAPI official tutorial", url: "https://fastapi.tiangolo.com/tutorial/", type: "documentation" },
    { title: "Krish Naik: Deploy ML model with FastAPI", url: "https://www.youtube.com/results?search_query=Krish+Naik+deploy+machine+learning+model+FastAPI", type: "video" },
    { title: "Made With ML", url: "https://madewithml.com/", type: "course" },
    { title: "FastAPI Docker deployment", url: "https://fastapi.tiangolo.com/deployment/docker/", type: "documentation" },
    { title: "joblib persistence", url: "https://joblib.readthedocs.io/en/stable/persistence.html", type: "documentation" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-training-artifact-save-the-complete-pipeline", title: "Save Model Artifact", sectionId: "2-training-artifact-save-the-complete-pipeline" },
    { id: "3-recommended-project-structure", title: "Project Structure", sectionId: "3-recommended-project-structure" },
    { id: "4-fastapi-basics", title: "FastAPI Basics", sectionId: "4-fastapi-basics" },
    { id: "5-define-a-request-schema", title: "Request Schema", sectionId: "5-define-a-request-schema" },
    { id: "6-build-the-fastapi-prediction-endpoint", title: "Prediction Endpoint", sectionId: "6-build-the-fastapi-prediction-endpoint" },
    { id: "7-run-the-api-locally", title: "Run Locally", sectionId: "7-run-the-api-locally" },
    { id: "8-send-a-test-request", title: "Test Request", sectionId: "8-send-a-test-request" },
    { id: "9-docker-fundamentals", title: "Docker Basics", sectionId: "9-docker-fundamentals" },
    { id: "10-dockerfile", title: "Dockerfile", sectionId: "10-dockerfile" },
    { id: "11-build-and-run-the-container", title: "Build & Run", sectionId: "11-build-and-run-the-container" },
    { id: "12-deployment-considerations-beyond-the-demo", title: "Production Considerations", sectionId: "12-deployment-considerations-beyond-the-demo" },
    { id: "13-common-mistakes", title: "Common Mistakes", sectionId: "13-common-mistakes" },
    { id: "14-placement-and-interview-questions", title: "Interview Questions", sectionId: "14-placement-and-interview-questions" },
    { id: "15-practice", title: "Practice", sectionId: "15-practice" },
    { id: "16-quick-revision", title: "Quick Revision", sectionId: "16-quick-revision" },
    { id: "17-final-checklist", title: "Checklist", sectionId: "17-final-checklist" },
    { id: "18-recommended-resources", title: "Resources", sectionId: "18-recommended-resources" }
  ]
};
