import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, MapPin, Users, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StaticQRCode() {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const qrCodeValue = 'http://locahost:5173/tech-guru-meetup-2025/feedback';

  // Simulate QR code scan detection
  const handleScanStart = () => {
    setIsScanning(true);
    // Simulate processing time before navigation
    setTimeout(() => {
      navigate('/feedback');
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Tech Guru Meetup 2025
          </h1>
          <p className="text-xl text-muted-foreground">
            Where Innovation Meets Community
          </p>
        </div>

        {/* Event Details Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Date</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">March 15-17, 2025</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Tech Hub Convention Center</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Attendees</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">500+ Tech Enthusiasts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Sessions</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">40+ Tech Talks</p>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section with Loading State */}
        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-center md:text-2xl">
              {isScanning ? 'Redirecting to Feedback Form...' : 'Share Your Experience'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative flex justify-center">
              {isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="space-y-4 text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                    <p className="text-sm font-medium text-purple-600">Processing QR Code...</p>
                  </div>
                </div>
              ) : null}
              <div 
                onClick={handleScanStart}
                className="transition-transform cursor-pointer hover:scale-105"
              >
                <QRCodeSVG 
                  value={qrCodeValue} 
                  size={256}
                  level="H"
                  className="p-2 bg-white rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">
                {isScanning 
                  ? "Please wait while we direct you to the feedback form..."
                  : "Scan the QR code to share your feedback and help us improve future events"
                }
              </p>
              {!isScanning && (
                <p className="text-sm text-purple-600">
                  Your insights shape the future of tech communities
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StaticQRCode;