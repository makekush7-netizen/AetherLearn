"""
Lecture Generator Module for AetherLearn
Generates audio (using KokoroTTS) and slides (SVG) for 3D classroom lectures
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
import uuid

# Add KokoroTTS to path
KOKORO_PATH = Path(__file__).parent.parent / "KokoroTTS"
sys.path.insert(0, str(KOKORO_PATH))

from tts_engine import KokoroTTS

# ==================== CONSTANTS ====================

VOICES = {
    "male": {
        "michael": "am_michael",
        "adam": "am_adam", 
        "liam": "am_liam"
    },
    "female": {
        "sarah": "af_sarah",
        "nicole": "af_nicole",
        "sky": "af_sky"
    }
}

ANIMATION_CUES = {
    "[POINT]": "PointToBoard",      # Point at the whiteboard
    "[GESTURE]": "Gesture",          # Hand gesture while explaining
    "[THINK]": "Thinking",           # Thoughtful pose
    "[NOD]": "Nod",                  # Nodding agreement
    "[WAVE]": "Wave",                # Greeting wave
    "[IDLE]": "Idle"                 # Return to idle
}

# Default output directory (relative to frontend/public)
OUTPUT_BASE = Path(__file__).parent.parent / "frontend" / "public" / "lectures"

# ==================== SLIDE GENERATOR ====================

def generate_slide_svg(
    title: str,
    content: list[str],
    slide_number: int,
    total_slides: int,
    theme: str = "dark",
    accent_color: str = "#6366f1"  # Primary purple
) -> str:
    """
    Generate an SVG slide for the whiteboard
    
    Args:
        title: Slide title
        content: List of bullet points or paragraphs
        slide_number: Current slide number
        total_slides: Total number of slides
        theme: "dark" or "light"
        accent_color: Accent color for highlights
    
    Returns:
        SVG string
    """
    
    # Theme colors
    if theme == "dark":
        bg_color = "#1e1e2e"
        text_color = "#ffffff"
        secondary_color = "#a0a0b0"
        border_color = "#3d3d5c"
    else:
        bg_color = "#ffffff"
        text_color = "#1a1a2e"
        secondary_color = "#666680"
        border_color = "#e0e0e8"
    
    # Build content elements
    content_elements = []
    y_pos = 280
    
    for i, item in enumerate(content):
        # Check if it's a bullet point (starts with - or •)
        is_bullet = item.strip().startswith(('-', '•', '*'))
        
        if is_bullet:
            # Bullet point
            text = item.strip().lstrip('-•* ')
            content_elements.append(f'''
    <g transform="translate(120, {y_pos})">
      <circle cx="0" cy="12" r="6" fill="{accent_color}"/>
      <text x="24" y="18" font-family="Arial, sans-serif" font-size="32" fill="{text_color}">{escape_xml(text)}</text>
    </g>''')
        else:
            # Regular paragraph
            content_elements.append(f'''
    <text x="120" y="{y_pos + 18}" font-family="Arial, sans-serif" font-size="32" fill="{text_color}">{escape_xml(item)}</text>''')
        
        y_pos += 80
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1920" height="1080" fill="{bg_color}"/>
  
  <!-- Border/Frame -->
  <rect x="40" y="40" width="1840" height="1000" rx="24" ry="24" 
        fill="none" stroke="{border_color}" stroke-width="3"/>
  
  <!-- Accent bar -->
  <rect x="40" y="40" width="12" height="1000" rx="6" fill="{accent_color}"/>
  
  <!-- Title -->
  <text x="120" y="140" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="{text_color}">
    {escape_xml(title)}
  </text>
  
  <!-- Title underline -->
  <line x1="120" y1="170" x2="800" y2="170" stroke="{accent_color}" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Content -->
  {"".join(content_elements)}
  
  <!-- Slide number -->
  <text x="1800" y="1000" font-family="Arial, sans-serif" font-size="28" fill="{secondary_color}" text-anchor="end">
    {slide_number} / {total_slides}
  </text>
  
  <!-- AetherLearn watermark -->
  <text x="120" y="1000" font-family="Arial, sans-serif" font-size="24" fill="{secondary_color}" opacity="0.6">
    AetherLearn
  </text>
</svg>'''
    
    return svg


def escape_xml(text: str) -> str:
    """Escape special XML characters"""
    return (text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;"))


# ==================== LECTURE GENERATOR ====================

class LectureGenerator:
    """
    Generate complete lectures with audio and slides
    """
    
    def __init__(self, voice: str = "liam", speed: float = 0.95):
        """
        Initialize the lecture generator
        
        Args:
            voice: Voice name (michael, adam, liam, sarah, nicole, sky)
            speed: Speech speed (0.5-2.0)
        """
        self.tts = KokoroTTS()
        self.speed = speed
        
        # Resolve voice name to voice ID
        voice_lower = voice.lower()
        if voice_lower in VOICES["male"]:
            self.voice_id = VOICES["male"][voice_lower]
        elif voice_lower in VOICES["female"]:
            self.voice_id = VOICES["female"][voice_lower]
        else:
            # Try direct voice ID
            self.voice_id = voice
        
        print(f"[LectureGenerator] Initialized with voice: {self.voice_id}")
    
    def parse_script(self, script: str) -> list[dict]:
        """
        Parse a lecture script with animation cues
        
        Format:
        ---
        SLIDE: Title Here
        - Bullet point 1
        - Bullet point 2
        
        SPEECH: The narration text goes here. [POINT] As you can see on the board...
        ---
        
        Returns list of segments with slide content, speech, and animation cues
        """
        segments = []
        
        # Split by --- dividers or double newlines
        raw_segments = re.split(r'\n---+\n|\n\n\n+', script.strip())
        
        for seg in raw_segments:
            if not seg.strip():
                continue
            
            segment = {
                "slide": {"title": "", "content": []},
                "speech": "",
                "animations": []
            }
            
            lines = seg.strip().split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check for section headers
                if line.upper().startswith("SLIDE:"):
                    current_section = "slide"
                    segment["slide"]["title"] = line[6:].strip()
                elif line.upper().startswith("SPEECH:"):
                    current_section = "speech"
                    speech_text = line[7:].strip()
                    if speech_text:
                        segment["speech"] = speech_text
                elif current_section == "slide":
                    # Add to slide content
                    segment["slide"]["content"].append(line)
                elif current_section == "speech":
                    # Append to speech
                    segment["speech"] += " " + line if segment["speech"] else line
            
            # Extract animation cues from speech
            for cue, anim_name in ANIMATION_CUES.items():
                if cue in segment["speech"]:
                    # Find position (rough timing based on text position)
                    pos = segment["speech"].find(cue)
                    ratio = pos / len(segment["speech"]) if segment["speech"] else 0
                    segment["animations"].append({
                        "animation": anim_name,
                        "timing": ratio  # 0-1 representing position in audio
                    })
            
            # Clean animation cues from speech text (for TTS)
            clean_speech = segment["speech"]
            for cue in ANIMATION_CUES.keys():
                clean_speech = clean_speech.replace(cue, "")
            segment["speech_clean"] = clean_speech.strip()
            
            if segment["slide"]["title"] or segment["speech"]:
                segments.append(segment)
        
        return segments
    
    def generate_lecture(
        self,
        lecture_id: str,
        title: str,
        script: str,
        theme: str = "dark",
        accent_color: str = "#6366f1"
    ) -> dict:
        """
        Generate a complete lecture from script
        
        Args:
            lecture_id: Unique identifier for the lecture
            title: Lecture title
            script: Lecture script with SLIDE: and SPEECH: sections
            theme: "dark" or "light"
            accent_color: Accent color hex
        
        Returns:
            Dictionary with lecture metadata and file paths
        """
        print(f"\n{'='*60}")
        print(f"Generating Lecture: {title}")
        print(f"ID: {lecture_id}")
        print(f"{'='*60}\n")
        
        # Create output directory
        output_dir = OUTPUT_BASE / lecture_id
        output_dir.mkdir(parents=True, exist_ok=True)
        
        slides_dir = output_dir / "slides"
        audio_dir = output_dir / "audio"
        slides_dir.mkdir(exist_ok=True)
        audio_dir.mkdir(exist_ok=True)
        
        # Parse script
        segments = self.parse_script(script)
        total_slides = len(segments)
        
        print(f"Parsed {total_slides} segments\n")
        
        # Generate each segment
        lecture_data = {
            "id": lecture_id,
            "title": title,
            "created_at": datetime.now().isoformat(),
            "voice": self.voice_id,
            "theme": theme,
            "total_slides": total_slides,
            "segments": []
        }
        
        for i, segment in enumerate(segments):
            slide_num = i + 1
            print(f"[{slide_num}/{total_slides}] {segment['slide']['title']}")
            
            # Generate slide SVG
            slide_svg = generate_slide_svg(
                title=segment["slide"]["title"],
                content=segment["slide"]["content"],
                slide_number=slide_num,
                total_slides=total_slides,
                theme=theme,
                accent_color=accent_color
            )
            
            slide_path = slides_dir / f"slide{slide_num}.svg"
            with open(slide_path, "w", encoding="utf-8") as f:
                f.write(slide_svg)
            print(f"  ✓ Slide saved: {slide_path.name}")
            
            # Generate audio
            audio_path = audio_dir / f"audio{slide_num}.wav"
            if segment["speech_clean"]:
                self.tts.save(
                    text=segment["speech_clean"],
                    output_path=str(audio_path),
                    voice=self.voice_id,
                    speed=self.speed
                )
                audio_size = os.path.getsize(audio_path) / 1024
                print(f"  ✓ Audio saved: {audio_path.name} ({audio_size:.1f} KB)")
            else:
                print(f"  ⚠ No speech for this segment")
                audio_path = None
            
            # Add segment data
            segment_data = {
                "index": slide_num,
                "slide": {
                    "title": segment["slide"]["title"],
                    "path": f"/lectures/{lecture_id}/slides/slide{slide_num}.svg"
                },
                "audio": {
                    "path": f"/lectures/{lecture_id}/audio/audio{slide_num}.wav" if audio_path else None,
                    "text": segment["speech_clean"]
                },
                "animations": segment["animations"]
            }
            lecture_data["segments"].append(segment_data)
        
        # Save lecture metadata
        metadata_path = output_dir / "lecture.json"
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(lecture_data, f, indent=2)
        print(f"\n✓ Metadata saved: {metadata_path}")
        
        print(f"\n{'='*60}")
        print(f"Lecture Generated Successfully!")
        print(f"Output: {output_dir}")
        print(f"{'='*60}\n")
        
        return lecture_data


# ==================== CLI INTERFACE ====================

def main():
    """CLI for testing lecture generation"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate AetherLearn Lecture")
    parser.add_argument("--title", default="Test Lecture", help="Lecture title")
    parser.add_argument("--voice", default="liam", help="Voice (michael, adam, liam, sarah, nicole, sky)")
    parser.add_argument("--speed", type=float, default=0.95, help="Speech speed")
    parser.add_argument("--theme", default="dark", choices=["dark", "light"], help="Slide theme")
    parser.add_argument("--script-file", help="Path to script file")
    args = parser.parse_args()
    
    # Example script if no file provided
    example_script = """
SLIDE: Introduction to the Solar System
- Our cosmic neighborhood
- 8 planets orbiting the Sun
- Countless moons, asteroids, and comets

SPEECH: Welcome to today's lesson on the Solar System! [GESTURE] Our solar system is a fascinating place, home to eight unique planets, countless moons, and mysterious objects like asteroids and comets. [POINT] As you can see on the board, we'll be exploring our cosmic neighborhood today.

---

SLIDE: The Inner Planets
- Mercury: Closest to the Sun
- Venus: Hottest planet
- Earth: Our home
- Mars: The Red Planet

SPEECH: Let's start with the inner planets, also known as the terrestrial planets. [POINT] Looking at the board, we have Mercury, the smallest and closest to the Sun. Then Venus, which is actually the hottest planet due to its thick atmosphere. Earth, our beautiful home, and Mars, the Red Planet that scientists are eager to explore.

---

SLIDE: The Outer Planets  
- Jupiter: Largest planet
- Saturn: Famous for its rings
- Uranus: Tilted on its side
- Neptune: Windiest planet

SPEECH: [GESTURE] Now let's venture into the outer solar system! These are the gas giants and ice giants. [POINT] Jupiter is massive - you could fit over 1,300 Earths inside it! Saturn's beautiful rings are made of ice and rock. Uranus spins on its side, and Neptune has the strongest winds in the solar system.
"""
    
    if args.script_file:
        with open(args.script_file, "r", encoding="utf-8") as f:
            script = f.read()
    else:
        script = example_script
    
    # Generate unique lecture ID
    lecture_id = f"lecture_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Create generator and generate lecture
    generator = LectureGenerator(voice=args.voice, speed=args.speed)
    lecture_data = generator.generate_lecture(
        lecture_id=lecture_id,
        title=args.title,
        script=script,
        theme=args.theme
    )
    
    print("\nLecture Data:")
    print(json.dumps(lecture_data, indent=2))


if __name__ == "__main__":
    main()
