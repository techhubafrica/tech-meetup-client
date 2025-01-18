import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Smile, Frown, Meh, ThumbsUp, Loader2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { submitFeedback, createAttendee } from "../api/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  expectations: z.string().min(10, {
    message: "Expectations must be at least 10 characters.",
  }),
  experience: z.enum(["Excellent", "Good", "Fair", "Poor"], {
    required_error: "You need to select an experience rating.",
  }),
  keyTakeaways: z.string().min(10, {
    message: "Key takeaways must be at least 10 characters.",
  }),
  improvements: z.string().min(10, {
    message: "Improvements must be at least 10 characters.",
  }),
});

export function FeedbackForm({ attendee, onFeedbackSubmitted }) {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [loadingState, setLoadingState] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: attendee?.name || "",
      email: attendee?.email || "",
      expectations: "",
      experience: undefined,
      keyTakeaways: "",
      improvements: "",
    },
  });

  const experienceOptions = [
    {
      value: "Excellent",
      icon: <ThumbsUp className="w-6 h-6 text-green-500" />,
      color: "border-green-500",
    },
    {
      value: "Good",
      icon: <Smile className="w-6 h-6 text-blue-500" />,
      color: "border-blue-500",
    },
    {
      value: "Fair",
      icon: <Meh className="w-6 h-6 text-yellow-500" />,
      color: "border-yellow-500",
    },
    {
      value: "Poor",
      icon: <Frown className="w-6 h-6 text-red-500" />,
      color: "border-red-500",
    },
  ];

  const steps = [
    {
      title: "Personal Information",
      fields: ["name", "email"],
    },
    {
      title: "Initial Feedback",
      fields: ["expectations", "experience"],
    },
    {
      title: "Detailed Feedback",
      fields: ["keyTakeaways", "improvements"],
    },
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  async function onSubmit(values) {
    setIsLoading(true);
    setLoadingState("initial");
    
    const loadingToast = toast.loading('Preparing submission...', {
      duration: Infinity,
    });

    try {
      let attendeeId = attendee?._id;
      
      if (!attendeeId) {
        setLoadingState("creating-profile");   
        const newAttendee = await createAttendee(values.name, values.email);
        attendeeId = newAttendee._id;
      }

      setLoadingState("submitting-feedback");

      const feedbackData = {
        attendeeId,
        expectations: values.expectations,
        experience: values.experience,
        keyTakeaways: values.keyTakeaways,
        improvements: values.improvements,
      };

      await submitFeedback(feedbackData);
      
      setLoadingState("success");
      toast.dismiss(loadingToast);
      toast.success('Thank you for your feedback!', {
        description: 'Your insights will help us improve.',
      });
      
      setStepCompleted(true);
      setTimeout(() => {
        setIsSubmitted(true);
        navigate("/tech-guru-meetup-2025/all-feed-backs");
      }, 5000);
      
      // setTimeout(() => {
      //   onFeedbackSubmitted();
      //   navigate("/tech-guru-meetup-2025/feedback");
      // }, 5000);
    } catch (error) {
      setLoadingState("error");
      toast.dismiss(loadingToast);
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      });
      console.error("Error submitting feedback:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNextStep = () => {
    const currentFields = steps[currentStep - 1].fields;
    const hasErrors = currentFields.some(field => form.formState.errors[field]);
    
    if (hasErrors) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setCurrentStep(step => step + 1);
    toast.success(`Step ${currentStep} completed!`);
  };

  const LoadingIndicator = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="space-y-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-medium text-primary">
          {loadingState === "submitting-feedback" && "Submitting your feedback..."}
          {loadingState === "initial" && "Preparing submission..."}
        </p>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-4">
            <motion.div 
              className="flex justify-center"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <ThumbsUp className="w-16 h-16 text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl text-center text-green-600">
              Thank You!
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Your feedback has been successfully submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-center text-muted-foreground">
                Your input will help us create better experiences for you and our
                community.
              </p>
              <p className="mt-6 font-semibold text-center">
                Cheers,
                <br />
                Team Tech Hub Africa
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentStepFields = steps[currentStep - 1].fields;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      <Toaster position="top-center" expand={true} richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Tech Guru Meetup 2025
          </h1>
          <p className="text-xl text-muted-foreground">
            Where Innovation Meets Community
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
          >
            <Card className="relative w-full max-w-2xl mx-auto">
              {isLoading && <LoadingIndicator />}
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Share Your Experience
                </CardTitle>
                <CardDescription className="text-center">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                </CardDescription>
                <div className="flex justify-center mt-4 space-x-2">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 w-16 rounded-full ${
                        index + 1 === currentStep
                          ? "bg-primary"
                          : index + 1 < currentStep
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                      initial={false}
                      animate={index + 1 <= currentStep ? { 
                        scale: [1, 1.1, 1],
                        backgroundColor: index + 1 < currentStep ? "#22c55e" : "#3b82f6"
                      } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    
                <div className="space-y-6">
                  {currentStepFields.includes("name") && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              disabled={!!attendee?.name}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStepFields.includes("email") && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email"
                              {...field}
                              disabled={!!attendee?.email}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStepFields.includes("expectations") && (
                    <FormField
                      control={form.control}
                      name="expectations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What were your expectations?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What motivated you to attend the Tech Guru Meetup?"
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tell us about your motivations and expectations for
                            the event.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStepFields.includes("experience") && (
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Rate your experience</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                              {experienceOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                                    field.value === option.value
                                      ? `${option.color} bg-muted`
                                      : "border-muted hover:border-primary"
                                  }`}
                                  onClick={() => field.onChange(option.value)}
                                >
                                  <div className="flex items-center justify-center space-x-2">
                                    {option.icon}
                                    <span className="font-medium">
                                      {option.value}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStepFields.includes("keyTakeaways") && (
                    <FormField
                      control={form.control}
                      name="keyTakeaways"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Takeaways</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What insights or learnings will you take away?"
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Share the most valuable things you've learned from
                            the event.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStepFields.includes("improvements") && (
                    <FormField
                      control={form.control}
                      name="improvements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suggestions for Improvement</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What would make future events even better?"
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your suggestions will help us improve future events.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <motion.div 
                      className="flex justify-between pt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(step => step - 1)}
                          disabled={isLoading}
                          className="space-x-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>
                      )}
                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          className="ml-auto space-x-2"
                          onClick={() => {
                            setStepCompleted(true);
                            setTimeout(() => {
                              setStepCompleted(false);
                              handleNextStep();
                            }, 500);
                          }}
                          disabled={isLoading}
                        >
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          className="ml-auto space-x-2"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              {stepCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : null}
                              <span>Submit Feedback</span>
                            </>
                          )}
                        </Button>
                      )}
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
