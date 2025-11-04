import requests
import json

# URL do backend Railway
backend_url = "https://1b619e43-b2e8-434d-ba34-b246a8074d20.railway.app"

# Dados do admin
admin_data = {
    "nome": "Danilo",
    "email": "danilocalves86@gmail.com",
    "password": "101010"
}

print("🔧 Criando utilizador administrador...")
print(f"   Nome: {admin_data['nome']}")
print(f"   Email: {admin_data['email']}")
print(f"   Senha: {admin_data['password']}")
print()

try:
    response = requests.post(
        f"{backend_url}/register",
        json=admin_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code in [200, 201]:
        print("✅ Utilizador criado com sucesso!")
        print(f"   Response: {response.json()}")
    elif response.status_code == 409:
        print("⚠️  Utilizador já existe!")
        print(f"   Response: {response.json()}")
    else:
        print(f"❌ Erro ao criar utilizador: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Erro na requisição: {e}")
