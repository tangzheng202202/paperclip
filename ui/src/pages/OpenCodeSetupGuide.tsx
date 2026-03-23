import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Terminal, ExternalLink } from "lucide-react";

interface Step {
  title: string;
  description: string;
  code?: string;
  url?: string;
}

const steps: Step[] = [
  {
    title: "安装 OpenCode",
    description: "在终端中运行以下命令来安装 OpenCode：",
    code: "npm install -g opencode-ai",
  },
  {
    title: "连接 API",
    description: "运行 opencode connect 命令来连接你的 AI 提供商：",
    code: "opencode connect",
  },
  {
    title: "选择提供商",
    description: "选择你想要的 AI 提供商（如 OpenAI、Claude 等）并按照提示完成认证。",
  },
  {
    title: "验证连接",
    description: "运行以下命令验证 OpenCode 是否正常工作：",
    code: "opencode models",
  },
];

export function OpenCodeSetupGuide() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"success" | "error" | null>(null);

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const verifyOpenCode = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    
    try {
      const response = await fetch("http://localhost:8080/api/health");
      if (response.ok) {
        setVerifyResult("success");
      } else {
        setVerifyResult("error");
      }
    } catch {
      setVerifyResult("error");
    }
    
    setIsVerifying(false);
  };

  const allCompleted = completedSteps.size === steps.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">OpenCode 配置指南</h2>
        <p className="text-muted-foreground">
          按照以下步骤配置 OpenCode，开始使用 AI 编程助手
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`rounded-lg border p-4 transition-colors ${
              completedSteps.has(index)
                ? "border-green-500/50 bg-green-50/50 dark:bg-green-500/10"
                : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(index)}
                className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  completedSteps.has(index)
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted-foreground/30 hover:border-muted-foreground/50"
                }`}
              >
                {completedSteps.has(index) && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                {step.code && (
                  <div className="bg-muted rounded-md p-3 font-mono text-sm overflow-x-auto">
                    <code>{step.code}</code>
                  </div>
                )}
                {step.url && (
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    查看文档 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="font-medium mb-3">测试连接</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={verifyOpenCode}
            disabled={isVerifying}
          >
            <Terminal className="w-4 h-4 mr-2" />
            {isVerifying ? "测试中..." : "测试连接"}
          </Button>
          {verifyResult === "success" && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> 连接成功！
            </span>
          )}
          {verifyResult === "error" && (
            <span className="text-sm text-red-600 dark:text-red-400">
              连接失败，请检查 OpenCode 是否正确安装
            </span>
          )}
        </div>
      </div>

      {allCompleted && (
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-green-700 dark:text-green-300 font-medium">
            太棒了！你已完成所有配置步骤
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            现在可以在 Paperclip 中添加 OpenCode 员工了
          </p>
        </div>
      )}
    </div>
  );
}
