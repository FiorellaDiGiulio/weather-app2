import { weatherApi } from "./weatherApi.js";

global.fetch = jest.fn();

describe("weatherApi", () => {

  afterEach(() => {
    fetch.mockClear();
  });

  test("returnerar korrekt strukturerat väderobjekt", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        weather: {
          temperature: 12.6,
          windspeed: 4,
          wmo_code: 3
        },
        timestamp: "2025-01-01T10:00"
      })
    });

    const result = await weatherApi(63, 20);

    expect(result.main.temp).toBe(13);
    expect(result.weather[0].code).toBe(3);
  });

  test("returnerar null vid API-fel", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    const result = await weatherApi(0, 0);
    expect(result).toBeNull();
  });

});
