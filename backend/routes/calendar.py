# backend/routes/calendar.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from sqlalchemy.orm import Session
from models.user import User as UserModel
from utils.calendar import GoogleCalendarManager

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

class EventPayload(BaseModel):
    summary: str
    description: str | None = None
    start_time: str  # ISO string
    duration_minutes: int | None = 30
    timezone: str | None = 'Europe/Lisbon'

@router.delete("/{event_id}")
def delete_event(event_id: str, db: Session = Depends(get_db)):
    """Elimina um evento do Google Calendar usando o token do utilizador padrão (id=1)."""
    try:
        user = db.query(UserModel).filter(UserModel.id == 1).first()
        if not user or not user.google_calendar_token:
            raise HTTPException(status_code=400, detail="Token do Google Calendar não configurado")

        manager = GoogleCalendarManager(token=user.google_calendar_token)
        manager.delete_event(event_id)
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/event")
def create_event(payload: EventPayload, db: Session = Depends(get_db)):
    """Cria um evento no Google Calendar e retorna o event_id."""
    try:
        user = db.query(UserModel).filter(UserModel.id == 1).first()
        if not user or not user.google_calendar_token:
            raise HTTPException(status_code=400, detail="Token do Google Calendar não configurado")

        # Parse ISO string (aceitar 'Z')
        iso = payload.start_time.replace('Z', '+00:00') if 'Z' in payload.start_time else payload.start_time
        try:
            dt = datetime.fromisoformat(iso)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Data inválida: {e}")

        manager = GoogleCalendarManager(token=user.google_calendar_token)
        event_id = manager.create_event(
            summary=payload.summary,
            description=payload.description or '',
            start_time=dt,
            duration_minutes=payload.duration_minutes or 30,
            timezone=payload.timezone or 'Europe/Lisbon'
        )
        if not event_id:
            raise HTTPException(status_code=500, detail="Falha ao criar evento no Google Calendar")
        return {"success": True, "event_id": event_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class EventUpdatePayload(BaseModel):
    summary: str | None = None
    description: str | None = None
    start_time: str | None = None  # ISO string
    duration_minutes: int | None = 30
    timezone: str | None = 'Europe/Lisbon'

@router.put("/{event_id}")
def update_event(event_id: str, payload: EventUpdatePayload, db: Session = Depends(get_db)):
    """Atualiza um evento existente no Google Calendar."""
    try:
        user = db.query(UserModel).filter(UserModel.id == 1).first()
        if not user or not user.google_calendar_token:
            raise HTTPException(status_code=400, detail="Token do Google Calendar não configurado")

        dt = None
        if payload.start_time:
            iso = payload.start_time.replace('Z', '+00:00') if 'Z' in payload.start_time else payload.start_time
            try:
                dt = datetime.fromisoformat(iso)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Data inválida: {e}")

        manager = GoogleCalendarManager(token=user.google_calendar_token)
        ok = manager.update_event(
            event_id=event_id,
            summary=payload.summary,
            description=payload.description,
            start_time=dt,
            duration_minutes=payload.duration_minutes or 30,
            timezone=payload.timezone or 'Europe/Lisbon'
        )
        if not ok:
            raise HTTPException(status_code=500, detail="Falha ao atualizar evento no Google Calendar")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
