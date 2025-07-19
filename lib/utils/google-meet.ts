import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

export async function generateMeetLink(startTime: Date, endTime: Date, title: string): Promise<string> {
  try {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri;
    if (!meetLink) {
      throw new Error('Failed to generate Google Meet link');
    }

    return meetLink;
  } catch (error) {
    console.error('Error generating Google Meet link:', error);
    // For development/testing, return a mock link if Google Meet integration fails
    if (process.env.NODE_ENV !== 'production') {
      return `https://meet.google.com/mock-${Math.random().toString(36).substring(7)}`;
    }
    throw error;
  }
} 