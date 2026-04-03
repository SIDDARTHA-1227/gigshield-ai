{
  "name": "Claim",
  "type": "object",
  "properties": {
    "worker_id": {
      "type": "string",
      "title": "Worker ID"
    },
    "worker_name": {
      "type": "string",
      "title": "Worker Name"
    },
    "disruption_type": {
      "type": "string",
      "title": "Disruption Type",
      "enum": [
        "heavy_rain",
        "extreme_heat",
        "severe_pollution",
        "zone_shutdown",
        "platform_outage"
      ]
    },
    "disruption_details": {
      "type": "string",
      "title": "Disruption Details"
    },
    "zone": {
      "type": "string",
      "title": "Zone"
    },
    "shift_name": {
      "type": "string",
      "title": "Affected Shift"
    },
    "hours_lost": {
      "type": "number",
      "title": "Hours Lost"
    },
    "hourly_rate": {
      "type": "number",
      "title": "Hourly Rate (\u20b9)"
    },
    "calculated_payout": {
      "type": "number",
      "title": "Calculated Payout (\u20b9)"
    },
    "final_payout": {
      "type": "number",
      "title": "Final Payout (\u20b9)"
    },
    "plan_type": {
      "type": "string",
      "title": "Plan Type",
      "enum": [
        "basic",
        "standard",
        "premium"
      ]
    },
    "status": {
      "type": "string",
      "title": "Claim Status",
      "enum": [
        "auto_triggered",
        "verifying",
        "approved",
        "partial_payout",
        "rejected"
      ],
      "default": "auto_triggered"
    },
    "fraud_score": {
      "type": "number",
      "title": "Fraud Score (0-3)",
      "default": 3
    },
    "trigger_data": {
      "type": "object",
      "title": "Trigger Data",
      "additionalProperties": true
    }
  },
  "required": [
    "worker_id",
    "worker_name",
    "disruption_type",
    "zone",
    "status"
  ]
}