"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SocialLinksForm({ defaultValues, onBack, onSubmit }: any) {
  const [form, setForm] = useState({
    linkedIn: defaultValues.linkedIn || "",
    githubPortfolio: defaultValues.githubPortfolio || "",
    profilePicture: defaultValues.profilePicture || "",
    profilePictureFile: null as File | null,
  });

  // For demo, just store the image as a data URL in local state
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, profilePictureFile: file }));
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, profilePicture: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <form
      className="space-y-6 bg-white rounded-xl shadow-lg p-8"
      onSubmit={e => {
        e.preventDefault();
        if (!form.linkedIn) {
          alert("LinkedIn is required");
          return;
        }
        onSubmit(form);
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Social & Professional Links</h2>
      <div>
        <Label htmlFor="linkedIn">LinkedIn Profile <span className="text-red-500">*</span></Label>
        <Input id="linkedIn" type="url" placeholder="LinkedIn Profile (required)" required value={form.linkedIn} onChange={e => setForm(f => ({ ...f, linkedIn: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="githubPortfolio">GitHub or Portfolio (optional)</Label>
        <Input id="githubPortfolio" type="url" placeholder="GitHub or Portfolio" value={form.githubPortfolio} onChange={e => setForm(f => ({ ...f, githubPortfolio: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="profilePicture">Upload Profile Picture</Label>
        <Input id="profilePicture" type="file" accept="image/*" onChange={handleFile} />
        {form.profilePicture && (
          <img src={form.profilePicture} alt="Profile Preview" className="mt-2 w-24 h-24 object-cover rounded-full border-2 border-blue-500" />
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" type="button" onClick={onBack}>Back</Button>
        <Button className="flex-1" type="submit">Submit</Button>
      </div>
    </form>
  );
} 