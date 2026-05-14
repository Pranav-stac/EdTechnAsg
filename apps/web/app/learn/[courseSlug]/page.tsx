"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DiscussionItem = {
  id: string;
  body: string;
  createdAt: string;
  user: { name: string };
};

export default function LearnPage({ params }: { params: Promise<{ courseSlug: string; lessonId?: string }> }) {
  const [courseSlug, setCourseSlug] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [tab, setTab] = useState<"about" | "notes" | "discussion">("about");
  const [discussion, setDiscussion] = useState<DiscussionItem[]>([]);
  const [comment, setComment] = useState("");
  const [discussionMessage, setDiscussionMessage] = useState("");

  useEffect(() => {
    params.then((value) => {
      setCourseSlug(value.courseSlug);
      setLessonId(value.lessonId || "");
    });
  }, [params]);

  useEffect(() => {
    if (!courseSlug) return;
    api<{ course: any }>(`/api/v1/courses/${courseSlug}`).then((data) => {
      setCourse(data.course);
      const lessons = data.course.modules.flatMap((module: any) => module.lessons);
      const selected = lessons.find((lesson: any) => lesson.id === lessonId) || lessons[0];
      setActiveLesson(selected);
      if (selected) {
        api("/api/v1/student/progress", {
          method: "POST",
          body: JSON.stringify({ lessonId: selected.id, completed: true, watchedSeconds: selected.durationSec }),
        }).catch(() => undefined);
      }
    });
  }, [courseSlug, lessonId]);

  useEffect(() => {
    if (!activeLesson || tab !== "discussion") return;
    api<{ items: DiscussionItem[] }>(`/api/v1/student/lessons/${activeLesson.id}/discussion`)
      .then((data) => setDiscussion(data.items))
      .catch(() => setDiscussion([]));
  }, [activeLesson, tab]);

  const postDiscussion = async () => {
    if (!activeLesson || comment.trim().length < 2) return;
    try {
      const data = await api<{ item: DiscussionItem }>(`/api/v1/student/lessons/${activeLesson.id}/discussion`, {
        method: "POST",
        body: JSON.stringify({ body: comment.trim() }),
      });
      setDiscussion((current) => [...current, data.item]);
      setComment("");
      setDiscussionMessage("Comment posted.");
    } catch (error) {
      setDiscussionMessage(error instanceof Error ? error.message : "Unable to post comment");
    }
  };

  if (!course || !activeLesson) {
    return <div className="container-page py-20">Loading lesson...</div>;
  }

  const quiz = course.modules[0]?.quizzes?.[0];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="border-b border-surface-line bg-white">
        <LearnPageHeader courseTitle={course.title} />
      </div>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="surface-panel h-fit p-4">
          <h2 className="font-semibold text-slate-900">Course Content</h2>
          <div className="mt-4 space-y-4">
            {course.modules.map((module: any) => (
              <div key={module.id}>
                <p className="text-sm font-semibold text-slate-700">{module.title}</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {module.lessons.map((lesson: any) => (
                    <li key={lesson.id}>
                      <button
                        className={`text-left ${lesson.id === activeLesson.id ? "font-semibold text-brand" : "text-slate-600"}`}
                        onClick={() => setActiveLesson(lesson)}
                      >
                        {lesson.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-surface-line bg-black shadow-panel">
            <video controls className="aspect-video w-full bg-black" src={activeLesson.videoUrl} />
          </div>
          <div className="surface-panel">
            <div className="flex flex-wrap gap-4 border-b border-surface-line pb-4">
              {(["about", "notes", "discussion"] as const).map((value) => (
                <button
                  key={value}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    tab === value ? "bg-brand text-white" : "text-slate-600 hover:bg-surface-muted"
                  }`}
                  onClick={() => setTab(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-700">
              {tab === "about" && <p>{course.description}</p>}
              {tab === "notes" && <p>{activeLesson.notes}</p>}
              {tab === "discussion" && (
                <div className="space-y-4">
                  {discussion.map((item) => (
                    <DiscussionItem key={item.id} item={item} />
                  ))}
                  <textarea
                    className="input min-h-24"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Ask a question or share a note"
                  />
                  <button className="btn-primary" onClick={postDiscussion}>
                    Post Comment
                  </button>
                  {discussionMessage ? <p className="text-sm text-slate-500">{discussionMessage}</p> : null}
                </div>
              )}
            </div>
            {activeLesson.resourceUrl ? (
              <a href={activeLesson.resourceUrl} className="mt-4 inline-flex text-sm font-semibold text-brand">
                Download lecture notes
              </a>
            ) : null}
          </div>
          {quiz ? (
            <Link href={`/learn/${courseSlug}/quiz/${quiz.id}`} className="btn-primary inline-flex">
              Take quiz
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function LearnPageHeader({ courseTitle }: { courseTitle: string }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container-page py-4">
        <Link href="/student" className="text-sm text-brand">
          Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{courseTitle}</h1>
      </div>
    </div>
  );
}

function DiscussionItem({ item }: { item: DiscussionItem }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="font-medium">{item.user.name}</p>
      <p className="mt-1">{item.body}</p>
    </div>
  );
}
