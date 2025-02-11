import { NextResponse } from "next/server";
import { XMLParser } from 'fast-xml-parser';
import type { BusInfo, BusResponse, VehicleActivity } from '@/types/bus';

const API_URL = 'https://data.bus-data.dft.gov.uk/api/v1/datafeed/9950/';

export async function GET() {
  try {
    const apiKey = process.env.DFT_BUS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const url = new URL(API_URL);
    url.searchParams.append('api_key', apiKey);

    const response = await fetch(url, {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      throw new Error(`DfT API responded with status: ${response.status}`);
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });
    
    const result = parser.parse(xmlData);
    
    // Extract vehicle activities from the XML
    const activities = result.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity as VehicleActivity[];
    
    const buses: BusInfo[] = activities.map((activity: VehicleActivity) => ({
      recordedAt: activity.RecordedAtTime,
      id: activity.ItemIdentifier,
      validUntil: activity.ValidUntilTime,
      journey: {
        lineRef: activity.MonitoredVehicleJourney.LineRef,
        direction: activity.MonitoredVehicleJourney.DirectionRef,
        publishedName: activity.MonitoredVehicleJourney.PublishedLineName,
        operator: activity.MonitoredVehicleJourney.OperatorRef,
        origin: activity.MonitoredVehicleJourney.OriginName,
        destination: activity.MonitoredVehicleJourney.DestinationName,
        aimedDeparture: activity.MonitoredVehicleJourney.OriginAimedDepartureTime,
        aimedArrival: activity.MonitoredVehicleJourney.DestinationAimedArrivalTime,
        location: {
          longitude: parseFloat(activity.MonitoredVehicleJourney.VehicleLocation.Longitude),
          latitude: parseFloat(activity.MonitoredVehicleJourney.VehicleLocation.Latitude),
        },
        vehicleRef: activity.MonitoredVehicleJourney.VehicleRef,
      }
    }));

    return NextResponse.json({ buses } satisfies BusResponse);

  } catch (error) {
    console.error('Failed to fetch bus data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bus data' },
      { status: 500 }
    );
  }
}
