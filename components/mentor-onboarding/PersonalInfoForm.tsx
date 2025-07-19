"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LANGUAGES = ["English", "Sinhala", "Tamil", "Other"];

export default function PersonalInfoForm({ defaultValues, onNext }: any) {
  const [form, setForm] = useState({
    fullName: defaultValues.fullName || "",
    age: defaultValues.age || "",
    contactNumber: defaultValues.contactNumber || "",
    preferredLanguage: defaultValues.preferredLanguage || "",
    currentLocation: defaultValues.currentLocation || "",
    shortBio: defaultValues.shortBio || "",
    professionalRole: defaultValues.professionalRole || "",
  });

  return (
    <form
      className="space-y-6 bg-white rounded-xl shadow-lg p-8"
      onSubmit={e => {
        e.preventDefault();
        onNext(form);
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Personal Information</h2>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="Full Name" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" min={18} max={100} placeholder="Age" required value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
        </div>
        <div className="flex-1">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input id="contactNumber" type="tel" placeholder="Contact Number" required value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label htmlFor="preferredLanguage">Preferred Language</Label>
        <select
          id="preferredLanguage"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
          required
          value={form.preferredLanguage}
          onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value }))}
        >
          <option value="">Select Language</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="currentLocation">Current Location</Label>
        <Input id="currentLocation" placeholder="Current Location" required value={form.currentLocation} onChange={e => setForm(f => ({ ...f, currentLocation: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="shortBio">Short Bio</Label>
        <Textarea id="shortBio" placeholder="Introduce yourself in 2–3 sentences" required value={form.shortBio} onChange={e => setForm(f => ({ ...f, shortBio: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="professionalRole">Professional Role</Label>
        <Input id="professionalRole" placeholder="e.g. Senior Lecturer, Industry Expert" required value={form.professionalRole} onChange={e => setForm(f => ({ ...f, professionalRole: e.target.value }))} />
      </div>
      <Button className="w-full mt-4" type="submit">Next</Button>
    </form>
  );
} 