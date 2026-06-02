import sys
import Quartz
import Vision
from CoreFoundation import CFURLCreateWithFileSystemPath, kCFURLPOSIXPathStyle

def extract_text(image_path):
    url = CFURLCreateWithFileSystemPath(None, image_path, kCFURLPOSIXPathStyle, False)
    if not url:
        return "Failed to load image"
    
    req_handler = Vision.VNImageRequestHandler.alloc().initWithURL_options_(url, None)
    req = Vision.VNRecognizeTextRequest.alloc().init()
    
    success, error = req_handler.performRequests_error_([req], None)
    if not success:
        return f"Error: {error}"
        
    results = req.results()
    text = ""
    if results:
        for observation in results:
            text += observation.topCandidates_(1)[0].string() + "\n"
    return text

if __name__ == "__main__":
    print("Screenshot 1:")
    print(extract_text("/private/var/folders/lq/27qr08dd6zv_br12f6935t0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_4Vl0O3/Screenshot 2026-06-03 at 1.06.50 AM.png"))
    print("\nScreenshot 2:")
    print(extract_text("/private/var/folders/lq/27qr08dd6zv_br12f6935t0h0000gn/T/TemporaryItems/NSIRD_screencaptureui_1zvqCb/Screenshot 2026-06-03 at 1.07.06 AM.png"))
