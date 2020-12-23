import pandas as pd
from bs4 import BeautifulSoup
import pymongo
import requests
import logging
from logging import config
import os
import json
import schedule
import time
script_dir = os.path.dirname(__file__)
os.chdir(script_dir)
logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': True
})


def mongoConnection():
    with open('mongodbString.json') as f:
        connection = json.load(f)
        
    skiClient = pymongo.MongoClient(connection['con'])
    skiDb = skiClient['Shredata']
    snowTable = skiDb['snowreports']
    log.info('connected to mongo')
    return skiDb,skiClient,snowTable

def toMongo(df,table):
    df = df.to_dict('records')[0]
    table.insert_one(df)

def configureLog(file_name):
    
    l = logging.getLogger()
    l.setLevel(logging.INFO)
    if (l.hasHandlers()):
        l.handlers.clear()
        
    #stdout_handler
    stdout_handler = logging.StreamHandler()
    stdout_handler.setLevel('NOTSET')
        
    #file_handler
    file_handler = logging.FileHandler(file_name)
    file_handler.setLevel('NOTSET')
        
    
    file_format = logging.Formatter('[%(asctime)s] {%(filename)s:%(lineno)d} %(levelname)s - %(message)s')
    stdout_handler.setFormatter(file_format)
    file_handler.setFormatter(file_format)
    l.addHandler(stdout_handler)
    l.addHandler(file_handler)
    
    return l
    
#global logger here
log = configureLog(file_name='resorts.log')

def replace_keys(d,new_keys):
    return dict((new_keys[key], value) for (key, value) in d.items())

def get_sunshine(table=False):
    url = 'https://www.skibanff.com/api/data/snow-reports'
    r = requests.get(url)
    if r.status_code == 200:
        try:
            sunshine_json = r.json()
            processed = {}
            processed_values = {}
            for key,value in sunshine_json.items():
                if key in ['summary','updatedText','timestamp']:
                    processed[key] = [value]
                else:
                    processed_values[key] =value['metric']
            
            new_keys = {'overnight':'overnight',
                        'past24Hours':'past24Hours',
                        'historical':'past7Days',
                        'settledBase':'base',
                        'seasonTotal':'seasonTotal',
                        'village_temp':'village_temp'}
            
            processed_values = replace_keys(processed_values,new_keys)
            processed['values'] = [processed_values]
            processed['unit'] = ['metric']
            df = pd.DataFrame.from_dict(processed,orient='columns')
            df['Resort Name'] = 'Sunshine Village'
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.rename(columns={'timestamp':'updateTime','summary':'notes'})
            del df['updatedText']
            log.info('pulled sunshine data')
            if table != False:
                try:
                    toMongo(df,table)
                    log.info('Wrote Sunshine to mongo')
                except pymongo.errors.DuplicateKeyError:
                    log.warning('sunshine data already in database today')
                except Exception as e:
                    log.critical(e,exc_info=True)
                
        except Exception as e:
            log.critical(e,exc_info=True)
    else:
        log.warning('Bad request for sunshine snow report. Status code: '+str(r.status_code))
        df = None
    return df

def lake_louise(table=False):
    try:
        url = 'https://www.skilouise.com/snow-conditions/'
        r = requests.get(url)
        soup = BeautifulSoup(r.text, 'html.parser')
        classes = soup.find_all(class_="obj-content obj obj-holder-condition obj-holder-condition-table")
        upper = classes[0]
        processed = {}
        time = upper.find(class_="small d-block d-lg-inline").text.replace("|","")
        processed['notes'] = ""
        processed['updateTime'] = pd.to_datetime(time)
        values = upper.find_all(class_="obj-condition-col col-6 col-md-4 col-lg-3 col-xl-2")
        processed_values = {}
        for v in values:
            key = v.find(class_="obj-text d-block").text.strip()
            value = v.find(class_="strong mr-10 mr-over-10").text.strip()
            processed_values[key] = int(value)
        
        new_keys = {'Overnight':'overnight',
                    'Last 24 Hours':'past24Hours',
                    'Last 48 Hours':'past48Hours',
                    'Last 7 Days':'past7Days',
                    'Base':'base',
                    'This Season':'seasonTotal'}
        processed_values = replace_keys(processed_values, new_keys)
        processed['values'] = [processed_values]
        processed['unit'] = 'metric'
        processed['Resort Name'] = "Lake Louise"
        df = pd.DataFrame.from_dict(processed,orient='columns')
        log.info('pulled lake louise data')
        if table != False:
            try:
                toMongo(df,table)
                log.info('Wrote Lake Louise to mongo')
            except pymongo.errors.DuplicateKeyError:
                log.warning('lake louise data already in database today')
            except Exception as e:
                log.critical(e,exc_info=True)
    except Exception as e:
            log.critical(e,exc_info=True)
    return df


def scheduled_resorts():
    skiDb,skiClient,snowTable = mongoConnection()
    louise = lake_louise(snowTable)
    sunshine = get_sunshine(snowTable)
    skiClient.close()
    logging.shutdown()
    

if __name__ == "__main__":
    print('starting scheduled resorts')
    schedule.every().day.at("07:00").do(scheduled_resorts)
    while True:
        schedule.run_pending()
        time.sleep(1)
    
        
    