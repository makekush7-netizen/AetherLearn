# Kokoro TTS Models - Download Instructions

## Overview
The Kokoro TTS (Text-to-Speech) models are required for the KokoroTTS module but are too large to include in Git. These must be downloaded manually from HuggingFace.

## Models Required

1. **kokoro-v1.0.onnx** (310MB)
2. **voices-v1.0.bin** (27MB)

**Total Size:** ~337MB

## Download Steps

### Step 1: Visit HuggingFace Model Repository
Go to: https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX

### Step 2: Accept License (if required)
- You may need to accept the model license agreement
- Sign in with your HuggingFace account if prompted

### Step 3: Download Files
Download both files:
- `kokoro-v1.0.onnx`
- `voices-v1.0.bin`

### Step 4: Place in Correct Folder
Copy the downloaded files to:
```
AetherLearn/KokoroTTS/
```

Your folder structure should look like:
```
AetherLearn/
├── KokoroTTS/
│   ├── kokoro-v1.0.onnx      ← Place here
│   ├── voices-v1.0.bin        ← Place here
│   ├── generate_lecture.py
│   ├── tts_engine.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
├── backend/
└── ...
```

## Verification

Once downloaded, verify the files are in place:
```bash
ls -la AetherLearn/KokoroTTS/
```

You should see:
```
-rw-r--r-- kokoro-v1.0.onnx   (310MB)
-rw-r--r-- voices-v1.0.bin     (27MB)
```

## Alternative: Automated Download

If you have a HuggingFace account with appropriate permissions, you can use:
```bash
python setup_kokoro_models.py
```

Or install the HuggingFace CLI:
```bash
pip install huggingface-hub
huggingface-cli download hexgrad/Kokoro-82M-v1.0-ONNX --local-dir ./KokoroTTS
```

## Troubleshooting

### "Repository Not Found" Error
- Ensure you're using the correct repository: `hexgrad/Kokoro-82M-v1.0-ONNX`
- Make sure you're signed in to HuggingFace
- Accept the license agreement if prompted

### "401 Unauthorized" Error
- Sign in to your HuggingFace account
- Verify you have permission to access the gated model

### Files Not Found After Download
- Double-check the file names (case-sensitive):
  - `kokoro-v1.0.onnx` (not `Kokoro-v1.0.onnx`)
  - `voices-v1.0.bin` (not `Voices-v1.0.bin`)
- Verify they're in the `KokoroTTS/` folder, not a subdirectory

## Using the Models

Once files are in place, the TTS engine can be used via:
```python
from tts_engine import KokoroTTSEngine

engine = KokoroTTSEngine()
audio_data = engine.synthesize_speech(text="Hello World")
```

## Notes

- These files are NOT tracked in Git due to their large size
- They should be added to `.gitignore` (already configured)
- Only download from the official HuggingFace repository
- Keep these files private and don't share them publicly

## Support

For issues with HuggingFace downloads, see:
https://huggingface.co/docs/huggingface_hub/quick-start
