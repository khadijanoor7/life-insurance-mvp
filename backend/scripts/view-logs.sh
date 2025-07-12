#!/bin/bash

# Simple log viewer script
# Usage: ./scripts/view-logs.sh [error|combined|all]

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"

if [ ! -d "$LOG_DIR" ]; then
    echo "Log directory not found: $LOG_DIR"
    echo "Make sure the backend container is running and logs directory exists"
    exit 1
fi

case "${1:-all}" in
    "error")
        echo "=== ERROR LOGS ==="
        if [ -f "$LOG_DIR/error.log" ]; then
            tail -f "$LOG_DIR/error.log" | jq -r '.timestamp + " [" + .level + "] " + .message'
        else
            echo "No error logs found"
        fi
        ;;
    "combined")
        echo "=== COMBINED LOGS ==="
        if [ -f "$LOG_DIR/combined.log" ]; then
            tail -f "$LOG_DIR/combined.log" | jq -r '.timestamp + " [" + .level + "] " + .message'
        else
            echo "No combined logs found"
        fi
        ;;
    "all")
        echo "=== ALL LOGS ==="
        if [ -f "$LOG_DIR/combined.log" ]; then
            tail -f "$LOG_DIR/combined.log" | jq -r '.timestamp + " [" + .level + "] " + .message'
        else
            echo "No logs found"
        fi
        ;;
    *)
        echo "Usage: $0 [error|combined|all]"
        echo "  error    - View error logs only"
        echo "  combined - View combined logs only"
        echo "  all      - View all logs (default)"
        exit 1
        ;;
esac 