from pydantic import BaseModel, Field
from typing import Optional, List
from api.prompts import (
                     ENRICHED_GOAL_SYS_MSG,
                     ENRICHED_GOAL_USR_MSG,
                     GOAL_TO_TASK_SYS_MSG,
                     GOAL_TO_TASK_USR_MSG,
                     )

class PreGoal(BaseModel):
    what: str
    why: str
    when: str
    profile: dict

class Task(BaseModel):
    name: str
    description: Optional[str] = Field(None, description="Detailed description of the task")
    duration_hours: int = Field(..., description="Duration of the task in hours")
    simplicity: int = Field(..., description="Simplicity score (1-5)")
    importance: int = Field(..., description="Importance score (1-5)")
    urgency: int = Field(..., description="Urgency score (1-5)")
    completed: bool = Field(..., description="Whether the task has been completed")
    guid: str
    muid: str

class Milestone(BaseModel):
    muid: str
    name: str
    description: Optional[str] = Field(None, description="Detailed description of the milestone")
    tasks: List[Task] = Field(..., description="List of tasks associated with this milestone")
    deadline: Optional[str] = Field(None, description="Deadline for the milestone in ISO format")
    guid: str

class Goal(BaseModel):
    guid: str
    name: str 
    description: Optional[str] = Field(None, description="Detailed description of the goal")
    deadline: str = Field(..., description="Target date for achieving the goal in ISO format")
    progress: int = Field(..., description="Progress of the goal in percentage")
    milestones: List[Milestone] = Field(..., description="List of milestones associated with this goal")

class TasksGeneration:

    def __init__(self, db, client, user_id: str):

        self.db = db
        self.client = client
        self.user_id = user_id

        # Fetch user profile data
        user_profile_docs = self.db.collection("users").document(user_id).collection("userProfile").stream()
        user_profile_doc = next(user_profile_docs, None)  # Get the first document
        self.user_profile_data = user_profile_doc.to_dict() if user_profile_doc else {}

        # Fetch goal data
        goal_doc = self.db.collection("users", self.user_id, "goals").document(self.guid).get()
        self.goal_data = goal_doc.to_dict() if goal_doc.exists else {}

        milestone_doc = self.db.collection("users", self.user_id, "goals", self.guid, "milestones").document(self.muid).get()
        self.milestone_data =  milestone_doc.to_dict() if goal_doc.exists else {}


    

class GoalToTasks:

    def __init__(self, db, client, user_id: str):
        self.db = db
        self.client = client
        self.user_id = user_id


    
    def smart_goal(self, pre_goal: PreGoal):

        # Fetch user profile data
        user_profile_docs = self.db.collection("users").document(self.user_id).collection("userProfile").stream()
        user_profile_doc = next(user_profile_docs, None)  # Get the first document
        self.user_profile_data = user_profile_doc.to_dict() if user_profile_doc else {}

        
        completion = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {"role": "system", "content": ENRICHED_GOAL_SYS_MSG},
                {"role": "user", "content": ENRICHED_GOAL_USR_MSG.replace("$WHAT",str(pre_goal.what)).replace("$WHY", str(pre_goal.why)).replace("$WHEN", str(pre_goal.when)).replace("$PROFILE", str(self.user_profile_data))}
            ],
            seed=42
        )

        return completion.choices[0].message.content
    
    def generate_milestones_and_tasks(self, validated_smart_goal: str):

        # Fetch user profile data
        user_profile_docs = self.db.collection("users").document(self.user_id).collection("userProfile").stream()
        user_profile_doc = next(user_profile_docs, None)  # Get the first document
        self.user_profile_data = user_profile_doc.to_dict() if user_profile_doc else {}


        completion = self.client.beta.chat.completions.parse(
            model='gpt-4o-2024-08-06',
            messages=[
                {"role": "system", "content": GOAL_TO_TASK_SYS_MSG},
                {"role": "user", "content": GOAL_TO_TASK_USR_MSG.replace("$SMART_GOAL", validated_smart_goal)}
                       ],
            response_format=Goal,
            seed=42
        )
        
        goal_plan = completion.choices[0].message.parsed
        self.save_goal_to_firestore(goal_plan, self.user_id)

        return goal_plan
    
    # Save Goal with Nested Data to Firestore
    def save_goal_to_firestore(self, goal_plan: Goal, user_id: str):
        print(f"Saving goal plan for user {user_id}")
        print(f"Goal details: {goal_plan.name}, Deadline: {goal_plan.deadline}")
        
        goal_ref = self.db.collection('users', user_id, 'goals').document()
        goal_ref.set({
            'guid': goal_ref.id,
            'name': goal_plan.name,
            'description': goal_plan.description,
            'deadline': goal_plan.deadline,
            'progress': goal_plan.progress
        })
        print(f"Created goal document with ID: {goal_ref.id}")

        for milestone in goal_plan.milestones:
            print(f"Processing milestone: {milestone.name}")
            milestone.guid = goal_ref.id
            milestone_ref = goal_ref.collection('milestones').document()
            milestone_ref.set({
                'muid': milestone_ref.id,
                'name': milestone.name,
                'description': milestone.description,
                'deadline': milestone.deadline
            })
            print(f"Created milestone document with ID: {milestone_ref.id}")

            for task in milestone.tasks:
                print(f"Processing task: {task.name}")
                task.guid = goal_ref.id
                task.muid = milestone_ref.id
                task_ref = milestone_ref.collection('tasks').document()
                task_ref.set(task.dict())
                
                print(f"Created task document with ID: {task_ref.id}")