import { Link } from "@/lib/router";
import { Identity } from "./Identity";
import { timeAgo } from "../lib/timeAgo";
import { cn } from "../lib/utils";
import { deriveProjectUrlKey, type ActivityEvent, type Agent } from "@paperclipai/shared";
import { useTranslation } from "../i18n";

const ACTION_VERBS: Record<string, string> = {
  "issue.created": "created",
  "issue.updated": "updated",
  "issue.checked_out": "checked out",
  "issue.released": "released",
  "issue.comment_added": "commented on",
  "issue.attachment_added": "attached file to",
  "issue.attachment_removed": "removed attachment from",
  "issue.document_created": "created document for",
  "issue.document_updated": "updated document on",
  "issue.document_deleted": "deleted document from",
  "issue.commented": "commented on",
  "issue.deleted": "deleted",
  "agent.created": "created",
  "agent.updated": "updated",
  "agent.paused": "paused",
  "agent.resumed": "resumed",
  "agent.terminated": "terminated",
  "agent.key_created": "created API key for",
  "agent.budget_updated": "updated budget for",
  "agent.runtime_session_reset": "reset session for",
  "heartbeat.invoked": "invoked heartbeat for",
  "heartbeat.cancelled": "cancelled heartbeat for",
  "approval.created": "requested approval",
  "approval.approved": "approved",
  "approval.rejected": "rejected",
  "project.created": "created",
  "project.updated": "updated",
  "project.deleted": "deleted",
  "goal.created": "created",
  "goal.updated": "updated",
  "goal.deleted": "deleted",
  "cost.reported": "reported cost for",
  "cost.recorded": "recorded cost for",
  "company.created": "created company",
  "company.updated": "updated company",
  "company.archived": "archived",
  "company.budget_updated": "updated budget for",
};

const ACTION_VERBS_ZH: Record<string, string> = {
  "issue.created": "创建了",
  "issue.updated": "更新了",
  "issue.checked_out": "签出了",
  "issue.released": "释放了",
  "issue.comment_added": "评论了",
  "issue.attachment_added": "添加附件到",
  "issue.attachment_removed": "移除了附件从",
  "issue.document_created": "创建文档于",
  "issue.document_updated": "更新文档于",
  "issue.document_deleted": "删除文档于",
  "issue.commented": "评论了",
  "issue.deleted": "删除了",
  "agent.created": "创建了",
  "agent.updated": "更新了",
  "agent.paused": "暂停了",
  "agent.resumed": "恢复了",
  "agent.terminated": "终止了",
  "agent.key_created": "创建了 API 密钥用于",
  "agent.budget_updated": "更新了预算用于",
  "agent.runtime_session_reset": "重置了会话用于",
  "heartbeat.invoked": "触发了心跳用于",
  "heartbeat.cancelled": "取消了心跳用于",
  "approval.created": "请求了审批",
  "approval.approved": "批准了",
  "approval.rejected": "拒绝了",
  "project.created": "创建了",
  "project.updated": "更新了",
  "project.deleted": "删除了",
  "goal.created": "创建了",
  "goal.updated": "更新了",
  "goal.deleted": "删除了",
  "cost.reported": "报告了成本用于",
  "cost.recorded": "记录了成本用于",
  "company.created": "创建了公司",
  "company.updated": "更新了公司",
  "company.archived": "归档了",
  "company.budget_updated": "更新了公司预算",
};

function humanizeValue(value: unknown): string {
  if (typeof value !== "string") return String(value ?? "none");
  return value.replace(/_/g, " ");
}

function formatVerb(action: string, details?: Record<string, unknown> | null, isZhCN?: boolean): string {
  if (action === "issue.updated" && details) {
    const previous = (details._previous ?? {}) as Record<string, unknown>;
    if (details.status !== undefined) {
      const from = previous.status;
      return from
        ? `changed status from ${humanizeValue(from)} to ${humanizeValue(details.status)} on`
        : `changed status to ${humanizeValue(details.status)} on`;
    }
    if (details.priority !== undefined) {
      const from = previous.priority;
      return from
        ? `changed priority from ${humanizeValue(from)} to ${humanizeValue(details.priority)} on`
        : `changed priority to ${humanizeValue(details.priority)} on`;
    }
  }
  const verbs = isZhCN ? ACTION_VERBS_ZH : ACTION_VERBS;
  return verbs[action] ?? action.replace(/[._]/g, " ");
}

function entityLink(entityType: string, entityId: string, name?: string | null): string | null {
  switch (entityType) {
    case "issue": return `/issues/${name ?? entityId}`;
    case "agent": return `/agents/${entityId}`;
    case "project": return `/projects/${deriveProjectUrlKey(name, entityId)}`;
    case "goal": return `/goals/${entityId}`;
    case "approval": return `/approvals/${entityId}`;
    default: return null;
  }
}

interface ActivityRowProps {
  event: ActivityEvent;
  agentMap: Map<string, Agent>;
  entityNameMap: Map<string, string>;
  entityTitleMap?: Map<string, string>;
  className?: string;
}

export function ActivityRow({ event, agentMap, entityNameMap, entityTitleMap, className }: ActivityRowProps) {
  const { t, language } = useTranslation();
  const isZhCN = language === "zh-CN";
  const verb = formatVerb(event.action, event.details, isZhCN);

  const isHeartbeatEvent = event.entityType === "heartbeat_run";
  const heartbeatAgentId = isHeartbeatEvent
    ? (event.details as Record<string, unknown> | null)?.agentId as string | undefined
    : undefined;

  const name = isHeartbeatEvent
    ? (heartbeatAgentId ? entityNameMap.get(`agent:${heartbeatAgentId}`) : null)
    : entityNameMap.get(`${event.entityType}:${event.entityId}`);

  const entityTitle = entityTitleMap?.get(`${event.entityType}:${event.entityId}`);

  const link = isHeartbeatEvent && heartbeatAgentId
    ? `/agents/${heartbeatAgentId}/runs/${event.entityId}`
    : entityLink(event.entityType, event.entityId, name);

  const actor = event.actorType === "agent" ? agentMap.get(event.actorId) : null;
  const actorName = actor?.name ?? (event.actorType === "system" 
    ? t("activity.system") 
    : event.actorType === "user" 
      ? t("activity.board") 
      : event.actorId || t("activity.unknown"));

  const inner = (
    <div className="flex gap-3">
      <p className="flex-1 min-w-0 truncate">
        <Identity
          name={actorName}
          size="xs"
          className="align-baseline"
        />
        <span className="text-muted-foreground ml-1">{verb} </span>
        {name && <span className="font-medium">{name}</span>}
        {entityTitle && <span className="text-muted-foreground ml-1">— {entityTitle}</span>}
      </p>
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{timeAgo(event.createdAt)}</span>
    </div>
  );

  const classes = cn(
    "px-4 py-2 text-sm",
    link && "cursor-pointer hover:bg-accent/50 transition-colors",
    className,
  );

  if (link) {
    return (
      <Link to={link} className={cn(classes, "no-underline text-inherit block")}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {inner}
    </div>
  );
}
