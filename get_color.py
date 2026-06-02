import sys
from PIL import Image

try:
    img_path = "/private/var/folders/lq/27qr08dd6zv_br12f6935t0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_Sb6G8G/Screenshot 2026-06-03 at 1.02.18 AM.png"
    img = Image.open(img_path).convert('RGB')
    width, height = img.size
    
    # Let's sample a few pixels to find the background color
    colors = {}
    for y in range(0, height, 10):
        for x in range(0, width, 10):
            color = img.getpixel((x, y))
            colors[color] = colors.get(color, 0) + 1
            
    dominant_color = max(colors, key=colors.get)
    hex_color = '#{:02x}{:02x}{:02x}'.format(dominant_color[0], dominant_color[1], dominant_color[2])
    print(f"Dominant color: {hex_color} {dominant_color}")
    
    # Also get the exact top-left pixel which is often the background
    top_left = img.getpixel((0,0))
    hex_top_left = '#{:02x}{:02x}{:02x}'.format(top_left[0], top_left[1], top_left[2])
    print(f"Top-left pixel color: {hex_top_left} {top_left}")
    
except Exception as e:
    print(f"Error: {e}")
