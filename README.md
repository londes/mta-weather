# NYC Transit & Weather Display

A real-time wall-mounted dashboard displaying NYC weather forecasts and MTA subway arrivals, designed for continuous display on monitors with full customization options.

![Dashboard Screenshot](screenshot.png)

**🚀 [Live Demo](https://mta-weather.wilpur.me)**

## ✨ Features

### 🌤️ Weather Display
- **Current Weather**: Today's temperature, conditions, and precipitation chance
- **4-Day Forecast**: Extended weather outlook with icons and temperatures
- **Precipitation Chart**: 18-hour precipitation probability graph starting from current time
- **Automatic Updates**: Weather data refreshes every 30 minutes
- **Brooklyn Timezone**: All times displayed in Eastern Time (America/New_York)
- **Multi-Borough Support**: Weather data for all 5 NYC boroughs via ZIP code selection

### 🚇 MTA Transit
- **Multi-Line Support**: G Train (Crosstown) and L Train (14th Street-Canarsie)
- **Station Selection**: Choose from all stations on supported lines
- **Real-time Arrivals**: Live subway arrival times and delays
- **Service Alerts**: Current service disruptions and notifications
- **Auto-refresh**: Transit data updates every 29 seconds for real-time accuracy

### 🎨 Theme System
- **Light Mode**: Clean daytime interface with sky and clouds background
- **Dark Mode**: Starry night sky with 420+ twinkling stars
- **Auto Mode**: Automatically switches based on sunrise/sunset times
- **Persistent Settings**: Theme preferences saved across sessions

### ⚙️ Settings & Customization
- **Settings Page**: Full configuration interface accessible
- **Station Selection**: Choose your preferred subway line and station
- **Theme Control**: Manual theme selection or automatic day/night switching
- **Weather Location**: Select from predefined borough ZIP codes or enter custom ZIP code
- **Persistent Storage**: All settings saved to localStorage

### 📱 Display Optimization
- **Wall-Mounted Design**: Optimized for continuous display on monitors
- **Responsive Scaling**: Uses viewport units (vh/vw) to scale across different screen sizes
- **Mobile Support**: Vertical scrollable layout for mobile devices
- **No Scrolling**: Desktop content fits on one screen (1080p to 1440p tested)
- **Modern UI**: Clean, readable interface perfect for ambient displays

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI with Context API
- **Chart.js + react-chartjs-2** - Interactive precipitation charts
- **CSS Modules** - Scoped styling with CSS custom properties
- **React Router** - Navigation between dashboard and settings

### APIs & Data Sources
- **Open-Meteo API** - Weather forecasts, precipitation data, and sunrise/sunset times
- **MTA GTFS-RT** - Real-time subway arrival data for G and L trains
- **gtfs-realtime-bindings** - GTFS-RT protobuf parsing

### Architecture
- **Server-Side API Routes** - Next.js API endpoints for data fetching
- **Client-Side Components** - Real-time updates with separate refresh intervals
- **Context Providers** - Global state management for themes and station selection
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

5. **Access Settings**
   ```
   http://localhost:3000/settings
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
  - Sunrise/sunset times for auto theme switching
- **Coverage**: All 5 NYC boroughs with 30+ predefined ZIP codes
  - Manhattan, Brooklyn, Queens, Bronx, Staten Island
  - Custom ZIP code input for any location
- **Timezone**: America/New_York for accurate local times

### MTA Data (GTFS-RT)
- **Update Frequency**: Every 29 seconds
- **Line Coverage**: 
  - **G Train**: 8 stations (Court Square to Metropolitan Ave/Lorimer St)
  - **L Train**: 24 stations (8th Avenue to Canarsie-Rockaway Parkway)
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
│   ├── settings/
│   │   ├── page.js            # Settings page
│   │   └── settings.module.css # Settings styling
│   ├── page.js                 # Main dashboard layout
│   ├── page.module.css         # Viewport-based styling
│   ├── layout.js              # Root layout with providers
│   └── globals.css            # Global theme variables
├── components/
│   ├── WeatherForecast/        # Today + 4-day forecast
│   ├── Precip/                 # Precipitation chart
│   └── MTAArrivals/            # Subway arrivals
├── contexts/
│   ├── ThemeContext.js         # Theme state management
│   └── StationContext.js       # Station selection management
```

### Key Implementation Features

**Multi-Line Transit Support**
- Dynamic station mapping for G and L trains
- Configurable station selection via settings
- Persistent station preferences in localStorage

**Advanced Theme System**
- CSS custom properties for seamless theme switching
- Sunrise/sunset API integration for auto mode
- Animated backgrounds (stars for dark, clouds for light)
- Smooth transitions between themes

**Viewport-Based Scaling**
- Uses `vh` and `vw` units for consistent scaling
- Layout fits 100vh height across different monitors
- Proportional text and spacing scaling
- Mobile-responsive vertical layout

**Context-Driven State Management**
- ThemeContext for global theme state
- StationContext for subway line/station selection
- Persistent storage with localStorage
- Real-time updates across components

**Intelligent Refresh Intervals**
- Weather: 30-minute intervals (matches API update frequency)
- MTA: 29-second intervals (real-time transit requirements)
- Separate intervals prevent unnecessary API calls

**Enhanced Time Handling**
- Brooklyn timezone for all time calculations
- Precipitation charts start from current hour
- Sunrise/sunset-based auto theme switching
- Proper timezone handling for deployed environments

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

### Theme Backgrounds
- **Light Mode**: Subtle blue sky gradient with drifting white clouds
- **Dark Mode**: Deep space background with 420+ twinkling stars in multiple layers
- **Auto Mode**: Switches based on sunrise/sunset times from weather API

## 🔧 Customization

### Station Configuration
Use the settings page (`/settings`) to:
- Select subway line (G or L train)
- Choose your preferred station
- Configure theme preferences
- Set weather location by borough or custom ZIP code

### Weather Location Configuration
The app supports weather data for all NYC boroughs:

**Predefined Borough ZIP Codes:**
- **Manhattan**: 10009 (East Village), 10001 (Midtown), 10014 (West Village), 10019 (Hell's Kitchen), 10025 (Upper West Side), 10128 (Upper East Side)
- **Brooklyn**: 11222 (Greenpoint), 11211 (Williamsburg), 11215 (Park Slope), 11201 (Brooklyn Heights), 11226 (Flatbush), 11235 (Brighton Beach)
- **Queens**: 11367 (Flushing), 11101 (Long Island City), 11375 (Forest Hills), 11103 (Astoria), 11691 (Far Rockaway), 11385 (Ridgewood)
- **Bronx**: 10457 (Mount Hope), 10451 (Concourse), 10463 (Riverdale), 10458 (Fordham), 10467 (Norwood), 10461 (Westchester Square)
- **Staten Island**: 10314 (Sunnyside), 10301 (St. George), 10306 (Tottenville), 10312 (Annadale), 10304 (Stapleton), 10309 (Pleasant Plains)

**Custom ZIP Codes**: Enter any valid US ZIP code for weather data outside NYC.

### Location Configuration (Advanced)
For direct coordinate access, update in `src/app/api/weather/route.js`:
```javascript
const lat = searchParams.get('lat') || '40.7128'; // Your latitude
const lon = searchParams.get('lon') || '-74.0060'; // Your longitude
```

### Adding New Subway Lines
1. Update `stationMapping` in `src/contexts/StationContext.js`
2. Add station options in `src/app/settings/page.js`
3. Modify MTA API endpoint to handle new line feeds

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
- Verify selected subway line is running

**Settings not saving**
- Check browser localStorage permissions
- Clear browser cache and reload
- Verify JavaScript is enabled

**Display scaling issues**
- Ensure browser is in fullscreen mode
- Check monitor resolution settings
- Verify CSS viewport units are supported

**Theme not switching automatically**
- Check if auto mode is selected in settings
- Verify weather API is providing sunrise/sunset data
- Check browser console for theme-related errors

## 📱 Mobile Support

The app includes a mobile-responsive layout:
- Vertical scrollable interface
- Stacked train arrival times
- Compact weather sections
- Touch-friendly navigation

## 🔄 Recent Updates

- ✅ Multi-line support (G and L trains)
- ✅ Comprehensive settings page
- ✅ Advanced theme system with auto mode
- ✅ Station selection for all supported lines
- ✅ Enhanced backgrounds (stars and clouds)
- ✅ Improved timezone handling
- ✅ Mobile responsive design
- ✅ Context-based state management

## 📝 License

MIT License - feel free to use and modify for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Acknowledgments

- MTA for providing public GTFS-RT feeds
- Open-Meteo for free weather API access
- Chart.js for beautiful precipitation visualizations
