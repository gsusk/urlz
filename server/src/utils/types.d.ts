declare module 'location-from-ip' {
  type Geolocation = {
    continent: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    zip: string;
    timezone: string;
    local_time: string;
    local_time_unix: Date;
    is_dst: boolean;
  };

  export function ipToGeolocation(ip: string): Promise<Geolocation>;
}
