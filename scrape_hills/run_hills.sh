
#!/bin/bash
eval "$(conda shell.bash hook)"
conda activate snowfall_env
python scrape_hills/hills.py