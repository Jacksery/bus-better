export interface VehicleLocation {
    Latitude: string;
    Longitude: string;
}

export interface MonitoredVehicleJourney {
    PublishedLineName: string;
    VehicleLocation: VehicleLocation;
    OriginName: string;
    DestinationName: string;
    OriginAimedDepartureTime: string;
    DestinationAimedArrivalTime: string;
    OperatorRef: string;
    DirectionRef: string;
    VehicleRef: string;
    MonitoredCall?: {
        ExpectedDepartureTime?: string;
    };
}

export interface VehicleActivity {
    ItemIdentifier: string;
    MonitoredVehicleJourney: MonitoredVehicleJourney;
    RecordedAtTime: string;
}
