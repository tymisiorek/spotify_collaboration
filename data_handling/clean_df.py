import pandas as pd
from dotenv import load_dotenv
from pathlib import Path
import os
import community as community_louvain
import re
import networkx as nx

project_root = Path(__file__).resolve().parent.parent
dotenv_path = project_root / '.env'
load_dotenv(dotenv_path=dotenv_path)
data_path = os.environ.get('DATA_PATH')

edges_df = pd.read_csv(f"{data_path}/collaboration_edges.csv")
nodes_df = pd.read_csv(f"{data_path}/collaboration_nodes.csv")


def extract_top_chart(chart_hits):
    if pd.isna(chart_hits):
        return None
    
    matches = re.findall(r'(\w+)\s*\((\d+)\)', chart_hits)
    if not matches: 
        return None
    
    chart_dict = {country: int(value) for country, value in matches}
    top_country = max(chart_dict, key=chart_dict.get)
    return top_country


nodes_df['top_chart'] = nodes_df['chart_hits'].apply(extract_top_chart)
nodes_df.rename(columns={'spotify_id': 'Id'}, inplace=True)

if nodes_df['Id'].duplicated().any():
    nodes_df = nodes_df.drop_duplicates(subset='Id', keep='first')


G = nx.from_pandas_edgelist(edges_df, source='source', target='target')

node_attributes = nodes_df.set_index('Id').to_dict('index')
nx.set_node_attributes(G, node_attributes)

pos = nx.forceatlas2_layout(G)

degree_centrality = nx.degree_centrality(G)
betweenness_centrality = nx.betweenness_centrality(G)
eigenvector_centrality = nx.eigenvector_centrality(G)

partition = community_louvain.best_partition(G)
modularity_class = pd.Series(partition).sort_index()

results_df = pd.DataFrame({
    'Id': list(G.nodes()),
    'degree_centrality': list(degree_centrality.values()),
    'betweenness_centrality': list(betweenness_centrality.values()),
    'eigenvector_centrality': list(eigenvector_centrality.values()),
    'modularity_class': modularity_class.values
})

nodes_df = nodes_df.merge(results_df, on='Id', how='left')

nodes_df.to_csv(f"{data_path}/graph_nodes.csv", index=False)
