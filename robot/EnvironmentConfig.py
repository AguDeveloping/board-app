"""
Environment Configuration Library for Robot Framework
Loads environment variables from .env file for automation testing
"""

import os
from pathlib import Path
from robot.api.deco import keyword
try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


class EnvironmentConfig:
    """Library for loading environment configuration in Robot Framework tests."""
    
    def __init__(self):
        """Initialize the library and load environment variables."""
        self._load_environment_variables()
    
    def _load_environment_variables(self):
        """Load environment variables from .env file if it exists."""
        if load_dotenv is None:
            print("WARNING: python-dotenv not installed. Using system environment variables only.")
            return
        
        # Look for .env file in current directory and parent directories
        current_dir = Path(__file__).parent
        env_file = current_dir / '.env'
        
        if env_file.exists():
            load_dotenv(env_file)
            print(f"Loaded environment variables from: {env_file}")
        else:
            print(f"No .env file found at: {env_file}")
    
    @keyword
    def get_environment_variable(self, variable_name, default_value=None):
        """
        Get environment variable value with optional default.
        
        Args:
            variable_name: Name of the environment variable
            default_value: Default value if variable is not found
            
        Returns:
            Environment variable value or default value
        """
        value = os.getenv(variable_name, default_value)
        if value is None:
            raise ValueError(f"Environment variable '{variable_name}' not found and no default provided")
        return value
    
    @keyword
    def get_frontend_url(self):
        """Get frontend URL from environment variables."""
        return self.get_environment_variable('FRONTEND_URL', 'http://localhost:3001')
    
    @keyword
    def get_backend_url(self):
        """Get backend URL from environment variables."""
        return self.get_environment_variable('BACKEND_URL', 'http://localhost:3000')
    
    @keyword
    def get_frontend_port(self):
        """Get frontend port from environment variables."""
        return self.get_environment_variable('FRONTEND_PORT', '3001')
    
    @keyword
    def get_backend_port(self):
        """Get backend port from environment variables.""" 
        return self.get_environment_variable('BACKEND_PORT', '3000')
    
    @keyword
    def get_timeout(self):
        """Get timeout value from environment variables."""
        return self.get_environment_variable('TIMEOUT', '30s')
    
    @keyword
    def get_browser_type(self):
        """Get browser type from environment variables."""
        return self.get_environment_variable('BROWSER_TYPE', 'chromium')
    
    @keyword
    def get_headless_mode(self):
        """Get headless mode setting from environment variables."""
        headless = self.get_environment_variable('HEADLESS', 'false')
        return headless.lower() in ('true', '1', 'yes', 'on')
    
    @keyword
    def log_current_configuration(self):
        """Log current environment configuration for debugging."""
        config = {
            'FRONTEND_URL': self.get_frontend_url(),
            'BACKEND_URL': self.get_backend_url(),
            'FRONTEND_PORT': self.get_frontend_port(),
            'BACKEND_PORT': self.get_backend_port(),
            'TIMEOUT': self.get_timeout(),
            'BROWSER_TYPE': self.get_browser_type(),
            'HEADLESS': self.get_headless_mode()
        }
        
        print("\n=== CURRENT ENVIRONMENT CONFIGURATION ===")
        for key, value in config.items():
            print(f"{key}: {value}")
        print("==========================================\n")
        
        return config