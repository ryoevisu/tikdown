'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Download, Heart, MessageSquare, Play, Share2, Music, Info } from 'lucide-react'

interface VideoData {
  author: {
    avatar: string;
    nickname: string;
  };
  title: string;
  cover: string;
  comment_count: number;
  collect_count: number;
  share_count: number;
  download_count: number;
  play_count: number;
  duration: number;
  create_time: number;
  play: string;
  wmplay: string;
  music: string;
}

export default function TikDownClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setVideoData(null)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval)
            return prevProgress
          }
          return prevProgress + 10
        })
      }, 200)

      const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`)
      clearInterval(progressInterval)
      setProgress(100)

      if (response.data.code === 0) {
        setVideoData(response.data.data)
      } else {
        throw new Error('Failed to fetch video data. Please check the URL and try again.')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false)
    }
  }

  const StatItem = ({ icon: Icon, count, label }: { icon: React.ElementType; count: number | string; label: string }) => (
    <div className="flex items-center space-x-2">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm">{count} {label}</span>
    </div>
  )

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2 fill-current">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            TikDown Enhanced
          </CardTitle>
          <p className="text-muted-foreground">Enter a TikTok video URL to download</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="tiktok-url" className="block text-sm font-medium text-foreground">
                TikTok URL
              </label>
              <Input
                type="text"
                id="tiktok-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok URL here..."
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download
                </>
              )}
            </Button>
          </form>

          {loading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {videoData && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img src={videoData.author.avatar} alt={videoData.author.nickname} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="font-semibold text-lg">{videoData.author.nickname}</h3>
                  <p className="text-sm text-muted-foreground">{videoData.title}</p>
                </div>
              </div>
              <img src={videoData.cover} alt="Video thumbnail" className="w-full rounded-lg shadow-lg" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <StatItem icon={MessageSquare} count={videoData.comment_count} label="Comments" />
                <StatItem icon={Heart} count={videoData.collect_count} label="Likes" />
                <StatItem icon={Share2} count={videoData.share_count} label="Shares" />
                <StatItem icon={Download} count={videoData.download_count} label="Downloads" />
                <StatItem icon={Play} count={videoData.play_count} label="Plays" />
                <StatItem icon={Clock} count={Math.round(videoData.duration)} label="Seconds" />
                <StatItem icon={Calendar} count={new Date(videoData.create_time * 1000).toLocaleDateString()} label="Created" />
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href={videoData.play}>
                    <Download className="mr-2 h-4 w-4" /> Download Without Watermark
                  </a>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <a href={videoData.wmplay}>
                    <Download className="mr-2 h-4 w-4" /> Download With Watermark
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={videoData.music}>
                    <Music className="mr-2 h-4 w-4" /> Download Audio
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <Info className="mr-2 h-4 w-4" />
          Note: Please ensure you have the right to download and use the content.
        </CardFooter>
      </Card>
    </div>
  )
    }
