import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
  Img,
} from "remotion";

const COLORS = {
  bg: "#313338",
  chatBg: "#313338",
  msgHover: "#2e3035",
  text: "#dbdee1",
  textMuted: "#949ba4",
  textLink: "#00a8fc",
  accent: "#5865f2",
  green: "#23a559",
  divider: "#3f4147",
  embedBg: "#2b2d31",
  embedBorder: "#1e1f22",
  userTag: "#5865f2",
};

const Avatar: React.FC<{ letter: string; color: string; size?: number }> = ({
  letter,
  color,
  size = 40,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.45,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    }}
  >
    {letter}
  </div>
);

const Message: React.FC<{
  username: string;
  avatarLetter: string;
  avatarColor: string;
  time: string;
  delay: number;
  isBot?: boolean;
  children: React.ReactNode;
}> = ({ username, avatarLetter, avatarColor, time, delay, isBot, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
  const opacity = frame < delay ? 0 : interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [12, 0]);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "4px 48px 4px 72px",
        position: "relative",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 16 }}>
        <Avatar letter={avatarLetter} color={avatarColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#f2f3f5" }}>{username}</span>
          {isBot && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: COLORS.userTag,
                borderRadius: 3,
                padding: "1px 5px",
              }}
            >
              APP
            </span>
          )}
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>{time}</span>
        </div>
        <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
};

const TypingDots: React.FC<{ delay: number; duration: number }> = ({ delay, duration }) => {
  const frame = useCurrentFrame();
  if (frame < delay || frame >= delay + duration) return null;
  const dot = frame % 30;
  return (
    <div style={{ display: "flex", gap: 16, padding: "4px 48px 4px 72px", position: "relative" }}>
      <div style={{ position: "absolute", left: 16 }}>
        <Avatar letter="Z" color="#5865f2" />
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "8px 0" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.textMuted,
              opacity: dot > i * 10 && dot < (i + 1) * 10 + 5 ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const NutritionItem: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
    <span style={{ fontSize: 14, color: COLORS.textMuted }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color }}>{value}</span>
  </div>
);

export const FoodAnalysis: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily:
          'Whitney, "Noto Sans SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Channel header */}
      <div
        style={{
          height: 48,
          borderBottom: `1px solid ${COLORS.embedBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 20, color: COLORS.textMuted }}>#</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>fitness-coach</span>
      </div>

      {/* Messages */}
      <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* User sends food photo */}
        <Message
          username="Juggernaut"
          avatarLetter="J"
          avatarColor="#ed4245"
          time="Yesterday at 7:58 PM"
          delay={10}
        >
          <div style={{ marginBottom: 4 }}>这是我今晚吃的 分析一下</div>
          <Img
            src={staticFile("food-soup.png")}
            style={{ borderRadius: 8, maxWidth: 300, maxHeight: 220, objectFit: "cover" }}
          />
        </Message>

        {/* Typing indicator */}
        <TypingDots delay={60} duration={50} />

        {/* Bot response */}
        <Message
          username="ZJ"
          avatarLetter="Z"
          avatarColor="#5865f2"
          time="Yesterday at 7:58 PM"
          delay={110}
          isBot
        >
          <div style={{ marginBottom: 8 }}>
            看起来这顿饭不仅营养均衡，而且非常清淡健康！
          </div>
          <div
            style={{
              backgroundColor: COLORS.embedBg,
              borderLeft: `4px solid ${COLORS.green}`,
              borderRadius: 4,
              padding: 16,
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
              营养成分估算
            </div>
            <NutritionItem label="总热量" value="450 - 550 kcal" color="#f59e0b" />
            <NutritionItem label="蛋白质" value="25-30g" color="#ef4444" />
            <NutritionItem label="碳水化合物" value="60-70g" color={COLORS.green} />
            <NutritionItem label="脂肪" value="10-15g" color="#3b82f6" />
          </div>
        </Message>

        {/* Bot follow-up */}
        <Message
          username="ZJ"
          avatarLetter="Z"
          avatarColor="#5865f2"
          time="Yesterday at 7:58 PM"
          delay={220}
          isBot
        >
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>
            如果是为了更好的减脂效果，下次可以考虑把白米饭的一半替换成粗粮（如燕麦、糙米）。
            需要我帮你把这顿饭记录到今天的饮食日志里吗？
          </div>
        </Message>

        {/* User reply */}
        <Message
          username="Juggernaut"
          avatarLetter="J"
          avatarColor="#ed4245"
          time="Yesterday at 7:59 PM"
          delay={310}
        >
          好的 帮我记录一下
        </Message>

        {/* Bot confirms */}
        <Message
          username="ZJ"
          avatarLetter="Z"
          avatarColor="#5865f2"
          time="Yesterday at 7:59 PM"
          delay={370}
          isBot
        >
          <span style={{ color: COLORS.green }}>已记录！</span> 今日已摄入 500 kcal，剩余 2327 kcal 额度。
        </Message>
      </div>
    </AbsoluteFill>
  );
};
