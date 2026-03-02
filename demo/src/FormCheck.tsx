import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";

// Colors
const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  background: "#0f172a",
  surface: "#1e293b",
  surfaceLight: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  userBubble: "#3b82f6",
  aiBubble: "#1e293b",
};

// Chat Message Component
const ChatMessage: React.FC<{
  isUser: boolean;
  children: React.ReactNode;
  delay: number;
}> = ({ isUser, children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 12,
        marginBottom: 16,
        opacity: frame < delay ? 0 : opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: isUser ? COLORS.userBubble : COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {isUser ? "👤" : "🏋️"}
      </div>

      {/* Message Bubble */}
      <div
        style={{
          backgroundColor: isUser ? COLORS.userBubble : COLORS.aiBubble,
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          padding: "12px 16px",
          maxWidth: "75%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Video Preview Component
const VideoPreview: React.FC<{
  delay: number;
}> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  // Simulate video playback with changing icons
  const exerciseIcons = ["🏋️", "💪", "🏋️‍♂️", "🦵"];
  const iconIndex = Math.floor((frame / 15) % exerciseIcons.length);

  return (
    <div
      style={{
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 12,
        padding: 8,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${scale})`,
        maxWidth: 220,
      }}
    >
      <div
        style={{
          width: 200,
          height: 130,
          borderRadius: 8,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          position: "relative",
        }}
      >
        {exerciseIcons[iconIndex]}
        {/* Play button overlay */}
        <div
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          ▶️
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 12,
          color: COLORS.textMuted,
        }}
      >
        squat_form.mp4
      </div>
    </div>
  );
};

// Form Analysis Card Component
const FormAnalysisCard: React.FC<{
  delay: number;
}> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  const issues = [
    { text: "Knees caving in slightly", status: "warning" },
    { text: "Good depth achieved", status: "success" },
    { text: "Back position neutral", status: "success" },
    { text: "Weight distribution even", status: "success" },
  ];

  return (
    <div
      style={{
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 12,
        padding: 16,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${scale})`,
        marginTop: 8,
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.text,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        📊 Form Analysis - Back Squat
      </div>
      {issues.map((issue, index) => {
        const issueDelay = delay + 20 + index * 15;
        const issueProgress = spring({
          frame: frame - issueDelay,
          fps,
          config: { damping: 20, stiffness: 100 },
        });
        const issueOpacity = frame < issueDelay ? 0 : issueProgress;
        const issueTranslateX = interpolate(issueProgress, [0, 1], [-10, 0]);

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              opacity: issueOpacity,
              transform: `translateX(${issueTranslateX}px)`,
            }}
          >
            <span
              style={{
                fontSize: 16,
              }}
            >
              {issue.status === "success" ? "✅" : "⚠️"}
            </span>
            <span
              style={{
                fontSize: 13,
                color: issue.status === "success" ? COLORS.success : COLORS.warning,
              }}
            >
              {issue.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Score Card Component
const ScoreCard: React.FC<{
  score: number;
  delay: number;
}> = ({ score, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const animatedScore = Math.floor(interpolate(progress, [0, 1], [0, score]));

  return (
    <div
      style={{
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 12,
        padding: 16,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${scale})`,
        textAlign: "center",
        marginTop: 12,
      }}
    >
      <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>
        Overall Form Score
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.error,
        }}
      >
        {animatedScore}%
      </div>
    </div>
  );
};

// Typing Indicator
const TypingIndicator: React.FC<{
  delay: number;
  duration: number;
}> = ({ delay, duration }) => {
  const frame = useCurrentFrame();

  const visible = frame >= delay && frame < delay + duration;
  const dotOffset = frame % 30;

  return visible ? (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        🏋️
      </div>
      <div
        style={{
          backgroundColor: COLORS.aiBubble,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
          padding: "12px 16px",
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.textMuted,
              opacity: dotOffset > i * 10 && dotOffset < (i + 1) * 10 + 5 ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  ) : null;
};

// Main Component
export const FormCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animation
  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: COLORS.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${COLORS.surfaceLight}`,
          opacity: headerProgress,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 28, marginRight: 12 }}>🏋️</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>
          ZYM Assistant
        </div>
      </div>

      {/* Chat Container */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 40,
          right: 40,
          bottom: 40,
        }}
      >
        {/* User sends video */}
        <ChatMessage isUser={true} delay={20}>
          <VideoPreview delay={30} />
        </ChatMessage>

        {/* User message */}
        <ChatMessage isUser={true} delay={60}>
          <div style={{ color: COLORS.text, fontSize: 15 }}>
            Can you check my squat form?
          </div>
        </ChatMessage>

        {/* Typing indicator */}
        <TypingIndicator delay={100} duration={80} />

        {/* AI Response */}
        <ChatMessage isUser={false} delay={180}>
          <div style={{ color: COLORS.text, fontSize: 15, marginBottom: 8 }}>
            I've analyzed your squat form! Here's my feedback:
          </div>
          <FormAnalysisCard delay={220} />
        </ChatMessage>

        {/* Score */}
        <ChatMessage isUser={false} delay={350}>
          <ScoreCard score={85} delay={370} />
        </ChatMessage>

        {/* Recommendation */}
        <ChatMessage isUser={false} delay={430}>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>
            💡 <strong style={{ color: COLORS.text }}>Tip:</strong> Focus on pushing your knees out during the descent. Try banded squats to strengthen your hip abductors.
          </div>
        </ChatMessage>

        {/* User thanks */}
        <ChatMessage isUser={true} delay={510}>
          <div style={{ color: COLORS.text, fontSize: 15 }}>
            Thanks! I'll work on that.
          </div>
        </ChatMessage>
      </div>
    </AbsoluteFill>
  );
};
