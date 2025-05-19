
import pandas as pd

# Load datasets (Replace these paths with your actual files)
acr_master = pd.read_csv('ACRIS_Real_Property_Master.csv')
acr_parties = pd.read_csv('ACRIS_Real_Property_Parties.csv')
assessment = pd.read_csv('Property_Assessment.csv')
pluto = pd.read_csv('PLUTO.csv')

# Step 1: Filter for DEED documents (ownership transfers)
deeds = acr_master[acr_master['doc_type'] == 'DEED']

# Step 2: Get the most recent deed per property (CRFN or BBL if available)
deeds = deeds.sort_values(by='document_date', ascending=False)
latest_deeds = deeds.drop_duplicates(subset='crfn')

# Step 3: Merge with parties to get grantee (new owner) names
ownership = latest_deeds.merge(acr_parties[acr_parties['party_type'] == 'Grantee'], 
                                on='document_id', how='left')

# Step 4: Join with PLUTO data to get location coordinates
ownership = ownership.merge(pluto[['bbl', 'latitude', 'longitude']], on='bbl', how='left')

# Step 5: Join with assessment data to get property valuation
ownership = ownership.merge(assessment[['bbl', 'pymkttot']], on='bbl', how='left')

# Step 6: Clean and format to desired Wealth Map structure
ownership_map = ownership[['name', 'latitude', 'longitude', 'pymkttot']].dropna()
ownership_map = ownership_map.rename(columns={
    'name': 'name',
    'latitude': 'position_lat',
    'longitude': 'position_lon',
    'pymkttot': 'netWorth'
})

# Add static fields to match Wealth Map schema
ownership_map['company'] = 'N/A'
ownership_map['industry'] = 'Real Estate'
ownership_map['role'] = 'Owner'
ownership_map['wealthBreakdown'] = ownership_map['netWorth'].apply(lambda x: {
    'Stocks': 0,
    'Real Estate': x,
    'Crypto': 0
})

# Output preview
print(ownership_map.head())

# Optionally save to JSON or CSV
ownership_map.to_json('wealth_map_output.json', orient='records', indent=2)
