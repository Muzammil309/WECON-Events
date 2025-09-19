// AI Matchmaking & Smart Recommendations System
// Advanced networking and content recommendation engine

import { supabase } from './supabase'

export interface UserProfile {
  id: string
  display_name: string
  company: string
  job_title: string
  bio: string
  linkedin_url?: string
  twitter_url?: string
  interests: string[]
  skills: string[]
  goals: string[]
  networking_available: boolean
  privacy_level: string
}

export interface MatchingScore {
  userId: string
  score: number
  reasons: string[]
  commonInterests: string[]
  complementarySkills: string[]
  mutualConnections: string[]
}

export interface SessionRecommendation {
  sessionId: number
  score: number
  reasons: string[]
  relevanceFactors: {
    skillMatch: number
    interestMatch: number
    careerRelevance: number
    networkingPotential: number
  }
}

export class AIMatchmakingEngine {
  
  // Generate networking matches for a user
  async generateNetworkingMatches(userId: string, eventId: number, limit: number = 10): Promise<MatchingScore[]> {
    try {
      // Get user profile and preferences
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile) return []

      // Get other attendees at the same event
      const attendees = await this.getEventAttendees(eventId, userId)
      
      // Calculate matching scores
      const matches = attendees.map(attendee => 
        this.calculateMatchingScore(userProfile, attendee)
      ).filter(match => match.score > 0.3) // Minimum threshold
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      return matches
    } catch (error) {
      console.error('Error generating networking matches:', error)
      return []
    }
  }

  // Generate session recommendations
  async generateSessionRecommendations(userId: string, eventId: number): Promise<SessionRecommendation[]> {
    try {
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile) return []

      // Get available sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'SCHEDULED')

      if (!sessions) return []

      // Calculate relevance scores
      const recommendations = sessions.map(session => 
        this.calculateSessionRelevance(userProfile, session)
      ).filter(rec => rec.score > 0.4)
        .sort((a, b) => b.score - a.score)

      return recommendations
    } catch (error) {
      console.error('Error generating session recommendations:', error)
      return []
    }
  }

  // Smart scheduling optimization
  async optimizePersonalSchedule(userId: string, eventId: number): Promise<any> {
    try {
      const recommendations = await this.generateSessionRecommendations(userId, eventId)
      const userSessions = await this.getUserRegisteredSessions(userId, eventId)
      
      // Detect conflicts and suggest alternatives
      const conflicts = this.detectScheduleConflicts(userSessions)
      const alternatives = await this.suggestAlternatives(conflicts, recommendations)
      
      return {
        recommendations: recommendations.slice(0, 8),
        conflicts,
        alternatives,
        optimizationTips: this.generateOptimizationTips(userSessions, recommendations)
      }
    } catch (error) {
      console.error('Error optimizing schedule:', error)
      return null
    }
  }

  // Calculate matching score between two users
  private calculateMatchingScore(user1: UserProfile, user2: UserProfile): MatchingScore {
    let score = 0
    const reasons: string[] = []
    const commonInterests: string[] = []
    const complementarySkills: string[] = []

    // Interest alignment (30% weight)
    const interestOverlap = this.calculateArrayOverlap(user1.interests, user2.interests)
    if (interestOverlap > 0) {
      score += interestOverlap * 0.3
      commonInterests.push(...user1.interests.filter(i => user2.interests.includes(i)))
      reasons.push(`${Math.round(interestOverlap * 100)}% shared interests`)
    }

    // Skill complementarity (25% weight)
    const skillComplementarity = this.calculateSkillComplementarity(user1.skills, user2.skills)
    if (skillComplementarity > 0) {
      score += skillComplementarity * 0.25
      reasons.push('Complementary skill sets')
    }

    // Industry/company relevance (20% weight)
    if (user1.company && user2.company) {
      const industryMatch = this.calculateIndustryRelevance(user1.company, user2.company)
      score += industryMatch * 0.2
      if (industryMatch > 0.5) {
        reasons.push('Similar industry background')
      }
    }

    // Seniority level compatibility (15% weight)
    const seniorityMatch = this.calculateSeniorityMatch(user1.job_title, user2.job_title)
    score += seniorityMatch * 0.15

    // Goal alignment (10% weight)
    const goalAlignment = this.calculateArrayOverlap(user1.goals, user2.goals)
    score += goalAlignment * 0.1
    if (goalAlignment > 0.3) {
      reasons.push('Aligned professional goals')
    }

    return {
      userId: user2.id,
      score: Math.min(score, 1), // Cap at 1.0
      reasons,
      commonInterests,
      complementarySkills,
      mutualConnections: [] // Would be populated with actual mutual connections
    }
  }

  // Calculate session relevance for a user
  private calculateSessionRelevance(user: UserProfile, session: any): SessionRecommendation {
    let score = 0
    const reasons: string[] = []
    const factors = {
      skillMatch: 0,
      interestMatch: 0,
      careerRelevance: 0,
      networkingPotential: 0
    }

    // Skill relevance (40% weight)
    const skillMatch = this.calculateTextRelevance(
      user.skills.join(' '), 
      `${session.title} ${session.description}`
    )
    factors.skillMatch = skillMatch
    score += skillMatch * 0.4
    if (skillMatch > 0.6) {
      reasons.push('Highly relevant to your skills')
    }

    // Interest alignment (30% weight)
    const interestMatch = this.calculateTextRelevance(
      user.interests.join(' '), 
      `${session.title} ${session.description}`
    )
    factors.interestMatch = interestMatch
    score += interestMatch * 0.3
    if (interestMatch > 0.5) {
      reasons.push('Matches your interests')
    }

    // Career relevance (20% weight)
    const careerRelevance = this.calculateCareerRelevance(user.job_title, session)
    factors.careerRelevance = careerRelevance
    score += careerRelevance * 0.2
    if (careerRelevance > 0.7) {
      reasons.push('Excellent for career development')
    }

    // Networking potential (10% weight)
    const networkingPotential = this.calculateNetworkingPotential(session)
    factors.networkingPotential = networkingPotential
    score += networkingPotential * 0.1
    if (networkingPotential > 0.8) {
      reasons.push('Great networking opportunity')
    }

    return {
      sessionId: session.id,
      score: Math.min(score, 1),
      reasons,
      relevanceFactors: factors
    }
  }

  // Helper methods
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!data) return null

      return {
        ...data,
        interests: this.parseSkillsOrInterests(data.bio, 'interests'),
        skills: this.parseSkillsOrInterests(data.bio, 'skills'),
        goals: this.parseSkillsOrInterests(data.bio, 'goals')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  private async getEventAttendees(eventId: number, excludeUserId: string): Promise<UserProfile[]> {
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select(`
          users (*)
        `)
        .eq('event_id', eventId)
        .neq('user_id', excludeUserId)
        .eq('status', 'CONFIRMED')

      return (data || []).map(reg => ({
        ...reg.users,
        interests: this.parseSkillsOrInterests(reg.users.bio, 'interests'),
        skills: this.parseSkillsOrInterests(reg.users.bio, 'skills'),
        goals: this.parseSkillsOrInterests(reg.users.bio, 'goals')
      }))
    } catch (error) {
      console.error('Error fetching event attendees:', error)
      return []
    }
  }

  private calculateArrayOverlap(arr1: string[], arr2: string[]): number {
    if (!arr1.length || !arr2.length) return 0
    const intersection = arr1.filter(item => arr2.includes(item))
    return intersection.length / Math.max(arr1.length, arr2.length)
  }

  private calculateSkillComplementarity(skills1: string[], skills2: string[]): number {
    // Simple complementarity: different but related skills
    const overlap = this.calculateArrayOverlap(skills1, skills2)
    return Math.max(0, 0.8 - overlap) // Higher score for less overlap but related skills
  }

  private calculateTextRelevance(text1: string, text2: string): number {
    // Simple keyword matching - in production, use more sophisticated NLP
    const words1 = text1.toLowerCase().split(/\s+/)
    const words2 = text2.toLowerCase().split(/\s+/)
    return this.calculateArrayOverlap(words1, words2)
  }

  private calculateIndustryRelevance(company1: string, company2: string): number {
    // Simple company name similarity - in production, use industry classification
    if (company1.toLowerCase() === company2.toLowerCase()) return 1
    return this.calculateTextRelevance(company1, company2)
  }

  private calculateSeniorityMatch(title1: string, title2: string): number {
    // Simple title similarity - in production, use seniority level classification
    return this.calculateTextRelevance(title1, title2)
  }

  private calculateCareerRelevance(jobTitle: string, session: any): number {
    return this.calculateTextRelevance(jobTitle, `${session.title} ${session.description}`)
  }

  private calculateNetworkingPotential(session: any): number {
    // Higher score for interactive sessions
    const interactiveTypes = ['NETWORKING', 'WORKSHOP', 'PANEL']
    return interactiveTypes.includes(session.session_type) ? 0.9 : 0.5
  }

  private parseSkillsOrInterests(bio: string, type: 'skills' | 'interests' | 'goals'): string[] {
    // Simple parsing - in production, use NLP to extract skills/interests from bio
    if (!bio) return []
    
    const keywords = {
      skills: ['javascript', 'python', 'react', 'node', 'ai', 'ml', 'data', 'design'],
      interests: ['technology', 'innovation', 'startup', 'ai', 'blockchain', 'sustainability'],
      goals: ['networking', 'learning', 'career', 'growth', 'partnership', 'investment']
    }
    
    return keywords[type].filter(keyword => 
      bio.toLowerCase().includes(keyword)
    )
  }

  private async getUserRegisteredSessions(userId: string, eventId: number): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('session_registrations')
        .select(`
          sessions (*)
        `)
        .eq('user_id', userId)
        .eq('sessions.event_id', eventId)

      return (data || []).map(reg => reg.sessions)
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  }

  private detectScheduleConflicts(sessions: any[]): any[] {
    const conflicts = []
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        if (this.sessionsOverlap(sessions[i], sessions[j])) {
          conflicts.push({
            session1: sessions[i],
            session2: sessions[j],
            type: 'time_conflict'
          })
        }
      }
    }
    return conflicts
  }

  private sessionsOverlap(session1: any, session2: any): boolean {
    const start1 = new Date(session1.start_time)
    const end1 = new Date(session1.end_time)
    const start2 = new Date(session2.start_time)
    const end2 = new Date(session2.end_time)
    
    return start1 < end2 && start2 < end1
  }

  private async suggestAlternatives(conflicts: any[], recommendations: SessionRecommendation[]): Promise<any[]> {
    // Suggest alternative sessions for conflicts
    return conflicts.map(conflict => ({
      conflict,
      alternatives: recommendations.filter(rec => 
        rec.sessionId !== conflict.session1.id && 
        rec.sessionId !== conflict.session2.id
      ).slice(0, 3)
    }))
  }

  private generateOptimizationTips(sessions: any[], recommendations: SessionRecommendation[]): string[] {
    const tips = []
    
    if (sessions.length < 3) {
      tips.push('Consider adding more sessions to maximize your learning')
    }
    
    if (recommendations.length > sessions.length) {
      tips.push('You have highly relevant sessions you haven\'t registered for yet')
    }
    
    tips.push('Schedule networking breaks between sessions')
    tips.push('Arrive early to sessions for better networking opportunities')
    
    return tips
  }
}

// Global instance
export const aiMatchmaking = new AIMatchmakingEngine()
