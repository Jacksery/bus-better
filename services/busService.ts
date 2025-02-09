import { VehicleActivity } from '../types/busTypes';
import { XMLParser } from 'fast-xml-parser';
import { addRandomOffset } from '../utils/timeUtils';

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

function isActiveBus(scheduledDeparture: string, scheduledArrival: string): boolean {
    const now = new Date().getTime();
    const departure = new Date(scheduledDeparture).getTime();
    const arrival = new Date(scheduledArrival).getTime();
    return departure <= now && now <= arrival;
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

        const busData = vehicles.map((vehicle): BusData => {
            const scheduledDeparture = vehicle.MonitoredVehicleJourney.OriginAimedDepartureTime;
            const scheduledArrival = vehicle.MonitoredVehicleJourney.DestinationAimedArrivalTime;

            // Only apply delay if the bus is active
            const expectedDeparture = isActiveBus(scheduledDeparture, scheduledArrival)
                ? addRandomOffset(scheduledDeparture, vehicle.ItemIdentifier)
                : scheduledDeparture;

            return {
                id: vehicle.ItemIdentifier,
                routeNumber: String(vehicle.MonitoredVehicleJourney.PublishedLineName),
                currentLocation: {
                    lat: parseFloat(vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude),
                    lng: parseFloat(vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude),
                },
                origin: vehicle.MonitoredVehicleJourney.OriginName,
                destination: vehicle.MonitoredVehicleJourney.DestinationName,
                scheduledDeparture,
                scheduledArrival,
                operator: vehicle.MonitoredVehicleJourney.OperatorRef,
                direction: vehicle.MonitoredVehicleJourney.DirectionRef,
                recordedAt: vehicle.RecordedAtTime,
                expectedDeparture,
                lastUpdated: vehicle.RecordedAtTime,
                vehicleId: vehicle.MonitoredVehicleJourney.VehicleRef,
            };
        });

        return busData;

    } catch (error) {
        console.error('Error fetching bus data:', error);
        throw error; // Re-throw to handle in the component
    }
}
