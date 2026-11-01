# Day 20 — Model Deployment 101: FastAPI + Docker

## 1. Overview

A trained model is not useful to an application until another system can send it valid inputs and receive predictions reliably.

This lecture builds a basic deployment path:

1. Train a model and its preprocessing pipeline.
2. Save the fitted artifact with joblib.
3. Load it in a FastAPI application.
4. Validate incoming request data.
5. Return predictions as JSON.
6. Run the service locally.
7. Optionally package it in a Docker container.

This is an introductory serving workflow, not a complete production platform.

## 2. Training Artifact: Save the Complete Pipeline

Do not save only the final classifier if preprocessing is required.

The deployable artifact should include:
- Imputation
- Scaling
- Encoding
- Feature transformation
- Final estimator

A fitted scikit-learn Pipeline can package these steps together.

```python
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(max_iter=2000))
])

pipeline.fit(X_train, y_train)

joblib.dump(pipeline, "model.joblib")
```

For mixed tabular data, save the full Pipeline containing ColumnTransformer and the final estimator.

### Important artifact safety

Joblib uses Python serialization mechanisms related to pickle. Loading an untrusted artifact can execute arbitrary code.

- Load model files only from trusted, controlled sources.
- Store checksums or artifact signatures.
- Restrict who can write to the model-artifact location.
- Keep training and serving library versions compatible.
- Treat a model artifact as executable software, not as a harmless data file.

## 3. Recommended Project Structure

```text
ml-api/
├── app/
│   ├── __init__.py
│   └── main.py
├── artifacts/
│   └── model.joblib
├── training/
│   └── train.py
├── requirements.txt
├── Dockerfile
└── README.md
```

Keep training code separate from the API process. The API should load an already trained artifact, not retrain on every request.

## 4. FastAPI Basics

FastAPI lets you define HTTP endpoints using Python functions and type annotations.

Key terms:
- **Route:** a URL and HTTP method handled by the application.
- **Request body:** data sent by the client.
- **Schema:** expected request/response shape.
- **Validation:** checking types and constraints before model inference.
- **Response:** structured data returned to the client.

For prediction services, a common design is `POST /predict` with a JSON request body.

## 5. Define a Request Schema

Use Pydantic models to validate the incoming data.

```python
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    age: float = Field(ge=0, le=120)
    income: float = Field(ge=0)
    account_days: float = Field(ge=0)

class PredictionResponse(BaseModel):
    prediction: int
    probability_positive: float
    model_version: str
```

The fields must match the feature contract used during training. Add categorical fields or other features only when the saved preprocessing pipeline expects them.

## 6. Build the FastAPI Prediction Endpoint

```python
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

MODEL_PATH = Path("artifacts/model.joblib")
MODEL_VERSION = "1.0.0"

class PredictionRequest(BaseModel):
    age: float = Field(ge=0, le=120)
    income: float = Field(ge=0)
    account_days: float = Field(ge=0)

class PredictionResponse(BaseModel):
    prediction: int
    probability_positive: float
    model_version: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model artifact not found: {MODEL_PATH}")

    # Only load trusted artifacts created by your own training process.
    app.state.model = joblib.load(MODEL_PATH)
    yield
    app.state.model = None

app = FastAPI(
    title="ML Prediction API",
    version=MODEL_VERSION,
    lifespan=lifespan
)

@app.get("/health")
def health():
    return {"status": "ok", "model_version": MODEL_VERSION}

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    model = app.state.model

    features = pd.DataFrame([{
        "age": payload.age,
        "income": payload.income,
        "account_days": payload.account_days
    }])

    try:
        prediction = int(model.predict(features)[0])

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0]
            classes = list(model.classes_)
            positive_index = classes.index(1)
            probability_positive = float(probabilities[positive_index])
        else:
            probability_positive = 0.0

        return PredictionResponse(
            prediction=prediction,
            probability_positive=probability_positive,
            model_version=MODEL_VERSION
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Prediction failed for the supplied features."
        ) from exc
```

This example assumes:
- The saved artifact is a classifier.
- The positive class label is integer `1`.
- The artifact was trained with the exact columns shown.
- The model supports `predict_proba` for a meaningful probability.

For a multiclass or differently labelled target, define the positive/target class explicitly. Do not silently assume class index 1 means the desired business outcome.

For a regression model, return a numeric prediction instead of a class/probability response.

## 7. Run the API Locally

Example `requirements.txt`:

```text
fastapi
uvicorn[standard]
pandas
scikit-learn
joblib
```

Pin tested versions for reproducible deployments. The versions used to load a scikit-learn/joblib artifact should be compatible with the versions used to train it.

Start the development server:

```bash
uvicorn app.main:app --reload
```

Open:
- API base: `http://127.0.0.1:8000`
- Interactive Swagger documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

Use `--reload` for local development, not as a production setting.

## 8. Send a Test Request

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "income": 45000,
    "account_days": 730
  }'
```

Expected response shape:

```json
{
  "prediction": 0,
  "probability_positive": 0.18,
  "model_version": "1.0.0"
}
```

The numeric values above are illustrative, not a result from a real trained model.

## 9. Docker Fundamentals

Docker packages an application and its dependencies into an image. A container is a running instance of that image.

Core concepts:
- **Dockerfile:** instructions to build the image.
- **Image:** packaged application filesystem and dependencies.
- **Container:** running instance of the image.
- **Port mapping:** connects a host port to a container port.
- **Volume:** mounts data or files into a container.

## 10. Dockerfile

Example Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY artifacts ./artifacts

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Pin a Python version and dependency versions that are compatible with your trained artifact. For production, use a non-root user, scan images, minimise included files, and manage secrets outside the image.

## 11. Build and Run the Container

```bash
docker build -t ml-api:1.0 .
```

```bash
docker run --rm -p 8000:8000 ml-api:1.0
```

Then test:
- `http://localhost:8000/health`
- `http://localhost:8000/docs`

The host port 8000 maps to the container port 8000.

## 12. Deployment Considerations Beyond the Demo

A working local endpoint is only the beginning.

Before production, consider:
- **Input validation:** schema, ranges, missing fields, unexpected categories.
- **Authentication/authorisation:** who can call the API?
- **Rate limits:** prevent accidental or abusive request volume.
- **Timeouts:** bound slow requests.
- **Concurrency:** understand whether the model and libraries are safe for the chosen serving setup.
- **Logging:** request IDs, latency, model version, and safe error details; avoid sensitive raw inputs.
- **Monitoring:** request rate, error rate, latency, input drift, prediction distributions, and delayed outcome metrics.
- **Versioning:** record model and feature-schema versions.
- **Rollback:** keep a previously validated artifact available.
- **Resource limits:** CPU, memory, and worker count.
- **Security:** keep dependencies updated and do not load untrusted serialized models.

## 13. Common Mistakes

- Saving only the estimator and losing preprocessing.
- Loading an untrusted joblib/pickle file.
- Training a model during API startup or on every request.
- Returning a probability without verifying class order.
- Accepting arbitrary columns or silently changing feature order.
- Running development reload mode in production.
- Binding the server to `127.0.0.1` inside Docker instead of `0.0.0.0`.
- Forgetting to copy the artifact into the image or mount it.
- Failing to pin compatible library versions.
- Logging sensitive request data.
- Assuming a successful `/health` response proves model predictions are correct.

## 14. Placement and Interview Questions

**Q1. Why save a complete Pipeline instead of only the model?**  
The pipeline contains the transformations required to convert raw request features into the model's expected representation.

**Q2. What is FastAPI used for here?**  
It exposes prediction functionality through HTTP endpoints with request validation and structured responses.

**Q3. Why use Pydantic?**  
To validate request types and constraints before passing data to the model.

**Q4. What is the difference between an image and a container?**  
An image is a packaged template; a container is a running instance of that image.

**Q5. Why bind to 0.0.0.0 inside a container?**  
So the server listens on the container's network interfaces and can be reached through the published port.

**Q6. Why is joblib loading a security risk?**  
Python pickle-based deserialisation can execute code; only load trusted artifacts.

**Q7. What should `/health` check?**  
At minimum service liveness; a separate readiness check can verify that required resources, including the model artifact, are loaded.

**Q8. What would you monitor after deployment?**  
Availability, latency, errors, input data quality/drift, prediction distribution, model version, and delayed outcome metrics.

## 15. Practice

### Build exercise

Create a classification pipeline using a real dataset:
1. Train and evaluate it with a leakage-safe split.
2. Save the complete fitted pipeline with joblib.
3. Create a FastAPI request schema matching the feature contract.
4. Add `/health` and `/predict`.
5. Test valid and invalid payloads.
6. Add a model version to the response.
7. Create a Dockerfile and run the container locally.
8. Document the exact setup and test commands.

### Debug exercise

Diagnose these deployment failures:
- API starts but `/predict` says the artifact is missing.
- API returns a probability for the wrong target class.
- Local inference works but container inference fails due to a package version mismatch.
- API latency increases after loading a larger model.

## 16. Quick Revision

- **Artifact:** saved fitted model/workflow.
- **joblib:** convenient Python object persistence; load only trusted files.
- **FastAPI:** serves HTTP endpoints with validation.
- **Pydantic:** request/response schema validation.
- **Endpoint:** route such as `POST /predict`.
- **Docker image:** packaged application and dependencies.
- **Container:** running image instance.
- **Model version:** identify exactly which artifact served a prediction.
- **Production:** security, monitoring, resource controls, and rollback matter.

## 17. Final Checklist

- [ ] Save the full preprocessing-plus-model pipeline.
- [ ] Load only trusted model artifacts.
- [ ] Define and validate a request schema.
- [ ] Implement `/health` and `/predict`.
- [ ] Verify positive-class probability mapping.
- [ ] Run and test the API locally.
- [ ] Build and run a Docker image.
- [ ] Pin compatible dependencies.
- [ ] Document monitoring, security, and rollback considerations.

## 18. Recommended Resources

- [FastAPI Official Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [FastAPI: Docker Deployment](https://fastapi.tiangolo.com/deployment/docker/)
- [Krish Naik: Deploy ML Model with FastAPI](https://www.youtube.com/results?search_query=Krish+Naik+deploy+machine+learning+model+FastAPI)
- [Made With ML](https://madewithml.com/)
- [joblib Persistence Documentation](https://joblib.readthedocs.io/en/stable/persistence.html)
