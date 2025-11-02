#!/usr/bin/env bash
#MISE description="Run pre-commit hooks"
bun format:check
gitleaks git --pre-commit --redact --staged --verbose