from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
import shutil

# Fix TensorFlow/Keras issues when packaged
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Giảm log của TensorFlow
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Import TensorFlow và config trước khi import DeepFace
import tensorflow as tf
# Enable eager execution để tránh lỗi KerasTensor
tf.config.run_functions_eagerly(True)
# Đảm bảo sử dụng eager execution
if not tf.executing_eagerly():
    tf.compat.v1.enable_eager_execution()

from deepface import DeepFace

# Thiết lập thư mục để lưu model của DeepFace
SCRIPT_DIR = Path(__file__).parent.resolve()
MODELS_DIR = SCRIPT_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

# Thư mục lưu database ảnh khuôn mặt
FACES_DB = SCRIPT_DIR / "faces_db"
FACES_DB.mkdir(exist_ok=True)

# Đặt biến môi trường để DeepFace sử dụng thư mục custom
os.environ['DEEPFACE_HOME'] = str(MODELS_DIR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root() -> dict[str, Union[str, int]]:
    return {"message": "Hello, World!", "status": 200}

@app.get("/status")
async def read_status() -> dict[str, str]:
    return {"status": "OK"}

@app.post("/face")
async def add_face(file: UploadFile = File(...), name: str = "unknown"):
    """
    Thêm khuôn mặt mới vào database
    - file: Ảnh khuôn mặt (jpg, png)
    - name: Tên người (dùng làm tên file)
    """
    try:
        # Kiểm tra định dạng file
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File phải là ảnh")
        
        # Tạo thư mục cho người này nếu chưa có
        person_dir = FACES_DB / name
        person_dir.mkdir(exist_ok=True)
        
        # Lưu file với timestamp để tránh trùng
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_ext = file.filename.split(".")[-1]
        save_path = person_dir / f"{timestamp}.{file_ext}"
        
        # Lưu file
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Verify xem có khuôn mặt trong ảnh không
        try:
            DeepFace.extract_faces(str(save_path), detector_backend="opencv")
        except Exception as e:
            # Xóa file nếu không tìm thấy khuôn mặt
            save_path.unlink()
            raise HTTPException(status_code=400, detail=f"Không tìm thấy khuôn mặt trong ảnh: {str(e)}")
        
        return {
            "message": "Thêm khuôn mặt thành công",
            "name": name,
            "file_path": str(save_path.relative_to(SCRIPT_DIR))
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi: {str(e)}")

@app.post("/face/recognize")
async def recognize_face(file: UploadFile = File(...)):
    """
    Nhận diện khuôn mặt từ ảnh tải lên
    - file: Ảnh khuôn mặt cần nhận diện
    """
    try:
        # Kiểm tra định dạng file
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File phải là ảnh")
        
        # Lưu file tạm
        temp_path = SCRIPT_DIR / f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        try:
            # Tìm kiếm khuôn mặt trong database
            result = DeepFace.find(
                img_path=str(temp_path),
                db_path=str(FACES_DB),
                model_name="Facenet512",
                detector_backend="opencv",
                enforce_detection=True
            )
            
            # Xử lý kết quả
            if result and len(result) > 0 and len(result[0]) > 0:
                best_match = result[0].iloc[0]
                identity_path = Path(best_match['identity'])
                person_name = identity_path.parent.name
                distance = best_match['distance']
                
                return {
                    "success": True,
                    "message": "Nhận diện thành công",
                    "person": person_name,
                    "confidence": float(1 - distance),  # Chuyển distance thành confidence
                    "distance": float(distance)
                }
            else:
                return {
                    "success": False,
                    "message": "Không tìm thấy khuôn mặt khớp trong database"
                }
        
        finally:
            # Xóa file tạm
            if temp_path.exists():
                temp_path.unlink()
    
    except HTTPException:
        raise
    except Exception as e:
        # Xóa file tạm nếu có lỗi
        if temp_path.exists():
            temp_path.unlink()
        raise HTTPException(status_code=500, detail=f"Lỗi: {str(e)}")