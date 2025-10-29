using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Earthquakeapi.Models
{
    public class EarthquakeAlert
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string Title { get; set; } = string.Empty;
        public double Magnitude { get; set; }
        public DateTime Date { get; set; }
        public bool IsDangerous { get; set; }
        public string ClosestLocationName { get; set; } = string.Empty;

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}