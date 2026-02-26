"use client";

import { useState, useRef } from "react";

const LANGUAGES = [
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "ta-IN", name: "Tamil" },
  { code: "te-IN", name: "Telugu" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "kn-IN", name: "Kannada" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "mr-IN", name: "Marathi" },
  { code: "pa-IN", name: "Punjabi" },
  { code: "od-IN", name: "Odia" },
  { code: "en-IN", name: "English (Indian)" },
];

const SPEAKERS: Record<string, { name: string; gender: "Male" | "Female" }[]> =
  {
    male: [
      { name: "Shubh", gender: "Male" },
      { name: "Aditya", gender: "Male" },
      { name: "Rahul", gender: "Male" },
      { name: "Rohan", gender: "Male" },
      { name: "Amit", gender: "Male" },
      { name: "Dev", gender: "Male" },
      { name: "Ratan", gender: "Male" },
      { name: "Varun", gender: "Male" },
      { name: "Manan", gender: "Male" },
      { name: "Sumit", gender: "Male" },
      { name: "Kabir", gender: "Male" },
      { name: "Aayan", gender: "Male" },
      { name: "Ashutosh", gender: "Male" },
      { name: "Advait", gender: "Male" },
      { name: "Anand", gender: "Male" },
      { name: "Tarun", gender: "Male" },
      { name: "Sunny", gender: "Male" },
      { name: "Mani", gender: "Male" },
      { name: "Gokul", gender: "Male" },
      { name: "Vijay", gender: "Male" },
      { name: "Mohit", gender: "Male" },
      { name: "Rehan", gender: "Male" },
      { name: "Soham", gender: "Male" },
    ],
    female: [
      { name: "Ritu", gender: "Female" },
      { name: "Priya", gender: "Female" },
      { name: "Neha", gender: "Female" },
      { name: "Pooja", gender: "Female" },
      { name: "Simran", gender: "Female" },
      { name: "Kavya", gender: "Female" },
      { name: "Ishita", gender: "Female" },
      { name: "Shreya", gender: "Female" },
      { name: "Roopa", gender: "Female" },
      { name: "Amelia", gender: "Female" },
      { name: "Sophia", gender: "Female" },
      { name: "Tanya", gender: "Female" },
      { name: "Shruti", gender: "Female" },
      { name: "Suhani", gender: "Female" },
      { name: "Kavitha", gender: "Female" },
      { name: "Rupali", gender: "Female" },
    ],
  };

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [speaker, setSpeaker] = useState("Shubh");
  const [pace, setPace] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const availableSpeakers = SPEAKERS[gender];

  function handleGenderChange(newGender: "male" | "female") {
    setGender(newGender);
    setSpeaker(SPEAKERS[newGender][0].name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          target_language_code: language,
          speaker: speaker.toLowerCase(),
          pace,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate speech");
      }

      if (data.audios && data.audios.length > 0) {
        const audioBase64 = data.audios[0];
        const audioBlob = base64ToBlob(audioBase64, "audio/wav");
        const url = URL.createObjectURL(audioBlob);

        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
      } else {
        throw new Error("No audio returned from the API");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `sarvam-tts-${Date.now()}.wav`;
    a.click();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Sarvam Text to Speech
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Convert text to natural speech using Bulbul v3
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Text to speak
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              rows={4}
              maxLength={2500}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {text.length}/2500
            </p>
          </div>

          {/* Language */}
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium mb-2"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </div>

          {/* Gender Toggle */}
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleGenderChange("male")}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                  gender === "male"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange("female")}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                  gender === "female"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Speaker */}
          <div>
            <label
              htmlFor="speaker"
              className="block text-sm font-medium mb-2"
            >
              Voice ({availableSpeakers.length} available)
            </label>
            <select
              id="speaker"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSpeakers.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pace */}
          <div>
            <label htmlFor="pace" className="block text-sm font-medium mb-2">
              Pace: {pace.toFixed(1)}x
            </label>
            <input
              id="pace"
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={pace}
              onChange={(e) => setPace(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.5x (Slow)</span>
              <span>1.0x</span>
              <span>2.0x (Fast)</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating..." : "Generate Speech"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-300">
            {error}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mt-6 p-6 rounded-lg bg-gray-900 border border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold">Generated Audio</h2>
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              autoPlay
              className="w-full"
            />
            <button
              onClick={handleDownload}
              className="w-full py-2.5 rounded-lg bg-gray-800 text-gray-200 font-medium hover:bg-gray-700 transition-colors"
            >
              Download Audio
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
