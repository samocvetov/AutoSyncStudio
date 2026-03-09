# AutoSync
AutoSync VIdeo + Audio for podcast

wsl bash -c "sudo apt-get update && sudo apt-get install -y python3-venv ffmpeg && python3 -m venv ~/autosync_env && ~/autosync_env/bin/pip install requests watchdog streamlit scipy pandas && curl -sSL https://raw.githubusercontent.com/samocvetov/AutoSync/main/AutoSync.py -o /tmp/AutoSync.py && ~/autosync_env/bin/streamlit run /tmp/AutoSync.py"

wsl bash -c "echo \"alias autosync='~/autosync_env/bin/streamlit run /tmp/AutoSync.py'\" >> ~/.bashrc"
