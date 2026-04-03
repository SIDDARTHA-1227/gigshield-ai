{
  "name": "DisruptionEvent",
  "type": "object",
  "properties": {
    "type": {
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
    "zone": {
      "type": "string",
      "title": "Affected Zone"
    },
    "city": {
      "type": "string",
      "title": "City"
    },
    "severity": {
      "type": "string",
      "title": "Severity",
      "enum": [
        "moderate",
        "severe",
        "critical"
      ]
    },
    "trigger_value": {
      "type": "string",
      "title": "Trigger Value"
    },
    "trigger_threshold": {
      "type": "string",
      "title": "Trigger Threshold"
    },
    "start_time": {
      "type": "string",
      "title": "Start Time"
    },
    "end_time": {
      "type": "string",
      "title": "End Time"
    },
    "affected_workers": {
      "type": "number",
      "title": "Affected Workers",
      "default": 0
    },
    "total_claims_triggered": {
      "type": "number",
      "title": "Total Claims Triggered",
      "default": 0
    },
    "status": {
      "type": "string",
      "title": "Event Status",
      "enum": [
        "active",
        "resolved",
        "monitoring"
      ],
      "default": "active"
    }
  },
  "required": [
    "type",
    "zone",
    "city",
    "severity",
    "status"
  ]
}