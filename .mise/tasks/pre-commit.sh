#!/usr/bin/env bash
#MISE description="Run pre-commit hooks"
set -e

bun format:check
gitleaks git --pre-commit --redact --staged --verbose
