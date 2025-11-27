# ⚠️ Kokoro TTS Models - Gated Repository Notice

## Status: Requires Manual Download

The Kokoro TTS models (`kokoro-v1.0.onnx` and `voices-v1.0.bin`) are hosted on a **gated HuggingFace repository** that requires user authentication and license acceptance.

**Reason:** The model repository is protected to comply with licensing requirements.

---

## Quick Start: Download Files

### Step 1: Accept License on HuggingFace
1. Visit: **https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX**
2. Click "Accept" to agree to the license terms
3. Sign in or create a free HuggingFace account if prompted

### Step 2: Download Files
Once you've accepted the license, you'll see download buttons for:
- ✅ `kokoro-v1.0.onnx` (310 MB)
- ✅ `voices-v1.0.bin` (27 MB)

Click to download both files to your computer.

### Step 3: Place Files in KokoroTTS Folder
Move the downloaded files to:
```
C:\Users\urvas\OneDrive\Desktop\AetherLearn\AetherLearn\KokoroTTS\
```

**Result:**
```
KokoroTTS/
├── kokoro-v1.0.onnx    (310 MB)
├── voices-v1.0.bin      (27 MB)
├── tts_engine.py
├── generate_lecture.py
└── README.md
```

---

## Verify Installation

Run this command to verify files are present:
```bash
python -c "import os; files=[f for f in os.listdir('KokoroTTS') if f.endswith(('.onnx', '.bin'))]; print('✓ Files found:', files if files else 'None')"
```

Expected output:
```
✓ Files found: ['kokoro-v1.0.onnx', 'voices-v1.0.bin']
```

---

## Alternative Methods (If Automated Download Works)

### Using HuggingFace CLI
If you have a HuggingFace account:
```bash
# Install/upgrade huggingface-hub
pip install -U huggingface-hub

# Login to HuggingFace
huggingface-cli login

# Download models
huggingface-cli download hexgrad/Kokoro-82M-v1.0-ONNX --local-dir ./KokoroTTS
```

### Using Git with LFS
If you have git and git-lfs installed:
```bash
cd KokoroTTS
git clone https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX .
```

---

## Troubleshooting

### "Repository Not Found" or "401 Unauthorized"
- **Problem**: Model requires license acceptance
- **Solution**: 
  1. Visit https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX
  2. Click "Accept" button on the page
  3. Sign in if prompted
  4. Re-attempt download

### "File Size" Issues
- Ensure complete downloads (file size should match):
  - `kokoro-v1.0.onnx`: ~310 MB
  - `voices-v1.0.bin`: ~27 MB
- If download was interrupted, delete partial files and re-download

### Files Downloaded but "Not Found"
- Check file names are exact (case-sensitive):
  - ✅ `kokoro-v1.0.onnx` (not `Kokoro-v1.0.onnx`)
  - ✅ `voices-v1.0.bin` (not `Voices-v1.0.bin`)
- Verify folder location: `AetherLearn/KokoroTTS/`

---

## File Information

| File | Size | Format | Purpose |
|------|------|--------|---------|
| kokoro-v1.0.onnx | 310 MB | ONNX Model | Text-to-Speech neural network |
| voices-v1.0.bin | 27 MB | Binary | Voice embeddings/codebook |

---

## License & Attribution

These models are provided by **hexgrad** and are subject to the repository's license.
- Repository: https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX
- Always respect the model license terms

---

## Next Steps After Installation

Once files are downloaded and placed in `KokoroTTS/`:

1. The TTS engine will automatically load these models
2. API endpoints will be available for text-to-speech conversion
3. Integration with lecture generation system will work

Example usage:
```python
from KokoroTTS.tts_engine import KokoroTTSEngine

engine = KokoroTTSEngine()
audio_data = engine.synthesize("Hello, this is a test")
```

---

## Support

For issues with HuggingFace:
- 📖 Documentation: https://huggingface.co/docs
- 💬 Community Forum: https://discuss.huggingface.co/
- 🐛 Issues: https://github.com/huggingface/hub/issues

For issues with Kokoro models:
- 🔗 Model Repository: https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX

---

**Last Updated:** November 28, 2025
