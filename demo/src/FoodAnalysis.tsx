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
  userBubble: "#3b82f6",
  aiBubble: "#1e293b",
};

// Chat Message Component
const ChatMessage: React.FC<{
  isUser: boolean;
  children: React.ReactNode;
  delay: number;
  avatar?: string;
}> = ({ isUser, children, delay, avatar }) => {
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
          maxWidth: "70%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Food Card Component
const FoodCard: React.FC<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  delay: number;
}> = ({ name, calories, protein, carbs, fat, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 12,
        padding: 16,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${scale})`,
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.text,
          marginBottom: 12,
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.accent }}>
            {calories}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>kcal</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>
            {protein}g
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Protein</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>
            {carbs}g
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Carbs</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>
            {fat}g
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Fat</div>
        </div>
      </div>
    </div>
  );
};

// Image Preview Component
const ImagePreview: React.FC<{
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

  return (
    <div
      style={{
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 12,
        padding: 8,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${scale})`,
        maxWidth: 200,
      }}
    >
      <div
        style={{
          width: 180,
          height: 120,
          borderRadius: 8,
          background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        🥗
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 12,
          color: COLORS.textMuted,
        }}
      >
        meal.jpg
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
export const FoodAnalysis: React.FC = () => {
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
        {/* User sends image */}
        <ChatMessage isUser={true} delay={20}>
          <ImagePreview delay={30} />
        </ChatMessage>

        {/* User message */}
        <ChatMessage isUser={true} delay={60}>
          <div style={{ color: COLORS.text, fontSize: 15 }}>
            What's in this meal?
          </div>
        </ChatMessage>

        {/* Typing indicator */}
        <TypingIndicator delay={100} duration={60} />

        {/* AI Response */}
        <ChatMessage isUser={false} delay={160}>
          <div style={{ color: COLORS.text, fontSize: 15, marginBottom: 8 }}>
            I've analyzed your meal! Here's the breakdown:
          </div>
          <FoodCard
            name="Grilled Chicken Salad"
            calories={420}
            protein={35}
            carbs={18}
            fat={22}
            delay={200}
          />
        </ChatMessage>

        {/* Second AI message */}
        <ChatMessage isUser={false} delay={260}>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>
            This is a great high-protein, moderate-carb meal. Perfect for your cutting goal! Would you like me to log this to your daily intake?
          </div>
        </ChatMessage>

        {/* User confirmation */}
        <ChatMessage isUser={true} delay={340}>
          <div style={{ color: COLORS.text, fontSize: 15 }}>
            Yes, please log it!
          </div>
        </ChatMessage>

        {/* Final AI response */}
        <ChatMessage isUser={false} delay={400}>
          <div style={{ color: COLORS.success, fontSize: 15 }}>
            ✅ Meal logged! You've consumed 420 kcal today. Remaining: 1,580 kcal
          </div>
        </ChatMessage>
      </div>
    </AbsoluteFill>
  );
};
