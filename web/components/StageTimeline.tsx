import { Icon } from "@/components/Icons";
import type { Stage } from "@/lib/types";

export function StageTimeline({ stages, currentNo }: { stages: Stage[]; currentNo: number }) {
  const donePct = Math.max(Math.round(((currentNo - 1) / stages.length) * 100), 6);
  return (
    <>
      <div className="tl">
        {stages.map((s) => {
          const cls = s.state === "done" ? " done" : s.state === "active" ? " cur" : "";
          return (
            <span key={s.no} className={`tlchip${cls}`}>
              <span className="n">
                {s.state === "done" ? (
                  <Icon name="check" className="i sm" />
                ) : s.state === "locked" ? (
                  <Icon name="lock" className="i sm" />
                ) : (
                  s.no
                )}
              </span>
              {s.name}
            </span>
          );
        })}
      </div>
      <div className="progressline">
        <i style={{ width: `${donePct}%` }} />
      </div>
    </>
  );
}
