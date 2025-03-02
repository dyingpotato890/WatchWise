import csv
import ftfy

def fix_text(text):
    return ftfy.fix_text(text)

# Read and fix the CSV
input_file = "backend/dataset/netflix_with_posters.csv"
output_file = "fixed.csv"

fixed_count = 0  

with open(input_file, "r", encoding = "ISO-8859-1") as infile, open(output_file, "w", encoding = "utf-8", newline="") as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    for row in reader:
        fixed_row = [fix_text(cell) for cell in row]
        writer.writerow(fixed_row)

print(f"Fixed CSV saved as {output_file}")