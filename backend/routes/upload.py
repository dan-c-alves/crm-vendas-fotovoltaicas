# backend/routes/upload.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from starlette.responses import JSONResponse
import cloudinary
import cloudinary.uploader
from config.settings import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Configuração do Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Faz o upload de uma imagem para o Cloudinary e retorna o URL.
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Ficheiro inválido. Apenas imagens são permitidas.")
    
    try:
        # Ler o conteúdo do ficheiro
        contents = await file.read()
        
        # Fazer o upload para o Cloudinary
        upload_result = cloudinary.uploader.upload(
            contents,
            folder="crm_fotovoltaicas",  # Pasta no Cloudinary
            resource_type="image"
        )
        
        # Retornar o URL seguro
        return JSONResponse(content={"url": upload_result.get("secure_url")})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no upload: {str(e)}")
