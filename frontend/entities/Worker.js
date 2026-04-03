{
  "name": "Worker",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "title": "Full Name"
    },
    "phone": {
      "type": "string",
      "title": "Phone Number"
    },
    "city": {
      "type": "string",
      "title": "City"
    },
    "zone": {
      "type": "string",
      "title": "Operating Zone / Pincode"
    },
    "platform": {
      "type": "string",
      "title": "Delivery Platform",
      "enum": [
        "Swiggy",
        "Zomato",
        "Both"
      ]
    },
    "avg_daily_earnings": {
      "type": "number",
      "title": "Average Daily Earnings (\u20b9)"
    },
    "avg_hourly_earnings": {
      "type": "number",
      "title": "Average Hourly Earnings (\u20b9)"
    },
    "shifts": {
      "type": "array",
      "title": "Working Shifts",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "start_time": {
            "type": "string"
          },
          "end_time": {
            "type": "string"
          }
        }
      }
    },
    "active_plan": {
      "type": "string",
      "title": "Active Plan",
      "enum": [
        "none",
        "basic",
        "standard",
        "premium"
      ],
      "default": "none"
    },
    "plan_start_date": {
      "type": "string",
      "title": "Plan Start Date",
      "format": "date"
    },
    "total_claims_this_week": {
      "type": "number",
      "title": "Total Claims This Week",
      "default": 0
    },
    "total_payout_this_week": {
      "type": "number",
      "title": "Total Payout This Week (\u20b9)",
      "default": 0
    },
    "risk_score": {
      "type": "string",
      "title": "Zone Risk Score",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "default": "low"
    },
    "status": {
      "type": "string",
      "title": "Status",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    }
  },
  "required": [
    "full_name",
    "city",
    "zone",
    "platform"
  ]
}