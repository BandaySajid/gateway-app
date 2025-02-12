import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  particleCount?: number;
  colors?: string[];
}

interface Particle {
  radius: number;
  x: number;
  y: number;
  color: string;
  speedx: number;
  speedy: number;
  move: () => void;
}

const NodeAnimation: React.FC<CanvasProps> = ({ particleCount = 35, colors = ["#aaaaaa", "#aaaaaa", "#aaaaaa", "#aaaaaa"] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let context = canvas.getContext('2d');

    if (!context) return;

    // Polyfill for requestAnimationFrame
    (window as any).requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        (window as any).webkitRequestAnimationFrame ||
        (window as any).mozRequestAnimationFrame ||
        (window as any).oRequestAnimationFrame ||
        (window as any).msRequestAnimationFrame ||
        function (callback: FrameRequestCallback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    // Get DPI
    let dpi = window.devicePixelRatio || 1;

    // Fix DPI and scale the canvas
    const fixDpi = () => {
      if (!canvas) return;
      let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
      let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

      canvas.setAttribute('height', (style_height * dpi).toString());
      canvas.setAttribute('width', (style_width * dpi).toString());
    };

    fixDpi();
    context.scale(dpi, dpi);

    let particles: Particle[] = [];

    function Particle(this: Particle): void {
      this.radius = Math.round((Math.random() * 3) + 1);
      this.x = Math.floor((Math.random() * ((+(canvas ? getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) : 0) * dpi) - this.radius + 1) + this.radius));
      this.y = Math.floor((Math.random() * ((+(canvas ? getComputedStyle(canvas).getPropertyValue("height").slice(0, -2) : 0) * dpi) - this.radius + 1) + this.radius));
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedx = Math.round((Math.random() * 201) + 0) / 100;
      this.speedy = Math.round((Math.random() * 201) + 0) / 100;

      switch (Math.round(Math.random() * colors.length)) {
        case 1:
          this.speedx *= 1;
          this.speedy *= 1;
          break;
        case 2:
          this.speedx *= -1;
          this.speedy *= 1;
          break;
        case 3:
          this.speedx *= 1;
          this.speedy *= -1;
          break;
        case 4:
          this.speedx *= -1;
          this.speedy *= -1;
          break;
      }

      this.move = () => {
        if (!context) return;
        context.beginPath();
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = this.color;
        context.globalAlpha = 1;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();

        this.x = this.x + this.speedx;
        this.y = this.y + this.speedy;

        if (this.x <= 0 + this.radius) {
          this.speedx *= -1;
        }
        if (canvas && this.x >= canvas.width - this.radius) {
          this.speedx *= -1;
        }
        if (this.y <= 0 + this.radius) {
          this.speedy *= -1;
        }
        if (canvas && this.y >= canvas.height - this.radius) {
          this.speedy *= -1;
        }

        for (var j = 0; j < particleCount; j++) {
          var particleActuelle = particles[j],
            yd = particleActuelle.y - this.y,
            xd = particleActuelle.x - this.x,
            d = Math.sqrt(xd * xd + yd * yd);

          if (d < 200) {
            if (!context) return;
            context.beginPath();
            context.globalAlpha = (200 - d) / (200 - 0);
            context.globalCompositeOperation = 'destination-over';
            context.lineWidth = 1;
            context.moveTo(this.x, this.y);
            context.lineTo(particleActuelle.x, particleActuelle.y);
            context.strokeStyle = this.color;
            context.lineCap = "round";
            context.stroke();
            context.closePath();
          }
        }
      };
    }

    particles = [];
    for (let i = 0; i < particleCount; i++) {
      fixDpi();
      let particle = new (Particle as any)();
      particles.push(particle);
    }

    function animate() {
      fixDpi();
      if(canvas) {
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
      for (let i = 0; i < particleCount; i++) {
        particles[i].move();
      }
      (window as any).requestAnimFrame(animate);
    }

    animate();

    return () => {
      // Cleanup function (optional)
      // Cancel any ongoing animations or intervals here
    };
  }, [particleCount, colors]);

  return <canvas id="canvas" className='fixed w-full h-full z-1' style={{ backgroundRepeat: 'repeat' }} ref={canvasRef} />;
};

export default NodeAnimation;