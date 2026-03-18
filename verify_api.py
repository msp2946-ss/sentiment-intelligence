import requests

BASE_URL = "http://127.0.0.1:8000"


def test_prediction(text: str) -> None:
    response = requests.post(f"{BASE_URL}/api/predict", json={"text": text}, timeout=30)
    response.raise_for_status()
    data = response.json()
    print(text)
    print(data)
    print("-" * 80)


if __name__ == "__main__":
    print(requests.get(f"{BASE_URL}/api/health", timeout=30).json())

    test_prediction("This app is fantastic and very useful")
    test_prediction("This is the worst thing I have ever used")
    test_prediction("The package arrived yesterday and includes all items")
