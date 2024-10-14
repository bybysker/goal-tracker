from pydantic import BaseModel
from api.prompts import (MILESTONE_TO_TASK_SYS_MSG, 
                     MILESTONE_TO_TASK_USR_MSG,
                     ENRICHED_GOAL_SYS_MSG,
                     ENRICHED_GOAL_USR_MSG,
                     GOAL_TO_MILESTONE_SYS_MSG,
                     GOAL_TO_MILESTONE_USR_MSG)

class Goal(BaseModel):
    guid: str
    name: str 
    measurable: str 
    achievable: str 
    relevance: str 
    timeframe: str 
    bandwidth: int 

class Milestone(BaseModel):
    name: str
    description: str
    duration: float
    completed: bool
    guid: str

class Task(BaseModel):
    name: str
    completed: bool
    duration_hours: float
    guid: str
    muid: str

class GoalMilestones(BaseModel):
    milestones: list[Milestone]

class WeeklyTasks(BaseModel):
    tasks: list[Task]


class MilestonesGeneration:

    def __init__(self, db, client, user_id: str, goal_data: Goal):

        self.db = db
        self.client = client
        self.user_id = user_id
        self.goal_data = goal_data
        self.guid = goal_data.guid

        # Fetch user profile data
        user_profile_docs = self.db.collection("users").document(user_id).collection("userProfile").stream()
        user_profile_doc = next(user_profile_docs, None)  # Get the first document
        self.user_profile_data = user_profile_doc.to_dict() if user_profile_doc else {}

    def enrich_goal(self):

        completion = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {"role": "system", "content": ENRICHED_GOAL_SYS_MSG},
                {"role": "user", "content": ENRICHED_GOAL_USR_MSG.replace("$GOAL",str(self.goal_data)).replace("$PROFILE", str(self.user_profile_data))}
            ],
            seed=42
        )

        return completion.choices[0].message.content


    def generate_milestones(self, augmented_context: str = "None"):

        completion = self.client.beta.chat.completions.parse(
            model='gpt-4o-2024-08-06',
            messages=[
                {"role": "system", "content": GOAL_TO_MILESTONE_SYS_MSG},
                {"role": "user", "content": GOAL_TO_MILESTONE_USR_MSG.replace("$GOAL", self.enrich_goal())}
                       ],
            response_format=GoalMilestones,
            seed=42
        )
        message_parsed = completion.choices[0].message.parsed
        milestones_list = message_parsed.milestones
        for milestone in milestones_list:
            milestone.guid = self.guid
        
        return milestones_list
    


class TasksGeneration:

    def __init__(self, db, client, user_id: str, guid: str, muid: str):

        self.db = db
        self.client = client
        self.user_id = user_id
        self.guid = guid
        self.muid = muid

        # Fetch user profile data
        user_profile_docs = self.db.collection("users").document(user_id).collection("userProfile").stream()
        user_profile_doc = next(user_profile_docs, None)  # Get the first document
        self.user_profile_data = user_profile_doc.to_dict() if user_profile_doc else {}

        # Fetch goal data
        goal_doc = self.db.collection("users", self.user_id, "goals").document(self.guid).get()
        self.goal_data = goal_doc.to_dict() if goal_doc.exists else {}

        milestone_doc = self.db.collection("users", self.user_id, "goals", self.guid, "milestones").document(self.muid).get()
        self.milestone_data =  milestone_doc.to_dict() if goal_doc.exists else {}



    def generate_tasks(self, augmented_context: str = "None"):

        # Logic to generate tasks based on a prompt and augmented context
        completion = self.client.beta.chat.completions.parse(
            model='gpt-4o-2024-08-06',
            messages=[
                {"role": "system", "content": MILESTONE_TO_TASK_SYS_MSG},
                {"role": "user", "content": MILESTONE_TO_TASK_USR_MSG.replace("$MILESTONE",str(self.milestone_data))
                       .replace("$GOAL", str(self.goal_data))}
                       ],
            response_format=WeeklyTasks,
            seed=42
        )
        
        message_parsed = completion.choices[0].message.parsed
        tasks_list = message_parsed.tasks
        for task in tasks_list:
            task.guid = self.guid
            task.muid = self.muid

        return tasks_list