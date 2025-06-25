# MTA Train Times and Weather Display

A real-time wall-mounted dashboard displaying NYC weather forecasts and MTA G train arrivals, designed for continuous display on monitors.

![Dashboard Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=Weather+%26+Transit+Dashboard)

### 🌤️ Weather Display
- **Current Weather**: Today's temperature, conditions, and precipitation chance
- **4-Day Forecast**: Extended weather outlook with icons and temperatures
- **Precipitation Chart**: 18-hour precipitation probability graph starting from current time
- **Automatic Updates**: Weather data refreshes every 30 minutes

### 🚇 MTA Transit (G Train)
- **Real-time Arrivals**: Live G train arrival times and delays
- **Service Alerts**: Current service disruptions and notifications
- **Auto-refresh**: Transit data updates every 29 seconds for real-time accuracy

### 📱 Display Optimization
- **Wall-Mounted Design**: Optimized for continuous display on monitors
- **Responsive Scaling**: Uses viewport units (vh/vw) to scale across different screen sizes
- **No Scrolling**: All content fits on one screen (1080p to 1440p tested)
- **Modern UI**: Clean, readable interface perfect for ambient displays

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI
- **Chart.js + react-chartjs-2** - Interactive precipitation charts
- **CSS Modules** - Scoped styling with viewport-based units

### APIs & Data Sources
- **Open-Meteo API** - Weather forecasts and precipitation data
- **MTA GTFS-RT** - Real-time subway arrival data
- **gtfs-realtime-bindings** - GTFS-RT protobuf parsing

### Architecture
- **Server-Side API Routes** - Next.js API endpoints for data fetching
- **Client-Side Components** - Real-time updates with separate refresh intervals
- **Error Handling** - Graceful degradation when APIs are unavailable

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Internet connection for API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mta-weather.git
   cd mta-weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Deployment
```bash
npm run build
npm start
```

## 📊 Data Sources & Updates

### Weather Data (Open-Meteo API)
- **Update Frequency**: Every 30 minutes
- **Data Points**: 
  - Current conditions and temperature
  - 5-day daily forecast
  - 18-hour precipitation probability
- **Coverage**: NYC area (40.7128°N, 74.0060°W)

### MTA Data (GTFS-RT)
- **Update Frequency**: Every 29 seconds
- **Line Coverage**: G train (Crosstown Local)
- **Data Points**:
  - Real-time arrival predictions
  - Service alerts and delays
  - Trip updates and cancellations

## 🏗️ Architecture Details

### Component Structure
```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.js    # Weather API endpoint
│   │   └── mta/route.js        # MTA GTFS-RT endpoint
│   ├── page.js                 # Main dashboard layout
│   └── page.module.css         # Viewport-based styling
├── components/
│   ├── WeatherForecast/        # Today + 4-day forecast
│   ├── Precip/                 # Precipitation chart
│   └── MTAArrivals/            # G train arrivals
```

### Key Implementation Features

**Viewport-Based Scaling**
- Uses `vh` and `vw` units for consistent scaling
- Layout fits 100vh height across different monitors
- Proportional text and spacing scaling

**Intelligent Refresh Intervals**
- Weather: 30-minute intervals (matches API update frequency)
- MTA: 29-second intervals (real-time transit requirements)
- Separate intervals prevent unnecessary API calls

**Error Handling**
- Graceful degradation when APIs fail
- User-friendly error messages
- Component-level error boundaries

**Time-Aware Data Processing**
- Precipitation charts start from current hour
- Handles timezone conversions automatically
- Smart current-hour detection in weather data

## 🎨 Display Configuration

### Recommended Setup
- **Monitor Size**: 24"+ for optimal readability
- **Resolution**: 1080p or 1440p (tested and optimized)
- **Orientation**: Landscape
- **Browser**: Chrome/Firefox in fullscreen mode
- **Auto-start**: Configure browser to open on system startup

### Layout Proportions
- **MTA Section**: 25% of screen height
- **Weather Container**: 75% of screen height
  - **Today's Weather**: ~60% of weather container
  - **4-Day Forecast**: ~40% of weather container
  - **Precipitation Chart**: 70% width of weather container

## 🔧 Customization

### Location Configuration
Update coordinates in `src/app/api/weather/route.js`:
```javascript
const lat = searchParams.get('lat') || '40.7128'; // Your latitude
const lon = searchParams.get('lon') || '-74.0060'; // Your longitude
```

### MTA Line Configuration  
Modify line group in `src/app/api/mta/route.js` for different subway lines:
```javascript
// Current: G train (Crosstown)
// Change URL for different line groups
```

### Refresh Intervals
Adjust in component `useEffect` hooks:
```javascript
// Weather: 30 minutes (1800000ms)
// MTA: 29 seconds (29000ms)
```

## 🐛 Troubleshooting

### Common Issues

**Weather data not loading**
- Check Open-Meteo API status
- Verify internet connection
- Check browser console for API errors

**MTA data unavailable**
- MTA GTFS-RT feeds occasionally have outages
- Check MTA service status
- Verify G train is running

**Display scaling issues**
- Ensure browser is in fullscreen mode
- Check monitor resolution settings
- Verify CSS viewport units are supported

## 📝 License

MIT License - feel free to use and modify for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on different screen sizes
5. Submit a pull request

## 📧 Support

For issues or questions, please open a GitHub issue with:
- Browser and version
- Monitor resolution
- Console error messages (if any)
- Description of the problem

---

*Built for NYC commuters who want to stay informed about weather and transit at a glance.* 🗽
