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
  text: "#f8fafc",
  textMuted: "#94a3b8",
  success: "#22c55e",
};

// Animated Text Component
const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const translateY = interpolate(frame - delay, [0, 15], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
  index: number;
}> = ({ icon, title, description, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
    },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        width: 280,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: COLORS.textMuted,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  );
};

// Main Demo Component
export const ZymDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation
  const gradientAngle = interpolate(frame, [0, 300], [0, 360]);

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Title animation
  const titleProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Features section
  const featuresDelay = 60;

  // Terminal animation
  const terminalDelay = 150;
  const terminalProgress = spring({
    frame: frame - terminalDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Typing animation for terminal
  const typingFrame = frame - terminalDelay - 20;
  const commandText = "bash scripts/analyze-food.sh meal.jpg";
  const visibleChars = Math.min(
    Math.floor(interpolate(typingFrame, [0, 60], [0, commandText.length])),
    commandText.length
  );

  // Result animation
  const resultDelay = terminalDelay + 100;
  const resultProgress = spring({
    frame: frame - resultDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `conic-gradient(from ${gradientAngle}deg at 50% 50%,
            rgba(99, 102, 241, 0.15) 0deg,
            rgba(139, 92, 246, 0.15) 120deg,
            rgba(245, 158, 11, 0.1) 240deg,
            rgba(99, 102, 241, 0.15) 360deg)`,
          filter: "blur(60px)",
        }}
      />

      {/* Header Section */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          opacity: logoScale,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
          }}
        >
          ZYM
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          AI-Powered Fitness & Lifestyle Assistant
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
          opacity: subtitleProgress,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: COLORS.textMuted,
          }}
        >
          Script-based protocol for intelligent fitness coaching
        </div>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <FeatureCard
          icon="🍎"
          title="Food Analysis"
          description="Snap a photo and get instant calorie estimates with AI vision"
          delay={featuresDelay}
          index={0}
        />
        <FeatureCard
          icon="🏋️"
          title="Form Check"
          description="Upload workout videos for AI-powered technique feedback"
          delay={featuresDelay + 10}
          index={1}
        />
        <FeatureCard
          icon="📊"
          title="Progress Tracking"
          description="Log meals and workouts with automatic summaries"
          delay={featuresDelay + 20}
          index={2}
        />
      </div>

      {/* Terminal Demo */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: `translateX(-50%) scale(${terminalProgress})`,
          opacity: terminalProgress,
          width: 600,
        }}
      >
        {/* Terminal Window */}
        <div
          style={{
            backgroundColor: "#1a1b26",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Terminal Header */}
          <div
            style={{
              backgroundColor: "#24283b",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#f7768e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#e0af68",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#9ece6a",
              }}
            />
            <div
              style={{
                marginLeft: 12,
                fontSize: 13,
                color: COLORS.textMuted,
              }}
            >
              Terminal
            </div>
          </div>

          {/* Terminal Content */}
          <div
            style={{
              padding: 16,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div style={{ color: "#7aa2f7" }}>
              $ <span style={{ color: "#c0caf5" }}>{commandText.slice(0, visibleChars)}</span>
              {typingFrame >= 0 && typingFrame < 60 && (
                <span
                  style={{
                    animation: "blink 1s infinite",
                    color: "#c0caf5",
                  }}
                >
                  ▋
                </span>
              )}
            </div>

            {/* Result */}
            {frame >= resultDelay && (
              <div
                style={{
                  marginTop: 12,
                  color: "#9ece6a",
                  opacity: resultProgress,
                  transform: `translateY(${interpolate(resultProgress, [0, 1], [10, 0])}px)`,
                }}
              >
                <div style={{ color: "#bb9af7", marginBottom: 8 }}>=== Food Analysis ===</div>
                <div>🍽️ Grilled Chicken Salad</div>
                <div style={{ color: COLORS.textMuted }}>Calories: 420 kcal</div>
                <div style={{ color: COLORS.textMuted }}>Protein: 35g | Carbs: 18g | Fat: 22g</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
