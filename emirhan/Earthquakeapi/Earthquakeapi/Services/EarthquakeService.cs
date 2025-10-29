using System.Net.Http.Json;
using EarthquakeApi.Models;

namespace EarthquakeApi.Services;

public class EarthquakeService
{
    private readonly HttpClient _httpClient;

    public EarthquakeService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Earthquake>> GetEarthquakesAsync()
    {
        var result = await _httpClient.GetFromJsonAsync<KandilliResponse>("https://api.orhanaydogdu.com.tr/deprem/kandilli/live");
        return result?.Result ?? new List<Earthquake>();
    }

    private class KandilliResponse
    {
        public List<Earthquake> Result { get; set; }
    }
}