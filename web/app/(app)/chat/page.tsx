"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import type { ChatMessage } from "@/lib/types";

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    mine: true,
    kind: "text",
    body: "السلام عليكم، أبي تسعيرة تمديدات كهرباء كاملة لفيلا دورين 400م².",
    originalLang: null,
    originalBody: null,
    createdAt: "",
  },
  {
    id: "m2",
    mine: false,
    kind: "text",
    body: "وعليكم السلام، أمرّ أعاين الموقع وبعدها أعطيك مبلغًا إجماليًا — مع المواد أو بدونها.",
    originalLang: "اردو",
    originalBody: "السلام، میں سائٹ دیکھ کر کل ٹوٹل دوں گا، میٹریل کے ساتھ یا بغیر۔",
    createdAt: "",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function send(kind: ChatMessage["kind"], body: string) {
    if (!body.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `local-${Date.now()}`,
        mine: true,
        kind,
        body,
        originalLang: null,
        originalBody: null,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  return (
    <main className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          paddingBottom: 11,
          borderBottom: "1px solid var(--line)",
          marginBottom: 8,
        }}
      >
        <div className="avatar">ر</div>
        <div style={{ flex: 1 }}>
          <b style={{ display: "block", fontSize: 16, color: "var(--navy)" }}>
            Rashid Electric — رشيد
          </b>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>يرد عادة من 7ص إلى 9م</span>
        </div>
      </div>

      <div
        style={{
          color: "var(--muted)",
          fontSize: 12.5,
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        الترجمة تلقائية — هو يكتب أردو وأنت تقرأ عربي
      </div>
      <div className="warn" style={{ marginTop: 0 }}>
        <b>تنبيه أمان:</b> لا تحوّل أي مبلغ قبل المعاينة والاتفاق — الدفع المسبق قبل بدء
        العمل خارج مسؤولية المنصة.
      </div>

      <div style={{ flex: 1 }}>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.mine ? "out" : "in"}`}>
            <div className="bubble">
              {m.kind === "guard_phone" && <Icon name="shield" className="i sm" />} {m.body}
            </div>
            {m.originalBody && (
              <div style={{ fontSize: 13, color: "var(--muted)", padding: "5px 4px 0" }}>
                <i
                  style={{
                    fontStyle: "normal",
                    fontSize: 11,
                    background: "var(--chip)",
                    borderRadius: 6,
                    padding: "1px 6px",
                    marginInlineEnd: 6,
                  }}
                >
                  {m.originalLang}
                </i>
                {m.originalBody}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 8, margin: "10px 0 8px" }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={() => send("location", "📍 موقع المشروع — حي النرجس (يفتح يوم الموعد)")}
        >
          <Icon name="pin" className="i sm" /> إرسال الموقع
        </button>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={() => send("guard_phone", "رقم الحارس: 0559 876 543 — اطلبه عند البوابة")}
        >
          <Icon name="shield" className="i sm" /> رقم الحارس
        </button>
      </div>

      <form
        style={{ display: "flex", gap: 8, alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          send("text", draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="اكتب رسالتك…"
          aria-label="نص الرسالة"
          style={{
            flex: 1,
            border: "1.5px solid var(--line)",
            borderRadius: 99,
            background: "var(--card)",
            padding: "12px 18px",
            fontSize: 15,
            minHeight: 48,
          }}
        />
        <button
          type="submit"
          aria-label="إرسال"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "var(--navy)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="chat" />
        </button>
      </form>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5, marginTop: 7 }}>
        النص يُترجم تلقائيًا للطرف الآخر — والمايك للرسائل الصوتية (قريبًا)
      </p>
    </main>
  );
}
