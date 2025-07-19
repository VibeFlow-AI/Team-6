"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EXPERIENCE = [
  { label: "None", value: "NONE" },
  { label: "1–3 years", value: "ONE_TO_THREE_YEARS" },
  { label: "3–5 years", value: "THREE_TO_FIVE_YEARS" },
  { label: "5+ years", value: "FIVE_TO_TEN_YEARS" },
];

const LEVELS = [
  { label: "Grade 3-5", value: "GRADE_3_5" },
  { label: "Grade 6-9", value: "GRADE_6_9" },
  { label: "Grade 10-11", value: "GRADE_10_11" },
  { label: "Advanced Level", value: "ADVANCED_LEVEL" },
];

export default function ExpertiseForm({ defaultValues, onNext, onBack }: any) {
  const [form, setForm] = useState({
    subjectsToTeach: defaultValues.subjectsToTeach || [""],
    experienceYears: defaultValues.experienceYears || "",
    preferredStudentLevels: defaultValues.preferredStudentLevels || [],
  });

  return (
    <form
      className="space-y-6 bg-white rounded-xl shadow-lg p-8"
      onSubmit={e => {
        e.preventDefault();
        onNext(form);
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Areas of Expertise</h2>
      <div>
        <Label>Subjects you are planning to teach</Label>
        {form.subjectsToTeach.map((subject: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              className="flex-1"
              placeholder="e.g. Physics"
              value={subject}
              onChange={e => {
                const newSubjects = [...form.subjectsToTeach];
                newSubjects[idx] = e.target.value;
                setForm(f => ({ ...f, subjectsToTeach: newSubjects }));
              }}
              required
            />
            {form.subjectsToTeach.length > 1 && (
              <Button type="button" variant="outline" onClick={() => setForm(f => ({ ...f, subjectsToTeach: f.subjectsToTeach.filter((_, i) => i !== idx) }))}>-</Button>
            )}
            {idx === form.subjectsToTeach.length - 1 && (
              <Button type="button" variant="outline" onClick={() => setForm(f => ({ ...f, subjectsToTeach: [...f.subjectsToTeach, ""] }))}>+</Button>
            )}
          </div>
        ))}
      </div>
      <div>
        <Label>Teaching/Training Experience</Label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
          required
          value={form.experienceYears}
          onChange={e => setForm(f => ({ ...f, experienceYears: e.target.value }))}
        >
          <option value="">Select</option>
          {EXPERIENCE.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>
      <div>
        <Label>Preferred Level of Students</Label>
        <div className="flex flex-wrap gap-4">
          {LEVELS.map(l => (
            <label key={l.value} className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={form.preferredStudentLevels.includes(l.value)}
                onChange={e => {
                  setForm(f => ({
                    ...f,
                    preferredStudentLevels: e.target.checked
                      ? [...f.preferredStudentLevels, l.value]
                      : f.preferredStudentLevels.filter((v: string) => v !== l.value),
                  }));
                }}
              />
              {l.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" type="button" onClick={onBack}>Back</Button>
        <Button className="flex-1" type="submit">Next</Button>
      </div>
    </form>
  );
} 