using Earthquakeapi.Models;
using Earthquakeapi.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EarthquakeApi.Services;

namespace Earthquakeapi.Services
{
    
    public class EarthquakeAlertService
    {
        public async Task<bool> ExistsAsync(string title, DateTime date)
        {
            var filter = Builders<EarthquakeAlert>.Filter.And(
                Builders<EarthquakeAlert>.Filter.Eq(a => a.Title, title),
                Builders<EarthquakeAlert>.Filter.Eq(a => a.Date, date)
            );

            var count = await _alertsCollection.CountDocumentsAsync(filter);
            return count > 0;
        }

        private readonly IMongoCollection<EarthquakeAlert> _alertsCollection;

        public EarthquakeAlertService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _alertsCollection = database.GetCollection<EarthquakeAlert>(mongoDbSettings.Value.AlertsCollectionName);
        }
        public async Task<List<EarthquakeAlert>> GetAllAsync()
        {
            return await _alertsCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<EarthquakeAlert>> GetAsync() =>
            await _alertsCollection.Find(_ => true).ToListAsync();

        public async Task CreateAsync(EarthquakeAlert alert) =>
            await _alertsCollection.InsertOneAsync(alert);
    }
}