'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, MessageSquare, ThumbsUp, ThumbsDown, Filter, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Session {
  id: string;
  title: string;
  speaker: string;
  date: string;
  hasRated: boolean;
  rating?: number;
  feedback?: string;
}

interface EventFeedback {
  id: string;
  eventName: string;
  overallRating?: number;
  feedback?: string;
  submitted: boolean;
}

interface FeedbackForm {
  sessionId?: string;
  eventId?: string;
  rating: number;
  feedback: string;
  category: string;
  anonymous: boolean;
}

export default function FeedbackPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [eventFeedback, setEventFeedback] = useState<EventFeedback | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    rating: 0,
    feedback: '',
    category: 'session',
    anonymous: false
  });
  const [filter, setFilter] = useState<'all' | 'rated' | 'unrated'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSessions: Session[] = [
        {
          id: '1',
          title: 'Opening Keynote: Future of Event Technology',
          speaker: 'Dr. Sarah Johnson',
          date: '2024-03-15T09:00:00Z',
          hasRated: true,
          rating: 5,
          feedback: 'Excellent presentation with great insights into emerging technologies.'
        },
        {
          id: '2',
          title: 'Panel: Digital Transformation in Events',
          speaker: 'Multiple Speakers',
          date: '2024-03-15T10:30:00Z',
          hasRated: false
        },
        {
          id: '3',
          title: 'Workshop: Event Marketing Strategies',
          speaker: 'Mike Chen',
          date: '2024-03-15T14:00:00Z',
          hasRated: true,
          rating: 4,
          feedback: 'Very practical workshop with actionable strategies.'
        },
        {
          id: '4',
          title: 'AI in Event Management',
          speaker: 'Dr. Alex Rodriguez',
          date: '2024-03-16T09:00:00Z',
          hasRated: false
        }
      ];

      const mockEventFeedback: EventFeedback = {
        id: 'wecon-2024',
        eventName: 'WECON Masawat 2024',
        submitted: false
      };

      setSessions(mockSessions);
      setEventFeedback(mockEventFeedback);
    } catch (error) {
      console.error('Failed to fetch feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackForm(prev => ({ ...prev, rating }));
  };

  const handleSubmitFeedback = async () => {
    if (feedbackForm.rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Implement actual API call
      if (selectedSession) {
        // Update session feedback
        setSessions(prev => prev.map(session =>
          session.id === selectedSession.id
            ? {
                ...session,
                hasRated: true,
                rating: feedbackForm.rating,
                feedback: feedbackForm.feedback
              }
            : session
        ));
        setSelectedSession(null);
      } else if (feedbackForm.category === 'event') {
        // Update event feedback
        setEventFeedback(prev => prev ? {
          ...prev,
          overallRating: feedbackForm.rating,
          feedback: feedbackForm.feedback,
          submitted: true
        } : null);
      }

      // Reset form
      setFeedbackForm({
        rating: 0,
        feedback: '',
        category: 'session',
        anonymous: false
      });

      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'rated') return session.hasRated;
    if (filter === 'unrated') return !session.hasRated;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer transition-colors ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={interactive ? () => handleRatingClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback & Ratings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your experience and help improve future events
          </p>
        </div>
      </div>

      {/* Event Overall Feedback */}
      {eventFeedback && !eventFeedback.submitted && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ThumbsUp className="h-5 w-5" />
              Rate Your Overall Experience
            </CardTitle>
            <CardDescription>
              How was your overall experience at {eventFeedback.eventName}?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setSelectedSession(null);
                setFeedbackForm(prev => ({ ...prev, category: 'event' }));
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Star className="h-4 w-4 mr-2" />
              Rate Event
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Session Feedback</h2>
            <Select value={filter} onValueChange={(value: 'all' | 'rated' | 'unrated') => setFilter(value)}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="rated">Rated</SelectItem>
                <SelectItem value="unrated">Not Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-md transition-shadow ${session.hasRated ? 'border-green-200' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {session.speaker}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.date)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={session.hasRated ? "default" : "outline"}>
                      {session.hasRated ? 'Rated' : 'Not Rated'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {session.hasRated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Your Rating:</span>
                        {renderStars(session.rating || 0)}
                        <span className="text-sm text-gray-600">({session.rating}/5)</span>
                      </div>
                      {session.feedback && (
                        <div>
                          <span className="text-sm font-medium">Your Feedback:</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.feedback}</p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session);
                          setFeedbackForm({
                            rating: session.rating || 0,
                            feedback: session.feedback || '',
                            category: 'session',
                            anonymous: false
                          });
                        }}
                      >
                        Edit Rating
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedSession(session);
                        setFeedbackForm({
                          rating: 0,
                          feedback: '',
                          category: 'session',
                          anonymous: false
                        });
                      }}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Rate Session
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feedback Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedSession ? 'Rate Session' : feedbackForm.category === 'event' ? 'Rate Event' : 'Select Session'}
            </CardTitle>
            {selectedSession && (
              <CardDescription>{selectedSession.title}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {(selectedSession || feedbackForm.category === 'event') ? (
              <>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Rating</Label>
                  {renderStars(feedbackForm.rating, true, 'lg')}
                  <p className="text-xs text-gray-500 mt-1">Click to rate</p>
                </div>

                <div>
                  <Label htmlFor="feedback">Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts, suggestions, or comments..."
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={feedbackForm.anonymous}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="anonymous" className="text-sm">Submit anonymously</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={submitting || feedbackForm.rating === 0}
                    className="flex-1"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSession(null);
                      setFeedbackForm({
                        rating: 0,
                        feedback: '',
                        category: 'session',
                        anonymous: false
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Session
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose a session from the list to provide your feedback and rating
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessions.filter(s => s.hasRated).length}</div>
              <div className="text-sm text-gray-600">Sessions Rated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessions.length - sessions.filter(s => s.hasRated).length}</div>
              <div className="text-sm text-gray-600">Pending Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sessions.filter(s => s.hasRated).length > 0
                  ? (sessions.filter(s => s.hasRated).reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.filter(s => s.hasRated).length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {eventFeedback?.submitted ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600">Event Feedback</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
