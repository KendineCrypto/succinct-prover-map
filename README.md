# 🌍 Succinct Labs Prover Map

A beautiful, interactive 3D globe visualization for tracking Succinct Labs provers worldwide in real-time. Built with React, Three.js, and TypeScript.

![Prover Map Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-r152-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🌟 Interactive 3D Globe
- **Realistic Earth visualization** with custom pink texture
- **Smooth camera controls** with orbit, pan, and zoom
- **Optimized performance** with 25+ prover locations
- **Responsive design** for all devices

### 🎯 Prover Tracking
- **25 global prover locations** with real-time data
- **Interactive markers** with hover animations
- **Status indicators** (Active, Maintenance, Inactive)
- **Detailed prover information** (Location, IP, Uptime, etc.)

### 🎨 Beautiful Animations
- **Staggered entrance animations** for prover list
- **Dramatic hover effects** with color transitions
- **Smooth camera movements** with easing functions
- **Particle effects** and glow animations

### 📊 Data Visualization
- **Data transfer lines** between nearest neighbors
- **Animated light beams** from prover locations
- **Real-time connectivity visualization**
- **Optimized line rendering** for performance

### 🎮 User Experience
- **Interactive prover list** with search and filter
- **One-click navigation** to any prover location
- **Smooth transitions** and micro-interactions
- **Mobile-responsive** design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KendineCrypto/succinct-prover-map.git
cd succinct-prover-map
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 🎯 Usage

### Navigation
- **Mouse/Touch**: Rotate, pan, and zoom the globe
- **Click on markers**: View prover details and navigate to location
- **Top-right menu**: Browse all provers and filter by status
- **Keyboard**: Use arrow keys for camera controls

### Features
- **Hover over markers**: See dramatic color animations
- **Click prover list**: Navigate to any prover instantly
- **View details**: See uptime, location, and technical info
- **Real-time data**: Monitor prover status and performance

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0, TypeScript 5.0
- **3D Graphics**: Three.js r152, @react-three/fiber, @react-three/drei
- **Styling**: CSS3 with custom animations
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📁 Project Structure

```
succinct-prover-map/
├── public/                 # Static assets
│   ├── pink_earth_texture.jpg
│   └── index.html
├── src/
│   ├── components/         # React components
│   │   ├── Globe.tsx      # 3D Earth visualization
│   │   ├── ProverMarker.tsx # Interactive markers
│   │   └── ProverDetails.tsx # Modal details
│   ├── data/              # Data files
│   │   └── provers.json   # Prover locations
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── App.tsx           # Main application
├── package.json
└── README.md
```

## 🎨 Customization

### Adding New Provers
Edit `src/data/provers.json`:
```json
{
  "id": "prover-026",
  "name": "New Prover",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "country": "United States",
  "city": "New York",
  "uptime": 99.5,
  "startDate": "2024-03-01",
  "status": "active",
  "ip": "192.168.1.125"
}
```

### Customizing Colors
Modify CSS variables in `src/App.css`:
```css
:root {
  --primary-color: #FF69B4;
  --secondary-color: #FF1493;
  --accent-color: #FFB6C1;
}
```

## 🚀 Deployment

### GitHub Pages
1. Add to `package.json`:
```json
{
  "homepage": "https://KendineCrypto.github.io/succinct-prover-map",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Deploy:
```bash
npm run deploy
```

### Netlify/Vercel
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Succinct Labs** for the prover network concept
- **Three.js community** for 3D graphics inspiration
- **React Three Fiber** for React integration
- **Create React App** for the development environment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/KendineCrypto/succinct-prover-map/issues)
- **Discussions**: [GitHub Discussions](https://github.com/KendineCrypto/succinct-prover-map/discussions)
- **Email**: your.email@example.com

---

⭐ **Star this repository if you found it helpful!**
