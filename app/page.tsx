'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Hourglass, LockKeyhole, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function EscapeRoom() {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [code, setCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [escapeSuccessful, setEscapeSuccessful] = useState(false)
  const [correctCode, setCorrectCode] = useState("")
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminInput, setAdminInput] = useState("")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedTime = localStorage.getItem('escapeRoomTime')
    const savedRunning = localStorage.getItem('escapeRoomRunning')
    const savedCode = localStorage.getItem('escapeRoomCorrectCode')
    
    if (savedTime) setTime(parseInt(savedTime))
    if (savedRunning) setRunning(savedRunning === 'true')
    if (savedCode) setCorrectCode(savedCode)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('escapeRoomTime', time.toString())
      localStorage.setItem('escapeRoomRunning', running.toString())
      localStorage.setItem('escapeRoomCorrectCode', correctCode)
    }
  }, [time, running, correctCode, isClient])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (running) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [running])

  const startGame = () => {
    if (!running) {
      setTime(0)
      setRunning(true)
      setCode("")
    }
  }

  const checkCode = () => {
    if (code === correctCode) {
      setRunning(false)
      setEscapeSuccessful(true)
    } else {
      setEscapeSuccessful(false)
    }
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open && escapeSuccessful) {
      setTime(0)
      if (isClient) {
        localStorage.setItem('escapeRoomTime', '0')
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const toggleAdmin = () => {
    if (!showAdmin) {
      setAdminDialogOpen(true)
    } else {
      setShowAdmin(false)
    }
  }

  const checkAdminCode = () => {
    if (adminInput === "admin123") {
      setShowAdmin(true)
      setAdminDialogOpen(false)
      setAdminInput("")
    } else {
      setAdminInput("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {showAdmin && (
        <Card className="absolute top-4 left-4 bg-stone-100/90 backdrop-blur-sm border-red-600/30">
          <CardHeader>
            <CardTitle className="text-red-800">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm font-mono">Current Code: {correctCode}</div>
            <Input
              type="text"
              value={correctCode}
              onChange={(e) => setCorrectCode(e.target.value)}
              placeholder="Set New Code"
              className="w-full"
            />
          </CardContent>
        </Card>
      )}

      <div className="bg-stone-100/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-600/30 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-amber-800">Escape from the Market</h1>
        <div className="text-5xl font-mono text-center text-amber-900 flex items-center justify-center space-x-2">
          <Hourglass className="w-8 h-8" />
          <span>{formatTime(time)}</span>
        </div>
        <Button 
          onClick={startGame} 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xl" 
          disabled={running}
        >
          Begin Your Escape
        </Button>
        <div className="relative">
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the secret code"
            className="w-full pl-10 bg-stone-50 border-amber-600/50"
          />
          <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
        </div>
        <Button 
          onClick={checkCode} 
          className="py-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-2xl"
        >
          Unlock the Gate
        </Button>
      </div>

      <Button
        onClick={toggleAdmin}
        className="absolute top-4 right-4 bg-stone-800/50 hover:bg-stone-800/70"
      >
        <Shield className="w-4 h-4 mr-2" />
        {showAdmin ? "Hide Admin" : "Admin Access"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-stone-100 border-2 border-amber-600">
          <DialogHeader>
            <DialogTitle className={`text-2xl ${escapeSuccessful ? "text-emerald-600" : "text-red-600"}`}>
              {escapeSuccessful ? "Escape Successful!" : "The Gate Remains Locked"}
            </DialogTitle>
            <DialogDescription className="text-lg text-amber-800">
              {escapeSuccessful
                ? `You've unlocked the gate and escaped the market! Time: ${formatTime(time)}`
                : "The lock resists your attempt. Try another combination of symbols."}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => handleDialogClose(false)}
            className={`w-full ${escapeSuccessful ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"} text-white`}
          >
            {escapeSuccessful ? "Celebrate Victory" : "Try Again"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="bg-stone-100 border-2 border-red-600">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-800">Admin Access</DialogTitle>
            <DialogDescription className="text-lg text-stone-600">
              Enter the admin password to access the control panel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              placeholder="Enter admin password"
              className="w-full"
            />
            <Button
              onClick={checkAdminCode}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Access Admin Panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}