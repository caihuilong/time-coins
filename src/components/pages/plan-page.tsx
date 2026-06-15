"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CirclePause,
  Flag,
  Pencil,
  Plus,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { Goal, GoalStatus, GoalType, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const goalSections: {
  type: GoalType;
  title: string;
  subtitle: string;
}[] = [
  { type: "yearly", title: "年度目标", subtitle: "今年真正重要的方向" },
  { type: "monthly", title: "月度目标", subtitle: "这个月向前推进什么" },
  { type: "weekly", title: "周目标", subtitle: "本周可以完成的行动" },
];

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export function PlanPage() {
  const {
    mission,
    updateMission,
    roles,
    goals,
    saveRole,
    deleteRole,
    saveGoal,
    deleteGoal,
  } = useTimeCoins();
  const [missionDraft, setMissionDraft] = useState(mission.content);
  const [missionSaved, setMissionSaved] = useState(false);
  const [roleEditor, setRoleEditor] = useState<Role | null>(null);
  const [goalEditor, setGoalEditor] = useState<Goal | null>(null);

  useEffect(() => setMissionDraft(mission.content), [mission.content]);

  const roleMap = useMemo(
    () => Object.fromEntries(roles.map((role) => [role.id, role])),
    [roles],
  );

  const saveMission = () => {
    updateMission(missionDraft.trim());
    setMissionSaved(true);
    window.setTimeout(() => setMissionSaved(false), 1400);
  };

  const addGoal = (type: GoalType = "weekly") =>
    setGoalEditor({
      id: newId(),
      title: "",
      type,
      status: "active",
      createdAt: new Date().toISOString(),
    });

  return (
    <section className="px-4 pb-28 pt-5">
      <header className="mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
          Direction
        </p>
        <h1 className="text-3xl font-bold tracking-tight">目标规划</h1>
        <p className="mt-2 text-sm text-stone-500">
          先决定时间要去哪里，再回看它去了哪里。
        </p>
      </header>

      <Card className="bg-[#FFF4CF]">
        <div className="mb-3 flex items-center gap-2">
          <Flag className="h-5 w-5 text-amber-700" />
          <h2 className="font-bold">Mission Statement</h2>
        </div>
        <Textarea
          value={missionDraft}
          rows={5}
          placeholder="我想成为怎样的人？我希望如何使用自己的时间？"
          className="border-white/70 bg-white/60 leading-6"
          onChange={(event) => setMissionDraft(event.target.value)}
        />
        <Button size="sm" className="mt-3" onClick={saveMission}>
          {missionSaved ? "已保存" : "保存使命宣言"}
        </Button>
      </Card>

      {goalSections.map((section) => {
        const sectionGoals = goals.filter((goal) => goal.type === section.type);
        return (
          <div key={section.type} className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="text-xs text-stone-500">{section.subtitle}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addGoal(section.type)}
              >
                <Plus className="h-4 w-4" />
                新增
              </Button>
            </div>
            <div className="space-y-3">
              {sectionGoals.length === 0 ? (
                <button
                  type="button"
                  onClick={() => addGoal(section.type)}
                  className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-300 bg-white/40 py-7 text-sm text-stone-400"
                >
                  <Plus className="h-4 w-4" />
                  写下一个目标
                </button>
              ) : (
                sectionGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    roleName={goal.roleId ? roleMap[goal.roleId]?.name : undefined}
                    onEdit={() => setGoalEditor(goal)}
                    onStatusChange={(status) => saveGoal({ ...goal, status })}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}

      <div className="mb-3 mt-8 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold">角色目标表</h2>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            生活中的每个角色，都值得被照顾
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRoleEditor({ id: newId(), name: "" })}
        >
          <Plus className="h-4 w-4" />
          角色
        </Button>
      </div>

      <div className="space-y-3">
        {roles.length === 0 ? (
          <Card className="text-center">
            <Users className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 text-sm text-stone-500">
              添加“自己”“家人”“创作者”等角色
            </p>
          </Card>
        ) : (
          roles.map((role) => {
            const roleGoals = goals.filter((goal) => goal.roleId === role.id);
            return (
              <Card key={role.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{role.name}</h3>
                    {role.description && (
                      <p className="mt-1 text-xs text-stone-500">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRoleEditor(role)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  {roleGoals.length ? (
                    roleGoals.map((goal) => (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => setGoalEditor(goal)}
                        className="flex w-full items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2.5 text-left text-sm"
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            goal.status === "done"
                              ? "bg-rest"
                              : goal.status === "paused"
                                ? "bg-mandatory"
                                : "bg-quality",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{goal.title}</span>
                        <span className="text-[10px] uppercase text-stone-400">
                          {goal.type}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-stone-400">还没有关联目标</p>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <RoleEditor
        role={roleEditor}
        open={Boolean(roleEditor)}
        onOpenChange={(open) => !open && setRoleEditor(null)}
        onSave={(role) => {
          saveRole(role);
          setRoleEditor(null);
        }}
        onDelete={(id) => {
          deleteRole(id);
          setRoleEditor(null);
        }}
      />
      <GoalEditor
        goal={goalEditor}
        roles={roles}
        open={Boolean(goalEditor)}
        onOpenChange={(open) => !open && setGoalEditor(null)}
        onSave={(goal) => {
          saveGoal(goal);
          setGoalEditor(null);
        }}
        onDelete={(id) => {
          deleteGoal(id);
          setGoalEditor(null);
        }}
      />
    </section>
  );
}

function GoalCard({
  goal,
  roleName,
  onEdit,
  onStatusChange,
}: {
  goal: Goal;
  roleName?: string;
  onEdit: () => void;
  onStatusChange: (status: GoalStatus) => void;
}) {
  return (
    <Card className={cn(goal.status === "done" && "opacity-65")}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label="切换完成状态"
          onClick={() =>
            onStatusChange(goal.status === "done" ? "active" : "done")
          }
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
            goal.status === "done"
              ? "border-rest bg-rest"
              : "border-stone-300 bg-white",
          )}
        >
          {goal.status === "done" && <Check className="h-4 w-4" />}
          {goal.status === "paused" && <CirclePause className="h-4 w-4" />}
        </button>
        <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
          <h3
            className={cn(
              "font-semibold",
              goal.status === "done" && "line-through",
            )}
          >
            {goal.title}
          </h3>
          {(roleName || goal.description) && (
            <p className="mt-1 truncate text-xs text-stone-500">
              {roleName && `# ${roleName}`}
              {roleName && goal.description && " · "}
              {goal.description}
            </p>
          )}
        </button>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function RoleEditor({
  role,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Role) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Role>({ id: "", name: "" });

  useEffect(() => {
    if (role) setDraft(role);
  }, [role]);

  if (!role) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetTitle className="text-xl font-bold">编辑角色</SheetTitle>
        <SheetDescription className="mt-1 text-sm text-stone-500">
          角色帮助你平衡生活中不同的责任与愿望。
        </SheetDescription>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold">角色名称</span>
          <Input
            autoFocus
            value={draft.name}
            placeholder="比如：自己、伴侣、设计师"
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold">简单描述</span>
          <Textarea
            value={draft.description ?? ""}
            placeholder="这个角色对你意味着什么？"
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
          />
        </label>
        <div className="mt-5 flex gap-3">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(draft.id)}
            aria-label="删除角色"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1"
            disabled={!draft.name.trim()}
            onClick={() =>
              onSave({
                ...draft,
                name: draft.name.trim(),
                description: draft.description?.trim() || undefined,
              })
            }
          >
            保存角色
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function GoalEditor({
  goal,
  roles,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  goal: Goal | null;
  roles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Goal | null>(goal);

  useEffect(() => {
    if (goal) setDraft(goal);
  }, [goal]);

  if (!goal || !draft) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetTitle className="text-xl font-bold">编辑目标</SheetTitle>
        <SheetDescription className="mt-1 text-sm text-stone-500">
          写得具体一点，让它更容易开始。
        </SheetDescription>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold">目标</span>
          <Input
            autoFocus
            value={draft.title}
            placeholder="比如：每周完成三次力量训练"
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold">说明</span>
          <Textarea
            value={draft.description ?? ""}
            placeholder="可选：为什么重要，怎样算完成"
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SelectField
            label="周期"
            value={draft.type}
            onChange={(value) =>
              setDraft({ ...draft, type: value as GoalType })
            }
            options={[
              ["yearly", "年度"],
              ["monthly", "月度"],
              ["weekly", "每周"],
            ]}
          />
          <SelectField
            label="状态"
            value={draft.status}
            onChange={(value) =>
              setDraft({ ...draft, status: value as GoalStatus })
            }
            options={[
              ["active", "进行中"],
              ["done", "已完成"],
              ["paused", "暂停"],
            ]}
          />
        </div>
        <SelectField
          className="mt-4"
          label="关联角色"
          value={draft.roleId ?? ""}
          onChange={(value) =>
            setDraft({ ...draft, roleId: value || undefined })
          }
          options={[["", "暂不关联"], ...roles.map((role) => [role.id, role.name])]}
        />
        <div className="mt-5 flex gap-3">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(draft.id)}
            aria-label="删除目标"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1"
            disabled={!draft.title.trim()}
            onClick={() =>
              onSave({
                ...draft,
                title: draft.title.trim(),
                description: draft.description?.trim() || undefined,
              })
            }
          >
            <Target className="h-4 w-4" />
            保存目标
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-2xl border border-stone-200 bg-white px-4 text-base outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || "none"} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
