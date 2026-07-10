"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSound } from "../design-system/sound-system"

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_ACTIONS = [
  "分析今日数据",
  "生成工作报告",
  "系统状态检查",
]

export function AIFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是 YYC3 AI 助手，有什么可以帮助你的？",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    playSound("click")
    const userMsg: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    // 模拟 AI 回复
    setTimeout(() => {
      const responses: Record<string, string> = {
        "分析今日数据": "今日数据概览：活跃用户 1,247（+12%），订单 386（+8%），收入 ¥45,200（+15%）。详细分析请查看仪表盘。",
        "生成工作报告": "工作报告模板已生成，包含：1) 本周完成事项 2) 关键指标变化 3) 下周计划。可在「报告中心」查看完整内容。",
        "系统状态检查": "系统状态正常：CPU 23%，内存 45%，磁盘 62%，所有服务运行中，无异常告警。",
      }

      const reply = responses[input] || `已收到你的请求：「${input}」。我正在处理中，请稍候...`
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
      playSound("success")
    }, 800)
  }

  return (
    <>
      {/* 浮动按钮 */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            playSound("click")
          }}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full",
            "bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500",
            "shadow-xl shadow-purple-500/40",
            "flex items-center justify-center",
            "hover:scale-110 hover:rotate-12 transition-all duration-300",
            "group"
          )}
          aria-label="打开 AI 助手"
        >
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* 悬浮面板 */}
      {isOpen && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-[calc(100vw-3rem)] sm:w-96",
          "bg-white dark:bg-slate-900",
          "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700",
          "flex flex-col",
          "max-h-[70vh] sm:max-h-[600px]",
          "animate-in slide-in-from-bottom-5 duration-300"
        )}>
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">AI 智能助手</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  在线
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsOpen(false)
                playSound("click")
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 消息列表 */}
          <ScrollArea className="flex-1 p-4 min-h-[200px]">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* 快捷操作 */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action)
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-400 hover:text-blue-600 rounded-full transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="输入消息..."
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
