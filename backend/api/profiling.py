import openai
from pydantic import BaseModel
from api.prompts import NEW_PROFILE_SYS_MSG, NEW_PROFILE_USR_MSG

class RawProfile(BaseModel):
    openness: str
    conscientiousness: str
    extraversion: str
    agreeableness: str
    neuroticism: str
    passions: str
    life_goals: str

class RefinedProfile(BaseModel):
    profile_summary: str
    growth_opportunities: str


class ProfileDefinition:

    def __init__(self, client, db, user_id):
        self.client = client
        self.db = db
        self.user_id = user_id

    def profile_definition(self, profile_form_data: RawProfile):
        
        completion = self.client.beta.chat.completions.parse(
            model='gpt-4o-2024-08-06',
            messages=[
                {"role": "system", "content": NEW_PROFILE_SYS_MSG},
                {"role": "user", "content": NEW_PROFILE_USR_MSG.replace("$PROFILE", str(profile_form_data))}
                       ],
            response_format=RefinedProfile,
            seed=42
        )

        refined_profile = completion.choices[0].message.parsed
        return refined_profile
    
    def save_profile(self, refined_profile: RefinedProfile):
        summary = refined_profile.profile_summary
        opportunities = refined_profile.growth_opportunities
        self.db.collection("users").document(self.user_id).collection("userProfile").document("profile").set({
            "summary": summary,
            "opportunities": opportunities
        })