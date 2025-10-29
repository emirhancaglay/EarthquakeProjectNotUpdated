
namespace EarthquakeApi.Models;
public class GeoJson
{
    public string Type { get; set; }  // Örneğin: "Point"
    public double[] Coordinates { get; set; }  // [longitude, latitude]
}
public class Earthquake
{
    public string Date { get; set; }
    public string Title { get; set; }
    public double Mag { get; set; }
    public double Depth { get; set; }
    public GeoJson Geojson { get; set; }
    public bool IsDangerous => Mag >= 2.5;

    public string? ClosestLocationName
    {
        get
        {
            if (string.IsNullOrEmpty(Title)) return null;

            // Örnek olarak: "Malatya 5.3" -> "Malatya"
            var parts = Title.Split(' ');
            return parts.Length > 1 ? parts[0] : Title;
        }
    }   
}