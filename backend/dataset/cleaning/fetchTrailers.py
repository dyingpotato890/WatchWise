from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import json

input_file = "backend/dataset/cleaning/alltitles2.txt"
output_file = "trailer_links_2.json"

with open(input_file, "r", encoding="latin-1") as f:
    movie_titles = [line.strip() for line in f.readlines()]

try:
    with open(output_file, "r", encoding="utf-8") as of:
        trailer_links = json.load(of)
except:
    trailer_links = {}

# Initialize WebDriver
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Run in headless mode (no UI)
driver = webdriver.Chrome(options=options)

save_interval = 5
processed_count = 0

try:
    for title in movie_titles:
        if title in trailer_links:
            print(f"Skipping {title}, already processed.")
            continue

        search_url = f"https://www.youtube.com/results?search_query={title.replace(' ', '+')}+trailer"
        driver.get(search_url)
        time.sleep(2)

        try:
            video = driver.find_element(By.XPATH, '//a[@id="video-title"]')
            video_url = video.get_attribute("href")
            trailer_links[title] = video_url
            print(f"Found: {title} → {video_url}")
        except Exception:
            print(f"Could not find trailer for: {title}")
            trailer_links[title] = "Not Found"

        processed_count += 1

        # Save progress every 'save_interval' movies
        if processed_count % save_interval == 0:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(trailer_links, f, indent = 4)
            print(f"Saved progress at {processed_count} movies.")

except KeyboardInterrupt:
    print("\nProcess interrupted. Saving progress...")

finally:
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(trailer_links, f, indent=4)

    driver.quit()
    print("Done! Links saved to trailer_links_2.json")