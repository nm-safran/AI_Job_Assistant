import random
from datetime import datetime
from datasets.skills_dataset import SkillsDataset

class AdvancedCoverLetterGenerator:
    def __init__(self):
        self.skills_dataset = SkillsDataset()
        self.templates = self._load_templates()

    def _load_templates(self):
        """Load comprehensive cover letter templates"""
        return {
            'professional': [
                self._professional_template_1,
                self._professional_template_2
            ],
            'enthusiastic': [
                self._enthusiastic_template_1,
                self._enthusiastic_template_2
            ],
            'formal': [
                self._formal_template_1
            ],
            'conversational': [
                self._conversational_template_1,
                self._conversational_template_2
            ],
            'technical': [
                self._technical_template_1
            ],
            'creative': [
                self._creative_template_1
            ]
        }

    def generate_cover_letter(self, session_data, tone='professional', customizations=None):
        """Generate cover letter based on session data"""
        if customizations is None:
            customizations = {}

        resume_data = session_data['resume_data']
        job_data = session_data['job_data']
        analysis = session_data['analysis_results']

        # Select template based on tone
        template_func = random.choice(self.templates.get(tone, self.templates['professional']))

        # Generate cover letter
        cover_letter = template_func(resume_data, job_data, analysis, customizations)

        return {
            'content': cover_letter,
            'tone': tone,
            'customizations': customizations,
            'generated_at': datetime.now().isoformat(),
            'word_count': len(cover_letter.split())
        }

    def generate_all_cover_letters(self, session_data):
        """Generate cover letters in all tones for the session"""
        all_cover_letters = {}

        for tone in self.templates.keys():
            all_cover_letters[tone] = self.generate_cover_letter(session_data, tone)

        return all_cover_letters

    def _professional_template_1(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])
        experience = resume_data.get('experience', {}).get('years', 'relevant')
        education = resume_data.get('education', [])

        # Extract first education entry if available
        education_text = education[0] if education else "my educational background"

        # Get top matching skills
        top_skills = skills[:3] if skills else ["technical skills"]

        return f"""Dear Hiring Manager,

I am writing to express my keen interest in the position at your company. With {experience} of professional experience and expertise in {', '.join(top_skills)}, I am confident in my ability to contribute significantly to your team.

My background in {education_text} has provided me with a strong foundation, which I have successfully applied in various professional settings. I have consistently demonstrated my ability to deliver high-quality solutions and adapt to evolving technological landscapes.

What particularly excites me about this opportunity is the alignment between your requirements and my skill set. I am eager to bring my experience in {top_skills[0] if top_skills else 'key technologies'} to your organization and contribute to your ongoing success.

I am enthusiastic about the possibility of discussing how my qualifications can benefit your team. Thank you for considering my application.

Sincerely,
[Your Name]
[Your Contact Information]"""

    def _professional_template_2(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])
        experience = resume_data.get('experience', {}).get('years', 'substantial')
        companies = resume_data.get('experience', {}).get('companies', [])

        company_experience = f" at {companies[0]}" if companies else ""

        return f"""Dear Recruitment Team,

I am excited to submit my application for the position at your esteemed organization. With {experience} of experience{company_experience} and proficiency in {', '.join(skills[:4]) if skills else 'relevant technologies'}, I believe I possess the ideal combination of skills and experience for this role.

Throughout my career, I have developed strong capabilities in {', '.join(skills[:2]) if skills else 'key areas'} and have successfully implemented solutions that drive efficiency and innovation. My hands-on experience with {skills[0] if skills else 'modern technologies'} has prepared me to make an immediate impact.

I have been following your company's work and am impressed by your commitment to excellence. The opportunity to contribute to your team while growing professionally is genuinely appealing.

I look forward to the possibility of discussing my application further and how I can contribute to your organization's success.

Best regards,
[Your Name]
[Your Email] | [Your Phone] | [Your LinkedIn]"""

    def _enthusiastic_template_1(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])
        match_score = analysis.get('match_score', 0)

        return f"""Dear Hiring Manager,

I am absolutely thrilled to apply for the position at your innovative company! With my passion for {skills[0] if skills else 'technology'} and demonstrated expertise in {', '.join(skills[:3]) if skills else 'key skills'}, I am incredibly excited about the opportunity to bring my energy and skills to your team.

I've been admiring your company's amazing work, and I'm genuinely excited about the chance to contribute to your success! My background aligns {match_score}% with your requirements, and I'm confident I can hit the ground running.

What really excites me is the opportunity to work with cutting-edge technologies while collaborating with talented professionals. I'm eager to bring my unique perspective and proven track record to your organization.

I can't wait to discuss how my skills and enthusiasm can benefit your team. Let's connect and explore the possibilities!

Warmly,
[Your Name]
[Your Contact Details]"""

    def _technical_template_1(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])
        technical_skills = [s for s in skills if any(tech in s.lower() for tech in
                        ['python', 'java', 'react', 'aws', 'docker', 'sql', 'machine learning'])]

        return f"""Dear Technical Hiring Committee,

I am writing to apply for the technical position at your organization. With extensive experience in {', '.join(technical_skills[:4]) if technical_skills else 'software development'}, I am confident in my ability to contribute to your technical projects and architecture decisions.

My technical expertise includes:
• {technical_skills[0] if len(technical_skills) > 0 else 'Software Development'}
• {technical_skills[1] if len(technical_skills) > 1 else 'System Architecture'}
• {technical_skills[2] if len(technical_skills) > 2 else 'Problem Solving'}

I have successfully implemented scalable solutions and optimized system performance in previous roles. My approach combines technical excellence with practical business understanding.

I am particularly interested in this position because of your focus on technological innovation and quality engineering practices.

I look forward to the opportunity to discuss my technical qualifications and how I can contribute to your engineering excellence.

Sincerely,
[Your Name]
[GitHub Profile] | [Technical Blog]"""

    def _conversational_template_1(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])

        return f"""Hello there!

I came across the opening at your company and was immediately interested! With my experience in {', '.join(skills[:3]) if skills else 'the field'}, I think I could be a great fit for your team.

I really enjoy working with {skills[0] if skills else 'technology'} and have built up some solid experience with {skills[1] if len(skills) > 1 else 'various tools'} along the way. I'm always eager to take on new challenges and learn from talented colleagues.

I'd love the chance to chat about how I can help your team succeed. I'm available for a call anytime next week to discuss this opportunity further.

Looking forward to hearing from you!

Best,
[Your Name]
[Your Phone Number] | [Your Email]"""

    def _formal_template_1(self, resume_data, job_data, analysis, customizations):
        return f"""Dear Sir/Madam,

I am writing to submit my application for the available position within your organization. My credentials include substantial professional experience and demonstrated proficiency in relevant technologies.

My academic and professional background has provided me with the theoretical foundation and practical experience necessary for success in this field. I have developed substantial expertise through various challenging projects and professional engagements.

I respectfully request the opportunity to discuss my qualifications further and elaborate on how I may be of service to your esteemed institution.

Yours faithfully,
[Your Name]"""

    def _creative_template_1(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])

        return f"""Dear Innovative Team,

I'm reaching out with genuine excitement about the opportunity to join your forward-thinking organization! With my background in {', '.join(skills[:2]) if skills else 'creative problem-solving'}, I'm confident I can bring fresh perspectives and impactful solutions to your projects.

What draws me to your company is your reputation for innovation and excellence. I'm passionate about creating meaningful work and believe my skills in {skills[0] if skills else 'technology'} align perfectly with your vision.

I'm not just looking for a job - I'm seeking to join a team where I can make a real difference, grow professionally, and contribute to something extraordinary.

Let's create something amazing together!

Cheers,
[Your Name]
[Your Portfolio] | [Your Creative Work]"""

    def _enthusiastic_template_2(self, resume_data, job_data, analysis, customizations):
        skills = resume_data.get('skills', [])

        return f"""Dear Team,

I couldn't be more excited to apply for this position! The moment I saw your job posting, I knew it was the perfect match for my skills in {', '.join(skills[:2]) if skills else 'technology and innovation'}.

I bring not just technical expertise but also genuine passion for creating exceptional solutions. My experience with {skills[0] if skills else 'modern technologies'} has taught me that the best results come from combining technical skill with creative thinking.

I'm absolutely convinced that I can bring value to your team from day one. Let's schedule a conversation and explore how we can achieve great things together!

Excitedly,
[Your Name]"""

    def _conversational_template_2(self, resume_data, job_data, analysis, customizations):
        return f"""Hi Team,

Hope you're having a great week! I'm reaching out about the position because it looks like an amazing opportunity that aligns perfectly with my background.

I've been working in this field for a while now, and what really stands out about your company is [specific aspect from job description]. That's exactly the kind of environment where I thrive.

I'd love to grab a virtual coffee and chat about how I can contribute to your success. What does your schedule look like next week?

Looking forward to connecting!

Best,
[Your Name]"""
