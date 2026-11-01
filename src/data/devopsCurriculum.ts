import { Section, Topic } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const now = new Date().toISOString();

const topic = (
  id: string,
  sectionId: string,
  title: string,
  description: string,
  order: number,
  resources: Array<{ title: string; url?: string }>
): Topic => ({
  id,
  sectionId,
  title,
  description,
  order,
  status: 'NOT_STARTED',
  createdAt: now,
  resources,
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 — Networking & Linux Foundations
// ─────────────────────────────────────────────────────────────────────────────
const P1 = 'sec-devops-phase1';

export const PHASE1_TOPICS: Topic[] = [
  topic('dv-p1-linux-basics', P1, 'Linux basics', 'Linux OS foundations — navigation, users, shell essentials.', 1, [
    { title: 'Linux basics', url: 'https://www.youtube.com/results?search_query=Linux%20basics%20linux%20tutorial' },
  ]),
  topic('dv-p1-filesystem', P1, 'File system', 'Directory structure, mounts, inodes, and disk layout.', 2, [
    { title: 'File system', url: 'https://www.youtube.com/results?search_query=File%20system%20devops%20tutorial' },
  ]),
  topic('dv-p1-permissions', P1, 'Permissions', 'chmod, chown, ACLs, sticky bit, SUID/SGID.', 3, [
    { title: 'Permissions', url: 'https://www.youtube.com/results?search_query=Permissions%20devops%20tutorial' },
  ]),
  topic('dv-p1-processes', P1, 'Processes', 'ps, top, kill, signals, process priority.', 4, [
    { title: 'Processes', url: 'https://www.youtube.com/results?search_query=Processes%20git%20tutorial' },
  ]),
  topic('dv-p1-services', P1, 'Services', 'systemd, service management, unit files.', 5, [
    { title: 'Services', url: 'https://www.youtube.com/results?search_query=Services%20devops%20tutorial' },
  ]),
  topic('dv-p1-pkg-mgr', P1, 'Package managers', 'apt, yum, snap, package pinning, repositories.', 6, [
    { title: 'Package managers', url: 'https://www.youtube.com/results?search_query=Package%20managers%20devops%20tutorial' },
  ]),
  topic('dv-p1-ssh', P1, 'SSH', 'Key generation, config file, tunneling, agent forwarding.', 7, [
    { title: 'SSH', url: 'https://www.youtube.com/results?search_query=SSH%20linux%20tutorial' },
  ]),
  topic('dv-p1-cron', P1, 'Cron jobs', 'Crontab syntax, environment variables, logging cron output.', 8, [
    { title: 'Cron jobs', url: 'https://www.youtube.com/results?search_query=Cron%20jobs%20linux%20tutorial' },
  ]),
  topic('dv-p1-logs', P1, 'Logs', 'journalctl, /var/log, logrotate, syslog.', 9, [
    { title: 'Logs', url: 'https://www.youtube.com/results?search_query=Logs%20devops%20tutorial' },
  ]),
  topic('dv-p1-tcpip', P1, 'TCP/IP', 'OSI model, subnetting, ARP, ICMP.', 10, [
    { title: 'TCP/IP', url: 'https://www.youtube.com/results?search_query=TCP%2FIP%20devops%20tutorial' },
  ]),
  topic('dv-p1-dns', P1, 'DNS', 'Resolution chain, record types, dig/nslookup, TTL.', 11, [
    { title: 'DNS', url: 'https://www.youtube.com/results?search_query=DNS%20devops%20tutorial' },
  ]),
  topic('dv-p1-http', P1, 'HTTP/HTTPS', 'Request/response lifecycle, headers, status codes, TLS handshake.', 12, [
    { title: 'HTTP/HTTPS', url: 'https://www.youtube.com/results?search_query=HTTP%2FHTTPS%20devops%20tutorial' },
  ]),
  topic('dv-p1-ports', P1, 'Ports', 'Well-known ports, ephemeral ports, netstat, ss, lsof.', 13, [
    { title: 'Ports', url: 'https://www.youtube.com/results?search_query=Ports%20devops%20tutorial' },
  ]),
  topic('dv-p1-lb', P1, 'Load balancers', 'L4 vs L7, round-robin, sticky sessions, health checks.', 14, [
    { title: 'Load balancers', url: 'https://www.youtube.com/results?search_query=Load%20balancers%20devops%20tutorial' },
  ]),
  topic('dv-p1-proxy', P1, 'Reverse proxy', 'Nginx reverse proxy, upstream blocks, header forwarding.', 15, [
    { title: 'Reverse proxy', url: 'https://www.youtube.com/results?search_query=Reverse%20proxy%20git%20tutorial' },
  ]),
  topic('dv-p1-firewall', P1, 'Firewalls', 'iptables, ufw, nftables, security groups.', 16, [
    { title: 'Firewalls', url: 'https://www.youtube.com/results?search_query=Firewalls%20devops%20tutorial' },
  ]),
  topic('dv-p1-ssltls', P1, 'SSL/TLS basics', 'Certificates, CA, Let\'s Encrypt, HTTPS configuration.', 17, [
    { title: 'SSL/TLS basics', url: 'https://www.youtube.com/results?search_query=SSL%2FTLS%20basics%20devops%20tutorial' },
  ]),
  // Labs
  topic('dv-p1-lab1', P1, 'Lab: Create Linux VM', 'Create a Linux VM locally (VirtualBox/Vagrant) or on a cloud provider.', 18, []),
  topic('dv-p1-lab2', P1, 'Lab: Configure Nginx server', 'Install and configure Nginx with a custom server block.', 19, []),
  topic('dv-p1-lab3', P1, 'Lab: Host static website', 'Serve a static HTML site from Nginx.', 20, []),
  topic('dv-p1-lab4', P1, 'Lab: Configure SSH login', 'Set up key-based SSH authentication, disable password login.', 21, []),
  topic('dv-p1-lab5', P1, 'Lab: Set up firewall rules', 'Configure ufw/iptables rules for a web server.', 22, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 — Git, GitHub & Automation
// ─────────────────────────────────────────────────────────────────────────────
const P2 = 'sec-devops-phase2';

export const PHASE2_TOPICS: Topic[] = [
  topic('dv-p2-init', P2, 'Git init', 'Initialising repos, .git internals, clone vs init.', 1, [
    { title: 'init', url: 'https://www.youtube.com/results?search_query=init%20devops%20tutorial' },
  ]),
  topic('dv-p2-commit', P2, 'Git commit', 'Staging, commits, amend, commit messages best practices.', 2, [
    { title: 'commit', url: 'https://www.youtube.com/results?search_query=commit%20devops%20tutorial' },
  ]),
  topic('dv-p2-branch', P2, 'Git branch', 'Branch creation, tracking, pruning, HEAD.', 3, [
    { title: 'branch', url: 'https://www.youtube.com/results?search_query=branch%20devops%20tutorial' },
  ]),
  topic('dv-p2-merge', P2, 'Git merge', 'Fast-forward, merge commit, squash, rebase.', 4, [
    { title: 'merge', url: 'https://www.youtube.com/results?search_query=merge%20devops%20tutorial' },
  ]),
  topic('dv-p2-prs', P2, 'Pull requests', 'PR workflow, code reviews, draft PRs, protected branches.', 5, [
    { title: 'pull requests', url: 'https://www.youtube.com/results?search_query=pull%20requests%20devops%20tutorial' },
  ]),
  topic('dv-p2-ghflow', P2, 'GitHub flow', 'Feature branch → PR → review → merge → deploy.', 6, [
    { title: 'GitHub flow', url: 'https://www.youtube.com/results?search_query=GitHub%20flow%20git%20tutorial' },
  ]),
  topic('dv-p2-conflicts', P2, 'Resolving conflicts', 'Conflict markers, mergetool, rebase conflicts.', 7, [
    { title: 'resolving conflicts', url: 'https://www.youtube.com/results?search_query=resolving%20conflicts%20devops%20tutorial' },
  ]),
  topic('dv-p2-bash-vars', P2, 'Bash: variables', 'Variables, quoting, environment variables, exports.', 8, [
    { title: 'variables', url: 'https://www.youtube.com/results?search_query=variables%20devops%20tutorial' },
  ]),
  topic('dv-p2-bash-loops', P2, 'Bash: loops', 'for, while, until, break/continue, arrays.', 9, [
    { title: 'loops', url: 'https://www.youtube.com/results?search_query=loops%20devops%20tutorial' },
  ]),
  topic('dv-p2-bash-fns', P2, 'Bash: functions', 'Defining functions, arguments, return codes, local variables.', 10, [
    { title: 'functions', url: 'https://www.youtube.com/results?search_query=functions%20devops%20tutorial' },
  ]),
  topic('dv-p2-automation', P2, 'Bash: automation scripts', 'Script design, error handling, set -euo pipefail, traps.', 11, [
    { title: 'automation scripts', url: 'https://www.youtube.com/results?search_query=automation%20scripts%20devops%20tutorial' },
  ]),
  topic('dv-p2-logparsing', P2, 'Bash: log parsing', 'grep, awk, sed, cut, sort, uniq pipelines.', 12, [
    { title: 'log parsing', url: 'https://www.youtube.com/results?search_query=log%20parsing%20devops%20tutorial' },
  ]),
  topic('dv-p2-py-files', P2, 'Python: file handling', 'open/read/write, pathlib, os.walk, shutil.', 13, [
    { title: 'File handling', url: 'https://www.youtube.com/results?search_query=File%20handling%20devops%20tutorial' },
  ]),
  topic('dv-p2-py-apis', P2, 'Python: APIs', 'requests library, auth, pagination, error handling.', 14, [
    { title: 'APIs', url: 'https://www.youtube.com/results?search_query=APIs%20devops%20tutorial' },
  ]),
  topic('dv-p2-py-yaml', P2, 'Python: JSON/YAML processing', 'json module, PyYAML, data transformation.', 15, [
    { title: 'JSON/YAML processing', url: 'https://www.youtube.com/results?search_query=JSON%2FYAML%20processing%20git%20tutorial' },
  ]),
  topic('dv-p2-py-auto', P2, 'Python: Automation', 'subprocess, paramiko, scheduled tasks, boto3 basics.', 16, [
    { title: 'Automation', url: 'https://www.youtube.com/results?search_query=Automation%20devops%20tutorial' },
  ]),
  // Labs
  topic('dv-p2-lab1', P2, 'Lab: Server health monitoring script', 'Write a Bash script that checks CPU, memory, disk, and alerts when thresholds are breached.', 17, []),
  topic('dv-p2-lab2', P2, 'Lab: Automated backup script', 'Create a script to compress and copy directories to a backup location with timestamps.', 18, []),
  topic('dv-p2-lab3', P2, 'Lab: Log analyzer', 'Parse access logs with awk/Python to produce a report of top IPs and error codes.', 19, []),
  topic('dv-p2-lab4', P2, 'Lab: Disk usage alert system', 'Script that monitors disk usage and sends an alert when usage exceeds a threshold.', 20, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 — Cloud Fundamentals (AWS First)
// ─────────────────────────────────────────────────────────────────────────────
const P3 = 'sec-devops-phase3';

export const PHASE3_TOPICS: Topic[] = [
  topic('dv-p3-ec2', P3, 'EC2 (Compute)', 'Instance types, AMIs, EBS volumes, user data, key pairs.', 1, [
    { title: 'EC2 (Compute)', url: 'https://www.youtube.com/results?search_query=EC2%20(Compute)%20aws%20tutorial' },
  ]),
  topic('dv-p3-s3', P3, 'S3 (Storage)', 'Buckets, objects, versioning, lifecycle policies, static hosting.', 2, [
    { title: 'S3 (Storage)', url: 'https://www.youtube.com/results?search_query=S3%20(Storage)%20aws%20tutorial' },
  ]),
  topic('dv-p3-iam', P3, 'IAM (Security)', 'Users, groups, roles, policies, trust relationships.', 3, [
    { title: 'IAM (Security)', url: 'https://www.youtube.com/results?search_query=IAM%20(Security)%20devops%20tutorial' },
  ]),
  topic('dv-p3-vpc', P3, 'VPC (Networking)', 'Subnets, route tables, internet gateway, NAT gateway, VPC peering.', 4, [
    { title: 'VPC (Networking)', url: 'https://www.youtube.com/results?search_query=VPC%20(Networking)%20aws%20tutorial' },
  ]),
  topic('dv-p3-sg', P3, 'Security Groups', 'Inbound/outbound rules, NACL vs SG, stateful vs stateless.', 5, [
    { title: 'Security Groups', url: 'https://www.youtube.com/results?search_query=Security%20Groups%20devops%20tutorial' },
  ]),
  topic('dv-p3-rds', P3, 'RDS (Database)', 'Multi-AZ, read replicas, parameter groups, snapshots.', 6, [
    { title: 'RDS (Database)', url: 'https://www.youtube.com/results?search_query=RDS%20(Database)%20aws%20tutorial' },
  ]),
  topic('dv-p3-alb', P3, 'Load Balancer', 'ALB vs NLB, target groups, listener rules, health checks.', 7, [
    { title: 'Load Balancer', url: 'https://www.youtube.com/results?search_query=Load%20Balancer%20devops%20tutorial' },
  ]),
  topic('dv-p3-asg', P3, 'Auto Scaling', 'Launch templates, scaling policies, warm pools.', 8, [
    { title: 'Auto Scaling', url: 'https://www.youtube.com/results?search_query=Auto%20Scaling%20devops%20tutorial' },
  ]),
  topic('dv-p3-ha', P3, 'High availability', 'Multi-AZ, multi-region, failover strategies.', 9, [
    { title: 'High availability', url: 'https://www.youtube.com/results?search_query=High%20availability%20devops%20tutorial' },
  ]),
  topic('dv-p3-scale', P3, 'Scalability', 'Horizontal vs vertical scaling, elasticity, capacity planning.', 10, [
    { title: 'Scalability', url: 'https://www.youtube.com/results?search_query=Scalability%20devops%20tutorial' },
  ]),
  topic('dv-p3-cost', P3, 'Cost optimization', 'Reserved instances, Spot, Savings Plans, Cost Explorer.', 11, [
    { title: 'Cost optimization', url: 'https://www.youtube.com/results?search_query=Cost%20optimization%20devops%20tutorial' },
  ]),
  topic('dv-p3-leastpriv', P3, 'IAM least privilege', 'Policy conditions, permission boundaries, SCPs.', 12, [
    { title: 'IAM least privilege', url: 'https://www.youtube.com/results?search_query=IAM%20least%20privilege%20git%20tutorial' },
  ]),
  // Labs
  topic('dv-p3-lab1', P3, 'Lab: Deploy full-stack app on EC2', 'Launch an EC2 instance, install dependencies, and deploy a full-stack application.', 13, []),
  topic('dv-p3-lab2', P3, 'Lab: Set up custom domain', 'Register a domain in Route 53 and configure DNS records.', 14, []),
  topic('dv-p3-lab3', P3, 'Lab: Configure HTTPS', 'Attach ACM certificate to an ALB and redirect HTTP to HTTPS.', 15, []),
  topic('dv-p3-lab4', P3, 'Lab: Create multi-tier architecture', 'Build a 3-tier architecture (web, app, DB) with proper subnet isolation.', 16, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 — Containers & Docker
// ─────────────────────────────────────────────────────────────────────────────
const P4 = 'sec-devops-phase4';

export const PHASE4_TOPICS: Topic[] = [
  topic('dv-p4-imgcont', P4, 'Images vs Containers', 'Layered filesystem, image tags, container lifecycle.', 1, [
    { title: 'Images vs Containers', url: 'https://www.youtube.com/results?search_query=Images%20vs%20Containers%20docker%20tutorial' },
  ]),
  topic('dv-p4-dockerfile', P4, 'Dockerfile', 'FROM, RUN, COPY, CMD, ENTRYPOINT, ARG, ENV, best practices.', 2, [
    { title: 'Dockerfile', url: 'https://www.youtube.com/results?search_query=Dockerfile%20docker%20tutorial' },
  ]),
  topic('dv-p4-networking', P4, 'Docker Networking', 'bridge, host, overlay networks, port mapping, DNS.', 3, [
    { title: 'Networking', url: 'https://www.youtube.com/results?search_query=Networking%20devops%20tutorial' },
  ]),
  topic('dv-p4-volumes', P4, 'Volumes', 'Named volumes, bind mounts, tmpfs, volume drivers.', 4, [
    { title: 'Volumes', url: 'https://www.youtube.com/results?search_query=Volumes%20devops%20tutorial' },
  ]),
  topic('dv-p4-multistage', P4, 'Multi-stage builds', 'Builder pattern, minimising image size, distroless images.', 5, [
    { title: 'Multi-stage builds', url: 'https://www.youtube.com/results?search_query=Multi-stage%20builds%20devops%20tutorial' },
  ]),
  topic('dv-p4-compose', P4, 'Docker Compose', 'Services, networks, volumes, depends_on, env_file, override files.', 6, [
    { title: 'Docker Compose', url: 'https://www.youtube.com/results?search_query=Docker%20Compose%20docker%20tutorial' },
  ]),
  topic('dv-p4-scanning', P4, 'Image scanning & security', 'docker scout, Trivy, Snyk, non-root users, read-only fs.', 7, [
    { title: 'Image scanning & security', url: 'https://www.youtube.com/results?search_query=Image%20scanning%20%26%20security%20devops%20tutorial' },
  ]),
  topic('dv-p4-debug', P4, 'Container debugging', 'docker exec, logs, inspect, stats, events.', 8, [
    { title: 'Container debugging', url: 'https://www.youtube.com/results?search_query=Container%20debugging%20docker%20tutorial' },
  ]),
  // Labs
  topic('dv-p4-lab1', P4, 'Lab: Dockerize Node.js app', 'Write a production-ready Dockerfile for a Node.js Express application.', 9, []),
  topic('dv-p4-lab2', P4, 'Lab: Dockerize React app', 'Multi-stage Dockerfile for a React app with Nginx serving the build.', 10, []),
  topic('dv-p4-lab3', P4, 'Lab: Build multi-container application', 'Use Docker Compose to wire a frontend, backend, and database together.', 11, []),
  topic('dv-p4-lab4', P4, 'Lab: Set up database container', 'Run PostgreSQL in Docker with persistent volumes and environment variables.', 12, []),
  topic('dv-p4-lab5', P4, 'Lab: Push image to AWS ECR', 'Build, tag, authenticate, and push a Docker image to Amazon ECR.', 13, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 — CI/CD & DevOps Pipelines
// ─────────────────────────────────────────────────────────────────────────────
const P5 = 'sec-devops-phase5';

export const PHASE5_TOPICS: Topic[] = [
  topic('dv-p5-gha-wf', P5, 'GitHub Actions: Workflows & Runners', 'YAML syntax, triggers, jobs, steps, self-hosted runners.', 1, [
    { title: 'Workflows & Runners', url: 'https://www.youtube.com/results?search_query=Workflows%20%26%20Runners%20devops%20tutorial' },
  ]),
  topic('dv-p5-gha-secrets', P5, 'GitHub Actions: Secrets management', 'Repository and org secrets, OIDC with AWS/GCP, masked logs.', 2, [
    { title: 'Secrets management', url: 'https://www.youtube.com/results?search_query=Secrets%20management%20devops%20tutorial' },
  ]),
  topic('dv-p5-gha-artifacts', P5, 'GitHub Actions: Artifacts', 'upload-artifact, download-artifact, caching dependencies.', 3, [
    { title: 'Artifacts', url: 'https://www.youtube.com/results?search_query=Artifacts%20devops%20tutorial' },
  ]),
  topic('dv-p5-gha-deploy', P5, 'GitHub Actions: Deployments', 'Environments, required reviewers, deployment protection rules.', 4, [
    { title: 'Deployments', url: 'https://www.youtube.com/results?search_query=Deployments%20devops%20tutorial' },
  ]),
  topic('dv-p5-jenkins-pipe', P5, 'Jenkins: Pipelines', 'Declarative vs scripted pipelines, stages, steps, post actions.', 5, [
    { title: 'Pipelines', url: 'https://www.youtube.com/results?search_query=Pipelines%20cicd%20pipeline%20tutorial' },
  ]),
  topic('dv-p5-jenkinsfile', P5, 'Jenkinsfile', 'Pipeline as code, agent directive, Jenkinsfile best practices.', 6, [
    { title: 'Jenkinsfile', url: 'https://www.youtube.com/results?search_query=Jenkinsfile%20cicd%20pipeline%20tutorial' },
  ]),
  topic('dv-p5-jenkins-agents', P5, 'Jenkins: Agents', 'Master-agent architecture, Docker agents, cloud agents.', 7, [
    { title: 'Agents', url: 'https://www.youtube.com/results?search_query=Agents%20devops%20tutorial' },
  ]),
  topic('dv-p5-jenkins-libs', P5, 'Jenkins: Shared libraries', 'Library structure, @Library annotation, global variables.', 8, [
    { title: 'Shared libraries', url: 'https://www.youtube.com/results?search_query=Shared%20libraries%20devops%20tutorial' },
  ]),
  topic('dv-p5-pipe-build', P5, 'Pipeline: Build stage', 'Lint, compile, unit test, build artifacts, parallelism.', 9, [
    { title: 'Build', url: 'https://www.youtube.com/results?search_query=Build%20devops%20tutorial' },
  ]),
  topic('dv-p5-pipe-test', P5, 'Pipeline: Test stage', 'Integration tests, test reports, coverage thresholds, test containers.', 10, [
    { title: 'Test', url: 'https://www.youtube.com/results?search_query=Test%20devops%20tutorial' },
  ]),
  topic('dv-p5-pipe-deploy', P5, 'Pipeline: Deploy stage', 'Blue-green, canary, rolling deployments.', 11, [
    { title: 'Deploy', url: 'https://www.youtube.com/results?search_query=Deploy%20devops%20tutorial' },
  ]),
  topic('dv-p5-rollback', P5, 'Rollback strategies', 'Automatic rollback, feature flags, version pinning.', 12, [
    { title: 'Rollback strategies', url: 'https://www.youtube.com/results?search_query=Rollback%20strategies%20devops%20tutorial' },
  ]),
  topic('dv-p5-approvals', P5, 'Manual approvals', 'Deployment gates, approval workflows in GitHub Actions and Jenkins.', 13, [
    { title: 'Manual approvals', url: 'https://www.youtube.com/results?search_query=Manual%20approvals%20git%20tutorial' },
  ]),
  // Labs
  topic('dv-p5-lab1', P5, 'Lab: CI/CD pipeline for full-stack app', 'Build a complete pipeline that runs tests, builds Docker image, and deploys to EC2 on merge.', 14, []),
  topic('dv-p5-lab2', P5, 'Lab: Docker image build pipeline', 'Automated pipeline that builds, scans, and pushes Docker images to ECR on every commit.', 15, []),
  topic('dv-p5-lab3', P5, 'Lab: Automated deployment pipeline', 'End-to-end deployment pipeline with environment promotion and Slack notifications.', 16, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 6 — Infrastructure as Code (Terraform)
// ─────────────────────────────────────────────────────────────────────────────
const P6 = 'sec-devops-phase6';

export const PHASE6_TOPICS: Topic[] = [
  topic('dv-p6-providers', P6, 'Providers', 'Provider configuration, version constraints, multiple providers.', 1, [
    { title: 'Providers', url: 'https://www.youtube.com/results?search_query=Providers%20git%20tutorial' },
  ]),
  topic('dv-p6-resources', P6, 'Resources', 'Resource blocks, meta-arguments (count, for_each, depends_on, lifecycle).', 2, [
    { title: 'Resources', url: 'https://www.youtube.com/results?search_query=Resources%20devops%20tutorial' },
  ]),
  topic('dv-p6-variables', P6, 'Variables', 'Input variables, locals, variable validation, tfvars files.', 3, [
    { title: 'Variables', url: 'https://www.youtube.com/results?search_query=Variables%20devops%20tutorial' },
  ]),
  topic('dv-p6-outputs', P6, 'Outputs', 'Output values, sensitive outputs, cross-module references.', 4, [
    { title: 'Outputs', url: 'https://www.youtube.com/results?search_query=Outputs%20devops%20tutorial' },
  ]),
  topic('dv-p6-modules', P6, 'Modules', 'Module structure, public registry, module composition.', 5, [
    { title: 'Modules', url: 'https://www.youtube.com/results?search_query=Modules%20devops%20tutorial' },
  ]),
  topic('dv-p6-remote-state', P6, 'Remote state management', 'S3 + DynamoDB backend, state locking, state isolation.', 6, [
    { title: 'Remote state management', url: 'https://www.youtube.com/results?search_query=Remote%20state%20management%20devops%20tutorial' },
  ]),
  topic('dv-p6-workspaces', P6, 'Workspaces', 'Workspace-per-environment pattern, limitations.', 7, [
    { title: 'Workspaces', url: 'https://www.youtube.com/results?search_query=Workspaces%20devops%20tutorial' },
  ]),
  // Labs
  topic('dv-p6-lab1', P6, 'Lab: Complete AWS infrastructure with Terraform', 'Define all AWS resources (VPC, subnets, security groups, EC2) in Terraform.', 8, []),
  topic('dv-p6-lab2', P6, 'Lab: VPC + EC2 + ALB + RDS stack', 'Provision a production-grade 3-tier stack using Terraform with remote state.', 9, []),
  topic('dv-p6-lab3', P6, 'Lab: Reusable Terraform modules', 'Build a reusable module library for common AWS resources.', 10, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 7 — Kubernetes & Cloud Native
// ─────────────────────────────────────────────────────────────────────────────
const P7 = 'sec-devops-phase7';

export const PHASE7_TOPICS: Topic[] = [
  topic('dv-p7-pods', P7, 'Pods', 'Pod spec, init containers, sidecar pattern, pod lifecycle.', 1, [
    { title: 'Pods', url: 'https://www.youtube.com/results?search_query=Pods%20devops%20tutorial' },
  ]),
  topic('dv-p7-deployments', P7, 'Deployments', 'ReplicaSets, rolling update strategy, revision history, rollback.', 2, [
    { title: 'Deployments', url: 'https://www.youtube.com/results?search_query=Deployments%20devops%20tutorial' },
  ]),
  topic('dv-p7-services', P7, 'Services', 'ClusterIP, NodePort, LoadBalancer, ExternalName, DNS.', 3, [
    { title: 'Services', url: 'https://www.youtube.com/results?search_query=Services%20devops%20tutorial' },
  ]),
  topic('dv-p7-ingress', P7, 'Ingress', 'Ingress controller, path-based routing, TLS termination.', 4, [
    { title: 'Ingress', url: 'https://www.youtube.com/results?search_query=Ingress%20devops%20tutorial' },
  ]),
  topic('dv-p7-configmaps', P7, 'ConfigMaps & Secrets', 'Mounting configs and secrets as volumes or env vars, external secrets.', 5, [
    { title: 'ConfigMaps & Secrets', url: 'https://www.youtube.com/results?search_query=ConfigMaps%20%26%20Secrets%20devops%20tutorial' },
  ]),
  topic('dv-p7-hpa', P7, 'HPA (Autoscaling)', 'Horizontal Pod Autoscaler, custom metrics, VPA.', 6, [
    { title: 'HPA (Autoscaling)', url: 'https://www.youtube.com/results?search_query=HPA%20(Autoscaling)%20devops%20tutorial' },
  ]),
  topic('dv-p7-statefulsets', P7, 'StatefulSets', 'Ordered pod management, stable network identities, PVCs.', 7, [
    { title: 'StatefulSets', url: 'https://www.youtube.com/results?search_query=StatefulSets%20devops%20tutorial' },
  ]),
  topic('dv-p7-helm', P7, 'Helm Charts', 'Chart structure, values, templating, dependencies, OCI charts.', 8, [
    { title: 'Helm Charts', url: 'https://www.youtube.com/results?search_query=Helm%20Charts%20kubernetes%20tutorial' },
  ]),
  topic('dv-p7-helm-tmpl', P7, 'Helm: Templates', 'Go templates, helper functions, range, if/else, named templates.', 9, [
    { title: 'Templates', url: 'https://www.youtube.com/results?search_query=Templates%20devops%20tutorial' },
  ]),
  topic('dv-p7-helm-rel', P7, 'Helm: Releases', 'helm install/upgrade/rollback, release lifecycle, hooks.', 10, [
    { title: 'Releases', url: 'https://www.youtube.com/results?search_query=Releases%20devops%20tutorial' },
  ]),
  topic('dv-p7-gitops', P7, 'GitOps Concepts', 'GitOps principles, pull vs push model, reconciliation loop.', 11, [
    { title: 'GitOps Concepts', url: 'https://www.youtube.com/results?search_query=GitOps%20Concepts%20git%20tutorial' },
  ]),
  topic('dv-p7-argocd', P7, 'ArgoCD basics', 'App of Apps, sync policies, health checks, notifications.', 12, [
    { title: 'ArgoCD basics', url: 'https://www.youtube.com/results?search_query=ArgoCD%20basics%20kubernetes%20tutorial' },
  ]),
  // Labs
  topic('dv-p7-lab1', P7, 'Lab: Deploy microservices on Kubernetes', 'Deploy a multi-service application with Deployments, Services, and ConfigMaps.', 13, []),
  topic('dv-p7-lab2', P7, 'Lab: AWS ECS and EKS', 'Explore managed Kubernetes with EKS and container orchestration with ECS Fargate.', 14, []),
  topic('dv-p7-lab3', P7, 'Lab: Set up Ingress controllers', 'Install NGINX Ingress Controller and configure path-based routing with TLS.', 15, []),
  topic('dv-p7-lab4', P7, 'Lab: Rolling updates', 'Perform rolling updates and rollbacks on a live Kubernetes deployment.', 16, []),
  topic('dv-p7-lab5', P7, 'Lab: Deploy applications using Helm', 'Package a microservice as a Helm chart and deploy it to a Kubernetes cluster.', 17, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 8 — Monitoring, Logging & Security
// ─────────────────────────────────────────────────────────────────────────────
const P8 = 'sec-devops-phase8';

export const PHASE8_TOPICS: Topic[] = [
  topic('dv-p8-prometheus', P8, 'Prometheus (Metrics)', 'PromQL, scraping, recording rules, alerting rules, exporters.', 1, [
    { title: 'Prometheus (Metrics)', url: 'https://www.youtube.com/results?search_query=Prometheus%20(Metrics)%20git%20tutorial' },
  ]),
  topic('dv-p8-grafana', P8, 'Grafana (Dashboards)', 'Data sources, panels, variables, alerting, provisioning.', 2, [
    { title: 'Grafana (Dashboards)', url: 'https://www.youtube.com/results?search_query=Grafana%20(Dashboards)%20aws%20tutorial' },
  ]),
  topic('dv-p8-alertmgr', P8, 'Alertmanager', 'Routing, grouping, inhibitions, silences, receivers (Slack, PagerDuty).', 3, [
    { title: 'Alertmanager', url: 'https://www.youtube.com/results?search_query=Alertmanager%20devops%20tutorial' },
  ]),
  topic('dv-p8-elk', P8, 'ELK Stack', 'Elasticsearch, Logstash, Kibana, Filebeat, index lifecycle management.', 4, [
    { title: 'ELK Stack', url: 'https://www.youtube.com/results?search_query=ELK%20Stack%20prometheus%20grafana%20monitoring' },
  ]),
  topic('dv-p8-loki', P8, 'Loki', 'Log aggregation with Loki + Promtail, LogQL, Grafana integration.', 5, [
    { title: 'Loki', url: 'https://www.youtube.com/results?search_query=Loki%20prometheus%20grafana%20monitoring' },
  ]),
  topic('dv-p8-iam-best', P8, 'IAM best practices', 'MFA enforcement, cross-account access, permission boundaries, audit.', 6, [
    { title: 'IAM best practices', url: 'https://www.youtube.com/results?search_query=IAM%20best%20practices%20git%20tutorial' },
  ]),
  topic('dv-p8-secrets-mgmt', P8, 'Secrets management', 'AWS Secrets Manager, HashiCorp Vault, Kubernetes ExternalSecrets.', 7, [
    { title: 'Secrets management', url: 'https://www.youtube.com/results?search_query=Secrets%20management%20devops%20tutorial' },
  ]),
  topic('dv-p8-trivy', P8, 'Trivy (Vulnerability scanning)', 'Container, filesystem, and IaC scanning, CI integration, SARIF output.', 8, [
    { title: 'Trivy (Vulnerability scanning)', url: 'https://www.youtube.com/results?search_query=Trivy%20(Vulnerability%20scanning)%20devops%20tutorial' },
  ]),
  // Labs
  topic('dv-p8-lab1', P8, 'Lab: Deploy full monitoring stack', 'Install Prometheus + Grafana + Alertmanager using Docker Compose or Helm.', 9, []),
  topic('dv-p8-lab2', P8, 'Lab: Configure alerts on failures', 'Set up Alertmanager rules and Grafana alerts with Slack notifications.', 10, []),
  topic('dv-p8-lab3', P8, 'Lab: Secure CI/CD pipeline', 'Add Trivy scanning, secret detection, and OIDC auth to a CI/CD pipeline.', 11, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 9 — Production-Level Projects
// ─────────────────────────────────────────────────────────────────────────────
const P9 = 'sec-devops-phase9';

export const PHASE9_TOPICS: Topic[] = [
  topic('dv-p9-proj1-gha', P9, 'Project 1: Full CI/CD Pipeline — GitHub Actions', 'End-to-end pipeline with GitHub Actions for a full-stack app.', 1, [
    { title: 'GitHub Actions', url: 'https://www.youtube.com/results?search_query=Project%201%3A%20Full%20CI%2FCD%20pipeline%20GitHub%20Actions%20git%20tutorial' },
  ]),
  topic('dv-p9-proj1-docker', P9, 'Project 1: Full CI/CD Pipeline — Docker', 'Dockerize the application and integrate image builds into the pipeline.', 2, [
    { title: 'Docker', url: 'https://www.youtube.com/results?search_query=Docker%20docker%20tutorial' },
  ]),
  topic('dv-p9-proj1-aws', P9, 'Project 1: Full CI/CD Pipeline — AWS deployment', 'Deploy the containerized app to AWS EC2 or ECS from the pipeline.', 3, [
    { title: 'AWS', url: 'https://www.youtube.com/results?search_query=AWS%20aws%20tutorial' },
  ]),
  topic('dv-p9-proj2-vpc', P9, 'Project 2: Terraform Infrastructure — VPC', 'Define a production-grade VPC with public/private subnets in Terraform.', 4, [
    { title: 'VPC', url: 'https://www.youtube.com/results?search_query=Project%202%3A%20Terraform%20Infrastructure%20VPC%20aws%20tutorial' },
  ]),
  topic('dv-p9-proj2-alb', P9, 'Project 2: Terraform Infrastructure — ALB', 'Provision an Application Load Balancer with target groups and listeners.', 5, [
    { title: 'ALB', url: 'https://www.youtube.com/results?search_query=ALB%20devops%20tutorial' },
  ]),
  topic('dv-p9-proj2-ec2', P9, 'Project 2: Terraform Infrastructure — EC2', 'Launch EC2 instances with launch templates and auto scaling groups.', 6, [
    { title: 'EC2', url: 'https://www.youtube.com/results?search_query=EC2%20aws%20tutorial' },
  ]),
  topic('dv-p9-proj2-rds', P9, 'Project 2: Terraform Infrastructure — RDS', 'Provision a Multi-AZ RDS instance with encryption and automated backups.', 7, [
    { title: 'RDS', url: 'https://www.youtube.com/results?search_query=RDS%20aws%20tutorial' },
  ]),
  topic('dv-p9-proj3', P9, 'Project 3: Kubernetes Deployment Platform', 'Deploy a multi-service application on Kubernetes with Ingress, HPA, and monitoring.', 8, [
    { title: 'Kubernetes Deployment Platform', url: 'https://www.youtube.com/results?search_query=Project%203%3A%20Kubernetes%20Deployment%20Platform%20kubernetes%20tutorial' },
  ]),
  topic('dv-p9-proj4', P9, 'Project 4: GitOps Project (ArgoCD)', 'Implement GitOps with ArgoCD for automated, declarative deployments.', 9, [
    { title: 'ArgoCD', url: 'https://www.youtube.com/results?search_query=Project%204%3A%20GitOps%20Project%20ArgoCD%20kubernetes%20tutorial' },
  ]),
  topic('dv-p9-proj5', P9, 'Project 5: Production Monitoring Stack', 'Build a full observability stack (Prometheus, Grafana, Loki, Alertmanager) for a production app.', 10, [
    { title: 'Production Monitoring Stack', url: 'https://www.youtube.com/results?search_query=Project%205%3A%20Production%20Monitoring%20Stack%20git%20tutorial' },
  ]),
];

// ─────────────────────────────────────────────────────────────────────────────
// DEVOPS_SECTIONS — 9 phases as sections
// ─────────────────────────────────────────────────────────────────────────────
export const DEVOPS_SECTIONS: Section[] = [
  {
    id: P1,
    trackId: 'track-devops',
    title: 'Phase 1: Networking & Linux Foundations',
    description: 'Linux OS fundamentals, networking concepts (TCP/IP, DNS, HTTP, SSL/TLS), and hands-on server configuration labs.',
    order: 1,
    isComingSoon: false,
    topics: PHASE1_TOPICS,
    subsections: [],
  },
  {
    id: P2,
    trackId: 'track-devops',
    title: 'Phase 2: Git, GitHub & Automation',
    description: 'Version control with Git, GitHub workflows, Bash scripting, and Python automation for DevOps tasks.',
    order: 2,
    isComingSoon: false,
    topics: PHASE2_TOPICS,
    subsections: [],
  },
  {
    id: P3,
    trackId: 'track-devops',
    title: 'Phase 3: Cloud Fundamentals (AWS First)',
    description: 'Core AWS services (EC2, S3, IAM, VPC, RDS, ALB), cloud engineering concepts, and deploying multi-tier architectures.',
    order: 3,
    isComingSoon: false,
    topics: PHASE3_TOPICS,
    subsections: [],
  },
  {
    id: P4,
    trackId: 'track-devops',
    title: 'Phase 4: Containers & Docker',
    description: 'Docker fundamentals, advanced containerisation (multi-stage, Compose, security), and hands-on labs with real applications.',
    order: 4,
    isComingSoon: false,
    topics: PHASE4_TOPICS,
    subsections: [],
  },
  {
    id: P5,
    trackId: 'track-devops',
    title: 'Phase 5: CI/CD & DevOps Pipelines',
    description: 'GitHub Actions and Jenkins pipeline engineering, deployment strategies, rollback, and approval gates.',
    order: 5,
    isComingSoon: false,
    topics: PHASE5_TOPICS,
    subsections: [],
  },
  {
    id: P6,
    trackId: 'track-devops',
    title: 'Phase 6: Infrastructure as Code (Terraform)',
    description: 'Terraform fundamentals, advanced IaC patterns (modules, remote state, workspaces), and provisioning production AWS infrastructure.',
    order: 6,
    isComingSoon: false,
    topics: PHASE6_TOPICS,
    subsections: [],
  },
  {
    id: P7,
    trackId: 'track-devops',
    title: 'Phase 7: Kubernetes & Cloud Native',
    description: 'Kubernetes orchestration, Helm chart authoring, GitOps with ArgoCD, and cloud-native deployments on EKS/ECS.',
    order: 7,
    isComingSoon: false,
    topics: PHASE7_TOPICS,
    subsections: [],
  },
  {
    id: P8,
    trackId: 'track-devops',
    title: 'Phase 8: Monitoring, Logging & Security',
    description: 'Observability with Prometheus/Grafana/Alertmanager, centralised logging with ELK/Loki, and DevSecOps practices.',
    order: 8,
    isComingSoon: false,
    topics: PHASE8_TOPICS,
    subsections: [],
  },
  {
    id: P9,
    trackId: 'track-devops',
    title: 'Phase 9: Production-Level Projects',
    description: 'Five capstone projects demonstrating end-to-end DevOps expertise: CI/CD, Terraform IaC, Kubernetes platform, GitOps, and monitoring.',
    order: 9,
    isComingSoon: false,
    topics: PHASE9_TOPICS,
    subsections: [],
  },
];
