import { SettingsForm } from "@/components/student/settings-form";

export default function StudentSettingsPage() {
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-slate-600">Update your profile details used across the learning dashboard.</p>
      <SettingsForm />
    </div>
  );
}
