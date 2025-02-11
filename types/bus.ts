export interface VehicleLocation {
  Longitude: string;
  Latitude: string;
}

export interface MonitoredVehicleJourney {
  LineRef: string;
  DirectionRef: string;
  PublishedLineName: string;
  OperatorRef: string;
  OriginName: string;
  DestinationName: string;
  OriginAimedDepartureTime: string;
  DestinationAimedArrivalTime: string;
  VehicleLocation: VehicleLocation;
  VehicleRef: string;
}

export interface VehicleActivity {
  RecordedAtTime: string;
  ItemIdentifier: string;
  ValidUntilTime: string;
  MonitoredVehicleJourney: MonitoredVehicleJourney;
}

export interface BusInfo {
  recordedAt: string;
  id: string;
  validUntil: string;
  journey: {
    lineRef: string;
    direction: string;
    publishedName: string;
    operator: string;
    origin: string;
    destination: string;
    aimedDeparture: string;
    aimedArrival: string;
    location: {
      longitude: number;
      latitude: number;
    };
    vehicleRef: string;
  };
}

export interface BusResponse {
  buses: BusInfo[];
}

export type SortOption = 'arrival' | 'active' | 'none';

export interface FilterParams {
  route?: string;
  operator?: string;
  destination?: string;
  sort?: SortOption;
}

export type SearchParams = {
  page?: string;
  route?: string;
  operator?: string;
  active?: string;
};
