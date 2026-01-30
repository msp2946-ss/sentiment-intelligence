import requests
import time

print("Waiting for API to start...")
time.sleep(3)

try:
    # Test Root
    r = requests.get("http://127.0.0.1:8000/")
    print(f"Root: {r.status_code} - {r.json()}")

    # Test Prediction
    payload = {"text": "This movie was absolutely fantastic! I loved every moment."}
    r = requests.post("http://127.0.0.1:8000/api/predict", json=payload)
    print(f"Prediction (Positive): {r.status_code} - {r.json()}")

    payload = {"text": "Terrible acting and boring plot. Waste of time."}
    r = requests.post("http://127.0.0.1:8000/api/predict", json=payload)
    print(f"Prediction (Negative): {r.status_code} - {r.json()}")

    print("Verification Passed!")
except Exception as e:
    print(f"Verification Failed: {e}")
