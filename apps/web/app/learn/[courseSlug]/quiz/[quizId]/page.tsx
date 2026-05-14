"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function QuizPage({
  params,
}: {
  params: Promise<{ courseSlug: string; quizId: string }>;
}) {
  const [courseSlug, setCourseSlug] = useState("");
  const [quizId, setQuizId] = useState("");
  const [quiz, setQuiz] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    params.then((value) => {
      setCourseSlug(value.courseSlug);
      setQuizId(value.quizId);
    });
  }, [params]);

  useEffect(() => {
    if (!courseSlug) return;
    api<{ course: any }>(`/api/v1/courses/${courseSlug}`).then((data) => {
      const found = data.course.modules
        .flatMap((module: any) => module.quizzes)
        .find((item: any) => item.id === quizId);
      setQuiz(found);
    });
  }, [courseSlug, quizId]);

  if (!quiz) return <div className="container-page py-20">Loading quiz...</div>;

  const question = quiz.questions[index];

  const submit = async () => {
    const response = await api<{ percent: number }>(`/api/v1/student/quizzes/${quiz.id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
    setResult(response.percent);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="border-b border-surface-line bg-white">
        <div className="container-page py-4">
          <p className="text-sm text-slate-500">Assessment</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{quiz.title}</h1>
        </div>
      </div>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_260px]">
        <section className="surface-panel">
          <p className="text-sm text-slate-500">
            Question {index + 1} of {quiz.questions.length}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{question.prompt}</h2>
          <div className="mt-6 space-y-3">
            {question.options.map((option: string) => (
              <label
                key={option}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                  answers[question.id] === option ? "border-brand bg-brand-light" : "border-surface-line"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === option}
                  onChange={() => setAnswers({ ...answers, [question.id]: option })}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              Previous
            </button>
            <button
              className="btn-secondary"
              onClick={() => setMarked({ ...marked, [question.id]: !marked[question.id] })}
            >
              {marked[question.id] ? "Unmark" : "Mark for review"}
            </button>
            {index < quiz.questions.length - 1 ? (
              <button className="btn-primary" onClick={() => setIndex(index + 1)}>
                Next
              </button>
            ) : (
              <button className="btn-primary" onClick={submit}>
                Submit Test
              </button>
            )}
          </div>
          {result !== null ? (
            <p className="mt-6 text-lg font-semibold text-brand">Score: {result}%</p>
          ) : null}
          <Link href={`/learn/${courseSlug}`} className="mt-4 inline-flex text-sm text-brand">
            Back to lesson
          </Link>
        </section>
        <aside className="surface-panel h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold text-slate-900">Question Palette</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-green-100" /> Answered</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-yellow-100" /> Marked</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {quiz.questions.map((item: any, questionIndex: number) => {
              const answered = Boolean(answers[item.id]);
              const review = marked[item.id];
              return (
                <button
                  key={item.id}
                  className={`rounded-lg p-2 text-sm ${
                    review ? "bg-yellow-100 text-yellow-800" : answered ? "bg-green-100 text-green-800" : "bg-slate-100"
                  }`}
                  onClick={() => setIndex(questionIndex)}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
