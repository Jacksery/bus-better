import { VehicleActivity } from '../types/busTypes';
import { XMLParser } from 'fast-xml-parser';

export interface BusData {
    id: string;
    routeNumber: string;
    currentLocation: {
        lat: number;
        lng: number;
    };
    origin: string;
    destination: string;
    scheduledDeparture: string;
    scheduledArrival: string;
    operator: string;
    direction: string;
    recordedAt: string;
    expectedDeparture: string;
    lastUpdated: string;
    vehicleId: string;
}

export async function getBusData(): Promise<BusData[]> {
    try {
        const response = await fetch('/api/buses', {
            cache: 'no-cache',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlData = await response.text();

        if (!xmlData || xmlData.trim() === '') {
            throw new Error('Received empty response from API');
        }

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
        });

        const result = parser.parse(xmlData);

        if (!result?.Siri?.ServiceDelivery?.VehicleMonitoringDelivery?.VehicleActivity) {
            console.warn('No vehicle activity data found in response');
            return [];
        }

        const vehicles: VehicleActivity[] = Array.isArray(result.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity)
            ? result.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
            : [result.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity];

        return vehicles.map((vehicle): BusData => ({
            id: vehicle.ItemIdentifier,
            routeNumber: String(vehicle.MonitoredVehicleJourney.PublishedLineName),
            currentLocation: {
                lat: parseFloat(vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude),
                lng: parseFloat(vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude),
            },
            origin: vehicle.MonitoredVehicleJourney.OriginName,
            destination: vehicle.MonitoredVehicleJourney.DestinationName,
            scheduledDeparture: vehicle.MonitoredVehicleJourney.OriginAimedDepartureTime,
            scheduledArrival: vehicle.MonitoredVehicleJourney.DestinationAimedArrivalTime,
            operator: vehicle.MonitoredVehicleJourney.OperatorRef,
            direction: vehicle.MonitoredVehicleJourney.DirectionRef,
            recordedAt: vehicle.RecordedAtTime,
            expectedDeparture: vehicle.MonitoredVehicleJourney.MonitoredCall?.ExpectedDepartureTime ||
                vehicle.MonitoredVehicleJourney.OriginAimedDepartureTime,
            lastUpdated: vehicle.RecordedAtTime,
            vehicleId: vehicle.MonitoredVehicleJourney.VehicleRef,
        }));
    } catch (error) {
        console.error('Error fetching bus data:', error);
        throw error; // Re-throw to handle in the component
    }
}
