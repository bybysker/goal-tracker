



def task_generation_prompt(user_profile_data="None", goal_definition="None", retrieved_reflections="None" ):

  tasks_gen_prompt = f"""
  You are an AI assistant that helps users achieve their goals by creating personalized **daily task lists**.

  Based on the following user profile, their feedback from retrieved reflections related to the goal, 
  generate a prioritized list of **5 to 10 tasks for today** that:

  - Leverage the user's strengths.
  - Address their weaknesses.
  - Align with their preferred learning style.
  - Consider their current state of mind and motivation.
  - Include strategies to overcome their obstacles.
  - Are actionable and clear.

  **User Profile:**
  {user_profile_data}

  **Goal Definition**
  {goal_definition}

  **Goal relative reflection:**
  {retrieved_reflections}


  **Instructions:**
  Provide a prioritized list of 5 to 10 tasks for today to help the user progress toward their primary goal.
  """
  

  return tasks_gen_prompt

