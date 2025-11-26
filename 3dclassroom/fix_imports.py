#!/usr/bin/env python3
import os
import re

# Replace 'three' imports with relative path to three.module.js
def fix_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace: from 'three' with proper relative path
    # Count how many directories we need to go up
    depth = filepath.count(os.sep) - 1  # -1 for the filename itself
    
    relative_path = '../' * depth + 'three.module.js'
    
    # Replace imports from 'three' 
    modified = re.sub(
        r"from\s+['\"]three['\"]",
        f"from '{relative_path}'",
        content
    )
    
    if content != modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Fixed: {filepath}")
        return True
    return False

# Find all JS files in jsm directory
base_dir = os.path.dirname(__file__)
jsm_dir = os.path.join(base_dir, 'jsm')

if os.path.exists(jsm_dir):
    for root, dirs, files in os.walk(jsm_dir):
        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                fix_imports(filepath)
    print("All imports fixed!")
else:
    print(f"jsm directory not found at {jsm_dir}")
