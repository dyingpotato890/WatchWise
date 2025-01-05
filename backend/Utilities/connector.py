import pymongo

class Connector:
    def __init__(self):
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = myclient["movierec"]
        
