"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, FileText, Eraser } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface TranscriptFormProps {
  onTranscriptSubmitted: () => void;
}

export function TranscriptForm({ onTranscriptSubmitted }: TranscriptFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const maxLength = 50000;
  const minLength = 10;
  const charCount = content.length;
  const isValid = charCount >= minLength && charCount <= maxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error(`Transcript must be between ${minLength} and ${maxLength} characters`);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.createTranscript({ content });
      
      toast.success(
        `✨ Generated ${response.data.tasks.length} action items from your transcript!`
      );
      
      setContent("");
      onTranscriptSubmitted();
    } catch (error) {
      console.error('Failed to submit transcript:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to process transcript. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setContent("");
    toast.info("Transcript cleared");
  };

  const getCharCountColor = () => {
    if (charCount < minLength) return "text-red-500";
    if (charCount > maxLength * 0.9) return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Submit Meeting Transcript
        </CardTitle>
        <CardDescription>
          Paste your meeting transcript below and let AI extract actionable tasks for your team.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="transcript" className="text-sm font-medium">
                Meeting Transcript
              </Label>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isValid ? "default" : "destructive"}
                  className="text-xs"
                >
                  {charCount >= minLength ? "Valid" : "Too short"}
                </Badge>
                <span className={`text-xs ${getCharCountColor()}`}>
                  {charCount.toLocaleString()} / {maxLength.toLocaleString()}
                </span>
              </div>
            </div>
            
            <Textarea
              id="transcript"
              placeholder="Paste your meeting transcript here... 

Example:
'We discussed the new product launch. John will prepare the marketing proposal by Friday. Sarah needs to review the budget and coordinate with the design team. We should schedule a follow-up meeting next Tuesday to review progress.'"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-y"
              disabled={isLoading}
            />
            
            {charCount < minLength && charCount > 0 && (
              <p className="text-sm text-red-500">
                Transcript needs at least {minLength - charCount} more characters
              </p>
            )}
            
            {charCount > maxLength && (
              <p className="text-sm text-red-500">
                Transcript exceeds maximum length by {charCount - maxLength} characters
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Action Items
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || !content}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}