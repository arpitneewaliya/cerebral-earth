import requests
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import sys

def fetch_fdi_data(country_code, start_year, end_year):
    url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/BX.KLT.DINV.CD.WD?date={start_year}:{end_year}&format=json"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Failed to fetch data from World Bank API")

    data = response.json()
    if len(data) < 2 or not isinstance(data[1], list):
        raise Exception("Invalid data received from API")

    records = data[1]
    fdi_data = {
        "Year": [record["date"] for record in records if record.get("value") is not None],
        "FDI": [record["value"] for record in records if record.get("value") is not None]
    }

    return pd.DataFrame(fdi_data)

def generate_fdi_chart(country_code, start_year=2000, end_year=2023):
    df = fetch_fdi_data(country_code, start_year, end_year)
    df = df.sort_values("Year").astype({"Year": int})

    plt.figure(figsize=(10, 5))
    plt.plot(df["Year"], df["FDI"], marker='o', linestyle='-', color='purple', label="FDI Inflows")
    plt.xlabel("Year")
    plt.ylabel("FDI Inflows (Current USD)")
    plt.title(f"FDI Inflows for {country_code.upper()} ({start_year}-{end_year})")
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    encoded_image = base64.b64encode(buffer.read()).decode('utf-8')
    return encoded_image

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_fdi_chart.py <COUNTRY_CODE> [START_YEAR] [END_YEAR]")
        sys.exit(1)

    country_code = sys.argv[1]
    start_year = int(sys.argv[2]) if len(sys.argv) > 2 else 2000
    end_year = int(sys.argv[3]) if len(sys.argv) > 3 else 2023

    try:
        img_base64 = generate_fdi_chart(country_code, start_year, end_year)
        print(img_base64)
    except Exception as e:
        print(f"Error: {e}")
