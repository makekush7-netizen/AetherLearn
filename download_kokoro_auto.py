#!/usr/bin/env python3
"""
Download Kokoro TTS models - Enhanced version with fallback methods
This script attempts multiple download methods to acquire the model files.
"""
import os
import sys
import shutil
from pathlib import Path

def download_using_git_lfs():
    """Attempt to download using git with LFS"""
    try:
        print("\n📦 Attempting download using Git LFS...")
        kokoro_folder = Path(__file__).parent / "KokoroTTS"
        kokoro_folder.mkdir(parents=True, exist_ok=True)
        
        # Try using git clone with LFS
        repo_url = "https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX"
        temp_dir = kokoro_folder / "temp_repo"
        
        os.system(f"cd {kokoro_folder} && git clone {repo_url} temp_repo 2>&1 | head -20")
        
        if temp_dir.exists():
            # Copy files
            for file in ["kokoro-v1.0.onnx", "voices-v1.0.bin"]:
                src = temp_dir / file
                dst = kokoro_folder / file
                if src.exists():
                    shutil.copy2(src, dst)
                    size_mb = dst.stat().st_size / (1024*1024)
                    print(f"  ✓ {file} ({size_mb:.1f}MB)")
            
            # Cleanup
            shutil.rmtree(temp_dir)
            return True
    except Exception as e:
        print(f"  ✗ Git LFS method failed: {e}")
    
    return False

def download_using_wget():
    """Attempt to download using wget command"""
    try:
        print("\n📥 Attempting download using wget...")
        kokoro_folder = Path(__file__).parent / "KokoroTTS"
        kokoro_folder.mkdir(parents=True, exist_ok=True)
        
        base_url = "https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX/resolve/main"
        files = {
            "kokoro-v1.0.onnx": "310MB",
            "voices-v1.0.bin": "27MB"
        }
        
        for filename, size in files.items():
            output_path = kokoro_folder / filename
            if output_path.exists():
                print(f"  ✓ {filename} already exists")
                continue
            
            url = f"{base_url}/{filename}"
            print(f"  Downloading {filename} ({size})...")
            os.system(f"wget -q {url} -O {output_path} 2>&1")
            
            if output_path.exists() and output_path.stat().st_size > 0:
                size_mb = output_path.stat().st_size / (1024*1024)
                print(f"  ✓ {filename} ({size_mb:.1f}MB)")
            else:
                print(f"  ✗ {filename} download failed")
                return False
        
        return True
    except Exception as e:
        print(f"  ✗ wget method failed: {e}")
    
    return False

def download_using_curl():
    """Attempt to download using curl command"""
    try:
        print("\n🔗 Attempting download using curl...")
        kokoro_folder = Path(__file__).parent / "KokoroTTS"
        kokoro_folder.mkdir(parents=True, exist_ok=True)
        
        base_url = "https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX/resolve/main"
        files = {
            "kokoro-v1.0.onnx": "310MB",
            "voices-v1.0.bin": "27MB"
        }
        
        for filename, size in files.items():
            output_path = kokoro_folder / filename
            if output_path.exists():
                print(f"  ✓ {filename} already exists")
                continue
            
            url = f"{base_url}/{filename}"
            print(f"  Downloading {filename} ({size})...")
            cmd = f"curl -L -o {output_path} {url} 2>&1 | grep -E 'Downloaded|%'"
            os.system(cmd)
            
            if output_path.exists() and output_path.stat().st_size > 0:
                size_mb = output_path.stat().st_size / (1024*1024)
                print(f"  ✓ {filename} ({size_mb:.1f}MB)")
            else:
                print(f"  ✗ {filename} download failed")
                return False
        
        return True
    except Exception as e:
        print(f"  ✗ curl method failed: {e}")
    
    return False

def show_manual_instructions():
    """Show manual download instructions"""
    print("\n" + "="*70)
    print("⚠️  MANUAL DOWNLOAD REQUIRED")
    print("="*70)
    print("""
The Kokoro TTS models are hosted on a gated HuggingFace repository.
This repository requires authentication or acceptance of license terms.

STEPS TO DOWNLOAD MANUALLY:

1. Open your browser and visit:
   https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX

2. Sign in or create a HuggingFace account:
   https://huggingface.co/join

3. Accept the model license (if prompted)

4. Download these two files:
   ✓ kokoro-v1.0.onnx (310 MB)
   ✓ voices-v1.0.bin (27 MB)

5. Place them in:
   """)
    kokoro_folder = Path(__file__).parent / "KokoroTTS"
    print(f"   {kokoro_folder}\n")
    print("="*70)
    print("""
FOLDER STRUCTURE AFTER DOWNLOAD:

AetherLearn/
├── KokoroTTS/
│   ├── kokoro-v1.0.onnx    ← Place here
│   ├── voices-v1.0.bin     ← Place here
│   ├── tts_engine.py
│   ├── generate_lecture.py
│   └── ...

VERIFY INSTALLATION:

After placing the files, run:
  python -c "import os; path='KokoroTTS'; files=[f for f in os.listdir(path) if f.endswith(('.onnx', '.bin'))]; print('✓ Files found:', files if files else 'No files')"

ALTERNATIVE - Using HuggingFace CLI:

If you have git-lfs installed:
  git clone https://huggingface.co/hexgrad/Kokoro-82M-v1.0-ONNX KokoroTTS

Or using huggingface-cli:
  pip install -U huggingface-hub
  huggingface-cli login
  huggingface-cli download hexgrad/Kokoro-82M-v1.0-ONNX --local-dir ./KokoroTTS
""")
    print("="*70 + "\n")

def main():
    print("="*70)
    print("🎵 Kokoro TTS Model Downloader")
    print("="*70)
    
    kokoro_folder = Path(__file__).parent / "KokoroTTS"
    kokoro_folder.mkdir(parents=True, exist_ok=True)
    
    # Check if files already exist
    onnx_exists = (kokoro_folder / "kokoro-v1.0.onnx").exists()
    voices_exists = (kokoro_folder / "voices-v1.0.bin").exists()
    
    if onnx_exists and voices_exists:
        print("\n✅ All model files already present!")
        print(f"   Location: {kokoro_folder}")
        onnx_size = (kokoro_folder / "kokoro-v1.0.onnx").stat().st_size / (1024*1024)
        voices_size = (kokoro_folder / "voices-v1.0.bin").stat().st_size / (1024*1024)
        print(f"   - kokoro-v1.0.onnx: {onnx_size:.1f}MB")
        print(f"   - voices-v1.0.bin: {voices_size:.1f}MB")
        print("="*70)
        return True
    
    # Try different download methods
    methods = [
        ("Git LFS", download_using_git_lfs),
        ("curl", download_using_curl),
        ("wget", download_using_wget),
    ]
    
    for method_name, method_func in methods:
        try:
            if method_func():
                print(f"\n✅ Successfully downloaded using {method_name}!")
                print("="*70)
                return True
        except Exception as e:
            print(f"\n❌ {method_name} failed: {e}")
    
    # If all methods fail, show manual instructions
    show_manual_instructions()
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
