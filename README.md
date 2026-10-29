# SecureShip — DevSecOps Security Dashboard MVP

SecureShip is a beginner-friendly portfolio project that demonstrates how a full-stack dashboard can fit into a secure software delivery workflow.

> **Honest MVP note:** The dashboard currently uses clearly illustrative sample project metrics and findings. The `/api/scan` endpoint can run a real Trivy filesystem scan if Trivy is installed. GitHub repository connection, live pipeline ingestion, Kubernetes deployment, and cloud integrations are not implemented yet.

## Features

- Responsive security dashboard UI
- Express API health endpoint
- Scan endpoint that invokes Trivy against this repository (fixed local target)
- GitHub Actions workflow for build and security checks
- Docker image runs as a non-root user
- Example project records, pipeline stages, and security findings for UI demonstration

## Tech stack

React, Vite, Express, Node.js, Docker, GitHub Actions, Trivy, Semgrep.

## Run locally

Requirements: Node.js 20+ and npm. Trivy is optional unless you want to run a real scan from the dashboard.

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The API runs on `http://localhost:4000`.

Check API health:

```bash
curl http://localhost:4000/api/health
```

To run the Trivy scan manually:

```bash
trivy fs --scanners vuln,secret,misconfig .
```

Trivy's filesystem scanner can check local projects for vulnerabilities, misconfigurations, secrets, and licenses. See the [Trivy filesystem docs](https://trivy.dev/docs/latest/target/filesystem/).

## Build and run with Docker

```bash
docker build -t secureship:local .
docker run --rm -p 4000:4000 secureship:local
```

Then open `http://localhost:4000`.

## CI workflow

The workflow in `.github/workflows/security-ci.yml` runs on pushes and pull requests. It builds the frontend and runs repository security checks. Review the Actions log after pushing. A scanner step may report findings; review each result instead of assuming a clean scan means the application is secure.

## API

- `GET /api/health` — API health status
- `POST /api/scan` — runs Trivy against this repository if the `trivy` executable is installed on the host. The endpoint uses a fixed target and does not accept arbitrary paths or URLs.

## Suggested GitHub setup

1. Create a public repository named `secureship-devsecops`.
2. Push the project to the `main` branch.
3. Open the **Actions** tab and review the workflow.
4. Add a screenshot of the dashboard to `docs/` and link it here.
5. Replace all sample metrics with persisted data and actual scanner output before describing them as real results.

## Roadmap

- [ ] Store users, projects, scans, and findings in MongoDB
- [ ] Add authentication and role-based authorization
- [ ] Parse scanner JSON into real finding records
- [ ] Add dependency scanning and report history
- [ ] Add container image build and Trivy image scanning
- [ ] Add Kubernetes manifests, resource limits, RBAC, and NetworkPolicies
- [ ] Add Terraform-managed AWS infrastructure
- [ ] Add monitoring and authorized security test documentation

## Security boundaries

Use this project only against systems and repositories you own or have permission to test. Do not commit real API keys, credentials, tokens, or scan output that exposes sensitive information. This is a learning MVP, not a production security product.

## License

MIT — see `LICENSE`.
