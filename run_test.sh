#!/bin/bash
mkdir -p logs
LOG_FILE="logs/test_run_$(date +%s).log"

echo "Running Verification (TSC)..."
npx tsc --noEmit > "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "Verification PASSED. Code is valid."
  exit 0
else
  echo "Verification FAILED. See $LOG_FILE"
  # Cat the last 50 lines to show error
  tail -n 50 "$LOG_FILE"
  exit 1
fi
