import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def find_zina_in_json():
    with open('data/trello.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lists = {lst['id']: lst['name'] for lst in data.get('lists', [])}
    cards = [c for c in data.get('cards', []) if 'zina' in c.get('name', '').lower()]
    
    print(f"Cartões com 'Zina' encontrados: {len(cards)}")
    for card in cards:
        list_name = lists.get(card.get('idList'), 'Desconhecida')
        print(f"  - {card['name']}")
        print(f"    Lista: {list_name}")
        print(f"    Arquivado: {card.get('closed', False)}")
        print()

if __name__ == "__main__":
    find_zina_in_json()
