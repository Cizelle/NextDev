"use client";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const roadmap = searchParams.get("roadmap");
  const error = searchParams.get("error");

  const components = {
    h1: ({ node, ...props }) => (
      <div className="border-b-2 border-purple-300 py-2 mb-3">
        <h1 className="text-xl font-bold text-purple-700">{props.children}</h1>
      </div>
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-lg font-semibold mb-2 text-purple-600 bg-purple-50 p-2 rounded-md">
        {props.children}
      </h2>
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-md font-semibold mb-1 text-purple-700 border-l-4 border-purple-400 pl-2">
        {props.children}
      </h3>
    ),
    p: ({ node, ...props }) => (
      <p className="mb-2 text-purple-900">{props.children}</p>
    ),
    ul: ({ node, ...props }) => (
      <ul className="space-y-1 mb-3">{props.children}</ul>
    ),
    li: ({ node, ...props }) => (
      <li className="flex items-start mb-1">
        <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mt-1.5 mr-2 flex-shrink-0"></span>
        <span>{props.children}</span>
      </li>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm my-2">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-purple-100 px-1 rounded text-purple-800" {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ node, ...props }) => (
      <blockquote className="bg-purple-50 p-3 rounded-md border-l-4 border-purple-300 mb-3 italic text-purple-700">
        {props.children}
      </blockquote>
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-semibold text-purple-800">
        {props.children}
      </strong>
    ),
    em: ({ node, ...props }) => (
      <em className="italic text-purple-700">{props.children}</em>
    ),
  };

  const Decorations = () => {
    const [leftDecorations, setLeftDecorations] = useState([]);
    const [rightDecorations, setRightDecorations] = useState([]);

    useEffect(() => {
      const newLeftDecorations = [...Array(20)].map((_, i) => ({
        width: `${Math.random() * 60 + 20}px`,
        height: `${Math.random() * 60 + 20}px`,
        backgroundColor: `rgba(168, 85, 247, ${Math.random() * 0.15 + 0.05})`,
        left: `${Math.random() * 32}px`,
        top: `${i * 5}%`,
      }));

      const newLeftLargeDecorations = [...Array(8)].map((_, i) => ({
        width: `${Math.random() * 120 + 40}px`,
        height: `${Math.random() * 120 + 40}px`,
        backgroundColor: `rgba(192, 132, 252, ${Math.random() * 0.1 + 0.05})`,
        left: `-${Math.random() * 40 + 20}px`,
        top: `${i * 12}%`,
      }));

      setLeftDecorations([...newLeftDecorations, ...newLeftLargeDecorations]);

      const newRightDecorations = [...Array(20)].map((_, i) => ({
        width: `${Math.random() * 60 + 20}px`,
        height: `${Math.random() * 60 + 20}px`,
        backgroundColor: `rgba(168, 85, 247, ${Math.random() * 0.15 + 0.05})`,
        right: `${Math.random() * 32}px`,
        top: `${i * 5}%`,
      }));

      const newRightLargeDecorations = [...Array(8)].map((_, i) => ({
        width: `${Math.random() * 120 + 40}px`,
        height: `${Math.random() * 120 + 40}px`,
        backgroundColor: `rgba(192, 132, 252, ${Math.random() * 0.1 + 0.05})`,
        right: `-${Math.random() * 40 + 20}px`,
        top: `${i * 13 + 5}%`,
      }));

      setRightDecorations([
        ...newRightDecorations,
        ...newRightLargeDecorations,
      ]);
    }, []);

    return (
      <>
        <div className="fixed left-0 top-0 h-full w-32 bg-gradient-to-r from-purple-100 to-transparent opacity-80 z-0">
          <div className="absolute inset-0">
            {leftDecorations.map((deco, i) => (
              <div
                key={`left-${i}`}
                className="absolute rounded-full"
                style={{
                  width: deco.width,
                  height: deco.height,
                  backgroundColor: deco.backgroundColor,
                  left: deco.left,
                  top: deco.top,
                }}
              />
            ))}
          </div>
        </div>

        <div className="fixed right-0 top-0 h-full w-32 bg-gradient-to-l from-purple-100 to-transparent opacity-80 z-0">
          <div className="absolute inset-0">
            {rightDecorations.map((deco, i) => (
              <div
                key={`right-${i}`}
                className="absolute rounded-full"
                style={{
                  width: deco.width,
                  height: deco.height,
                  backgroundColor: deco.backgroundColor,
                  right: deco.right,
                  top: deco.top,
                }}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  const TimelineConnection = ({ sections }) => (
    <div className="absolute left-8 top-0 bottom-0 w-1 bg-purple-200 z-0">
      {sections.map((_, index) => (
        <div
          key={`connection-${index}`}
          className="absolute w-8 h-1 bg-purple-200"
          style={{ top: `${(index * 100) / sections.length + 5}%`, left: 0 }}
        />
      ))}
    </div>
  );

  const renderContent = (markdown) => {
    if (!markdown) return null;

    const phaseRegex = /## Phase \d+:/g;
    const matches = [...markdown.matchAll(phaseRegex)];

    if (matches.length === 0)
      return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>;

    const sections = [];
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];
      const start = currentMatch.index;
      const end = nextMatch ? nextMatch.index : markdown.length;
      sections.push(markdown.substring(start, end));
    }

    return (
      <div className="relative">
        <TimelineConnection sections={sections} />
        {sections.map((section, index) => {
          const titleMatch = section.match(/## Phase (\d+): (.+)/);
          const phaseNumber = titleMatch ? titleMatch[1] : "?";
          const phaseTitle = titleMatch ? titleMatch[2] : "Unknown";

          const content = section.replace(/## Phase \d+: .+\n/, "");

          return (
            <div
              key={index}
              className="p-5 rounded-xl mb-6 shadow-md relative overflow-hidden z-10 flex"
              style={{
                background: "linear-gradient(135deg, #f3e8ff, #f5f3ff)",
                borderLeft: "5px solid #c084fc",
                borderRight: "1px solid #e9d5ff",
              }}
            >
              <div
                className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 mr-4"
                style={{ top: "calc(50% - 32px)" }}
              >
                {phaseNumber}
              </div>

              <div className="overflow-y-auto">
                <h2 className="text-xl font-bold text-purple-700 mb-3">
                  {phaseTitle}
                </h2>

                <div className="text-sm pl-3 border-l-2 border-purple-200">
                  <ReactMarkdown components={components}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="absolute top-2 right-2 w-20 h-20 opacity-5 pointer-events-none">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="50" fill="#a855f7" />
                  <path
                    d="M30,50 L70,50 M50,30 L50,70"
                    stroke="#fff"
                    strokeWidth="8"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Decorations />
      <div className="max-w-6xl mx-auto my-8 px-6 md:px-8 lg:px-12 pt-8 pb-16 relative z-10">
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{decodeURIComponent(error)}</p>
          </div>
        ) : roadmap ? (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-purple-100">
            <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">
              Your AI Learning Roadmap
            </h1>
            {renderContent(decodeURIComponent(roadmap))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-purple-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600">
              No roadmap generated yet. Fill out the form to create your
              personalized learning path.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
