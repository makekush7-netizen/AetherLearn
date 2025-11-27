# KokoroTTS - Standalone Text-to-Speech Engine

A self-contained Kokoro TTS package you can copy to any Python project.

## Setup

### 1. Install Dependencies
```bash
pip install kokoro-onnx numpy scipy sounddevice
```

### 2. Download Model Files
Download these files from HuggingFace and place them in this folder:
- `kokoro-v1.0.onnx` - The main TTS model
- `voices-v1.0.bin` - Voice pack

Download link: https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX

### 3. Folder Structure
```
KokoroTTS/
    tts_engine.py      # Main engine
    kokoro-v1.0.onnx   # Model file (download)
    voices-v1.0.bin    # Voices file (download)
    README.md          # This file
```

## Usage

### Basic Usage
```python
from KokoroTTS.tts_engine import KokoroTTS

# Initialize
tts = KokoroTTS()

# Speak text (plays audio directly)
tts.speak("Hello world!")

# Different voice
tts.speak("Hello!", voice="am_michael")

# Save to file
tts.save("Save this text", "output.wav")
```

### Available Voices
| Voice ID | Gender | Description |
|----------|--------|-------------|
| af_sarah | Female | Clear, professional |
| af_nicole | Female | Warm, friendly |
| af_sky | Female | Natural, casual |
| am_michael | Male | Deep, professional |
| am_adam | Male | Friendly |
| am_liam | Male | Young, casual |

### Long Text
```python
# For long text, use speak_long() for chunked streaming
tts.speak_long(long_text, voice="af_sky", chunk_size=300)
```

### Advanced Options
```python
# Custom speed
tts.speak("Fast speech", speed=1.2)
tts.speak("Slow speech", speed=0.8)

# Disable cache
tts.speak("No cache", use_cache=False)

# Clear cache
tts.clear_cache()

# Get raw audio
samples, sample_rate = tts.synthesize("Get audio data")
```

## Integration Example

```python
# In your project
import sys
sys.path.insert(0, "path/to/KokoroTTS")

from tts_engine import KokoroTTS

class MyApp:
    def __init__(self):
        self.tts = KokoroTTS()
    
    def say(self, text):
        self.tts.speak(text, voice="af_nicole")
```

## For Claude/AI Assistants

When using this in a new project, tell your AI assistant:

```
I have a KokoroTTS folder in my project with a standalone TTS engine.
To use it:
1. from KokoroTTS.tts_engine import KokoroTTS
2. tts = KokoroTTS()
3. tts.speak("text", voice="af_sky")

Available voices: af_sarah, af_nicole, af_sky (female), am_michael, am_adam, am_liam (male)
```

## Troubleshooting

**FileNotFoundError: Kokoro model not found**
- Download `kokoro-v1.0.onnx` from HuggingFace
- Place it in the KokoroTTS folder

**FileNotFoundError: Voices file not found**
- Download `voices-v1.0.bin` from HuggingFace
- Place it in the KokoroTTS folder

**No audio output**
- Check your speakers/headphones
- Try: `pip install sounddevice --upgrade`
