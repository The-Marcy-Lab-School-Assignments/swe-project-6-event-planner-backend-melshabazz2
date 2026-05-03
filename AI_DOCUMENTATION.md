**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

Your response...

- I needed to implement the PATCH /api/events/:event_id endpoint. I was confused about how to update only some fields (like just the title) without overwriting the other fields (like location or date) with null. I asked the AI:"I'm implementing a PATCH route in Express and Postgres. If a user only sends a new title in the request body, how can I update just that column in the database while keeping the rest of the event data the same? Is there a way to do this in one SQL query?" I chose AI for this because I knew there would be a more efficient way to do it rather than writing multiple IF statements in JavaScript, and I wanted to see the industry standard SQL pattern.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

Your response...
- The AI introduced me to the COALESCE function. It explained that COALESCE returns the first non-null value in a list. I tested the concept by reading the official PostgreSQL documentation for COALESCE to confirm it worked as described. To verify it in my own project, I tried a manual UPDATE in psql where I intentionally passed NULL for the description: UPDATE events SET description = COALESCE(NULL, description) WHERE event_id = 1;
When the existing description stayed the same instead of disappearing, I knew the logic was sound and safe to implement in my model.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

Your response...

- The AI's initial example only showed two columns. My events table has six columns (title, description, date, location, event_type, and max_capacity). I had to expand the query to include all six fields while ensuring that the event_id remained the final parameter ($7) in the WHERE clause. I also made sure to return the updated row using RETURNING * so my controller could send the updated data back to the frontend as required by the API contract.

**4. What did you learn from using AI in this way?**

Your response...
- I learned about the COALESCE pattern, which is a very powerful way to handle "Optional" updates in SQL. I also learned that it’s better to handle this logic directly in the database query rather than writing complex conditional logic in the Express controller. This keeps the model layer responsible for the data integrity and makes the code much easier to read.
