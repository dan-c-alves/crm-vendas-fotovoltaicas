# backend/utils/calendar.py

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from typing import Optional

# Importar configurações
from config.settings import SCOPES

class GoogleCalendarManager:
    """
    Gerencia a comunicação com a API do Google Calendar.
    """

    def __init__(self, token: str):
        """
        Inicializa o serviço com o token de acesso do utilizador.
        """
        # Se estiver a usar o refresh_token, precisaria de mais lógica.
        # Por simplificação, assumimos que o token é válido para a sessão.
        self.creds = Credentials(token=token, scopes=SCOPES)
        self.service = build('calendar', 'v3', credentials=self.creds)

    def create_event(self, summary: str, description: str, start_time: datetime, duration_minutes: int = 30, timezone: str = 'Europe/Lisbon') -> Optional[str]:
        """
        Cria um novo evento no calendário principal do utilizador.
        Retorna o ID do evento criado.
        """
        end_time = start_time + timedelta(minutes=duration_minutes)
        
        event = {
            'summary': summary,
            'description': description,
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': timezone,
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': timezone,
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # 1 dia antes
                    {'method': 'popup', 'minutes': 10},       # 10 minutos antes (para o telemóvel)
                ],
            },
        }

        try:
            event = self.service.events().insert(calendarId='primary', body=event).execute()
            return event.get('id')
        except Exception as e:
            print(f"Erro ao criar evento no Google Calendar: {e}")
            return None

    def delete_event(self, event_id: str):
        """
        Elimina um evento do calendário.
        """
        try:
            self.service.events().delete(calendarId='primary', eventId=event_id).execute()
            print(f"Evento Google Calendar {event_id} eliminado com sucesso.")
        except Exception as e:
            print(f"Erro ao eliminar evento {event_id}: {e}")
