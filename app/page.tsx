'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

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

export default function TikDown() {
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

  const StatItem = ({ icon, count, label }: { icon: string; count: number | string; label: string }) => (
    <div className="flex items-center space-x-2">
      <i className={`fas fa-${icon} text-primary`}></i>
      <span className="text-sm">{count} {label}</span>
    </div>
  )

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            <i className="fas fa-tiktok mr-2"></i>
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
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download
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
                <StatItem icon="comment" count={videoData.comment_count} label="Comments" />
                <StatItem icon="heart" count={videoData.collect_count} label="Likes" />
                <StatItem icon="share" count={videoData.share_count} label="Shares" />
                <StatItem icon="download" count={videoData.download_count} label="Downloads" />
                <StatItem icon="play" count={videoData.play_count} label="Plays" />
                <StatItem icon="clock" count={Math.round(videoData.duration)} label="Seconds" />
                <StatItem icon="calendar" count={new Date(videoData.create_time * 1000).toLocaleDateString()} label="Created" />
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href={videoData.play}>
                    <i className="fas fa-download mr-2"></i>
                    Download Without Watermark
                  </a>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <a href={videoData.wmplay}>
                    <i className="fas fa-download mr-2"></i>
                    Download With Watermark
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={videoData.music}>
                    <i className="fas fa-music mr-2"></i>
                    Download Audio
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <i className="fas fa-info-circle mr-2"></i>
          Note: Please ensure you have the right to download and use the content.
        </CardFooter>
      </Card>
    </div>
  )
                    }
