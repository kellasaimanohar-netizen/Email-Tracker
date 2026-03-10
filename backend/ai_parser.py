import os
import json
from typing import Dict, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash') if GEMINI_API_KEY else None

EXTRACTION_PROMPT = """You are an AI that extracts job application information from emails.

Analyze the following email (subject + body) and extract the job application details.

Return JSON only with these fields:
- company: The company name being applied to or replying from
- hr_email: The HR or recruiter email address 
- role: The job role/position
- date: The date in YYYY-MM-DD format
- status: Suggest a status (e.g., "Applied", "Confirmation Received", "Interview Invited", "Rejected", "Need to Reply") based on the email content.
- is_valid_application: boolean. Set to false if this is a promotional email, newsletter, general job alert, recruiter spam, or not related to a specific job application made by the user. Set to true if it is a genuine application receipt, interview invite, or status update.

Email Subject: {subject}
Contact: {recipient}
Date: {date}
Folder: {folder}

Email Body:
{body}
"""


def extract_application_info(email_data: Dict) -> Optional[Dict]:
    """
    Use Gemini to extract job application information from email text.
    """
    # Force reload .env to ensure we have the latest API key
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'), override=True)
    current_key = os.getenv("GEMINI_API_KEY")
    
    if not current_key:
        print("❌ No GEMINI_API_KEY found in environment")
        return None

    # Reconfigure with the new key
    genai.configure(api_key=current_key)
    local_model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = EXTRACTION_PROMPT.format(
        subject=email_data.get("subject", ""),
        recipient=email_data.get("recipient", ""),
        date=email_data.get("date", ""),
        folder=email_data.get("folder", "SENT"),
        body=email_data.get("body", "")[:3000],
    )

    try:
        response = local_model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json",
            ),
            safety_settings={
                genai.types.HarmCategory.HARM_CATEGORY_HARASSMENT: genai.types.HarmBlockThreshold.BLOCK_NONE,
                genai.types.HarmCategory.HARM_CATEGORY_HATE_SPEECH: genai.types.HarmBlockThreshold.BLOCK_NONE,
                genai.types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: genai.types.HarmBlockThreshold.BLOCK_NONE,
                genai.types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: genai.types.HarmBlockThreshold.BLOCK_NONE,
            }
        )

        result_text = response.text.strip()

        # Clean up response - remove markdown code blocks if present
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1] if "\n" in result_text else result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()

        result = json.loads(result_text)

        # Ensure required fields
        return {
            "company": result.get("company", "Unknown"),
            "hr_email": result.get("hr_email", email_data.get("recipient", "Unknown")),
            "role": result.get("role", "Unknown"),
            "date": result.get("date", email_data.get("date")),
            "status": result.get("status", "Applied"),
            "is_valid_application": result.get("is_valid_application", True),
        }

    except json.JSONDecodeError as e:
        print(f"Failed to parse AI response as JSON: {e}")
        # Fallback: return basic info from email
        return {
            "company": "Unknown",
            "hr_email": email_data.get("recipient", "Unknown"),
            "role": "Unknown",
            "date": email_data.get("date"),
        }
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Return fallback data from email instead of None
        return {
            "company": "Company (AI Failed)",
            "hr_email": email_data.get("recipient", "Unknown"),
            "role": "Role (AI Failed)",
            "date": email_data.get("date"),
            "status": "Check Required",
        }
