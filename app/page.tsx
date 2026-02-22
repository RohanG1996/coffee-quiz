"use client";

import { useState, useEffect } from "react";

const GOLD = "#c8a96e";
const BG = "#0a0a0a";
const BG_CARD = "#141414";
const BG_SELECTED = "#1e1a10";

type PersonalityKey = "bold" | "sweet" | "social" | "indulgent";

const personalities: Record<
  PersonalityKey,
  { name: string; drink: string; tagline: string }
> = {
  bold: {
    name: "Bold Adventurer",
    drink: "Cold Brew Black",
    tagline: "No sugar, no apologies. Pure, unapologetic caffeine.",
  },
  sweet: {
    name: "Sweet Enthusiast",
    drink: "Vanilla Latte",
    tagline: "Life's better with a little sweetness — and a lot of foam.",
  },
  social: {
    name: "Social Butterfly",
    drink: "Iced Caramel Macchiato",
    tagline: "Always in someone's story. Always in hand.",
  },
  indulgent: {
    name: "Indulgent Treat",
    drink: "Mocha Frappuccino",
    tagline: "Why settle? You deserve the full experience.",
  },
};

interface QuestionOption {
  emoji: string;
  text: string;
  personality: PersonalityKey;
}

interface Question {
  text: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    text: "You're picking a movie for Friday night. What genre wins?",
    options: [
      {
        emoji: "💥",
        text: "Action thriller — bring the adrenaline",
        personality: "bold",
      },
      {
        emoji: "💕",
        text: "Rom-com — give me all the feels",
        personality: "sweet",
      },
      {
        emoji: "😂",
        text: "Comedy — something we can all quote later",
        personality: "social",
      },
      {
        emoji: "🎭",
        text: "Prestige drama — cinema is art",
        personality: "indulgent",
      },
    ],
  },
  {
    text: "Your go-to playlist vibe right now?",
    options: [
      {
        emoji: "🔥",
        text: "Hard-hitting hip-hop or rock — max energy",
        personality: "bold",
      },
      {
        emoji: "🌸",
        text: "Feel-good pop anthems on repeat",
        personality: "sweet",
      },
      {
        emoji: "🎉",
        text: "Whatever's trending — I like being current",
        personality: "social",
      },
      {
        emoji: "🎷",
        text: "Indie, jazz, or lo-fi — it's a whole mood",
        personality: "indulgent",
      },
    ],
  },
  {
    text: "You spot your celebrity crush at a coffee shop. You...",
    options: [
      {
        emoji: "🚀",
        text: "Walk up and introduce yourself immediately",
        personality: "bold",
      },
      {
        emoji: "🥰",
        text: "Smile and hope they notice you",
        personality: "sweet",
      },
      {
        emoji: "📱",
        text: "Text all your friends before doing anything",
        personality: "social",
      },
      {
        emoji: "📸",
        text: "Take a sneaky photo to tell the story forever",
        personality: "indulgent",
      },
    ],
  },
  {
    text: "Your ideal Saturday looks like...",
    options: [
      {
        emoji: "🏔️",
        text: "Spontaneous road trip or extreme sport",
        personality: "bold",
      },
      {
        emoji: "🌿",
        text: "Farmers market, brunch, golden hour walk",
        personality: "sweet",
      },
      {
        emoji: "🥂",
        text: "Hosting a big group hangout at yours",
        personality: "social",
      },
      {
        emoji: "🛁",
        text: "Long bath, great book, zero obligations",
        personality: "indulgent",
      },
    ],
  },
  {
    text: "Pick a show to binge RIGHT NOW:",
    options: [
      {
        emoji: "🧗",
        text: "Surviving the wild — Bear Grylls type stuff",
        personality: "bold",
      },
      {
        emoji: "🍰",
        text: "The Great British Bake Off",
        personality: "sweet",
      },
      {
        emoji: "💍",
        text: "Reality TV — Love Island or The Bachelor",
        personality: "social",
      },
      {
        emoji: "👑",
        text: "Prestige drama — Succession, The Crown, etc.",
        personality: "indulgent",
      },
    ],
  },
];

type View = "welcome" | "quiz" | "results";

export default function Home() {
  const [view, setView] = useState<View>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    (PersonalityKey | null)[]
  >(Array(5).fill(null));
  const [scores, setScores] = useState<Record<PersonalityKey, number>>({
    bold: 0,
    sweet: 0,
    social: 0,
    indulgent: 0,
  });
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    setIsEmbed(new URLSearchParams(window.location.search).get("embed") === "true");
  }, []);

  useEffect(() => {
    if (!isEmbed) return;
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: "coffee-quiz-height", height }, "*");
  }, [view, isEmbed]);

  function startQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(5).fill(null));
    setScores({ bold: 0, sweet: 0, social: 0, indulgent: 0 });
    setView("quiz");
  }

  function selectAnswer(personality: PersonalityKey) {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = personality;
    setSelectedAnswers(updated);
  }

  function nextQuestion() {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const tally: Record<PersonalityKey, number> = {
        bold: 0,
        sweet: 0,
        social: 0,
        indulgent: 0,
      };
      selectedAnswers.forEach((p) => {
        if (p) tally[p]++;
      });
      setScores(tally);
      setView("results");
    }
  }

  if (view === "welcome") return <WelcomeScreen onStart={startQuiz} isEmbed={isEmbed} />;
  if (view === "quiz")
    return (
      <QuizScreen
        question={questions[currentQuestion]}
        questionIndex={currentQuestion}
        selected={selectedAnswers[currentQuestion]}
        onSelect={selectAnswer}
        onNext={nextQuestion}
      />
    );
  return <ResultsScreen scores={scores} onRetake={startQuiz} isEmbed={isEmbed} />;
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart, isEmbed }: { onStart: () => void; isEmbed: boolean }) {
  return (
    <div
      style={{ background: BG, minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-lg w-full text-center">
        {!isEmbed && (
          <p
            style={{
              color: GOLD,
              fontFamily: "var(--font-bebas-neue), sans-serif",
              letterSpacing: "0.2em",
            }}
            className="text-sm mb-8 uppercase"
          >
            Basecamp Coffee
          </p>
        )}

        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            lineHeight: 1.0,
            color: "#ffffff",
          }}
          className="text-7xl md:text-8xl mb-8"
        >
          What&apos;s Your Coffee Personality?
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
          className="text-lg mb-12 leading-relaxed"
        >
          5 questions. No wrong answers.
          <br />
          Your perfect drink awaits.
        </p>

        <button
          onClick={onStart}
          style={{
            background: GOLD,
            color: "#0a0a0a",
            fontFamily: "var(--font-bebas-neue), sans-serif",
            letterSpacing: "0.12em",
          }}
          className="px-14 py-4 text-xl cursor-pointer hover:opacity-90 transition-opacity"
        >
          START THE QUIZ
        </button>
      </div>
    </div>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────

function QuizScreen({
  question,
  questionIndex,
  selected,
  onSelect,
  onNext,
}: {
  question: Question;
  questionIndex: number;
  selected: PersonalityKey | null;
  onSelect: (p: PersonalityKey) => void;
  onNext: () => void;
}) {
  const total = 5;
  const optionPrefixes = ["01", "02", "03", "04"];

  return (
    <div
      style={{ background: BG, minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-xl w-full">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-10">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "3px",
                flex: 1,
                background: i <= questionIndex ? GOLD : "#2a2a2a",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Question number */}
        <p
          style={{
            color: GOLD,
            fontFamily: "var(--font-bebas-neue), sans-serif",
            letterSpacing: "0.15em",
          }}
          className="text-sm mb-4 uppercase"
        >
          {String(questionIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        {/* Question text */}
        <h2
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            lineHeight: 1.1,
            color: "#ffffff",
          }}
          className="text-4xl md:text-5xl mb-8"
        >
          {question.text}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {question.options.map((option, i) => {
            const isSelected = selected === option.personality;
            return (
              <button
                key={i}
                onClick={() => onSelect(option.personality)}
                style={{
                  background: isSelected ? BG_SELECTED : BG_CARD,
                  border: `1px solid ${isSelected ? GOLD : "#2a2a2a"}`,
                  color: "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                }}
                className="w-full px-5 py-4 flex items-center gap-4 hover:border-[#4a4a4a]"
              >
                <span
                  style={{
                    color: isSelected ? GOLD : "#555",
                    fontFamily: "var(--font-bebas-neue), sans-serif",
                    letterSpacing: "0.05em",
                    minWidth: "24px",
                  }}
                  className="text-sm"
                >
                  {optionPrefixes[i]}
                </span>
                <span className="text-xl">{option.emoji}</span>
                <span className="text-base leading-snug">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Next button — appears after selection */}
        {selected && (
          <div className="flex justify-end">
            <button
              onClick={onNext}
              style={{
                background: GOLD,
                color: "#0a0a0a",
                fontFamily: "var(--font-bebas-neue), sans-serif",
                letterSpacing: "0.12em",
              }}
              className="px-10 py-3 text-lg cursor-pointer hover:opacity-90 transition-opacity"
            >
              {questionIndex < 4 ? "NEXT" : "SEE MY RESULTS"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  scores,
  onRetake,
  isEmbed,
}: {
  scores: Record<PersonalityKey, number>;
  onRetake: () => void;
  isEmbed: boolean;
}) {
  const total = 5;

  const sorted = (Object.keys(scores) as PersonalityKey[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const topKey = sorted[0];

  return (
    <div
      style={{ background: BG, minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-xl w-full">
        {/* Header */}
        {!isEmbed && (
          <p
            style={{
              color: GOLD,
              fontFamily: "var(--font-bebas-neue), sans-serif",
              letterSpacing: "0.2em",
            }}
            className="text-sm mb-3 uppercase text-center"
          >
            Basecamp Coffee
          </p>
        )}
        <h2
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            color: "#ffffff",
            lineHeight: 1.05,
          }}
          className="text-5xl md:text-6xl text-center mb-12"
        >
          Your Coffee Personality
        </h2>

        {/* Result cards */}
        <div className="flex flex-col gap-4 mb-12">
          {sorted.map((key, index) => {
            const p = personalities[key];
            const score = scores[key];
            const pct = Math.round((score / total) * 100);
            const isTop = index === 0;

            return (
              <div
                key={key}
                style={{
                  background: isTop ? "#1a1508" : BG_CARD,
                  border: `1px solid ${isTop ? GOLD : "#2a2a2a"}`,
                  padding: isTop ? "28px" : "20px",
                }}
              >
                {/* Top badge */}
                {isTop && (
                  <p
                    style={{
                      color: GOLD,
                      fontFamily: "var(--font-bebas-neue), sans-serif",
                      letterSpacing: "0.18em",
                    }}
                    className="text-xs mb-3 uppercase"
                  >
                    Your Top Match
                  </p>
                )}

                {/* Name + percentage */}
                <div className="flex items-baseline justify-between mb-3">
                  <h3
                    style={{
                      fontFamily: "var(--font-bebas-neue), sans-serif",
                      color: isTop ? GOLD : "#ffffff",
                      lineHeight: 1,
                    }}
                    className={isTop ? "text-3xl" : "text-2xl"}
                  >
                    {p.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-bebas-neue), sans-serif",
                      color: isTop ? GOLD : "#666",
                    }}
                    className={isTop ? "text-3xl" : "text-2xl"}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Percentage bar */}
                <div
                  style={{
                    height: isTop ? "4px" : "2px",
                    background: "#2a2a2a",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: isTop ? GOLD : "#4a4a4a",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>

                {/* Drink + tagline */}
                <p
                  style={{
                    color: isTop ? "#ffffff" : "#9ca3af",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: isTop ? 600 : 400,
                  }}
                  className="text-sm mb-1"
                >
                  {p.drink}
                </p>
                {isTop && (
                  <p
                    style={{
                      color: "#9ca3af",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                    }}
                    className="text-sm leading-relaxed"
                  >
                    {p.tagline}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Retake button */}
        <div className="text-center">
          <button
            onClick={onRetake}
            style={{
              border: `1px solid ${GOLD}`,
              color: GOLD,
              background: "transparent",
              fontFamily: "var(--font-bebas-neue), sans-serif",
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}
            className="px-10 py-3 text-lg hover:opacity-70 transition-opacity"
          >
            TAKE THE QUIZ AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}
