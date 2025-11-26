"""
AI-Powered Skill Gap Analyzer
Analyzes skill gaps between resume and job requirements, provides learning roadmaps
"""

from typing import Dict, List, Any, Set
import re


class SkillGapAnalyzer:
    def __init__(self):
        # Learning resources by skill category
        self.learning_resources = {
            'python': {
                'beginner': ['Python.org Tutorial', 'Codecademy Python', 'Automate the Boring Stuff'],
                'intermediate': ['Real Python', 'Python Cookbook', 'Fluent Python'],
                'advanced': ['Python Design Patterns', 'High Performance Python', 'Architecture Patterns with Python']
            },
            'javascript': {
                'beginner': ['freeCodeCamp', 'JavaScript.info', 'MDN Web Docs'],
                'intermediate': ['You Don\'t Know JS', 'Eloquent JavaScript', 'JavaScript: The Good Parts'],
                'advanced': ['Advanced JavaScript Concepts', 'JavaScript Design Patterns', 'Node.js Design Patterns']
            },
            'react': {
                'beginner': ['React Official Tutorial', 'React for Beginners', 'freeCodeCamp React'],
                'intermediate': ['React Hooks in Depth', 'Advanced React Patterns', 'Testing React Applications'],
                'advanced': ['React Performance Optimization', 'React Architecture Patterns', 'Building Design Systems']
            },
            'data_science': {
                'beginner': ['Python for Data Analysis', 'Kaggle Learn', 'DataCamp Intro to Python'],
                'intermediate': ['Hands-On Machine Learning', 'Data Science from Scratch', 'Introduction to Statistical Learning'],
                'advanced': ['Deep Learning Specialization', 'Advanced Machine Learning', 'MLOps Fundamentals']
            },
            'aws': {
                'beginner': ['AWS Cloud Practitioner', 'AWS Free Tier Tutorials', 'A Cloud Guru Beginner'],
                'intermediate': ['AWS Solutions Architect Associate', 'AWS Well-Architected Framework', 'Serverless Applications'],
                'advanced': ['AWS Solutions Architect Professional', 'AWS Advanced Networking', 'AWS Security Specialty']
            },
            'sql': {
                'beginner': ['SQLBolt', 'Khan Academy SQL', 'Mode Analytics SQL Tutorial'],
                'intermediate': ['SQL Performance Explained', 'Advanced SQL Puzzles', 'Window Functions Mastery'],
                'advanced': ['Database Internals', 'Query Optimization', 'Database Design Patterns']
            }
        }

        # Skill proficiency levels and time estimates
        self.time_estimates = {
            'beginner': {'weeks': 4, 'hours_per_week': 10},
            'intermediate': {'weeks': 8, 'hours_per_week': 12},
            'advanced': {'weeks': 12, 'hours_per_week': 15}
        }

        # Industry demand data (simulated market data)
        self.market_data = {
            'python': {'demand': 95, 'growth': 'High', 'avg_salary_boost': '15%'},
            'javascript': {'demand': 92, 'growth': 'High', 'avg_salary_boost': '12%'},
            'react': {'demand': 88, 'growth': 'Very High', 'avg_salary_boost': '18%'},
            'aws': {'demand': 90, 'growth': 'Very High', 'avg_salary_boost': '20%'},
            'machine learning': {'demand': 85, 'growth': 'Very High', 'avg_salary_boost': '25%'},
            'docker': {'demand': 82, 'growth': 'High', 'avg_salary_boost': '14%'},
            'kubernetes': {'demand': 80, 'growth': 'Very High', 'avg_salary_boost': '22%'},
            'sql': {'demand': 87, 'growth': 'Medium', 'avg_salary_boost': '10%'},
            'java': {'demand': 85, 'growth': 'Medium', 'avg_salary_boost': '12%'},
            'node.js': {'demand': 78, 'growth': 'High', 'avg_salary_boost': '16%'}
        }

    def analyze_skill_gaps(self, resume_data: Dict[str, Any],
                          job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive skill gap analysis with learning roadmap
        """

        # Extract skills
        resume_skills = set(s.lower().strip() for s in resume_data.get('skills', []))
        job_skills = set(s.lower().strip() for s in job_data.get('skills', []))

        # Identify gaps
        missing_skills = job_skills - resume_skills
        matching_skills = resume_skills & job_skills
        extra_skills = resume_skills - job_skills

        # Calculate readiness score
        readiness_score = self._calculate_readiness_score(
            len(matching_skills), len(missing_skills), len(job_skills)
        )

        # Prioritize missing skills
        prioritized_gaps = self._prioritize_skills(missing_skills, job_data)

        # Generate learning paths
        learning_paths = self._generate_learning_paths(prioritized_gaps)

        # Create skill development roadmap
        roadmap = self._create_roadmap(prioritized_gaps)

        # Estimate time to job-ready
        time_estimate = self._estimate_time_to_ready(prioritized_gaps)

        # Market insights
        market_insights = self._get_market_insights(missing_skills, matching_skills)

        # Transferable skills analysis
        transferable = self._identify_transferable_skills(extra_skills, missing_skills)

        # Skill recommendations
        recommendations = self._generate_recommendations(
            readiness_score, prioritized_gaps, matching_skills
        )

        return {
            'readiness_score': readiness_score,
            'matching_skills': list(matching_skills),
            'missing_skills': list(missing_skills),
            'prioritized_gaps': prioritized_gaps,
            'extra_skills': list(extra_skills),
            'learning_paths': learning_paths,
            'roadmap': roadmap,
            'time_estimate': time_estimate,
            'market_insights': market_insights,
            'transferable_skills': transferable,
            'recommendations': recommendations
        }

    def _calculate_readiness_score(self, matching: int, missing: int,
                                   total_required: int) -> Dict[str, Any]:
        """Calculate job readiness score"""
        if total_required == 0:
            score = 100
        else:
            score = round((matching / total_required) * 100)

        # Determine readiness level
        if score >= 80:
            level = 'Highly Ready'
            message = 'You have most required skills. Focus on the remaining gaps.'
        elif score >= 60:
            level = 'Moderately Ready'
            message = 'You have a good foundation. Targeted learning will make you competitive.'
        elif score >= 40:
            level = 'Developing'
            message = 'Significant skill development needed. Create a focused learning plan.'
        else:
            level = 'Early Stage'
            message = 'This role requires substantial skill development. Consider entry-level alternatives.'

        return {
            'score': score,
            'level': level,
            'message': message,
            'skills_matched': matching,
            'skills_missing': missing,
            'total_required': total_required
        }

    def _prioritize_skills(self, missing_skills: Set[str],
                          job_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Prioritize missing skills by importance and market demand"""
        prioritized = []

        job_text = job_data.get('description', '').lower()

        for skill in missing_skills:
            # Count mentions in job description (importance indicator)
            mentions = job_text.count(skill)

            # Get market data
            market_info = self.market_data.get(skill, {
                'demand': 50, 'growth': 'Medium', 'avg_salary_boost': '10%'
            })

            # Determine priority
            if mentions >= 3 or market_info['demand'] >= 85:
                priority = 'Critical'
            elif mentions >= 2 or market_info['demand'] >= 70:
                priority = 'High'
            elif mentions >= 1:
                priority = 'Medium'
            else:
                priority = 'Low'

            prioritized.append({
                'skill': skill,
                'priority': priority,
                'mentions_in_job': mentions,
                'market_demand': market_info['demand'],
                'growth_trend': market_info['growth'],
                'salary_impact': market_info['avg_salary_boost']
            })

        # Sort by priority
        priority_order = {'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3}
        prioritized.sort(key=lambda x: (priority_order[x['priority']], -x['market_demand']))

        return prioritized

    def _generate_learning_paths(self, prioritized_gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate learning paths for top priority skills"""
        learning_paths = []

        for gap in prioritized_gaps[:5]:  # Focus on top 5 gaps
            skill = gap['skill']
            skill_key = self._normalize_skill_name(skill)

            resources = self.learning_resources.get(skill_key, {
                'beginner': ['Online tutorials', 'Official documentation', 'YouTube courses'],
                'intermediate': ['Udemy/Coursera courses', 'Practice projects', 'Books'],
                'advanced': ['Advanced courses', 'Open source contribution', 'Real-world projects']
            })

            learning_paths.append({
                'skill': skill,
                'priority': gap['priority'],
                'learning_stages': {
                    'beginner': {
                        'resources': resources['beginner'],
                        'time_needed': f"{self.time_estimates['beginner']['weeks']} weeks",
                        'hours_per_week': self.time_estimates['beginner']['hours_per_week'],
                        'goals': [
                            f'Understand {skill} fundamentals',
                            f'Complete 2-3 beginner projects',
                            'Build basic proficiency'
                        ]
                    },
                    'intermediate': {
                        'resources': resources['intermediate'],
                        'time_needed': f"{self.time_estimates['intermediate']['weeks']} weeks",
                        'hours_per_week': self.time_estimates['intermediate']['hours_per_week'],
                        'goals': [
                            f'Apply {skill} to real projects',
                            'Understand best practices',
                            'Build portfolio project'
                        ]
                    },
                    'advanced': {
                        'resources': resources['advanced'],
                        'time_needed': f"{self.time_estimates['advanced']['weeks']} weeks",
                        'hours_per_week': self.time_estimates['advanced']['hours_per_week'],
                        'goals': [
                            f'Master advanced {skill} concepts',
                            'Contribute to open source',
                            'Develop expert-level proficiency'
                        ]
                    }
                },
                'recommended_start': 'beginner'
            })

        return learning_paths

    def _create_roadmap(self, prioritized_gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a detailed learning roadmap"""
        roadmap = {
            'overview': 'Week-by-week skill development plan',
            'phases': []
        }

        # Phase 1: Critical skills (weeks 1-8)
        critical_skills = [g for g in prioritized_gaps if g['priority'] == 'Critical'][:2]
        if critical_skills:
            roadmap['phases'].append({
                'phase': 1,
                'duration': '8 weeks',
                'focus': 'Critical Skills Development',
                'skills': [s['skill'] for s in critical_skills],
                'milestones': [
                    'Week 2: Complete foundational courses',
                    'Week 4: Build first practice project',
                    'Week 6: Complete intermediate tutorials',
                    'Week 8: Develop portfolio project'
                ],
                'expected_outcome': 'Job-ready proficiency in critical skills'
            })

        # Phase 2: High priority skills (weeks 9-16)
        high_priority = [g for g in prioritized_gaps if g['priority'] == 'High'][:2]
        if high_priority:
            roadmap['phases'].append({
                'phase': 2,
                'duration': '8 weeks',
                'focus': 'High Priority Skills',
                'skills': [s['skill'] for s in high_priority],
                'milestones': [
                    'Week 10: Start second skill development',
                    'Week 12: Integrate multiple skills in project',
                    'Week 14: Contribute to open source',
                    'Week 16: Update resume and portfolio'
                ],
                'expected_outcome': 'Strong competency in high-value skills'
            })

        # Phase 3: Ongoing development (weeks 17+)
        medium_priority = [g for g in prioritized_gaps if g['priority'] == 'Medium'][:3]
        if medium_priority:
            roadmap['phases'].append({
                'phase': 3,
                'duration': 'Ongoing',
                'focus': 'Continuous Learning',
                'skills': [s['skill'] for s in medium_priority],
                'milestones': [
                    'Continue building projects',
                    'Stay updated with industry trends',
                    'Network with professionals',
                    'Apply for target positions'
                ],
                'expected_outcome': 'Well-rounded skill set and competitive profile'
            })

        return roadmap

    def _estimate_time_to_ready(self, prioritized_gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Estimate time needed to become job-ready"""
        critical_count = len([g for g in prioritized_gaps if g['priority'] == 'Critical'])
        high_count = len([g for g in prioritized_gaps if g['priority'] == 'High'])

        # Estimate weeks (assuming concurrent learning)
        weeks_needed = (critical_count * 8) + (high_count * 6)
        weeks_needed = min(weeks_needed, 24)  # Cap at 6 months

        hours_per_week = 12
        total_hours = weeks_needed * hours_per_week

        if weeks_needed <= 8:
            timeline = 'Short-term (2 months)'
            urgency = 'You could be ready quickly with focused effort'
        elif weeks_needed <= 16:
            timeline = 'Medium-term (4 months)'
            urgency = 'Dedicate consistent time for best results'
        else:
            timeline = 'Long-term (6 months)'
            urgency = 'This is a significant investment - create a sustainable plan'

        return {
            'estimated_weeks': weeks_needed,
            'hours_per_week': hours_per_week,
            'total_hours': total_hours,
            'timeline': timeline,
            'urgency': urgency,
            'recommended_schedule': f'{hours_per_week} hours/week for {weeks_needed} weeks'
        }

    def _get_market_insights(self, missing_skills: Set[str],
                            matching_skills: Set[str]) -> Dict[str, Any]:
        """Provide market insights for skills"""
        insights = {
            'high_demand_missing': [],
            'high_demand_present': [],
            'trending_skills': [],
            'salary_impact_analysis': []
        }

        for skill in missing_skills:
            market_info = self.market_data.get(skill, None)
            if market_info and market_info['demand'] >= 80:
                insights['high_demand_missing'].append({
                    'skill': skill,
                    'demand': market_info['demand'],
                    'trend': market_info['growth']
                })

        for skill in matching_skills:
            market_info = self.market_data.get(skill, None)
            if market_info and market_info['demand'] >= 80:
                insights['high_demand_present'].append({
                    'skill': skill,
                    'demand': market_info['demand'],
                    'value': 'Strong asset for this role'
                })

        # Trending skills
        all_skills = list(missing_skills) + list(matching_skills)
        for skill in all_skills:
            market_info = self.market_data.get(skill, None)
            if market_info and market_info['growth'] == 'Very High':
                insights['trending_skills'].append({
                    'skill': skill,
                    'growth': market_info['growth'],
                    'salary_boost': market_info['avg_salary_boost']
                })

        return insights

    def _identify_transferable_skills(self, extra_skills: Set[str],
                                     missing_skills: Set[str]) -> List[Dict[str, str]]:
        """Identify transferable skills that could bridge gaps"""
        transferable = []

        # Skill relationships (simplified)
        skill_relations = {
            'python': ['java', 'javascript', 'ruby'],
            'javascript': ['typescript', 'node.js', 'react'],
            'react': ['vue', 'angular', 'frontend'],
            'sql': ['postgresql', 'mysql', 'database'],
            'aws': ['azure', 'gcp', 'cloud']
        }

        for extra in extra_skills:
            for missing in missing_skills:
                # Check if skills are related
                if extra in skill_relations.get(missing, []) or \
                   missing in skill_relations.get(extra, []):
                    transferable.append({
                        'existing_skill': extra,
                        'target_skill': missing,
                        'relationship': 'Similar technology - easier transition',
                        'learning_advantage': 'Your existing knowledge will accelerate learning'
                    })

        return transferable[:5]  # Top 5 transferable skills

    def _generate_recommendations(self, readiness_score: Dict[str, Any],
                                 prioritized_gaps: List[Dict[str, Any]],
                                 matching_skills: Set[str]) -> List[Dict[str, str]]:
        """Generate actionable recommendations"""
        recommendations = []

        score = readiness_score['score']

        # Readiness-based recommendations
        if score >= 80:
            recommendations.append({
                'type': 'Application Strategy',
                'recommendation': 'You\'re highly qualified! Apply now and highlight your matching skills.',
                'action': 'Update resume to emphasize your {0} matching skills and apply immediately'.format(len(matching_skills))
            })
        elif score >= 60:
            recommendations.append({
                'type': 'Quick Wins',
                'recommendation': 'Focus on 2-3 critical gaps for quick improvement.',
                'action': 'Dedicate 8 weeks to mastering critical skills, then apply'
            })
        else:
            recommendations.append({
                'type': 'Foundation Building',
                'recommendation': 'This role requires significant skill development.',
                'action': 'Consider entry-level positions while building skills, or commit to 4-6 months of intensive learning'
            })

        # Skill-specific recommendations
        if prioritized_gaps:
            top_gap = prioritized_gaps[0]
            recommendations.append({
                'type': 'Priority Skill',
                'recommendation': f"Start with {top_gap['skill']} - it's mentioned {top_gap['mentions_in_job']} times in the job description",
                'action': f"Enroll in a {top_gap['skill']} course this week and build a project within 4 weeks"
            })

        # Market-driven recommendations
        critical_skills = [g for g in prioritized_gaps if g['priority'] == 'Critical']
        if critical_skills:
            recommendations.append({
                'type': 'Career Investment',
                'recommendation': f"Learning critical skills like {critical_skills[0]['skill']} can boost salary by {critical_skills[0]['salary_impact']}",
                'action': 'Invest time in high-ROI skills that enhance both this application and long-term career prospects'
            })

        return recommendations

    def _normalize_skill_name(self, skill: str) -> str:
        """Normalize skill names for resource lookup"""
        skill_lower = skill.lower()

        # Map variations to standard names
        mappings = {
            'reactjs': 'react',
            'react.js': 'react',
            'nodejs': 'javascript',
            'node.js': 'javascript',
            'amazon web services': 'aws',
            'data science': 'data_science',
            'machine learning': 'data_science',
            'ml': 'data_science'
        }

        return mappings.get(skill_lower, skill_lower)
