import subprocess
import sys

# URL for the specific compatible model version
url = "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl"

print(f"Attempting to install model from: {url}")
try:
    subprocess.check_call([sys.executable, "-m", "pip", "install", url])
    print("Successfully installed en_core_web_sm")
except subprocess.CalledProcessError as e:
    print(f"Failed to install model: {e}")
    sys.exit(1)
