"use client";
import { useSearchParams } from "next/navigation";

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const roadmap = searchParams.get("roadmap");
  const error = searchParams.get("error");

  return (
    <div>
      <h1>Generated Roadmap</h1>
      {error ? (
        <p style={{ color: "red" }}>{decodeURIComponent(error)}</p>
      ) : roadmap ? (
        <pre>{decodeURIComponent(roadmap)}</pre>
      ) : (
        <p>No roadmap generated yet.</p>
      )}
    </div>
  );
}
