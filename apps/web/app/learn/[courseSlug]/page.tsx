"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function LearnPage({ params }: { params: Promise<{ courseSlug: string; lessonId?: string }> }) {
  const [courseSlug, setCourseSlug] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [tab, setTab] = useState<"about" | "notes" | "discussion">("about");

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

  if (!course || !activeLesson) {
    return <div className="container-page py-20">Loading lesson...</div>;
  }

  const quiz = course.modules[0]?.quizzes?.[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-4">
          <Link href="/student" className="text-sm text-brand">
            Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{course.title}</h1>
        </div>
      </div>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="card p-4">
          <h2 className="font-semibold">Course Content</h2>
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
          <div className="card overflow-hidden">
            <video controls className="aspect-video w-full bg-black" src={activeLesson.videoUrl} />
          </div>
          <div className="card p-6">
            <div className="flex gap-4 border-b border-slate-200 pb-4">
              {(["about", "notes", "discussion"] as const).map((value) => (
                <button
                  key={value}
                  className={tab === value ? "font-semibold text-brand" : "text-slate-600"}
                  onClick={() => setTab(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-700">
              {tab === "about" && <p>{course.description}</p>}
              {tab === "notes" && <p>{activeLesson.notes}</p>}
              {tab === "discussion" && <p>Discussion threads will appear here for this lesson.</p>}
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
