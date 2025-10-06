#!/usr/bin/env python3
"""
Environment Switcher for Robot Framework Automation
Helps switch between different environment configurations
"""

import os
import shutil
import sys
from pathlib import Path

def switch_environment(env_name):
    """Switch to specified environment configuration."""
    script_dir = Path(__file__).parent
    env_file = script_dir / '.env'
    source_file = script_dir / f'.env.{env_name}'
    
    if not source_file.exists():
        print(f"❌ Environment file '.env.{env_name}' not found!")
        print(f"Available environments:")
        for file in script_dir.glob('.env.*'):
            if file.name != '.env.example':
                env = file.name.replace('.env.', '')
                print(f"  - {env}")
        return False
    
    # Backup current .env if it exists
    if env_file.exists():
        backup_file = script_dir / '.env.backup'
        shutil.copy2(env_file, backup_file)
        print(f"📄 Backed up current .env to .env.backup")
    
    # Copy environment file
    shutil.copy2(source_file, env_file)
    print(f"✅ Switched to {env_name} environment")
    print(f"📁 Loaded configuration from: {source_file}")
    
    return True

def show_current_config():
    """Show current environment configuration."""
    script_dir = Path(__file__).parent
    env_file = script_dir / '.env'
    
    if not env_file.exists():
        print("❌ No .env file found. Use 'switch' command to set up environment.")
        return
    
    print("📋 Current Environment Configuration:")
    print("=" * 50)
    
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                print(f"  {line}")
    
    print("=" * 50)

def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) < 2:
        print("🤖 Robot Framework Environment Switcher")
        print("\nUsage:")
        print("  python switch_env.py switch <environment>")
        print("  python switch_env.py show")
        print("\nExamples:")
        print("  python switch_env.py switch development")
        print("  python switch_env.py switch staging")
        print("  python switch_env.py switch production")
        print("  python switch_env.py show")
        return
    
    command = sys.argv[1].lower()
    
    if command == 'switch':
        if len(sys.argv) < 3:
            print("❌ Please specify environment name")
            return
        env_name = sys.argv[2]
        switch_environment(env_name)
    
    elif command == 'show':
        show_current_config()
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Available commands: switch, show")

if __name__ == '__main__':
    main()