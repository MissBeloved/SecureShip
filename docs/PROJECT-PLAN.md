# SecureShip project plan

## MVP completed in this starter
- Dashboard UI with illustrative sample data
- API health endpoint
- Optional local Trivy scan endpoint
- Dockerfile and GitHub Actions workflow

## Next implementation milestones
1. Replace sample project data with a MongoDB data model.
2. Add authentication, secure password hashing, validation, and authorization.
3. Store scan run metadata and parse scanner JSON into normalized findings.
4. Add Docker image scanning to CI.
5. Add Kubernetes manifests with least-privilege RBAC, resource limits, and NetworkPolicies.
6. Add Terraform only after the local deployment is understood.
7. Document authorized security tests, findings, remediation, and retest evidence.

## Demo script
1. Open the dashboard and explain that example figures are sample UI data.
2. Run `curl http://localhost:4000/api/health`.
3. Install Trivy and click **Run security check** to invoke a real local filesystem scan.
4. Push a commit and inspect the GitHub Actions run.
5. Explain one finding and how you would verify and remediate it.
