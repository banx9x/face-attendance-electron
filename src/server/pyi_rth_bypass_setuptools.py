# Custom runtime hook to bypass setuptools issues
import sys

# Prevent setuptools from trying to access vendored packages
# that cause issues in frozen environments
try:
    import setuptools
    # Disable setuptools vendoring to avoid runtime errors
    setuptools._vendor = None
except (ImportError, AttributeError):
    pass
