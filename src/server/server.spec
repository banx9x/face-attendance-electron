# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files, collect_submodules
import os

block_cipher = None

# Thu thập tất cả models từ thư mục models/ (nếu có)
models_dir = os.path.join(os.path.dirname(os.path.abspath('main.py')), 'models')
datas_list = []
if os.path.exists(models_dir):
    datas_list.append((models_dir, 'models'))

# Thu thập data files của deepface và các package khác
datas_list.extend(collect_data_files('deepface'))
datas_list.extend(collect_data_files('cv2'))

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=datas_list,
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'deepface',
        'deepface.DeepFace',
        'deepface.commons',
        'deepface.detectors',
        'deepface.extractors',
        'deepface.basemodels',
        'tensorflow',
        'keras',
        'cv2',
        'PIL',
        'numpy',
        'pandas',
        'gdown',
        'queue',
        'setuptools._vendor.more_itertools',
        'setuptools._vendor.jaraco',
        'setuptools._vendor.jaraco.functools',
    ] + collect_submodules('deepface'),
    hookspath=[],
    hooksconfig={},
    runtime_hooks=['pyi_rth_bypass_setuptools.py'],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='server',
)
