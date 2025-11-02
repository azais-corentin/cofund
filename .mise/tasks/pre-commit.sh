#!/usr/bin/env bash
#MISE description="Run pre-commit hooks"
bun format:check
trufflehog git file://. --since-commit HEAD --results=verified,unknown --fail