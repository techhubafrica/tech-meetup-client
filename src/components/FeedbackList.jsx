import { useState, useEffect } from 'react';
import { getAllFeedback } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ThumbsUp, Smile, Meh, Frown, CalendarDays, Lightbulb, Target, Wrench, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function FeedbackList() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('All');

  const experienceIcons = {
    Excellent: { icon: ThumbsUp, color: 'text-green-500', bgColor: 'bg-green-50' },
    Good: { icon: Smile, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    Fair: { icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    Poor: { icon: Frown, color: 'text-red-500', bgColor: 'bg-red-50' }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getAllFeedback();
        setFeedback(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expectations.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keyTakeaways.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.improvements.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExperience = selectedExperience === 'All' || item.experience === selectedExperience;
    
    return matchesSearch && matchesExperience;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin" />
        <p className="text-xl text-muted-foreground">Loading insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-lg text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Community Insights
          </CardTitle>
          <p className="mt-2 text-muted-foreground">
            Discover feedback from {feedback.length} tech enthusiasts
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative flex-1 w-full">
              <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {['All', ...Object.keys(experienceIcons)].map((exp) => (
                <Badge
                  key={exp}
                  variant="outline"
                  className={`cursor-pointer px-4 py-2 ${
                    selectedExperience === exp 
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedExperience(exp)}
                >
                  {exp}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[600px]">
        <motion.div layout className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2">
          <AnimatePresence>
            {filteredFeedback.map((item) => {
              const ExperienceIcon = experienceIcons[item.experience]?.icon;
              const colorClass = experienceIcons[item.experience]?.color;
              const bgColorClass = experienceIcons[item.experience]?.bgColor;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="mb-2 text-xl font-semibold">{item.attendee.name}</h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColorClass}`}>
                            <ExperienceIcon className={`w-4 h-4 ${colorClass}`} />
                            <span className="text-sm font-medium">{item.experience}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4" />
                          <time>
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <FeedbackSection 
                          icon={Target} 
                          title="Expectations" 
                          content={item.expectations}
                          iconColor="text-purple-500"
                        />
                        <FeedbackSection 
                          icon={Lightbulb} 
                          title="Key Takeaways" 
                          content={item.keyTakeaways}
                          iconColor="text-amber-500"
                        />
                        <FeedbackSection 
                          icon={Wrench} 
                          title="Improvements" 
                          content={item.improvements}
                          iconColor="text-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  );
}

function FeedbackSection({ icon: Icon, title, content, iconColor }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="leading-relaxed text-muted-foreground">{content}</p>
    </div>
  );
}