"""
Generate a detailed, comprehensive lecture for AetherLearn demo
This creates a real educational lecture with proper depth
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "KokoroTTS"))
from tts_engine import KokoroTTS

# Detailed Photosynthesis Lecture Script
PHOTOSYNTHESIS_LECTURE = """
SLIDE: Introduction to Photosynthesis
- The process that powers life on Earth
- Converting sunlight into chemical energy
- Why every living thing depends on it

SPEECH: Welcome to today's comprehensive lesson on Photosynthesis! This is one of the most important biological processes on our planet. [GESTURE] Think about it - every breath you take, every bite of food you eat, can be traced back to photosynthesis. [POINT] As you can see on the board, we'll explore how plants convert sunlight into the chemical energy that sustains almost all life on Earth.

---

SLIDE: What is Photosynthesis?
- Photo means "light"
- Synthesis means "putting together"
- Plants make glucose from light, water, and CO2
- Oxygen is released as a byproduct

SPEECH: Let's break down the word itself. [GESTURE] Photo comes from the Greek word for light, and synthesis means putting together. So photosynthesis literally means putting together with light! [POINT] Looking at the board, plants take three simple ingredients - sunlight, water from the soil, and carbon dioxide from the air - and combine them to create glucose, which is their food. And here's the beautiful part - oxygen is released as a byproduct, which is exactly what we need to breathe!

---

SLIDE: The Chemical Equation
- 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
- Six carbon dioxide molecules
- Plus six water molecules  
- Produces one glucose and six oxygen molecules

SPEECH: Now let's look at the chemistry. [POINT] On the board you can see the chemical equation for photosynthesis. Six molecules of carbon dioxide combine with six molecules of water. When light energy is added, this produces one molecule of glucose - that's C6H12O6 - plus six molecules of oxygen. [GESTURE] This equation represents millions of years of evolution perfecting the most efficient energy conversion system in nature!

---

SLIDE: Where Photosynthesis Happens
- Inside plant cells called chloroplasts
- Chloroplasts contain chlorophyll
- Chlorophyll is the green pigment
- Leaves have millions of chloroplasts

SPEECH: So where does all this happen? [POINT] If you look at the board, photosynthesis occurs inside special structures called chloroplasts. These are like tiny solar panels inside plant cells. [GESTURE] Inside each chloroplast is a green pigment called chlorophyll - and that's exactly why plants are green! Chlorophyll absorbs sunlight, particularly red and blue light, and reflects green light back to our eyes. A single leaf can contain millions of these microscopic chloroplasts working together!

---

SLIDE: The Two Stages of Photosynthesis
- Stage 1: Light-Dependent Reactions
- Stage 2: Light-Independent Reactions (Calvin Cycle)
- Both stages work together
- One cannot happen without the other

SPEECH: [GESTURE] Photosynthesis isn't just one step - it's actually two interconnected stages! [POINT] As shown on the board, we have the light-dependent reactions and the light-independent reactions, also called the Calvin Cycle. The first stage captures light energy and stores it temporarily. The second stage uses that stored energy to actually build glucose molecules. These two stages work like a relay race - passing energy from one to the other!

---

SLIDE: Light-Dependent Reactions
- Occur in the thylakoid membranes
- Light energy splits water molecules
- Produces ATP and NADPH (energy carriers)
- Releases oxygen as a byproduct

SPEECH: Let's dive deeper into stage one. [POINT] Looking at the board, the light-dependent reactions happen in structures called thylakoid membranes inside the chloroplast. [GESTURE] When light hits the chlorophyll, it energizes electrons and triggers a chain reaction. Water molecules are split apart - the hydrogen is kept, and the oxygen is released into the air. This process creates ATP and NADPH, which are like rechargeable batteries that carry energy to the next stage!

---

SLIDE: The Calvin Cycle
- Occurs in the stroma of chloroplasts
- Uses ATP and NADPH from stage one
- Carbon dioxide is fixed into glucose
- Named after scientist Melvin Calvin

SPEECH: Now for stage two - the Calvin Cycle! [POINT] On the board you can see this happens in the stroma, which is the fluid inside the chloroplast. [GESTURE] This is where the magic of actually making sugar happens. The ATP and NADPH from the first stage provide the energy needed to take carbon dioxide from the air and literally build it into glucose molecules, one carbon at a time. This cycle was discovered by Melvin Calvin, who won the Nobel Prize for this work!

---

SLIDE: Factors Affecting Photosynthesis
- Light intensity - more light, faster rate
- Carbon dioxide levels
- Temperature - optimal range needed
- Water availability

SPEECH: [GESTURE] Not all photosynthesis happens at the same rate. Several factors can speed it up or slow it down. [POINT] As you can see on the board, light intensity is crucial - more light generally means faster photosynthesis, up to a point. Carbon dioxide levels matter too - that's why greenhouses sometimes add extra CO2. Temperature needs to be just right - too cold and the enzymes work slowly, too hot and they stop working entirely. And of course, water is essential as a raw material!

---

SLIDE: Why Photosynthesis Matters
- Produces all the oxygen we breathe
- Creates food for almost all ecosystems
- Removes CO2 from atmosphere
- Foundation of fossil fuels

SPEECH: [GESTURE] Let's step back and appreciate why photosynthesis is so incredibly important! [POINT] Looking at the board - first, every breath of oxygen you take was produced by photosynthesis, either by plants, algae, or cyanobacteria. Second, almost all food chains start with photosynthetic organisms. Third, plants absorb carbon dioxide, helping regulate our climate. And here's something amazing - even the coal, oil, and natural gas we use today came from ancient plants that captured sunlight millions of years ago through photosynthesis!

---

SLIDE: Summary and Key Points
- Photosynthesis converts light to chemical energy
- Equation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
- Occurs in chloroplasts using chlorophyll
- Two stages: Light reactions and Calvin Cycle
- Essential for all life on Earth

SPEECH: [GESTURE] Let's wrap up what we've learned today! [POINT] Looking at our summary on the board - photosynthesis is the remarkable process that converts light energy into chemical energy stored in glucose. The equation shows us the inputs and outputs. It all happens in chloroplasts, powered by the green pigment chlorophyll. The process has two stages that work together. And most importantly, photosynthesis is the foundation of life on Earth - without it, we simply wouldn't exist! [GESTURE] Great job today, and I'll see you in the next lesson!
"""

def generate_detailed_lecture():
    """Generate the detailed photosynthesis lecture"""
    import os
    import json
    from datetime import datetime
    
    print("="*60)
    print("Generating Detailed Photosynthesis Lecture")
    print("="*60)
    
    # Output directories
    output_base = Path(__file__).parent.parent / "frontend" / "public"
    slides_dir = output_base / "slides" / "photosynthesis"
    audio_dir = output_base / "audio" / "photosynthesis"
    
    slides_dir.mkdir(parents=True, exist_ok=True)
    audio_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse the script
    segments = parse_lecture_script(PHOTOSYNTHESIS_LECTURE)
    total_slides = len(segments)
    
    print(f"\nParsed {total_slides} slides")
    
    # Initialize TTS
    print("\nInitializing TTS with voice: am_liam")
    tts = KokoroTTS()
    voice = "am_liam"
    speed = 0.92  # Slightly slower for educational content
    
    # Generate each segment
    lecture_data = {
        "id": "photosynthesis_detailed",
        "title": "Photosynthesis - A Comprehensive Guide",
        "subject": "Biology",
        "grade": "8-10",
        "created_at": datetime.now().isoformat(),
        "total_slides": total_slides,
        "segments": []
    }
    
    for i, segment in enumerate(segments):
        slide_num = i + 1
        print(f"\n[{slide_num}/{total_slides}] {segment['title']}")
        
        # Generate SVG slide
        svg_content = generate_slide_svg(
            title=segment['title'],
            content=segment['content'],
            slide_number=slide_num,
            total_slides=total_slides
        )
        
        slide_path = slides_dir / f"slide{slide_num}.svg"
        with open(slide_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f"  ✓ Slide saved")
        
        # Generate audio
        audio_path = audio_dir / f"slide{slide_num}.wav"
        clean_speech = segment['speech']
        for cue in ['[POINT]', '[GESTURE]', '[THINK]', '[NOD]', '[WAVE]', '[IDLE]']:
            clean_speech = clean_speech.replace(cue, '')
        clean_speech = ' '.join(clean_speech.split())  # Clean whitespace
        
        if clean_speech:
            tts.save(
                text=clean_speech,
                output_path=str(audio_path),
                voice=voice,
                speed=speed
            )
            audio_size = os.path.getsize(audio_path) / 1024
            print(f"  ✓ Audio saved ({audio_size:.0f} KB)")
        
        # Add to lecture data
        lecture_data["segments"].append({
            "index": slide_num,
            "title": segment['title'],
            "slide_path": f"/slides/photosynthesis/slide{slide_num}.svg",
            "audio_path": f"/audio/photosynthesis/slide{slide_num}.wav",
            "speech_text": segment['speech']
        })
    
    # Save lecture metadata
    metadata_path = slides_dir / "lecture.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(lecture_data, f, indent=2)
    
    print(f"\n{'='*60}")
    print("Lecture Generation Complete!")
    print(f"{'='*60}")
    print(f"\nSlides: {slides_dir}")
    print(f"Audio: {audio_dir}")
    print(f"Total slides: {total_slides}")
    
    return lecture_data


def parse_lecture_script(script):
    """Parse lecture script into segments"""
    import re
    
    segments = []
    raw_segments = re.split(r'\n---+\n', script.strip())
    
    for seg in raw_segments:
        if not seg.strip():
            continue
        
        segment = {
            'title': '',
            'content': [],
            'speech': ''
        }
        
        lines = seg.strip().split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.upper().startswith('SLIDE:'):
                current_section = 'slide'
                segment['title'] = line[6:].strip()
            elif line.upper().startswith('SPEECH:'):
                current_section = 'speech'
                segment['speech'] = line[7:].strip()
            elif current_section == 'slide' and line.startswith('-'):
                segment['content'].append(line[1:].strip())
            elif current_section == 'speech':
                segment['speech'] += ' ' + line
        
        if segment['title']:
            segments.append(segment)
    
    return segments


def generate_slide_svg(title, content, slide_number, total_slides):
    """Generate SVG for a slide"""
    
    # Build content elements
    content_elements = []
    y_pos = 280
    
    for item in content:
        content_elements.append(f'''
    <g transform="translate(120, {y_pos})">
      <circle cx="0" cy="12" r="8" fill="#6366f1"/>
      <text x="28" y="18" font-family="Arial, sans-serif" font-size="32" fill="#ffffff">{escape_xml(item)}</text>
    </g>''')
        y_pos += 85
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  
  <!-- Decorative elements -->
  <circle cx="1700" cy="200" r="150" fill="#6366f1" opacity="0.1"/>
  <circle cx="200" cy="900" r="100" fill="#22d3ee" opacity="0.1"/>
  
  <!-- Border/Frame -->
  <rect x="40" y="40" width="1840" height="1000" rx="24" ry="24" 
        fill="none" stroke="#3d3d5c" stroke-width="2"/>
  
  <!-- Accent bar -->
  <rect x="40" y="40" width="12" height="1000" rx="6" fill="#6366f1"/>
  
  <!-- Title -->
  <text x="120" y="150" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#ffffff">
    {escape_xml(title)}
  </text>
  
  <!-- Title underline -->
  <rect x="120" y="175" width="600" height="4" rx="2" fill="#6366f1"/>
  
  <!-- Content -->
  {"".join(content_elements)}
  
  <!-- Slide number -->
  <g transform="translate(1750, 980)">
    <rect x="-60" y="-30" width="100" height="40" rx="20" fill="#6366f1" opacity="0.3"/>
    <text x="0" y="5" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">
      {slide_number}/{total_slides}
    </text>
  </g>
  
  <!-- AetherLearn branding -->
  <text x="120" y="1000" font-family="Arial, sans-serif" font-size="22" fill="#6366f1" opacity="0.8">
    AetherLearn
  </text>
</svg>'''
    
    return svg


def escape_xml(text):
    """Escape special XML characters"""
    return (text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;"))


if __name__ == "__main__":
    generate_detailed_lecture()
