"use client";

import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Upload", link: "/upload" },
  { name: "About", link: "/about" },
];

type QAPair = {
  question: string;
  answer: string;
};

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qaData, setQaData] = useState<QAPair[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We push a state so that when the user hits back, popstate fires.
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      // Use hard redirect to avoid Next.js unhandled suspense/history corruption on popstate
      window.location.href = '/';
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [router]);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    setFiles(uploadedFiles);
    setError(null);
    setIsLoading(true);
    setQaData(null);

    try {
      const file = uploadedFiles[0]; // Take the first file
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/generate-qa", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate Q&A");
      }

      setQaData(data.qaData);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* ─── Navbar ─── */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton href="/" variant="primary">
            Get Started
          </NavbarButton>
        </NavBody>
      </Navbar>

      {/* ─── Main Content ─── */}
      <main
        className="relative z-10 flex min-h-screen flex-col items-center px-4"
        style={{ paddingTop: "120px", paddingBottom: "64px" }}
      >
        {!qaData && (
          <div className="text-center w-full max-w-2xl mx-auto" style={{ marginBottom: "48px" }}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Upload Your Manual
            </h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
              Harness the power of neural mapping. Upload your lab manuals or curriculum
              documents to initialize your AI Examiner.
            </p>
          </div>
        )}

        {/* Upload box — hidden when qaData is successfully populated */}
        {!qaData && (
          <div
            className="w-full max-w-3xl relative z-20 transition-all duration-500"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              background: "rgba(10,10,10,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <FileUpload onChange={handleFileUpload} />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-12 animate-pulse z-20">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-300 font-medium tracking-widest uppercase text-sm">
              Analyzing Document & Generating Questions...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 max-w-2xl w-full text-center z-20">
            <span className="font-semibold block mb-1">Processing Failed</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generated Q&A Display */}
        {qaData && !isLoading && (
          <div className="w-full max-w-4xl mx-auto mt-8 z-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Generated Assessment</h2>
                <p className="text-neutral-400">Review the extracted curriculum questions below.</p>
              </div>
              <button
                onClick={() => {
                  setQaData(null);
                  setFiles([]);
                }}
                className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Upload Another
              </button>
            </div>

            <div className="grid gap-6">
              {qaData.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/[0.07] hover:border-white/20 overflow-hidden"
                >
                  {/* Subtle top gradient */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-neutral-300">
                      {idx + 1}
                    </div>
                    <div className="space-y-3 flex-1">
                      <h3 className="font-semibold text-lg text-neutral-100 leading-snug">
                        {item.question}
                      </h3>
                      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                      <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                        <strong className="text-neutral-300">Answer:</strong> {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
