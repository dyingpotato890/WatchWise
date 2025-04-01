import pymongo
import os

class Connector:
    def __init__(self):
        self.client = pymongo.MongoClient(os.getenv("MONGO_CONN"))
        self.db = self.client["WatchWise"]
