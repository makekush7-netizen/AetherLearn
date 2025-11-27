"""
Generate lecture audio for AetherLearn demo
Uses KokoroTTS to create WAV files for the Photosynthesis lecture
"""

import os
import sys
from pathlib import Path

# Import from same directory
from tts_engine import KokoroTTS

# Lecture script - matches the 3 slides
LECTURE_SCRIPT = [
    {
        "slide": 1,
        "text": """Welcome to today's lesson on Photosynthesis! 
        This is one of the most fundamental processes in biology, 
        and it's literally the reason we can breathe and survive on this planet.
        Let's dive in and explore how plants create food from sunlight.""",
        "filename": "slide1_intro.wav"
    },
    {
        "slide": 2,
        "text": """So, what exactly is photosynthesis? 
        In simple terms, it's the process where plants convert sunlight, water, and carbon dioxide 
        into glucose, which is their food, and oxygen, which we breathe.
        The chemical equation is: 6 CO2 plus 6 H2O plus light energy 
        gives us C6H12O6, that's glucose, plus 6 O2, that's oxygen.
        Think of plants as tiny factories powered by the sun!""",
        "filename": "slide2_what_is.wav"
    },
    {
        "slide": 3,
        "text": """Now, where does this amazing process happen?
        Inside plant cells, there are special structures called chloroplasts.
        These contain chlorophyll, the green pigment that gives plants their color.
        Chlorophyll is like a solar panel - it captures light energy from the sun
        and uses it to power the whole process.
        That's why plants need sunlight to grow!""",
        "filename": "slide3_where.wav"
    }
]

def generate_lecture_audio():
    """Generate WAV files for the lecture"""
    
    print("="*60)
    print("AetherLearn Lecture Audio Generator")
    print("="*60)
    
    # Output directory
    output_dir = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "photosynthesis"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\nOutput directory: {output_dir}")
    
    # Initialize TTS
    print("\nInitializing KokoroTTS...")
    tts = KokoroTTS()
    
    # Choose a teacher voice
    voice = "am_liam"  # Male teacher voice (Liam)
    speed = 0.95  # Slightly slower for clarity
    
    print(f"Using voice: {voice}")
    print(f"Speed: {speed}")
    
    # Generate audio for each slide
    print("\n" + "-"*60)
    print("Generating audio files...")
    print("-"*60)
    
    generated_files = []
    
    for item in LECTURE_SCRIPT:
        slide_num = item["slide"]
        text = item["text"]
        filename = item["filename"]
        output_path = output_dir / filename
        
        print(f"\n[Slide {slide_num}] Generating: {filename}")
        print(f"  Text preview: {text[:60]}...")
        
        try:
            # Generate and save audio
            saved_path = tts.save(
                text=text,
                output_path=str(output_path),
                voice=voice,
                speed=speed,
                lang="en-us"
            )
            
            # Get file size
            file_size = os.path.getsize(saved_path) / 1024  # KB
            
            print(f"  ✓ Saved: {saved_path} ({file_size:.1f} KB)")
            generated_files.append(saved_path)
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    # Summary
    print("\n" + "="*60)
    print("Generation Complete!")
    print("="*60)
    print(f"\nGenerated {len(generated_files)} audio files:")
    for f in generated_files:
        print(f"  - {f}")
    
    print(f"\nTotal size: {sum(os.path.getsize(f) for f in generated_files) / 1024:.1f} KB")
    
    return generated_files


def test_playback():
    """Test playing the generated audio"""
    print("\n" + "-"*60)
    print("Testing playback...")
    print("-"*60)
    
    audio_dir = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "photosynthesis"
    
    tts = KokoroTTS()
    
    for item in LECTURE_SCRIPT:
        filename = item["filename"]
        filepath = audio_dir / filename
        
        if filepath.exists():
            print(f"\nPlaying: {filename}")
            
            # Load and play
            from scipy.io import wavfile
            sr, samples = wavfile.read(filepath)
            samples = samples.astype(float) / 32767
            
            tts.play(samples, sr)
        else:
            print(f"File not found: {filepath}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate lecture audio")
    parser.add_argument("--test", action="store_true", help="Test playback after generation")
    args = parser.parse_args()
    
    # Generate audio
    generate_lecture_audio()
    
    # Test if requested
    if args.test:
        test_playback()
