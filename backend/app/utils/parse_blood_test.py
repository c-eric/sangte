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

def process_pdf(file):
    tables = parse_pdf(file)
    tables = clean_data(tables, gender='F')
    
    for i, table in enumerate(tables):
        print(table)

if __name__ == "__main__":
    pdf_path = Path(__file__).parent.parent.parent / "sample.pdf"
    process_pdf(pdf_path)
