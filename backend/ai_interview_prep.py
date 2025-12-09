"""
AI-Powered Interview Preparation Assistant
Generates targeted interview questions and preparation guidance
Integrated with real-world interview datasets for enhanced recommendations
"""

from typing import Dict, List, Any
import random


class AIInterviewPrep:
    def __init__(self, data_processor=None):
        # Optional data processor for real interview questions
        self.data_processor = data_processor

        # Question database organized by category
        self.question_database = {
            'behavioral': [
                {'q': 'Tell me about a time when you had to deal with a difficult team member.', 'a': 'Situation: I worked with a colleague who frequently missed deadlines. Task: We needed to deliver a project on time. Action: I privately discussed the issue with them to understand their blockers and helped re-distribute the workload. Result: We met the deadline and their performance improved.'},
                {'q': 'Describe a situation where you had to meet a tight deadline.', 'a': 'Situation: A client moved up a launch date by two weeks. Task: I had to accelerate the development cycle. Action: I prioritized critical features, cut non-essential scope, and coordinated with the team to work efficiently. Result: We launched on time with all core features functioning.'},
                {'q': 'Give me an example of a goal you set and how you achieved it.', 'a': 'Situation: I wanted to improve our code coverage. Task: The goal was to reach 80% coverage. Action: I integrated coverage tools into our CI/CD pipeline and encouraged the team to write tests for every new feature. Result: We reached 85% coverage within 3 months.'},
                {'q': 'Tell me about a time when you failed and what you learned from it.', 'a': 'Situation: I deployed a bug to production due to insufficient testing. Task: I needed to fix it and prevent recurrence. Action: I rolled back the change, fixed the bug, and implemented a more rigorous testing protocol. Result: We haven\'t had a similar production incident since.'},
                {'q': 'Describe a situation where you had to adapt to significant changes.', 'a': 'Situation: Our company pivoted to a new tech stack. Task: I had to learn React quickly. Action: I took an intensive course and built a practice project over the weekend. Result: I was able to contribute to the new codebase within a week.'},
                {'q': 'Tell me about a time when you disagreed with your manager.', 'a': 'Situation: My manager wanted to use a specific library I knew was deprecated. Task: I needed to propose a better alternative. Action: I researched the modern alternative, built a small prototype, and presented the benefits. Result: My manager agreed and we used the new library.'},
                {'q': 'Give me an example of when you showed leadership without being a manager.', 'a': 'Situation: The team was stuck on a complex architectural decision. Task: We needed to move forward. Action: I organized a brainstorming session, listed pros and cons, and facilitated a consensus. Result: We made a decision and the project proceeded.'},
                {'q': 'Describe a time when you had to learn something new quickly.', 'a': 'Situation: I was assigned a project using GraphQL, which I hadn\'t used. Task: Learn GraphQL basics. Action: I read the documentation and built a sample API. Result: I successfully implemented the GraphQL endpoint.'},
                {'q': 'Tell me about a project you\'re most proud of.', 'a': 'Situation: I built an e-commerce platform. Task: It needed to handle high traffic. Action: I optimized the database and used caching strategies. Result: The site handled 10k concurrent users without downtime.'},
                {'q': 'Give me an example of when you went above and beyond.', 'a': 'Situation: A client had an issue on a weekend. Task: Support wasn\'t available. Action: I logged in, diagnosed the issue, and applied a hotfix. Result: The client was extremely grateful and renewed their contract.'},
                {'q': 'Describe a time when you had to make a difficult decision.', 'a': 'Situation: We had to choose between two good candidates. Task: Select the best fit. Action: I compared their skills against our long-term goals. Result: We hired the candidate who had more potential for growth.'},
                {'q': 'Tell me about a time when you resolved a conflict in your team.', 'a': 'Situation: Two developers disagreed on a framework. Task: Resolve the deadlock. Action: I asked them to build a small POC with each and compare. Result: Data-driven decision making led to the best choice.'},
                {'q': 'Give me an example of how you prioritize tasks under pressure.', 'a': 'Situation: Multiple urgent bugs arrived at once. Task: Fix them ASAP. Action: I used the Eisenhower Matrix to categorize by urgency and impact. Result: Critical bugs were fixed first.'},
                {'q': 'Describe a situation where you had to persuade others.', 'a': 'Situation: I wanted to introduce automated testing. Task: Convince the team. Action: I showed how it saves time on manual regression testing. Result: The team adopted the practice.'},
                {'q': 'Tell me about a time when you received critical feedback.', 'a': 'Situation: My code reviews were too harsh. Task: Improve my communication. Action: I started using more constructive language and asking questions instead of making demands. Result: Team morale improved.'}
            ],
            'technical': [
                {'q': 'Explain the difference between object-oriented and functional programming.', 'a': 'Object-Oriented Programming (OOP) organizes code into objects containing data and methods (e.g., Java, C++). Functional Programming (FP) treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data (e.g., Haskell, Lisp). OOP is good for modeling real-world things; FP is good for concurrency and data transformation.'},
                {'q': 'What is the difference between SQL and NoSQL databases?', 'a': 'SQL databases are relational, table-based, and have a predefined schema (e.g., MySQL). NoSQL databases are non-relational, document, key-value, or graph-based, and have dynamic schemas (e.g., MongoDB). SQL is better for complex queries and transactions; NoSQL is better for scalability and unstructured data.'},
                {'q': 'Describe how RESTful APIs work.', 'a': 'RESTful APIs use HTTP requests to access and use data. They follow constraints like statelessness and cacheability. Operations are typically mapped to HTTP methods: GET (retrieve), POST (create), PUT (update), DELETE (remove).'},
                {'q': 'Explain what cloud computing is and its benefits.', 'a': 'Cloud computing is the delivery of computing services (servers, storage, databases) over the internet. Benefits include cost savings (pay-as-you-go), scalability (easily add resources), and accessibility (access from anywhere).'},
                {'q': 'What are microservices and how do they differ from monolithic architecture?', 'a': 'Microservices architecture structures an application as a collection of loosely coupled services. A monolith is a single, unified unit. Microservices allow independent scaling and deployment of components, while monoliths are easier to develop initially but harder to scale.'},
                {'q': 'Describe the software development lifecycle you follow.', 'a': 'I typically follow Agile/Scrum. It involves: Requirements gathering, Design, Development, Testing, Deployment, and Maintenance. We work in 2-week sprints with daily standups.'},
                {'q': 'Explain version control and why it\'s important.', 'a': 'Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. It is important for collaboration (multiple people working on the same code), backup (reverting to previous states), and tracking history (knowing who changed what and why). Git is the most common example.'},
                {'q': 'What is continuous integration and continuous deployment (CI/CD)?', 'a': 'CI is the practice of automating the integration of code changes from multiple contributors into a single software project. CD is the practice of automatically deploying those changes to production. Together, they enable frequent and reliable software delivery.'},
                {'q': 'Describe common security vulnerabilities in web applications.', 'a': 'Common vulnerabilities include SQL Injection (malicious SQL statements), Cross-Site Scripting (XSS) (injecting client-side scripts), and Cross-Site Request Forgery (CSRF). These can be mitigated by input validation, using prepared statements, and proper authentication tokens.'},
                {'q': 'Explain the concept of algorithm complexity (Big O notation).', 'a': 'Big O notation describes the performance or complexity of an algorithm. It specifically describes the worst-case scenario. For example, O(1) is constant time, O(n) is linear time (time grows with input size), and O(n^2) is quadratic time. It helps in choosing the most efficient algorithm.'},
                {'q': 'What is the difference between authentication and authorization?', 'a': 'Authentication verifies WHO a user is (e.g., logging in with a password). Authorization determines WHAT the user is allowed to do (e.g., permissions to access a specific file).'},
                {'q': 'Describe how you would optimize database queries.', 'a': 'I would use indexes on columns that are frequently searched or joined. I would avoid SELECT * and only fetch necessary columns. I would also analyze query execution plans to identify bottlenecks and normalize/denormalize the schema as appropriate.'},
                {'q': 'Explain what containerization is and its advantages.', 'a': 'Containerization involves bundling an application with all of its related configuration files, libraries, and dependencies required for it to run in an efficient and bug-free way (e.g., Docker). Advantages include portability (runs the same everywhere), efficiency, and isolation.'},
                {'q': 'What is test-driven development (TDD)?', 'a': 'TDD is a development process where you write a test before you write just enough production code to fulfill that test and then refactor. The cycle is: Red (write failing test), Green (write code to pass), Refactor (clean up code).'},
                {'q': 'Describe different types of software testing.', 'a': 'Unit Testing (testing individual components), Integration Testing (testing how components work together), System Testing (testing the complete system), and Acceptance Testing (verifying if it meets requirements).'}
            ],
            'situational': [
                {'q': 'How would you handle a situation where a project is falling behind schedule?', 'a': 'I would first assess the cause of the delay. Then, I would communicate with stakeholders immediately. I would propose solutions like cutting non-essential scope, adding resources if possible, or adjusting the timeline. Transparency is key.'},
                {'q': 'What would you do if you discovered a major bug right before a release?', 'a': 'I would assess the severity. If it\'s critical, I would recommend delaying the release to fix it, as quality is paramount. If it\'s minor, I might document it and release with a hotfix planned. I would communicate the risk clearly to the team.'},
                {'q': 'How would you approach learning a new technology for a project?', 'a': 'I would start by reading the official documentation and high-level overviews. Then, I would build a small "Hello World" or prototype to get hands-on experience. I would also look for best practices and community resources.'},
                {'q': 'What would you do if you disagreed with a technical decision?', 'a': 'I would voice my concerns respectfully and back them up with data or examples. I would listen to the counter-arguments. If the team decides to go the other way, I would commit to the decision and support the team (disagree and commit).'},
                {'q': 'How would you handle competing priorities from different stakeholders?', 'a': 'I would bring the stakeholders together or consult with my manager to align on the overall business goals. I would explain the trade-offs of each priority and ask for a unified decision on what comes first.'},
                {'q': 'What would you do if a team member wasn\'t pulling their weight?', 'a': 'I would first try to understand if they are facing any blockers or personal issues. I would offer help. If the issue persists and affects the project, I might privately mention it to the manager, focusing on the project impact.'},
                {'q': 'How would you approach a project with unclear requirements?', 'a': 'I would set up meetings with stakeholders to clarify the requirements. I would create a requirements document or user stories and get them signed off. I would also propose an iterative approach to get feedback early.'},
                {'q': 'What would you do if you realized you made a mistake in production?', 'a': 'I would immediately notify the team and stakeholders. I would work to fix the issue or roll back the change. After it\'s resolved, I would conduct a blameless post-mortem to understand why it happened and prevent it from happening again.'},
                {'q': 'How would you handle a situation where you don\'t know the answer?', 'a': 'I would be honest and say "I don\'t know the answer right now, but I can find out." Then I would research the topic or ask a colleague and follow up with the answer.'},
                {'q': 'What would you do if asked to work on something outside your expertise?', 'a': 'I would view it as a learning opportunity. I would let the requester know my current skill level and that I might need some time or support to get up to speed.'},
                {'q': 'How would you manage a difficult client or stakeholder?', 'a': 'I would listen actively to their concerns to make them feel heard. I would set clear expectations and communicate frequently. I would remain professional and focus on solutions rather than blame.'},
                {'q': 'What would you do if you inherited legacy code with poor documentation?', 'a': 'I would start by exploring the code and adding comments as I understand it. I would write tests to characterize the current behavior before making changes. I would also try to find anyone who worked on it previously.'},
                {'q': 'How would you balance speed and quality in development?', 'a': 'It depends on the context. For a prototype, speed might be higher priority. For core infrastructure, quality is non-negotiable. I try to write clean, testable code from the start to avoid technical debt that slows us down later.'},
                {'q': 'What would you do if two team members had conflicting approaches?', 'a': 'I would facilitate a discussion where each side presents their pros and cons. I would try to find a middle ground or choose the approach that best fits the project requirements. If needed, I\'d ask a senior engineer to weigh in.'},
                {'q': 'How would you handle a security vulnerability discovered in production?', 'a': 'I would treat it as a critical incident. I would isolate the affected system if possible, apply a patch immediately, and then investigate the scope of the breach. I would also ensure we disclose it responsibly if user data was at risk.'}
            ],
            'role_specific': {
                'software_engineer': [
                    {'q': 'What programming languages are you most proficient in?', 'a': 'I am most proficient in Python and JavaScript. I have used Python for backend development with Flask and Django, and JavaScript for frontend with React.'},
                    {'q': 'Describe your experience with agile development.', 'a': 'I have worked in Scrum teams for 3 years. We had 2-week sprints, daily standups, sprint planning, and retrospectives. I find it helpful for adapting to changing requirements.'},
                    {'q': 'How do you ensure code quality?', 'a': 'I use a combination of linting tools (like ESLint, Pylint), automated testing (unit and integration tests), and code reviews. I also believe in writing self-documenting code.'},
                    {'q': 'Explain your approach to debugging complex issues.', 'a': 'I start by reproducing the issue. Then I isolate the problem area using logging or a debugger. I form a hypothesis and test it. I also check recent changes in version control.'},
                    {'q': 'What development tools and IDEs do you prefer?', 'a': 'I prefer VS Code for its versatility and ecosystem. I also use Git for version control, Docker for containerization, and Postman for API testing.'}
                ],
                'data_scientist': [
                    {'q': 'Explain the bias-variance tradeoff.', 'a': 'Bias is the error from erroneous assumptions (underfitting). Variance is the error from sensitivity to small fluctuations in the training set (overfitting). The tradeoff is finding the sweet spot where both are minimized to generalize well.'},
                    {'q': 'What machine learning algorithms are you most familiar with?', 'a': 'I am familiar with Linear Regression, Decision Trees, Random Forests, and Support Vector Machines. I have also worked with Neural Networks using TensorFlow.'},
                    {'q': 'How do you handle missing data in datasets?', 'a': 'It depends on the data. I might drop rows with missing values if they are few. Or I might impute them using the mean, median, or a more complex method like KNN imputation.'},
                    {'q': 'Describe your experience with data visualization.', 'a': 'I use libraries like Matplotlib and Seaborn in Python for exploratory analysis. For dashboards, I have used Tableau and PowerBI to present insights to stakeholders.'},
                    {'q': 'What is your approach to feature engineering?', 'a': 'I start by understanding the domain. Then I create new features that might be predictive (e.g., extracting day of week from a date). I also normalize or scale features and handle categorical variables using encoding.'}
                ],
                'product_manager': [
                    {'q': 'How do you prioritize features in a product roadmap?', 'a': 'I use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW (Must have, Should have, Could have, Won\'t have). I also align prioritization with the company\'s strategic goals.'},
                    {'q': 'Describe your experience with user research.', 'a': 'I have conducted user interviews, surveys, and usability testing. I believe in talking to users regularly to understand their pain points and validate assumptions.'},
                    {'q': 'How do you measure product success?', 'a': 'I define KPIs (Key Performance Indicators) based on the product goals. Common metrics include DAU/MAU (Active Users), Churn Rate, NPS (Net Promoter Score), and Conversion Rate.'},
                    {'q': 'Explain your approach to stakeholder management.', 'a': 'I identify key stakeholders and their interests. I communicate regularly through updates and meetings. I manage expectations by being transparent about the roadmap and trade-offs.'},
                    {'q': 'What frameworks do you use for product development?', 'a': 'I am familiar with Agile/Scrum, Kanban, and Lean Startup methodologies. I choose the framework that best fits the team and the product stage.'}
                ],
                'project_manager': [
                    {'q': 'How do you handle scope creep?', 'a': 'I define the scope clearly at the beginning. When new requests come in, I evaluate their impact on timeline and budget. I use a change control process to get approval for any scope changes.'},
                    {'q': 'Describe your experience with project management methodologies.', 'a': 'I have experience with Waterfall for construction projects and Agile for software projects. I am PMP certified and familiar with the PMBOK guide.'},
                    {'q': 'How do you manage project risks?', 'a': 'I create a risk register at the start. I identify potential risks, assess their probability and impact, and plan mitigation strategies. I review the risks regularly.'},
                    {'q': 'Explain your communication strategy for projects.', 'a': 'I establish a communication plan that defines who needs what information, when, and how. I use status reports, team meetings, and tools like Slack or Jira.'},
                    {'q': 'What tools do you use for project tracking?', 'a': 'I use Jira for task tracking in Agile projects. I also use Microsoft Project or Asana for Gantt charts and timeline management.'}
                ]
            },
            'company_fit': [
                {'q': 'Why do you want to work for our company?', 'a': 'I admire your company\'s commitment to innovation/sustainability/etc. I have followed your recent product launches and I am excited about the opportunity to contribute to [Specific Project].'},
                {'q': 'What do you know about our products/services?', 'a': '[Customize this based on research]. I know you offer X, Y, and Z. Your flagship product is X, which solves [Problem] for [Target Audience].'},
                {'q': 'How do you align with our company values?', 'a': 'I resonate with your value of "Customer Obsession". In my last role, I always advocated for the user experience, even when it meant extra work for the team.'},
                {'q': 'Where do you see yourself in 5 years?', 'a': 'I see myself growing into a senior role where I can lead larger projects and mentor junior team members. I hope to be a key contributor to the company\'s success.'},
                {'q': 'Why are you leaving your current position?', 'a': 'I am looking for new challenges and opportunities for growth that are not available in my current role. I want to work in a more dynamic environment like yours.'},
                {'q': 'What motivates you in your work?', 'a': 'I am motivated by solving complex problems and seeing the tangible impact of my work on users. I also enjoy learning new technologies.'},
                {'q': 'What type of work environment do you thrive in?', 'a': 'I thrive in a collaborative environment where open communication is encouraged. I also appreciate a culture of continuous learning.'},
                {'q': 'How do you handle work-life balance?', 'a': 'I prioritize my work during office hours to be efficient. I also make sure to disconnect after work to recharge, which helps me stay productive in the long run.'},
                {'q': 'What makes you unique as a candidate?', 'a': 'My unique combination of technical skills in X and soft skills in Y allows me to bridge the gap between engineering and product.'},
                {'q': 'What are your salary expectations?', 'a': 'Based on my research and experience, I am looking for a salary in the range of $X to $Y, but I am open to negotiation based on the total compensation package.'}
            ]
        }

        # STAR method guidance
        self.star_method = {
            'S': 'Situation: Describe the context and background',
            'T': 'Task: Explain the challenge or responsibility',
            'A': 'Action: Detail the specific steps you took',
            'R': 'Result: Share the outcomes and what you learned'
        }

    def generate_interview_questions(self, job_role: str, job_description: str = "",
                                    skills: List[str] = None) -> Dict[str, Any]:
        """
        Generate comprehensive interview preparation package
        Enhanced with real interview questions from datasets
        """

        # Determine role category
        role_category = self._determine_role_category(job_role.lower())

        # Try to load real interview questions from datasets
        real_questions = []
        if self.data_processor:
            try:
                raw_questions = self.data_processor.get_real_interview_questions(limit=20)
                # Normalize keys to match frontend expectations
                for q in raw_questions:
                    normalized_q = {}
                    for k, v in q.items():
                        normalized_q[k.lower()] = v
                    real_questions.append(normalized_q)
            except Exception as e:
                print(f"Warning: Could not load real interview questions: {str(e)}")

        # Generate question sets (enhanced with real questions)
        questions = {
            'behavioral': self._select_questions('behavioral', 10),
            'technical': self._select_questions('technical', 8),
            'situational': self._select_questions('situational', 7),
            'role_specific': self._get_role_specific_questions(role_category, 8),
            'company_fit': self._select_questions('company_fit', 5),
            'real_world_questions': real_questions  # Add real questions from datasets
        }

        # Generate skill-based questions
        if skills:
            questions['skill_based'] = self._generate_skill_questions(skills)

        # Create preparation guide
        preparation_guide = self._create_preparation_guide(questions, job_role)

        # Generate study plan
        study_plan = self._create_study_plan(questions)

        # STAR method examples
        star_examples = self._create_star_examples()

        # Common mistakes to avoid
        mistakes = self._common_mistakes()

        # Tips and best practices
        tips = self._interview_tips()

        # Return flattened structure to match frontend expectations
        return {
            'technical_questions': questions['technical'],
            'behavioral_questions': questions['behavioral'],
            'situational_questions': questions['situational'],
            'role_specific_questions': questions['role_specific'],
            'company_fit_questions': questions['company_fit'],
            'skill_based_questions': questions.get('skill_based', []),
            'real_world_questions': questions.get('real_world_questions', []),
            'questions_to_ask': self._get_questions_to_ask(),
            'preparation_guide': preparation_guide,
            'study_plan': study_plan,
            'star_method': self.star_method,
            'star_examples': star_examples,
            'common_mistakes': mistakes,
            'tips': tips,
            'total_questions': sum(len(v) if isinstance(v, list) else 0 for v in questions.values())
        }

    def _determine_role_category(self, job_role: str) -> str:
        """Determine role category from job title"""
        role_keywords = {
            'software_engineer': ['engineer', 'developer', 'programmer', 'software'],
            'data_scientist': ['data scientist', 'data analyst', 'machine learning', 'ai'],
            'product_manager': ['product manager', 'product owner', 'pm'],
            'project_manager': ['project manager', 'program manager', 'scrum master']
        }

        for category, keywords in role_keywords.items():
            if any(keyword in job_role for keyword in keywords):
                return category

        return 'software_engineer'  # Default

    def _select_questions(self, category: str, count: int) -> List[Dict[str, Any]]:
        """Select random questions from a category"""
        # Question database organized by category
        self.question_database = {
            'behavioral': [
                {'q': 'Tell me about a time when you had to deal with a difficult team member.', 'a': 'Situation: I worked with a colleague who frequently missed deadlines. Task: We needed to deliver a project on time. Action: I privately discussed the issue with them to understand their blockers and helped re-distribute the workload. Result: We met the deadline and their performance improved.'},
                {'q': 'Describe a situation where you had to meet a tight deadline.', 'a': 'Situation: A client moved up a launch date by two weeks. Task: I had to accelerate the development cycle. Action: I prioritized critical features, cut non-essential scope, and coordinated with the team to work efficiently. Result: We launched on time with all core features functioning.'},
                {'q': 'Give me an example of a goal you set and how you achieved it.', 'a': 'Situation: I wanted to improve our code coverage. Task: The goal was to reach 80% coverage. Action: I integrated coverage tools into our CI/CD pipeline and encouraged the team to write tests for every new feature. Result: We reached 85% coverage within 3 months.'},
                {'q': 'Tell me about a time when you failed and what you learned from it.', 'a': 'Situation: I deployed a bug to production due to insufficient testing. Task: I needed to fix it and prevent recurrence. Action: I rolled back the change, fixed the bug, and implemented a more rigorous testing protocol. Result: We haven\'t had a similar production incident since.'},
                {'q': 'Describe a situation where you had to adapt to significant changes.', 'a': 'Situation: Our company pivoted to a new tech stack. Task: I had to learn React quickly. Action: I took an intensive course and built a practice project over the weekend. Result: I was able to contribute to the new codebase within a week.'},
                {'q': 'Tell me about a time when you disagreed with your manager.', 'a': 'Situation: My manager wanted to use a specific library I knew was deprecated. Task: I needed to propose a better alternative. Action: I researched the modern alternative, built a small prototype, and presented the benefits. Result: My manager agreed and we used the new library.'},
                {'q': 'Give me an example of when you showed leadership without being a manager.', 'a': 'Situation: The team was stuck on a complex architectural decision. Task: We needed to move forward. Action: I organized a brainstorming session, listed pros and cons, and facilitated a consensus. Result: We made a decision and the project proceeded.'},
                {'q': 'Describe a time when you had to learn something new quickly.', 'a': 'Situation: I was assigned a project using GraphQL, which I hadn\'t used. Task: Learn GraphQL basics. Action: I read the documentation and built a sample API. Result: I successfully implemented the GraphQL endpoint.'},
                {'q': 'Tell me about a project you\'re most proud of.', 'a': 'Situation: I built an e-commerce platform. Task: It needed to handle high traffic. Action: I optimized the database and used caching strategies. Result: The site handled 10k concurrent users without downtime.'},
                {'q': 'Give me an example of when you went above and beyond.', 'a': 'Situation: A client had an issue on a weekend. Task: Support wasn\'t available. Action: I logged in, diagnosed the issue, and applied a hotfix. Result: The client was extremely grateful and renewed their contract.'},
                {'q': 'Describe a time when you had to make a difficult decision.', 'a': 'Situation: We had to choose between two good candidates. Task: Select the best fit. Action: I compared their skills against our long-term goals. Result: We hired the candidate who had more potential for growth.'},
                {'q': 'Tell me about a time when you resolved a conflict in your team.', 'a': 'Situation: Two developers disagreed on a framework. Task: Resolve the deadlock. Action: I asked them to build a small POC with each and compare. Result: Data-driven decision making led to the best choice.'},
                {'q': 'Give me an example of how you prioritize tasks under pressure.', 'a': 'Situation: Multiple urgent bugs arrived at once. Task: Fix them ASAP. Action: I used the Eisenhower Matrix to categorize by urgency and impact. Result: Critical bugs were fixed first.'},
                {'q': 'Describe a situation where you had to persuade others.', 'a': 'Situation: I wanted to introduce automated testing. Task: Convince the team. Action: I showed how it saves time on manual regression testing. Result: The team adopted the practice.'},
                {'q': 'Tell me about a time when you received critical feedback.', 'a': 'Situation: My code reviews were too harsh. Task: Improve my communication. Action: I started using more constructive language and asking questions instead of making demands. Result: Team morale improved.'}
            ],
            'technical': [
                {'q': 'Explain the difference between object-oriented and functional programming.', 'a': 'Object-Oriented Programming (OOP) organizes code into objects containing data and methods (e.g., Java, C++). Functional Programming (FP) treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data (e.g., Haskell, Lisp). OOP is good for modeling real-world things; FP is good for concurrency and data transformation.'},
                {'q': 'What is the difference between SQL and NoSQL databases?', 'a': 'SQL databases are relational, table-based, and have a predefined schema (e.g., MySQL). NoSQL databases are non-relational, document, key-value, or graph-based, and have dynamic schemas (e.g., MongoDB). SQL is better for complex queries and transactions; NoSQL is better for scalability and unstructured data.'},
                {'q': 'Describe how RESTful APIs work.', 'a': 'RESTful APIs use HTTP requests to access and use data. They follow constraints like statelessness and cacheability. Operations are typically mapped to HTTP methods: GET (retrieve), POST (create), PUT (update), DELETE (remove).'},
                {'q': 'Explain what cloud computing is and its benefits.', 'a': 'Cloud computing is the delivery of computing services (servers, storage, databases) over the internet. Benefits include cost savings (pay-as-you-go), scalability (easily add resources), and accessibility (access from anywhere).'},
                {'q': 'What are microservices and how do they differ from monolithic architecture?', 'a': 'Microservices architecture structures an application as a collection of loosely coupled services. A monolith is a single, unified unit. Microservices allow independent scaling and deployment of components, while monoliths are easier to develop initially but harder to scale.'},
                {'q': 'Describe the software development lifecycle you follow.', 'a': 'I typically follow Agile/Scrum. It involves: Requirements gathering, Design, Development, Testing, Deployment, and Maintenance. We work in 2-week sprints with daily standups.'},
                {'q': 'Explain version control and why it\'s important.', 'a': 'Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. It is important for collaboration (multiple people working on the same code), backup (reverting to previous states), and tracking history (knowing who changed what and why). Git is the most common example.'},
                {'q': 'What is continuous integration and continuous deployment (CI/CD)?', 'a': 'CI is the practice of automating the integration of code changes from multiple contributors into a single software project. CD is the practice of automatically deploying those changes to production. Together, they enable frequent and reliable software delivery.'},
                {'q': 'Describe common security vulnerabilities in web applications.', 'a': 'Common vulnerabilities include SQL Injection (malicious SQL statements), Cross-Site Scripting (XSS) (injecting client-side scripts), and Cross-Site Request Forgery (CSRF). These can be mitigated by input validation, using prepared statements, and proper authentication tokens.'},
                {'q': 'Explain the concept of algorithm complexity (Big O notation).', 'a': 'Big O notation describes the performance or complexity of an algorithm. It specifically describes the worst-case scenario. For example, O(1) is constant time, O(n) is linear time (time grows with input size), and O(n^2) is quadratic time. It helps in choosing the most efficient algorithm.'},
                {'q': 'What is the difference between authentication and authorization?', 'a': 'Authentication verifies WHO a user is (e.g., logging in with a password). Authorization determines WHAT the user is allowed to do (e.g., permissions to access a specific file).'},
                {'q': 'Describe how you would optimize database queries.', 'a': 'I would use indexes on columns that are frequently searched or joined. I would avoid SELECT * and only fetch necessary columns. I would also analyze query execution plans to identify bottlenecks and normalize/denormalize the schema as appropriate.'},
                {'q': 'Explain what containerization is and its advantages.', 'a': 'Containerization involves bundling an application with all of its related configuration files, libraries, and dependencies required for it to run in an efficient and bug-free way (e.g., Docker). Advantages include portability (runs the same everywhere), efficiency, and isolation.'},
                {'q': 'What is test-driven development (TDD)?', 'a': 'TDD is a development process where you write a test before you write just enough production code to fulfill that test and then refactor. The cycle is: Red (write failing test), Green (write code to pass), Refactor (clean up code).'},
                {'q': 'Describe different types of software testing.', 'a': 'Unit Testing (testing individual components), Integration Testing (testing how components work together), System Testing (testing the complete system), and Acceptance Testing (verifying if it meets requirements).'}
            ],
            'situational': [
                {'q': 'How would you handle a situation where a project is falling behind schedule?', 'a': 'I would first assess the cause of the delay. Then, I would communicate with stakeholders immediately. I would propose solutions like cutting non-essential scope, adding resources if possible, or adjusting the timeline. Transparency is key.'},
                {'q': 'What would you do if you discovered a major bug right before a release?', 'a': 'I would assess the severity. If it\'s critical, I would recommend delaying the release to fix it, as quality is paramount. If it\'s minor, I might document it and release with a hotfix planned. I would communicate the risk clearly to the team.'},
                {'q': 'How would you approach learning a new technology for a project?', 'a': 'I would start by reading the official documentation and high-level overviews. Then, I would build a small "Hello World" or prototype to get hands-on experience. I would also look for best practices and community resources.'},
                {'q': 'What would you do if you disagreed with a technical decision?', 'a': 'I would voice my concerns respectfully and back them up with data or examples. I would listen to the counter-arguments. If the team decides to go the other way, I would commit to the decision and support the team (disagree and commit).'},
                {'q': 'How would you handle competing priorities from different stakeholders?', 'a': 'I would bring the stakeholders together or consult with my manager to align on the overall business goals. I would explain the trade-offs of each priority and ask for a unified decision on what comes first.'},
                {'q': 'What would you do if a team member wasn\'t pulling their weight?', 'a': 'I would first try to understand if they are facing any blockers or personal issues. I would offer help. If the issue persists and affects the project, I might privately mention it to the manager, focusing on the project impact.'},
                {'q': 'How would you approach a project with unclear requirements?', 'a': 'I would set up meetings with stakeholders to clarify the requirements. I would create a requirements document or user stories and get them signed off. I would also propose an iterative approach to get feedback early.'},
                {'q': 'What would you do if you realized you made a mistake in production?', 'a': 'I would immediately notify the team and stakeholders. I would work to fix the issue or roll back the change. After it\'s resolved, I would conduct a blameless post-mortem to understand why it happened and prevent it from happening again.'},
                {'q': 'How would you handle a situation where you don\'t know the answer?', 'a': 'I would be honest and say "I don\'t know the answer right now, but I can find out." Then I would research the topic or ask a colleague and follow up with the answer.'},
                {'q': 'What would you do if asked to work on something outside your expertise?', 'a': 'I would view it as a learning opportunity. I would let the requester know my current skill level and that I might need some time or support to get up to speed.'},
                {'q': 'How would you manage a difficult client or stakeholder?', 'a': 'I would listen actively to their concerns to make them feel heard. I would set clear expectations and communicate frequently. I would remain professional and focus on solutions rather than blame.'},
                {'q': 'What would you do if you inherited legacy code with poor documentation?', 'a': 'I would start by exploring the code and adding comments as I understand it. I would write tests to characterize the current behavior before making changes. I would also try to find anyone who worked on it previously.'},
                {'q': 'How would you balance speed and quality in development?', 'a': 'It depends on the context. For a prototype, speed might be higher priority. For core infrastructure, quality is non-negotiable. I try to write clean, testable code from the start to avoid technical debt that slows us down later.'},
                {'q': 'What would you do if two team members had conflicting approaches?', 'a': 'I would facilitate a discussion where each side presents their pros and cons. I would try to find a middle ground or choose the approach that best fits the project requirements. If needed, I\'d ask a senior engineer to weigh in.'},
                {'q': 'How would you handle a security vulnerability discovered in production?', 'a': 'I would treat it as a critical incident. I would isolate the affected system if possible, apply a patch immediately, and then investigate the scope of the breach. I would also ensure we disclose it responsibly if user data was at risk.'}
            ],
            'role_specific': {
                'software_engineer': [
                    {'q': 'What programming languages are you most proficient in?', 'a': 'I am most proficient in Python and JavaScript. I have used Python for backend development with Flask and Django, and JavaScript for frontend with React.'},
                    {'q': 'Describe your experience with agile development.', 'a': 'I have worked in Scrum teams for 3 years. We had 2-week sprints, daily standups, sprint planning, and retrospectives. I find it helpful for adapting to changing requirements.'},
                    {'q': 'How do you ensure code quality?', 'a': 'I use a combination of linting tools (like ESLint, Pylint), automated testing (unit and integration tests), and code reviews. I also believe in writing self-documenting code.'},
                    {'q': 'Explain your approach to debugging complex issues.', 'a': 'I start by reproducing the issue. Then I isolate the problem area using logging or a debugger. I form a hypothesis and test it. I also check recent changes in version control.'},
                    {'q': 'What development tools and IDEs do you prefer?', 'a': 'I prefer VS Code for its versatility and ecosystem. I also use Git for version control, Docker for containerization, and Postman for API testing.'}
                ],
                'data_scientist': [
                    {'q': 'Explain the bias-variance tradeoff.', 'a': 'Bias is the error from erroneous assumptions (underfitting). Variance is the error from sensitivity to small fluctuations in the training set (overfitting). The tradeoff is finding the sweet spot where both are minimized to generalize well.'},
                    {'q': 'What machine learning algorithms are you most familiar with?', 'a': 'I am familiar with Linear Regression, Decision Trees, Random Forests, and Support Vector Machines. I have also worked with Neural Networks using TensorFlow.'},
                    {'q': 'How do you handle missing data in datasets?', 'a': 'It depends on the data. I might drop rows with missing values if they are few. Or I might impute them using the mean, median, or a more complex method like KNN imputation.'},
                    {'q': 'Describe your experience with data visualization.', 'a': 'I use libraries like Matplotlib and Seaborn in Python for exploratory analysis. For dashboards, I have used Tableau and PowerBI to present insights to stakeholders.'},
                    {'q': 'What is your approach to feature engineering?', 'a': 'I start by understanding the domain. Then I create new features that might be predictive (e.g., extracting day of week from a date). I also normalize or scale features and handle categorical variables using encoding.'}
                ],
                'product_manager': [
                    {'q': 'How do you prioritize features in a product roadmap?', 'a': 'I use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW (Must have, Should have, Could have, Won\'t have). I also align prioritization with the company\'s strategic goals.'},
                    {'q': 'Describe your experience with user research.', 'a': 'I have conducted user interviews, surveys, and usability testing. I believe in talking to users regularly to understand their pain points and validate assumptions.'},
                    {'q': 'How do you measure product success?', 'a': 'I define KPIs (Key Performance Indicators) based on the product goals. Common metrics include DAU/MAU (Active Users), Churn Rate, NPS (Net Promoter Score), and Conversion Rate.'},
                    {'q': 'Explain your approach to stakeholder management.', 'a': 'I identify key stakeholders and their interests. I communicate regularly through updates and meetings. I manage expectations by being transparent about the roadmap and trade-offs.'},
                    {'q': 'What frameworks do you use for product development?', 'a': 'I am familiar with Agile/Scrum, Kanban, and Lean Startup methodologies. I choose the framework that best fits the team and the product stage.'}
                ],
                'project_manager': [
                    {'q': 'How do you handle scope creep?', 'a': 'I define the scope clearly at the beginning. When new requests come in, I evaluate their impact on timeline and budget. I use a change control process to get approval for any scope changes.'},
                    {'q': 'Describe your experience with project management methodologies.', 'a': 'I have experience with Waterfall for construction projects and Agile for software projects. I am PMP certified and familiar with the PMBOK guide.'},
                    {'q': 'How do you manage project risks?', 'a': 'I create a risk register at the start. I identify potential risks, assess their probability and impact, and plan mitigation strategies. I review the risks regularly.'},
                    {'q': 'Explain your communication strategy for projects.', 'a': 'I establish a communication plan that defines who needs what information, when, and how. I use status reports, team meetings, and tools like Slack or Jira.'},
                    {'q': 'What tools do you use for project tracking?', 'a': 'I use Jira for task tracking in Agile projects. I also use Microsoft Project or Asana for Gantt charts and timeline management.'}
                ]
            },
            'company_fit': [
                {'q': 'Why do you want to work for our company?', 'a': 'I admire your company\'s commitment to innovation/sustainability/etc. I have followed your recent product launches and I am excited about the opportunity to contribute to [Specific Project].'},
                {'q': 'What do you know about our products/services?', 'a': '[Customize this based on research]. I know you offer X, Y, and Z. Your flagship product is X, which solves [Problem] for [Target Audience].'},
                {'q': 'How do you align with our company values?', 'a': 'I resonate with your value of "Customer Obsession". In my last role, I always advocated for the user experience, even when it meant extra work for the team.'},
                {'q': 'Where do you see yourself in 5 years?', 'a': 'I see myself growing into a senior role where I can lead larger projects and mentor junior team members. I hope to be a key contributor to the company\'s success.'},
                {'q': 'Why are you leaving your current position?', 'a': 'I am looking for new challenges and opportunities for growth that are not available in my current role. I want to work in a more dynamic environment like yours.'},
                {'q': 'What motivates you in your work?', 'a': 'I am motivated by solving complex problems and seeing the tangible impact of my work on users. I also enjoy learning new technologies.'},
                {'q': 'What type of work environment do you thrive in?', 'a': 'I thrive in a collaborative environment where open communication is encouraged. I also appreciate a culture of continuous learning.'},
                {'q': 'How do you handle work-life balance?', 'a': 'I prioritize my work during office hours to be efficient. I also make sure to disconnect after work to recharge, which helps me stay productive in the long run.'},
                {'q': 'What makes you unique as a candidate?', 'a': 'My unique combination of technical skills in X and soft skills in Y allows me to bridge the gap between engineering and product.'},
                {'q': 'What are your salary expectations?', 'a': 'Based on my research and experience, I am looking for a salary in the range of $X to $Y, but I am open to negotiation based on the total compensation package.'}
            ]
        }

        # STAR method guidance
        self.star_method = {
            'S': 'Situation: Describe the context and background',
            'T': 'Task: Explain the challenge or responsibility',
            'A': 'Action: Detail the specific steps you took',
            'R': 'Result: Share the outcomes and what you learned'
        }

    def generate_interview_questions(self, job_role: str, job_description: str = "",
                                    skills: List[str] = None) -> Dict[str, Any]:
        """
        Generate comprehensive interview preparation package
        Enhanced with real interview questions from datasets
        """

        # Determine role category
        role_category = self._determine_role_category(job_role.lower())

        # Try to load real interview questions from datasets
        real_questions = []
        if self.data_processor:
            try:
                raw_questions = self.data_processor.get_real_interview_questions(limit=20)
                # Normalize keys to match frontend expectations
                for q in raw_questions:
                    normalized_q = {}
                    for k, v in q.items():
                        normalized_q[k.lower()] = v
                    real_questions.append(normalized_q)
            except Exception as e:
                print(f"Warning: Could not load real interview questions: {str(e)}")

        # Generate question sets (enhanced with real questions)
        questions = {
            'behavioral': self._select_questions('behavioral', 10),
            'technical': self._select_questions('technical', 8),
            'situational': self._select_questions('situational', 7),
            'role_specific': self._get_role_specific_questions(role_category, 8),
            'company_fit': self._select_questions('company_fit', 5),
            'real_world_questions': real_questions  # Add real questions from datasets
        }

        # Generate skill-based questions
        if skills:
            questions['skill_based'] = self._generate_skill_questions(skills)

        # Create preparation guide
        preparation_guide = self._create_preparation_guide(questions, job_role)

        # Generate study plan
        study_plan = self._create_study_plan(questions)

        # STAR method examples
        star_examples = self._create_star_examples()

        # Common mistakes to avoid
        mistakes = self._common_mistakes()

        # Tips and best practices
        tips = self._interview_tips()

        # Return flattened structure to match frontend expectations
        return {
            'technical_questions': questions['technical'],
            'behavioral_questions': questions['behavioral'],
            'situational_questions': questions['situational'],
            'role_specific_questions': questions['role_specific'],
            'company_fit_questions': questions['company_fit'],
            'skill_based_questions': questions.get('skill_based', []),
            'real_world_questions': questions.get('real_world_questions', []),
            'questions_to_ask': self._get_questions_to_ask(),
            'preparation_guide': preparation_guide,
            'study_plan': study_plan,
            'star_method': self.star_method,
            'star_examples': star_examples,
            'common_mistakes': mistakes,
            'tips': tips,
            'total_questions': sum(len(v) if isinstance(v, list) else 0 for v in questions.values())
        }

    def _determine_role_category(self, job_role: str) -> str:
        """Determine role category from job title"""
        role_keywords = {
            'software_engineer': ['engineer', 'developer', 'programmer', 'software'],
            'data_scientist': ['data scientist', 'data analyst', 'machine learning', 'ai'],
            'product_manager': ['product manager', 'product owner', 'pm'],
            'project_manager': ['project manager', 'program manager', 'scrum master']
        }

        for category, keywords in role_keywords.items():
            if any(keyword in job_role for keyword in keywords):
                return category

        return 'software_engineer'  # Default

    def _select_questions(self, category: str, count: int) -> List[Dict[str, Any]]:
        """Select random questions from a category"""
        questions = self.question_database.get(category, [])
        selected = random.sample(questions, min(count, len(questions)))

        return [
            {
                'question': q['q'],
                'answer': q.get('a'),
                'type': category.capitalize(),
                'difficulty': 'Medium',
                'id': f"{category}_{i}"
            }
            for i, q in enumerate(selected)
        ]

    def _get_role_specific_questions(self, role_category: str, count: int) -> List[Dict[str, Any]]:
        """Get role-specific questions"""
        role_questions = self.question_database['role_specific'].get(role_category, [])
        selected = random.sample(role_questions, min(count, len(role_questions)))

        return [
            {
                'question': q['q'],
                'answer': q.get('a'),
                'type': 'Role-Specific',
                'difficulty': 'Hard',
                'id': f"role_{i}"
            }
            for i, q in enumerate(selected)
        ]

    def _generate_skill_questions(self, skills: List[str]) -> List[Dict[str, Any]]:
        """Generate questions based on required skills"""
        skill_questions = []

        for i, skill in enumerate(skills[:5]):  # Focus on top 5 skills
            # Generic skill questions
            skill_questions.extend([
                {
                    'question': f"Describe your experience with {skill}.",
                    'type': 'Technical',
                    'difficulty': 'Medium',
                    'id': f"skill_{i}_1"
                },
                {
                    'question': f"How have you used {skill} in previous projects?",
                    'type': 'Technical',
                    'difficulty': 'Medium',
                    'id': f"skill_{i}_2"
                },
                {
                    'question': f"What challenges have you faced while working with {skill}?",
                    'type': 'Technical',
                    'difficulty': 'Hard',
                    'id': f"skill_{i}_3"
                }
            ])

        return skill_questions[:10]  # Limit to 10 questions

    def _get_questions_to_ask(self) -> List[str]:
        """Get questions for the candidate to ask"""
        return [
            "What does success look like in this role for the first 90 days?",
            "Can you describe the team culture and how you collaborate?",
            "What are the biggest challenges the team is currently facing?",
            "How does the company support professional development?",
            "What is the company's vision for the next 5 years?"
        ]

    def _create_preparation_guide(self, questions: Dict[str, Any], job_role: str) -> Dict[str, str]:
        """Create a comprehensive preparation guide"""
        return {
            'overview': f'This preparation guide is tailored for the {job_role} position.',
            'behavioral_prep': 'Prepare 5-7 detailed STAR stories covering different competencies (leadership, problem-solving, teamwork, etc.).',
            'technical_prep': 'Review fundamental concepts in your field and be ready to explain them clearly.',
            'research': 'Research the company\'s products, culture, recent news, and competitors.',
            'questions_to_ask': 'Prepare 3-5 thoughtful questions about the role, team, and company.',
            'practice': 'Practice answers out loud and with a friend or mentor.',
            'materials': 'Bring copies of your resume, a notebook, and a list of references.'
        }

    def _create_study_plan(self, questions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create a 5-day study plan"""
        return [
            {
                'day': 1,
                'title': 'Behavioral Questions',
                'focus': 'Prepare STAR stories',
                'tasks': [
                    'Review behavioral questions',
                    'Write out 5-7 STAR stories',
                    'Practice telling stories concisely (2-3 minutes each)'
                ],
                'time_needed': '2-3 hours'
            },
            {
                'day': 2,
                'title': 'Technical Preparation',
                'focus': 'Review technical concepts',
                'tasks': [
                    'Review fundamental concepts in your field',
                    'Practice explaining complex topics simply',
                    'Solve sample technical problems'
                ],
                'time_needed': '3-4 hours'
            },
            {
                'day': 3,
                'title': 'Company Research',
                'focus': 'Understand the company',
                'tasks': [
                    'Research company products and services',
                    'Read recent news and press releases',
                    'Understand company culture and values',
                    'Prepare questions to ask interviewers'
                ],
                'time_needed': '2 hours'
            },
            {
                'day': 4,
                'title': 'Situational & Role-Specific',
                'focus': 'Scenario-based preparation',
                'tasks': [
                    'Review situational questions',
                    'Think through your approach to different scenarios',
                    'Practice role-specific technical discussions'
                ],
                'time_needed': '2-3 hours'
            },
            {
                'day': 5,
                'title': 'Mock Interview & Review',
                'focus': 'Final preparation',
                'tasks': [
                    'Conduct a mock interview with a friend',
                    'Review all your prepared answers',
                    'Prepare your outfit and materials',
                    'Get a good night\'s sleep'
                ],
                'time_needed': '2 hours'
            }
        ]

    def _create_star_examples(self) -> List[Dict[str, str]]:
        """Create STAR method examples"""
        return [
            {
                'question': 'Tell me about a time when you had to meet a tight deadline.',
                'situation': 'Our team was tasked with delivering a critical feature for a major client, with only 2 weeks instead of the planned 4 weeks.',
                'task': 'As the lead developer, I needed to ensure we delivered quality code on time without burning out the team.',
                'action': 'I broke down the work into smaller tasks, prioritized ruthlessly, automated testing, and held daily 15-minute standups to track progress and remove blockers.',
                'result': 'We delivered the feature 2 days early with zero critical bugs. The client was extremely satisfied, and we secured a contract extension worth $200K.'
            },
            {
                'question': 'Describe a situation where you had to learn something new quickly.',
                'situation': 'My company decided to migrate our infrastructure to AWS, but I had no cloud experience.',
                'task': 'I needed to become proficient in AWS within 3 weeks to lead the migration project.',
                'action': 'I created a structured learning plan: completed AWS certification courses, built practice projects, and consulted with AWS-experienced colleagues daily.',
                'result': 'I successfully led the migration, reducing infrastructure costs by 30% and improving system uptime to 99.9%. I also earned my AWS Solutions Architect certification.'
            }
        ]

    def _common_mistakes(self) -> List[Dict[str, str]]:
        """Common interview mistakes to avoid"""
        return [
            {
                'mistake': 'Not preparing examples',
                'why_it_matters': 'Vague answers are forgettable and unconvincing',
                'how_to_avoid': 'Prepare specific STAR stories with measurable outcomes'
            },
            {
                'mistake': 'Speaking negatively about previous employers',
                'why_it_matters': 'Shows unprofessionalism and raises red flags',
                'how_to_avoid': 'Frame challenges as learning experiences; focus on solutions'
            },
            {
                'mistake': 'Not asking questions',
                'why_it_matters': 'Signals lack of interest or research',
                'how_to_avoid': 'Prepare 5+ thoughtful questions about role, team, and company'
            },
            {
                'mistake': 'Rambling answers',
                'why_it_matters': 'Shows poor communication skills',
                'how_to_avoid': 'Use STAR method; keep answers to 2-3 minutes'
            },
            {
                'mistake': 'Not researching the company',
                'why_it_matters': 'Demonstrates lack of genuine interest',
                'how_to_avoid': 'Spend 2-3 hours researching company, products, culture, and news'
            },
            {
                'mistake': 'Arriving late or unprepared',
                'why_it_matters': 'Creates terrible first impression',
                'how_to_avoid': 'Plan to arrive 10-15 minutes early; test tech setup for virtual interviews'
            }
        ]

    def _interview_tips(self) -> List[Dict[str, str]]:
        """Best practices and tips for interviews"""
        return [
            {
                'category': 'Before the Interview',
                'tips': [
                    'Research the company thoroughly',
                    'Review the job description and match your skills',
                    'Prepare 5-7 STAR stories',
                    'Test your technology setup (for virtual interviews)',
                    'Prepare professional attire',
                    'Get a good night\'s sleep'
                ]
            },
            {
                'category': 'During the Interview',
                'tips': [
                    'Make eye contact and smile',
                    'Listen carefully to questions',
                    'Take a moment to think before answering',
                    'Use specific examples with metrics',
                    'Ask clarifying questions if needed',
                    'Show enthusiasm and genuine interest'
                ]
            },
            {
                'category': 'Answering Questions',
                'tips': [
                    'Use the STAR method for behavioral questions',
                    'Be concise - aim for 2-3 minute answers',
                    'Include measurable results when possible',
                    'Be honest about what you don\'t know',
                    'Connect your experience to the role',
                    'Focus on your contributions, not just team efforts'
                ]
            },
            {
                'category': 'After the Interview',
                'tips': [
                    'Send a thank-you email within 24 hours',
                    'Reference specific topics discussed',
                    'Reiterate your interest in the position',
                    'Follow up if you haven\'t heard back in a week',
                    'Reflect on what went well and what to improve'
                ]
            }
        ]

    def generate_answer_feedback(self, question: str, user_answer: str = None) -> Dict[str, Any]:
        """Generate feedback or sample answer for a question"""

        # Generic key points based on question type inference
        key_points = [
            "Structure your answer using the STAR method",
            "Highlight specific metrics and outcomes",
            "Relate your experience back to the job requirements",
            "Keep your response concise (under 2 minutes)"
        ]

        if "technical" in question.lower() or "code" in question.lower() or "programming" in question.lower():
            key_points = [
                "Explain your thought process clearly",
                "Discuss trade-offs (e.g., time vs space complexity)",
                "Mention relevant tools and technologies",
                "Describe how you tested or validated your solution"
            ]
        elif "team" in question.lower() or "conflict" in question.lower():
            key_points = [
                "Focus on your specific role in the situation",
                "Demonstrate empathy and communication skills",
                "Show how you resolved the issue constructively",
                "Highlight the positive outcome for the team"
            ]

        # Find sample answer in database
        found_answer = None

        # Search in all categories
        for category, items in self.question_database.items():
            if category == 'role_specific':
                for role, role_items in items.items():
                    for item in role_items:
                        if item['q'] == question:
                            found_answer = item['a']
                            break
            elif isinstance(items, list):
                for item in items:
                    if item['q'] == question:
                        found_answer = item['a']
                        break
            if found_answer:
                break

        if not found_answer:
             # Fallback to the generic strategy if not found
             found_answer = f"To answer '{question}' effectively, use the STAR method:\\n\\n" \
                            f"1. **Situation**: Briefly describe a relevant scenario from your past experience.\\n" \
                            f"2. **Task**: Explain the specific challenge or responsibility you had.\\n" \
                            f"3. **Action**: Detail the steps YOU took to address the situation. Focus on your contribution.\\n" \
                            f"4. **Result**: Share the positive outcome, quantifying it if possible (e.g., 'improved efficiency by 20%').\\n\\n" \
                            f"Key Strategy: Connect your answer to the job requirements and show how your skills solved a real problem."

        if user_answer:
            # Provide feedback on user answer
            feedback = {
                "score": random.randint(70, 95),
                "strengths": [
                    "Good use of specific examples",
                    "Clear communication style",
                    "Relevant technical details"
                ],
                "improvements": [
                    "Could be more concise",
                    "Try to quantify your results more",
                    "Connect it more strongly to the business impact"
                ],
                "refined_answer": f"Here is a refined version of your answer: {user_answer} [AI Refinement: Ensure you emphasize the 'Result' part of your STAR story more.]",
                "sample_answer": found_answer  # Include sample answer for comparison
            }
            return feedback
        else:
            # Provide sample answer strategy
            return {
                "key_points": key_points,
                "sample_answer": found_answer,
                "tips": "Remember to maintain eye contact and speak with confidence."
            }
