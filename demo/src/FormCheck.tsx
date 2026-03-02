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
  text: "#dbdee1",
  textMuted: "#949ba4",
  accent: "#5865f2",
  green: "#23a559",
  yellow: "#f0b232",
  embedBg: "#2b2d31",
  embedBorder: "#1e1f22",
  userTag: "#5865f2",
};

const Avatar: React.FC<{ letter: string; color: string }> = ({ letter, color }) => (
  <div
    style={{
      width: 40, height: 40, borderRadius: "50%", backgroundColor: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}
  >
    {letter}
  </div>
);

const Message: React.FC<{
  username: string; avatarLetter: string; avatarColor: string;
  time: string; delay: number; isBot?: boolean; children: React.ReactNode;
}> = ({ username, avatarLetter, avatarColor, time, delay, isBot, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
  const opacity = frame < delay ? 0 : interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [12, 0]);

  return (
    <div style={{
      display: "flex", gap: 16, padding: "4px 48px 4px 72px",
      position: "relative", opacity, transform: `translateY(${translateY}px)`,
    }}>
      <div style={{ position: "absolute", left: 16 }}>
        <Avatar letter={avatarLetter} color={avatarColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#f2f3f5" }}>{username}</span>
          {isBot && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: "#fff",
              backgroundColor: COLORS.userTag, borderRadius: 3, padding: "1px 5px",
            }}>APP</span>
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
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            backgroundColor: COLORS.textMuted,
            opacity: dot > i * 10 && dot < (i + 1) * 10 + 5 ? 1 : 0.3,
          }} />
        ))}
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string; good: boolean; delay: number }> = ({ text, good, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
  const opacity = frame < delay ? 0 : p;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, opacity }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        backgroundColor: good ? COLORS.green : COLORS.yellow,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#fff", fontWeight: 700,
      }}>{good ? "✓" : "!"}</div>
      <span style={{ fontSize: 14, color: good ? COLORS.green : COLORS.yellow }}>{text}</span>
    </div>
  );
};

export const FormCheck: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      fontFamily: 'Whitney, "Noto Sans SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: "hidden",
    }}>
      {/* Channel header */}
      <div style={{
        height: 48, borderBottom: `1px solid ${COLORS.embedBorder}`,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 8,
      }}>
        <span style={{ fontSize: 20, color: COLORS.textMuted }}>#</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>fitness-coach</span>
      </div>

      <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* User sends gym video */}
        <Message username="Juggernaut" avatarLetter="J" avatarColor="#ed4245"
          time="Yesterday at 8:08 PM" delay={10}>
          <div style={{ marginBottom: 4 }}>我最近在练弹跳 我教练让我练深蹲高翻为主的训练</div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Img src={staticFile("form-gym.png")}
              style={{ borderRadius: 8, maxWidth: 240, maxHeight: 280, objectFit: "cover" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 0, height: 0, borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent", borderLeft: "16px solid #fff",
                marginLeft: 3,
              }} />
            </div>
          </div>
        </Message>

        <TypingDots delay={70} duration={60} />

        {/* Bot analysis */}
        <Message username="ZJ" avatarLetter="Z" avatarColor="#5865f2"
          time="Yesterday at 8:09 PM" delay={130} isBot>
          <div style={{ marginBottom: 8 }}>
            想起来了，你身高 179cm，体重 81kg。这身材练弹跳很有潜力啊，尤其是你现在 22 岁，正处于爆发力开发的黄金期。
          </div>
          <div style={{
            backgroundColor: COLORS.embedBg, borderLeft: `4px solid ${COLORS.accent}`,
            borderRadius: 4, padding: 16, marginTop: 8,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
              动作分析
            </div>
            <CheckItem text="发力感很好：爆发耸肩和髋部充分伸展" good={true} delay={180} />
            <CheckItem text="接杠稳健：Front Rack 锁得很死" good={true} delay={195} />
            <CheckItem text="呼吸与核心：吸气支撑，核心收得比较紧" good={true} delay={210} />
          </div>
        </Message>

        {/* Bot tips */}
        <Message username="ZJ" avatarLetter="Z" avatarColor="#5865f2"
          time="Yesterday at 8:09 PM" delay={280} isBot>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>
            针对弹跳训练的建议：负荷安排保持在 1-3 次一组的高强度水平，侧重功率输出（Power Output）而不是耐力。
            你想记录一下今天的训练数据吗？
          </div>
        </Message>

        {/* User reply */}
        <Message username="Juggernaut" avatarLetter="J" avatarColor="#ed4245"
          time="Yesterday at 8:10 PM" delay={370}>
          好的 今天高翻 80kg 3x3 深蹲 120kg 4x4
        </Message>

        {/* Bot confirms */}
        <Message username="ZJ" avatarLetter="Z" avatarColor="#5865f2"
          time="Yesterday at 8:10 PM" delay={430} isBot>
          <span style={{ color: COLORS.green }}>已记录！</span> 今日训练量：高翻 720kg / 深蹲 1920kg，总量 2640kg。
        </Message>
      </div>
    </AbsoluteFill>
  );
};
