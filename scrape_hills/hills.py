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
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}


def mongoConnection():
    with open('mongodbString.json') as f:
        connection = json.load(f)
        
    skiClient = pymongo.MongoClient(connection['con'])
    skiDb = skiClient['Shredata']
    snowTable = skiDb['snowreports']
    log.info('connected to mongo')
    return skiDb,skiClient,snowTable

def toMongo(df,table,dtype='df'):
    if dtype == 'df':
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

def revelstoke(db_table):
    url = 'https://www.revelstokemountainresort.com/conditions/printable-avalanche-report'
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        try:
            soup = BeautifulSoup(r.text, 'html.parser')
            table = soup.find(class_="snow-report-table")
            date = soup.find(class_="timestamp futurabold").text
            date = ",".join(date.split("-")[-1].split(',')[1:])
            date = pd.to_datetime(date.strip())
            df = pd.read_html(str(table))[0]
            df.columns = df.iloc[0]
            df = df[1:]
            df = df[~df['Base Depth'].isnull()]
            df = df[:1]
            df = df[['New Snow (reset at 3pm)', '24h Snow', '7 Day Snow', 'Season Total','Base Depth']]
            for col in df.columns:
                df[col] = [int(x.replace('cm','').strip()) for x in df[col]]
            df = df.rename(columns={'24h Snow':'past24Hours','7 Day Snow':'past7Days','Season Total':'seasonTotal','Base Depth':'base'})
            values = {}
            for col in df.columns:
                values[col] = list(df[col])[0]
            
            processed = {}
            processed['unit'] = 'metric'
            processed['updateTime'] = date
            processed['Resort Name'] = "Revelstoke"
            processed['values'] = values
            log.info('pulled revelstoke data')
            if db_table != False:
                try:
                    toMongo(processed,db_table,'dict')
                    log.info('Wrote revelstoke to mongo')
                except pymongo.errors.DuplicateKeyError:
                    log.warning('revelstoke data already in database today')
                except Exception as e:
                    log.critical(e,exc_info=True)
        except Exception as e:
            processed = None
            log.critical(e,exc_info=True)
    else:
        log.error('cant connect to revelstoke website. Error Code: '+str(r.status_code))
            
    return processed

def panorama(table):
    url = 'https://www.panoramaresort.com/panorama-today/daily-snow-report/'
    r = requests.get(url,headers=headers)
    if r.status_code == 200:
        soup = BeautifulSoup(r.text, 'html.parser')
        report = soup.find_all(class_="grid-x grid-margin-x margin-bottom-1")
        time = soup.find_all("h5",class_="margin-bottom-2")
        for t in time:
            if "Updated" in t.text.strip():
                formatted_time = t.text.strip()
                formatted_time = formatted_time.replace('Updated at','').strip()
                formatted_time = pd.to_datetime(formatted_time)
            else:
                formatted_time = None
                
        values = report[-1].find_all(class_="small-4 cell summary-facilities__stat margin-bottom-1")
        processed_values = {}
        for v in values:
            key = v.find(class_='xsmall text-uppercase lspace').text.strip()
            value = v.find(class_='margin-bottom-0').text.strip()
            processed_values[key] = int(value.replace('cm',''))
            
        new_keys = {'Overnight':'overnight',
                    '24 Hours':'past24Hours',
                    '48 Hours':'past48Hours',
                    '7 Days':'past7Days',
                    'Season':'seasonTotal'}
        processed_values = replace_keys(processed_values, new_keys)
        processed = {}
        processed['Resort Name'] = "Panorama"
        processed['unit'] = 'metric'
        processed['values'] = processed_values
        processed['updateTime'] = formatted_time
        if table != False:
            try:
                toMongo(processed,table,'dict')
                log.info('Wrote panorama to mongo')
            except pymongo.errors.DuplicateKeyError:
                log.warning('sunshine data already in database today')
            except Exception as e:
                log.critical(e,exc_info=True)
    return processed


def scheduled_resorts():
    skiDb,skiClient,snowTable = mongoConnection()
    louise = lake_louise(snowTable)
    sunshine = get_sunshine(snowTable)
    rev = revelstoke(snowTable)
    pan = panorama(snowTable)
    skiClient.close()
    logging.shutdown()
    
def existing_resorts():
    skiDb,skiClient,snowTable = mongoConnection()
    print(skiDb.list_collection_names())
    resorts = skiDb['resorts']
    all_resorts = resorts.find({})
    for r in all_resorts:
        print(r)
    skiClient.close()
    

if __name__ == "__main__":    
    print('starting scheduled resorts')
    schedule.every().day.at("07:00").do(scheduled_resorts)
    while True:
        schedule.run_pending()
        time.sleep(1)
    
#%%

    