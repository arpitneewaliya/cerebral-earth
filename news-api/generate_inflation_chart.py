import requests
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import sys

def fetch_inflation_data(country_code, start_year, end_year):
    url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/FP.CPI.TOTL.ZG?date={start_year}:{end_year}&format=json"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Failed to fetch data from World Bank API")

    data = response.json()
    if len(data) < 2 or not isinstance(data[1], list):
        raise Exception("Invalid data received from API")

    records = data[1]
    inflation_data = {
        "Year": [record["date"] for record in records if record.get("value") is not None],
        "Inflation": [record["value"] for record in records if record.get("value") is not None]
    }

    return pd.DataFrame(inflation_data)

def generate_chart(country_code, start_year=2000, end_year=2023):
    df = fetch_inflation_data(country_code, start_year, end_year)
    df = df.sort_values("Year").astype({"Year": int})

    plt.figure(figsize=(10, 5))
    plt.plot(df["Year"], df["Inflation"], marker='o', color='orange', label="Inflation Rate")
    plt.xlabel("Year")
    plt.ylabel("Inflation Rate (%)")
    plt.title(f"Inflation Rate (CPI) in {country_code.upper()} ({start_year}-{end_year})")
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.legend()

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    encoded_image = base64.b64encode(buffer.read()).decode('utf-8')
    return encoded_image

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_inflation_chart.py <COUNTRY_CODE> [START_YEAR] [END_YEAR]")
        sys.exit(1)

    country_code = sys.argv[1]
    start_year = int(sys.argv[2]) if len(sys.argv) > 2 else 2000
    end_year = int(sys.argv[3]) if len(sys.argv) > 3 else 2023

    try:
        img = generate_chart(country_code, start_year, end_year)
        print(img)
    except Exception as e:
        print("Error:", e)
