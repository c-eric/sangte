import pandas as pd
from pathlib import Path
import pdfplumber

def parse_pdf(file):
    with pdfplumber.open(file) as pdf:
        all_tables = []
        current_table = []
        
        for page in pdf.pages:
            tables = page.extract_tables()
            
            for table in tables:
                if table:
                    if table[0][0] == 'Test':
                        if current_table:
                            all_tables.append(current_table)
                        current_table = table
                    else:
                        current_table.extend(table)
        
        if current_table:
            all_tables.append(current_table)
    
    return all_tables


def clean_data(tables, gender):
    for i, table in enumerate(tables):
        df = pd.DataFrame(table[1:], columns=table[0])
        df.columns = df.columns.str.replace(r'\n', ' ', regex=True)
        df = df.map(lambda x: x.replace('\n', ' ').strip() if isinstance(x, str) else x)
        if 'Reference Range (Male)' in df:
            if gender == 'M':
                df.rename(columns={'Reference Range (Male)': 'Reference Range'}, inplace=True)
                df = df.drop('Reference Range (Female)', axis=1)
            elif gender == 'F':
                df.rename(columns={'Reference Range (Female)': 'Reference Range'}, inplace=True)
                df = df.drop('Reference Range (Male)', axis=1)

        tables[i] = df
    return tables

def classify_result(row):

    result = float(row['Result'])
    ref_range = row['Reference Range']

    low = 0
    high = float('inf')

    if '<' in ref_range:
        high = float(ref_range.replace('<', ''))
    elif '–' in ref_range:
        low, high = map(float, ref_range.split('–'))


    warning_threshold = 0.1
    critical_threshold = 0.2
    
    if result < low * (1 - critical_threshold) or result > high * (1 + critical_threshold):
        return "Critical"
    elif result < low * (1 - warning_threshold) or result > high * (1 + warning_threshold):
        return "Warning"
    return "Normal"

def analyze_data(tables):
    for i, table in enumerate(tables):
        df = table
        df['Status'] = df.apply(classify_result, axis=1)

        tables[i] = df
    return tables


def process_pdf(file):
    tables = parse_pdf(file)
    tables = clean_data(tables, gender='F')
    tables = analyze_data(tables)
    for i, table in enumerate(tables):

        print(table)

if __name__ == "__main__":
    pdf_path = Path(__file__).parent.parent.parent / "sample.pdf"
    process_pdf(pdf_path)
