<div align="center">

# ZYM Skill

**AI-Powered Fitness & Lifestyle Assistant Skill**

A script-based skill protocol for building intelligent fitness coaches with AI vision capabilities.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-orange.svg)](https://openrouter.ai/)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API Reference](#api-reference)

</div>

---

## Overview

ZYM Skill is a **script-based protocol** that transforms any AI assistant into a powerful fitness and lifestyle coach. Unlike generic chatbots, ZYM follows a structured approach:

```
User Input → Script Protocol → Structured Data → Intelligent Response
```

### Why Script-Based?

- **Deterministic Behavior**: Scripts ensure consistent, predictable responses
- **Data Integrity**: User data is stored in structured JSON files
- **Vision AI Integration**: Analyze food photos and workout videos with multimodal AI
- **Privacy-First**: All data stored locally, no cloud dependency

---

## Features

### Smart Food Tracking
Snap a photo of your meal and get instant calorie and macro estimates using AI vision.

### Workout Form Analysis
Upload workout videos for AI-powered form checks, technique feedback, and injury risk assessment.

### Intelligent Training Logs
Log workouts with automatic volume calculation and calorie burn estimation.

### Personalized Profiles
BMR/TDEE calculations using Mifflin-St Jeor or Katch-McArdle formulas.

### Goal-Based Planning
Support for cutting, bulking, and maintenance goals with automatic calorie targets.

### Context-Aware Conversations
Maintains conversation context for natural follow-up questions.

---

## Demo

### Animation Preview

![ZYM Demo Animation](demo/demo.gif)

### Real-World Examples

**Food Analysis** - Simply send a photo of your meal:

![Food Analysis Demo](demo/out/food-analysis.gif)

**Workout Form Check** - Upload your lifting video for AI coaching:

![Form Check Demo](demo/out/form-check.gif)

---

## Installation

### Prerequisites

- Python 3.8 or higher
- [OpenRouter API Key](https://openrouter.ai/keys) (for AI features)
- Optional: `ffmpeg` for video processing

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Juggernaut0825/skill_zym.git
cd skill_zym

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

### Configuration

Edit `.env` with your API key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## Usage

### Standalone Scripts

You can run any script directly:

```bash
# Set up your profile
bash scripts/set-profile.sh '{"height_cm":175,"weight_kg":70,"age":25,"gender":"male"}'

# Log a meal
bash scripts/log-meal.sh "chicken breast 200g with rice"

# Analyze a food photo
bash scripts/analyze-food.sh /path/to/food.jpg

# Log training
bash scripts/log-training.sh '[{"name":"Back Squat","sets":4,"reps":"4","weight_kg":112.5}]'

# Check today's summary
bash scripts/summary.sh today
```

### Integration with AI Agents

ZYM Skill is designed to be used as a skill in AI agent frameworks. The `SKILL.md` file contains the complete protocol specification for AI agents to follow.

The skill uses environment variables for user isolation:
- `ZJ_USER_ID` - Unique user identifier
- `ZJ_DATA_DIR` - Custom data directory path
- `ZJ_SESSION_FILE` - Session context file path
- `ZJ_MEDIA_INDEX_FILE` - Media index file path

---

## API Reference

### Profile Management

| Script | Description |
|--------|-------------|
| `get-profile.sh` | Retrieve user profile with BMR/TDEE |
| `set-profile.sh '<json>'` | Update profile data |
| `set-goal.sh <cut\|bulk\|maintain>` | Set fitness goal |

### Food Tracking

| Script | Description |
|--------|-------------|
| `log-meal.sh "<description>"` | Log meal by description |
| `analyze-food.sh <image_path>` | Analyze food from image |
| `get-daily-intake.sh [date]` | Get daily nutrition summary |

### Training

| Script | Description |
|--------|-------------|
| `log-training.sh '<json>'` | Log workout data |
| `get-daily-training.sh [date]` | Get daily training summary |
| `analyze-form.sh <video_path>` | AI form check for videos |

### Media & Context

| Script | Description |
|--------|-------------|
| `inspect-media.sh --media-id <id> --question "..." --domain <type>` | Analyze media content |
| `list-recent-media.sh [--active-only]` | List available media |
| `get-context.sh [--scope summary\|recent\|full]` | Get conversation context |

### Summaries

| Script | Description |
|--------|-------------|
| `summary.sh [today\|week]` | Get progress summary |
| `history.sh [days]` | View historical logs |

---

## Data Structure

```
data/
└── <user_id>/
    ├── profile.json          # User profile and goals
    ├── daily.json            # Daily meals and training
    ├── training_plan.json    # Generated training plan
    ├── context/
    │   ├── session.json      # Conversation context
    │   └── transcript.ndjson # Message history
    ├── media/
    │   ├── index.json        # Media manifest
    │   └── YYYY-MM-DD/       # Date-organized media files
    └── analyses/
        └── <media_id>/       # Media analysis results
```

---

## Supported Media Formats

### Images
- JPG, JPEG, PNG, GIF, WebP, HEIC

### Videos
- MP4, WebM, MOV, AVI, MKV

> Note: Videos over 20MB may have processing limitations.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with for fitness enthusiasts**

[Report Bug](https://github.com/Juggernaut0825/skill_zym/issues) · [Request Feature](https://github.com/Juggernaut0825/skill_zym/issues)

</div>
