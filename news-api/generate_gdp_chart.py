# /news-api/generate_gdp_chart.py
import requests
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import sys

def fetch_gdp_data(country_code, start_year, end_year):
    url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/NY.GDP.MKTP.CD?date={start_year}:{end_year}&format=json"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Failed to fetch data from World Bank API")

    data = response.json()
    if len(data) < 2 or not isinstance(data[1], list):
        raise Exception("Invalid data received from API")

    records = data[1]
    gdp_data = {
        "Year": [record["date"] for record in records if record["value"] is not None],
        "GDP": [record["value"] for record in records if record["value"] is not None]
    }

    return pd.DataFrame(gdp_data)

def generate_gdp_chart(country_code, start_year=1960, end_year=2023):
    df = fetch_gdp_data(country_code, start_year, end_year)
    df = df.sort_values("Year").astype({"Year": int})

    plt.figure(figsize=(10, 5))
    plt.bar(df["Year"], df["GDP"], color='g', label="GDP")
    plt.xlabel("Year")
    plt.ylabel("GDP (Current US$)")
    plt.title(f"GDP of {country_code} ({start_year}-{end_year})")
    plt.xticks(rotation=45)
    plt.grid(axis='y', linestyle='--', alpha=0.6)
    plt.legend()
    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    encoded_image = base64.b64encode(buffer.read()).decode('utf-8')
    return encoded_image

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <COUNTRY_CODE>")
        sys.exit(1)

    country_code = sys.argv[1]
    start_year = int(sys.argv[2]) if len(sys.argv) > 2 else 1960
    end_year = int(sys.argv[3]) if len(sys.argv) > 3 else 2023

    try:
        img_base64 = generate_gdp_chart(country_code, start_year, end_year)
        print(img_base64)
    except Exception as e:
        print(f"Error: {e}")
