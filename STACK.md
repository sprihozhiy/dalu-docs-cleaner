# STACK.md — Technology Requirements
# Single source of truth for all technology decisions in this project.
# Every agent reads this before writing any code or spec.
# Do not deviate. Do not introduce unlisted dependencies.

PROJECT_TYPE=web-app
LANGUAGE=javascript
LANGUAGE_VERSION=ES2022
RUNTIME=node
RUNTIME_VERSION=20
PACKAGE_MANAGER=npm

# Frontend
FRONTEND_FRAMEWORK=nextjs
FRONTEND_FRAMEWORK_VERSION=15
ROUTING=app-router
CSS_FRAMEWORK=tailwindcss
CSS_FRAMEWORK_VERSION=v4
UI_COMPONENT_LIBRARY=none
ICON_LIBRARY=react-icons
STATE_MANAGEMENT=react-hooks
FORM_HANDLING=native
DATA_FETCHING=fetch
ANIMATION=css

# Backend
BACKEND_FRAMEWORK=nextjs-api-routes
API_STYLE=rest
DATABASE=none
ORM=none
AUTH_PROVIDER=none
VALIDATION=none
FILE_STORAGE=none
EMAIL_SERVICE=resend
PAYMENT_PROVIDER=none
QUEUE_SYSTEM=none
REALTIME=none

# Testing
TEST_RUNNER=vitest
TEST_APPROACH=tdd
HAS_TEST_SCRIPT=true
BUILD_SAFE=true
E2E_TESTING=none

# Infrastructure
DEPLOY_TARGET=vercel
CI_PROVIDER=github-actions
CI_RUNTIME_VERSION=20
ENV_HANDLING=dotenv
MONOREPO_TOOL=none
CONTAINERIZE=false

# Code Quality
LINTER=eslint
FORMATTER=prettier

# [PROJECT-SPECIFIC]

# Email
RESEND_API_KEY=env:RESEND_API_KEY
CONTACT_EMAIL=sprihozhiy@gmail.com

# Chat Widget — connects to OpenClaw gateway on same server
OPENCLAW_GATEWAY_URL=http://localhost:18789/v1/chat/completions
OPENCLAW_GATEWAY_TOKEN=env:OPENCLAW_GATEWAY_TOKEN

# Blog — file-based markdown, no CMS
BLOG_FORMAT=markdown
BLOG_STORAGE=filesystem

# Additional packages
ADDITIONAL_PACKAGES=resend,gray-matter,remark,remark-html

# Design
DESIGN_THEME=dark-elegant
