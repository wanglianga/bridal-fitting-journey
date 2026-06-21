/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ivory: {
          50: "#FFFEF9",
          100: "#FEF9EF",
          200: "#FDF3DF",
          300: "#FBEAC9",
          400: "#F8DFAE",
          500: "#F5D392",
        },
        rose: {
          gold: "#B76E79",
          "gold-light": "#D4A5AB",
          "gold-dark": "#8B4F59",
        },
        champagne: {
          DEFAULT: "#D4AF37",
          light: "#E6C86A",
          dark: "#A8892C",
        },
        mist: {
          purple: "#B8A9C9",
          "purple-light": "#D5CCE0",
          "purple-dark": "#9B8BB0",
        },
        espresso: {
          DEFAULT: "#3E2723",
          light: "#5D4037",
          dark: "#1B0E0C",
        },
        silk: {
          DEFAULT: "#F5F0EB",
          light: "#FAF8F5",
          dark: "#E8E0D8",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        elegant: "0 4px 20px rgba(62, 39, 35, 0.08)",
        "elegant-lg": "0 8px 40px rgba(62, 39, 35, 0.12)",
        "elegant-xl": "0 16px 60px rgba(62, 39, 35, 0.15)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      },
      borderRadius: {
        elegant: "12px",
        "elegant-lg": "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-down": "fadeInDown 0.8s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "silk-texture": "linear-gradient(135deg, #FAF8F5 0%, #F5F0EB 50%, #FAF8F5 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5D392 50%, #D4AF37 100%)",
        "rose-gradient": "linear-gradient(135deg, #B76E79 0%, #D4A5AB 100%)",
        "mist-gradient": "linear-gradient(135deg, #B8A9C9 0%, #D5CCE0 100%)",
        "ivory-gradient": "linear-gradient(180deg, #FFFEF9 0%, #FEF9EF 100%)",
      },
    },
  },
  plugins: [],
};
